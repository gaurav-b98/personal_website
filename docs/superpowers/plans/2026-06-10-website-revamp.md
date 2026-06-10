# Personal Website Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full rebuild of the single-page portfolio into a dark luxe editorial design with terminal motifs, per the approved spec at `docs/superpowers/specs/2026-06-10-website-revamp-design.md`.

**Architecture:** Three static files (`index.html`, `styles.css`, `script.js`) rewritten from scratch, no build step. Each task adds one page region (markup + styles + behavior) so the site renders correctly after every task. GSAP/ScrollTrigger and EmailJS load from CDN; everything degrades gracefully if a CDN script fails.

**Tech Stack:** Vanilla HTML/CSS/JS · GSAP 3.12.5 + ScrollTrigger (CDN) · EmailJS 4.4.1 (CDN) · Google Fonts (Fraunces, Inter, JetBrains Mono) · GitHub Pages

**Security note:** all CDN scripts are version-pinned with Subresource Integrity (`integrity="sha384-…" crossorigin="anonymous"`) — hashes computed from the exact pinned files. If a CDN dependency version is ever bumped, its SRI hash must be recomputed (`curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A`). The Google Fonts stylesheet cannot use SRI (responses vary by user agent); that is expected.

---

## File Structure

| File | Responsibility |
|---|---|
| `index.html` | All markup. Rewritten in Task 1 as a skeleton (head, nav, empty `<main>`, footer); Tasks 2–7 insert one section each into `<main>` at marked comments. |
| `styles.css` | All styles. Task 1 writes tokens/reset/shell; each section task appends its own labeled block at the end of the file. |
| `script.js` | All behavior. Task 1 writes the core (nav, progress, drawer, year); Task 2 appends typing effect; Task 7 appends contact form; Task 8 appends GSAP motion. |
| `assets/README.md` | Notes the two user-provided files expected here: `resume.pdf`, `photo.jpg`. |
| `docs/` | Spec + this plan (already committed). |

Verification model: this is a static site with no test framework, so each task ends with (a) a `curl`/`grep` structural check against a local server and (b) a visual check instruction. The dev server starts once in Task 1 and stays up.

**Existing data to preserve exactly** (used in tasks below): GitHub profile `https://github.com/gaurav-b98`, LinkedIn `https://linkedin.com/in/gaurav-b98`, email `gauravb8170@gmail.com`, thesis repo `https://github.com/gaurav-b98/A-Deep-Learning-Feature-Ranked-Backpropagation-Framework-for-Sustainability`, thesis PDF `https://norma.ncirl.ie/7937/1/gaurav.pdf`, CurbTheVirus repo `https://github.com/gaurav-b98/CurbTheVirus`, Greenfield live site `https://136-114-133-166.sslip.io`.

**Known issue carried over:** the EmailJS config in the old `script.js` had placeholder credentials (`YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID`, `YOUR_PUBLIC_KEY`) — the form has never actually sent mail. Task 7 keeps the same placeholder structure at the top of the form code; the user must paste real keys from their EmailJS dashboard for the form to work. Everything else about the form (validation, toast, mailto fallback) works without keys.

---

### Task 1: Skeleton — head, nav, footer, design tokens, background

**Files:**
- Create (overwrite): `index.html`
- Create (overwrite): `styles.css`
- Create (overwrite): `script.js`
- Create: `assets/README.md`

- [ ] **Step 1: Overwrite `index.html` with the skeleton**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="description" content="Gaurav — ML Engineer in Dublin. MSc AI, First-Class Honours. Production ML and sustainable AI research."/>
  <title>Gaurav — ML Engineer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="styles.css"/>
</head>
<body>
  <div id="progress" aria-hidden="true"></div>
  <div id="toast" role="status"></div>
  <div class="grain" aria-hidden="true"></div>

  <nav id="nav">
    <a href="#hero" class="nav-logo">~/gaurav</a>
    <div class="nav-links">
      <a href="#work">Work</a>
      <a href="#experience">Experience</a>
      <a href="#about">About</a>
      <a href="#writing">Writing</a>
      <a href="#contact">Contact</a>
    </div>
    <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </nav>

  <div class="mobile-nav" id="mobile-nav">
    <a href="#work">Work</a>
    <a href="#experience">Experience</a>
    <a href="#about">About</a>
    <a href="#writing">Writing</a>
    <a href="#contact">Contact</a>
  </div>

  <main>
    <!-- HERO -->
    <!-- WORK -->
    <!-- EXPERIENCE -->
    <!-- ABOUT -->
    <!-- SKILLS -->
    <!-- WRITING -->
    <!-- EDU -->
    <!-- CONTACT -->
  </main>

  <footer>
    <div class="footer-left">© <span id="year">2026</span> Gaurav</div>
    <div class="footer-links">
      <a href="mailto:gauravb8170@gmail.com">Email</a>
      <a href="https://linkedin.com/in/gaurav-b98" target="_blank" rel="noopener">LinkedIn</a>
      <a href="https://github.com/gaurav-b98" target="_blank" rel="noopener">GitHub</a>
    </div>
    <div class="footer-right">[ stamp 1g · dublin ]</div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"
          integrity="sha384-g4NTh/Iv5PPU4xPyhEWqPcwtNXOvdaDI8LLnyYfyNZOjKJeYQyjzQ9X5275eBjpt"
          crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"
          integrity="sha384-Z3REaz79l2IaAZqJsSABtTbhjgOUYyV3p90XNnAPCSHg3EMTz1fouunq9WZRtj3d"
          crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4.4.1/dist/email.min.js"
          integrity="sha384-SALc35EccAf6RzGw4iNsyj7kTPr33K7RoGzYu+7heZhT8s0GZouafRiCg1qy44AS"
          crossorigin="anonymous"></script>
  <script src="script.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Overwrite `styles.css` with tokens, reset, shell, nav, footer**

```css
/* ════════ TOKENS ════════ */
:root {
  --bg: #0e0e10;
  --bg-soft: #131316;
  --surface: #16161a;
  --ink: #ece9e2;
  --ink-muted: #a39f95;
  --ink-faint: #6f6f75;
  --gold: #c8a464;
  --gold-bright: #e0bc7a;
  --line: #2a2a30;
  --serif: "Fraunces", Georgia, serif;
  --sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  --mono: "JetBrains Mono", Menlo, monospace;
}

/* ════════ RESET / BASE ════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(ellipse 70% 50% at 50% 110%, rgba(200,164,100,.10), transparent 60%),
    radial-gradient(ellipse 50% 40% at 85% -10%, rgba(200,164,100,.05), transparent 60%);
}
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
em { font-style: italic; }

/* ════════ GRAIN OVERLAY ════════ */
.grain {
  position: fixed;
  inset: 0;
  z-index: 2000;
  pointer-events: none;
  opacity: .05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
}

/* ════════ PROGRESS BAR ════════ */
#progress {
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  width: 0;
  background: var(--gold);
  z-index: 1500;
}

/* ════════ TOAST ════════ */
#toast {
  position: fixed;
  bottom: 28px; left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: var(--surface);
  border: 1px solid var(--gold);
  color: var(--ink);
  font-family: var(--mono);
  font-size: 12px;
  padding: 12px 20px;
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s, transform .3s;
  z-index: 1600;
  max-width: 90vw;
}
#toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
#toast a { color: var(--gold); text-decoration: underline; }

/* ════════ NAV ════════ */
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 5vw;
  z-index: 1000;
  transition: background .3s, border-color .3s, backdrop-filter .3s;
  border-bottom: 1px solid transparent;
}
nav.scrolled {
  background: rgba(14,14,16,.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom-color: var(--line);
}
.nav-logo {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--gold);
  letter-spacing: .04em;
}
.nav-links { display: flex; gap: 30px; }
.nav-links a {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--ink-muted);
  position: relative;
  padding-bottom: 3px;
  transition: color .25s;
}
.nav-links a::after {
  content: "";
  position: absolute;
  left: 0; bottom: 0;
  width: 0; height: 1px;
  background: var(--gold);
  transition: width .3s ease;
}
.nav-links a:hover { color: var(--ink); }
.nav-links a:hover::after { width: 100%; }

/* hamburger (behavior + responsive rules in Task 9) */
.hamburger { display: none; background: none; border: none; cursor: pointer; padding: 6px; }
.hamburger span {
  display: block;
  width: 22px; height: 2px;
  background: var(--ink);
  margin: 4px 0;
  transition: transform .3s, opacity .3s;
}
.mobile-nav {
  position: fixed;
  inset: 0;
  background: rgba(14,14,16,.97);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 34px;
  z-index: 900;
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s;
}
.mobile-nav.open { opacity: 1; pointer-events: auto; }
.mobile-nav a {
  font-family: var(--serif);
  font-size: 28px;
  color: var(--ink);
}

/* ════════ SECTION SHELL ════════ */
section {
  max-width: 1160px;
  margin: 0 auto;
  padding: 120px 5vw;
}
.kicker {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--gold);
  letter-spacing: .14em;
  margin-bottom: 18px;
}
.kicker .dim { color: var(--ink-faint); }
.section-title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.15;
  margin-bottom: 48px;
}
.section-title em { color: var(--ink-muted); }
.gold-rule {
  width: 44px; height: 1px;
  background: var(--gold);
  border: none;
  margin: 0 0 28px;
}

/* ════════ BUTTONS ════════ */
.btn-gold, .btn-ghost {
  display: inline-block;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: .08em;
  text-transform: uppercase;
  padding: 13px 26px;
  transition: transform .25s, background .25s, color .25s, border-color .25s;
}
.btn-gold {
  background: var(--gold);
  color: var(--bg);
  font-weight: 500;
}
.btn-gold:hover { background: var(--gold-bright); transform: translateY(-2px); }
.btn-ghost {
  border: 1px solid var(--line);
  color: var(--ink-muted);
}
.btn-ghost:hover { border-color: var(--gold); color: var(--ink); transform: translateY(-2px); }

/* ════════ FOOTER ════════ */
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  max-width: 1160px;
  margin: 0 auto;
  padding: 36px 5vw 44px;
  border-top: 1px solid var(--line);
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-faint);
  letter-spacing: .06em;
}
.footer-links { display: flex; gap: 22px; }
.footer-links a { color: var(--ink-muted); transition: color .25s; }
.footer-links a:hover { color: var(--gold); }
```

- [ ] **Step 3: Overwrite `script.js` with the core behaviors**

```js
/* Personal site — core behaviors. Sections append below in later tasks. */

const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Nav: blur background after scroll starts ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ── Scroll progress bar ── */
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY /
    (document.body.scrollHeight - window.innerHeight) * 100;
  progress.style.width = pct + '%';
}, { passive: true });

/* ── Mobile drawer ── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
hamburger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ── Footer year ── */
document.getElementById('year').textContent = new Date().getFullYear();
```

- [ ] **Step 4: Create `assets/README.md`**

```markdown
# Assets

Drop these two files here (referenced by the site):

- `resume.pdf` — linked from the hero and contact resume buttons
- `photo.jpg` — replaces the About-section placeholder (see comment in index.html)
```

- [ ] **Step 5: Start the dev server (leave running for all tasks)**

Run: `python3 -m http.server 8000 --directory /Users/gaurav/Desktop/personal_website` (run in background)
Then: `curl -s http://localhost:8000 | grep -c "nav-logo"`
Expected: `1`

- [ ] **Step 6: Visual check**

Open `http://localhost:8000`: near-black page, fixed nav with `~/gaurav` gold logo and 5 mono uppercase links, faint gold glow bottom of viewport, footer at bottom. No console errors except none — check DevTools console is clean.

- [ ] **Step 7: Commit**

```bash
git add index.html styles.css script.js assets/README.md
git commit -m "Rebuild skeleton: dark luxe tokens, nav, footer, grain"
```

---

### Task 2: Hero

**Files:**
- Modify: `index.html` (replace `<!-- HERO -->` comment)
- Modify: `styles.css` (append)
- Modify: `script.js` (append)

- [ ] **Step 1: Replace `<!-- HERO -->` in `index.html` with**

```html
    <section id="hero">
      <p class="kicker hero-kicker"><span id="typed">$ </span><span id="typed-cursor">▌</span></p>
      <h1 class="hero-headline reveal">
        Days are for thinking<br/>about problems.<br/>
        <em>Nights are for solving them.</em>
      </h1>
      <p class="hero-sub reveal"># ML that ships. Curiosity that doesn't quit.</p>
      <div class="hero-actions reveal">
        <a href="#work" class="btn-gold">View Work →</a>
        <a href="assets/resume.pdf" class="btn-ghost" download>Resume PDF ↓</a>
      </div>
      <div class="hero-stats reveal">
        <div class="hstat"><div class="hstat-num">3K+</div><div class="hstat-label">assets monitored</div></div>
        <div class="hstat"><div class="hstat-num">1:1</div><div class="hstat-label">MSc AI honours</div></div>
        <div class="hstat"><div class="hstat-num">2yr</div><div class="hstat-label">production ML</div></div>
      </div>
      <div class="status-badge reveal">
        <span class="status-dot"></span>
        [ status: open to work · stamp 1g · dublin ]
      </div>
    </section>
```

- [ ] **Step 2: Append to `styles.css`**

```css
/* ════════ HERO ════════ */
#hero {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 140px;
}
.hero-kicker { font-size: 13px; min-height: 20px; }
#typed-cursor { color: var(--gold); animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.hero-headline {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(40px, 6.5vw, 76px);
  line-height: 1.12;
  letter-spacing: -.01em;
  margin: 18px 0 26px;
}
.hero-headline em { color: var(--ink-muted); }
.hero-sub {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--ink-faint);
  letter-spacing: .04em;
  margin-bottom: 40px;
}
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 56px; }
.hero-stats { display: flex; gap: 54px; flex-wrap: wrap; margin-bottom: 40px; }
.hstat-num {
  font-family: var(--serif);
  font-size: 30px;
  color: var(--ink);
}
.hstat-label {
  font-family: var(--mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .14em;
  color: var(--ink-faint);
  margin-top: 4px;
}
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-muted);
  letter-spacing: .06em;
  border: 1px solid var(--line);
  padding: 9px 16px;
  width: fit-content;
}
.status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #4ade80;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 50% { opacity: .35; } }
@media (prefers-reduced-motion: reduce) {
  #typed-cursor, .status-dot { animation: none; }
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 3: Append to `script.js`**

```js
/* ── Hero: typed kicker ── */
(function typeKicker() {
  const target = document.getElementById('typed');
  const cursor = document.getElementById('typed-cursor');
  if (!target) return;
  const text = '$ whoami — ML Engineer · Dublin';
  if (prefersReducedMotion) {
    target.textContent = text;
    cursor.style.display = 'none';
    return;
  }
  let i = 1; // "$ " already present
  target.textContent = '$ ';
  const tick = setInterval(() => {
    i++;
    target.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(tick);
      setTimeout(() => { cursor.style.display = 'none'; }, 2500);
    }
  }, 45);
})();
```

- [ ] **Step 4: Verify**

Run: `curl -s http://localhost:8000 | grep -c "hero-headline"`
Expected: `1`
Visual: full-viewport hero; kicker types out `$ whoami — ML Engineer · Dublin` then cursor disappears; serif headline with italic second line in muted tone; gold + ghost buttons; 3 stats; pulsing status badge.

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css script.js
git commit -m "Add hero: typed kicker, serif headline, stats, status badge"
```

---

### Task 3: Selected Work

**Files:**
- Modify: `index.html` (replace `<!-- WORK -->` comment)
- Modify: `styles.css` (append)

- [ ] **Step 1: Replace `<!-- WORK -->` in `index.html` with**

```html
    <section id="work">
      <p class="kicker reveal">$ ls ./selected-work</p>
      <h2 class="section-title reveal">Selected <em>work.</em></h2>

      <div class="work-featured">
        <article class="work-card reveal">
          <p class="work-num">01 · MSc Thesis · 2025</p>
          <h3 class="work-title">Feature-Ranked Backpropagation for Sustainable AI</h3>
          <p class="work-desc">
            Training framework that integrates feature ranking directly into backpropagation
            to cut compute cost. Selective-update strategies across ResNet-18, AlexNet and
            VGGNet-19 on ImageNet-1k, deployed on AWS GPU infrastructure with full experiment
            tracking.
          </p>
          <div class="work-metrics">
            <div class="metric"><span class="metric-val">↓15%</span><span class="metric-label">training time</span></div>
            <div class="metric"><span class="metric-val">↓20%</span><span class="metric-label">energy use</span></div>
            <div class="metric"><span class="metric-val">&lt;2%</span><span class="metric-label">accuracy loss</span></div>
          </div>
          <div class="work-tags">
            <span>PyTorch</span><span>AWS GPU</span><span>ImageNet-1k</span><span>CNNs</span>
          </div>
          <div class="work-links">
            <a href="https://github.com/gaurav-b98/A-Deep-Learning-Feature-Ranked-Backpropagation-Framework-for-Sustainability" target="_blank" rel="noopener">github →</a>
            <a href="https://norma.ncirl.ie/7937/1/gaurav.pdf" target="_blank" rel="noopener">read thesis →</a>
            <span class="work-note"># first-class honours</span>
          </div>
        </article>

        <article class="work-card reveal">
          <p class="work-num">02 · Full-Stack · 2025</p>
          <h3 class="work-title">Greenfield — PC Build Compatibility Engine</h3>
          <p class="work-desc">
            Build planner that catches compatibility failures others miss — PSU transient
            spikes, RAM clearance, workload bottlenecks. Graph-based rule engine with four
            severity layers. Solo build shipped in ~2 weeks: scrapers, API, frontend,
            retrieval-grounded chatbot.
          </p>
          <div class="work-metrics">
            <div class="metric"><span class="metric-val">~2K</span><span class="metric-label">components</span></div>
            <div class="metric"><span class="metric-val">~200</span><span class="metric-label">compat rules</span></div>
            <div class="metric"><span class="metric-val">8</span><span class="metric-label">live routes</span></div>
          </div>
          <div class="work-tags">
            <span>FastAPI</span><span>Next.js 15</span><span>Postgres</span><span>Ollama</span><span>GCP</span>
          </div>
          <div class="work-links">
            <a href="https://136-114-133-166.sslip.io" target="_blank" rel="noopener">live site →</a>
          </div>
        </article>
      </div>

      <div class="work-rows">
        <article class="work-row reveal">
          <span class="work-row-num">03</span>
          <div>
            <h3 class="work-row-title">Industrial Anomaly Detection &amp; RUL Prediction</h3>
            <p class="work-row-desc">Hybrid LSTM/ARIMA forecasting across 3,000+ remote assets — unplanned downtime down ~15–20%.</p>
          </div>
          <span class="work-row-tag">SenseGrow · internal</span>
        </article>
        <article class="work-row reveal">
          <span class="work-row-num">04</span>
          <div>
            <h3 class="work-row-title">CurbTheVirus — Plasma Donation Platform</h3>
            <p class="work-row-desc">ML donor–recipient matching by location and blood group during COVID-19.</p>
          </div>
          <a class="work-row-tag" href="https://github.com/gaurav-b98/CurbTheVirus" target="_blank" rel="noopener">github →</a>
        </article>
        <article class="work-row reveal">
          <span class="work-row-num">05</span>
          <div>
            <h3 class="work-row-title">Bonjour — Real-Time Sign Language Translator</h3>
            <p class="work-row-desc">Sign-to-speech via live video and gesture recognition. The project that started everything.</p>
          </div>
          <span class="work-row-tag">B.Tech · academic</span>
        </article>
      </div>
    </section>
```

- [ ] **Step 2: Append to `styles.css`**

```css
/* ════════ WORK ════════ */
.work-featured {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}
.work-card {
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  transition: transform .3s, border-color .3s;
}
.work-card:hover { transform: translateY(-4px); border-color: rgba(200,164,100,.45); }
.work-num {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--gold);
  letter-spacing: .12em;
  margin-bottom: 14px;
}
.work-title {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 24px;
  line-height: 1.25;
  margin-bottom: 14px;
}
.work-desc { font-size: 14px; color: var(--ink-muted); margin-bottom: 24px; }
.work-metrics { display: flex; gap: 28px; margin-bottom: 22px; }
.metric-val { font-family: var(--serif); font-size: 22px; display: block; }
.metric-label {
  font-family: var(--mono);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--ink-faint);
}
.work-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.work-tags span {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--ink-faint);
  border: 1px solid var(--line);
  padding: 3px 9px;
  letter-spacing: .04em;
}
.work-links {
  display: flex;
  gap: 22px;
  align-items: center;
  margin-top: auto;
  font-family: var(--mono);
  font-size: 12px;
}
.work-links a { color: var(--gold); transition: color .25s; }
.work-links a:hover { color: var(--gold-bright); }
.work-note { color: var(--ink-faint); font-size: 10px; margin-left: auto; }
.work-rows { border-top: 1px solid var(--line); }
.work-row {
  display: grid;
  grid-template-columns: 50px 1fr auto;
  gap: 22px;
  align-items: center;
  padding: 26px 8px;
  border-bottom: 1px solid var(--line);
  transition: background .25s;
}
.work-row:hover { background: var(--bg-soft); }
.work-row-num { font-family: var(--mono); font-size: 12px; color: var(--ink-faint); }
.work-row-title { font-family: var(--serif); font-weight: 500; font-size: 18px; }
.work-row-desc { font-size: 13px; color: var(--ink-muted); margin-top: 4px; }
.work-row-tag {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-faint);
  letter-spacing: .06em;
  white-space: nowrap;
}
a.work-row-tag { color: var(--gold); }
a.work-row-tag:hover { color: var(--gold-bright); }
```

- [ ] **Step 3: Verify**

Run: `curl -s http://localhost:8000 | grep -c "work-card"`
Expected: `2`
Run: `curl -s http://localhost:8000 | grep -c "work-row "` (trailing space — matches the class attr, not row-title/desc)
Expected: `3`
Visual: two featured cards side by side (hover lifts them, border warms), three compact rows below with hover background.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Add selected work: two featured cards, three compact rows"
```

---

### Task 4: Experience

**Files:**
- Modify: `index.html` (replace `<!-- EXPERIENCE -->` comment)
- Modify: `styles.css` (append)

- [ ] **Step 1: Replace `<!-- EXPERIENCE -->` in `index.html` with**

```html
    <section id="experience">
      <p class="kicker reveal">$ git log --work</p>
      <h2 class="section-title reveal">Where I've <em>shipped.</em></h2>

      <div class="xp-list">
        <div class="xp-row xp-lead reveal">
          <div class="xp-date"># jan 2022 → jan 2024</div>
          <div>
            <div class="xp-role">AI Software Engineer</div>
            <div class="xp-co">SenseGrow Technologies · Gurugram, India</div>
            <p class="xp-note">Production ML for 3,000+ industrial assets — anomaly detection, RUL forecasting, deployment cycles cut ~25%.</p>
          </div>
        </div>
        <div class="xp-row reveal">
          <div class="xp-date"># jun 2024 → present</div>
          <div>
            <div class="xp-role">Shift Manager / Customer Service <span class="xp-tag">part-time</span></div>
            <div class="xp-co">Supermac's · Dublin, Ireland</div>
            <p class="xp-note">Financial bridge after the MSc while building Greenfield.</p>
          </div>
        </div>
        <div class="xp-row reveal">
          <div class="xp-date"># jul 2021 → oct 2021</div>
          <div>
            <div class="xp-role">Forward Deployed Software Engineer</div>
            <div class="xp-co">FireVisor Systems · Remote, Singapore</div>
          </div>
        </div>
        <div class="xp-row reveal">
          <div class="xp-date"># jun 2018 → jul 2018</div>
          <div>
            <div class="xp-role">R&amp;D Intern — Ballistics Division</div>
            <div class="xp-co">Forensic Science Laboratory (Govt. of India) · Delhi</div>
          </div>
        </div>
      </div>

      <div class="status-badge reveal" style="margin-top:44px;">
        <span class="status-dot"></span>
        [ available: full-time ML roles · stamp 1g · dublin ]
      </div>
    </section>
```

- [ ] **Step 2: Append to `styles.css`**

```css
/* ════════ EXPERIENCE ════════ */
.xp-list { border-top: 1px solid var(--line); }
.xp-row {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 26px;
  padding: 30px 8px;
  border-bottom: 1px solid var(--line);
}
.xp-lead .xp-role { font-size: 22px; }
.xp-date {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-faint);
  letter-spacing: .06em;
  padding-top: 5px;
}
.xp-role { font-family: var(--serif); font-weight: 500; font-size: 18px; }
.xp-co { font-size: 13px; color: var(--ink-muted); margin-top: 3px; }
.xp-note { font-size: 13px; color: var(--ink-faint); margin-top: 8px; font-style: italic; }
.xp-tag {
  font-family: var(--mono);
  font-size: 9px;
  font-style: normal;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--ink-faint);
  border: 1px solid var(--line);
  padding: 2px 7px;
  vertical-align: middle;
  margin-left: 8px;
}
```

- [ ] **Step 3: Verify**

Run: `curl -s http://localhost:8000 | grep -c "xp-row"`
Expected: `4` (xp-lead row included — grep matches class attribute on all four)
Visual: SenseGrow row visually larger (lead), Supermac's entry shows the "financial bridge" framing in italic, availability badge below the list.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Add experience timeline with SenseGrow lead and bridge framing"
```

---

### Task 5: About + Skills

**Files:**
- Modify: `index.html` (replace `<!-- ABOUT -->` and `<!-- SKILLS -->` comments)
- Modify: `styles.css` (append)

- [ ] **Step 1: Replace `<!-- ABOUT -->` in `index.html` with**

```html
    <section id="about">
      <p class="kicker reveal">$ cat about.md</p>
      <h2 class="section-title reveal">The journey <em>starts with a moment.</em></h2>
      <div class="about-grid">
        <div class="about-text reveal">
          <p>
            I didn't plan on AI. I saw a family speaking sign language with their son and
            couldn't stop wondering whether technology could close that gap — so I built a
            real-time sign language translator as my final-year project.
          </p>
          <p>
            PyData Delhi pulled me deeper. A hackathon problem from the Forensic Science
            Laboratory became a bullet-crater matching tool, then an internship in their
            ballistics division. Since then the problems changed but the approach didn't:
            production ML across 3,000+ industrial assets at SenseGrow, then an MSc in
            Dublin researching sustainable AI.
          </p>
          <p class="about-close">The domain changes. <em>The curiosity doesn't.</em></p>
          <div class="about-community">
            <span class="dim">#</span> PyData Delhi co-organiser since 2020 · volunteer since 2018
          </div>
        </div>
        <figure class="about-photo reveal">
          <!-- When assets/photo.jpg exists, replace this placeholder div with:
               <img src="assets/photo.jpg" alt="Gaurav"/> -->
          <div class="photo-placeholder">
            <span class="ph-monogram">G.</span>
            <span class="ph-note"># photo.jpg — drop into assets/</span>
          </div>
        </figure>
      </div>
    </section>
```

- [ ] **Step 2: Replace `<!-- SKILLS -->` in `index.html` with**

```html
    <section id="skills">
      <p class="kicker reveal">$ ls ./stack</p>
      <h2 class="section-title reveal">The <em>stack.</em></h2>
      <div class="skills-grid">
        <div class="sk-group reveal">
          <h3 class="sk-name">Programming &amp; APIs</h3>
          <div class="sk-tags"><span>Python</span><span>TypeScript</span><span>SQL</span><span>FastAPI</span><span>Pydantic</span><span>REST</span></div>
        </div>
        <div class="sk-group reveal">
          <h3 class="sk-name">Machine Learning &amp; AI</h3>
          <div class="sk-tags"><span>PyTorch</span><span>TensorFlow</span><span>scikit-learn</span><span>Time-Series</span><span>Anomaly Detection</span><span>LLM Apps</span><span>Ollama</span></div>
        </div>
        <div class="sk-group reveal">
          <h3 class="sk-name">MLOps &amp; Monitoring</h3>
          <div class="sk-tags"><span>Experiment Tracking</span><span>Reproducible Pipelines</span><span>Batch + Real-Time Inference</span><span>Model Monitoring</span><span>TensorBoard</span></div>
        </div>
        <div class="sk-group reveal">
          <h3 class="sk-name">Cloud &amp; Infrastructure</h3>
          <div class="sk-tags"><span>AWS EC2 / S3 / IAM</span><span>SageMaker</span><span>GCP</span><span>Docker</span><span>Kubernetes</span><span>CI/CD</span></div>
        </div>
        <div class="sk-group reveal">
          <h3 class="sk-name">Data &amp; Platforms</h3>
          <div class="sk-tags"><span>PostgreSQL</span><span>SQLAlchemy</span><span>Cassandra</span><span>Next.js</span><span>Tailwind CSS</span></div>
        </div>
        <div class="sk-group reveal">
          <h3 class="sk-name">Computer Vision</h3>
          <div class="sk-tags"><span>OpenCV</span><span>Classification</span><span>Defect Detection</span><span>Gesture Recognition</span></div>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Append to `styles.css`**

```css
/* ════════ ABOUT ════════ */
.about-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 60px;
  align-items: start;
}
.about-text p { font-size: 16px; color: var(--ink-muted); margin-bottom: 22px; max-width: 56ch; }
.about-close { font-family: var(--serif); font-size: 21px; color: var(--ink); }
.about-close em { color: var(--ink-muted); }
.about-community {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--ink-muted);
  letter-spacing: .04em;
  border: 1px solid var(--line);
  padding: 12px 16px;
  margin-top: 30px;
  width: fit-content;
}
.about-community .dim { color: var(--gold); }
.about-photo { position: relative; aspect-ratio: 4 / 5; overflow: hidden; }
.about-photo img {
  width: 100%; height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.06) brightness(.92);
}
.about-photo::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--gold);
  mix-blend-mode: soft-light;
  opacity: .35;
  pointer-events: none;
}
.photo-placeholder {
  width: 100%; height: 100%;
  background: var(--surface);
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}
.ph-monogram { font-family: var(--serif); font-style: italic; font-size: 64px; color: var(--gold); }
.ph-note { font-family: var(--mono); font-size: 10px; color: var(--ink-faint); }

/* ════════ SKILLS ════════ */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}
.sk-group {
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 26px 24px;
  transition: border-color .3s;
}
.sk-group:hover { border-color: rgba(200,164,100,.35); }
.sk-name {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .14em;
  color: var(--gold);
  margin-bottom: 16px;
}
.sk-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.sk-tags span {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-muted);
  border: 1px solid var(--line);
  padding: 4px 10px;
  letter-spacing: .02em;
}
```

- [ ] **Step 4: Verify**

Run: `curl -s http://localhost:8000 | grep -c "sk-group"`
Expected: `6`
Run: `curl -s http://localhost:8000 | grep -c "photo-placeholder"`
Expected: `1`
Visual: About is two columns — story text left (ends with serif "The domain changes." line + PyData strip), gold monogram placeholder right. Skills: 3×2 grid of bordered groups, gold group names.

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "Add about (condensed story, photo slot) and skills grid"
```

---

### Task 6: Writing & Talks + Education & Awards

**Files:**
- Modify: `index.html` (replace `<!-- WRITING -->` and `<!-- EDU -->` comments)
- Modify: `styles.css` (append)

- [ ] **Step 1: Replace `<!-- WRITING -->` in `index.html` with**

```html
    <section id="writing">
      <p class="kicker reveal">$ tail -f community.log</p>
      <h2 class="section-title reveal">Writing &amp; <em>talks.</em></h2>
      <div class="wt-grid">
        <article class="wt-card reveal">
          <p class="wt-date"># since 2020</p>
          <h3 class="wt-title">PyData Delhi</h3>
          <p class="wt-role">Co-organiser · volunteer since 2018</p>
        </article>
        <article class="wt-card reveal">
          <p class="wt-date"># sep 2024</p>
          <h3 class="wt-title">PyData Amsterdam</h3>
          <p class="wt-role">Conference volunteer</p>
        </article>
        <article class="wt-card reveal">
          <p class="wt-date"># sep 2025</p>
          <h3 class="wt-title">PyData Paris</h3>
          <p class="wt-role">Conference volunteer</p>
        </article>
        <article class="wt-card wt-soon reveal">
          <p class="wt-date"># soon</p>
          <h3 class="wt-title">Writing</h3>
          <p class="wt-role">First post in progress — notes on sustainable AI</p>
        </article>
      </div>
    </section>
```

- [ ] **Step 2: Replace `<!-- EDU -->` in `index.html` with**

```html
    <section id="edu">
      <p class="kicker reveal">$ cat education.md</p>
      <h2 class="section-title reveal">Education &amp; <em>honours.</em></h2>
      <div class="edu-grid">
        <div class="edu-col reveal">
          <div class="edu-card">
            <div class="edu-degree">MSc in Artificial Intelligence</div>
            <div class="edu-school">National College of Ireland · Dublin</div>
            <div class="edu-meta"><span># jan 2024 → feb 2025</span><span class="edu-grade">1:1 first-class honours</span></div>
          </div>
          <div class="edu-card">
            <div class="edu-degree">Diploma in Advanced Computing — Full-Stack</div>
            <div class="edu-school">C-DAC · Pune, India</div>
            <div class="edu-meta"><span># sep 2020 → apr 2021</span></div>
          </div>
          <div class="edu-card">
            <div class="edu-degree">B.Tech in Computer Science &amp; Engineering</div>
            <div class="edu-school">GGSIPU (B.M. Institute of Engineering) · Haryana, India</div>
            <div class="edu-meta"><span># aug 2016 → nov 2020</span></div>
          </div>
          <p class="edu-courses"># also: Python for Everybody (Coursera · UMich) · OpenCV Bootcamp (OpenCV University)</p>
        </div>
        <div class="edu-col reveal">
          <div class="award-item">
            <span class="award-mark">✦</span>
            <div>
              <div class="award-name">Deloitte Innovation Award</div>
              <div class="award-src">Smart India Hackathon 2018 · ballistics recognition tool</div>
            </div>
          </div>
          <div class="award-item">
            <span class="award-mark">✦</span>
            <div>
              <div class="award-name">Dean's Honour List</div>
              <div class="award-src">National College of Ireland</div>
            </div>
          </div>
          <div class="award-item">
            <span class="award-mark">✦</span>
            <div>
              <div class="award-name">Team Appreciation Award</div>
              <div class="award-src">B.M. Institute of Engineering &amp; Technology</div>
            </div>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Append to `styles.css`**

```css
/* ════════ WRITING & TALKS ════════ */
.wt-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}
.wt-card {
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 26px 24px;
  transition: transform .3s, border-color .3s;
}
.wt-card:hover { transform: translateY(-3px); border-color: rgba(200,164,100,.35); }
.wt-soon { border-style: dashed; background: transparent; }
.wt-date { font-family: var(--mono); font-size: 11px; color: var(--gold); margin-bottom: 12px; }
.wt-title { font-family: var(--serif); font-weight: 500; font-size: 19px; margin-bottom: 6px; }
.wt-role { font-size: 13px; color: var(--ink-muted); }

/* ════════ EDUCATION & AWARDS ════════ */
.edu-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 60px;
  align-items: start;
}
.edu-card { padding: 22px 0; border-bottom: 1px solid var(--line); }
.edu-card:first-child { padding-top: 0; }
.edu-degree { font-family: var(--serif); font-weight: 500; font-size: 20px; }
.edu-school { font-size: 13px; color: var(--ink-muted); margin-top: 4px; }
.edu-meta {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-faint);
  margin-top: 10px;
  letter-spacing: .04em;
}
.edu-grade { color: var(--gold); }
.edu-courses {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-faint);
  margin-top: 22px;
  letter-spacing: .02em;
}
.award-item {
  display: flex;
  gap: 16px;
  align-items: baseline;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}
.award-item:first-child { padding-top: 0; }
.award-mark { color: var(--gold); font-size: 14px; }
.award-name { font-family: var(--serif); font-weight: 500; font-size: 17px; }
.award-src { font-size: 12px; color: var(--ink-faint); margin-top: 3px; }
```

- [ ] **Step 4: Verify**

Run: `curl -s http://localhost:8000 | grep -c "wt-card"`
Expected: `4`
Run: `curl -s http://localhost:8000 | grep -c "award-item"`
Expected: `3`
Visual: 4 writing/talks cards (last one dashed "soon"), education left column with gold "1:1 first-class honours", awards right column with gold ✦ marks.

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "Add writing & talks cards and education & honours"
```

---

### Task 7: Contact + form behavior

**Files:**
- Modify: `index.html` (replace `<!-- CONTACT -->` comment)
- Modify: `styles.css` (append)
- Modify: `script.js` (append)

- [ ] **Step 1: Replace `<!-- CONTACT -->` in `index.html` with**

```html
    <section id="contact">
      <p class="kicker reveal">$ ssh gaurav@dublin</p>
      <h2 class="section-title reveal">Let's talk about <em>interesting problems.</em></h2>
      <p class="contact-sub reveal">
        Every problem is worth solving — it's a matter of matching the right key to the
        right lock. If yours might be ML-shaped, write to me.
      </p>
      <div class="contact-links reveal">
        <a href="mailto:gauravb8170@gmail.com">gauravb8170@gmail.com →</a>
        <a href="https://linkedin.com/in/gaurav-b98" target="_blank" rel="noopener">linkedin →</a>
        <a href="https://github.com/gaurav-b98" target="_blank" rel="noopener">github →</a>
        <a href="assets/resume.pdf" download>resume.pdf ↓</a>
      </div>
      <form class="cf reveal" id="contact-form" novalidate>
        <p class="cf-title"># send a message</p>
        <div class="cf-row">
          <div class="cf-group">
            <label for="fn">name</label>
            <input type="text" id="fn" placeholder="Jane Smith" autocomplete="name"/>
          </div>
          <div class="cf-group">
            <label for="fe">email</label>
            <input type="email" id="fe" placeholder="jane@company.com" autocomplete="email"/>
          </div>
        </div>
        <div class="cf-group">
          <label for="fs">subject</label>
          <input type="text" id="fs" placeholder="ML Engineer role at Acme"/>
        </div>
        <div class="cf-group">
          <label for="fm">message</label>
          <textarea id="fm" rows="5" placeholder="Tell me about the problem you're working on…"></textarea>
        </div>
        <button class="btn-gold" id="cf-submit" type="submit">Send Message →</button>
      </form>
    </section>
```

- [ ] **Step 2: Append to `styles.css`**

```css
/* ════════ CONTACT ════════ */
#contact { padding-bottom: 140px; }
.contact-sub { font-size: 16px; color: var(--ink-muted); max-width: 52ch; margin-bottom: 36px; }
.contact-links { display: flex; gap: 28px; flex-wrap: wrap; margin-bottom: 64px; }
.contact-links a {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--gold);
  letter-spacing: .04em;
  transition: color .25s;
}
.contact-links a:hover { color: var(--gold-bright); }
.cf {
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 36px 32px;
  max-width: 640px;
}
.cf-title { font-family: var(--mono); font-size: 12px; color: var(--gold); margin-bottom: 24px; letter-spacing: .08em; }
.cf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.cf-group { margin-bottom: 18px; }
.cf-group label {
  display: block;
  font-family: var(--mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .14em;
  color: var(--ink-faint);
  margin-bottom: 8px;
}
.cf-group input, .cf-group textarea {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 14px;
  padding: 12px 14px;
  transition: border-color .25s;
  resize: vertical;
}
.cf-group input:focus, .cf-group textarea:focus {
  outline: none;
  border-color: var(--gold);
}
.cf-group input::placeholder, .cf-group textarea::placeholder { color: var(--ink-faint); }
.cf .btn-gold { border: none; cursor: pointer; }
.cf .btn-gold:disabled { opacity: .55; cursor: wait; transform: none; }
```

- [ ] **Step 3: Append to `script.js`**

```js
/* ── Contact form (EmailJS) ──
   NOTE: form sends nothing until real EmailJS credentials are pasted below.
   Get them at https://dashboard.emailjs.com → Account (public key) +
   Email Services (service ID) + Email Templates (template ID). */
const EMAILJS_CONFIG = {
  serviceID:  'YOUR_SERVICE_ID',
  templateID: 'YOUR_TEMPLATE_ID',
  publicKey:  'YOUR_PUBLIC_KEY'
};

function showToast(html, ms = 4000) {
  const toast = document.getElementById('toast');
  toast.innerHTML = html;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), ms);
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fn').value.trim();
    const email = document.getElementById('fe').value.trim();
    const subject = document.getElementById('fs').value.trim();
    const msg = document.getElementById('fm').value.trim();

    if (!name || !email || !msg) {
      showToast('# please fill in name, email and message');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('# that email address doesn\'t look right');
      return;
    }

    const btn = document.getElementById('cf-submit');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    emailjs.send(
      EMAILJS_CONFIG.serviceID,
      EMAILJS_CONFIG.templateID,
      { from_name: name, from_email: email,
        subject: subject || 'Portfolio enquiry', message: msg },
      EMAILJS_CONFIG.publicKey
    )
    .then(() => {
      showToast('✓ message sent — I\'ll get back to you soon');
      ['fn','fe','fs','fm'].forEach(id => { document.getElementById(id).value = ''; });
    })
    .catch((err) => {
      console.error('EmailJS:', err);
      showToast('✗ send failed — email me directly: ' +
        '<a href="mailto:gauravb8170@gmail.com">gauravb8170@gmail.com</a>', 6000);
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = orig;
    });
  });
}
```

- [ ] **Step 4: Verify**

Run: `curl -s http://localhost:8000 | grep -c "contact-form"`
Expected: `1`
Visual: contact section with mono gold link row, dark form card. Submit empty form → toast "# please fill in name, email and message". Submit filled form → toast shows the ✗ mailto fallback (expected — placeholder EmailJS keys).

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css script.js
git commit -m "Add contact section with EmailJS form and toast fallback"
```

---

### Task 8: Motion — GSAP reveals

**Files:**
- Modify: `script.js` (append)

Design: elements carry class `reveal` (already in markup from Tasks 2–7). No CSS hides them — if GSAP fails to load or reduced motion is set, everything is simply visible. GSAP animates `from` states, so there is no flash-of-hidden-content risk.

- [ ] **Step 1: Append to `script.js`**

```js
/* ── Scroll reveals (GSAP) ── */
(function initReveals() {
  if (prefersReducedMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero children animate on load (staggered), not on scroll
  gsap.from('#hero .reveal', {
    autoAlpha: 0, y: 24, duration: .8, ease: 'power2.out',
    stagger: .12, delay: .4
  });

  // Everything else reveals as it scrolls into view
  gsap.utils.toArray('section:not(#hero) .reveal').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0, y: 28, duration: .7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
})();
```

- [ ] **Step 2: Verify**

Visual: reload `http://localhost:8000` — hero elements stagger in after the typing starts; scrolling reveals each section's kicker/title/cards with a soft rise. With DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" + reload: no animations, all content visible immediately, kicker shows full text instantly.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "Add GSAP scroll reveals with reduced-motion guard"
```

---

### Task 9: Responsive + mobile drawer styles

**Files:**
- Modify: `styles.css` (append)

- [ ] **Step 1: Append to `styles.css`**

```css
/* ════════ RESPONSIVE ════════ */
@media (max-width: 900px) {
  .work-featured { grid-template-columns: 1fr; }
  .skills-grid { grid-template-columns: repeat(2, 1fr); }
  .wt-grid { grid-template-columns: repeat(2, 1fr); }
  .about-grid { grid-template-columns: 1fr; gap: 44px; }
  .about-photo { max-width: 380px; }
  .edu-grid { grid-template-columns: 1fr; gap: 44px; }
}
@media (max-width: 640px) {
  section { padding: 84px 6vw; }
  .nav-links { display: none; }
  .hamburger { display: block; }
  .hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
  .hero-stats { gap: 30px; }
  .skills-grid, .wt-grid { grid-template-columns: 1fr; }
  .xp-row { grid-template-columns: 1fr; gap: 8px; padding: 24px 4px; }
  .xp-date { padding-top: 0; }
  .work-row { grid-template-columns: 1fr; gap: 10px; }
  .work-row-num { display: none; }
  .work-metrics { flex-wrap: wrap; gap: 18px; }
  .cf-row { grid-template-columns: 1fr; gap: 0; }
  .cf { padding: 28px 20px; }
  .contact-links { flex-direction: column; gap: 14px; }
  footer { flex-direction: column; text-align: center; gap: 10px; }
}
```

- [ ] **Step 2: Verify**

In DevTools responsive mode check three widths:
- 1440px: 2-col featured work, 3-col skills, 4-col writing cards
- 768px: 1-col featured work, 2-col skills/writing, stacked about/edu
- 360px: hamburger visible (tap → full-screen drawer, links close it), everything single column, no horizontal scroll (`document.body.scrollWidth === window.innerWidth` in console)

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "Add responsive breakpoints and mobile drawer styles"
```

---

### Task 10: Final verification pass

**Files:** none modified (fixes go to whichever file fails)

- [ ] **Step 1: External link check**

```bash
for url in \
  "https://github.com/gaurav-b98/A-Deep-Learning-Feature-Ranked-Backpropagation-Framework-for-Sustainability" \
  "https://norma.ncirl.ie/7937/1/gaurav.pdf" \
  "https://github.com/gaurav-b98/CurbTheVirus" \
  "https://136-114-133-166.sslip.io" \
  "https://linkedin.com/in/gaurav-b98"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 15 "$url")
  echo "$code  $url"
done
```

Expected: `200` for each (LinkedIn may return `999` — that's LinkedIn's bot block; verify manually in a browser, not a failure).

- [ ] **Step 2: Structure check — every section anchor exists**

Run: `curl -s http://localhost:8000 | grep -oE 'id="(hero|work|experience|about|skills|writing|edu|contact)"' | sort -u | wc -l`
Expected: `8`

- [ ] **Step 3: Console + network check**

Open `http://localhost:8000` with DevTools: console has zero errors; network tab shows GSAP, ScrollTrigger, EmailJS, three Google Font families all 200. (`assets/resume.pdf` will 404 until the user drops the file — note it, not a failure.)

- [ ] **Step 4: Lighthouse**

Run Chrome DevTools → Lighthouse → Performance + Accessibility, mobile.
Expected: both ≥ 90. If accessibility flags contrast on `--ink-faint` text, bump it to `#7d7d83` and re-run.

- [ ] **Step 5: Reduced-motion + keyboard pass**

DevTools Rendering → emulate `prefers-reduced-motion: reduce` → reload: no typing animation, no reveals, content all visible. Tab through the page: nav links, buttons, form fields all reachable with visible focus.

- [ ] **Step 6: Commit any fixes**

```bash
git add -A
git commit -m "Verification fixes from final pass"
```

(Skip the commit if nothing changed.)

---

## Post-plan (user actions, not tasks)

1. Drop `resume.pdf` and `photo.jpg` into `assets/` (then swap the About placeholder for the `<img>` per the comment in `index.html`).
2. Paste real EmailJS credentials into `EMAILJS_CONFIG` in `script.js` — the form has never had working keys, including on the old site.
3. Push to GitHub Pages: `git push origin main`.
