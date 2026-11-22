/* ============================================================
   LINKORA — Demo data layer (localStorage backed)
   ============================================================ */
const DB_KEY = "linkora_db_v2";

const SKILLS = ["React","Node.js","Python","Flask","Django","MongoDB","MySQL","Firebase","UI/UX Design","Figma","Machine Learning","Data Analysis","TensorFlow","Flutter","Android","Java","C++","DSA","Cloud / AWS","Docker","Git","Technical Writing","Canva","Video Editing","IoT / Arduino","Cybersecurity","Blockchain","React Native"];
const INTERESTS = ["Web Development","App Development","Machine Learning","Data Science","IoT","Cybersecurity","Cloud Computing","Blockchain","AR/VR","Game Dev","Open Source","UI/UX","Research","Competitive Coding","Robotics","Social Impact","FinTech","HealthTech","EdTech","Automation"];
const ROLES = ["Frontend Developer","Backend Developer","Full Stack Developer","UI/UX Designer","ML Engineer","Data Analyst","Mobile Developer","DevOps","Team Lead","Documentation & Presentation","QA / Testing","Research & Content"];
const DOMAINS = ["Web Development","Mobile App","Machine Learning","Data Science","IoT","Cybersecurity","Cloud / DevOps","Blockchain","AR/VR","Robotics","Social Impact","FinTech","HealthTech","EdTech","Automation"];
const CLASSES = [
  // First Year — AS & H 2026–27 timetable (Divisions A–R)
  "MECH-A","MECH-B","MECH-C",
  "ENTC-D","ENTC-E","ENTC-F","VLSI-G",
  "CIVIL-H","CIVIL-RL-I",
  "COMP-J","COMP-K","COMP-L","COMP-M","COMP-R-N",
  "IT-O","IT-P","AI-ML-Q","AI-ML-R"
];

const SEED = {
  user: null,           // logged-in student
  users: [
    {id:"u1",name:"Aarav Sharma",email:"aarav.sharma@pccoepune.org",roll:"220701",cls:"",year:"Third Year",branch:"CSE",
     skills:[{n:"React",p:88},{n:"Node.js",p:74},{n:"MongoDB",p:70},{n:"UI/UX Design",p:62},{n:"Git",p:80}],
     interests:["Web Development","Open Source","EdTech"],roles:["Frontend Developer","Full Stack Developer","Team Lead"],
     availability:"10-15 hrs/week",exp:"2 hackathons, 1 freelance website",bio:"Love building clean UIs and shipping fast.",portfolio:[]},
    {id:"u2",name:"Sneha Kulkarni",email:"sneha.k@pccoepune.org",roll:"220714",cls:"",year:"Third Year",branch:"CSE",
     skills:[{n:"Python",p:92},{n:"Machine Learning",p:85},{n:"TensorFlow",p:72},{n:"Data Analysis",p:78},{n:"Flask",p:60}],
     interests:["Machine Learning","Data Science","Research"],roles:["ML Engineer","Data Analyst","Research & Content"],
     availability:"12-18 hrs/week",exp:"Kaggle 2 competitions, research paper draft",bio:"ML enthusiast, loves NLP.",portfolio:[]},
    {id:"u3",name:"Rohan Deshmukh",email:"rohan.d@pccoepune.org",roll:"220722",cls:"",year:"Third Year",branch:"CSE",
     skills:[{n:"UI/UX Design",p:90},{n:"Figma",p:88},{n:"Canva",p:80},{n:"Technical Writing",p:70},{n:"React",p:55}],
     interests:["UI/UX","Web Development","Social Impact"],roles:["UI/UX Designer","Documentation & Presentation"],
     availability:"8-12 hrs/week",exp:"Designed 3 college event apps",bio:"Design-first thinker.",portfolio:[]},
    {id:"u4",name:"Isha Patil",email:"isha.p@pccoepune.org",roll:"220731",cls:"",year:"Third Year",branch:"CSE",
     skills:[{n:"Java",p:82},{n:"Android",p:76},{n:"Firebase",p:68},{n:"DSA",p:85},{n:"Git",p:70}],
     interests:["App Development","Competitive Coding"],roles:["Mobile Developer","Backend Developer"],
     availability:"10-14 hrs/week",exp:"CodeChef 3★, Android club member",bio:"Android + problem solving.",portfolio:[]},
    {id:"u5",name:"Karan Joshi",email:"karan.j@pccoepune.org",roll:"220740",cls:"",year:"Third Year",branch:"CSE",
     skills:[{n:"Node.js",p:80},{n:"Docker",p:65},{n:"Cloud / AWS",p:62},{n:"MySQL",p:75},{n:"MongoDB",p:66}],
     interests:["Cloud Computing","Web Development","DevOps"],roles:["Backend Developer","DevOps","Full Stack Developer"],
     availability:"15-20 hrs/week",exp:"AWS Cloud Practitioner, 2 internships",bio:"Backend & infra guy.",portfolio:[]},
    {id:"u6",name:"Neha Rane",email:"neha.r@pccoepune.org",roll:"220748",cls:"",year:"Third Year",branch:"CSE",
     skills:[{n:"Data Analysis",p:84},{n:"Python",p:80},{n:"MySQL",p:72},{n:"Canva",p:74},{n:"Technical Writing",p:82}],
     interests:["Data Science","Research","Social Impact"],roles:["Data Analyst","Documentation & Presentation"],
     availability:"6-10 hrs/week",exp:"College magazine editor, data intern",bio:"Numbers and narratives.",portfolio:[]},
    {id:"u7",name:"Aditya Menon",email:"aditya.m@pccoepune.org",roll:"220755",cls:"",year:"Third Year",branch:"CSE",
     skills:[{n:"IoT / Arduino",p:78},{n:"C++",p:80},{n:"Python",p:70},{n:"Video Editing",p:60}],
     interests:["IoT","Robotics","Automation"],roles:["Backend Developer","Full Stack Developer","QA / Testing"],
     availability:"12-16 hrs/week",exp:"Smart irrigation prototype, Robocon participant",bio:"Hardware + code.",portfolio:[]},
    {id:"u8",name:"Pooja Nair",email:"pooja.n@pccoepune.org",roll:"220762",cls:"",year:"Third Year",branch:"CSE",
     skills:[{n:"Cybersecurity",p:72},{n:"Python",p:68},{n:"Docker",p:55},{n:"DSA",p:70}],
     interests:["Cybersecurity","Open Source"],roles:["QA / Testing","Backend Developer"],
     availability:"8-12 hrs/week",exp:"CTF player, TryHackMe top 5%",bio:"Break things to build them better.",portfolio:[]},
    {id:"u9",name:"Vikram Salunkhe",email:"vikram.s@pccoepune.org",roll:"220770",cls:"",year:"Third Year",branch:"CSE",
     skills:[{n:"C++",p:88},{n:"DSA",p:90},{n:"React",p:52}],
     interests:["Competitive Coding","Web Development"],roles:["Full Stack Developer"],
     availability:"10-15 hrs/week",exp:"Codeforces Specialist",bio:"DSA first, frameworks later.",portfolio:[]},
    {id:"u10",name:"Meera Iyer",email:"meera.i@pccoepune.org",roll:"220778",cls:"",year:"Third Year",branch:"CSE",
     skills:[{n:"Flutter",p:74},{n:"Firebase",p:70},{n:"UI/UX Design",p:66},{n:"Figma",p:72}],
     interests:["App Development","UI/UX","HealthTech"],roles:["Mobile Developer","UI/UX Designer"],
     availability:"9-13 hrs/week",exp:"Built a health-tracking app",bio:"Cross-platform app builder.",portfolio:[]}
  ],
  projects: [
    {id:"p1",owner:"u2",title:"CampusConnect",tagline:"A private event + noticeboard app for our college",
     domain:"Web Development",problem:"Students miss club events and notices because information is scattered across WhatsApp groups. We want one verified campus feed with event registration.",
     size:4,deadline:"2026-11-20",timeline:"10 weeks",status:"open",created:"2026-10-12",
     roles:[{role:"Frontend Developer",skills:["React","UI/UX Design"],filled:null},
            {role:"Backend Developer",skills:["Node.js","MongoDB"],filled:"u5"},
            {role:"UI/UX Designer",skills:["Figma","Canva"],filled:null},
            {role:"Documentation & Presentation",skills:["Technical Writing"],filled:null}],
     members:["u2","u5"],github:"github.com/linkora/campusconnect"},
    {id:"p2",owner:"u1",title:"StudySprint",tagline:"Pomodoro + group study rooms with streak tracking",
     domain:"Web Development",problem:"Students study alone and lose consistency. We are building shared focus rooms with streaks, leaderboards and subject-wise analytics.",
     size:4,deadline:"2026-11-28",timeline:"12 weeks",status:"open",created:"2026-10-18",
     roles:[{role:"Full Stack Developer",skills:["React","Node.js"],filled:"u1"},
            {role:"Backend Developer",skills:["Node.js","MySQL"],filled:null},
            {role:"UI/UX Designer",skills:["Figma"],filled:null},
            {role:"Data Analyst",skills:["Data Analysis","Python"],filled:null}],
     members:["u1"],github:"github.com/linkora/studysprint"},
    {id:"p3",owner:"u7",title:"Smart Classroom Monitor",tagline:"IoT sensors tracking occupancy, temperature and energy use",
     domain:"IoT",problem:"Classrooms keep lights and fans on when empty. We will build sensor nodes with a dashboard showing live usage and saving estimates.",
     size:3,deadline:"2026-11-15",timeline:"8 weeks",status:"open",created:"2026-10-05",
     roles:[{role:"Backend Developer",skills:["Python","Flask"],filled:null},
            {role:"Full Stack Developer",skills:["React","Data Analysis"],filled:null},
            {role:"QA / Testing",skills:["Python"],filled:null}],
     members:["u7"],github:"github.com/linkora/smart-classroom"},
    {id:"p4",owner:"u4",title:"Placement Prep Tracker",tagline:"Track DSA sheets, mock interviews and company drives",
     domain:"Data Science",problem:"Final year students do not know which companies they are ready for. We will build a readiness score from DSA progress and mock results.",
     size:4,deadline:"2026-11-25",timeline:"10 weeks",status:"open",created:"2026-10-20",
     roles:[{role:"Data Analyst",skills:["Data Analysis","Python"],filled:null},
            {role:"Frontend Developer",skills:["React","UI/UX Design"],filled:null},
            {role:"Backend Developer",skills:["Java","MySQL"],filled:"u4"},
            {role:"UI/UX Designer",skills:["Figma","Canva"],filled:null}],
     members:["u4"],github:"github.com/linkora/placement-prep"},
    {id:"p5",owner:"u8",title:"PhishGuard",tagline:"Browser extension that flags suspicious links for students",
     domain:"Cybersecurity",problem:"Students click phishing links in internship mails. We will build an extension with heuristic checks and a reporting dashboard.",
     size:3,deadline:"2026-12-02",timeline:"9 weeks",status:"open",created:"2026-10-22",
     roles:[{role:"Full Stack Developer",skills:["React","Python"],filled:null},
            {role:"Data Analyst",skills:["Python","Machine Learning"],filled:null},
            {role:"Documentation & Presentation",skills:["Technical Writing"],filled:null}],
     members:["u8"],github:"github.com/linkora/phishguard"},
    {id:"p6",owner:"u10",title:"MediRemind",tagline:"Medicine reminder app for elderly family members",
     domain:"Mobile App",problem:"Elderly people forget doses. We are building a simple Flutter app with reminders and caretaker alerts.",
     size:3,deadline:"2026-11-30",timeline:"8 weeks",status:"open",created:"2026-10-25",
     roles:[{role:"Mobile Developer",skills:["Flutter","Firebase"],filled:"u10"},
            {role:"Backend Developer",skills:["Firebase","Node.js"],filled:null},
            {role:"UI/UX Designer",skills:["Figma"],filled:null}],
     members:["u10"],github:"github.com/linkora/mediremind"}
  ],
  applications: [
    {id:"a1",project:"p1",from:"u1",role:"Frontend Developer",msg:"I have built two React dashboards and can own the frontend end to end.",status:"pending",date:"2026-10-26"},
    {id:"a2",project:"p1",from:"u3",role:"UI/UX Designer",msg:"I can design the full screen flow in Figma this week.",status:"accepted",date:"2026-10-24"},
    {id:"a3",project:"p2",from:"u5",role:"Backend Developer",msg:"Happy to set up Node + MySQL and the focus-room sockets.",status:"pending",date:"2026-10-27"},
    {id:"a4",project:"p3",from:"u1",role:"Full Stack Developer",msg:"I can build the dashboard with React and chart the sensor data.",status:"pending",date:"2026-10-28"}
  ],
  invitations: [
    {id:"i1",project:"p2",to:"u3",role:"UI/UX Designer",status:"pending",date:"2026-10-29",note:"Your design work on the fest app was great — would love you on this."},
    {id:"i2",project:"p1",to:"u6",role:"Documentation & Presentation",status:"pending",date:"2026-10-27",note:"We need someone for docs and final presentation."}
  ],
  notifications: [
    {id:"n1",type:"invitation",title:"Invitation from StudySprint",body:"Sneha Kulkarni invited you to join as Backend Developer.",time:"2 hours ago",read:false,icon:"✉"},
    {id:"n2",type:"application",title:"Application received",body:"Karan Joshi applied to StudySprint for Backend Developer.",time:"5 hours ago",read:false,icon:"📄"},
    {id:"n3",type:"deadline",title:"Deadline in 15 days",body:"Smart Classroom Monitor stops accepting applications on 15 Nov 2026.",time:"Yesterday",read:false,icon:"⏰"},
    {id:"n4",type:"team",title:"New milestone assigned",body:"CampusConnect → 'Design system ready' is due on 5 Nov.",time:"2 days ago",read:true,icon:"🎯"},
    {id:"n5",type:"system",title:"Profile completeness 80%",body:"Add your availability to get better matches.",time:"3 days ago",read:true,icon:"⚙"}
  ],
  tasks: [
    {id:"t1",project:"p1",title:"Finalise event feed wireframes",who:"u3",state:"done",due:"2026-10-30"},
    {id:"t2",project:"p1",title:"Set up Express + MongoDB schema",who:"u5",state:"doing",due:"2026-11-03"},
    {id:"t3",project:"p1",title:"Build React event card component",who:"u1",state:"todo",due:"2026-11-06"},
    {id:"t4",project:"p1",title:"Write project synopsis for faculty",who:"u2",state:"todo",due:"2026-11-08"},
    {id:"t5",project:"p2",title:"Focus room socket prototype",who:"u1",state:"doing",due:"2026-11-04"},
    {id:"t6",project:"p2",title:"Pomodoro timer UI in Figma",who:"u3",state:"todo",due:"2026-11-07"}
  ],
  milestones: [
    {id:"m1",project:"p1",title:"Design system ready",date:"2026-11-05",done:false},
    {id:"m2",project:"p1",title:"Backend API v1",date:"2026-11-18",done:false},
    {id:"m3",project:"p1",title:"Beta release to class",date:"2026-12-05",done:false},
    {id:"m4",project:"p1",title:"Synopsis submitted",date:"2026-10-20",done:true}
  ],
  files: [
    {id:"f1",project:"p1",name:"CampusConnect_Synopsis.pdf",by:"u2",size:"412 KB",date:"2026-10-22"},
    {id:"f2",project:"p1",name:"Wireframes_v3.fig",by:"u3",size:"2.8 MB",date:"2026-10-27"},
    {id:"f3",project:"p1",name:"ER_Diagram.png",by:"u5",size:"186 KB",date:"2026-10-29"}
  ],
  meetings: [
    {id:"mt1",project:"p1",title:"Weekly standup",when:"2026-11-02 · 6:00 PM",where:"Google Meet",by:"u2"},
    {id:"mt2",project:"p1",title:"Design review with guide",when:"2026-11-09 · 11:00 AM",where:"Lab 3",by:"u3"}
  ],
  messages: [
    {id:"c1",project:"p1",from:"u2",text:"Team, synopsis is approved by the guide 🎉",time:"09:12"},
    {id:"c2",project:"p1",from:"u5",text:"Nice. I will start the Express boilerplate today.",time:"09:20"},
    {id:"c3",project:"p1",from:"u3",text:"Wireframes v3 is in Files — please review before standup.",time:"10:04"},
    {id:"c4",project:"p1",from:"u1",text:"Reviewed. I will start the React event card after this.",time:"10:31"}
  ],
  reports: [
    {id:"r1",type:"Project",target:"Spam project post",by:"Anonymous",date:"2026-10-28",status:"open"},
    {id:"r2",type:"Profile",target:"Incorrect class details",by:"Faculty",date:"2026-10-26",status:"resolved"}
  ],
  settings:{inviteCode:"LINKORA-2026",allowPublicBrowse:false,autoMatch:true,deadlineAlerts:true,facultyReview:true}
};

/* ---------- persistence ---------- */
function loadDB(){
  try{
    const raw = localStorage.getItem(DB_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  const copy = JSON.parse(JSON.stringify(SEED));
  try{ localStorage.setItem(DB_KEY, JSON.stringify(copy)); }catch(e){}
  return copy;
}
function saveDB(){ try{ localStorage.setItem(DB_KEY, JSON.stringify(db)); }catch(e){} }
function resetDB(){ try{ localStorage.removeItem(DB_KEY); }catch(e){} location.reload(); }

let db = loadDB();
const U = id => db.users.find(u=>u.id===id) || {name:"Unknown",id:id,skills:[],initials:"?"};
const P = id => db.projects.find(p=>p.id===id);
const initials = n => (n||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const skillLevel = (u,n) => { const s=(u.skills||[]).find(x=>x.n===n); return s?s.p:0; };

/* ---------- Matching engine (skills 50 / interests 20 / availability 20 / experience 10) ---------- */
function compatScore(user, project){
  const req = [];
  (project.roles||[]).forEach(r=>{ if(!r.filled) (r.skills||[]).forEach(s=>req.push(s)); });
  const uniq = [...new Set(req)];
  let skillPct = 0;
  if(uniq.length){
    const got = uniq.map(s=>{
      const lvl = skillLevel(user,s);
      return lvl>=80?100:lvl>=60?80:lvl>=40?55:lvl>0?30:0;
    });
    skillPct = got.reduce((a,b)=>a+b,0)/got.length;
  } else skillPct = 50;

  const inter = (project.interests || guessInterests(project));
  const iPct = inter.length ? (inter.filter(i=>(user.interests||[]).includes(i)).length/inter.length)*100 : 60;

  const aPct = availabilityFit(user);

  const exp = (user.exp||"").length;
  const ePct = Math.min(100, exp>60?100:exp>30?75:exp>10?50:25);

  const total = Math.round(skillPct*0.5 + iPct*0.2 + aPct*0.2 + ePct*0.1);
  return {
    total: Math.max(12, Math.min(99, total)),
    skills: Math.round(skillPct), interests: Math.round(iPct),
    availability: Math.round(aPct), experience: Math.round(ePct),
    missing: uniq.filter(s=>skillLevel(user,s)<40)
  };
}
function guessInterests(p){
  const map = {"Web Development":["Web Development"],"Mobile App":["App Development"],"Machine Learning":["Machine Learning","Data Science"],
    "Data Science":["Data Science","Research"],"IoT":["IoT","Robotics"],"Cybersecurity":["Cybersecurity"],
    "Cloud / DevOps":["Cloud Computing"],"Blockchain":["Blockchain"],"AR/VR":["AR/VR"],"Robotics":["Robotics"],
    "Social Impact":["Social Impact"],"FinTech":["FinTech"],"HealthTech":["HealthTech"],"EdTech":["EdTech"],"Automation":["Automation"]};
  return map[p.domain] || ["Web Development"];
}
function availabilityFit(u){
  const a = (u.availability||"").replace(/\s/g,"");
  const m = a.match(/(\d+)-(\d+)/);
  if(!m) return 60;
  const mid = (+m[1] + +m[2])/2;
  return mid>=14?100:mid>=11?85:mid>=8?65:45;
}
/* Skill-gap detection for a project */
function skillGaps(project){
  const have = [];
  project.members.forEach(id=>{ (U(id).skills||[]).forEach(s=>have.push(s.n)); });
  const req = [];
  (project.roles||[]).forEach(r=>{ if(!r.filled) (r.skills||[]).forEach(s=>req.push(s)); });
  return {open:[...new Set(req)].filter(s=>!have.includes(s)), openRoles:(project.roles||[]).filter(r=>!r.filled).map(r=>r.role)};
}
/* Duplicate idea detection */
function duplicateOf(title, problem, excludeId){
  const words = s => new Set((s||"").toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=>w.length>3));
  const a = words(title+" "+problem);
  let best = null;
  db.projects.forEach(p=>{
    if(p.id===excludeId) return;
    let inter = 0; const b = words(p.title+" "+p.problem+" "+p.tagline);
    a.forEach(w=>{ if(b.has(w)) inter++; });
    const pct = Math.round((inter/Math.max(4,a.size))*100);
    if(pct>28 && (!best || pct>best.pct)) best = {p, pct:Math.min(96,pct)};
  });
  return best;
}
