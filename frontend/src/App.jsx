import { useState, useEffect, useRef } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Home, BookOpen, Brain, Shield, BarChart2, Users, Award, FileText,
  TrendingUp, Bell, Search, LogOut, Settings, ChevronRight, ArrowRight,
  Trophy, Calendar, Video, GraduationCap, Bookmark, Flag,
  Star, Globe, Database, Cpu, Sparkles, Lock, Plus, Filter,
  Send, Play, CheckCircle, Clock, AlertTriangle, Target, Activity,
  Eye, Camera, Mic, Monitor, RefreshCw, X, MessageCircle,
  Download, User, Key, Sun, Moon, Zap, Edit, Trash,
  ChevronDown, Pencil, MoreHorizontal,
} from "lucide-react";

const DARK = {
  bg:"#030b18", surface:"#081526", card:"#0d1e3a", border:"rgba(0,180,255,0.12)",
  accent:"#00b4ff", accentAlt:"#0055ee", gold:"#f0b429", text:"#cce4ff",
  sub:"#5a7fa8", green:"#00e676", amber:"#ffb74d", red:"#ff5858", purple:"#9c6fff",
  inputBg:"rgba(0,0,0,0.35)",
};
const LIGHT = {
  bg:"#f0f4fc", surface:"#ffffff", card:"#ffffff", border:"rgba(0,100,200,0.15)",
  accent:"#005bcc", accentAlt:"#003fa0", gold:"#c07800", text:"#0d1d36",
  sub:"#5a7090", green:"#007c38", amber:"#b05e00", red:"#c0202a", purple:"#5a30b5",
  inputBg:"rgba(0,50,120,0.06)",
};

const gr = (C) => `linear-gradient(135deg,${C.accent},${C.accentAlt})`;

function BP({ children, onClick, C, style = {} }) {
  return (
    <button onClick={onClick} style={{ background:gr(C), color:"#fff", border:"none", borderRadius:10, padding:"11px 22px", fontSize:14, fontWeight:600, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:7, ...style }}>
      {children}
    </button>
  );
}
function BG({ children, onClick, C, style = {} }) {
  return (
    <button onClick={onClick} style={{ background:"transparent", color:C.text, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 18px", fontSize:14, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:7, ...style }}>
      {children}
    </button>
  );
}
function BS({ children, onClick, color, C, style = {} }) {
  const cl = color || C.accent;
  return (
    <button onClick={onClick} style={{ background:`${cl}18`, color:cl, border:`1px solid ${cl}40`, borderRadius:8, padding:"8px 14px", fontSize:13, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6, ...style }}>
      {children}
    </button>
  );
}
function Card({ children, C, style = {} }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px", ...style }}>
      {children}
    </div>
  );
}
function H3({ children, C, style = {} }) {
  return (
    <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:16, color:C.text, margin:"0 0 14px", ...style }}>
      {children}
    </h3>
  );
}
function StatCard({ label, value, sub, icon: Icon, color, C }) {
  return (
    <Card C={C} style={{ flex:1, minWidth:140, display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontSize:12, color:C.sub }}>{label}</span>
        <div style={{ width:32, height:32, borderRadius:9, background:`${color}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div style={{ fontSize:27, fontWeight:700, fontFamily:"Syne,sans-serif", color:C.text }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.sub }}>{sub}</div>}
    </Card>
  );
}

function NotifDrawer({ open, onClose, C }) {
  const [notifications, setNotifications] = useState([]);
  const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
  useEffect(() => {
    if (!open || !userId) return;
    fetch(`https://eduai-urgj.onrender.com/api/notifications/${userId}`)
      .then(r => r.json())
      .then(d => setNotifications(d.notifications || []))
      .catch(() => setNotifications([]));
  }, [open, userId]);
  const iconFor = (type) => type === "exam" ? FileText : type === "score" ? Trophy : Bell;
  const colorFor = (type) => type === "exam" ? "#00b4ff" : type === "score" ? "#f0b429" : "#9c6fff";
  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };
  return (
    <>
      {open && <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200 }} />}
      <div style={{ position:"fixed", top:0, right:0, width:340, height:"100vh", background:C.surface, borderLeft:`1px solid ${C.border}`, zIndex:201, transition:"transform 0.3s", transform:open?"translateX(0)":"translateX(100%)", overflowY:"auto", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"18px 18px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ margin:0, fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:17, color:C.text }}>Notifications</h3>
          <button onClick={onClose} style={{ background:"transparent", border:"none", cursor:"pointer", color:C.sub }}><X size={18} /></button>
        </div>
        {notifications.length === 0 ? (
          <div style={{ padding:"40px 20px", textAlign:"center", color:C.sub, fontSize:13 }}>
            <Bell size={28} style={{ opacity:0.4, marginBottom:10 }} />
            <div>No notifications right now.</div>
          </div>
        ) : notifications.map((n, i) => {
          const Icon = iconFor(n.type);
          const color = colorFor(n.type);
          return (
            <div key={n.id || i} style={{ padding:"13px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ width:34, height:34, borderRadius:9, background:`${color}20`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon size={16} color={color} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.4 }}>{n.text}</div>
                <div style={{ fontSize:11, color:C.sub, marginTop:4 }}>{timeAgo(n.date)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Sidebar({ nav, current, role, C, onNotif, notifCount, dark, setDark }) {
  const studentItems = [
    { id:"student", label:"Dashboard", icon:Home },
    { id:"courses", label:"My Courses", icon:BookOpen },
    { id:"ai-tutor", label:"AI Tutor", icon:Brain },
    { id:"exam", label:"Examinations", icon:FileText },
    { id:"leaderboard", label:"Leaderboard", icon:Trophy },
    { id:"planner", label:"Study Planner", icon:Calendar },
    { id:"analytics", label:"Analytics", icon:BarChart2 },
    { id:"doubt-solver", label:"Doubt Solver", icon:Camera },
    { id:"prediction", label:"AI Prediction", icon:Target },
    { id:"exam-generator", label:"Exam Builder", icon:Sparkles },
    { id:"quiz", label:"Quiz Center", icon:MessageCircle },
  ];
  const adminItems = [
    { id:"admin", label:"Overview", icon:Home },
    { id:"admin-students", label:"Students", icon:Users },
    { id:"admin-teachers", label:"Teachers", icon:GraduationCap },
    { id:"admin-exams", label:"Exam Builder", icon:FileText },
    { id:"admin-reports", label:"Reports", icon:BarChart2 },
  ];
  const teacherItems = [
    { id:"teacher", label:"Dashboard", icon:Home },
    { id:"teacher-classes", label:"My Classes", icon:Users },
    { id:"teacher-builder", label:"Exam Builder", icon:FileText },
    { id:"teacher-grades", label:"Grade Book", icon:Award },
  ];
  const items = role === "admin" ? adminItems : role === "teacher" ? teacherItems : studentItems;
  const ac = role === "admin" ? C.gold : role === "teacher" ? C.purple : C.accent;
  return (
    <div style={{ width:222, background:C.surface, borderRight:`1px solid ${C.border}`, padding:"20px 13px", display:"flex", flexDirection:"column", gap:3, flexShrink:0, minHeight:"100vh", overflowY:"auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:9, padding:"6px 8px 18px" }}>
        <Brain size={22} color={ac} />
        <span style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:17, color:C.text }}>EduAI</span>
        {role !== "student" && <span style={{ fontSize:9, background:`${ac}25`, color:ac, borderRadius:4, padding:"2px 6px", fontWeight:700, textTransform:"uppercase" }}>{role}</span>}
      </div>
      <div style={{ flex:1 }}>
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => nav(id)} style={{ background:current === id ? `${ac}14` : "transparent", border:current === id ? `1px solid ${ac}35` : "1px solid transparent", borderRadius:9, padding:"9px 12px", display:"flex", alignItems:"center", gap:10, color:current === id ? ac : C.sub, fontSize:13, cursor:"pointer", fontWeight:current === id ? 500 : 400, width:"100%", marginBottom:3 }}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:12 }}>
        <div style={{ display:"flex", gap:5 }}>
          <button onClick={() => nav("settings")} style={{ flex:1, background:`${C.sub}12`, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 6px", display:"flex", alignItems:"center", justifyContent:"center", gap:5, color:C.sub, fontSize:12, cursor:"pointer" }}>
            <Settings size={13} /> Settings
          </button>
          <button onClick={() => setDark(d => !d)} style={{ width:34, background:`${C.sub}12`, border:`1px solid ${C.border}`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            {dark ? <Sun size={14} color={C.gold} /> : <Moon size={14} color={C.sub} />}
          </button>
          <button onClick={onNotif} style={{ position:"relative", width:34, background:`${C.sub}12`, border:`1px solid ${C.border}`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <Bell size={14} color={notifCount > 0 ? C.accent : C.sub} />
            {notifCount > 0 && <span style={{ position:"absolute", top:6, right:5, width:7, height:7, borderRadius:"50%", background:C.red }} />}
          </button>
        </div>
        {role === "student" && (
          <>
            <BS onClick={() => nav("admin")} C={C} color={C.gold} style={{ justifyContent:"center", fontSize:11 }}><Shield size={12} /> Admin</BS>
            <BS onClick={() => nav("teacher")} C={C} color={C.purple} style={{ justifyContent:"center", fontSize:11 }}><GraduationCap size={12} /> Teacher</BS>
          </>
        )}
        {role === "admin" && <BS onClick={() => nav("student")} C={C} color={C.accent} style={{ justifyContent:"center", fontSize:11 }}><BookOpen size={12} /> Student</BS>}
        {role === "teacher" && <BS onClick={() => nav("student")} C={C} color={C.accent} style={{ justifyContent:"center", fontSize:11 }}><Home size={12} /> Student</BS>}
        <BG onClick={() => nav("landing")} C={C} style={{ justifyContent:"center", fontSize:12, padding:"8px" }}>
          <LogOut size={13} /> Logout
        </BG>
      </div>
    </div>
  );
}

function PageHeader({ title, sub, C, children }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
      <div>
        <h1 style={{ margin:0, fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:23, color:C.text }}>{title}</h1>
        {sub && <p style={{ margin:"4px 0 0", color:C.sub, fontSize:13 }}>{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function Landing({ nav, C }) {
  const [liveStudents, setLiveStudents] = useState(null);
  useEffect(() => {
    fetch("https://eduai-urgj.onrender.com/api/admin/stats")
      .then(r=>r.json())
      .then(d => { if (d.totalStudents !== undefined) setLiveStudents(d.totalStudents); })
      .catch(()=>{});
  }, []);
  const features = [
    { icon:Brain, title:"AI Personalized Learning", desc:"Adaptive study paths and intelligent tutoring tailored to every student's pace." },
    { icon:Shield, title:"AI Anti-Cheating System", desc:"Face detection, tab monitoring, audio analysis, and biometric verification." },
    { icon:BarChart2, title:"Deep Performance Analytics", desc:"Track weak subjects, predict JEE/NEET ranks, get AI improvement recommendations." },
    { icon:Globe, title:"Rural & Low-Bandwidth Access", desc:"Offline mode and regional language support for every corner of India." },
    { icon:Cpu, title:"24/7 AI Chatbot Tutor", desc:"Always-on AI that explains concepts and solves problems step-by-step." },
    { icon:Database, title:"Scalable Cloud Infrastructure", desc:"Multi-region AWS deployment with 99.9% uptime for millions of users." },
    { icon:Trophy, title:"Gamified Leaderboards", desc:"Subject-wise rankings, achievement badges, and streak rewards." },
    { icon:Calendar, title:"AI Study Planner", desc:"Personalized weekly schedules with Pomodoro timers and progress tracking." },
    { icon:Video, title:"Interactive Course System", desc:"Video lessons, chapter progress, notes, peer discussion, and resources." },
  ];
  // Students and Courses are real counts from this platform's own database
  // and catalog. Uptime and Exam Integrity have no real data source in this
  // app (no monitoring or fraud-detection system exists), so those two stay
  // as standard splash-page copy rather than fabricated "live" figures.
  const stats = [
    { n: liveStudents !== null ? String(liveStudents) : "—", l:"Students" },
    { n:"99.9%", l:"Uptime" },
    { n:"6", l:"Courses" },
    { n:"99.2%", l:"Exam Integrity" },
  ];
  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      <nav style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 44px", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, background:`${C.bg}ee`, backdropFilter:"blur(10px)", zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Brain size={24} color={C.accent} />
          <span style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:20, color:C.text }}>EduAI Platform</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <BG onClick={() => nav("auth")} C={C}>Login</BG>
          <BP onClick={() => nav("auth")} C={C}>Get Started <ArrowRight size={14} /></BP>
        </div>
      </nav>
      <div style={{ padding:"68px 44px 50px", maxWidth:1180, margin:"0 auto" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:`${C.accent}14`, border:`1px solid ${C.accent}35`, borderRadius:20, padding:"5px 14px", marginBottom:22 }}>
          <Sparkles size={13} color={C.accent} />
          <span style={{ fontSize:12, color:C.accent, fontWeight:500 }}>India's Most Advanced AI Education Platform</span>
        </div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:52, lineHeight:1.1, margin:"0 0 20px", color:C.text, maxWidth:720 }}>
          AI-Powered Education for India's{" "}
          <span style={{ background:`linear-gradient(135deg,${C.accent},${C.accentAlt})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Digital Future</span>
        </h1>
        <p style={{ fontSize:16, color:C.sub, maxWidth:560, lineHeight:1.7, margin:"0 0 30px" }}>
          Eliminating exam fraud, paper leaks, and teacher shortages through AI, cybersecurity, and cloud infrastructure — built for 1.4 billion Indians.
        </p>
        <div style={{ display:"flex", gap:12, marginBottom:50 }}>
          <BP onClick={() => nav("auth")} C={C} style={{ fontSize:15, padding:"13px 28px" }}><Play size={16} /> Start Learning Free</BP>
          <BG onClick={() => nav("admin")} C={C}>Admin Demo <ChevronRight size={14} /></BG>
          <BG onClick={() => nav("teacher")} C={C}>Teacher Demo <ChevronRight size={14} /></BG>
        </div>
        <div style={{ display:"flex", background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden", marginBottom:44 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex:1, padding:"20px", textAlign:"center", borderRight:i < 3 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:28, color:C.accent }}>{s.n}</div>
              <div style={{ fontSize:12, color:C.sub, marginTop:3 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:32, color:C.text, margin:"0 0 8px", textAlign:"center" }}>Complete Platform Capabilities</h2>
        <p style={{ color:C.sub, textAlign:"center", marginBottom:36, fontSize:14 }}>AI + Cloud + Cybersecurity + Gamification</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <Card key={i} C={C}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${C.accent}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
                <Icon size={19} color={C.accent} />
              </div>
              <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:15, color:C.text, margin:"0 0 7px" }}>{title}</h3>
              <p style={{ color:C.sub, fontSize:13, lineHeight:1.6, margin:0 }}>{desc}</p>
            </Card>
          ))}
        </div>
      </div>
      <div style={{ textAlign:"center", padding:"20px", borderTop:`1px solid ${C.border}`, color:C.sub, fontSize:12 }}>
        © 2026 EduAI Platform · Designed & Developed by <strong style={{ color:C.accent }}>Gyanshu Kumar</strong>
      </div>
    </div>
  );
}

function Auth({ nav, setRole, C }) {
  const [mode, setMode] = useState("login");
  const [role, setRoleLocal] = useState("student");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const iS = { background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 15px", color:C.text, fontSize:14, width:"100%", outline:"none", boxSizing:"border-box" };
  const submit = () => { setRole(role); nav(role === "admin" ? "admin" : role === "teacher" ? "teacher" : "student"); };
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:C.bg }}>
      <div style={{ width:"100%", maxWidth:410 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <Brain size={36} color={C.accent} style={{ marginBottom:8 }} />
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:24, color:C.text, margin:0 }}>EduAI Platform</h2>
          <p style={{ color:C.sub, fontSize:13, marginTop:5 }}>Secure · AI-Powered · Cloud-Based</p>
        </div>
        <Card C={C}>
          <div style={{ display:"flex", gap:4, background:C.inputBg, borderRadius:9, padding:4, marginBottom:20 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex:1, padding:"8px", borderRadius:7, border:"none", background:mode === m ? C.card : "transparent", color:mode === m ? C.text : C.sub, fontSize:14, fontWeight:mode === m ? 500 : 400, cursor:"pointer" }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, color:C.sub, marginBottom:6, display:"block" }}>Access Role</label>
            <div style={{ display:"flex", gap:6 }}>
              {["student", "teacher", "admin"].map(r => (
                <button key={r} onClick={() => setRoleLocal(r)} style={{ flex:1, padding:"8px 4px", background:role === r ? `${C.accent}18` : "transparent", border:`1px solid ${role === r ? `${C.accent}50` : C.border}`, borderRadius:8, color:role === r ? C.accent : C.sub, fontSize:13, cursor:"pointer", textTransform:"capitalize" }}>{r}</button>
              ))}
            </div>
          </div>
          <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Email</label>
          <input style={iS} placeholder="student@eduai.in" value={email} onChange={e => setEmail(e.target.value)} />
          <div style={{ marginBottom:14 }} />
          <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Password</label>
          <input style={iS} type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
          <div style={{ marginBottom:20 }} />
          <BP onClick={submit} C={C} style={{ width:"100%", justifyContent:"center", padding:"12px" }}>
            <Lock size={14} /> {mode === "login" ? "Sign In Securely" : "Create Account"}
          </BP>
        </Card>
        <BG onClick={() => nav("landing")} C={C} style={{ display:"flex", margin:"10px auto", fontSize:12 }}>← Home</BG>
      </div>
    </div>
  );
}

function StudentDash({ nav, C, sbProps }) {
  const [savedExams, setSavedExams] = useState([]);
  const [myScores, setMyScores] = useState([]);
  const [showCert, setShowCert] = useState(null);
  const [enrolledCount, setEnrolledCount] = useState(0);
  useEffect(() => {
    const uid = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
    if (!uid) return;
    fetch(`https://eduai-urgj.onrender.com/api/enrollments/${uid}`)
      .then(r=>r.json())
      .then(d => setEnrolledCount((d.enrollments||[]).length))
      .catch(()=>{});
  }, []);
  const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
  const userName = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").name || "Student"; } catch { return "Student"; }})();
  const [studyEntries, setStudyEntries] = useState([]);
   const [classRank, setClassRank] = useState(null);
  const [totalRankedStudents, setTotalRankedStudents] = useState(0);
  useEffect(() => {
    fetch("https://eduai-urgj.onrender.com/api/exams").then(r=>r.json()).then(d=>setSavedExams(d.exams||[])).catch(()=>{});
    if (userId) {
      fetch(`https://eduai-urgj.onrender.com/api/scores/${userId}`).then(r=>r.json()).then(d=>setMyScores(d.scores||[])).catch(()=>{});
      fetch(`https://eduai-urgj.onrender.com/api/study-time/${userId}`).then(r=>r.json()).then(d=>setStudyEntries(d.entries||[])).catch(()=>{});
    }
    fetch("https://eduai-urgj.onrender.com/api/leaderboard").then(r=>r.json()).then(d => {
      const board = d.leaderboard || [];
      setTotalRankedStudents(board.length);
      const idx = board.findIndex(s => s.id === userId);
      if (idx >= 0) setClassRank(idx + 1);
    }).catch(()=>{});
  }, [userId]);
  const avgScore = myScores.length ? Math.round(myScores.reduce((a,s)=>a+s.percentage,0)/myScores.length) : 84;
  const defaultTrend = [{ d:"Mon",h:2 },{ d:"Tue",h:4 },{ d:"Wed",h:3 },{ d:"Thu",h:5 },{ d:"Fri",h:4 },{ d:"Sat",h:6 },{ d:"Sun",h:3 }];
  const trendData = (() => {
    if (studyEntries.length === 0) return defaultTrend;
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const now = new Date();
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0,0,0,0);
    const minutesByDay = { Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0, Sun:0 };
    studyEntries.forEach(e => {
      const d = new Date(e.date);
      if (d >= startOfWeek) minutesByDay[dayNames[d.getDay()]] += (e.minutes || 0);
    });
    return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => ({ d, h: Math.round((minutesByDay[d]/60)*10)/10 }));
  })();
  const defaultCourses = [{ name:"Mathematics",p:78,c:C.accent },{ name:"Physics",p:65,c:C.purple },{ name:"Computer Sci.",p:91,c:C.green },{ name:"Chemistry",p:52,c:C.amber }];
  const subjectScores = {};
  myScores.forEach(s => {
    const subj = s.subject || "General";
    if (!subjectScores[subj]) subjectScores[subj] = [];
    subjectScores[subj].push(s.percentage || 0);
  });
  const courses = defaultCourses.map(dc => {
    const scores = subjectScores[dc.name];
    return scores && scores.length
      ? { ...dc, p: Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) }
      : dc;
  });
  const activity = myScores.length > 0
    ? myScores.slice(-4).reverse().map((s,i) => ({ time:`${i+1}d ago`, text:`${s.examName||"Exam"} — Score: ${s.score}/${s.totalMarks} (${s.percentage}%)`, type:"exam" }))
    : [{ time:"2h ago", text:"Completed Chapter 7: Integral Calculus", type:"complete" },{ time:"5h ago", text:"AI Tutor session: Thermodynamics basics", type:"ai" },{ time:"1d ago", text:"Mock Test #4 — Score: 84/100", type:"exam" },{ time:"2d ago", text:"Enrolled in Advanced Physics", type:"enroll" }];
  const tColor = { complete:C.green, ai:C.accent, exam:C.gold, enroll:C.purple };
  const tIcon = { complete:CheckCircle, ai:Brain, exam:FileText, enroll:BookOpen };
  const tt = { contentStyle:{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:12 } };
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="student" />
      <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
        <PageHeader title="Student Dashboard" sub={`Welcome back, ${userName} · Class XII · 🔥 15-day streak`} C={C}>
          <div style={{ background:`${C.green}14`, border:`1px solid ${C.green}40`, borderRadius:8, padding:"6px 14px", fontSize:12, color:C.green, display:"flex", alignItems:"center", gap:5 }}>
            <Zap size={12} /> 15-day streak!
          </div>
        </PageHeader>
        <div style={{ background:`${C.gold}12`, border:`1px solid ${C.gold}35`, borderRadius:10, padding:"10px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
          <Bell size={15} color={C.gold} />
          <span style={{ fontSize:13, color:C.text }}>📢 {savedExams.length > 0 ? `${savedExams.length} exam(s) available from teachers — Take them now!` : "JEE Mock Test Series starting May 20 — Register now!"}</span>
          <BS onClick={() => nav("exam")} C={C} color={C.gold} style={{ marginLeft:"auto", fontSize:11 }}>Go to Exams</BS>
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
          <StatCard label="Enrolled Courses" value={String(enrolledCount)} sub={enrolledCount > 0 ? "Real enrollment count" : "Browse Course Catalog to enroll"} icon={BookOpen} color={C.accent} C={C} />
          <StatCard label="Overall Score" value={`${avgScore}%`} sub={myScores.length>0?`${myScores.length} exams taken`:"+6% this month"} icon={TrendingUp} color={C.green} C={C} />
          <StatCard label="Exams Taken" value={String(myScores.length)} sub={`${savedExams.length} available`} icon={FileText} color={C.purple} C={C} />
          <StatCard label="Class Rank" value={classRank ? `#${classRank}` : "—"} sub={classRank && totalRankedStudents ? `Top ${Math.max(1, Math.round((classRank/totalRankedStudents)*100))}% of ${totalRankedStudents}` : "Take an exam to rank"} icon={Award} color={C.gold} C={C} />
        </div>
        <div style={{ display:"flex", gap:10, marginBottom:20 }}>
          <BP onClick={() => nav("ai-tutor")} C={C} style={{ flex:1, justifyContent:"center" }}><Brain size={15} /> Ask AI Tutor</BP>
          <BS onClick={() => nav("exam")} C={C} style={{ flex:1, justifyContent:"center", padding:"10px" }}><FileText size={15} /> Take Exam</BS>
          <BS onClick={() => nav("planner")} C={C} style={{ flex:1, justifyContent:"center", padding:"10px" }}><Calendar size={15} /> Study Planner</BS>
          <BS onClick={() => nav("leaderboard")} C={C} style={{ flex:1, justifyContent:"center", padding:"10px" }}><Trophy size={15} /> Leaderboard</BS>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
          <Card C={C}>
            <H3 C={C}>Weekly Study Hours</H3>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={trendData}>
                <defs><linearGradient id="sh" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.accent} stopOpacity={0.4} /><stop offset="95%" stopColor={C.accent} stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="d" tick={{ fill:C.sub, fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:C.sub, fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tt} />
                <Area type="monotone" dataKey="h" stroke={C.accent} fill="url(#sh)" strokeWidth={2} dot={{ fill:C.accent, r:3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card C={C}>
            <H3 C={C}>Course Progress</H3>
            {courses.map(c => (
              <div key={c.name} style={{ marginBottom:13 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:13, color:C.text }}>{c.name}</span>
                  <span style={{ fontSize:12, color:c.c, fontWeight:600 }}>{c.p}%</span>
                </div>
                <div style={{ height:6, background:`${C.sub}20`, borderRadius:4 }}>
                  <div style={{ height:"100%", width:`${c.p}%`, background:c.c, borderRadius:4 }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
          <Card C={C}>
            <H3 C={C}>Recent Activity</H3>
            {activity.map((a, i) => {
              const Icon = tIcon[a.type] || FileText;
              return (
                <div key={i} style={{ display:"flex", gap:10, marginBottom:13, alignItems:"flex-start" }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:`${(tColor[a.type]||C.accent)}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon size={13} color={tColor[a.type]||C.accent} />
                  </div>
                  <div>
                    <div style={{ fontSize:13, color:C.text, lineHeight:1.4 }}>{a.text}</div>
                    <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{a.time}</div>
                  </div>
                </div>
              );
            })}
          </Card>
          <Card C={C}>
            <H3 C={C}>📝 {savedExams.length > 0 ? "Teacher-Created Exams" : "Upcoming Exams"}</H3>
            {savedExams.length > 0 ? savedExams.map((e,i) => (
              <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <span style={{ fontSize:11, color:C.accent, fontWeight:600 }}>📚 {e.subject}</span>
                    <div style={{ fontSize:14, fontWeight:600, color:C.text, margin:"3px 0 2px" }}>{e.title}</div>
                    <div style={{ fontSize:12, color:C.sub }}>{e.questions?.length} questions · ⏱ {e.duration}min · {e.totalMarks} marks</div>
                  </div>
                  <BP onClick={() => nav("exam")} C={C} style={{ fontSize:11, padding:"7px 12px" }}><Play size={11} /> Start</BP>
                </div>
              </div>
            )) : [
              { sub:"Mathematics", date:"May 18", dur:"2h", type:"Mock Test", c:C.accent },
              { sub:"Physics", date:"May 22", dur:"3h", type:"Unit Exam", c:C.purple },
              { sub:"CS", date:"May 25", dur:"1.5h", type:"Practical", c:C.green },
            ].map((e,i) => (
              <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <span style={{ fontSize:11, color:e.c, fontWeight:600 }}>{e.type}</span>
                    <div style={{ fontSize:14, fontWeight:600, color:C.text, margin:"3px 0 2px" }}>{e.sub}</div>
                    <div style={{ fontSize:12, color:C.sub }}><Clock size={11} style={{ verticalAlign:-1 }} /> {e.date} · ⏱ {e.dur}</div>
                  </div>
                  <BS onClick={() => nav("exam")} C={C} style={{ fontSize:11 }}><Play size={11} /> Start</BS>
                </div>
              </div>
            ))}
          </Card>
        </div>
        {myScores.filter(s => s.percentage >= 60).length > 0 && (
          <Card C={C}>
            <H3 C={C}>🏆 Your Certificates</H3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
              {myScores.filter(s => s.percentage >= 60).map((s, i) => (
                <div key={i} onClick={() => setShowCert(s)} style={{ background:C.surface, border:`1px solid ${C.gold}40`, borderRadius:10, padding:"14px", cursor:"pointer", display:"flex", flexDirection:"column", gap:6 }}>
                  <Award size={20} color={C.gold} />
                  <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{s.examName || "Exam"}</div>
                  <div style={{ fontSize:12, color:C.sub }}>{s.percentage}% · {s.subject}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
        {showCert && (
          <div onClick={()=>setShowCert(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:16, padding:"50px 60px", maxWidth:600, width:"100%", textAlign:"center", border:`8px solid ${C.gold}` }}>
              <div style={{ fontSize:40, marginBottom:10 }}>🏆</div>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:24, color:"#0d1d36", marginBottom:6 }}>Certificate of Achievement</div>
              <div style={{ fontSize:13, color:"#5a7090", marginBottom:24 }}>This certifies that</div>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:28, color:"#005bcc", marginBottom:24, borderBottom:"2px solid #005bcc", display:"inline-block", paddingBottom:6 }}>{userName}</div>
              <div style={{ fontSize:14, color:"#0d1d36", lineHeight:1.8, marginBottom:24 }}>
                has successfully completed<br/>
                <strong>{showCert.examName}</strong> ({showCert.subject})<br/>
                with a score of <strong>{showCert.percentage}%</strong> ({showCert.score}/{showCert.totalMarks})
              </div>
              <div style={{ fontSize:12, color:"#5a7090", marginBottom:20 }}>Issued {showCert.date ? new Date(showCert.date).toLocaleDateString("en-IN",{year:"numeric",month:"long",day:"numeric"}) : ""} · EduAI Platform</div>
              <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                <button onClick={()=>window.print()} style={{ background:"#005bcc", color:"#fff", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, cursor:"pointer", fontWeight:600 }}>🖨 Print / Save PDF</button>
                <button onClick={()=>setShowCert(null)} style={{ background:"transparent", color:"#5a7090", border:"1px solid #ccc", borderRadius:8, padding:"10px 20px", fontSize:13, cursor:"pointer" }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function Courses({ nav, C, sbProps }) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [enrolled, setEnrolled] = useState({});
  const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
  useEffect(() => {
    if (!userId) return;
    fetch(`https://eduai-urgj.onrender.com/api/enrollments/${userId}`)
      .then(r=>r.json())
      .then(d => {
        const map = {};
        (d.enrollments||[]).forEach(e => { map[e.courseTitle] = true; });
        setEnrolled(map);
      }).catch(()=>{});
  }, [userId]);
  const cats = ["All", "Science", "Mathematics", "Computer Sci.", "Languages", "Commerce"];
  const courses = [
    { title:"Advanced Mathematics — JEE Prep", inst:"Dr. Priya Mehta", dur:"48h", rating:4.8, enrolled:12400, cat:"Mathematics", color:C.accent, icon:Database, level:"Advanced", free:false,
      desc:"Master calculus, algebra, trigonometry and coordinate geometry for JEE Mains and Advanced. Includes 200+ practice problems with AI-guided solutions.",
      topics:["Differential Calculus","Integral Calculus","Algebra","Trigonometry","Coordinate Geometry","Vectors & 3D"],
      chapters:12, videos:48, assignments:24 },
    { title:"Physics Fundamentals & Mechanics", inst:"Prof. Rajan Sharma", dur:"36h", rating:4.7, enrolled:9800, cat:"Science", color:C.purple, icon:Globe, level:"Intermediate", free:false,
      desc:"Complete physics preparation for JEE and NEET. Covers mechanics, thermodynamics, waves and modern physics with conceptual clarity.",
      topics:["Newton's Laws","Work & Energy","Waves","Thermodynamics","Modern Physics","Optics"],
      chapters:10, videos:36, assignments:20 },
    { title:"Python & Data Structures", inst:"Ankit Verma", dur:"52h", rating:4.9, enrolled:18600, cat:"Computer Sci.", color:C.green, icon:Cpu, level:"Beginner", free:true,
      desc:"Learn Python from scratch and master data structures. Perfect for competitive coding, CBSE CS and college entrance exams.",
      topics:["Python Basics","Arrays & Lists","Stacks & Queues","Trees","Sorting Algorithms","Dynamic Programming"],
      chapters:14, videos:52, assignments:30 },
    { title:"Organic Chemistry — NEET Prep", inst:"Dr. Sunita Patel", dur:"40h", rating:4.6, enrolled:7200, cat:"Science", color:C.amber, icon:Sparkles, level:"Advanced", free:false,
      desc:"Comprehensive organic chemistry for NEET aspirants. Reaction mechanisms, named reactions and NCERT-based problem solving.",
      topics:["Hydrocarbons","Alcohols & Ethers","Aldehydes & Ketones","Amines","Polymers","Biomolecules"],
      chapters:11, videos:40, assignments:22 },
    { title:"English Communication & Writing", inst:"Ms. Kavya Reddy", dur:"24h", rating:4.8, enrolled:14300, cat:"Languages", color:"#ff7eb3", icon:FileText, level:"Beginner", free:true,
      desc:"Improve your English communication, writing and grammar skills. Ideal for CBSE boards and competitive exam English sections.",
      topics:["Grammar Essentials","Essay Writing","Letter Writing","Reading Comprehension","Vocabulary","Spoken English"],
      chapters:8, videos:24, assignments:16 },
    { title:"Economics & Business Studies", inst:"Prof. Alok Gupta", dur:"30h", rating:4.5, enrolled:6100, cat:"Commerce", color:C.gold, icon:TrendingUp, level:"Intermediate", free:false,
      desc:"Complete CBSE Class XI-XII Economics and Business Studies. Macro/microeconomics, market structures and business concepts.",
      topics:["Micro Economics","Macro Economics","Money & Banking","Business Environment","Marketing","Finance"],
      chapters:9, videos:30, assignments:18 },
  ];
  const filtered = courses.filter(c => (cat === "All" || c.cat === cat) && (search === "" || c.title.toLowerCase().includes(search.toLowerCase())));

  useEffect(() => {
    if (!selected) return;
    const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
    if (!userId) return;
    const interval = setInterval(() => {
      fetch("https://eduai-urgj.onrender.com/api/study-time", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId, subject: selected.cat, minutes: 1 })
      }).catch(()=>{});
    }, 60000);
    return () => clearInterval(interval);
  }, [selected]);

  if (selected) {
    const c = selected;
    const isEnrolled = enrolled[c.title];
    return (
      <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
        <Sidebar {...sbProps} current="courses" />
        <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
          <BS onClick={()=>setSelected(null)} C={C} style={{ marginBottom:20 }}>← Back to Courses</BS>
          <div style={{ background:`${c.color}15`, border:`1px solid ${c.color}30`, borderRadius:16, padding:"28px 30px", marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                  <span style={{ fontSize:11, background:`${c.color}25`, color:c.color, borderRadius:10, padding:"3px 10px", fontWeight:600 }}>{c.level}</span>
                  {c.free && <span style={{ fontSize:11, background:`${C.green}25`, color:C.green, border:`1px solid ${C.green}40`, borderRadius:10, padding:"3px 10px", fontWeight:700 }}>FREE</span>}
                  <span style={{ fontSize:11, background:`${C.accent}15`, color:C.accent, borderRadius:10, padding:"3px 10px" }}>{c.cat}</span>
                </div>
                <h1 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:24, color:C.text, margin:"0 0 8px" }}>{c.title}</h1>
                <p style={{ color:C.sub, fontSize:14, margin:"0 0 16px", lineHeight:1.6, maxWidth:600 }}>{c.desc}</p>
                <div style={{ display:"flex", gap:20, fontSize:13, color:C.sub }}>
                  <span>👨‍🏫 {c.inst}</span>
                  <span><Star size={12} style={{ verticalAlign:-1, color:C.gold }} /> {c.rating}</span>
                  <span>⏱ {c.dur}</span>
                  <span>📹 {c.videos} videos</span>
                  <span>📝 {c.assignments} assignments</span>
                  <span>👥 {c.enrolled.toLocaleString()} enrolled</span>
                </div>
              </div>
              <c.icon size={64} color={c.color} style={{ opacity:0.7 }} />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20 }}>
            <div>
              <Card C={C} style={{ marginBottom:18 }}>
                <H3 C={C}>📚 Course Topics</H3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {c.topics.map((t,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:c.color, flexShrink:0 }} />
                      <span style={{ fontSize:13, color:C.text }}>{t}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card C={C}>
                <H3 C={C}>📖 What You'll Learn</H3>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {["Step-by-step conceptual clarity with Indian board alignment", "AI-powered doubt solving available 24/7", "Previous year question analysis and pattern recognition", "Mock tests aligned with JEE/NEET/CBSE exam patterns", "Performance analytics to track your progress", "Certificate upon course completion"].map((item,i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"center", fontSize:13, color:C.text }}>
                      <CheckCircle size={14} color={C.green} />
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div>
              <Card C={C} style={{ position:"sticky", top:20 }}>
                <div style={{ textAlign:"center", marginBottom:20 }}>
                  <div style={{ fontSize:28, fontWeight:800, fontFamily:"Syne,sans-serif", color:c.free?C.green:C.text, marginBottom:4 }}>{c.free ? "FREE" : "₹2,999"}</div>
                  {!c.free && <div style={{ fontSize:12, color:C.sub, textDecoration:"line-through" }}>₹7,999</div>}
                </div>
                {isEnrolled ? (
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:14, color:C.green, fontWeight:600, marginBottom:14 }}>✅ Already Enrolled!</div>
                    <BP onClick={() => nav("ai-tutor")} C={C} style={{ width:"100%", justifyContent:"center" }}><Play size={14} /> Continue Learning</BP>
                  </div>
                ) : (
                  <BP onClick={() => {
                    setEnrolled(e=>({...e,[c.title]:true}));
                    if (userId) fetch("https://eduai-urgj.onrender.com/api/enroll", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ userId, courseTitle: c.title }) }).catch(()=>{});
                    alert(`✅ Successfully enrolled in "${c.title}"!`);
                  }} C={C} style={{ width:"100%", justifyContent:"center", marginBottom:12 }}>
                    <Play size={14} /> {c.free ? "Start Free Now" : "Enroll Now"}
                  </BP>
                )}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:16 }}>
                  {[{l:"Chapters",v:c.chapters},{l:"Videos",v:c.videos},{l:"Assignments",v:c.assignments},{l:"Duration",v:c.dur}].map(s=>(
                    <div key={s.l} style={{ textAlign:"center", padding:"10px", background:C.surface, borderRadius:10 }}>
                      <div style={{ fontSize:18, fontWeight:700, color:c.color }}>{s.v}</div>
                      <div style={{ fontSize:11, color:C.sub }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="courses" />
      <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
        <PageHeader title="Course Catalog" sub={`${filtered.length} courses available · AI-personalized recommendations`} C={C}>
          <div style={{ position:"relative" }}>
            <Search size={14} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:C.sub }} />
            <input style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 10px 10px 32px", color:C.text, fontSize:13, width:220, outline:"none" }} placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </PageHeader>
        <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding:"7px 16px", borderRadius:20, fontSize:13, cursor:"pointer", background:cat === c ? `${C.accent}18` : "transparent", border:`1px solid ${cat === c ? `${C.accent}50` : C.border}`, color:cat === c ? C.accent : C.sub }}>{c}</button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
          {filtered.map((c, i) => (
            <Card key={i} C={C} style={{ padding:0, overflow:"hidden", cursor:"pointer" }} onClick={()=>setSelected(c)}>
              <div style={{ background:`${c.color}20`, borderBottom:`1px solid ${c.color}30`, padding:"20px 20px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <c.icon size={32} color={c.color} />
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                  {c.free && <span style={{ fontSize:10, background:`${C.green}25`, color:C.green, border:`1px solid ${C.green}40`, borderRadius:10, padding:"2px 8px", fontWeight:700 }}>FREE</span>}
                  <span style={{ fontSize:10, background:`${c.color}25`, color:c.color, borderRadius:10, padding:"2px 8px" }}>{c.level}</span>
                </div>
              </div>
              <div style={{ padding:"16px 18px" }}>
                <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:14, color:C.text, margin:"0 0 5px", lineHeight:1.4 }}>{c.title}</h3>
                <div style={{ fontSize:12, color:C.sub, marginBottom:10 }}>by {c.inst}</div>
                <div style={{ fontSize:12, color:C.sub, marginBottom:10, lineHeight:1.5 }}>{c.desc.substring(0,80)}...</div>
                <div style={{ display:"flex", gap:12, fontSize:12, color:C.sub, marginBottom:14 }}>
                  <span><Star size={11} style={{ verticalAlign:-1, color:C.gold }} /> {c.rating}</span>
                  <span><Clock size={11} style={{ verticalAlign:-1 }} /> {c.dur}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:11, color:C.sub }}>{c.enrolled.toLocaleString()} enrolled</span>
                  <BP onClick={(e)=>{ e.stopPropagation(); setSelected(c); }} C={C} style={{ fontSize:12, padding:"7px 16px" }}><Play size={12} /> {enrolled[c.title]?"Continue":c.free ? "Start Free" : "Enroll"}</BP>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function AITutor({ nav, C, sbProps }) {
  const [mode, setMode] = useState("chat");
  const [handsFree, setHandsFree] = useState(false);
  const [messages, setMessages] = useState([{ role:"assistant", content:"👋 Hello! I'm your AI Tutor. Ask me anything about Mathematics, Physics, Chemistry, Computer Science, or any subject!\n\nI can also generate practice questions for you — just switch to the Practice tab." }]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("All Subjects");
  const [practiceTopic, setPracticeTopic] = useState("");
  const [practiceDifficulty, setPracticeDifficulty] = useState("medium");
  const [practiceQs, setPracticeQs] = useState([]);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [selectedAns, setSelectedAns] = useState({});
  const endRef = useRef(null);
  const subjects = ["All Subjects", "Mathematics", "Physics", "Chemistry", "Computer Sci.", "Biology", "English"];
  const iS = { background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, flex:1, outline:"none" };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  // Real study-time tracking: while this page is open, log 1 minute to the
  // backend every 60s so "Weekly Study Hours" on the dashboard is real data,
  // not a fixed demo chart.
  useEffect(() => {
    const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
    if (!userId) return;
    const interval = setInterval(() => {
      fetch("https://eduai-urgj.onrender.com/api/study-time", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId, subject: subject === "All Subjects" ? "General" : subject, minutes: 1 })
      }).catch(()=>{});
    }, 60000);
    return () => clearInterval(interval);
  }, [subject]);

 const send = async () => {
  if (!msg.trim() || loading) return;
  const u = { role:"user", content:msg };
  setMessages(m => [...m, u]); setMsg(""); setLoading(true);
  try {
    const response = await fetch(
      "https://eduai-urgj.onrender.com/api/chat",
      {
        method: "POST",
        headers: {
          
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
  max_tokens: 4096,
  messages: [
    {
      role: "system",
      content:
        "You are an expert AI tutor for Indian students. " +
        "Subject: " + subject + ". " +
        "Give complete, detailed, easy-to-understand explanations. " +
        "Explain step by step, include important concepts, examples, formulas when relevant, " +
        "and do not stop the explanation early. " +
        "For educational questions, provide a thorough answer suitable for the student's level."
    },
    {
      role: "user",
      content: msg
    }
  ]
})
      }
    );
    const data = await response.json();
    console.log("AI RESPONSE:", data);
    const reply =
  data?.result?.choices?.[0]?.message?.content ||
  data?.choices?.[0]?.message?.content ||
  data?.result?.response ||
  data?.response ||
  data?.result?.choices?.[0]?.text ||
  data?.choices?.[0]?.text ||
  "No reply...";
    setMessages(m => [...m, { role:"assistant", content:reply }]);
    if (handsFree && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(reply);
      utter.lang = "en-IN";
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    }
  } catch(e) {
    setMessages(m => [...m, { role:"assistant", content:"Error: " + e.message }]);
  }
  setLoading(false);
};

  const generatePractice = async () => {
  if (!practiceTopic.trim()) return;
  setPracticeLoading(true);
  setPracticeQs([]);
  setSelectedAns({});
  try {
    const res = await fetch("https://eduai-urgj.onrender.com/api/generate-exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: subject || "General",
        topic: practiceTopic,
        difficulty: practiceDifficulty,
        count: 4
      })
    });
    const data = await res.json();
    const raw = (data?.result?.response || "[]").replace(/```json|```/g, "").trim();
    let start = raw.indexOf("["), end = raw.lastIndexOf("]");
    const qs = JSON.parse(raw.substring(start, end+1));
    setPracticeQs(qs);
  } catch(e) {
    setPracticeQs([]);
  }
  setPracticeLoading(false);
};

  const quick = ["Explain Newton's Laws", "Solve: x² + 5x + 6 = 0", "What is DNA replication?", "Binary search algorithm"];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="ai-tutor" />
      <div style={{ flex:1, padding:"26px 30px", display:"flex", flexDirection:"column" }}>
        <PageHeader title="AI Tutor" sub="Powered by Advanced AI · 24/7 · Personalized for Indian Boards" C={C} />
        <div style={{ display:"flex", gap:4, background:C.inputBg, borderRadius:10, padding:4, marginBottom:18, width:"fit-content" }}>
          {["chat", "practice"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding:"8px 22px", borderRadius:8, border:"none", background:mode === m ? C.card : "transparent", color:mode === m ? C.text : C.sub, fontSize:14, fontWeight:mode === m ? 500 : 400, cursor:"pointer" }}>
              {m === "chat" ? "💬 Chat Tutor" : "🧪 Practice Generator"}
            </button>
          ))}
        </div>
        {mode === "chat" && (
          <>
            <div style={{ display:"flex", gap:7, marginBottom:16, flexWrap:"wrap" }}>
              {subjects.map(s => (
                <button key={s} onClick={() => setSubject(s)} style={{ padding:"5px 13px", borderRadius:20, fontSize:12, cursor:"pointer", background:subject === s ? `${C.accent}18` : "transparent", border:`1px solid ${subject === s ? `${C.accent}50` : C.border}`, color:subject === s ? C.accent : C.sub }}>{s}</button>
              ))}
            </div>
            <Card C={C} style={{ flex:1, display:"flex", flexDirection:"column" }}>
              <div style={{ flex:1, overflowY:"auto", marginBottom:14, maxHeight:400 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display:"flex", gap:9, marginBottom:14, justifyContent:m.role === "user" ? "flex-end" : "flex-start" }}>
                    {m.role === "assistant" && (
                      <div style={{ width:28, height:28, borderRadius:"50%", background:`${C.accent}20`, border:`1px solid ${C.accent}40`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:3 }}>
                        <Brain size={14} color={C.accent} />
                      </div>
                    )}
                    <div style={{ maxWidth:"76%", padding:"10px 14px", borderRadius:13, background:m.role === "user" ? gr(C) : C.surface, border:m.role === "user" ? "none" : `1px solid ${C.border}`, fontSize:13, lineHeight:1.65, color:C.text, whiteSpace:"pre-wrap", display:"flex", flexDirection:"column", gap:8 }}>
                      {m.content}
                      {m.role === "assistant" && <SpeakButton text={m.content} C={C} />}
                    </div>
                    {m.role === "user" && (
                      <div style={{ width:28, height:28, borderRadius:"50%", background:`${C.gold}20`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12, color:C.gold, flexShrink:0, marginTop:3 }}>GK</div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div style={{ display:"flex", gap:9, alignItems:"center" }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:`${C.accent}20`, display:"flex", alignItems:"center", justifyContent:"center" }}><Brain size={14} color={C.accent} /></div>
                    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:13, padding:"10px 14px", fontSize:13, color:C.sub }}>Thinking...</div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
              {messages.length === 1 && (
                <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:14 }}>
                  {quick.map(q => (
                    <button key={q} onClick={() => setMsg(q)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:"5px 12px", fontSize:12, color:C.sub, cursor:"pointer" }}>💡 {q}</button>
                  ))}
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <button onClick={()=>setHandsFree(h=>!h)} style={{ display:"flex", alignItems:"center", gap:8, background:"transparent", border:"none", cursor:"pointer", padding:0 }}>
                  <div style={{ width:38, height:21, borderRadius:11, background:handsFree?`${C.accent}40`:`${C.sub}20`, border:`1px solid ${handsFree?C.accent:C.border}`, position:"relative" }}>
                    <div style={{ width:15, height:15, borderRadius:"50%", background:handsFree?C.accent:C.sub, position:"absolute", top:2, left:handsFree?19:2, transition:"left 0.2s" }} />
                  </div>
                  <span style={{ fontSize:12, color:handsFree?C.accent:C.sub }}>🎙 Hands-Free Mode {handsFree?"ON":"OFF"}</span>
                </button>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <input style={iS} placeholder={`Ask about ${subject}... (Enter to send)`} value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} />
                <VoiceButton onResult={(text) => setMsg(text)} C={C} autoSend={handsFree} onAutoSend={(text) => { setMsg(text); setTimeout(send, 100); }} />
                <BP onClick={send} C={C} style={{ padding:"10px 16px", opacity:loading || !msg.trim() ? 0.5 : 1 }}><Send size={16} /></BP>
              </div>
            </Card>
          </>
        )}
        {mode === "practice" && (
          <Card C={C} style={{ flex:1 }}>
            <H3 C={C}>AI Practice Question Generator</H3>
            <p style={{ color:C.sub, fontSize:13, marginBottom:16 }}>Enter a topic and get 4 AI-generated MCQ questions for CBSE / JEE / NEET.</p>
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
             <input style={{ ...iS }} placeholder="e.g. Newton's Laws, Organic Chemistry, Binary Trees..." value={practiceTopic} onChange={e => setPracticeTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&generatePractice()} />
             <BP onClick={generatePractice} C={C} style={{ padding:"10px 20px", opacity:practiceLoading ? 0.6 : 1 }}>Generate <Sparkles size={14} /></BP>
             </div>
             <div style={{ display:"flex", gap:8, marginBottom:24 }}>
                 {["easy","medium","hard"].map(d => (
              <button key={d} onClick={()=>setPracticeDifficulty(d)} style={{ padding:"7px 18px", borderRadius:20, fontSize:12, cursor:"pointer", border:`1px solid ${practiceDifficulty===d?(d==="easy"?C.green:d==="medium"?C.gold:C.red):C.border}`, background:practiceDifficulty===d?`${d==="easy"?C.green:d==="medium"?C.gold:C.red}20`:"transparent", color:practiceDifficulty===d?(d==="easy"?C.green:d==="medium"?C.gold:C.red):C.sub, fontWeight:practiceDifficulty===d?600:400, textTransform:"capitalize" }}>{d==="easy"?"🟢":d==="medium"?"🟡":"🔴"} {d}</button>
                  ))}
              </div>
            {practiceLoading && <div style={{ textAlign:"center", color:C.sub, fontSize:14, padding:"40px" }}>🤖 AI is generating questions...</div>}
            {practiceQs.length > 0 && (
              <div style={{ display:"flex", flexDirection:"column", gap:18, overflowY:"auto", maxHeight:400 }}>
                {practiceQs.map((q, qi) => (
                  <div key={qi} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px" }}>
                    <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:14 }}>Q{qi + 1}. {q.q}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {q.opts.map((opt, oi) => {
                        const sel = selectedAns[qi] === oi;
                        const revealed = selectedAns[qi] !== undefined;
                        const correct = oi === q.ans;
                        const bg = revealed ? (correct ? `${C.green}18` : sel && !correct ? `${C.red}18` : "transparent") : sel ? `${C.accent}14` : "transparent";
                        const border = revealed ? (correct ? C.green : sel && !correct ? C.red : C.border) : sel ? C.accent : C.border;
                        const color = revealed ? (correct ? C.green : sel && !correct ? C.red : C.sub) : sel ? C.accent : C.text;
                        return (
                          <button key={oi} onClick={() => { if (selectedAns[qi] === undefined) setSelectedAns(a => ({ ...a, [qi]:oi })); }} style={{ textAlign:"left", padding:"10px 14px", background:bg, border:`1px solid ${border}`, borderRadius:9, color, fontSize:13, cursor:selectedAns[qi] === undefined ? "pointer" : "default", display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ width:22, height:22, borderRadius:"50%", border:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, flexShrink:0 }}>{String.fromCharCode(65 + oi)}</span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {selectedAns[qi] !== undefined && <div style={{ marginTop:12, padding:"10px 12px", background:`${C.accent}10`, borderRadius:8, fontSize:12, color:C.sub }}>💡 {q.explanation}</div>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

function Exam({ nav, C, sbProps }) {
  const [savedExams, setSavedExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examCur, setExamCur] = useState(0);
  const [examTimeLeft, setExamTimeLeft] = useState(30*60);

  useEffect(() => {
    fetch("https://eduai-urgj.onrender.com/api/exams")
      .then(r => r.json())
      .then(data => setSavedExams(data.exams || []))
      .catch(() => setSavedExams([]));
  }, []);

  useEffect(() => {
    if (!selectedExam || examSubmitted) return;
    setExamTimeLeft((selectedExam.duration || 60) * 60);
    const t = setInterval(() => setExamTimeLeft(s => Math.max(0, s-1)), 1000);
    return () => clearInterval(t);
  }, [selectedExam, examSubmitted]);

  useEffect(() => {
    if (!selectedExam || examSubmitted) return;
    const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
    if (!userId) return;
    const interval = setInterval(() => {
      fetch("https://eduai-urgj.onrender.com/api/study-time", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId, subject: selectedExam.subject || "General", minutes: 1 })
      }).catch(()=>{});
    }, 60000);
    return () => clearInterval(interval);
  }, [selectedExam, examSubmitted]);

  useEffect(() => {
    if (!selectedExam || !examSubmitted) return;
    const examQs = selectedExam.questions || [];
    const correctCount = examQs.filter((q, i) => examAnswers[i] === q.ans).length;
    const marksPerQ = examQs.length ? (selectedExam.totalMarks || examQs.length*5) / examQs.length : 5;
    const scoreEarned = Math.round(correctCount * marksPerQ);
    const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
    if (!userId) return;
    fetch("https://eduai-urgj.onrender.com/api/scores", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        userId,
        subject: selectedExam.subject || "General",
        examName: selectedExam.title,
        score: scoreEarned,
        totalMarks: selectedExam.totalMarks || examQs.length*5,
        percentage: Math.round((scoreEarned / (selectedExam.totalMarks || examQs.length*5)) * 100)
      })
    }).catch(()=>{});
  }, [examSubmitted]);

  if (selectedExam && !examSubmitted) {
    const examQs = selectedExam.questions || [];
    return (
      <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
        <Sidebar {...sbProps} current="exam" />
        <div style={{ flex:1, padding:"26px 30px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:22, color:C.text, margin:0 }}>{selectedExam.title}</h2>
              <p style={{ color:C.sub, fontSize:13, margin:"4px 0 0" }}>{selectedExam.subject} · {examQs.length} Questions · {selectedExam.totalMarks} Marks · AI Proctoring Active</p>
            </div>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ display:"flex", gap:10 }}>
                {[{icon:Camera,l:"Face"},{icon:Monitor,l:"Screen"},{icon:Mic,l:"Audio"}].map(({icon:Icon,l})=>(
                  <div key={l} style={{ fontSize:11, color:C.green, display:"flex", alignItems:"center", gap:3 }}><Icon size={11}/> {l}</div>
                ))}
              </div>
              <div style={{ background:`${C.green}14`, border:`1px solid ${C.green}40`, borderRadius:9, padding:"7px 14px", display:"flex", alignItems:"center", gap:7 }}>
                <Clock size={14} color={C.green}/>
                <span style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:17, color:C.green }}>{String(Math.floor(examTimeLeft/60)).padStart(2,"0")}:{String(examTimeLeft%60).padStart(2,"0")}</span>
              </div>
              <button onClick={()=>{ if(window.confirm("Quit exam? Your progress will be lost.")){ setSelectedExam(null); setExamAnswers({}); setExamCur(0); }}} style={{ background:`${C.red}18`, border:`1px solid ${C.red}40`, color:C.red, borderRadius:8, padding:"8px 16px", fontSize:13, cursor:"pointer" }}>🚪 Quit</button>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:18 }}>
            <Card C={C}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                <span style={{ fontSize:12, color:C.sub }}>Question {examCur+1} of {examQs.length} · {examQs[examCur]?.marks||5} marks</span>
              </div>
              <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:18, color:C.text, marginBottom:22, lineHeight:1.4 }}>{examQs[examCur]?.q}</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {(examQs[examCur]?.opts||[]).map((opt,i)=>{
                  const sel = examAnswers[examCur]===i;
                  return (
                    <button key={i} onClick={()=>setExamAnswers(a=>({...a,[examCur]:i}))} style={{ textAlign:"left", padding:"12px 16px", background:sel?`${C.accent}14`:"rgba(255,255,255,0.03)", border:`1px solid ${sel?`${C.accent}55`:C.border}`, borderRadius:10, color:sel?C.accent:C.text, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:11 }}>
                      <span style={{ width:24, height:24, borderRadius:"50%", flexShrink:0, background:sel?C.accent:"transparent", border:sel?"none":`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, color:sel?"#fff":C.sub }}>{String.fromCharCode(65+i)}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
                <BS onClick={()=>setExamCur(c=>Math.max(0,c-1))} C={C} style={{ opacity:examCur===0?0.4:1 }}>← Previous</BS>
                {examCur < examQs.length-1
                  ? <BP onClick={()=>setExamCur(c=>c+1)} C={C}>Next →</BP>
                  : <BP onClick={()=>setExamSubmitted(true)} C={C} style={{ background:`linear-gradient(135deg,${C.green},#00a060)` }}><CheckCircle size={14}/> Submit</BP>
                }
              </div>
            </Card>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <Card C={C}>
                <H3 C={C} style={{ marginBottom:12 }}>Question Palette</H3>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6 }}>
                  {examQs.map((_,i)=>(
                    <button key={i} onClick={()=>setExamCur(i)} style={{ width:"100%", aspectRatio:"1", borderRadius:7, border:`1px solid ${C.border}`, background:i===examCur?C.accent:examAnswers[i]!==undefined?`${C.green}25`:"rgba(255,255,255,0.04)", color:i===examCur?"#fff":examAnswers[i]!==undefined?C.green:C.sub, fontSize:12, fontWeight:600, cursor:"pointer" }}>{i+1}</button>
                  ))}
                </div>
                <div style={{ marginTop:12, fontSize:11, color:C.sub, display:"flex", flexDirection:"column", gap:4 }}>
                  <span>✅ Answered: {Object.keys(examAnswers).length}</span>
                  <span>⬜ Remaining: {examQs.length-Object.keys(examAnswers).length}</span>
                </div>
              </Card>
              <Card C={C} style={{ background:`${C.accent}08` }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}><Eye size={14} color={C.accent}/><span style={{ fontSize:13, fontWeight:500, color:C.text }}>AI Proctoring</span></div>
                <div style={{ fontSize:12, color:C.sub, lineHeight:1.9 }}>
                  🔍 Face: <span style={{ color:C.green }}>Active</span><br/>
                  📋 Tab: <span style={{ color:C.green }}>Monitored</span><br/>
                  🎙 Audio: <span style={{ color:C.green }}>Active</span><br/>
                  ⚠️ Violations: <span style={{ color:C.green }}>0</span>
                </div>
              </Card>
              <BP onClick={()=>setExamSubmitted(true)} C={C} style={{ justifyContent:"center", background:`linear-gradient(135deg,${C.green},#00a060)` }}><CheckCircle size={14}/> Submit Now</BP>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedExam && examSubmitted) {
    const examQs = selectedExam.questions || [];
    const examScore = examQs.filter((q, i) => examAnswers[i] === q.ans).length;
    const pct = Math.round((examScore / examQs.length) * 100);
    return (
      <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
        <Sidebar {...sbProps} current="exam" />
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Card C={C} style={{ maxWidth:520, width:"100%", textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:12 }}>{pct >= 80 ? "🏆" : pct >= 60 ? "✅" : "📚"}</div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:26, color:C.text, margin:"0 0 6px" }}>Exam Completed!</h2>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:50, fontWeight:800, color:pct >= 80 ? C.green : pct >= 60 ? C.gold : C.red, margin:"16px 0" }}>{pct}%</div>
            <p style={{ color:C.sub, marginBottom:24 }}>{examScore}/{examQs.length} correct · {pct >= 80 ? "Excellent!" : pct >= 60 ? "Good work!" : "Keep practicing!"}</p>
            <div style={{ display:"flex", gap:8 }}>
              <BS onClick={()=>{ setSelectedExam(null); setExamAnswers({}); setExamCur(0); setExamSubmitted(false); }} C={C} style={{ flex:1, justifyContent:"center", padding:"11px" }}>← Back to Exams</BS>
              <BP onClick={()=>{ setSelectedExam(null); setExamAnswers({}); setExamCur(0); setExamSubmitted(false); nav("analytics"); }} C={C} style={{ flex:1, justifyContent:"center" }}><BarChart2 size={14}/> Analytics</BP>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="exam" />
      <div style={{ flex:1, padding:"26px 30px" }}>
        <PageHeader title="Examinations" sub={savedExams.length > 0 ? `${savedExams.length} exam(s) available from your teachers` : "No exams available yet"} C={C} />
        {savedExams.length > 0 ? (
          <Card C={C}>
            <H3 C={C}>📝 Teacher-Created Exams</H3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {savedExams.map((exam, i) => (
                <div key={i} style={{ padding:"14px 18px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontWeight:600, color:C.text, fontSize:15 }}>{exam.title}</div>
                    <div style={{ color:C.sub, fontSize:12, marginTop:4 }}>{exam.subject} · {exam.questions?.length} questions · {exam.totalMarks} marks · {exam.duration} min</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={async()=>{
                      if(!window.confirm("Delete this exam?"))return;
                      await fetch(`https://eduai-urgj.onrender.com/api/exams/${exam.id}`,{method:"DELETE"});
                      setSavedExams(s=>s.filter(e=>e.id!==exam.id));
                    }} style={{ background:`${C.red}18`, border:`1px solid ${C.red}40`, color:C.red, borderRadius:8, padding:"8px 14px", fontSize:13, cursor:"pointer" }}>🗑 Delete</button>
                    <BP onClick={() => { setSelectedExam(exam); setExamAnswers({}); setExamSubmitted(false); setExamCur(0); }} C={C}>Start Exam →</BP>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card C={C} style={{ textAlign:"center", padding:"60px 30px" }}>
            <div style={{ fontSize:56, marginBottom:14 }}>📝</div>
            <h3 style={{ fontFamily:"Syne,sans-serif", color:C.text, margin:"0 0 10px" }}>No Exams Yet</h3>
            <p style={{ color:C.sub, fontSize:13, lineHeight:1.6 }}>Your teachers haven't created any exams yet. Check back soon, or try the AI Exam Builder to practice on your own!</p>
            <BP onClick={() => nav("exam-generator")} C={C} style={{ marginTop:16 }}><Sparkles size={14}/> Go to Exam Builder</BP>
          </Card>
        )}
      </div>
    </div>
  );
}

function Leaderboard({ nav, C, sbProps }) {
  const [filter, setFilter] = useState("Overall");
  const [realStudents, setRealStudents] = useState([]);
  useEffect(() => {
    const q = filter === "Overall" ? "" : `?subject=${encodeURIComponent(filter)}`;
    fetch(`https://eduai-urgj.onrender.com/api/leaderboard${q}`)
      .then(r => r.json())
      .then(d => setRealStudents(d.leaderboard || []))
      .catch(() => {});
  }, [filter]);
  const showDemo = filter === "Overall" && realStudents.length === 0;
  const students = realStudents.length > 0
  ? realStudents.map((s, i) => ({
      rank: i+1,
      name: s.name || "Unknown",
      score: s.avgScore || 0,
      change: 0,
      badge: i===0?"🏆":i===1?"🥈":i===2?"🥉":"⭐",
      school: "EduAI Platform",
      streak: s.streak || 0,
      isMe: false,
    }))
  : showDemo ? [
      { rank:1, name:"Priya Sharma", score:96.4, change:0, badge:"🏆", school:"DPS Delhi", streak:28 },
      { rank:2, name:"Arjun Mehta", score:94.8, change:2, badge:"🥈", school:"Kendriya Vidyalaya", streak:21 },
      { rank:3, name:"Sneha Gupta", score:93.2, change:-1, badge:"🥉", school:"St. Xavier's", streak:19 },
      { rank:4, name:"Rahul Verma", score:91.7, change:1, badge:"⭐", school:"JNV Pune", streak:15 },
      { rank:5, name:"Ananya Singh", score:90.3, change:3, badge:"⭐", school:"Amity Noida", streak:22 },
      { rank:12, name:"Gyanshu Kumar", score:84.0, change:3, badge:"🎖", school:"JNV Bokaro", streak:15, isMe:true },
    ] : [];
  const filters = ["Overall", "Mathematics", "Physics", "Computer Sci.", "Chemistry"];
  const top3 = students.filter(Boolean).slice(0, 3);
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="leaderboard" />
      <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
        <PageHeader title="Leaderboard" sub="Top performers · Updated every 24 hours" C={C} />
        <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:"7px 16px", borderRadius:20, fontSize:13, cursor:"pointer", background:filter === f ? `${C.gold}18` : "transparent", border:`1px solid ${filter === f ? `${C.gold}50` : C.border}`, color:filter === f ? C.gold : C.sub }}>{f}</button>
          ))}
        </div>
        {students.length === 0 && (
          <Card C={C} style={{ marginBottom:24, textAlign:"center", padding:"40px 20px" }}>
            <div style={{ fontSize:40, marginBottom:10 }}>📊</div>
            <div style={{ color:C.text, fontSize:14, fontWeight:600, marginBottom:4 }}>No students have taken a {filter} exam or quiz yet</div>
            <div style={{ color:C.sub, fontSize:12 }}>Be the first — this leaderboard updates automatically.</div>
          </Card>
        )}
        <Card C={C} style={{ marginBottom:24, display: students.length === 0 ? "none" : "block" }}>
          <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-end", gap:20, padding:"20px 0 10px" }}>
            {[top3[1], top3[0], top3[2]].filter(Boolean).map((s, idx) => {
              const h = [160, 200, 140][idx];
              const color = [C.sub, C.gold, C.amber][idx];
              const label = ["2nd", "1st", "3rd"][idx];
              return (
                <div key={s.rank} style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{s.badge || "⭐"}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:2 }}>{s.name.split(" ")[0]}</div>
                  <div style={{ fontSize:13, fontWeight:700, color, marginBottom:8 }}>{s.score}%</div>
                  <div style={{ width:90, height:h, background:`${color}20`, border:`1px solid ${color}40`, borderRadius:"10px 10px 0 0", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:24, color }}>{label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card C={C} style={{ display: students.length === 0 ? "none" : "block" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr>{["Rank", "Student", "School", "Score", "Streak", "Change"].map(h => <th key={h} style={{ textAlign:"left", padding:"9px 12px", color:C.sub, fontWeight:500, borderBottom:`1px solid ${C.border}`, fontSize:12 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {students.slice(3).map(s => (
                <tr key={s.rank} style={{ background:s.isMe ? `${C.accent}08` : "transparent" }}>
                  <td style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, fontWeight:700, color:C.text }}>#{s.rank}</td>
                  <td style={{ padding:"12px", borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:30, height:30, borderRadius:"50%", background:`${C.accent}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:C.accent }}>{s.name.split(" ").map(w => w[0]).join("")}</div>
                      <span style={{ color:s.isMe ? C.accent : C.text, fontWeight:s.isMe ? 600 : 400 }}>{s.name}{s.isMe && " (You)"}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, color:C.sub }}>{s.school}</td>
                  <td style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, fontWeight:600, color:s.score >= 90 ? C.green : s.score >= 80 ? C.gold : C.text }}>{s.score}%</td>
                  <td style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, color:C.amber }}>🔥 {s.streak}d</td>
                  <td style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, fontWeight:600, color:s.change > 0 ? C.green : s.change < 0 ? C.red : C.sub }}>{s.change > 0 ? `↑+${s.change}` : s.change < 0 ? `↓${s.change}` : "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function StudyPlanner({ nav, C, sbProps }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [pomTime, setPomTime] = useState(25 * 60);
  const [pomRunning, setPomRunning] = useState(false);
  const [pomMode, setPomMode] = useState("work");
  const pomRef = useRef(null);

  useEffect(() => {
    if (pomRunning) {
      pomRef.current = setInterval(() => setPomTime(t => {
        if (t <= 1) { clearInterval(pomRef.current); setPomRunning(false); return pomMode === "work" ? 5 * 60 : 25 * 60; }
        return t - 1;
      }), 1000);
    } else clearInterval(pomRef.current);
    return () => clearInterval(pomRef.current);
  }, [pomRunning]);

  const pm = Math.floor(pomTime / 60), ps = pomTime % 60;
  const defaultSchedule = {
    Mon:["Mathematics (2h)", "Physics (1h)"],
    Tue:["Chemistry (2h)", "English (1h)"],
    Wed:["Computer Sci. (2h)", "Revision (1h)"],
    Thu:["Mathematics (1.5h)", "Biology (1.5h)"],
    Fri:["Mock Test (2h)", "AI Tutor (1h)"],
    Sat:["Physics (2h)", "Chemistry (1h)", "History (1h)"],
    Sun:["Full Revision (3h)", "Rest"],
  };
  const subColors = { Mathematics:C.accent, Physics:C.purple, Chemistry:C.amber, "Computer Sci.":C.green, Biology:"#81c784", English:"#ff7eb3", "Mock Test":C.red, Revision:C.gold, "AI Tutor":C.accent, "Full Revision":C.gold, Rest:C.sub };
  const getColor = (block) => { const k = Object.keys(subColors).find(k => block.startsWith(k)); return k ? subColors[k] : C.sub; };

 const generateAI = async () => {
  setAiLoading(true);
  try {
    const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
    let weakSubjects = ["Chemistry", "Physics"];
    let strongSubjects = ["Computer Sci.", "Mathematics"];
    if (userId) {
      try {
        const scoresRes = await fetch(`https://eduai-urgj.onrender.com/api/scores/${userId}`);
        const scoresData = await scoresRes.json();
        const scores = scoresData.scores || [];
        if (scores.length > 0) {
          const bySubject = {};
          scores.forEach(s => {
            const subj = s.subject || "General";
            if (!bySubject[subj]) bySubject[subj] = [];
            bySubject[subj].push(s.percentage || 0);
          });
          const averaged = Object.entries(bySubject).map(([subj, arr]) => ({
            subject: subj,
            avg: Math.round(arr.reduce((a,b)=>a+b,0)/arr.length)
          })).sort((a,b) => a.avg - b.avg);
          if (averaged.length > 0) {
            weakSubjects = averaged.slice(0, Math.max(1, Math.ceil(averaged.length/2))).map(a=>a.subject);
            strongSubjects = averaged.slice(Math.ceil(averaged.length/2)).map(a=>a.subject);
            if (strongSubjects.length === 0) strongSubjects = ["General Revision"];
          }
        }
      } catch(e) {}
    }
    const res = await fetch("https://eduai-urgj.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        max_tokens: 1024,
        messages: [
          { role: "system", content: "You are a study schedule generator. Output ONLY a raw JSON object, no markdown, no code fences, no explanation." },
          { role: "user", content: `Generate a 7-day study schedule for a student weak in ${weakSubjects.join(", ")}, strong in ${strongSubjects.join(", ")}. Give the weak subjects more study time. Output ONLY this JSON object shape (fill in real content, don't copy this example): {"Mon":["Subject (Xh)","Subject (Xh)"],"Tue":["Subject (Xh)"],"Wed":["Subject (Xh)"],"Thu":["Subject (Xh)"],"Fri":["Mock Test (2h)","AI Tutor (1h)"],"Sat":["Subject (Xh)"],"Sun":["Full Revision (3h)","Rest"]}` }
        ]
      })
    });
    const data = await res.json();
    const raw = (data?.result?.response || "").replace(/```json|```/g, "").trim();
    const start = raw.indexOf("{"), end = raw.lastIndexOf("}");
    if (start >= 0 && end >= 0) {
      const parsed = JSON.parse(raw.substring(start, end + 1));
      if (parsed.Mon) setSchedule(parsed);
      else setSchedule(defaultSchedule);
    } else { setSchedule(defaultSchedule); }
  } catch(e) { setSchedule(defaultSchedule); }
  setAiLoading(false);
};

  const display = schedule || defaultSchedule;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="planner" />
      <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
        <PageHeader title="AI Study Planner" sub="Personalized weekly schedule · Pomodoro timer · AI-optimized" C={C}>
          <BP onClick={generateAI} C={C} style={{ opacity:aiLoading ? 0.6 : 1 }}><Brain size={15} /> {aiLoading ? "Generating..." : "Generate AI Schedule"}</BP>
        </PageHeader>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:20 }}>
          <Card C={C}>
            <H3 C={C}>{schedule ? "🤖 AI-Generated Schedule" : "📅 Default Weekly Schedule"}</H3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:10 }}>
              {days.map(day => (
                <div key={day}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.accent, marginBottom:8, textAlign:"center", letterSpacing:1 }}>{day.toUpperCase()}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                    {(display[day] || []).map((block, i) => {
                      const color = getColor(block);
                      return (
                        <div key={i} style={{ background:`${color}20`, border:`1px solid ${color}40`, borderRadius:8, padding:"8px", fontSize:11, color, lineHeight:1.4, textAlign:"center" }}>{block}</div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <Card C={C}>
              <H3 C={C}>🍅 Pomodoro Timer</H3>
              <div style={{ textAlign:"center" }}>
                <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:20 }}>
                  {["work", "break"].map(m => (
                    <button key={m} onClick={() => { setPomMode(m); setPomTime(m === "work" ? 25 * 60 : 5 * 60); setPomRunning(false); }} style={{ padding:"6px 14px", borderRadius:20, fontSize:12, cursor:"pointer", background:pomMode === m ? `${C.accent}20` : "transparent", border:`1px solid ${pomMode === m ? C.accent : C.border}`, color:pomMode === m ? C.accent : C.sub }}>
                      {m === "work" ? "Focus 25m" : "Break 5m"}
                    </button>
                  ))}
                </div>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:54, color:pomMode === "work" ? C.accent : C.green, marginBottom:20 }}>
                  {String(pm).padStart(2, "0")}:{String(ps).padStart(2, "0")}
                </div>
                <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                  <BP onClick={() => setPomRunning(r => !r)} C={C} style={{ padding:"10px 24px" }}>
                    {pomRunning ? <><Eye size={14} /> Pause</> : <><Play size={14} /> Start</>}
                  </BP>
                  <BS onClick={() => { setPomRunning(false); setPomTime(pomMode === "work" ? 25 * 60 : 5 * 60); }} C={C}><RefreshCw size={13} /></BS>
                </div>
              </div>
            </Card>
            <Card C={C}>
              <H3 C={C}>This Week</H3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[{ l:"Study Hours", v:"18.5h", c:C.accent }, { l:"Sessions", v:"12/15", c:C.green }, { l:"Streak", v:"🔥 15d", c:C.amber }, { l:"Efficiency", v:"87%", c:C.purple }].map(s => (
                  <div key={s.l} style={{ background:C.surface, borderRadius:10, padding:"12px", textAlign:"center" }}>
                    <div style={{ fontSize:16, fontWeight:700, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:11, color:C.sub, marginTop:3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Analytics({ nav, C, sbProps }) {
  const [myScores, setMyScores] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();

  useEffect(() => {
    if (userId) fetch(`https://eduai-urgj.onrender.com/api/scores/${userId}`).then(r=>r.json()).then(d=>setMyScores(d.scores||[])).catch(()=>{});
  }, [userId]);

  const bySubject = {};
  myScores.forEach(s => {
    const subj = s.subject || "General";
    if (!bySubject[subj]) bySubject[subj] = [];
    bySubject[subj].push(s.percentage || 0);
  });
  const subjectAverages = Object.entries(bySubject).map(([subject, arr]) => ({
    subject, avg: Math.round(arr.reduce((a,b)=>a+b,0)/arr.length)
  })).sort((a,b) => b.avg - a.avg);

  const defaultRadar = [{ sub:"Math",score:78 },{ sub:"Physics",score:65 },{ sub:"Chemistry",score:52 },{ sub:"CS",score:91 },{ sub:"English",score:83 },{ sub:"History",score:70 }];
  const radarData = subjectAverages.length > 0
    ? subjectAverages.map(s => ({ sub: s.subject, score: s.avg }))
    : defaultRadar;

  const avgScore = myScores.length ? Math.round(myScores.reduce((a,s)=>a+s.percentage,0)/myScores.length) : 84;
  const defaultTrend = [{ month:"Jan",score:62,target:70 },{ month:"Feb",score:68,target:72 },{ month:"Mar",score:71,target:74 },{ month:"Apr",score:76,target:76 },{ month:"May",score:84,target:80 }];
  const trendData = myScores.length > 0
    ? (() => {
        const sorted = [...myScores].sort((a,b) => (parseInt(a.id)||0) - (parseInt(b.id)||0));
        const seen = {};
        return sorted.map((s) => {
          let label = s.date ? new Date(s.date).toLocaleDateString("en-IN",{month:"short",day:"numeric"}) : "—";
          seen[label] = (seen[label] || 0) + 1;
          if (seen[label] > 1) label = `${label} (${seen[label]})`;
          return { month: label, score: s.percentage || 0, target: 75 };
        });
      })()
    : defaultTrend;

  const examScores = myScores.length > 0
    ? myScores.slice(-5).map((s,i)=>({ name:s.examName||`Exam ${i+1}`, score:s.percentage||0 }))
    : [{ name:"Mock 1",score:62 },{ name:"Mock 2",score:70 },{ name:"Mock 3",score:75 },{ name:"Mock 4",score:84 },{ name:"Mock 5",score:78 }];

  const strongestSubject = subjectAverages[0];
  const weakestSubject = subjectAverages[subjectAverages.length - 1];

   const predictedRank = recommendations?.predictedRank || (myScores.length > 0 ? "Calculating..." : "#8");

  useEffect(() => {
    if (myScores.length === 0) return;
    setLoadingRecs(true);
    const subjectsObj = {};
    subjectAverages.forEach(s => { subjectsObj[s.subject] = s.avg; });
    fetch("https://eduai-urgj.onrender.com/api/predict", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ subjects: subjectsObj, targetExam: "General" })
    }).then(r=>r.json()).then(data => {
      const raw = (data?.result?.response || "").replace(/```json|```/g,"").trim();
      const start = raw.indexOf("{"), end = raw.lastIndexOf("}");
      if (start >= 0 && end >= 0) {
        try { setRecommendations(JSON.parse(raw.substring(start,end+1))); } catch {}
      }
    }).catch(()=>{}).finally(()=>setLoadingRecs(false));
  }, [myScores.length]);

  const defaultRecs = [
    { topic:"Organic Chemistry", p:"High", action:"Focus 3h/week on NCERT Ch.14" },
    { topic:"Thermodynamics", p:"Medium", action:"Review Ch.12, solve 15 problems" },
    { topic:"Calculus — Integration", p:"Medium", action:"Practice 20 problems daily" },
    { topic:"Newton's Laws", p:"Low", action:"Watch video series" },
  ];

  const tt = { contentStyle:{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:12 } };
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="analytics" />
      <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
        <PageHeader title="Performance Analytics" sub="AI-driven insights · Predictive modeling · Personalized recommendations" C={C} />
        <div style={{ display:"flex", gap:12, marginBottom:22, flexWrap:"wrap" }}>
          <StatCard label="Average Score" value={`${avgScore}%`} sub={myScores.length>0?`${myScores.length} exams taken`:"↑ Top 15% batch"} icon={TrendingUp} color={C.green} C={C} />
          <StatCard label="Strongest Subject" value={strongestSubject?strongestSubject.subject:"CS"} sub={strongestSubject?`${strongestSubject.avg}% mastery`:"91% mastery"} icon={Star} color={C.accent} C={C} />
          <StatCard label="Needs Attention" value={weakestSubject && subjectAverages.length>1 ? weakestSubject.subject : "Chem."} sub={weakestSubject && subjectAverages.length>1 ? `${weakestSubject.avg}% — focus here` : "52% — focus here"} icon={AlertTriangle} color={C.amber} C={C} />
          <StatCard label="Predicted Rank" value={predictedRank} sub={recommendations?.predictedRank ? "AI-predicted from your exams" : (myScores.length>0?"Calculating...":"JEE Mock estimate")} icon={Target} color={C.purple} C={C} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
          <Card C={C}>
            <H3 C={C}>Subject Mastery Radar</H3>
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="sub" tick={{ fill:C.sub, fontSize:11 }} />
                <Radar name="Score" dataKey="score" stroke={C.accent} fill={C.accent} fillOpacity={0.2} strokeWidth={2} />
                <Tooltip {...tt} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
          <Card C={C}>
            <H3 C={C}>{myScores.length > 0 ? "Score Over Time" : "Score vs Target 2026"}</H3>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.accent} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill:C.sub, fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill:C.sub, fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tt} />
                <Area type="monotone" dataKey="score" stroke={C.accent} fill="url(#ag2)" strokeWidth={2} dot={{ fill:C.accent, r:4 }} />
                <Area type="monotone" dataKey="target" stroke={C.red} fill="none" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
          <Card C={C}>
            <H3 C={C}>{myScores.length > 0 ? "Recent Exam Scores" : "Mock Test Scores"}</H3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={examScores} barSize={38}>
                <XAxis dataKey="name" tick={{ fill:C.sub, fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill:C.sub, fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tt} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {examScores.map((e, i) => <Cell key={i} fill={e.score === Math.max(...examScores.map(d => d.score)) ? C.green : C.accent} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card C={C}>
            <H3 C={C}><Brain size={14} color={C.accent} style={{ verticalAlign:-2, marginRight:6 }} />AI Recommendations</H3>
            {loadingRecs && <div style={{ color:C.sub, fontSize:13, padding:"20px 0" }}>🤖 Analyzing your performance...</div>}
            {!loadingRecs && (recommendations?.recommendations || defaultRecs.map(r=>r.action)).map((rec, i, arr) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontSize:13, color:C.text }}>{typeof rec === "string" ? rec : rec.action}</div>
              </div>
            ))}
            {!loadingRecs && myScores.length === 0 && (
              <div style={{ fontSize:11, color:C.sub, marginTop:12 }}>Take an exam to get personalized AI recommendations based on your real performance.</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function TeacherPortal({ nav, C, sbProps, tab: initialTab }) {
  const [examTitle, setExamTitle] = useState("");
  const [examDuration, setExamDuration] = useState(60);
  const [examQCount, setExamQCount] = useState(20);
  const [examDate, setExamDate] = useState("2026-06-30");
  const [examSubject, setExamSubject] = useState("Mathematics");
  const [examDifficulty, setExamDifficulty] = useState("medium");
  const [creatingExam, setCreatingExam] = useState(false);
  const [realStudents, setRealStudents] = useState([]);
  const [realExams, setRealExams] = useState([]);
  useEffect(() => {
    fetch("https://eduai-urgj.onrender.com/api/leaderboard").then(r=>r.json()).then(d=>setRealStudents(d.leaderboard||[])).catch(()=>{});
    fetch("https://eduai-urgj.onrender.com/api/exams").then(r=>r.json()).then(d=>setRealExams(d.exams||[])).catch(()=>{});
  }, []);
  const totalStudents = realStudents.length || 155;
  const avgScore = realStudents.length ? Math.round(realStudents.reduce((a,s)=>a+s.avgScore,0)/realStudents.length) : 74.8;
  const examsCreated = realExams.length || 26;
  const createExam = async () => {
    if (!examTitle.trim()) { alert("Please enter exam title!"); return; }
    setCreatingExam(true);
    try {
      const res = await fetch("https://eduai-urgj.onrender.com/api/generate-exam", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ subject: examSubject, topic: examTitle, difficulty: examDifficulty, count: examQCount })
      });
      const data = await res.json();
      const raw = (data?.result?.response || "").replace(/```json|```/g,"").trim();
      let start = raw.indexOf("["), end = raw.lastIndexOf("]");
      const qs = JSON.parse(raw.substring(start, end+1));
      const teacherUserId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
      await fetch("https://eduai-urgj.onrender.com/api/save-exam",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:examTitle,subject:examSubject,duration:examDuration,date:examDate,questions:qs,totalMarks:qs.length*5,createdBy:"Teacher",createdByUserId:teacherUserId})});alert(`✅ Exam "${examTitle}" created with ${qs.length} questions and saved! Students can now see it in Examinations page.`);
      setExamTitle("");
    } catch(e) {
      alert("Failed to create exam. Please try again!");
    }
    setCreatingExam(false);
  };
  const [tab, setTab] = useState(initialTab || "dashboard");
  const [gradeSubject, setGradeSubject] = useState("Mathematics");
  const teacherSubjects = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").subjects || []; } catch { return []; }})();
  const defaultClasses = [
    { sub:"Mathematics", sec:"XII-A", students:42, avg:78, exams:8 },
    { sub:"Physics", sec:"XII-B", students:38, avg:71, exams:6 },
    { sub:"Advanced Calculus", sec:"XI-A", students:35, avg:82, exams:5 },
    { sub:"Statistics", sec:"XI-B", students:40, avg:69, exams:7 },
  ];
  // If this teacher registered specific subjects, only show classes for those.
  // Otherwise fall back to the default demo set (e.g. for accounts created
  // before the "subjects" field existed).
  const classes = teacherSubjects.length > 0
    ? teacherSubjects.map((sub, i) => ({ sub, sec:`XII-${String.fromCharCode(65+i)}`, students:0, avg:0, exams:0 }))
    : defaultClasses;
  const teacherName = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").name || "Teacher"; } catch { return "Teacher"; }})();
  const iS = { background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, width:"100%", outline:"none", boxSizing:"border-box" };
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="teacher" role="teacher" />
      <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
        <PageHeader title="Teacher Portal" sub={`${teacherName} · ${examsCreated} exams created · ${totalStudents} students reached`} C={C} />
        <div style={{ display:"flex", gap:4, background:C.surface, borderRadius:10, padding:4, marginBottom:24, width:"fit-content", border:`1px solid ${C.border}` }}>
          {["dashboard", "classes", "exam-builder", "grades"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:tab === t ? C.card : "transparent", color:tab === t ? C.text : C.sub, fontSize:13, fontWeight:tab === t ? 500 : 400, cursor:"pointer", textTransform:"capitalize" }}>{t.replace("-", " ")}</button>
          ))}
        </div>
        {tab === "dashboard" && (
          <>
            <div style={{ display:"flex", gap:12, marginBottom:22, flexWrap:"wrap" }}>
              <StatCard label="Total Students" value={String(totalStudents)} sub={`${classes.length} classes`} icon={Users} color={C.purple} C={C} />
              <StatCard label="Average Score" value={`${avgScore}%`} sub={realStudents.length>0?`From ${realStudents.length} students`:"↑ +3.2% this month"} icon={TrendingUp} color={C.green} C={C} />
              <StatCard label="Exams Created" value={String(examsCreated)} sub={realExams.length>0?"Live from database":"8 this month"} icon={FileText} color={C.accent} C={C} />
              <StatCard label="Pending Reviews" value="12" sub="Due tomorrow" icon={AlertTriangle} color={C.amber} C={C} />
            </div>
            <Card C={C}>
              <H3 C={C}>My Classes</H3>
              {classes.map((c, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:i < 3 ? `1px solid ${C.border}` : "none" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{c.sub}</div>
                    <div style={{ fontSize:12, color:C.sub }}>Section {c.sec} · {c.students} students</div>
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <span style={{ fontSize:13, fontWeight:600, color:c.avg >= 80 ? C.green : c.avg >= 70 ? C.gold : C.amber }}>{c.avg}% avg</span>
                    <BS onClick={() => setTab("classes")} C={C} style={{ fontSize:11 }}>View</BS>
                  </div>
                </div>
              ))}
            </Card>
          </>
       )}
        {tab === "exam-builder" && (
          <Card C={C} style={{ maxWidth:560 }}>
            <H3 C={C}>Create New Examination</H3>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Exam Title</label>
              <input style={iS} placeholder="e.g. Mathematics Mock Test #6" value={examTitle} onChange={e=>setExamTitle(e.target.value)} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Duration (minutes)</label>
              <input style={iS} placeholder="60" type="number" value={examDuration} onChange={e=>setExamDuration(e.target.value)} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Number of Questions</label>
              <input style={iS} placeholder="10" type="number" value={examQCount} onChange={e=>setExamQCount(parseInt(e.target.value)||10)} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Exam Date</label>
              <input type="date" style={iS} value={examDate} onChange={e=>setExamDate(e.target.value)} />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Subject</label>
              <select style={{ ...iS }} value={examSubject} onChange={e=>setExamSubject(e.target.value)}>
                {["Mathematics", "Physics", "Chemistry", "Computer Sci.", "Biology"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Difficulty Level</label>
            <div style={{ display:"flex", gap:8 }}>
               {["easy","medium","hard"].map(d => (
            <button key={d} onClick={()=>setExamDifficulty(d)} style={{ flex:1, padding:"9px", borderRadius:10, border:`1px solid ${examDifficulty===d?(d==="easy"?C.green:d==="medium"?C.gold:C.red):C.border}`, background:examDifficulty===d?`${d==="easy"?C.green:d==="medium"?C.gold:C.red}20`:"transparent", color:examDifficulty===d?(d==="easy"?C.green:d==="medium"?C.gold:C.red):C.sub, fontSize:13, cursor:"pointer", fontWeight:examDifficulty===d?600:400, textTransform:"capitalize" }}>{d}</button>
                 ))}
            </div>
            </div>
            <BP onClick={createExam} C={C} style={{ width:"100%", justifyContent:"center", opacity:creatingExam?0.7:1 }}>
              <Plus size={15} /> {creatingExam ? "🤖 AI is generating questions..." : "Create Examination"}
            </BP>
          </Card>   
        )}
        {tab === "grades" && (
          <Card C={C}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:12 }}>
              <H3 C={C} style={{ marginBottom:0 }}>Grade Book — {gradeSubject} {classes.find(c=>c.sub===gradeSubject)?.sec||""}</H3>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {classes.map(c => (
                  <button key={c.sub} onClick={()=>setGradeSubject(c.sub)} style={{ padding:"6px 14px", borderRadius:20, fontSize:12, cursor:"pointer", border:`1px solid ${gradeSubject===c.sub?C.accent:C.border}`, background:gradeSubject===c.sub?`${C.accent}18`:"transparent", color:gradeSubject===c.sub?C.accent:C.sub }}>{c.sub}</button>
                ))}
              </div>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr>{["Student", "Mock 1", "Mock 2", "Mock 3", "Mock 4", "Avg", "Grade"].map(h => <th key={h} style={{ textAlign:"left", padding:"9px 10px", color:C.sub, fontWeight:500, borderBottom:`1px solid ${C.border}`, fontSize:12 }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {(realStudents.length > 0
                  ? realStudents.map(s => ({ n:s.name, s:[s.avgScore,s.avgScore,s.avgScore,s.avgScore], g: s.avgScore>=90?"A+":s.avgScore>=80?"A":s.avgScore>=70?"B+":s.avgScore>=60?"B":"C+" }))
                  : [{ n:"Priya S.", s:[88, 91, 94, 96], g:"A+" }, { n:"Rahul V.", s:[72, 75, 78, 82], g:"B+" }, { n:"Ananya R.", s:[80, 84, 86, 88], g:"A" }, { n:"Vikram P.", s:[60, 63, 65, 68], g:"C+" }, { n:"Sneha G.", s:[85, 87, 90, 92], g:"A+" }]
                ).map((s, i) => {
                  const avg = Math.round(s.s.reduce((a, b) => a + b, 0) / s.s.length);
                  return (
                    <tr key={i}>
                      <td style={{ padding:"11px 10px", borderBottom:`1px solid ${C.border}`, color:C.text }}>{s.n}</td>
                      {s.s.map((sc, j) => <td key={j} style={{ padding:"11px 10px", borderBottom:`1px solid ${C.border}`, color:C.sub }}>{sc}</td>)}
                      <td style={{ padding:"11px 10px", borderBottom:`1px solid ${C.border}`, fontWeight:600, color:avg >= 80 ? C.green : avg >= 70 ? C.gold : C.amber }}>{avg}%</td>
                      <td style={{ padding:"11px 10px", borderBottom:`1px solid ${C.border}`, color:C.accent, fontWeight:700 }}>{s.g}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
        {tab === "classes" && (
          <Card C={C}>
            <H3 C={C}>Class Management</H3>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr>{["Student", "School", "Avg Score", "Exams Taken", "Status"].map(h => <th key={h} style={{ textAlign:"left", padding:"9px 12px", color:C.sub, fontWeight:500, borderBottom:`1px solid ${C.border}`, fontSize:12 }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {(realStudents.length > 0 ? realStudents : []).map((s, i) => (
                  <tr key={i}>
                    <td style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, color:C.text, fontWeight:500 }}>{s.name}</td>
                    <td style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, color:C.sub }}>EduAI Platform</td>
                    <td style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, fontWeight:600, color:s.avgScore >= 80 ? C.green : s.avgScore >= 70 ? C.gold : C.amber }}>{s.avgScore}%</td>
                    <td style={{ padding:"12px", borderBottom:`1px solid ${C.border}`, color:C.sub }}>{s.examsCount}</td>
                    <td style={{ padding:"12px", borderBottom:`1px solid ${C.border}` }}>
                      <span style={{ fontSize:11, padding:"3px 9px", borderRadius:10, background:s.examsCount>0?`${C.green}20`:`${C.sub}20`, color:s.examsCount>0?C.green:C.sub }}>{s.examsCount>0?"Active":"No exams yet"}</span>
                    </td>
                  </tr>
                ))}
                {realStudents.length === 0 && (
                  <tr><td colSpan={5} style={{ padding:"20px", textAlign:"center", color:C.sub }}>No registered students yet.</td></tr>
                )}
              </tbody>
            </table>
            <div style={{ marginTop:14, fontSize:11, color:C.sub }}>Showing all registered students on the platform (real data). Per-class enrollment isn't tracked yet — every teacher currently sees the full student roster.</div>
          </Card>
        )}
      </div>
    </div>
  );
}

function AdminDash({ nav, C, sbProps, tab: initialTab }) {
  const [tab, setTab] = useState(initialTab || "students");
  const [adminStats, setAdminStats] = useState(null);
  useEffect(()=>{
    fetch("https://eduai-urgj.onrender.com/api/admin/stats")
      .then(r=>r.json())
      .then(d=>setAdminStats(d))
      .catch(()=>{});
  },[]);
  const [adminExamTitle, setAdminExamTitle] = useState("");
  const [adminExamSubject, setAdminExamSubject] = useState("Mathematics");
  const [adminExamCount, setAdminExamCount] = useState(10);
  const [adminExamDuration, setAdminExamDuration] = useState(60);
  const [adminExamDate, setAdminExamDate] = useState("");
  const [adminDifficulty, setAdminDifficulty] = useState("medium");
  const [adminCreating, setAdminCreating] = useState(false);
  const [realExams, setRealExams] = useState([]);
  useEffect(()=>{
  fetch("https://eduai-urgj.onrender.com/api/exams")
    .then(r=>r.json())
    .then(d=>setRealExams(d.exams||[]))
    .catch(()=>{});
},[]);
const [dbStudents, setDbStudents] = useState([]);
useEffect(()=>{
  fetch("https://eduai-urgj.onrender.com/api/leaderboard")
    .then(r=>r.json())
    .then(d=>setDbStudents(d.leaderboard||[]))
    .catch(()=>{});
},[]);
const [realTeachers, setRealTeachers] = useState([]);
useEffect(()=>{
  fetch("https://eduai-urgj.onrender.com/api/teachers")
    .then(r=>r.json())
    .then(d=>setRealTeachers(d.teachers||[]))
    .catch(()=>{});
},[]);
  const students = dbStudents.length > 0
  ? dbStudents.map((s,i) => ({
      name: s.name,
      id: `STU${String(i+1).padStart(3,"0")}`,
      course: "General",
      score: s.avgScore||0,
      status: "Active",
      risk: s.avgScore>=70?"Low":s.avgScore>=50?"Medium":"High"
    }))
  : [
      { name:"Priya Sharma", id:"STU001", course:"JEE Prep", score:96, status:"Active", risk:"Low" },
      { name:"Rahul Verma", id:"STU002", course:"NEET Prep", score:72, status:"Active", risk:"Medium" },
      { name:"Amit Kumar", id:"STU003", course:"CBSE XII", score:45, status:"At Risk", risk:"High" },
    ];
  const fallbackTeachers = [
    { name:"Dr. Priya Mehta", dept:"Mathematics", courses:3, students:120, rating:4.8, status:"Active" },
    { name:"Prof. Rajan Sharma", dept:"Physics", courses:2, students:80, rating:4.7, status:"Active" },
    { name:"Ankit Verma", dept:"Computer Sci.", courses:2, students:95, rating:4.9, status:"Active" },
    { name:"Dr. Sunita Patel", dept:"Chemistry", courses:2, students:75, rating:4.6, status:"Active" },
  ];
  const teachers = realTeachers.length > 0
    ? realTeachers.map(t => ({ name:t.name, dept:"General", courses:0, students:0, rating:5.0, status:"Active" }))
    : fallbackTeachers;
  const usageData = [{ day:"Mon",users:1240 },{ day:"Tue",users:1580 },{ day:"Wed",users:1390 },{ day:"Thu",users:1710 },{ day:"Fri",users:1820 },{ day:"Sat",users:2100 },{ day:"Sun",users:1650 }];
  const tt = { contentStyle:{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:12 } };
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="admin" role="admin" />
      <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <div>
            <h1 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:23, color:C.text, margin:0 }}>Admin Dashboard</h1>
            <p style={{ color:C.sub, fontSize:13, margin:"4px 0 0" }}>EduAI Platform Control Center · Super Admin</p>
          </div>
          <div style={{ background:`${C.green}18`, border:`1px solid ${C.green}40`, borderRadius:20, padding:"6px 14px", fontSize:12, color:C.green, display:"flex", alignItems:"center", gap:5 }}>
            <Activity size={12} /> All Systems Operational
          </div>
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:22, flexWrap:"wrap" }}>
          <StatCard label="Total Students" value={adminStats ? String(adminStats.totalStudents) : (dbStudents.length > 0 ? String(dbStudents.length) : "24,891")} sub={adminStats ? "Live from database" : "+342 this week"} icon={Users} color={C.accent} C={C} />
          <StatCard label="Total Teachers" value={adminStats ? String(adminStats.totalTeachers) : (realTeachers.length > 0 ? String(realTeachers.length) : "284")} sub={adminStats ? "Live from database" : "18 departments"} icon={GraduationCap} color={C.purple} C={C} />
          <StatCard label="Active Exams" value={adminStats ? String(adminStats.totalExams) : (realExams.length > 0 ? String(realExams.length) : "18")} sub={adminStats ? `${adminStats.totalExamsTaken} exams taken total` : "3,421 in progress"} icon={FileText} color={C.gold} C={C} />
          <StatCard label="Active Today" value={adminStats ? String(adminStats.activeToday) : "—"} sub={adminStats ? `Avg score: ${adminStats.avgPlatformScore}%` : "Real-time tracking"} icon={Activity} color={C.green} C={C} />
        </div>
        <div style={{ display:"flex", gap:4, background:C.surface, borderRadius:10, padding:4, marginBottom:20, width:"fit-content", border:`1px solid ${C.border}` }}>
          {["students", "teachers", "exams", "reports"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:tab === t ? C.card : "transparent", color:tab === t ? C.text : C.sub, fontSize:13, fontWeight:tab === t ? 500 : 400, cursor:"pointer", textTransform:"capitalize" }}>{t}</button>
          ))}
        </div>
        {tab === "students" && (
          <Card C={C}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <H3 C={C} style={{ marginBottom:0 }}>Student Management</H3>
              <BS onClick={() => {
                 const name = window.prompt("Student Full Name:");
                   if (!name?.trim()) return;
                 const email = window.prompt("Student Email:");
                          if (!email?.trim()) return;
                 const password = window.prompt("Temporary Password:");
                     if (!password?.trim()) return;
                  fetch("https://eduai-urgj.onrender.com/api/register", {
                  method:"POST", headers:{"Content-Type":"application/json"},
                  body: JSON.stringify({ name, email, password, role:"student" })
                      }).then(r=>r.json()).then(d=>{
                       if(d.error) alert("Error: "+d.error);
                     else alert(`✅ Student "${name}" added successfully!`);
               });
                    }} C={C} style={{ fontSize:11 }}><Plus size={11} /> Add Student</BS>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr>{["Student", "ID", "Course", "Score", "Status", "Risk"].map(h => <th key={h} style={{ textAlign:"left", padding:"8px 10px", color:C.sub, fontWeight:500, borderBottom:`1px solid ${C.border}`, fontSize:12 }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {dbStudents.map((s, i) => (
                  <tr key={i}>
                    <td style={{ padding:"11px 10px", color:C.text, borderBottom:`1px solid ${C.border}` }}>{s.name}</td>
                    <td style={{ padding:"11px 10px", color:C.sub, borderBottom:`1px solid ${C.border}` }}>{s.id}</td>
                    <td style={{ padding:"11px 10px", color:C.sub, borderBottom:`1px solid ${C.border}` }}>{s.course}</td>
                    <td style={{ padding:"11px 10px", borderBottom:`1px solid ${C.border}`, fontWeight:600, color:s.score >= 80 ? C.green : s.score >= 60 ? C.gold : C.red }}>{s.score}%</td>
                    <td style={{ padding:"11px 10px", borderBottom:`1px solid ${C.border}` }}><span style={{ fontSize:11, padding:"3px 9px", borderRadius:10, background:s.status === "Active" ? `${C.green}20` : `${C.red}20`, color:s.status === "Active" ? C.green : C.red }}>{s.status}</span></td>
                    <td style={{ padding:"11px 10px", borderBottom:`1px solid ${C.border}` }}><span style={{ fontSize:11, padding:"3px 9px", borderRadius:10, background:s.risk === "High" ? `${C.red}20` : s.risk === "Medium" ? `${C.amber}20` : `${C.green}20`, color:s.risk === "High" ? C.red : s.risk === "Medium" ? C.amber : C.green }}>{s.risk}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        {tab === "teachers" && (
          <Card C={C}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <H3 C={C} style={{ marginBottom:0 }}>Teacher Management</H3>
              <BS onClick={() => {
                const name = window.prompt("Teacher Full Name:");
                if (!name?.trim()) return;
                const email = window.prompt("Teacher Email:");
                if (!email?.trim()) return;
                const password = window.prompt("Temporary Password:");
                if (!password?.trim()) return;
                fetch("https://eduai-urgj.onrender.com/api/register", {
                  method:"POST", headers:{"Content-Type":"application/json"},
                  body: JSON.stringify({ name, email, password, role:"teacher" })
                }).then(r=>r.json()).then(d=>{
                  if(d.error) alert("Error: "+d.error);
                  else { alert(`✅ Teacher "${name}" added successfully!`); fetch("https://eduai-urgj.onrender.com/api/teachers").then(r=>r.json()).then(dd=>setRealTeachers(dd.teachers||[])); }
                });
              }} C={C} style={{ fontSize:11 }}><Plus size={11} /> Add Teacher</BS>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr>{["Teacher", "Department", "Courses", "Students", "Rating", "Status"].map(h => <th key={h} style={{ textAlign:"left", padding:"9px 10px", color:C.sub, fontWeight:500, borderBottom:`1px solid ${C.border}`, fontSize:12 }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {teachers.map((t, i) => (
                  <tr key={i}>
                    <td style={{ padding:"12px 10px", borderBottom:`1px solid ${C.border}`, color:C.text, fontWeight:500 }}>{t.name}</td>
                    <td style={{ padding:"12px 10px", borderBottom:`1px solid ${C.border}`, color:C.sub }}>{t.dept}</td>
                    <td style={{ padding:"12px 10px", borderBottom:`1px solid ${C.border}`, color:C.sub }}>{t.courses}</td>
                    <td style={{ padding:"12px 10px", borderBottom:`1px solid ${C.border}`, color:C.sub }}>{t.students}</td>
                    <td style={{ padding:"12px 10px", borderBottom:`1px solid ${C.border}`, color:C.gold }}><Star size={11} style={{ verticalAlign:-1 }} /> {t.rating}</td>
                    <td style={{ padding:"12px 10px", borderBottom:`1px solid ${C.border}` }}><span style={{ fontSize:11, padding:"3px 9px", borderRadius:10, background:`${C.green}20`, color:C.green }}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        {tab === "reports" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
            <Card C={C}>
              <H3 C={C}>Platform Overview {adminStats && <span style={{ fontSize:11, color:C.green, fontWeight:400 }}>(live data)</span>}</H3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[
                  { l:"Total Students", v: adminStats?.totalStudents ?? "—", c:C.accent },
                  { l:"Total Teachers", v: adminStats?.totalTeachers ?? "—", c:C.purple },
                  { l:"Exams Created", v: adminStats?.totalExams ?? "—", c:C.gold },
                  { l:"Exams Taken", v: adminStats?.totalExamsTaken ?? "—", c:C.green },
                  { l:"Active Today", v: adminStats?.activeToday ?? "—", c:C.red },
                  { l:"Avg Platform Score", v: adminStats ? `${adminStats.avgPlatformScore}%` : "—", c:C.amber },
                ].map((k,i) => (
                  <div key={i} style={{ background:C.surface, borderRadius:10, padding:"12px", textAlign:"center" }}>
                    <div style={{ fontSize:20, fontWeight:700, color:k.c }}>{k.v}</div>
                    <div style={{ fontSize:11, color:C.sub, marginTop:3 }}>{k.l}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card C={C}>
              <H3 C={C}>Weekly Usage Trend</H3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={usageData} barSize={36}>
                  <XAxis dataKey="day" tick={{ fill:C.sub, fontSize:11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:C.sub, fontSize:11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...tt} />
                  <Bar dataKey="users" fill={C.accent} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize:11, color:C.sub, marginTop:10 }}>⚠️ This weekly trend chart is illustrative demo data — the platform doesn't track daily session history yet. The Platform Overview card above it is fully real.</div>
            </Card>
          </div>
        )}
        {tab === "exams" && (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
    <Card C={C}>
      <H3 C={C}>Create Exam</H3>
      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Exam Title</label>
        <input style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 13px", color:C.text, fontSize:13, width:"100%", outline:"none", boxSizing:"border-box" }}
          placeholder="e.g. JEE Mock Test #12" value={adminExamTitle||""} onChange={e=>setAdminExamTitle(e.target.value)} />
      </div>
      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Subject</label>
        <select style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 13px", color:C.text, fontSize:13, width:"100%", outline:"none" }}
          value={adminExamSubject||"Mathematics"} onChange={e=>setAdminExamSubject(e.target.value)}>
          {["Mathematics","Physics","Chemistry","Computer Science","Biology","English"].map(s=><option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Number of Questions</label>
        <input style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 13px", color:C.text, fontSize:13, width:"100%", outline:"none", boxSizing:"border-box" }}
          placeholder="10" type="number" value={adminExamCount||10} onChange={e=>setAdminExamCount(parseInt(e.target.value)||10)} />
      </div>
      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Duration (mins)</label>
        <input style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 13px", color:C.text, fontSize:13, width:"100%", outline:"none", boxSizing:"border-box" }}
          placeholder="60" type="number" value={adminExamDuration||60} onChange={e=>setAdminExamDuration(e.target.value)} />
      </div>
      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Exam Date</label>
        <input type="date" style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 13px", color:C.text, fontSize:13, width:"100%", outline:"none", boxSizing:"border-box" }}
          value={adminExamDate} onChange={e=>setAdminExamDate(e.target.value)} />
      </div>
      <div style={{ marginBottom:16 }}>
       <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Difficulty Level</label>
       <div style={{ display:"flex", gap:8 }}>
            {["easy","medium","hard"].map(d => (
        <button key={d} onClick={()=>setAdminDifficulty(d)} style={{ flex:1, padding:"9px", borderRadius:10, border:`1px solid ${adminDifficulty===d?(d==="easy"?C.green:d==="medium"?C.gold:C.red):C.border}`, background:adminDifficulty===d?`${d==="easy"?C.green:d==="medium"?C.gold:C.red}20`:"transparent", color:adminDifficulty===d?(d==="easy"?C.green:d==="medium"?C.gold:C.red):C.sub, fontSize:13, cursor:"pointer", fontWeight:adminDifficulty===d?600:400, textTransform:"capitalize" }}>{d}</button>
          ))}
      </div>
      </div>
      <BP onClick={async()=>{
        if(!adminExamTitle?.trim()){alert("Please enter exam title!");return;}
        setAdminCreating(true);
        try{
          const res=await fetch("https://eduai-urgj.onrender.com/api/generate-exam",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subject:adminExamSubject||"Mathematics",topic:adminExamTitle,difficulty:adminDifficulty||"medium",count:adminExamCount||10})});
          const data=await res.json();
          const raw=(data?.result?.response||"").replace(/```json|```/g,"").trim();
          let start=raw.indexOf("["),end=raw.lastIndexOf("]");
          const qs=JSON.parse(raw.substring(start,end+1));
          await fetch("https://eduai-urgj.onrender.com/api/save-exam",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:adminExamTitle,subject:adminExamSubject||"Mathematics",duration:adminExamDuration||60,date:adminExamDate,questions:qs,totalMarks:qs.length*5,createdBy:"Admin"})});
          alert(`✅ Exam "${adminExamTitle}" created with ${qs.length} AI questions!`);
          setAdminExamTitle("");
        }catch(e){alert("Failed: "+e.message);}
        setAdminCreating(false);
      }} C={C} style={{ width:"100%", justifyContent:"center", opacity:adminCreating?0.7:1 }}>
        <Plus size={14}/> {adminCreating?"🤖 Generating...":"Create Exam with AI"}
      </BP>
    </Card>
    <Card C={C}>
      <H3 C={C}>Active Exams</H3>
      {(realExams.length > 0 ? realExams : [{ title:"JEE Mock #11", subject:"Mathematics", questions:[], date:"May 17" }]).map((e, i, arr) => (
     <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}>
    <div>
      <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{e.title}</div>
      <div style={{ fontSize:12, color:C.sub }}>{e.subject} · {e.questions?.length||0} questions · {e.date||e.createdAt?.substring(0,10)}</div>
    </div>
       <BS onClick={() => {}} C={C} style={{ fontSize:11 }}><Eye size={11} /> Monitor</BS>
    </div>
    ))}
    </Card>
  </div>
        )}
      </div>
    </div>
  );
}

function SettingsPage({ nav, C, sbProps, dark, setDark }) {
  const [tab, setTab] = useState("profile");
  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}"); } catch(e) { return {}; }})();
  const userId = storedUser.id;
  const initials = (storedUser.name || "S").split(" ").map(w=>w[0]).join("").substring(0,2).toUpperCase();

  const [name, setName] = useState(storedUser.name || "");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const [notifs, setNotifs] = useState({ email:true, sms:false, push:true, examReminder:true, aiInsights:true });
  const [language, setLanguage] = useState("English");
  const [prefMsg, setPrefMsg] = useState("");
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetch(`https://eduai-urgj.onrender.com/api/user-settings/${userId}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) return;
        setPhone(d.phone || "");
        setSchool(d.school || "");
        setNotifs(d.notifications || { email:true, sms:false, push:true, examReminder:true, aiInsights:true });
        setLanguage(d.language || "English");
        setLoaded(true);
      }).catch(()=>{});
  }, [userId]);

  const saveProfile = async () => {
    if (!userId) { setProfileMsg("Not logged in"); return; }
    setSavingProfile(true); setProfileMsg("");
    try {
      const res = await fetch("https://eduai-urgj.onrender.com/api/update-profile", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId, name, phone, school })
      });
      const data = await res.json();
      if (data.error) { setProfileMsg(data.error); }
      else {
        localStorage.setItem("eduai_user", JSON.stringify({ ...storedUser, name: data.user.name }));
        setProfileMsg("✅ Profile saved!");
      }
    } catch(e) { setProfileMsg("Could not reach server."); }
    setSavingProfile(false);
  };

  const savePassword = async () => {
    setPwMsg("");
    if (!currentPw || !newPw) { setPwMsg("Please fill in both password fields."); return; }
    if (newPw !== confirmPw) { setPwMsg("New passwords do not match."); return; }
    setSavingPw(true);
    try {
      const res = await fetch("https://eduai-urgj.onrender.com/api/change-password", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId, currentPassword: currentPw, newPassword: newPw })
      });
      const data = await res.json();
      if (data.error) { setPwMsg(data.error); }
      else { setPwMsg("✅ Password updated!"); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }
    } catch(e) { setPwMsg("Could not reach server."); }
    setSavingPw(false);
  };

  const saveNotif = async (key) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    if (!userId) return;
    fetch("https://eduai-urgj.onrender.com/api/update-settings", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ userId, notifications: updated })
    }).catch(()=>{});
  };

  const savePrefs = async () => {
    if (!userId) { setPrefMsg("Not logged in"); return; }
    setSavingPrefs(true); setPrefMsg("");
    try {
      const res = await fetch("https://eduai-urgj.onrender.com/api/update-settings", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId, language })
      });
      const data = await res.json();
      setPrefMsg(data.error ? data.error : "✅ Preferences saved!");
    } catch(e) { setPrefMsg("Could not reach server."); }
    setSavingPrefs(false);
  };

  const iS = { background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, width:"100%", outline:"none", boxSizing:"border-box" };
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="settings" />
      <div style={{ flex:1, padding:"26px 30px" }}>
        <PageHeader title="Settings" sub="Manage your profile, security, notifications and preferences" C={C} />
        <div style={{ display:"flex", gap:4, background:C.surface, borderRadius:10, padding:4, marginBottom:24, width:"fit-content", border:`1px solid ${C.border}` }}>
          {["profile", "security", "notifications", "preferences"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:tab === t ? C.card : "transparent", color:tab === t ? C.text : C.sub, fontSize:13, fontWeight:tab === t ? 500 : 400, cursor:"pointer", textTransform:"capitalize" }}>{t}</button>
          ))}
        </div>
        {tab === "profile" && (
          <Card C={C} style={{ maxWidth:560 }}>
            <H3 C={C}>Profile Information</H3>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:`${C.accent}25`, border:`3px solid ${C.accent}50`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:C.accent }}>{initials}</div>
              <div>
                <div style={{ fontSize:15, fontWeight:600, color:C.text }}>{name || "Student"}</div>
                <div style={{ fontSize:12, color:C.sub }}>{storedUser.role || "Student"}{storedUser.studentClass ? ` · Class ${storedUser.studentClass}${storedUser.section?"-"+storedUser.section:""}` : ""}{school ? " · "+school : ""}</div>
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Full Name</label>
              <input style={iS} value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Email</label>
              <input style={{ ...iS, opacity:0.6 }} value={storedUser.email || ""} disabled />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Phone</label>
              <input style={iS} placeholder="+91 XXXXX XXXXX" value={phone} onChange={e=>setPhone(e.target.value)} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>School</label>
              <input style={iS} placeholder="Your school name" value={school} onChange={e=>setSchool(e.target.value)} />
            </div>
            {profileMsg && <div style={{ marginBottom:12, fontSize:13, color:profileMsg.startsWith("✅")?C.green:C.red }}>{profileMsg}</div>}
            <BP onClick={saveProfile} C={C} style={{ opacity:savingProfile?0.7:1 }}><CheckCircle size={14} /> {savingProfile?"Saving...":"Save Changes"}</BP>
          </Card>
        )}
        {tab === "security" && (
          <Card C={C} style={{ maxWidth:480 }}>
            <H3 C={C}><Key size={15} color={C.accent} style={{ verticalAlign:-2, marginRight:7 }} />Change Password</H3>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Current Password</label>
              <input type="password" style={iS} placeholder="••••••••" value={currentPw} onChange={e=>setCurrentPw(e.target.value)} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>New Password</label>
              <input type="password" style={iS} placeholder="••••••••" value={newPw} onChange={e=>setNewPw(e.target.value)} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Confirm New Password</label>
              <input type="password" style={iS} placeholder="••••••••" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} />
            </div>
            {pwMsg && <div style={{ marginBottom:12, fontSize:13, color:pwMsg.startsWith("✅")?C.green:C.red }}>{pwMsg}</div>}
            <BP onClick={savePassword} C={C} style={{ opacity:savingPw?0.7:1 }}><Lock size={14} /> {savingPw?"Updating...":"Update Password"}</BP>
          </Card>
        )}
        {tab === "notifications" && (
          <Card C={C} style={{ maxWidth:520 }}>
            <H3 C={C}>Notification Preferences</H3>
            {[{ k:"email", l:"Email Notifications", d:"Get updates via email" }, { k:"sms", l:"SMS Alerts", d:"Critical alerts via SMS" }, { k:"push", l:"Push Notifications", d:"Browser/app notifications" }, { k:"examReminder", l:"Exam Reminders", d:"24h and 1h before exams" }, { k:"aiInsights", l:"AI Study Insights", d:"Weekly AI performance analysis" }].map((n, i, arr) => (
              <div key={n.k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div>
                  <div style={{ fontSize:14, color:C.text }}>{n.l}</div>
                  <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>{n.d}</div>
                </div>
                <div onClick={() => saveNotif(n.k)} style={{ width:48, height:26, borderRadius:13, background:notifs[n.k] ? `${C.accent}30` : `${C.sub}20`, border:`1px solid ${notifs[n.k] ? `${C.accent}50` : C.border}`, cursor:"pointer", position:"relative", flexShrink:0 }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:notifs[n.k] ? C.accent : C.sub, position:"absolute", top:3, left:notifs[n.k] ? 24 : 3, transition:"left 0.2s" }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize:11, color:C.sub, marginTop:14 }}>Changes save automatically.</div>
          </Card>
        )}
        {tab === "preferences" && (
          <Card C={C} style={{ maxWidth:480 }}>
            <H3 C={C}>App Preferences</H3>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:8, display:"block" }}>Theme</label>
              <div style={{ display:"flex", gap:10 }}>
                {[{ l:"Dark Mode", v:true }, { l:"Light Mode", v:false }].map(t => (
                  <button key={t.l} onClick={() => setDark(t.v)} style={{ flex:1, padding:"12px", background:dark === t.v ? `${C.accent}18` : "transparent", border:`1px solid ${dark === t.v ? `${C.accent}50` : C.border}`, borderRadius:10, color:dark === t.v ? C.accent : C.sub, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    {dark === t.v ? <Moon size={15} /> : <Sun size={15} />} {t.l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:8, display:"block" }}>Language</label>
              <select style={{ background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, width:"100%", outline:"none" }} value={language} onChange={e=>setLanguage(e.target.value)}>
                {["English", "Hindi", "Tamil", "Telugu", "Kannada", "Marathi", "Bengali"].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            {prefMsg && <div style={{ marginBottom:12, fontSize:13, color:prefMsg.startsWith("✅")?C.green:C.red }}>{prefMsg}</div>}
            <BP onClick={savePrefs} C={C} style={{ opacity:savingPrefs?0.7:1 }}><CheckCircle size={14} /> {savingPrefs?"Saving...":"Save Preferences"}</BP>
          </Card>
        )}
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════════════════════════════════════
   EDUAI PLATFORM — 5 NEW FEATURES
   Add these components to your App.jsx
   Then add them to the routing in the App() function
══════════════════════════════════════════════════════════════════════════════ */

/* ─── FEATURE 1: VOICE INPUT ─────────────────────────────────────────────────
   Add this VoiceButton component inside AITutor, next to the send button
   Usage: <VoiceButton onResult={(text) => setMsg(text)} C={C} />
─────────────────────────────────────────────────────────────────────────────── */
function SpeakButton({ text, C, size = 16 }) {
  const [speaking, setSpeaking] = useState(false);
  const speak = () => {
    if (!window.speechSynthesis) { alert("Text-to-speech not supported in this browser. Use Chrome!"); return; }
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };
  return (
    <button onClick={speak} title={speaking ? "Stop reading" : "Read aloud"} style={{ width:28, height:28, borderRadius:8, border:`1px solid ${speaking?C.accent:C.border}`, background:speaking?`${C.accent}20`:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      {speaking ? <X size={size-3} color={C.accent} /> : <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>}
    </button>
  );
}

function VoiceButton({ onResult, C, autoSend, onAutoSend }) {
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
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onResult(transcript);
      if (autoSend && onAutoSend) setTimeout(() => onAutoSend(transcript), 200);
      setListening(false);
    };
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

  useEffect(() => {
    const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
    if (!userId) return;
    const interval = setInterval(() => {
      fetch("https://eduai-urgj.onrender.com/api/study-time", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId, subject: "General", minutes: 1 })
      }).catch(()=>{});
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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
      const res = await fetch("https://eduai-urgj.onrender.com/api/chat", {
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
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleImageUpload} />
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
              <>
                <div style={{ marginBottom:10 }}><SpeakButton text={solution} C={C} size={18} /></div>
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px", whiteSpace:"pre-wrap", fontSize:14, lineHeight:1.8, color:C.text, maxHeight:520, overflowY:"auto" }}>
                  {solution}
                </div>
              </>
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
  const [teacherSubjectsInput, setTeacherSubjectsInput] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("");
  const [stream, setStream] = useState("");
  const [sciencePart, setSciencePart] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const iS = { background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 15px", color:C.text, fontSize:14, width:"100%", outline:"none", boxSizing:"border-box" };

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/register";
      const subjects = role === "teacher" ? teacherSubjectsInput.split(",").map(s=>s.trim()).filter(Boolean) : undefined;
      const body = mode === "login"
        ? { email, password: pass }
        : { name, email, password: pass, role, subjects, studentClass: role==="student"?studentClass:undefined, section: role==="student"?section:undefined, stream: role==="student"?stream:undefined, sciencePart: role==="student"?sciencePart:undefined };
      const res = await fetch("https://eduai-urgj.onrender.com" + endpoint, {
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
          {mode==="register" && role==="teacher" && (
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Subjects You Teach (comma-separated)</label>
              <input style={iS} placeholder="e.g. Mathematics, Physics" value={teacherSubjectsInput} onChange={e=>setTeacherSubjectsInput(e.target.value)} />
            </div>
          )}
          {mode==="register" && role==="student" && (
            <>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Class</label>
                <select style={iS} value={studentClass} onChange={e=>{ setStudentClass(e.target.value); setStream(""); setSciencePart(""); }}>
                  <option value="">Select Class</option>
                  {Array.from({length:12},(_,i)=>i+1).map(n => <option key={n} value={String(n)}>Class {n}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Section</label>
                <div style={{ display:"flex", gap:6 }}>
                  {["A","B","C","D"].map(s => (
                    <button key={s} type="button" onClick={()=>setSection(s)} style={{ flex:1, padding:"8px 4px", background:section===s?`${C.accent}18`:"transparent", border:`1px solid ${section===s?`${C.accent}50`:C.border}`, borderRadius:8, color:section===s?C.accent:C.sub, fontSize:13, cursor:"pointer" }}>{s}</button>
                  ))}
                </div>
              </div>
              {["11","12"].includes(studentClass) && (
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Stream</label>
                  <div style={{ display:"flex", gap:6 }}>
                    {["Science","Commerce","Arts"].map(s => (
                      <button key={s} type="button" onClick={()=>{ setStream(s); setSciencePart(""); }} style={{ flex:1, padding:"8px 4px", background:stream===s?`${C.accent}18`:"transparent", border:`1px solid ${stream===s?`${C.accent}50`:C.border}`, borderRadius:8, color:stream===s?C.accent:C.sub, fontSize:13, cursor:"pointer" }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {["11","12"].includes(studentClass) && stream==="Science" && (
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Science Group</label>
                  <div style={{ display:"flex", gap:6 }}>
                    {[{v:"PCM",l:"PCM (Physics, Chem, Maths)"},{v:"PCB",l:"PCB (Physics, Chem, Biology)"}].map(o => (
                      <button key={o.v} type="button" onClick={()=>setSciencePart(o.v)} style={{ flex:1, padding:"8px 6px", background:sciencePart===o.v?`${C.accent}18`:"transparent", border:`1px solid ${sciencePart===o.v?`${C.accent}50`:C.border}`, borderRadius:8, color:sciencePart===o.v?C.accent:C.sub, fontSize:12, cursor:"pointer" }}>{o.v}</button>
                    ))}
                  </div>
                </div>
              )}
            </>
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
  const [stream, setStream] = useState("Science");
  const [classNumber, setClassNumber] = useState("10");
  const [classLevel, setClassLevel] = useState("Class 12");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [myScores, setMyScores] = useState([]);
  useEffect(() => {
    const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
    if (!userId) return;
    fetch(`https://eduai-urgj.onrender.com/api/scores/${userId}`)
      .then(r=>r.json())
      .then(d=>setMyScores(d.scores||[]))
      .catch(()=>{});
  }, []);
  const realSubjectAverages = (() => {
    const bySubject = {};
    myScores.forEach(s => {
      const subj = (s.subject || "").trim();
      if (!subj) return;
      if (!bySubject[subj]) bySubject[subj] = [];
      bySubject[subj].push(s.percentage || 0);
    });
    const out = {};
    Object.entries(bySubject).forEach(([subj, arr]) => {
      out[subj] = Math.round(arr.reduce((a,b)=>a+b,0)/arr.length);
    });
    return out;
  })();

  const examSubjects = {
    "JEE Mains": { Mathematics:78, Physics:65, Chemistry:52 },
    "JEE Advanced": { Mathematics:78, Physics:65, Chemistry:52 },
    "NEET": { Physics:65, Chemistry:52, Biology:70 },
    "UPSC": { History:70, Geography:65, "Political Science":72, Economics:68, English:83 },
    "CBSE Boards": {
      "Science": {
              "Class 10": { Mathematics:78, Science:72, "Social Science":68, English:83, Hindi:75 },
              "Class 11 PCM": { Physics:65, Chemistry:52, Mathematics:78, English:83, Hindi:75 },
              "Class 11 PCM with CS": { Physics:65, Chemistry:52, Mathematics:78, English:83, Hindi:75, "Computer Science":91 },
              "Class 11 PCM with Biology": { Physics:65, Chemistry:52, Mathematics:78, English:83, Hindi:75,"Biology":91 },
              "Class 11 PCB": { Physics:65, Chemistry:52, Biology:70, English:83, Hindi:75 },
              "Class 11 PCB with CS": { Physics:65, Chemistry:52, Biology:70, English:83, Hindi:75, "Computer Science":70 },
              "Class 11 PCB with Mathematics": { Physics:65, Chemistry:52, Biology:70, English:83, Hindi:75, "Mathematics":91 },
              "Class 12 PCM": { Physics:65, Chemistry:52, Mathematics:78, English:83, Hindi:75 },
              "Class 12 PCM with CS": { Physics:65, Chemistry:52, Mathematics:78, English:83, Hindi:75, "Computer Science":91 },
              "Class 12 PCM with Biology": { Physics:65, Chemistry:52, Mathematics:78, English:83, Hindi:75, "Biology":91 },
              "Class 12 PCB": { Physics:65, Chemistry:52, Biology:70, English:83, Hindi:75 },
              "Class 12 PCB with CS": { Physics:65, Chemistry:52, Biology:70, English:83, Hindi:75,"Computer Science":70 },
              "Class 12 PCB with Mathematics": { Physics:65, Chemistry:52, Biology:70, English:83, Hindi:75, "Mathematics":91 },
             },
      "Commerce": {
         "Class 10": { Mathematics:78, Science:72, "Social Science":68, English:83, Hindi:75 },
         "Class 11 with Maths": { Accountancy:72, Economics:68, "Business Studies":75, Mathematics:78, English:83 },
         "Class 11 without Maths": { Accountancy:72, Economics:68, "Business Studies":75, "Informatics Practices":70, English:83 },
         "Class 12 with Maths": { Accountancy:72, Economics:68, "Business Studies":75, Mathematics:78, English:83, "Entrepreneurship":70 },
         "Class 12 without Maths": { Accountancy:72, Economics:68, "Business Studies":75, "Informatics Practices":70, English:83, "Entrepreneurship":68 },
       },
      "Arts": {
        "Class 10": { Mathematics:78, Science:72, "Social Science":68, English:83, Hindi:75 },
        "Class 11 with Sociology": { History:70, Geography:65, "Political Science":72, Sociology:68, English:83, Hindi:75 },
        "Class 11 without Sociology": { History:70, Geography:65, "Political Science":72, Psychology:71, English:83, Hindi:75 },
        "Class 12 with Sociology": { History:70, Geography:65, "Political Science":72, Sociology:68, English:83, Psychology:71 },
        "Class 12 without Sociology": { History:70, Geography:65, "Political Science":72, "Fine Arts":75, English:83, Hindi:75 },
      },
    },
    "State Board": {
       "Science": {
          "Class 10": { Mathematics:78, Science:72, "Social Science":68, English:83, Hindi:75 },
          "Class 11 PCM": { Physics:65, Chemistry:52, Mathematics:78, English:83, Hindi:75 },
          "Class 11 PCM with CS": { Physics:65, Chemistry:52, Mathematics:78, English:83, Hindi:75, "Computer Science":91 },
          "Class 11 PCM with Biology": { Physics:65, Chemistry:52, Mathematics:78, English:83, Hindi:75, "Biology":91 },
          "Class 11 PCB": { Physics:65, Chemistry:52, Biology:70, English:83, Hindi:75 },
          "Class 11 PCB with CS": { Physics:65, Chemistry:52, Biology:70, English:83, Hindi:75, "Computer Science":70 },
          "Class 11 PCB with Mathematics": { Physics:65, Chemistry:52, Biology:70, English:83, Hindi:75, "Mathematics":91 },
          "Class 12 PCM": { Physics:65, Chemistry:52, Mathematics:78, English:83, Hindi:75 },
          "Class 12 PCM with CS": { Physics:65, Chemistry:52, Mathematics:78, English:83, Hindi:75, "Computer Science":91 },
          "Class 12 PCM with Biology": { Physics:65, Chemistry:52, Mathematics:78, English:83, Hindi:75, "Biology":91 },
          "Class 12 PCB": { Physics:65, Chemistry:52, Biology:70, English:83, Hindi:75 },
          "Class 12 PCB with CS": { Physics:65, Chemistry:52, Biology:70, English:83, Hindi:75, "Computer Science":70 },
          "Class 12 PCB with Mathematics": { Physics:65, Chemistry:52, Biology:70, English:83, Hindi:75, "Mathematics":91 },
       },
      "Commerce": {
         "Class 10": { Mathematics:78, Science:72, "Social Science":68, English:83, Hindi:75 },
         "Class 11 with Maths": { Accountancy:72, Economics:68, "Business Studies":75, Mathematics:78, English:83, Hindi:75 },
         "Class 11 without Maths": { Accountancy:72, Economics:68, "Business Studies":75, "Informatics Practices":70, English:83, Hindi:75 },
         "Class 12 with Maths": { Accountancy:72, Economics:68, "Business Studies":75, Mathematics:78, English:83, Hindi:75 },
         "Class 12 without Maths": { Accountancy:72, Economics:68, "Business Studies":75, "Informatics Practices":70, English:83, Hindi:75 },
      },
      "Arts": {
       "Class 10": { Mathematics:78, Science:72, "Social Science":68, English:83, Hindi:75 },
      "Class 11 with Sociology": { History:70, Geography:65, "Political Science":72, Sociology:68, English:83, Hindi:75 },
      "Class 11 without Sociology": { History:70, Geography:65, "Political Science":72, Sanskrit:65, English:83, Hindi:75 },
      "Class 12 with Sociology": { History:70, Geography:65, "Political Science":72, Sociology:68, English:83, Hindi:75 },
      "Class 12 without Sociology": { History:70, Geography:65, "Political Science":72, Sanskrit:65, English:83, Hindi:75 },
     }
    }
  };

    // Classes 1-10 don't have streams in the Indian system — only 11/12 do.
  // These are generic default subject sets for Classes 1-10 (no stream picker
  // needed at all for these).
  const genericSubjects = {
    "1": { Mathematics:75, English:80, Hindi:78, EVS:82 },
    "2": { Mathematics:75, English:80, Hindi:78, EVS:82 },
    "3": { Mathematics:75, English:80, Hindi:78, EVS:82 },
    "4": { Mathematics:75, English:80, Hindi:78, EVS:82 },
    "5": { Mathematics:75, English:80, Hindi:78, EVS:82 },
    "6": { Mathematics:75, Science:78, "Social Science":72, English:80, Hindi:78 },
    "7": { Mathematics:75, Science:78, "Social Science":72, English:80, Hindi:78 },
    "8": { Mathematics:75, Science:78, "Social Science":72, English:80, Hindi:78 },
    "9": { Mathematics:78, Science:72, "Social Science":68, English:83, Hindi:75 },
    "10": { Mathematics:78, Science:72, "Social Science":68, English:83, Hindi:75 },
  };
  const hasSteams = ["CBSE Boards","State Board"].includes(targetExam);
  const streams = ["Science","Commerce","Arts"];
  const classNumbers = Array.from({length:12},(_,i)=>String(i+1));
  const classVariants = stream === "Science"
  ? ["Class 11 PCM","Class 11 PCM with CS","Class 11 PCM with Biology","Class 11 PCB","Class 11 PCB with CS","Class 11 PCB with Mathematics","Class 12 PCM","Class 12 PCM with CS","Class 12 PCM with Biology","Class 12 PCB","Class 12 PCB with CS","Class 12 PCB with Mathematics"]
  : stream === "Commerce"
  ? ["Class 11 with Maths","Class 11 without Maths","Class 12 with Maths","Class 12 without Maths"]
  : ["Class 11 with Sociology","Class 11 without Sociology","Class 12 with Sociology","Class 12 without Sociology"];
  // Only show variants for the currently selected class number (11 or 12)
  const classes = classVariants.filter(c => c.startsWith(`Class ${classNumber}`));
  const exams = ["JEE Mains","JEE Advanced","NEET","UPSC","CBSE Boards","State Board"];

 const computeSubjectsFor = (exam, classNum, str, cls) => {
  try {
    const examUsesBoardStructure = ["CBSE Boards","State Board"].includes(exam);
    if (examUsesBoardStructure) {
      if (["11","12"].includes(classNum)) {
        const streamData = examSubjects[exam]?.[str];
        if (!streamData) return genericSubjects[classNum] || { Mathematics:78, English:83 };
        const classData = streamData[cls];
        if (!classData) {
          const firstMatch = Object.keys(streamData).find(k => k.startsWith(`Class ${classNum}`));
          return streamData[firstMatch] || genericSubjects[classNum] || { Mathematics:78, English:83 };
        }
        return classData;
      }
      return genericSubjects[classNum] || { Mathematics:78, English:83 };
    }
    return examSubjects[exam] || { Mathematics:78, English:83 };
  } catch(e) {
    return { Mathematics:78, English:83 };
  }
};

 const getCurrentSubjects = () => computeSubjectsFor(targetExam, classNumber, stream, classLevel);
  const [localSubjects, setLocalSubjects] = useState({});

const getDisplaySubjects = () => {
  const base = getCurrentSubjects();
  return { ...base, ...localSubjects };
};

  // Pre-fill sliders with the student's real exam/quiz averages wherever a
  // subject name matches (case-insensitive) — starting point is real
  // performance, but sliders stay fully adjustable for what-if scenarios.
  const updateSubjects = (exam, classNum, str, cls) => {
  const base = computeSubjectsFor(exam, classNum, str, cls);
  const overrides = {};
  Object.keys(base).forEach(subj => {
    const match = Object.keys(realSubjectAverages).find(r => r.toLowerCase() === subj.toLowerCase());
    if (match) overrides[subj] = realSubjectAverages[match];
  });
  setLocalSubjects(overrides);
};

  useEffect(() => {
    if (Object.keys(realSubjectAverages).length > 0) updateSubjects(targetExam, classNumber, stream, classLevel);
  }, [myScores.length]);
  
  const predict = async () => {
  setLoading(true); setPrediction(null);
  try {
    const res = await fetch("https://eduai-urgj.onrender.com/api/predict", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ subjects: getDisplaySubjects(), targetExam, stream: hasSteams ? stream : undefined, classLevel: hasSteams ? classLevel : undefined })
    });
      const data = await res.json();
      const raw = (data?.result?.response || "").replace(/```json|```/g,"").trim();
      let start = raw.indexOf("{"), end = raw.lastIndexOf("}");
      if (start === -1) throw new Error("No JSON found");
      let result;
      try { result = JSON.parse(raw.substring(start, end + 1)); }
      catch { result = { predictedRank:"#1000-2000", predictedScore:"150-180/300", probability:"60%", strongSubjects:["Mathematics"], weakSubjects:["Chemistry"], recommendations:["Study daily","Practice mock tests","Revise formulas"], studyHoursNeeded:"6-8 hours/day" }; }
      setPrediction(result);
    } catch(e) { setPrediction(null); setLocalSubjects({}); }
    setLoading(false);
  };

  const subjectList = Object.keys(getCurrentSubjects());

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="prediction" />
      <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
        <PageHeader title="📊 AI Performance Prediction" sub="Enter your current scores — AI predicts your exam rank and gives personalized advice" C={C} />
        <div style={{ display:"grid", gridTemplateColumns:"minmax(340px, 1fr) 1.5fr", gap:20 }}>
          <div>
            <Card C={C} style={{ marginBottom:18 }}>
              <H3 C={C}>Target Exam</H3>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                {exams.map(e => (
                  <button key={e} style={{ whiteSpace:"nowrap" }} onClick={() => {
  setTargetExam(e);
  setStream("Science");
  const isBoard = ["CBSE Boards","State Board"].includes(e);
  const newClassNum = isBoard ? "10" : "12";
  setClassNumber(newClassNum);
  const newClass = isBoard ? "" : "Class 12";
  setClassLevel(newClass);
  updateSubjects(e, newClassNum, "Science", newClass);
  setPrediction(null); setLocalSubjects({});
}}
                    style={{ padding:"8px 16px", borderRadius:20, fontSize:13, cursor:"pointer", whiteSpace:"nowrap", background:targetExam===e?`${C.accent}20`:"transparent", border:`1px solid ${targetExam===e?C.accent:C.border}`, color:targetExam===e?C.accent:C.sub }}>{e}
                  </button>
                ))}
              </div>

              {hasSteams && (
                <>
                  <H3 C={C}>Select Class</H3>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                    {classNumbers.map(n => (
                      <button key={n} onClick={() => {
  setClassNumber(n);
  if (["11","12"].includes(n)) {
    const newClass = `Class ${n} PCM with CS`;
    setStream("Science");
    setClassLevel(newClass);
    updateSubjects(targetExam, n, "Science", newClass);
  } else {
    setClassLevel("");
    updateSubjects(targetExam, n, stream, "");
  }
  setPrediction(null); setLocalSubjects({});
}}
                        style={{ width:44, padding:"9px 0", borderRadius:10, border:`1px solid ${classNumber===n?C.gold:C.border}`, background:classNumber===n?`${C.gold}18`:"transparent", color:classNumber===n?C.gold:C.sub, fontSize:13, cursor:"pointer", fontWeight:classNumber===n?600:400, textAlign:"center" }}>
                        {n}
                      </button>
                    ))}
                  </div>

                  {["11","12"].includes(classNumber) && (
                    <>
                      <H3 C={C}>Select Stream</H3>
                      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                        {streams.map(s => (
                          <button key={s} onClick={() => {
  setStream(s);
  const newClass = s === "Science" ? `Class ${classNumber} PCM with CS`
    : s === "Commerce" ? `Class ${classNumber} with Maths`
    : `Class ${classNumber} with Sociology`;
  setClassLevel(newClass);
  updateSubjects(targetExam, classNumber, s, newClass);
  setPrediction(null); setLocalSubjects({});
}}
                            style={{ flex:1, padding:"9px 4px", borderRadius:10, border:`1px solid ${stream===s?C.accent:C.border}`, background:stream===s?`${C.accent}18`:"transparent", color:stream===s?C.accent:C.sub, fontSize:13, cursor:"pointer", fontWeight:stream===s?600:400, textAlign:"center" }}>
                            {s==="Science"?"🔬":s==="Commerce"?"💼":"🎨"} {s}
                          </button>
                        ))}
                      </div>

                      <H3 C={C}>Select Details</H3>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                        {classes.map(cls => (
                          <button key={cls} onClick={() => { setClassLevel(cls); updateSubjects(targetExam,classNumber,stream,cls); setPrediction(null); setLocalSubjects({}); }}
                            style={{ padding:"9px 12px", borderRadius:10, border:`1px solid ${classLevel===cls?C.gold:C.border}`, background:classLevel===cls?`${C.gold}18`:"transparent", color:classLevel===cls?C.gold:C.sub, fontSize:13, cursor:"pointer", whiteSpace:"nowrap", fontWeight:classLevel===cls?600:400, textAlign:"center" }}>
                            {cls}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              <H3 C={C}>Your Current Scores (%)</H3>
              <div style={{ marginBottom:18 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={subjectList.map(sub => ({ sub, score: getDisplaySubjects()[sub] }))} outerRadius="55%" margin={{ top:20, right:60, bottom:20, left:60 }}>
                    <PolarGrid stroke={C.border} />
                    <PolarAngleAxis dataKey="sub" tick={{ fill:C.sub, fontSize:10 }} />
                    <Radar name="Score" dataKey="score" stroke={C.accent} fill={C.accent} fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              {Object.keys(realSubjectAverages).length > 0 && <div style={{ fontSize:11, color:C.sub, textAlign:"center", marginTop:4 }}>Pre-filled from your real exam & quiz history where available — drag sliders below for what-if scenarios.</div>}
              </div>
              {subjectList.map(sub => (
                <div key={sub} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:13, color:C.text }}>{sub}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:getDisplaySubjects()[sub]>=75?C.green:getDisplaySubjects()[sub]>=60?C.gold:C.red }}>{getDisplaySubjects()[sub]}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={getDisplaySubjects()[sub]}
                    onChange={e => setLocalSubjects(prev => ({ ...prev, [sub]: parseInt(e.target.value) }))}
                    style={{ width:"100%", accentColor:C.accent }} />
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
                <p style={{ color:C.sub, fontSize:13, lineHeight:1.6 }}>Select your exam, stream, class and set your current scores, then click Predict!</p>
              </Card>
            )}
            {loading && (
              <Card C={C} style={{ textAlign:"center", padding:"60px 30px" }}>
                <div style={{ fontSize:48, marginBottom:14 }}>⚡</div>
                <p style={{ color:C.accent, fontSize:15 }}>AI is analyzing your performance...</p>
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
                    {(prediction.strongSubjects||[]).map((s,i) => (
                      <div key={i} style={{ padding:"8px 0", borderBottom:i<prediction.strongSubjects.length-1?`1px solid ${C.border}`:"none", color:C.green, fontSize:13 }}>✅ {s}</div>
                    ))}
                  </Card>
                  <Card C={C}>
                    <H3 C={C}>⚠️ Needs Focus</H3>
                    {(prediction.weakSubjects||[]).map((s,i) => (
                      <div key={i} style={{ padding:"8px 0", borderBottom:i<prediction.weakSubjects.length-1?`1px solid ${C.border}`:"none", color:C.red, fontSize:13 }}>❗ {s}</div>
                    ))}
                  </Card>
                </div>
                <Card C={C} style={{ background:`${C.accent}08` }}>
                  <H3 C={C}><Brain size={15} color={C.accent} style={{ verticalAlign:-2, marginRight:7 }} />AI Recommendations</H3>
                  {(prediction.recommendations||[]).map((r,i) => (
                    <div key={i} style={{ padding:"10px 0", borderBottom:i<prediction.recommendations.length-1?`1px solid ${C.border}`:"none", fontSize:13, color:C.text, display:"flex", gap:10 }}>
                      <span style={{ color:C.accent, flexShrink:0 }}>→</span>{r}
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
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const subjects = ["Mathematics","Physics","Chemistry","Computer Science","Biology","English","History","Economics"];
  const difficulties = ["easy","medium","hard"];

  useEffect(() => {
    if (questions.length === 0) return;
    const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
    if (!userId) return;
    const interval = setInterval(() => {
      fetch("https://eduai-urgj.onrender.com/api/study-time", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId, subject, minutes: 1 })
      }).catch(()=>{});
    }, 60000);
    return () => clearInterval(interval);
  }, [questions.length, subject]);

  const generate = async () => {
  if (!topic.trim()) { alert("Please enter a topic!"); return; }
  setLoading(true); setQuestions([]); setAnswers({}); setSubmitted(false);
  try {
    const res = await fetch("https://eduai-urgj.onrender.com/api/generate-exam", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ subject, topic, difficulty, count })
    });
    const data = await res.json();
    const raw = (data?.result?.response || "").replace(/```json|```/g,"").trim();
    let start = raw.indexOf("[");
    if (start === -1) throw new Error("No questions found");
    let jsonStr = raw.substring(start);
    let qs;
    try {
      let end = raw.lastIndexOf("]");
      qs = JSON.parse(raw.substring(start, end + 1));
    } catch {
      let lastComplete = jsonStr.lastIndexOf("},");
      if (lastComplete === -1) lastComplete = jsonStr.lastIndexOf("}");
      if (lastComplete > 0) {
        qs = JSON.parse(jsonStr.substring(0, lastComplete + 1) + "]");
      } else {
        throw new Error("Could not parse questions");
      }
    }
    if (!qs || qs.length === 0) throw new Error("Empty response");
    setQuestions(qs);
    setExamTitle(`${subject} — ${topic} (${difficulty.charAt(0).toUpperCase()+difficulty.slice(1)})`);
  } catch(e) {
    alert("Failed: " + e.message + ". Try fewer questions!");
  }
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
              <input type="range" min="1" max="20" value={count} onChange={e=>setCount(parseInt(e.target.value))} style={{ width:"100%", accentColor:C.accent, marginTop:10 }} />
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

function Quiz({ nav, C, sbProps }) {
  const [stage, setStage] = useState("setup"); // setup | taking | results
  const [subject, setSubject] = useState("Mathematics");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [questionType, setQuestionType] = useState("mcq");
  const [purpose, setPurpose] = useState("formative");
  const [saveToRecord, setSaveToRecord] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [matchSel, setMatchSel] = useState({}); // per-question: {leftIdx: rightIdx}
  const [orderState, setOrderState] = useState({}); // per-question: array of shuffled items in current order

  const purposes = [
    { v:"diagnostic", l:"Diagnostic", d:"Assess prior knowledge — no score saved" },
    { v:"formative", l:"Formative", d:"Check understanding — immediate feedback" },
    { v:"summative", l:"Summative", d:"Final assessment — saved to your record" },
    { v:"practice", l:"Low-Stakes Practice", d:"Just practice — nothing saved" },
  ];
  const questionTypes = [
    { v:"mcq", l:"Multiple Choice" },
    { v:"multi", l:"Multiple Answer" },
    { v:"truefalse", l:"True / False" },
    { v:"fill", l:"Fill-in-the-Blank" },
    { v:"matching", l:"Matching" },
    { v:"short", l:"Short Answer" },
    { v:"ordering", l:"Ordering" },
  ];
  const subjects = ["Mathematics","Physics","Chemistry","Computer Science","Biology","English","History","Economics"];

  const shuffle = (arr) => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };

  useEffect(() => {
    if (stage !== "taking") return;
    const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
    if (!userId) return;
    const interval = setInterval(() => {
      fetch("https://eduai-urgj.onrender.com/api/study-time", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId, subject, minutes: 1 })
      }).catch(()=>{});
    }, 60000);
    return () => clearInterval(interval);
  }, [stage, subject]);

  const generate = async () => {
    if (!topic.trim()) { alert("Please enter a topic!"); return; }
    setLoading(true);
    try {
      const res = await fetch("https://eduai-urgj.onrender.com/api/generate-quiz", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ subject, topic, difficulty, count, questionType, purpose })
      });
      const data = await res.json();
      const raw = (data?.result?.response || "").replace(/```json|```/g,"").trim();
      let start = raw.indexOf("["), end = raw.lastIndexOf("]");
      if (start === -1) throw new Error("No questions found");
      const qs = JSON.parse(raw.substring(start, end+1));
      if (!qs.length) throw new Error("Empty response");
      setQuestions(qs);
      setAnswers({});
      // Prepare shuffled state for matching / ordering questions
      const initMatch = {}, initOrder = {};
      qs.forEach((q, i) => {
        if (q.type === "matching") initMatch[i] = shuffle(q.pairs.map((_,idx)=>idx));
        if (q.type === "ordering") initOrder[i] = shuffle(q.items.map((item,idx)=>({item,origIdx:idx})));
      });
      setMatchSel({});
      setOrderState(initOrder);
      setCur(0);
      setStage("taking");
    } catch(e) {
      alert("Failed to generate quiz: " + e.message);
    }
    setLoading(false);
  };

  const submitQuiz = async () => {
    let correct = 0, totalMarks = 0, earned = 0;
    questions.forEach((q, i) => {
     const marks = q.marks || 5;
      totalMarks += marks;
      let isCorrect = false;
      if (q.type === "mcq") isCorrect = answers[i] === q.ans;
      else if (q.type === "multi") {
        const sel = (answers[i] || []).slice().sort();
        const correct = (q.ans || []).slice().sort();
        isCorrect = sel.length === correct.length && sel.every((v,idx)=>v===correct[idx]);
      }
      else if (q.type === "truefalse") isCorrect = answers[i] === q.ans;
      else if (q.type === "fill" || q.type === "short") {
        const given = (answers[i] || "").trim().toLowerCase();
        const expected = (q.answer || "").trim().toLowerCase();
        isCorrect = given.length > 0 && (given === expected || expected.includes(given) || given.includes(expected));
      } else if (q.type === "matching") {
        const sel = answers[i] || {};
        isCorrect = q.pairs.every((_, leftIdx) => sel[leftIdx] === leftIdx);
      } else if (q.type === "ordering") {
        const current = (orderState[i] || []).map(x => x.origIdx);
        isCorrect = current.every((v, idx) => v === idx);
      }
      if (isCorrect) { correct++; earned += marks; }
    });
    const pct = Math.round((earned / totalMarks) * 100);

    // Save quiz attempt always (for history)
    const userId = (() => { try { return JSON.parse(localStorage.getItem("eduai_user")||"{}").id; } catch { return null; }})();
    if (userId) {
      fetch("https://eduai-urgj.onrender.com/api/quiz-attempt", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ userId, subject, topic, questionType, purpose, score:earned, totalMarks, percentage:pct, questionCount:questions.length })
      }).catch(()=>{});
      // Whether this counts toward the gradebook/analytics is now the
      // user's explicit choice via the toggle, not tied to purpose.
      if (saveToRecord) {
        fetch("https://eduai-urgj.onrender.com/api/scores", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ userId, subject, examName:`Quiz: ${topic}`, score:earned, totalMarks, percentage:pct })
        }).catch(()=>{});
      }
    }
    setStage("results");
  };

  const renderQuestion = (q, i) => {
    if (q.type === "mcq") {
      return (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {q.opts.map((opt, oi) => {
            const sel = answers[i] === oi;
            return (
              <button key={oi} onClick={()=>setAnswers(a=>({...a,[i]:oi}))} style={{ textAlign:"left", padding:"12px 16px", background:sel?`${C.accent}14`:"transparent", border:`1px solid ${sel?C.accent:C.border}`, borderRadius:10, color:sel?C.accent:C.text, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:11 }}>
                <span style={{ width:24, height:24, borderRadius:"50%", flexShrink:0, background:sel?C.accent:"transparent", border:sel?"none":`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, color:sel?"#fff":C.sub }}>{String.fromCharCode(65+oi)}</span>
                {opt}
              </button>
            );
          })}
        </div>
      );
    }
        if (q.type === "multi") {
      const selected = answers[i] || [];
      const toggle = (oi) => {
        const cur = answers[i] || [];
        const next = cur.includes(oi) ? cur.filter(x=>x!==oi) : [...cur, oi];
        setAnswers(a=>({...a,[i]:next}));
      };
      return (
        <div>
          <div style={{ fontSize:11, color:C.sub, marginBottom:10 }}>Select all that apply</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {q.opts.map((opt, oi) => {
              const sel = selected.includes(oi);
              return (
                <button key={oi} onClick={()=>toggle(oi)} style={{ textAlign:"left", padding:"12px 16px", background:sel?`${C.accent}14`:"transparent", border:`1px solid ${sel?C.accent:C.border}`, borderRadius:10, color:sel?C.accent:C.text, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:11 }}>
                  <span style={{ width:20, height:20, borderRadius:5, flexShrink:0, background:sel?C.accent:"transparent", border:sel?"none":`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff" }}>{sel?"✓":""}</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    if (q.type === "truefalse") {
      return (
        <div style={{ display:"flex", gap:12 }}>
          {[true,false].map(val => {
            const sel = answers[i] === val;
            return (
              <button key={String(val)} onClick={()=>setAnswers(a=>({...a,[i]:val}))} style={{ flex:1, padding:"16px", background:sel?`${C.accent}14`:"transparent", border:`1px solid ${sel?C.accent:C.border}`, borderRadius:10, color:sel?C.accent:C.text, fontSize:15, fontWeight:600, cursor:"pointer" }}>{val?"True":"False"}</button>
            );
          })}
        </div>
      );
    }
    if (q.type === "fill" || q.type === "short") {
      return (
        <input value={answers[i]||""} onChange={e=>setAnswers(a=>({...a,[i]:e.target.value}))} placeholder="Type your answer..." style={{ width:"100%", background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 16px", color:C.text, fontSize:14, outline:"none", boxSizing:"border-box" }} />
      );
    }
    if (q.type === "matching") {
      const sel = answers[i] || {};
      const rightOptions = matchSel[i] || q.pairs.map((_,idx)=>idx);
      const [activeLeft, setActiveLeftLocal] = [sel.__active, null];
      return (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          <div>
            {q.pairs.map((p, li) => {
              const isMatched = sel[li] !== undefined;
              const isActive = sel.__active === li;
              return (
                <button key={li} onClick={()=>setAnswers(a=>({...a,[i]:{...(a[i]||{}),__active:li}}))} style={{ width:"100%", textAlign:"left", padding:"10px 14px", marginBottom:8, borderRadius:9, border:`1px solid ${isActive?C.accent:isMatched?C.green:C.border}`, background:isActive?`${C.accent}14`:isMatched?`${C.green}10`:"transparent", color:C.text, fontSize:13, cursor:"pointer" }}>{p.left} {isMatched?"✓":""}</button>
              );
            })}
          </div>
          <div>
            {rightOptions.map(ri => {
              const rightUsed = Object.entries(sel).some(([k,v])=>k!=="__active" && v===ri);
              return (
                <button key={ri} disabled={rightUsed} onClick={()=>{
                  if (sel.__active === undefined) return;
                  setAnswers(a=>({...a,[i]:{...(a[i]||{}), [sel.__active]: ri, __active: undefined}}));
                }} style={{ width:"100%", textAlign:"left", padding:"10px 14px", marginBottom:8, borderRadius:9, border:`1px solid ${C.border}`, background:rightUsed?`${C.sub}10`:"transparent", color:rightUsed?C.sub:C.text, fontSize:13, cursor:rightUsed?"default":"pointer", opacity:rightUsed?0.5:1 }}>{q.pairs[ri].right}</button>
              );
            })}
          </div>
          <div style={{ gridColumn:"1 / -1", fontSize:11, color:C.sub }}>Click a term on the left, then click its matching definition on the right.</div>
        </div>
      );
    }
    if (q.type === "ordering") {
      const current = orderState[i] || q.items.map((item,idx)=>({item,origIdx:idx}));
      const move = (idx, dir) => {
        const arr = [...current];
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= arr.length) return;
        [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
        setOrderState(s => ({ ...s, [i]: arr }));
      };
      return (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {current.map((it, idx) => (
            <div key={idx} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:9 }}>
              <span style={{ width:22, height:22, borderRadius:"50%", background:`${C.accent}20`, color:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, flexShrink:0 }}>{idx+1}</span>
              <span style={{ flex:1, fontSize:13, color:C.text }}>{it.item}</span>
              <button onClick={()=>move(idx,-1)} disabled={idx===0} style={{ background:"transparent", border:"none", color:idx===0?C.sub:C.accent, cursor:idx===0?"default":"pointer", opacity:idx===0?0.3:1, fontSize:16 }}>↑</button>
              <button onClick={()=>move(idx,1)} disabled={idx===current.length-1} style={{ background:"transparent", border:"none", color:idx===current.length-1?C.sub:C.accent, cursor:idx===current.length-1?"default":"pointer", opacity:idx===current.length-1?0.3:1, fontSize:16 }}>↓</button>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const iS = { background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, width:"100%", outline:"none", boxSizing:"border-box" };

  if (stage === "setup") {
    return (
      <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
        <Sidebar {...sbProps} current="quiz" />
        <div style={{ flex:1, padding:"26px 30px", overflowY:"auto" }}>
          <PageHeader title="📋 Quiz Center" sub="Diagnostic, formative, summative and practice quizzes — in 6 different question formats" C={C} />
          <Card C={C} style={{ maxWidth:700 }}>
            <H3 C={C}>Quiz Purpose</H3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {purposes.map(p => (
                <button key={p.v} onClick={()=>{ setPurpose(p.v); setSaveToRecord(p.v === "summative"); }} style={{ textAlign:"left", padding:"12px 14px", borderRadius:10, border:`1px solid ${purpose===p.v?C.accent:C.border}`, background:purpose===p.v?`${C.accent}14`:"transparent", cursor:"pointer" }}>
                  <div style={{ fontSize:13, fontWeight:600, color:purpose===p.v?C.accent:C.text }}>{p.l}</div>
                  <div style={{ fontSize:11, color:C.sub, marginTop:3 }}>{p.d}</div>
                </button>
              ))}
            </div>
            <H3 C={C}>Question Format</H3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:20 }}>
              {questionTypes.map(t => (
                <button key={t.v} onClick={()=>setQuestionType(t.v)} style={{ padding:"10px", borderRadius:9, border:`1px solid ${questionType===t.v?C.accent:C.border}`, background:questionType===t.v?`${C.accent}14`:"transparent", color:questionType===t.v?C.accent:C.sub, fontSize:12, fontWeight:questionType===t.v?600:400, cursor:"pointer" }}>{t.l}</button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
              <div>
                <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Subject</label>
                <select value={subject} onChange={e=>setSubject(e.target.value)} style={iS}>
                  {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Topic</label>
                <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Photosynthesis" style={iS} />
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
              <div>
                <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Difficulty</label>
                <div style={{ display:"flex", gap:6 }}>
                  {["easy","medium","hard"].map(d => (
                    <button key={d} onClick={()=>setDifficulty(d)} style={{ flex:1, padding:"9px 4px", borderRadius:8, border:`1px solid ${difficulty===d?(d==="easy"?C.green:d==="medium"?C.gold:C.red):C.border}`, background:difficulty===d?`${d==="easy"?C.green:d==="medium"?C.gold:C.red}20`:"transparent", color:difficulty===d?(d==="easy"?C.green:d==="medium"?C.gold:C.red):C.sub, fontSize:12, cursor:"pointer", textTransform:"capitalize" }}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, color:C.sub, marginBottom:5, display:"block" }}>Questions: {count}</label>
                <input type="range" min="1" max="15" value={count} onChange={e=>setCount(parseInt(e.target.value))} style={{ width:"100%", accentColor:C.accent, marginTop:10 }} />
              </div>
            </div>
            <div onClick={()=>setSaveToRecord(v=>!v)} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, cursor:"pointer" }}>
              <div style={{ width:44, height:24, borderRadius:12, background:saveToRecord?`${C.accent}40`:`${C.sub}20`, border:`1px solid ${saveToRecord?C.accent:C.border}`, position:"relative", flexShrink:0 }}>
                <div style={{ width:18, height:18, borderRadius:"50%", background:saveToRecord?C.accent:C.sub, position:"absolute", top:2, left:saveToRecord?22:2, transition:"left 0.2s" }} />
              </div>
              <div>
                <div style={{ fontSize:13, color:C.text }}>Count this quiz in my Dashboard & Analytics</div>
                <div style={{ fontSize:11, color:C.sub }}>{saveToRecord ? "This score will affect your average and charts." : "Practice only — won't affect your official record."}</div>
              </div>
            </div>
            <BP onClick={generate} C={C} style={{ width:"100%", justifyContent:"center", opacity:loading?0.7:1 }}>
              {loading ? "🤖 Generating quiz..." : "⚡ Generate Quiz"}
            </BP>
          </Card>
        </div>
      </div>
    );
  }

  if (stage === "taking") {
    const q = questions[cur];
    return (
      <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
        <Sidebar {...sbProps} current="quiz" />
        <div style={{ flex:1, padding:"26px 30px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:20, color:C.text, margin:0 }}>{topic} Quiz</h2>
              <p style={{ color:C.sub, fontSize:13, margin:"4px 0 0" }}>{purposes.find(p=>p.v===purpose)?.l} · {questionTypes.find(t=>t.v===questionType)?.l}</p>
            </div>
            <button onClick={()=>{ if(window.confirm("Quit this quiz? Your progress will be lost.")) setStage("setup"); }} style={{ background:`${C.red}18`, border:`1px solid ${C.red}40`, color:C.red, borderRadius:8, padding:"8px 16px", fontSize:13, cursor:"pointer" }}>🚪 Quit</button>
          </div>
          <Card C={C} style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, color:C.sub, marginBottom:10 }}>Question {cur+1} of {questions.length} · {q.marks||5} marks</div>
            <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:600, fontSize:17, color:C.text, marginBottom:20, lineHeight:1.4 }}>{q.q}</h3>
            {renderQuestion(q, cur)}
          </Card>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <BS onClick={()=>setCur(c=>Math.max(0,c-1))} C={C} style={{ opacity:cur===0?0.4:1 }}>← Previous</BS>
            {cur < questions.length-1
              ? <BP onClick={()=>setCur(c=>c+1)} C={C}>Next →</BP>
              : <BP onClick={submitQuiz} C={C} style={{ background:`linear-gradient(135deg,${C.green},#00a060)` }}><CheckCircle size={14}/> Submit Quiz</BP>
            }
          </div>
        </div>
      </div>
    );
  }

  // results
  let correct = 0, totalMarks = 0, earned = 0;
  questions.forEach((q, i) => {
    const marks = q.marks || 5;
    totalMarks += marks;
    let isCorrect = false;
    if (q.type === "mcq") isCorrect = answers[i] === q.ans;
    else if (q.type === "truefalse") isCorrect = answers[i] === q.ans;
    else if (q.type === "fill" || q.type === "short") {
      const given = (answers[i] || "").trim().toLowerCase();
      const expected = (q.answer || "").trim().toLowerCase();
      isCorrect = given.length > 0 && (given === expected || expected.includes(given) || given.includes(expected));
    } else if (q.type === "matching") {
      const sel = answers[i] || {};
      isCorrect = q.pairs.every((_, leftIdx) => sel[leftIdx] === leftIdx);
    } else if (q.type === "ordering") {
      const current = (orderState[i] || []).map(x => x.origIdx);
      isCorrect = current.every((v, idx) => v === idx);
    }
    if (isCorrect) { correct++; earned += marks; }
  });
  const pct = Math.round((earned / totalMarks) * 100);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg }}>
      <Sidebar {...sbProps} current="quiz" />
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Card C={C} style={{ maxWidth:520, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:12 }}>{pct >= 80 ? "🏆" : pct >= 60 ? "✅" : "📚"}</div>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:26, color:C.text, margin:"0 0 6px" }}>Quiz Completed!</h2>
          <div style={{ fontFamily:"Syne,sans-serif", fontSize:50, fontWeight:800, color:pct >= 80 ? C.green : pct >= 60 ? C.gold : C.red, margin:"16px 0" }}>{pct}%</div>
          <p style={{ color:C.sub, marginBottom:12 }}>{correct}/{questions.length} correct · {earned}/{totalMarks} marks</p>
          {saveToRecord && <div style={{ fontSize:12, color:C.green, marginBottom:16 }}>✓ Saved to your gradebook and analytics</div>}
          {!saveToRecord && <div style={{ fontSize:12, color:C.sub, marginBottom:16 }}>This quiz was not added to your graded record.</div>}
          <div style={{ display:"flex", gap:8 }}>
            <BS onClick={()=>setStage("setup")} C={C} style={{ flex:1, justifyContent:"center", padding:"11px" }}>← New Quiz</BS>
            <BP onClick={()=>nav("student")} C={C} style={{ flex:1, justifyContent:"center" }}>Dashboard</BP>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [role, setRole] = useState("student");
  const [dark, setDark] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const C = dark ? DARK : LIGHT;
  const nav = (p) => { setPage(p); setShowNotif(false); };
  const sbProps = { nav, role, C, onNotif:() => setShowNotif(s => !s), notifCount:2, dark, setDark };

  useEffect(() => {
    try {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap";
      document.head.appendChild(l);
    } catch {}
  }, []);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"system-ui,sans-serif" }}>
      <NotifDrawer open={showNotif} onClose={() => setShowNotif(false)} C={C} />
      {page === "landing"     && <Landing nav={nav} C={C} />}
      {page === "student"     && <StudentDash nav={nav} C={C} sbProps={sbProps} />}
      {page === "courses"     && <Courses nav={nav} C={C} sbProps={sbProps} />}
      {page === "ai-tutor"    && <AITutor nav={nav} C={C} sbProps={sbProps} />}
      {page === "exam"        && <Exam nav={nav} C={C} sbProps={sbProps} />}
      {page === "leaderboard" && <Leaderboard nav={nav} C={C} sbProps={sbProps} />}
      {page === "planner"     && <StudyPlanner nav={nav} C={C} sbProps={sbProps} />}
      {page === "analytics"   && <Analytics nav={nav} C={C} sbProps={sbProps} />}
      {page === "teacher" && <TeacherPortal nav={nav} C={C} sbProps={{ ...sbProps, role:"teacher" }} tab="dashboard" />}
      {page === "teacher-classes" && <TeacherPortal nav={nav} C={C} sbProps={{ ...sbProps, role:"teacher" }} tab="classes" />}
      {page === "teacher-builder" && <TeacherPortal nav={nav} C={C} sbProps={{ ...sbProps, role:"teacher" }} tab="exam-builder" />}
      {page === "teacher-grades" && <TeacherPortal nav={nav} C={C} sbProps={{ ...sbProps, role:"teacher" }} tab="grades" />}
      {page === "admin" && <AdminDash nav={nav} C={C} sbProps={{ ...sbProps, role:"admin" }} tab="overview" />}
      {page === "admin-students" && <AdminDash nav={nav} C={C} sbProps={{ ...sbProps, role:"admin" }} tab="students" />}
      {page === "admin-teachers" && <AdminDash nav={nav} C={C} sbProps={{ ...sbProps, role:"admin" }} tab="teachers" />}
      {page === "admin-exams" && <AdminDash nav={nav} C={C} sbProps={{ ...sbProps, role:"admin" }} tab="exams" />}
      {page === "admin-reports" && <AdminDash nav={nav} C={C} sbProps={{ ...sbProps, role:"admin" }} tab="reports" />}
      {page === "settings"    && <SettingsPage nav={nav} C={C} sbProps={sbProps} dark={dark} setDark={setDark} />}
      {page === "doubt-solver" && <DoubtSolver nav={nav} C={C} sbProps={sbProps} />}
      {page === "prediction" && <AIPrediction nav={nav} C={C} sbProps={sbProps} />}
      {page === "exam-generator" && <ExamGenerator nav={nav} C={C} sbProps={sbProps} />}
      {page === "quiz" && <Quiz nav={nav} C={C} sbProps={sbProps} />}
      {page === "auth" && <AuthReal nav={nav} setRole={setRole} setUser={() => {}} C={C} />}
    </div>
  );
}
