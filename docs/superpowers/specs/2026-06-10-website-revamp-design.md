# Personal Website Revamp — Design Spec

**Date:** 2026-06-10
**Status:** Approved by Gaurav (brainstorming session)
**Scope:** Full rebuild — new design and new content structure.

## Goals

- Primary audience is dual: recruiters/hiring managers for ML roles (fast scan → reach out) and the broader community/personal brand (PyData, peers, future writing).
- Tone is hybrid: professional, impact-forward hero and work sections; personal story kept but condensed.
- The site must read "engineer with taste": dark luxe editorial base with quiet terminal motifs.

## Decisions Made

| Question | Decision |
|---|---|
| Scope | Full rebuild (design + content) |
| Stack | Static HTML/CSS/JS — no framework. GitHub Pages hosting unchanged. |
| Structure | Single long-scroll page with anchored nav |
| Visual direction | "Gold lean" merge of Dark Terminal + Dark Luxe Editorial |
| Tone | Hybrid — professional first, personality in doses |
| Supermac's roles | Kept as one compact entry, framed as "financial bridge after the MSc while building Greenfield" |
| Certifications section | Removed as a section; folded as a small line under Education |
| Additions | Resume PDF download, headshot photo, Writing & Talks section, contact form kept (EmailJS) |

## Visual System

### Palette

- Background: `#0e0e10` (near-black)
- Surface/cards: `#16161a`
- Text primary: `#ece9e2` (warm off-white)
- Text muted: `#a39f95`
- Text faint: `#6f6f75`
- Accent: `#c8a464` (muted gold)
- Borders/hairlines: `#2a2a30`
- Background treatment: static gold radial glow + subtle film grain (replaces the neural canvas)

### Typography

- **Fraunces** (Google Fonts, variable) — display serif for headlines, with italic moments
- **Inter** — body text
- **JetBrains Mono** — labels, prompts, metadata, chips, badges

### Recurring Motifs

- `$` prompt kickers above section headings (e.g. `$ cat about.md`)
- `#` comment-style captions for secondary metadata
- `[ status: open to work ]` style badges
- Thin gold rules as separators; generous spacing throughout

## Page Structure (single scroll, in order)

### 1. Hero

- Typed `$ whoami — ML Engineer · Dublin` kicker (one-time typing effect on load)
- H1 (Fraunces): "Days are for thinking about problems. *Nights are for solving them.*"
- Sub-line: "ML that ships. Curiosity that doesn't quit."
- CTAs: "View Work →" (gold, primary) and "Resume PDF ↓" (ghost)
- 3 compact stats: 3K+ assets monitored · 1:1 MSc AI · 2yr production ML
- `[ status: open to work ]` badge — Stamp 1G, Dublin
- Type-led; no photo in hero. No neural canvas.

### 2. Selected Work

Moved up, directly after hero — recruiters see projects within one scroll.

- **Featured (large cards):** MSc Thesis (Feature-Ranked Backpropagation for Sustainable AI) and Greenfield (PC Build Compatibility Engine). Keep existing metrics, GitHub/thesis/live-site links.
- **Compact (rows or small cards):** SenseGrow Anomaly Detection & RUL (Internal/Proprietary), CurbTheVirus (GitHub link), Bonjour Sign Language Translator (Academic).

### 3. Experience

- SenseGrow — AI Software Engineer (Jan 2022 → Jan 2024) leads visually
- Supermac's — one compact combined entry (Jun 2024 → Present), framed: "financial bridge after the MSc while building Greenfield"
- FireVisor Systems — Forward Deployed Software Engineer (Jul → Oct 2021)
- Forensic Science Laboratory — R&D Intern, Ballistics (Jun → Jul 2018)
- Availability badge kept: full-time ML roles · Stamp 1G · Dublin

### 4. About

- Condensed hybrid story (~half current length): sign-language moment → FSL hackathon/internship → production ML at scale → sustainable AI research
- Headshot photo, duotone-treated for the dark theme
- Community sub-block: PyData Delhi co-organiser, volunteering woven in

### 5. Skills

- Tighter mono-chip groups, fewer tags per group than current site
- Groups: Programming & APIs, ML & AI, MLOps, Cloud & Infra, Data, Computer Vision (Monitoring/Observability merged into MLOps)

### 6. Writing & Talks

- Cards: PyData Delhi — Co-organiser; PyData Amsterdam — Volunteer 2024; PyData Paris — Volunteer 2025
- One "Writing — coming soon" slot (placeholder for future posts; no separate /writing page until real content exists)

### 7. Education & Awards

- MSc AI, National College of Ireland — 1:1 First-Class Honours
- Diploma in Advanced Computing, C-DAC Pune
- B.Tech CSE, GGSIPU
- Small line under education for courses: Python for Everybody (Coursera), OpenCV Bootcamp
- Awards: Deloitte Innovation Award (SIH 2018), Dean's Honour List (NCI), Team Appreciation Award (BMIET)

### 8. Contact

- Direct links: email, LinkedIn, GitHub
- EmailJS contact form kept (existing integration)
- Resume download button repeated
- Footer: copyright, links, "Stamp 1G · Dublin"

## Motion

- Hero: typed kicker once on load, headline fades up after
- Scroll: GSAP ScrollTrigger reveals per section (fade-up, slight stagger on card grids)
- Nav: gains backdrop blur once scrolled
- Hover: gold underline sweep on links; project card lift + border glow
- `prefers-reduced-motion`: typing effect and reveals disabled, content visible instantly

## Technical

- **Files:** `index.html`, `styles.css`, `script.js` — full rewrite of each. No build step.
- **CDN deps:** GSAP + ScrollTrigger, EmailJS (unchanged), Google Fonts (Fraunces, Inter, JetBrains Mono)
- **Assets (user-provided):** `assets/resume.pdf`, headshot photo in `assets/`. Visible placeholders used until provided — site ships without blocking on these.
- **Form error handling:** EmailJS failure shows a toast with a direct mailto fallback.
- **Hosting:** GitHub Pages, unchanged.

## Verification

- Responsive at 360 / 768 / 1440 px; mobile drawer works
- Lighthouse: performance and accessibility ≥ 90
- `prefers-reduced-motion` honored
- All external links resolve (GitHub repos, thesis PDF, Greenfield live site, LinkedIn)
- Contact form send test (EmailJS)

## Out of Scope

- Separate /writing page or blog engine (deferred until real posts exist)
- Framework migration (Astro/Next.js)
- Any backend
