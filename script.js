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

/* ── Hero: typed kicker ── */
(function typeKicker() {
  const target = document.getElementById('typed');
  const cursor = document.getElementById('typed-cursor');
  if (!target || !cursor) return;
  const text = '$ whoami — ML Engineer · Dublin';
  if (prefersReducedMotion) {
    target.textContent = text;
    cursor.style.display = 'none';
    return;
  }
  let i = 2; // "$ " (2 chars) already present in HTML
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

/* ── Site-wide neural canvas ──
   Gold constellation, fixed behind the whole page. Roams the full
   viewport in the hero; as you scroll past it, nodes drift into the
   empty side margins beside the content column (or fade out on
   narrow screens where there are no margins). Skipped entirely
   under reduced motion. */
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  const hero = document.getElementById('hero');
  if (!canvas || !hero || prefersReducedMotion) return;
  const ctx = canvas.getContext('2d');

  let W, H, heroH, bandW;
  let rafId = null;
  let scrollT = 0; // 0 inside hero, eases to 1 once scrolled past it
  const mouse = { x: -9999, y: -9999 };
  const NODES = [];
  const LINK_DIST = 130;
  const MOUSE_R = 240;
  const CONTENT_W = 1060; // text column width — bands reach the section padding
  const MIN_BAND = 70;    // below this, sides are too thin — fade instead

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    heroH = hero.offsetHeight;
    bandW = Math.max((W - CONTENT_W) / 2, 0);
  }

  function buildNodes() {
    NODES.length = 0;
    const count = Math.min(Math.floor(W / 14), 140);
    for (let i = 0; i < count; i++) {
      NODES.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * .3,
        vy: (Math.random() - .5) * .3,
        r: Math.random() * 1.3 + .6,
        a: Math.random() * .35 + .15,
        side: Math.random() < .5 ? -1 : 1 // home margin: left or right
      });
    }
  }

  function step(n) {
    const dx = mouse.x - n.x, dy = mouse.y - n.y;
    const d = Math.hypot(dx, dy);
    if (d < MOUSE_R && d > 0) {
      const pull = (MOUSE_R - d) / MOUSE_R * .03;
      n.vx += (dx / d) * pull;
      n.vy += (dy / d) * pull;
    }
    // Past the hero, drift toward the empty side margins
    if (scrollT > 0 && bandW > MIN_BAND) {
      const targetX = n.side < 0 ? bandW * .5 : W - bandW * .5;
      n.vx += (targetX - n.x) * .0018 * scrollT;
    }
    n.vx *= .985;
    n.vy *= .985;
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < -20) n.x = W + 20;
    if (n.x > W + 20) n.x = -20;
    if (n.y < -20) n.y = H + 20;
    if (n.y > H + 20) n.y = -20;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1 - .25 * scrollT; // quieter once scrolled
    for (let i = 0; i < NODES.length; i++) {
      for (let j = i + 1; j < NODES.length; j++) {
        const a = NODES[i], b = NODES[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(200, 164, 100, ${(1 - d / LINK_DIST) * .18})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    NODES.forEach((n) => {
      step(n);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 188, 122, ${n.a})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  }

  window.addEventListener('scroll', () => {
    const raw = window.scrollY / (heroH * .8);
    const c = Math.min(Math.max(raw, 0), 1);
    scrollT = c * c * (3 - 2 * c); // smoothstep
    // No side margins to retreat to — fade the whole canvas instead
    canvas.style.opacity = bandW > MIN_BAND ? '1' : String(1 - scrollT);
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });
  document.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Pause the loop when the tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (rafId === null) {
      rafId = requestAnimationFrame(draw);
    }
  });

  window.addEventListener('resize', () => { resize(); buildNodes(); });
  resize();
  buildNodes();
  draw();
})();

/* ── Section kickers: type on first scroll into view ──
   Each non-hero .kicker types out like the hero one. A visually
   hidden copy of the full text keeps screen readers unaffected. */
(function typeSectionKickers() {
  if (prefersReducedMotion) return;
  if (!('IntersectionObserver' in window)) return;
  const kickers = document.querySelectorAll('section:not(#hero) .kicker');
  if (!kickers.length) return;

  function typeInto(el) {
    const full = el.textContent.trim();
    el.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = full;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    const cursor = document.createElement('span');
    cursor.setAttribute('aria-hidden', 'true');
    cursor.className = 'type-cursor';
    cursor.textContent = '▌';
    el.append(sr, visual, cursor);
    let i = 0;
    const tick = setInterval(() => {
      i++;
      visual.textContent = full.slice(0, i);
      if (i >= full.length) {
        clearInterval(tick);
        setTimeout(() => cursor.remove(), 1200);
      }
    }, 30);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      typeInto(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  kickers.forEach((k) => obs.observe(k));
})();

/* ── Contact form (EmailJS) ──
   NOTE: form sends nothing until real EmailJS credentials are pasted below.
   Get them at https://dashboard.emailjs.com → Account (public key) +
   Email Services (service ID) + Email Templates (template ID). */
const EMAILJS_CONFIG = {
  serviceID:  'YOUR_SERVICE_ID',
  templateID: 'YOUR_TEMPLATE_ID',
  publicKey:  'YOUR_PUBLIC_KEY'
};

let toastTimer = null;
function showToast(content, ms = 4000) {
  const toast = document.getElementById('toast');
  toast.innerHTML = content;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const fieldEl = (id) => document.getElementById(id);
  const setInvalid = (el, invalid) => {
    if (invalid) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  };
  ['fn', 'fe', 'fm'].forEach((id) => {
    fieldEl(id).addEventListener('input', () => setInvalid(fieldEl(id), false));
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = fieldEl('fn').value.trim();
    const email = fieldEl('fe').value.trim();
    const subject = fieldEl('fs').value.trim();
    const msg = fieldEl('fm').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    setInvalid(fieldEl('fn'), !name);
    setInvalid(fieldEl('fe'), !email || !emailOk);
    setInvalid(fieldEl('fm'), !msg);

    if (!name || !email || !msg) {
      showToast('# please fill in name, email and message');
      return;
    }
    if (!emailOk) {
      showToast('# that email address doesn\'t look right');
      return;
    }

    const btn = document.getElementById('cf-submit');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    const fail = () => showToast('✗ send failed — email me directly: ' +
      '<a href="mailto:gauravb8170@gmail.com">gauravb8170@gmail.com</a>', 6000);

    let sendPromise;
    try {
      sendPromise = emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        { from_name: name, from_email: email,
          subject: subject || 'Portfolio enquiry', message: msg },
        EMAILJS_CONFIG.publicKey
      );
    } catch (err) {
      console.error('EmailJS unavailable:', err);
      btn.disabled = false;
      btn.textContent = orig;
      fail();
      return;
    }

    sendPromise
      .then(() => {
        showToast('✓ message sent — I\'ll get back to you soon');
        ['fn','fe','fs','fm'].forEach(id => { fieldEl(id).value = ''; });
      })
      .catch((err) => {
        console.error('EmailJS:', err);
        fail();
      })
      .finally(() => {
        btn.disabled = false;
        btn.textContent = orig;
      });
  });
}

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
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
})();
