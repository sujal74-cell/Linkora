/* ============================================================
   LINKORA — shared UI + page logic
   ============================================================ */

/* ---------- animated logo (SVG) ---------- */
const LOGO_SVG = `
<span class="network-logo" role="img" aria-label="Linkora connected network logo">
  <span class="network-logo-glass-back" aria-hidden="true"></span>
  <span class="network-logo-glass-face" aria-hidden="true"></span>
  <span class="network-logo-glass-caustic" aria-hidden="true"></span>
  <span class="network-logo-aura" aria-hidden="true"></span>
  <span class="network-logo-pulse pulse-a" aria-hidden="true"></span>
  <span class="network-logo-pulse pulse-b" aria-hidden="true"></span>
  <span class="network-logo-ring network-logo-ring-a" aria-hidden="true"></span>
  <span class="network-logo-ring network-logo-ring-b" aria-hidden="true"></span>
  <span class="network-logo-orbit orbit-a" aria-hidden="true"><i></i></span>
  <span class="network-logo-orbit orbit-b" aria-hidden="true"><i></i></span>
  <img class="network-logo-img" src="assets/img/linkora-network-logo.png" alt="" decoding="async">
  <span class="network-logo-glass-reflection" aria-hidden="true"></span>
  <span class="network-logo-glass-glint" aria-hidden="true"></span>
  <span class="network-logo-shine" aria-hidden="true"></span>
  <span class="network-logo-spark spark-a" aria-hidden="true"></span>
  <span class="network-logo-spark spark-b" aria-hidden="true"></span>
  <span class="network-logo-spark spark-c" aria-hidden="true"></span>
</span>`;

/* ---------- navigation ---------- */
const NAV = [
  {href:"dashboard.html", label:"Dashboard"},
  {href:"projects.html",  label:"Discover"},
  {href:"matches.html",   label:"Matches"},
  {href:"applications.html", label:"Requests"},
  {href:"workspace.html", label:"Workspace"},
  {href:"notifications.html", label:"Notifications"},
  {href:"faculty.html",   label:"Faculty"},
  {href:"admin.html",     label:"Admin"}
];
function renderNav(active){
  document.querySelectorAll("[data-nav]").forEach(el=>{
    el.innerHTML = NAV.map(n=>`<a href="${n.href}" class="${n.href===active?'active':''}">${n.label}</a>`).join("");
  });
}

/* ---------- toasts ---------- */
function toast(msg, kind="ok"){
  let box = document.getElementById("toasts");
  if(!box){ box = document.createElement("div"); box.id="toasts"; document.body.appendChild(box); }
  const ic = kind==="ok"?"✓":kind==="warn"?"!":"i";
  const t = document.createElement("div");
  t.className = "toast "+kind;
  t.innerHTML = `<div class="ic">${ic}</div><div>${msg}</div>`;
  box.appendChild(t);
  setTimeout(()=>{ t.classList.add("out"); setTimeout(()=>t.remove(),320); }, 2800);
}

/* ---------- auth ---------- */
const PUBLIC_PAGES = ["index.html","login.html","register.html","about.html"];
function requireAuth(){
  const page = location.pathname.split("/").pop() || "index.html";
  if(!PUBLIC_PAGES.includes(page) && !db.user){
    // Demo mode: sign in as the sample student so every page is browsable.
    db.user = "u1"; saveDB();
    setTimeout(()=>toast("Signed in as demo student — Aarav Sharma","info"), 700);
  }
}
function loginAs(id){
  db.user = id; db.users.find(u=>u.id===id).notifications = db.users.find(u=>u.id===id).notifications;
  saveDB();
  const n = new URLSearchParams(location.search).get("next");
  toast("Welcome back, "+U(id).name.split(" ")[0]+" 👋");
  setTimeout(()=>location.href = n || "dashboard.html", 700);
}
function logout(){ db.user=null; saveDB(); location.href="index.html"; }
function me(){ return db.user ? U(db.user) : null; }

/* ---------- media helpers ---------- */
const AVATARS = {u1:'aarav',u2:'sneha',u3:'rohan',u4:'isha',u5:'karan',u6:'neha',u7:'aditya',u8:'pooja',u9:'vikram',u10:'meera'};
const THUMBS = {"Web Development":'proj-web.png',"Mobile App":'proj-health.png',"Machine Learning":'proj-study.png',
  "Data Science":'proj-placement.png','IoT':'proj-iot.png',"Cybersecurity":'proj-security.png',
  "Cloud / DevOps":'proj-web.png',"Blockchain":'proj-security.png',"AR/VR":'proj-study.png',
  "Robotics":'proj-iot.png',"Social Impact":'proj-web.png',"FinTech":'proj-placement.png',
  "HealthTech":'proj-health.png',"EdTech":'proj-study.png',"Automation":'proj-iot.png'};
function thumbOf(p){ return 'assets/img/' + (THUMBS[p.domain] || 'proj-web.png'); }
function avatarOf(u){ return 'assets/img/avatars/' + (AVATARS[u.id] || 'aarav') + '.png'; }
function avImg(u, cls){
  if(!u) return '';
  return `<img class="avatar ${cls||''}" src="${avatarOf(u)}" alt="${u.name}" title="${u.name}" loading="lazy" onerror="this.style.display='none'">`;
}

/* ---------- shared rendering helpers ---------- */
function chips(list, cls="chip"){
  return (list||[]).map(s=>`<span class="${cls}">${s}</span>`).join("");
}
function skillChips(u, lim){
  const s = (u.skills||[]).slice().sort((a,b)=>b.p-a.p);
  return (lim?s.slice(0,lim):s).map(x=>`<span class="chip skill">${x.n} <b style="opacity:.7">${x.p}</b></span>`).join("");
}
function scoreRing(v, sm=false){
  const c = v>=75?"#34d399":v>=50?"#22d3ee":"#fbbf24";
  return `<div class="score ${sm?'sm':''}" style="--v:${v};--c:${c}"><span>${v}</span></div>`;
}
function progress(pct, label){
  return `<div style="margin:.4rem 0 .2rem"><div class="row-b small muted" style="margin-bottom:.3rem"><span>${label||""}</span><b>${pct}%</b></div><div class="bar"><i data-w="${pct}"></i></div></div>`;
}
function projectCard(p, opts={}){
  const owner = U(p.owner), sc = db.user ? compatScore(U(db.user), p) : null;
  const open = (p.roles||[]).filter(r=>!r.filled);
  const filled = (p.roles||[]).filter(r=>r.filled).length;
  return `
  <a class="card hover" href="project-details.html?id=${p.id}">
    <div class="row-b" style="margin-bottom:.7rem">
      <span class="badge b-brand">${p.domain}</span>
      <span class="small muted">${p.members.length}/${p.size} members</span>
    </div>
    <h3 style="margin-bottom:.25rem">${p.title}</h3>
    <p class="small" style="min-height:2.6em">${p.tagline}</p>
    <div class="row" style="gap:.35rem;margin:.65rem 0">${chips(open.slice(0,3).map(r=>r.role))}</div>
    <div class="bar thin" style="margin:.7rem 0 .55rem"><i data-w="${Math.round(filled/(p.roles||[]).length*100)}"></i></div>
    <div class="row-b">
      <div class="stack">${p.members.slice(0,4).map(m=>avImg(U(m),'sm')).join("")}</div>
      ${sc?`<div class="row" style="gap:.5rem">${scoreRing(sc.total,true)}<span class="small muted">match</span></div>`:`<span class="small muted">by ${owner.name.split(" ")[0]}</span>`}
    </div>
    <div class="row-b small muted" style="margin-top:.75rem;border-top:1px dashed var(--stroke);padding-top:.65rem">
      <span>⏳ Apply by ${p.deadline}</span><span>${open.length} open role${open.length===1?"":"s"}</span>
    </div>
  </a>`;
}
function emptyBox(txt, emoji="✨"){
  return `<div class="empty"><div class="e">${emoji}</div><p>${txt}</p></div>`;
}

/* ---------- animations ---------- */
function animateBars(){
  document.querySelectorAll(".bar > i[data-w]").forEach(i=>{
    const w = i.getAttribute("data-w");
    requestAnimationFrame(()=>{ i.style.width = w+"%"; });
  });
}
function revealOnScroll(){
  const io = new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach((el,i)=>{ el.style.transitionDelay = (i%6*60)+"ms"; io.observe(el); });
}
function tiltCards(){
  document.querySelectorAll(".fcard").forEach(c=>{
    c.addEventListener("pointermove", e=>{
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX-r.left)+"px");
      c.style.setProperty("--my", (e.clientY-r.top)+"px");
    });
  });
}
function counters(){
  document.querySelectorAll("[data-count]").forEach(el=>{
    const target = +el.getAttribute("data-count");
    let n = 0; const step = Math.max(1, Math.ceil(target/60));
    const t = setInterval(()=>{
      n += step;
      if(n>=target){ n = target; clearInterval(t); }
      el.textContent = n + (el.dataset.suffix||"");
    }, 22);
  });
}

/* ---------- splash intro (landing page) ---------- */
function runSplash(){
  const s = document.getElementById("splash");
  if(!s) return;
  let seen = "0";
  try{ seen = sessionStorage.getItem("linkora_intro_v23") || "0"; }catch(e){}
  if(seen === "1"){ s.remove(); return; }
  try{ sessionStorage.setItem("linkora_intro_v23","1"); }catch(e){}
  const finish = ()=>{
    s.classList.add("out");
    setTimeout(()=>s.remove(), 650);
  };
  let introDelay = 3650;
  try{ if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) introDelay = 550; }catch(e){}
  const t = setTimeout(finish, introDelay);
  s.addEventListener("click", ()=>{ clearTimeout(t); finish(); });
}

/* ---------- modal ---------- */
function openModal(html){
  let m = document.getElementById("modal");
  if(!m){ m = document.createElement("div"); m.className="modal"; m.id="modal"; document.body.appendChild(m); }
  m.innerHTML = `<div class="box">${html}</div>`;
  m.classList.add("on");
  m.onclick = e=>{ if(e.target===m) closeModal(); };
  animateBars();
}
function closeModal(){ const m=document.getElementById("modal"); if(m) m.classList.remove("on"); }

/* ---------- tabs ---------- */
function bindTabs(){
  document.querySelectorAll("[data-tabs]").forEach(group=>{
    const btns = group.querySelectorAll("button[data-tab]");
    btns.forEach(b=>b.addEventListener("click",()=>{
      const scope = document.querySelector(b.dataset.scope || "body");
      btns.forEach(x=>x.classList.remove("on")); b.classList.add("on");
      scope.querySelectorAll(".panel").forEach(p=>p.classList.toggle("on", p.id===b.dataset.tab));
      animateBars();
    }));
  });
}

/* ---------- misc ---------- */
function toggleNav(){
  document.querySelectorAll(".nav-links").forEach(n=>n.classList.toggle("open"));
}
function initialsOf(name){ return initials(name); }

document.addEventListener("DOMContentLoaded", ()=>{
  document.querySelectorAll("[data-logo]").forEach(el=>el.innerHTML = LOGO_SVG);
  const page = location.pathname.split("/").pop() || "index.html";
  renderNav(page);
  if(!PUBLIC_PAGES.includes(page)) requireAuth();
  animateBars(); revealOnScroll(); tiltCards(); counters(); bindTabs(); runSplash();

  const u = me();
  if(u){
    document.querySelectorAll(".nav .container").forEach(c=>{
      const b = document.createElement("button");
      b.className = "btn btn-sm btn-ghost"; b.textContent = "Sign out";
      b.onclick = logout; c.appendChild(b);
    });
  }
  document.querySelectorAll("[data-user-name]").forEach(e=>{ if(u) e.textContent = u.name; });
  document.querySelectorAll("[data-user-initials]").forEach(e=>{
    if(!u) return;
    if(e.tagName === "A"){
      e.innerHTML = `<img class="avatar" src="${avatarOf(u)}" alt="${u.name}" onerror="this.remove();this.parentElement.textContent='${initials(u.name)}'">`;
    } else e.textContent = initials(u.name);
  });
  document.querySelectorAll("[data-user-avatar]").forEach(e=>{ if(u) e.src = avatarOf(u); });
  document.querySelectorAll("[data-user-meta]").forEach(e=>{ if(u) e.textContent = u.roll+" · "+u.cls; });
  document.querySelectorAll("[data-user-cls]").forEach(e=>{ if(u) e.textContent = u.cls; });

  const unread = db.notifications.filter(n=>!n.read).length;
  document.querySelectorAll("[data-unread]").forEach(e=>{
    e.textContent = unread; e.style.display = unread? "inline-flex":"none";
  });

  if(typeof pageInit === "function") pageInit();
});

/* ============================================================
   V3 — visual effects: starfield, cursor glow, scroll progress,
   card spotlight, back-to-top (progressive enhancement only)
   ============================================================ */
(function(){
  function initFx(){
    try{
      var reduce = false;
      try{ reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){}

      /* scroll progress bar */
      var prog = document.createElement("div");
      prog.id = "scroll-progress";
      document.body.appendChild(prog);

      /* back-to-top */
      var toTop = document.createElement("button");
      toTop.id = "toTop"; toTop.type = "button";
      toTop.setAttribute("aria-label","Back to top");
      toTop.textContent = "↑";
      toTop.addEventListener("click", function(){ window.scrollTo({top:0, behavior: reduce ? "auto" : "smooth"}); });
      document.body.appendChild(toTop);

      var nav = document.querySelector(".nav");
      function onScroll(){
        var y = window.scrollY || document.documentElement.scrollTop || 0;
        var h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + "%";
        if(nav) nav.classList.toggle("scrolled", y > 24);
        toTop.classList.toggle("show", y > 520);
      }
      window.addEventListener("scroll", onScroll, {passive:true});
      onScroll();

      /* cursor glow */
      var glow = document.createElement("div");
      glow.id = "cursor-glow";
      document.body.appendChild(glow);
      var gx = -600, gy = -600, tx = -600, ty = -600, glowOn = false;
      document.addEventListener("pointermove", function(e){
        tx = e.clientX; ty = e.clientY;
        if(!glowOn){ glowOn = true; glow.style.opacity = "1"; gx = tx; gy = ty; }
      }, {passive:true});
      document.addEventListener("pointerleave", function(){ glow.style.opacity = "0"; glowOn = false; });

      /* card spotlight (sets --mx/--my used by the CSS layer) */
      var spotTick = false, lastEvt = null;
      document.addEventListener("pointermove", function(e){
        lastEvt = e;
        if(spotTick) return; spotTick = true;
        requestAnimationFrame(function(){
          spotTick = false;
          if(!lastEvt || !lastEvt.target || !lastEvt.target.closest) return;
          var c = lastEvt.target.closest(".card,.stat");
          if (!c) return;
          var r = c.getBoundingClientRect();
          c.style.setProperty("--mx", ((lastEvt.clientX - r.left) / r.width * 100) + "%");
          c.style.setProperty("--my", ((lastEvt.clientY - r.top) / r.height * 100) + "%");
        });
      }, {passive:true});

      /* starfield */
      var canvas = document.createElement("canvas");
      canvas.id = "stars";
      document.body.insertBefore(canvas, document.body.firstChild);
      var ctx = null;
      try{ ctx = canvas.getContext("2d"); }catch(e){ ctx = null; }
      if(false && ctx){ /* starfield disabled — light theme */
        var W = 0, H = 0, stars = [];
        function resize(){
          W = canvas.width = window.innerWidth;
          H = canvas.height = window.innerHeight;
          var n = Math.min(150, Math.max(60, Math.round(W * H / 16000)));
          stars = [];
          for(var i = 0; i < n; i++){
            stars.push({
              x: Math.random() * W, y: Math.random() * H,
              r: Math.random() * 1.4 + 0.3,
              p: Math.random() * Math.PI * 2,
              s: 0.4 + Math.random() * 1.1,
              hue: [210, 190, 265, 320][Math.floor(Math.random() * 4)]
            });
          }
        }
        resize();
        window.addEventListener("resize", resize);
        var t = 0;
        function frame(){
          t += 0.016;
          ctx.clearRect(0, 0, W, H);
          for(var i = 0; i < stars.length; i++){
            var st = stars[i];
            var a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(st.p + t * st.s));
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
            ctx.fillStyle = "hsla(" + st.hue + ",95%,82%," + a.toFixed(3) + ")";
            ctx.fill();
          }
          /* smooth cursor glow follow */
          gx += (tx - gx) * 0.08; gy += (ty - gy) * 0.08;
          glow.style.transform = "translate(" + (gx - 280) + "px," + (gy - 280) + "px)";
          if(!reduce) requestAnimationFrame(frame);
        }
        frame();
      } else {
        document.addEventListener("pointermove", function(e){
          glow.style.transform = "translate(" + (e.clientX - 280) + "px," + (e.clientY - 280) + "px)";
        }, {passive:true});
      }
    }catch(err){ /* effects are optional — never break the page */ }
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", initFx);
  else initFx();
})();

/* ============================================================
   V8 — dark / light mode toggle restored + app-page layout class
   ============================================================ */
(function(){
  var KEY = "linkora_theme";
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  function storedTheme(){
    try{ return localStorage.getItem(KEY) === "dark" ? "dark" : "light"; }
    catch(e){ return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  }
  function applyTheme(theme, save){
    var dark = theme === "dark";
    if(dark) document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    if(save){ try{ localStorage.setItem(KEY, dark ? "dark" : "light"); }catch(e){} }
    var meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute("content", dark ? "#0a0f1d" : "#eef1f8");
    var btn = document.getElementById("themeToggle");
    if(btn){
      btn.innerHTML = (dark ? SUN : MOON) + '<span class="tt-label">' + (dark ? "Light mode" : "Dark mode") + '</span>';
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.title = dark ? "Switch to light mode" : "Switch to dark mode";
    }
    return dark ? "dark" : "light";
  }
  function ensureToggle(){
    if(document.getElementById("themeToggle")) return;
    var wrap = document.querySelector(".nav .container");
    if(!wrap) return;
    var btn = document.createElement("button");
    btn.id = "themeToggle";
    btn.type = "button";
    btn.addEventListener("click", function(){
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next, true);
      try{ if(typeof toast === "function") toast(next === "dark" ? "Dark mode on" : "Light mode on", "info"); }catch(e){}
    });
    var before = wrap.querySelector("a.avatar, .nav-toggle");
    if(before) wrap.insertBefore(btn, before); else wrap.appendChild(btn);
  }
  function initTheme(){
    try{
      var page = (location.pathname.split("/").pop() || "index.html");
      var pub = ["index.html", "login.html", "register.html", "about.html", "404.html"];
      if (pub.indexOf(page) === -1) document.documentElement.classList.add("app-page");
      ensureToggle();
      applyTheme(storedTheme(), false);
    }catch(e){}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initTheme);
  else initTheme();
})();
