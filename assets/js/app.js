/* ============================================================
   LINKORA — shared UI + page logic
   ============================================================ */

/* ---------- animated logo (shared cinematic treatment) ----------
   Layers (back → front): ambient glow · bloom · chromatic rims · cast shadow
   · the original untouched raster mark · specular sheen · comet ring · particles.
   All motion is transform/opacity only; the source PNG is never modified. */
const LOGO_SVG = `
<span class="lk" role="img" aria-label="Linkora connected network logo">
  <span class="lk-ambient" aria-hidden="true"></span>
  <span class="lk-plate" aria-hidden="true"></span>
  <span class="lk-bloom" aria-hidden="true"><img src="assets/img/linkora-network-logo.png" alt="" decoding="async"></span>
  <span class="lk-rim lk-rim-cyan" aria-hidden="true"></span>
  <span class="lk-rim lk-rim-violet" aria-hidden="true"></span>
  <img class="lk-img" src="assets/img/linkora-network-logo.png" alt="Linkora logo" decoding="async">
  <span class="lk-reflect" aria-hidden="true"><img src="assets/img/linkora-network-logo.png" alt="" decoding="async"></span>
  <span class="lk-sheen" aria-hidden="true"></span>
  <span class="lk-comet" aria-hidden="true"></span>
  <span class="lk-particles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
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
function formatDateDMY(s){
  if(!s) return "";
  const m=String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m?`${m[3]}/${m[2]}/${m[1]}`:s;
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
      <span>⏳ Apply by ${formatDateDMY(p.deadline)}</span><span>${open.length} open role${open.length===1?"":"s"}</span>
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

/* ---------- interactive 3D tilt for the logo ----------
   A subtle, physics-feeling tilt on the shared logo mark. Desktop
   (fine pointer) only, disabled for reduced-motion users. Uses nested
   transform layers, so entrance animations on child layers never fight it. */
function initLogoTilt(){
  try{
    if(window.matchMedia && (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(pointer: coarse)").matches)) return;
    const MAX = 11;
    document.querySelectorAll("[data-logo]").forEach(host=>{
      const inner = host.querySelector(".lk");
      if(!inner || host._lkTiltBound) return;
      host._lkTiltBound = true;
      let raf = 0;
      host.addEventListener("pointermove", e=>{
        const r = host.getBoundingClientRect();
        if(r.width < 2 || r.height < 2) return;
        const px = ((e.clientX - (r.left + r.width/2)) / (r.width/2));
        const py = ((e.clientY - (r.top + r.height/2)) / (r.height/2));
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(()=>{
          inner.style.transition = "transform .12s cubic-bezier(.2,.7,.3,1)";
          inner.style.transform = "rotateY(" + (px*MAX).toFixed(2) + "deg) rotateX(" + (-py*MAX).toFixed(2) + "deg)";
        });
      }, {passive:true});
      host.addEventListener("pointerleave", ()=>{
        cancelAnimationFrame(raf);
        inner.style.transition = "transform .62s cubic-bezier(.2,.9,.24,1.18)";
        inner.style.transform = "rotateY(0deg) rotateX(0deg)";
      }, {passive:true});
    });
  }catch(e){ /* tilt is progressive enhancement */ }
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
  let introDelay = 3250;
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
  animateBars(); revealOnScroll(); tiltCards(); counters(); bindTabs(); runSplash(); initLogoTilt();

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

      /* Interactive 3D Neural Network Background */
      var canvas = document.createElement("canvas");
      canvas.id = "stars";
      document.body.insertBefore(canvas, document.body.firstChild);
      var ctx = null;
      try{ ctx = canvas.getContext("2d"); }catch(e){ ctx = null; }
      if(ctx){
        var W = 0, H = 0, dpr = 1, nodes = [], maxDist = 145;
        var mx = -9999, my = -9999, cmx = -9999, cmy = -9999, mouseActive = false;
        var palette = [
          [56, 189, 248],  /* cyan */
          [59, 130, 246],  /* electric blue */
          [139, 92, 246],  /* neon purple */
          [34, 211, 238]   /* bright cyan */
        ];
        function resize(){
          dpr = Math.min(window.devicePixelRatio || 1, 2);
          W = window.innerWidth;
          H = window.innerHeight;
          canvas.width = Math.round(W * dpr);
          canvas.height = Math.round(H * dpr);
          canvas.style.width = W + "px";
          canvas.style.height = H + "px";
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          maxDist = W < 640 ? 110 : 150;
          var target = W < 640 ? 65 : Math.min(180, Math.max(85, Math.round(W * H / 10500)));
          nodes = [];
          for(var i = 0; i < target; i++){
            var z = 0.2 + Math.random() * 0.8; /* 0.2 = near, 1.0 = far */
            var col = palette[i % palette.length];
            nodes.push({
              x: Math.random() * W,
              y: Math.random() * H,
              z: z,
              vx: (Math.random() - 0.5) * (0.28 + (1 - z) * 0.28),
              vy: (Math.random() - 0.5) * (0.28 + (1 - z) * 0.28),
              vz: (Math.random() - 0.5) * 0.0018,
              r: (1.1 + (1 - z) * 1.9),
              phase: Math.random() * Math.PI * 2,
              col: col
            });
          }
        }
        resize();
        window.addEventListener("resize", resize);
        if(!reduce && window.matchMedia && window.matchMedia("(pointer: fine)").matches){
          document.addEventListener("pointermove", function(e){
            mx = e.clientX; my = e.clientY; mouseActive = true;
          }, {passive:true});
          document.addEventListener("pointerleave", function(){ mouseActive = false; }, {passive:true});
        }
        var t = 0, rafId = 0;
        function frame(){
          if(document.hidden){ rafId = 0; return; }
          t += 0.016;
          ctx.clearRect(0, 0, W, H);

          /* soft atmospheric blue & purple lighting */
          var g1 = ctx.createRadialGradient(W * 0.22, H * 0.18, 0, W * 0.22, H * 0.18, Math.max(W, H) * 0.55);
          g1.addColorStop(0, "rgba(59,130,246,0.11)");
          g1.addColorStop(1, "rgba(59,130,246,0)");
          ctx.fillStyle = g1;
          ctx.fillRect(0, 0, W, H);

          var g2 = ctx.createRadialGradient(W * 0.80, H * 0.78, 0, W * 0.80, H * 0.78, Math.max(W, H) * 0.55);
          g2.addColorStop(0, "rgba(139,92,246,0.10)");
          g2.addColorStop(1, "rgba(139,92,246,0)");
          ctx.fillStyle = g2;
          ctx.fillRect(0, 0, W, H);

          /* smooth cursor light */
          if(mouseActive){
            if(cmx < -1000){ cmx = mx; cmy = my; }
            cmx += (mx - cmx) * 0.10;
            cmy += (my - cmy) * 0.10;
            var cg = ctx.createRadialGradient(cmx, cmy, 0, cmx, cmy, 210);
            cg.addColorStop(0, "rgba(99,102,241,0.14)");
            cg.addColorStop(0.5, "rgba(56,189,248,0.06)");
            cg.addColorStop(1, "rgba(56,189,248,0)");
            ctx.fillStyle = cg;
            ctx.fillRect(cmx - 210, cmy - 210, 420, 420);
          }

          /* update & project 3D particles */
          for(var i = 0; i < nodes.length; i++){
            var p = nodes[i];
            if(!reduce){
              p.x += p.vx; p.y += p.vy; p.z += p.vz;
              if(p.x < -20) p.x = W + 20; else if(p.x > W + 20) p.x = -20;
              if(p.y < -20) p.y = H + 20; else if(p.y > H + 20) p.y = -20;
              if(p.z < 0.2){ p.z = 0.2; p.vz *= -1; } else if(p.z > 1.0){ p.z = 1.0; p.vz *= -1; }
              if(mouseActive){
                var dxm = cmx - p.x, dym = cmy - p.y;
                var dm2 = dxm * dxm + dym * dym;
                if(dm2 < 28900 && dm2 > 1){
                  var dm = Math.sqrt(dm2);
                  var pull = (1 - dm / 170) * 0.22 * (1.2 - p.z);
                  p.x += (dxm / dm) * pull;
                  p.y += (dym / dm) * pull;
                }
              }
            }
          }

          /* draw neural connections */
          var maxDist2 = maxDist * maxDist;
          ctx.lineWidth = 0.85;
          for(var i = 0; i < nodes.length; i++){
            var a = nodes[i];
            for(var j = i + 1; j < nodes.length; j++){
              var b = nodes[j];
              var dx = a.x - b.x, dy = a.y - b.y;
              var d2 = dx * dx + dy * dy;
              if(d2 < maxDist2){
                var depthFactor = 1 - (a.z + b.z) * 0.35;
                var alpha = (1 - Math.sqrt(d2) / maxDist) * 0.26 * depthFactor;
                if(alpha > 0.015){
                  ctx.strokeStyle = "rgba(" + a.col[0] + "," + a.col[1] + "," + a.col[2] + "," + alpha.toFixed(3) + ")";
                  ctx.beginPath();
                  ctx.moveTo(a.x, a.y);
                  ctx.lineTo(b.x, b.y);
                  ctx.stroke();
                }
              }
            }
            /* cursor-to-particle connections */
            if(mouseActive){
              var dxc = cmx - a.x, dyc = cmy - a.y;
              var dc2 = dxc * dxc + dyc * dyc;
              if(dc2 < 28900){
                var ac = (1 - Math.sqrt(dc2) / 170) * 0.32 * (1.15 - a.z * 0.5);
                if(ac > 0.02){
                  ctx.strokeStyle = "rgba(56,189,248," + ac.toFixed(3) + ")";
                  ctx.beginPath();
                  ctx.moveTo(a.x, a.y);
                  ctx.lineTo(cmx, cmy);
                  ctx.stroke();
                }
              }
            }
          }

          /* draw 3D glowing particles */
          for(var i = 0; i < nodes.length; i++){
            var p = nodes[i];
            var pulse = 0.72 + 0.28 * Math.sin(p.phase + t * 1.4);
            var alpha = (0.28 + (1 - p.z) * 0.55) * pulse;
            var r = p.r;
            /* soft outer halo for closer particles */
            if(p.z < 0.65){
              ctx.beginPath();
              ctx.arc(p.x, p.y, r * 2.6, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(" + p.col[0] + "," + p.col[1] + "," + p.col[2] + "," + (alpha * 0.18).toFixed(3) + ")";
              ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(" + p.col[0] + "," + p.col[1] + "," + p.col[2] + "," + alpha.toFixed(3) + ")";
            ctx.fill();
          }

          if(!reduce) rafId = requestAnimationFrame(frame);
        }
        document.addEventListener("visibilitychange", function(){
          if(!document.hidden && !reduce && !rafId) rafId = requestAnimationFrame(frame);
        });
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
