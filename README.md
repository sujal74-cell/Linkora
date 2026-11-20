# Linkora — Class Project Team Formation & Collaboration Platform

Static site: HTML + CSS + vanilla JS. No build step, no dependencies.
Class: TY-CSE-A · Guide: Prof. S. Deshpande

## IMPORTANT — index.html must be at the ROOT
After unzipping you should see `index.html` directly inside the folder you deploy:

    linkora/
      index.html      <-- must be here, NOT inside another sub-folder
      dashboard.html
      ...
      assets/

If Vercel shows "404: page could not be found", your project root contains the
folder (e.g. `linkora/linkora/index.html`) instead of the files. Fix: open the
inner folder and deploy the files that sit next to index.html.

## Deploy on Vercel — read START-HERE.txt first
If Vercel shows "404: page could not be found", the folder you uploaded does not have
index.html at its top level, or the project's Root Directory is not empty.
Fix: Settings -> General -> Root Directory -> clear it (must be "."), then Redeploy.
Backup host: https://app.netlify.com/drop (drag the same folder).

## Deploy on Vercel
1. Unzip. Open the folder and confirm you can see index.html at the top level.
2. Go to https://vercel.com/new and DRAG THAT FOLDER onto the page, then Deploy.
   (Or push these files to the ROOT of a GitHub repo and Import it.)
3. Leave every setting as default — no build command, no output directory.
   vercel.json is already included.

Local test: `python3 -m http.server 3000` -> http://localhost:3000

## Assets included (~13 MB)
- `assets/img/` — 10 custom illustrations & UI mockups (dashboard, collaboration, faculty
  analytics, workspace, 6 project thumbnails), hero + section background textures
- `assets/img/avatars/` — 10 generated student avatars
- `assets/img/brand/` — Linkora logo, favicon (.png/.ico), apple-touch-icon, logo lockup and
  `linkora-intro.gif` (the animated logo intro, also rendered live as SVG on the landing page)
- `assets/fonts/` — Inter (6 weights) + Sora (3 weights) self-hosted woff2, so the site keeps
  its typography offline and on Vercel

## Pages (14, as per the brief)
1. index.html — Landing (animated Linkora logo intro)
2. register.html + login.html — Register & Login (verified sign-up)
3. dashboard.html — Student Dashboard
4. profile.html — Student Profile (skills, proficiency, interests, availability, roles)
5. projects.html — Project Discovery (filters: domain, skills, vacancies)
6. project-details.html — Project Details (goals, roles, skills, timeline, members)
7. create-project.html — Create / Edit Project (+ duplicate-idea detection)
8. matches.html — Matches (ranked recommendations, compatibility factors, skill gaps)
9. applications.html — Applications & Invitations
10. workspace.html — Team Workspace (chat, tasks, milestones, files, meetings, repo)
11. notifications.html — Notifications
12. faculty.html — Faculty Dashboard
13. admin.html — Administration
14. about.html — About, FAQ & Policies
(+ 404.html custom error page)

## Notes
- A demo student (Aarav Sharma) is signed in automatically so every page works.
  Login page also accepts: aarav.sharma@pccoepune.org / PRN 220701 / any 6+ char password.
- Data lives in browser localStorage; Administration -> "Reset demo data" restores it.

## Visual upgrade (v3)
Aurora-glass design layer: animated aurora background + starfield, glassmorphism cards with
cursor-spotlight hover, gradient flow buttons/bars, glowing score rings, scroll progress bar,
cursor glow and back-to-top. Implemented in `assets/css/styles.css` (V3 section) and the
effects module at the end of `assets/js/app.js`.

## Interface v4 — Daylight SaaS theme
Full light interface: floating glass navbar, white cards with soft shadows, indigo/violet/cyan
accent system, full-bleed project thumbnails, light forms/tables/badges and a matching light
splash intro. Implemented as the V4 section in `assets/css/styles.css`; all pages, content and
features are unchanged.

## Layout v5 — app-shell + dark/light toggle
App pages (Dashboard, Discover, Matches, Workspace, etc.) use a fixed left sidebar layout on
desktop and the top bar on mobile; the landing hero is centered. A sun/moon toggle in the navbar
switches between light and dark themes (`data-theme="dark"` on <html>, saved as
`localStorage.linkora_theme`, applied pre-paint by the inline head script in each page).
Implemented in the V5 sections of `assets/css/styles.css` and `assets/js/app.js`.

## Update — theme toggle removed
The dark/light toggle was removed on request. The site always renders in the bright theme;
any previously saved `linkora_theme` value is cleared automatically on load. The v5 sidebar
layout for app pages is unchanged.

## Update — project cover images removed
The neon project cover/thumbnail images were removed on request from Discover project cards,
Project Details headers and Faculty incomplete-team cards. Nothing was added in their place;
cards now start directly with the domain badge and title.

## Visual polish v7
Premium finish: richer mesh background, gradient section underlines, solid gradient feature
icon tiles and domain badges, deeper layered card shadows with cursor spotlight, gradient
showcase frame, deep-gradient CTA panel, breadcrumb pills, zebra tables and sidebar active
indicator. Implemented as the V7 section in `assets/css/styles.css`.


## Update v8 — dark mode restored
The sun/moon dark/light toggle is visible again in the navbar/sidebar. The selected theme
is saved as `localStorage.linkora_theme`, applied before paint by each page's inline head
script, and the V7 polished surfaces include dark-mode adjustments. Project cover images
remain removed.


## Update v9 — cursor comet follower
A decorative gradient aura, bright dot and soft sparkle trail now follow the mouse on
fine-pointer devices. The aura expands over links, buttons, inputs and cards, compresses
on click, keeps the native cursor visible, and is disabled on touch devices and when
reduced motion is preferred.


## Update v10 — normal cursor restored
The V9 cursor comet follower was removed on request. The site now uses the normal
browser cursor only, with a small CSS cache-safety rule to hide any stale follower
elements from a previously cached script.


## Update v11 — subtle premium glow
A single soft blue/purple radial glow now follows the mouse smoothly on fine-pointer
devices while keeping the normal arrow cursor visible. Inputs, selects and textareas
also use a consistent blue/purple glowing border and outer shadow on focus across
login, registration, search and application forms. The effect is disabled on touch
devices and for reduced-motion users.


## Update v12 — cursor glow removed
The soft glow behind the mouse cursor was removed on request, so the cursor is back
to normal with nothing following it. The blue/purple input focus glow remains enabled
for form fields.


## Update v13 — premium logo intro animation
The opening splash now correctly renders the Linkora mark inside a glass orbit stage.
The shared SVG logo was enriched with a halo, second pulse, frame links and orbit dots;
the splash adds sparkles, staged link/node drawing, a shining LINKORA wordmark cascade,
an earlier tagline reveal, a glowing progress bar and a smoother exit. Header logos also
get a subtle hover lift/tilt.


## Update v14 — cinematic logo intro
The opening logo sequence was upgraded again with a larger 3D glass stage, orbiting
ellipses, converging particles, an energy burst, lockup light sweep, flip-in LINKORA
letters, a pill tagline, a wider progress bar and an iris-style exit. The splash hold
was slightly extended to 2.85s so the full sequence can play.

V15: Smoothed the logo intro for performance — transform/opacity-only animation (no animated blur/filters/blend/clip-path), fewer particles, single soft shadow, scaleX progress bar, 2.15s hold, .55s fade exit; the full-screen aurora background no longer hue-rotates and pauses behind the splash.

V16: Emails must end with @pccoepune.org only — enforced on the register form (with a clear inline error) and on email logins; all placeholders and demo account emails use @pccoepune.org.

V17: Renamed all visible "Roll number" labels/copy to "PRN number" (register, login, profile, Admin/Faculty tables, home and About). Internal field name and demo values unchanged.

V18: Added the 18 First Year class/division choices from the supplied AS & H 2026–27 Semester I timetable to the Registration and Profile dropdowns and the Admin class list. Mapping retained from the PDF: Mechanical A–C; E&TC D–F; VLSI G; Civil H; Civil RL I; Computer J–M; Computer-R N; IT O–P; AI-ML Q–R. Existing Third Year choices remain available.

V19: Removed the old “Existing classes” dropdown group and its TY-CSE/TY-IT/TY-ENTC options from Registration and Profile. The Admin class list now also contains only the 18 First Year class/division entries extracted from the supplied timetable.

V20-live: Updated only the homepage hero slogan to ‘YOUR TEAM IS ONE LINK AWAY’. The pending OTP source remains separate until its email-service environment variables are configured.

V21: Replaced the generated Linkora SVG mark with the user-supplied connected-network logo (cleaned to a transparent 720px asset) across navigation, login, footer, 404 and splash placements. Added a lightweight transform/opacity intro with rotating orbital rings, converging stage particles and node-like sparks; header hover remains subtle.


## Update v24 — cinematic logo motion (navbar, login, dashboard & footer)
The original raster emblem is untouched; the surrounding motion was rebuilt end to end.
A shared `.lk` layer stack (ambient studio glow · controlled bloom · chromatic cyan/violet rim
light masked to the mark · glossy brushed-metal glass tile on compact placements · masked
specular sweep · splash-only comet light-trail, converging micro-particles, floor reflection and
cast shadow) gives the logo a premium 3D presence. Timeline: 0–0.55s ambient rise, 0.5–1.6s
light-trail reveal + converging particles, 0.6–2.15s eased settle with reflection, 2.5s specular
sweep, then a calm ambient breathing idle. Interactive pointer tilt (desktop, fine pointer) on
every logo placement. Compositor-friendly (transform/opacity only), no WebGL, no continuous
spinning/bouncing, respects `prefers-reduced-motion`, particles hidden on phones. Applied
everywhere via the shared `[data-logo]` markup in `assets/js/app.js` with styles in the V24
section of `assets/css/styles.css`; the splash auto-dismisses at ~3.25s or on click.
