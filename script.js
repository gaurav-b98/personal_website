/* ══════════════════════════════════════════
   NEURAL NETWORK CANVAS
   Attracts to cursor (convergence), 5x denser,
   connections fade but persist like memories
   ══════════════════════════════════════════ */
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let mouse = { x: -9999, y: -9999 };
  const NODES = [];
  const EDGES = []; // Persistent edge memory
  const MAX_DIST   = 140;
  const MOUSE_R    = 280;
  const MOUSE_ATTRACT = 0.008; // Attraction instead of repulsion

  function resize() {
    const hero = document.getElementById('hero');
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  class Node {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.r  = Math.random() * 1.2 + 0.8;
      this.alpha = Math.random() * 0.4 + 0.2;
    }
    update() {
      // Mouse ATTRACTION (convergence when key found)
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_R && d > 0) {
        const pull = (MOUSE_R - d) / MOUSE_R;
        this.vx += (dx / d) * pull * MOUSE_ATTRACT * 25;
        this.vy += (dy / d) * pull * MOUSE_ATTRACT * 25;
      }
      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;
      this.x += this.vx;
      this.y += this.vy;
      // Wrap
      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 190, 120, ${this.alpha})`;
      ctx.fill();
    }
  }

  function buildNodes() {
    NODES.length = 0;
    // 5x denser - much more nodes
    const count = Math.min(Math.floor(W / 12), 300);
    for (let i = 0; i < count; i++) NODES.push(new Node());
  }

  // Edge memory - connections fade but persist
  class Edge {
    constructor(i, j, strength) {
      this.i = i;
      this.j = j;
      this.strength = strength;
      this.age = 0;
    }
    fade() {
      this.age += 0.003;
      this.strength = Math.max(0, this.strength - 0.002);
    }
  }

  function updateEdges() {
    // Create new connections (learning)
    for (let i = 0; i < NODES.length; i++) {
      for (let j = i + 1; j < NODES.length; j++) {
        const dx = NODES[i].x - NODES[j].x;
        const dy = NODES[i].y - NODES[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX_DIST) {
          const existing = EDGES.find(e => 
            (e.i === i && e.j === j) || (e.i === j && e.j === i)
          );
          if (!existing) {
            EDGES.push(new Edge(i, j, (1 - d / MAX_DIST) * 0.25));
          } else {
            // Strengthen existing connection
            existing.strength = Math.min(0.25, existing.strength + 0.005);
          }
        }
      }
    }
    // Fade all edges (memories fade but don't delete)
    EDGES.forEach(e => e.fade());
    // Remove only completely faded edges (threshold very low)
    for (let i = EDGES.length - 1; i >= 0; i--) {
      if (EDGES[i].strength < 0.01 && EDGES[i].age > 5) {
        EDGES.splice(i, 1);
      }
    }
  }

  function drawEdges() {
    EDGES.forEach(e => {
      if (e.i < NODES.length && e.j < NODES.length) {
        ctx.beginPath();
        ctx.moveTo(NODES[e.i].x, NODES[e.i].y);
        ctx.lineTo(NODES[e.j].x, NODES[e.j].y);
        ctx.strokeStyle = `rgba(210, 160, 80, ${e.strength})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  }

  function drawMouseLines() {
    if (mouse.x < -999) return;
    NODES.forEach(n => {
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < MOUSE_R) {
        const a = (1 - d / MOUSE_R) * 0.55;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(235, 185, 100, ${a})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    });
    // Cursor dot
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(230, 175, 90, 0.6)';
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    updateEdges();
    drawEdges();
    drawMouseLines();
    NODES.forEach(n => { n.update(); n.draw(); });
    requestAnimationFrame(animate);
  }

  const hero = document.getElementById('hero');
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999;
  });
  hero.addEventListener('touchmove', e => {
    const rect = hero.getBoundingClientRect();
    const t = e.touches[0];
    mouse.x = t.clientX - rect.left;
    mouse.y = t.clientY - rect.top;
  }, { passive: true });
  hero.addEventListener('touchend', () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  window.addEventListener('resize', () => { resize(); buildNodes(); });
  resize();
  buildNodes();
  animate();
})();


/* ══════════════════════════════════════
   SCROLL PROGRESS
   ══════════════════════════════════════ */
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  if (!prog) return;
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  prog.style.width = pct + '%';
}, { passive: true });


/* ══════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ══════════════════════════════════════
   HAMBURGER MENU
   ══════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}


/* ══════════════════════════════════════
   EMAILJS CONTACT FORM
   ══════════════════════════════════════ */
const EMAILJS_CONFIG = {
  serviceID:  'service_okqz76q',
  templateID: 'template_5spavz5',
  publicKey:  'eyud_gXLyddwgTmTR'
};

function sendMsg() {
  const name    = document.getElementById('fn').value.trim();
  const email   = document.getElementById('fe').value.trim();
  const subject = document.getElementById('fs').value.trim();
  const msg     = document.getElementById('fm').value.trim();

  if (!name || !email || !msg) {
    alert('Please fill in your name, email, and message.');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const btn = document.querySelector('.cf-submit');
  const orig = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending…';
  btn.style.opacity = '0.6';

  emailjs.send(
    EMAILJS_CONFIG.serviceID,
    EMAILJS_CONFIG.templateID,
    { from_name: name, from_email: email, subject: subject || 'Portfolio Enquiry', message: msg },
    EMAILJS_CONFIG.publicKey
  )
  .then(() => {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = '✓ Message sent — I\'ll get back to you soon.';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }
    ['fn','fe','fs','fm'].forEach(id => document.getElementById(id).value = '');
    btn.disabled = false; btn.textContent = orig; btn.style.opacity = '1';
  })
  .catch(err => {
    console.error('EmailJS:', err);
    alert('Something went wrong. Please email me directly at gauravb8170@gmail.com');
    btn.disabled = false; btn.textContent = orig; btn.style.opacity = '1';
  });
}
