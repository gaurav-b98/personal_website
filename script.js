/* ══════════════════════════════════════════
   NEURAL NETWORK CANVAS — hero background
   Nodes connect with lines, react to cursor
   ══════════════════════════════════════════ */
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, mouse = { x: -9999, y: -9999 };
  const NODES = [];
  const NODE_COUNT_BASE = 55;
  const MAX_DIST = 160;
  const MOUSE_RADIUS = 200;
  const MOUSE_FORCE = 0.012;

  function resize() {
    const hero = document.getElementById('hero');
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  class Node {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 2 + 1.5;
      this.alpha = Math.random() * 0.5 + 0.3;
    }
    update() {
      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        this.vx += (dx / dist) * force * MOUSE_FORCE * 18;
        this.vy += (dy / dist) * force * MOUSE_FORCE * 18;
      }
      // Damping
      this.vx *= 0.985;
      this.vy *= 0.985;
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
      ctx.fillStyle = `rgba(147, 197, 253, ${this.alpha})`;
      ctx.fill();
    }
  }

  function buildNodes() {
    NODES.length = 0;
    const count = Math.floor(NODE_COUNT_BASE * (W / 1440) + 30);
    for (let i = 0; i < count; i++) NODES.push(new Node());
  }

  function drawEdges() {
    for (let i = 0; i < NODES.length; i++) {
      for (let j = i + 1; j < NODES.length; j++) {
        const dx = NODES[i].x - NODES[j].x;
        const dy = NODES[i].y - NODES[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(NODES[i].x, NODES[i].y);
          ctx.lineTo(NODES[j].x, NODES[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseConnections() {
    NODES.forEach(n => {
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_RADIUS) {
        const alpha = (1 - d / MOUSE_RADIUS) * 0.55;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawEdges();
    drawMouseConnections();
    NODES.forEach(n => { n.update(); n.draw(); });
    requestAnimationFrame(animate);
  }

  // Mouse tracking — relative to hero section
  const hero = document.getElementById('hero');
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  // Touch support
  hero.addEventListener('touchmove', e => {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    mouse.x = t.clientX - rect.left;
    mouse.y = t.clientY - rect.top;
  }, { passive: true });

  window.addEventListener('resize', () => { resize(); buildNodes(); });
  resize();
  buildNodes();
  animate();
})();


/* ══════════════════════════════════════
   SCROLL PROGRESS BAR
   ══════════════════════════════════════ */
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  if (prog) prog.style.width = pct + '%';
});


/* ══════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ══════════════════════════════════════
   HAMBURGER / MOBILE NAV
   ══════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  // Close on link tap
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}


/* ══════════════════════════════════════
   CONTACT FORM → EmailJS
   Replace these with your actual EmailJS credentials
   ══════════════════════════════════════ */
const EMAILJS_CONFIG = {
  serviceID: 'service_okqz76q',    // Replace with your EmailJS Service ID
  templateID: 'template_5spavz5',  // Replace with your EmailJS Template ID
  publicKey: 'eyud_gXLyddwgTmTR'     // Replace with your EmailJS Public Key
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

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Disable submit button and show loading state
  const submitBtn = document.querySelector('.cf-submit');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  submitBtn.style.opacity = '0.6';

  // Send email via EmailJS
  emailjs.send(
    EMAILJS_CONFIG.serviceID,
    EMAILJS_CONFIG.templateID,
    {
      from_name: name,
      from_email: email,
      subject: subject || 'Portfolio Enquiry',
      message: msg
    },
    EMAILJS_CONFIG.publicKey
  )
  .then(() => {
    // Success
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = '✓ Message sent successfully!';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }
    // Clear form
    document.getElementById('fn').value = '';
    document.getElementById('fe').value = '';
    document.getElementById('fs').value = '';
    document.getElementById('fm').value = '';
    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    submitBtn.style.opacity = '1';
  })
  .catch((error) => {
    // Error
    console.error('EmailJS Error:', error);
    alert('Failed to send message. Please try again or email me directly at gauravb8170@gmail.com');
    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    submitBtn.style.opacity = '1';
  });
}

