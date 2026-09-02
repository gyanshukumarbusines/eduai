require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const { Pool } = require("pg");
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
const DB_FILE = process.env.DB_FILE || "db.json";
const CF_URL = process.env.CF_URL;
const CF_TOKEN = process.env.CF_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

let dbCache = null;
let dbWriteQueue = Promise.resolve();

function getDefaultDB() {
  return {
    users: [],
    scores: [],
    exams: [],
    studyTime: [],
    quizAttempts: [],
    enrollments: []
  };
}

function readLocalDB() {
  if (!fs.existsSync(DB_FILE)) {
    const data = getDefaultDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return data;
  }

  const db = JSON.parse(fs.readFileSync(DB_FILE));
  if (!db.users) db.users = [];
  if (!db.scores) db.scores = [];
  if (!db.exams) db.exams = [];
  if (!db.studyTime) db.studyTime = [];
  if (!db.quizAttempts) db.quizAttempts = [];
  if (!db.enrollments) db.enrollments = [];

  return db;
}

function readDB() {
  return dbCache || readLocalDB();
}

function writeDB(data) {
  dbCache = data;

  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

  dbWriteQueue = dbWriteQueue
    .then(() =>
      pool.query(
        `INSERT INTO eduai_state (id, data)
         VALUES (1, $1::jsonb)
         ON CONFLICT (id)
         DO UPDATE SET data = EXCLUDED.data`,
        [JSON.stringify(data)]
      )
    )
    .catch((err) => {
      console.error("Neon database write failed:", err.message);
    });
}

async function loadDBFromNeon() {
  try {
    const result = await pool.query(
      "SELECT data FROM eduai_state WHERE id = 1"
    );

    if (result.rows.length > 0) {
      dbCache = result.rows[0].data;
      console.log("✅ EduAI data loaded from Neon");
    } else {
      dbCache = readLocalDB();

      await pool.query(
        `INSERT INTO eduai_state (id, data)
         VALUES (1, $1::jsonb)
         ON CONFLICT (id)
         DO UPDATE SET data = EXCLUDED.data`,
        [JSON.stringify(dbCache)]
      );

      console.log("✅ Local data copied to Neon");
    }
  } catch (err) {
    console.error("❌ Neon database load failed:", err.message);
    dbCache = readLocalDB();
  }
}

function genToken(id) { return crypto.createHash("sha256").update(id + "secret2026").digest("hex"); }

function firstNonEmpty(...vals) {
  for (const v of vals) {
    if (typeof v === "string" && v.length > 0) return v;
    if (Array.isArray(v) && v.length > 0) return v;
  }
  return "";
}
async function callAI(messages, maxTokens) {
  const models = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
  ];

  const systemMessage = messages.find(
    m => m.role === "system"
  );

  const contents = messages
    .filter(m => m.role !== "system")
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: String(m.content || "")
        }
      ]
    }));

  const body = {
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens || 4096,
      temperature: 0.7
    }
  };

  if (systemMessage) {
    body.systemInstruction = {
      parts: [
        {
          text: String(systemMessage.content || "")
        }
      ]
    };
  }

  let lastError = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(
          `[AI CALL] Model: ${model}, Attempt: ${attempt}/3`
        );

        const url =
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY
          },
          body: JSON.stringify(body)
        });

        const rawText = await response.text();

        console.log(
          `[AI CALL] HTTP STATUS: ${response.status} ${response.statusText}`
        );

        console.log(
          "[AI RAW RESPONSE]",
          rawText.substring(0, 2000)
        );

        let data = null;

        try {
          data = JSON.parse(rawText);
        } catch (parseError) {
          lastError = new Error(
            `Gemini returned invalid JSON: ${rawText.substring(0, 500)}`
          );

          if (attempt < 3) {
            const delay = attempt * 2000;

            console.log(
              `[AI CALL] Invalid JSON. Retrying in ${delay}ms...`
            );

            await new Promise(resolve =>
              setTimeout(resolve, delay)
            );

            continue;
          }

          break;
        }

        if (response.ok) {
          const text =
            data?.candidates?.[0]?.content?.parts
              ?.map(p => p?.text || "")
              .join("") || "";

          if (text.trim()) {
            console.log(
              `[AI CALL] Success using ${model}`
            );

            // IMPORTANT:
            // Return an object because the rest of your
            // server uses result.text
            return {
              text,
              raw: data,
              model,
            };
          }

          lastError = new Error(
            "Gemini returned an empty response."
          );

          console.log(
            `[AI CALL] ${model} returned empty response.`
          );
        } else {
          const errorMessage =
            data?.error?.message ||
            `Gemini HTTP ${response.status}: ${rawText}`;

          lastError = new Error(errorMessage);

          console.error(
            `[AI CALL] ${model} error:`,
            errorMessage
          );

          // Retry temporary/server-capacity errors
          if ([429, 500, 502, 503, 504].includes(response.status)) {
            if (attempt < 3) {
              const delay = attempt * 2000;

              console.log(
                `[AI CALL] Temporary error. Retrying in ${delay}ms...`
              );

              await new Promise(resolve =>
                setTimeout(resolve, delay)
              );

              continue;
            }

            console.log(
              `[AI CALL] ${model} failed after 3 attempts. Trying fallback model...`
            );

            break;
          }

          // Permanent errors:
          // 400, 401, 403, 404 etc.
          console.log(
            `[AI CALL] Permanent error ${response.status}. Trying next model...`
          );

          break;
        }
      } catch (error) {
        lastError = error;

        console.error(
          "[AI FETCH ERROR]",
          error.message
        );

        if (attempt < 3) {
          const delay = attempt * 2000;

          console.log(
            `[AI CALL] Network error. Retrying in ${delay}ms...`
          );

          await new Promise(resolve =>
            setTimeout(resolve, delay)
          );

          continue;
        }
      }
    }
  }

  throw lastError || new Error("AI service unavailable.");
}
app.post("/api/register", (req, res) => {
  const { name, email, password, role = "student", subjects, studentClass, section, stream, sciencePart } = req.body;
  const db = readDB();
  if (db.users.find(u => u.email === email)) return res.json({ error: "Email already registered" });
  const user = {
    id: Date.now().toString(),
    name, email,
    password: crypto.createHash("sha256").update(password).digest("hex"),
    role,
    subjects: role === "teacher" ? (subjects || []) : undefined,
    studentClass: role === "student" ? (studentClass || null) : undefined,
    section: role === "student" ? (section || null) : undefined,
    stream: role === "student" && ["11","12"].includes(String(studentClass)) ? (stream || null) : undefined,
    sciencePart: role === "student" && stream === "Science" ? (sciencePart || null) : undefined,
    streak: 0
  };
  db.users.push(user);
  writeDB(db);
  res.json({
    success: true,
    token: genToken(user.id),
    user: { id: user.id, name: user.name, email: user.email, role: user.role, subjects: user.subjects, studentClass: user.studentClass, section: user.section, stream: user.stream, sciencePart: user.sciencePart }
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email && u.password === crypto.createHash("sha256").update(password).digest("hex"));
  if (!user) return res.json({ error: "Invalid email or password" });
  res.json({
    success: true,
    token: genToken(user.id),
    user: { id: user.id, name: user.name, email: user.email, role: user.role, subjects: user.subjects, studentClass: user.studentClass, section: user.section, stream: user.stream, sciencePart: user.sciencePart }
  });
});

app.post("/api/quiz-attempt", (req, res) => {
  try {
    const db = readDB();
    const entry = { id: Date.now().toString(), ...req.body, date: new Date().toISOString() };
    db.quizAttempts.push(entry);
    writeDB(db);
    res.json({ success: true, entry });
  } catch(e) { res.json({ error: e.message }); }
});

app.get("/api/quiz-attempts/:userId", (req, res) => {
  const db = readDB();
  res.json({ attempts: db.quizAttempts.filter(a => a.userId === req.params.userId) });
});

app.post("/api/enroll", (req, res) => {
  try {
    const db = readDB();
    const { userId, courseTitle } = req.body;
    if (!userId || !courseTitle) return res.json({ error: "userId and courseTitle required" });
    const already = db.enrollments.find(e => e.userId === userId && e.courseTitle === courseTitle);
    if (already) return res.json({ success: true, alreadyEnrolled: true });
    db.enrollments.push({ id: Date.now().toString(), userId, courseTitle, date: new Date().toISOString() });
    writeDB(db);
    res.json({ success: true });
  } catch(e) { res.json({ error: e.message }); }
});

app.get("/api/enrollments/:userId", (req, res) => {
  const db = readDB();
  res.json({ enrollments: db.enrollments.filter(e => e.userId === req.params.userId) });
});

app.post("/api/scores", (req, res) => {
  const db = readDB();
  const body = req.body || {};
  const totalMarks = body.totalMarks || 100;
  const score = body.score || 0;
  const percentage = body.percentage != null ? body.percentage : Math.round((score / totalMarks) * 100);
  const entry = { id: Date.now().toString(), ...body, percentage, date: new Date().toISOString() };
  db.scores.push(entry);
  writeDB(db);
  res.json({ success: true, entry });
});

app.get("/api/scores/:userId", (req, res) => {
  const db = readDB();
  res.json({ scores: db.scores.filter(s => s.userId === req.params.userId) });
});

app.get("/api/leaderboard", (req, res) => {
  const db = readDB();
  const subjectFilter = (req.query.subject || "").trim();
  const board = db.users.map(u => {
    let scores = db.scores.filter(s => s.userId === u.id);
    if (subjectFilter && subjectFilter.toLowerCase() !== "overall") {
      scores = scores.filter(s => (s.subject || "").trim().toLowerCase() === subjectFilter.toLowerCase());
    }
    const avg = scores.length ? Math.round(scores.reduce((a, s) => a + (s.percentage||0), 0) / scores.length) : 0;
    return { id: u.id, name: u.name, role: u.role, avgScore: avg, examsCount: scores.length, streak: u.streak || 0, studentClass: u.studentClass, section: u.section, stream: u.stream, sciencePart: u.sciencePart };
  }).filter(u => u.role === "student" && (!subjectFilter || subjectFilter.toLowerCase() === "overall" || u.examsCount > 0)).sort((a, b) => b.avgScore - a.avgScore);
  res.json({ leaderboard: board });
});

app.get("/api/teachers", (req, res) => {
  const db = readDB();
  res.json({ teachers: db.users.filter(u => u.role === "teacher").map(u => ({ name: u.name, email: u.email, subjects: u.subjects || [] })) });
});

app.post("/api/save-exam", (req, res) => {
  try {
    const db = readDB();
    const exam = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
    db.exams.push(exam);
    writeDB(db);
    console.log("[EXAM SAVED]", exam.title, exam.questions?.length, "questions");
    res.json({ success: true, exam });
  } catch(e) { res.json({ error: e.message }); }
});

app.get("/api/exams", (req, res) => {
  const db = readDB();
  res.json({ exams: db.exams });
});

app.delete("/api/exams/:id", (req, res) => {
  try {
    const db = readDB();
    db.exams = db.exams.filter(e => e.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
  } catch(e) { res.json({ error: e.message }); }
});

app.post("/api/study-time", (req, res) => {
  try {
    const db = readDB();
    const { userId, subject, minutes } = req.body;
    if (!userId || !minutes) return res.json({ error: "userId and minutes required" });
    const entry = { id: Date.now().toString(), userId, subject: subject || "General", minutes, date: new Date().toISOString() };
    db.studyTime.push(entry);
    writeDB(db);
    res.json({ success: true, entry });
  } catch(e) { res.json({ error: e.message }); }
});

app.get("/api/study-time/:userId", (req, res) => {
  const db = readDB();
  res.json({ entries: db.studyTime.filter(e => e.userId === req.params.userId) });
});

app.post("/api/chat", async (req, res) => {
  try {
    const result = await callAI(req.body.messages, req.body.max_tokens || 1024);
    console.log("[CHAT]", result.text.substring(0, 150));
    res.json({
  result: result.text,
  text: result.text,
  response: result.text
});
  } catch(e) {
    console.log("[CHAT ERROR]", e.message);
    res.json({ error: e.message });
  }
});

app.post("/api/generate-exam", async (req, res) => {
  const { subject, topic, difficulty, count } = req.body;
  console.log("[EXAM REQUEST]", subject, topic, difficulty, count);
  try {
    const messages = [
      { role: "system", content: "You are an exam generator. Output ONLY a raw JSON array. No markdown, no code fences, no explanation text before or after." },
      { role: "user", content: `Generate ${count || 5} multiple choice questions about "${topic}" in ${subject} subject, ${difficulty || "medium"} difficulty, for Indian students. Output format - a JSON array only: [{"q":"question text","opts":["option A","option B","option C","option D"],"ans":0,"explanation":"why this is correct","marks":5}]` }
    ];
    const maxTok = Math.min((count || 5) * 400, 8000);
    const result = await callAI(messages, maxTok);
    console.log("[EXAM TEXT]", String(result.text).substring(0, 300));
    res.json({ result: { response: result.text } });
  } catch(e) {
    console.log("[EXAM ERROR]", e.message);
    res.json({ error: e.message });
  }
});

app.post("/api/predict", async (req, res) => {
  const { subjects, targetExam } = req.body;
  console.log("[PREDICT REQUEST]", targetExam, JSON.stringify(subjects));
  try {
    const messages = [
      { role: "system", content: "You are a performance analyst. Output ONLY a raw JSON object. No markdown, no code fences." },
      { role: "user", content: `Predict performance for ${targetExam} exam based on these subject scores (percentages): ${JSON.stringify(subjects)}. Output format - a JSON object only: {"predictedRank":"#500-1000","predictedScore":"180-200/300","probability":"65%","strongSubjects":["subject1","subject2"],"weakSubjects":["subject1","subject2"],"recommendations":["tip1","tip2","tip3"],"studyHoursNeeded":"6-8 hours/day"}` }
    ];
    const result = await callAI(messages, 1024);
    console.log("[PREDICT RESPONSE]", result.text.substring(0, 300));
    res.json({ result: { response: result.text } });
  } catch(e) {
    console.log("[PREDICT ERROR]", e.message);
    res.json({ error: e.message });
  }
});

app.post("/api/update-profile", (req, res) => {
  try {
    const { userId, name, phone, school } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.json({ error: "User not found" });
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (school !== undefined) user.school = school;
    writeDB(db);
    res.json({ success: true, user: { id:user.id, name:user.name, email:user.email, role:user.role, phone:user.phone, school:user.school, subjects:user.subjects, studentClass:user.studentClass, section:user.section, stream:user.stream, sciencePart:user.sciencePart } });
  } catch(e) { res.json({ error: e.message }); }
});

app.post("/api/change-password", (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.json({ error: "User not found" });
    const hashedCurrent = crypto.createHash("sha256").update(currentPassword).digest("hex");
    if (user.password !== hashedCurrent) return res.json({ error: "Current password is incorrect" });
    user.password = crypto.createHash("sha256").update(newPassword).digest("hex");
    writeDB(db);
    res.json({ success: true });
  } catch(e) { res.json({ error: e.message }); }
});

app.post("/api/update-settings", (req, res) => {
  try {
    const { userId, notifications, language } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.json({ error: "User not found" });
    if (notifications) user.notifications = notifications;
    if (language) user.language = language;
    writeDB(db);
    res.json({ success: true });
  } catch(e) { res.json({ error: e.message }); }
});

app.get("/api/user-settings/:userId", (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.json({ error: "User not found" });
  res.json({
    phone: user.phone || "",
    school: user.school || "",
    notifications: user.notifications || { email:true, sms:false, push:true, examReminder:true, aiInsights:true },
    language: user.language || "English"
  });
});

app.get("/api/notifications/:userId", (req, res) => {
  try {
    const db = readDB();
    const user = db.users.find(u => u.id === req.params.userId);
    if (!user) return res.json({ notifications: [] });
    const notifications = [];
    if (user.role === "student") {
      const takenExamNames = new Set(db.scores.filter(s => s.userId === user.id).map(s => s.examName));
      db.exams.filter(e => !takenExamNames.has(e.title)).forEach(e => {
        notifications.push({ id: e.id, type: "exam", text: `New exam available: "${e.title}" (${e.subject})`, date: e.createdAt });
      });
    } else if (user.role === "teacher") {
      const myExamTitles = new Set(db.exams.filter(e => e.createdByUserId === user.id).map(e => e.title));
      const recentScores = db.scores.filter(s => myExamTitles.has(s.examName)).slice(-5);
      recentScores.forEach(s => {
        notifications.push({ id: s.id, type: "score", text: `A student scored ${s.percentage}% on "${s.examName}"`, date: s.date });
      });
    } else if (user.role === "admin") {
      const recentUsers = db.users.filter(u => u.role !== "admin").slice(-5);
      recentUsers.forEach(u => {
        notifications.push({ id: u.id, type: "user", text: `New ${u.role} registered: ${u.name}`, date: new Date(parseInt(u.id)).toISOString() });
      });
      db.exams.slice(-5).forEach(e => {
        notifications.push({ id: e.id, type: "exam", text: `New exam created: "${e.title}" (${e.subject}) by ${e.createdBy || "Unknown"}`, date: e.createdAt });
      });
    }
    notifications.sort((a,b) => new Date(b.date) - new Date(a.date));
    res.json({ notifications: notifications.slice(0, 10) });
  } catch(e) { res.json({ notifications: [], error: e.message }); }
});

app.post("/api/generate-quiz", async (req, res) => {
  const { subject, topic, difficulty, count, questionType, purpose } = req.body;
  console.log("[QUIZ REQUEST]", subject, topic, difficulty, count, questionType, purpose);
  try {
    const schemas = {
      mcq: `[{"type":"mcq","q":"question text","opts":["A","B","C","D"],"ans":0,"explanation":"why","marks":5}]`,
      multi: `[{"type":"multi","q":"question text (mention 'select all that apply')","opts":["A","B","C","D","E"],"ans":[0,2],"explanation":"why","marks":5}]`,
      truefalse: `[{"type":"truefalse","q":"statement text","ans":true,"explanation":"why","marks":3}]`,
      fill: `[{"type":"fill","q":"sentence with ___ blank","answer":"expected word/phrase","explanation":"why","marks":3}]`,
      matching: `[{"type":"matching","q":"Match the following","pairs":[{"left":"term1","right":"definition1"},{"left":"term2","right":"definition2"}],"marks":5}]`,
      short: `[{"type":"short","q":"question text","answer":"expected short answer","explanation":"why","marks":5}]`,
      ordering: `[{"type":"ordering","q":"Put these in correct order","items":["step1","step2","step3","step4"],"marks":5}]`,
    };
    const schema = schemas[questionType] || schemas.mcq;
    const purposeNote = {
      diagnostic: "This is a DIAGNOSTIC quiz to assess prior knowledge before teaching a topic — keep questions foundational.",
      formative: "This is a FORMATIVE quiz for checking understanding during learning — mix easy and medium questions.",
      summative: "This is a SUMMATIVE quiz for final assessment — questions should be rigorous and comprehensive.",
      practice: "This is LOW-STAKES PRACTICE — keep it encouraging and focused on reinforcement.",
    }[purpose] || "";
    const messages = [
      { role: "system", content: `You are a quiz generator for Indian students. ${purposeNote} Output ONLY a raw JSON array in this exact schema, no markdown, no code fences, no explanation text: ${schema}` },
      { role: "user", content: `Generate ${count || 5} ${questionType} questions about "${topic}" in ${subject}, ${difficulty || "medium"} difficulty.` }
    ];
    const maxTok = Math.min((count || 5) * 350, 8000);
    const result = await callAI(messages, maxTok);
    console.log("[QUIZ RAW]", JSON.stringify(result.raw).substring(0, 500));
    console.log("[QUIZ TEXT]", String(result.text).substring(0, 300));
    res.json({ result: { response: result.text } });
  } catch(e) {
    console.log("[QUIZ ERROR]", e.message);
    res.json({ error: e.message });
  }
});

app.get("/api/admin/stats", (req, res) => {
  try {
    const db = readDB();
    const students = db.users.filter(u => u.role === "student");
    const teachers = db.users.filter(u => u.role === "teacher");
    const today = new Date().toDateString();
    const activeTodayIds = new Set([
      ...db.scores.filter(s => new Date(s.date).toDateString() === today).map(s => s.userId),
      ...db.studyTime.filter(s => new Date(s.date).toDateString() === today).map(s => s.userId)
    ]);
    const avgPlatformScore = db.scores.length
      ? Math.round(db.scores.reduce((a,s) => a + (s.percentage||0), 0) / db.scores.length)
      : 0;
    res.json({
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalExams: db.exams.length,
      totalExamsTaken: db.scores.length,
      activeToday: activeTodayIds.size,
      avgPlatformScore
    });
  } catch(e) { res.json({ error: e.message }); }
});

app.get("/api/health", (req, res) => res.json({ status: "healthy" }));

loadDBFromNeon().then(() => {
  app.listen(3001, () => console.log("🟩 EduAI Backend v8.0 running on port 3001 — Notifications, Certificates & Admin Stats added!"));
});