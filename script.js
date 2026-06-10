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
