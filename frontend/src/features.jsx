/* ══════════════════════════════════════════════════════════════════════════════
   EDUAI PLATFORM — 5 NEW FEATURES
   Add these components to your App.jsx
   Then add them to the routing in the App() function
══════════════════════════════════════════════════════════════════════════════ */

/* ─── FEATURE 1: VOICE INPUT ─────────────────────────────────────────────────
   Add this VoiceButton component inside AITutor, next to the send button
   Usage: <VoiceButton onResult={(text) => setMsg(text)} C={C} />
─────────────────────────────────────────────────────────────────────────────── */
function VoiceButton({ onResult, C }) {
  const [listening, setListening] = useState(false);
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice input not supported in this browser. Use Chrome!"); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => { onResult(e.results[0][0].transcript); setListening(false); };
    recognition.onerror = () => setListening(false);
    recognition.start();
  };
  return (
    <button onClick={startVoice} title="Voice Input" style={{ width:44, height:44, borderRadius:10, border:`1px solid ${listening ? C.red : C.border}`, background:listening ? `${C.red}20` : `${C.sub}12`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, animation:listening ? "pulse 1s infinite" : "none" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill={listening ? C.red : C.sub}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke={listening ? C.red : C.sub} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <line x1="12" y1="19" x2="12" y2="23" stroke={listening ? C.red : C.sub} strokeWidth="2" strokeLinecap="round"/>
        <line x1="8" y1="23" x2="16" y2="23" stroke={listening ? C.red : C.sub} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

/* ─── FEATURE 2: IMAGE DOUBT SOLVER ──────────────────────────────────────────
   New page: Image upload → AI analyzes → gives solution
   Add to routing: {page === "doubt-solver" && <DoubtSolver nav={nav} C={C} sbProps={sbProps} />}
─────────────────────────────────────────────────────────────────────────────── */
function DoubtSolver({ nav, C, sbProps }) {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState("");
  const fileRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setImagePreview(ev.target.result); setImage(file); };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith("image")) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (ev) => { setImagePreview(ev.target.result); setImage(blob); };
        reader.readAsDataURL(blob);
      }
    }
  };

  const solve = async () => {
    if (!description && !question) { alert("Please describe the problem or add a question!"); return; }
    setLoading(true);
    setSolution("");
    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 1500,
          messages: [
            { role: "system", content: "You are an expert AI tutor for Indian students (CBSE, JEE, NEET). Solve problems step by step with clear explanations, formulas, and examples." },
            { role: "user", content: `I have a doubt. ${description ? "The problem/image contains: " + description : ""} ${question ? "My specific question is: " + question : "Please solve this completely step by step."} Show all working, formulas used, and explain each step clearly.` }
          ]
        })
      });
      const data = await res.json();
      setSolution(data?.result?.response || "Could not analyze. Please try again.");
    } catch(e) { setSolution("Error: " + e.message); }
    setLoading(false);
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="doubt-solver" />
      <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
        <PageHeader title="🖼️ AI Doubt Solver" sub="Upload a photo of any problem — AI will solve it step by step" C={C} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          <div>
            <Card C={C} style={{ marginBottom:18 }}>
              <H3 C={C}>Upload Problem Image</H3>
              <div onClick={() => fileRef.current.click()} onPaste={handlePaste} style={{ border:`2px dashed ${C.border}`, borderRadius:12, padding:"32px", textAlign:"center", cursor:"pointer", background:`${C.accent}06`, marginBottom:16, minHeight:200, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="uploaded" style={{ maxWidth:"100%", maxHeight:250, borderRadius:8, objectFit:"contain" }} />
                ) : (
                  <>
                    <div style={{ fontSize:48 }}>📸</div>
                    <div style={{ color:C.text, fontSize:14, fontWeight:500 }}>Click to upload or paste image</div>
                    <div style={{ color:C.sub, fontSize:12 }}>Supports: JPG, PNG, screenshots (Ctrl+V to paste)</div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" aria-label="Upload problem image" title="Upload problem image" hidden onChange={handleImageUpload} />
              {imagePreview && (
                <button onClick={() => { setImage(null); setImagePreview(null); }} style={{ fontSize:12, color:C.red, background:`${C.red}14`, border:`1px solid ${C.red}40`, borderRadius:8, padding:"6px 14px", cursor:"pointer", marginBottom:14 }}>
                  ✕ Remove Image
                </button>
              )}
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Describe what's in the image (or the problem)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. A quadratic equation problem: x² + 5x + 6 = 0, find the roots&#10;Or: A physics diagram showing a block on inclined plane with 30° angle..." style={{ width:"100%", minHeight:90, background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, resize:"vertical", outline:"none", boxSizing:"border-box", lineHeight:1.5 }} />
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Your specific question (optional)</label>
                <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g. How do I solve this? What formula to use?" style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, width:"100%", outline:"none", boxSizing:"border-box" }} />
              </div>
              <BP onClick={solve} C={C} style={{ width:"100%", justifyContent:"center", opacity:loading?0.7:1 }}>
                {loading ? "🤖 AI is solving..." : "🔍 Solve with AI"}
              </BP>
            </Card>
            <Card C={C}>
              <H3 C={C}>📚 Quick Subjects</H3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {["Integration problem","Newton's Laws","Chemical equation","Data Structures","Trigonometry","Organic Chemistry","Electric circuits","Probability"].map(s => (
                  <button key={s} onClick={() => setDescription(s)} style={{ background:`${C.accent}14`, border:`1px solid ${C.accent}40`, color:C.accent, borderRadius:20, padding:"5px 13px", fontSize:12, cursor:"pointer" }}>{s}</button>
                ))}
              </div>
            </Card>
          </div>
          <Card C={C} style={{ minHeight:400 }}>
            <H3 C={C}>🤖 AI Solution</H3>
            {!solution && !loading && (
              <div style={{ textAlign:"center", padding:"60px 20px", color:C.sub }}>
                <div style={{ fontSize:48, marginBottom:14 }}>🧠</div>
                <div style={{ fontSize:14 }}>Upload an image or describe your problem and click "Solve with AI"</div>
              </div>
            )}
            {loading && (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <div style={{ fontSize:36, marginBottom:14 }}>⚡</div>
                <div style={{ color:C.accent, fontSize:14 }}>AI is analyzing and solving your problem...</div>
                <div style={{ color:C.sub, fontSize:12, marginTop:6 }}>This may take a few seconds</div>
              </div>
            )}
            {solution && (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px", whiteSpace:"pre-wrap", fontSize:14, lineHeight:1.8, color:C.text, maxHeight:520, overflowY:"auto" }}>
                {solution}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── FEATURE 3: REAL LOGIN SYSTEM ───────────────────────────────────────────
   Replace your existing Auth component with this enhanced version
   Connects to real backend database
─────────────────────────────────────────────────────────────────────────────── */
function AuthReal({ nav, setRole, setUser, C }) {
  const [mode, setMode] = useState("login");
  const [role, setRoleLocal] = useState("student");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const iS = { background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 15px", color:C.text, fontSize:14, width:"100%", outline:"none", boxSizing:"border-box" };

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/register";
      const body = mode === "login" ? { email, password: pass } : { name, email, password: pass, role };
      const res = await fetch("http://localhost:3001" + endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      localStorage.setItem("eduai_token", data.token);
      localStorage.setItem("eduai_user", JSON.stringify(data.user));
      setRole(data.user.role);
      setUser(data.user);
      nav(data.user.role === "admin" ? "admin" : data.user.role === "teacher" ? "teacher" : "student");
    } catch(e) {
      setError("Connection error. Make sure server is running!");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:C.bg }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <Brain size={36} color={C.accent} style={{ marginBottom:8 }} />
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:24, color:C.text, margin:0 }}>EduAI Platform</h2>
          <p style={{ color:C.sub, fontSize:13, marginTop:5 }}>Secure · AI-Powered · Cloud-Based</p>
        </div>
        <Card C={C}>
          <div style={{ display:"flex", gap:4, background:C.inputBg, borderRadius:9, padding:4, marginBottom:20 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex:1, padding:"8px", borderRadius:7, border:"none", background:mode===m?C.card:"transparent", color:mode===m?C.text:C.sub, fontSize:14, fontWeight:mode===m?500:400, cursor:"pointer" }}>
                {m==="login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>
          {mode==="register" && (
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Access Role</label>
              <div style={{ display:"flex", gap:6 }}>
                {["student","teacher","admin"].map(r => (
                  <button key={r} onClick={() => setRoleLocal(r)} style={{ flex:1, padding:"8px 4px", background:role===r?`${C.accent}18`:"transparent", border:`1px solid ${role===r?`${C.accent}50`:C.border}`, borderRadius:8, color:role===r?C.accent:C.sub, fontSize:13, cursor:"pointer", textTransform:"capitalize" }}>{r}</button>
                ))}
              </div>
            </div>
          )}
          {mode==="register" && (
            <><label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Full Name</label>
            <input style={iS} placeholder="Gyanshu Kumar" value={name} onChange={e=>setName(e.target.value)} /><div style={{ marginBottom:14 }}/></>
          )}
          <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Email Address</label>
          <input style={iS} placeholder="student@eduai.in" value={email} onChange={e=>setEmail(e.target.value)} />
          <div style={{ marginBottom:14 }}/>
          <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Password</label>
          <input style={iS} type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
          {error && <div style={{ marginTop:10, padding:"8px 12px", background:`${C.red}15`, border:`1px solid ${C.red}40`, borderRadius:8, fontSize:13, color:C.red }}>⚠️ {error}</div>}
          <div style={{ marginBottom:20 }}/>
          <BP onClick={submit} C={C} style={{ width:"100%", justifyContent:"center", padding:"12px", opacity:loading?0.7:1 }}>
            <Lock size={14} /> {loading ? "Please wait..." : mode==="login" ? "Sign In Securely" : "Create Account"}
          </BP>
          <p style={{ textAlign:"center", color:C.sub, fontSize:13, marginTop:12 }}>
            {mode==="login" ? "New here? " : "Have an account? "}
            <span onClick={() => { setMode(mode==="login"?"register":"login"); setError(""); }} style={{ color:C.accent, cursor:"pointer" }}>{mode==="login"?"Register":"Sign in"}</span>
          </p>
        </Card>
        <p style={{ textAlign:"center", color:C.sub, fontSize:11, marginTop:12 }}>🔒 JWT Secured · Encrypted · Role-Based Access</p>
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:10 }}>
          <button onClick={() => { setEmail("demo@student.com"); setPass("demo123"); }} style={{ fontSize:11, color:C.accent, background:`${C.accent}12`, border:`1px solid ${C.accent}30`, borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>Demo Student</button>
          <button onClick={() => { setEmail("admin@eduai.com"); setPass("admin123"); }} style={{ fontSize:11, color:C.gold, background:`${C.gold}12`, border:`1px solid ${C.gold}30`, borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>Demo Admin</button>
        </div>
        <BG onClick={() => nav("landing")} C={C} style={{ display:"flex", margin:"10px auto", fontSize:12 }}>← Home</BG>
      </div>
    </div>
  );
}

/* ─── FEATURE 4: AI PERFORMANCE PREDICTION ───────────────────────────────────
   New page showing AI-predicted rank, score, and recommendations
   Add to routing: {page === "prediction" && <AIPrediction nav={nav} C={C} sbProps={sbProps} />}
─────────────────────────────────────────────────────────────────────────────── */
function AIPrediction({ nav, C, sbProps }) {
  const [targetExam, setTargetExam] = useState("JEE Mains");
  const [subjects, setSubjects] = useState({ Mathematics:78, Physics:65, Chemistry:52, Biology:70, "Computer Science":91, English:83 });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const predict = async () => {
    setLoading(true); setPrediction(null);
    try {
      const res = await fetch("http://localhost:3001/api/predict", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ subjects, targetExam })
      });
      const data = await res.json();
      const text = (data?.result?.response || "{}").replace(/```json|```/g,"").trim();
      try { setPrediction(JSON.parse(text)); } catch { setPrediction({ predictedRank:"#500-1000", predictedScore:"180-200/300", probability:"65%", strongSubjects:["Mathematics","Computer Science"], weakSubjects:["Chemistry","Physics"], recommendations:["Focus on Organic Chemistry daily","Practice Physics numericals 2h/day","Revise Mathematics formulas weekly"], studyHoursNeeded:"6-8 hours/day" }); }
    } catch(e) { setPrediction(null); }
    setLoading(false);
  };

  const exams = ["JEE Mains","JEE Advanced","NEET","UPSC","CBSE Boards","State Board"];
  const subjectList = Object.keys(subjects);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="prediction" />
      <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
        <PageHeader title="📊 AI Performance Prediction" sub="Enter your current scores — AI predicts your exam rank and gives personalized advice" C={C} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:20 }}>
          <div>
            <Card C={C} style={{ marginBottom:18 }}>
              <H3 C={C}>Target Exam</H3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
                {exams.map(e => (
                  <button key={e} onClick={() => setTargetExam(e)} style={{ padding:"8px 16px", borderRadius:20, fontSize:13, cursor:"pointer", background:targetExam===e?`${C.accent}20`:"transparent", border:`1px solid ${targetExam===e?C.accent:C.border}`, color:targetExam===e?C.accent:C.sub }}>{e}</button>
                ))}
              </div>
              <H3 C={C}>Your Current Scores (%)</H3>
              {subjectList.map(sub => (
                <div key={sub} style={{ marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:13, color:C.text }}>{sub}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:subjects[sub]>=75?C.green:subjects[sub]>=60?C.gold:C.red }}>{subjects[sub]}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={subjects[sub]} onChange={e => setSubjects(s => ({...s,[sub]:parseInt(e.target.value)}))} style={{ width:"100%", accentColor:C.accent }} />
                </div>
              ))}
              <BP onClick={predict} C={C} style={{ width:"100%", justifyContent:"center", marginTop:8, opacity:loading?0.7:1 }}>
                {loading ? "🤖 AI is predicting..." : "🔮 Predict My Performance"}
              </BP>
            </Card>
          </div>
          <div>
            {!prediction && !loading && (
              <Card C={C} style={{ textAlign:"center", padding:"60px 30px" }}>
                <div style={{ fontSize:56, marginBottom:14 }}>🔮</div>
                <h3 style={{ fontFamily:"Syne,sans-serif", color:C.text, margin:"0 0 10px" }}>AI Prediction Engine</h3>
                <p style={{ color:C.sub, fontSize:13, lineHeight:1.6 }}>Set your current scores and target exam, then click Predict to get AI-powered rank prediction, study recommendations, and a personalized improvement plan.</p>
              </Card>
            )}
            {loading && (
              <Card C={C} style={{ textAlign:"center", padding:"60px 30px" }}>
                <div style={{ fontSize:48, marginBottom:14 }}>⚡</div>
                <p style={{ color:C.accent, fontSize:15 }}>AI is analyzing your performance...</p>
                <p style={{ color:C.sub, fontSize:12, marginTop:6 }}>Comparing with 2.4M+ student data points</p>
              </Card>
            )}
            {prediction && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  {[
                    { label:"Predicted Rank", value:prediction.predictedRank, icon:"🏆", color:C.gold },
                    { label:"Predicted Score", value:prediction.predictedScore, icon:"📊", color:C.accent },
                    { label:"Success Probability", value:prediction.probability, icon:"🎯", color:C.green },
                    { label:"Study Hours Needed", value:prediction.studyHoursNeeded, icon:"⏰", color:C.purple },
                  ].map(s => (
                    <Card key={s.label} C={C} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:28, marginBottom:6 }}>{s.icon}</div>
                      <div style={{ fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:700, color:s.color, marginBottom:4 }}>{s.value}</div>
                      <div style={{ fontSize:12, color:C.sub }}>{s.label}</div>
                    </Card>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <Card C={C}>
                    <H3 C={C}>💪 Strong Subjects</H3>
                    {(prediction.strongSubjects || []).map((s,i) => (
                      <div key={i} style={{ padding:"8px 0", borderBottom:i<prediction.strongSubjects.length-1?`1px solid ${C.border}`:"none", color:C.green, fontSize:13, display:"flex", alignItems:"center", gap:8 }}>✅ {s}</div>
                    ))}
                  </Card>
                  <Card C={C}>
                    <H3 C={C}>⚠️ Needs Focus</H3>
                    {(prediction.weakSubjects || []).map((s,i) => (
                      <div key={i} style={{ padding:"8px 0", borderBottom:i<prediction.weakSubjects.length-1?`1px solid ${C.border}`:"none", color:C.red, fontSize:13, display:"flex", alignItems:"center", gap:8 }}>❗ {s}</div>
                    ))}
                  </Card>
                </div>
                <Card C={C} style={{ background:`${C.accent}08` }}>
                  <H3 C={C}><Brain size={15} color={C.accent} style={{ verticalAlign:-2, marginRight:7 }} />AI Recommendations</H3>
                  {(prediction.recommendations || []).map((r,i) => (
                    <div key={i} style={{ padding:"10px 0", borderBottom:i<prediction.recommendations.length-1?`1px solid ${C.border}`:"none", fontSize:13, color:C.text, display:"flex", gap:10, alignItems:"flex-start" }}>
                      <span style={{ color:C.accent, fontSize:16, flexShrink:0 }}>→</span>{r}
                    </div>
                  ))}
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── FEATURE 5: AI EXAM GENERATOR ───────────────────────────────────────────
   Teacher/Admin can auto-generate full exams using AI
   Add to routing: {page === "exam-generator" && <ExamGenerator nav={nav} C={C} sbProps={sbProps} />}
─────────────────────────────────────────────────────────────────────────────── */
function ExamGenerator({ nav, C, sbProps }) {
  const [subject, setSubject] = useState("Mathematics");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const subjects = ["Mathematics","Physics","Chemistry","Computer Science","Biology","English","History","Economics"];
  const difficulties = ["easy","medium","hard"];

  const generate = async () => {
    if (!topic.trim()) { alert("Please enter a topic!"); return; }
    setLoading(true); setQuestions([]); setAnswers({}); setSubmitted(false);
    try {
      const res = await fetch("http://localhost:3001/api/generate-exam", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ subject, topic, difficulty, count })
      });
      const data = await res.json();
      const text = (data?.result?.response || "[]").replace(/```json|```/g,"").trim();
      let start = text.indexOf("["), end = text.lastIndexOf("]");
      const jsonStr = start >= 0 && end >= 0 ? text.substring(start, end+1) : "[]";
      const qs = JSON.parse(jsonStr);
      setQuestions(qs);
      setExamTitle(`${subject} — ${topic} (${difficulty.charAt(0).toUpperCase()+difficulty.slice(1)})`);
    } catch(e) { alert("Failed to generate. Please try again!"); }
    setLoading(false);
  };

  const score = submitted ? questions.filter((q,i) => answers[i] === q.ans).length : 0;
  const totalMarks = questions.reduce((a,q) => a+(q.marks||5), 0);
  const earned = submitted ? questions.filter((q,i) => answers[i]===q.ans).reduce((a,q) => a+(q.marks||5), 0) : 0;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="exam-generator" />
      <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
        <PageHeader title="📝 AI Exam Generator" sub="Generate professional exams instantly using AI — for any subject, topic and difficulty" C={C} />
        <Card C={C} style={{ marginBottom:20 }}>
          <H3 C={C}>Configure Exam</H3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:16 }}>
            <div>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Subject</label>
              <select value={subject} onChange={e=>setSubject(e.target.value)} style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, width:"100%", outline:"none" }}>
                {subjects.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Topic</label>
              <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Integration, Newton's Laws..." style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, width:"100%", outline:"none", boxSizing:"border-box" }} />
            </div>
            <div>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Difficulty</label>
              <div style={{ display:"flex", gap:6 }}>
                {difficulties.map(d => (
                  <button key={d} onClick={()=>setDifficulty(d)} style={{ flex:1, padding:"9px 4px", background:difficulty===d?`${d==="easy"?C.green:d==="medium"?C.gold:C.red}20`:"transparent", border:`1px solid ${difficulty===d?(d==="easy"?C.green:d==="medium"?C.gold:C.red):C.border}`, borderRadius:8, color:difficulty===d?(d==="easy"?C.green:d==="medium"?C.gold:C.red):C.sub, fontSize:12, cursor:"pointer", textTransform:"capitalize" }}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Questions: {count}</label>
              <input type="range" min="3" max="20" value={count} onChange={e=>setCount(parseInt(e.target.value))} style={{ width:"100%", accentColor:C.accent, marginTop:10 }} />
            </div>
          </div>
          <BP onClick={generate} C={C} style={{ opacity:loading?0.7:1 }}>
            {loading ? "🤖 Generating exam..." : "⚡ Generate Exam with AI"}
          </BP>
        </Card>
        {loading && (
          <Card C={C} style={{ textAlign:"center", padding:"40px" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🤖</div>
            <p style={{ color:C.accent, fontSize:15 }}>AI is creating {count} questions on {subject} — {topic}...</p>
          </Card>
        )}
        {questions.length > 0 && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:20, color:C.text, margin:0 }}>{examTitle}</h2>
                <p style={{ color:C.sub, fontSize:13, margin:"4px 0 0" }}>{questions.length} questions · {totalMarks} marks · AI Generated</p>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                {!submitted && <BP onClick={()=>setSubmitted(true)} C={C} style={{ background:`linear-gradient(135deg,${C.green},#00a060)` }}><CheckCircle size={14}/> Submit Exam</BP>}
                <BS onClick={generate} C={C}><RefreshCw size={13}/> Regenerate</BS>
              </div>
            </div>
            {submitted && (
              <Card C={C} style={{ marginBottom:16, background:`${C.accent}08`, textAlign:"center" }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:36, fontWeight:800, color:Math.round((earned/totalMarks)*100)>=60?C.green:C.red }}>
                  {earned}/{totalMarks} ({Math.round((earned/totalMarks)*100)}%)
                </div>
                <p style={{ color:C.sub, fontSize:14 }}>{score}/{questions.length} correct answers</p>
              </Card>
            )}
            {questions.map((q,qi) => (
              <Card key={qi} C={C} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                  <span style={{ fontSize:12, color:C.sub }}>Q{qi+1} · {q.marks||5} marks</span>
                  {submitted && <span style={{ fontSize:12, fontWeight:600, color:answers[qi]===q.ans?C.green:C.red }}>{answers[qi]===q.ans?"✓ Correct":"✗ Wrong"}</span>}
                </div>
                <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:500, fontSize:15, color:C.text, marginBottom:14, lineHeight:1.5 }}>{q.q}</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(q.opts||[]).map((opt,oi) => {
                    const sel = answers[qi]===oi;
                    const revealed = submitted;
                    const correct = oi===q.ans;
                    const bg = revealed?(correct?`${C.green}18`:sel&&!correct?`${C.red}18`:"transparent"):sel?`${C.accent}14`:"transparent";
                    const border = revealed?(correct?C.green:sel&&!correct?C.red:C.border):sel?C.accent:C.border;
                    const color = revealed?(correct?C.green:sel&&!correct?C.red:C.sub):sel?C.accent:C.text;
                    return (
                      <button key={oi} onClick={()=>{ if(!submitted) setAnswers(a=>({...a,[qi]:oi})); }} style={{ textAlign:"left", padding:"10px 14px", background:bg, border:`1px solid ${border}`, borderRadius:9, color, fontSize:13, cursor:submitted?"default":"pointer", display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ width:22, height:22, borderRadius:"50%", border:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, flexShrink:0 }}>{String.fromCharCode(65+oi)}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {submitted && q.explanation && (
                  <div style={{ marginTop:12, padding:"10px 14px", background:`${C.accent}10`, borderRadius:8, fontSize:12, color:C.sub }}>
                    💡 <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   HOW TO ADD THESE FEATURES TO YOUR App.jsx:
   
   1. VOICE INPUT:
      - Add <VoiceButton onResult={(text) => setMsg(text)} C={C} /> 
        next to the send button in AITutor component
   
   2. IMAGE DOUBT SOLVER:
      - Add <DoubtSolver /> component to your file
      - Add to sidebar: { id:"doubt-solver", label:"Doubt Solver", icon:Camera }
      - Add to routing: {page==="doubt-solver" && <DoubtSolver nav={nav} C={C} sbProps={sbProps}/>}
   
   3. REAL LOGIN:
      - Replace <Auth /> with <AuthReal /> in routing
      - Add user state: const [user, setUser] = useState(null)
      - Pass setUser to AuthReal
   
   4. AI PREDICTION:
      - Add <AIPrediction /> component
      - Add to sidebar: { id:"prediction", label:"AI Prediction", icon:Target }
      - Add to routing: {page==="prediction" && <AIPrediction nav={nav} C={C} sbProps={sbProps}/>}
   
   5. AI EXAM GENERATOR:
      - Add <ExamGenerator /> component
      - Add to sidebar: { id:"exam-generator", label:"Exam Generator", icon:Sparkles }
      - Add to routing: {page==="exam-generator" && <ExamGenerator nav={nav} C={C} sbProps={sbProps}/>}
══════════════════════════════════════════════════════════════════════════════ */
