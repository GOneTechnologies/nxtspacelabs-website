/* ═══════════════════════════════════════════════════════════════
   NextSpace Labs — shared interactions
   © 2026 NextSpace Labs Private Limited · Original JavaScript
   ═══════════════════════════════════════════════════════════════ */

/* Feature detection — WebGL + reduced-motion. Sets body.no-webgl so CSS
   can render a static aurora-gradient fallback for graceful degradation. */
(function featureDetect() {
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let webgl = false;
  try {
    const c = document.createElement('canvas');
    webgl = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) { webgl = false; }
  if (!webgl || reduced) document.body.classList.add('no-webgl');
  window.__ns_supportsWebGL = webgl;
  window.__ns_reducedMotion = reduced;
})();

/* Lightweight analytics dispatcher — pluggable at launch. Events queue
   into window.__ns_events and fan out to any provider that is loaded
   (Plausible / GA4 / PostHog / Vercel — whichever the founder wires in). */
(function analytics() {
  window.__ns_events = window.__ns_events || [];
  window.nsTrack = function nsTrack(name, props) {
    const payload = { name, props: props || {}, path: location.pathname, t: Date.now() };
    window.__ns_events.push(payload);
    if (typeof window.plausible === 'function') window.plausible(name, { props: payload.props });
    if (typeof window.gtag === 'function') window.gtag('event', name, payload.props);
    if (window.posthog && typeof window.posthog.capture === 'function') window.posthog.capture(name, payload.props);
    if (typeof window.va === 'function') window.va('event', { name, ...payload.props });
  };
  const marks = { q25: false, q50: false, q75: false, q100: false };
  window.addEventListener('scroll', () => {
    const h = document.body.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    const p = window.scrollY / h;
    if (!marks.q25 && p >= 0.25)  { marks.q25 = true;  window.nsTrack('scroll_depth', { pct: 25 }); }
    if (!marks.q50 && p >= 0.50)  { marks.q50 = true;  window.nsTrack('scroll_depth', { pct: 50 }); }
    if (!marks.q75 && p >= 0.75)  { marks.q75 = true;  window.nsTrack('scroll_depth', { pct: 75 }); }
    if (!marks.q100 && p >= 0.98) { marks.q100 = true; window.nsTrack('scroll_depth', { pct: 100 }); }
  }, { passive: true });
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a, button');
    if (!a) return;
    if (a.classList.contains('glass-btn'))    window.nsTrack('cta_click', { label: (a.textContent || '').trim().slice(0, 60) });
    if (a.closest && a.closest('.menu-primary')) window.nsTrack('nav_click', { label: (a.textContent || '').trim().slice(0, 60) });
    if (a.classList.contains('form-submit'))   window.nsTrack('form_submit', { form: 'contact' });
  });
})();

/* Custom cursor + soft light follower */
(function cursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const light = document.getElementById('cursorLight');
  if (!dot || !ring) return;
  let mx = -400, my = -400, rx = -400, ry = -400, lx = -400, ly = -400;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });
  (function loop() {
    rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
    lx += (mx - lx) * 0.08; ly += (my - ly) * 0.08;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    if (light) light.style.transform = `translate(${lx}px, ${ly}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
  const rebind = () => {
    document.querySelectorAll('[data-hover], a, button, input, textarea, select').forEach(el => {
      if (el._nsBound) return;
      el._nsBound = true;
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  };
  rebind();
  // Rebind after partials inject
  window.addEventListener('ns:partials-mounted', rebind);
})();

/* Reveal-on-scroll */
(function reveal() {
  const io = new IntersectionObserver(ents => {
    ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  const bind = () => document.querySelectorAll('.reveal:not([data-revealed])').forEach(el => { el.dataset.revealed = '1'; io.observe(el); });
  bind();
  window.addEventListener('ns:partials-mounted', bind);
})();

/* Full-screen menu open/close */
(function menu() {
  const bind = () => {
    const btn = document.getElementById('menuBtn');
    const overlay = document.getElementById('menuOverlay');
    const close = document.getElementById('menuClose');
    if (!btn || !overlay || btn._nsBound) return;
    btn._nsBound = true;
    const open = () => { overlay.classList.add('on'); overlay.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    const shut = () => { overlay.classList.remove('on'); overlay.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    btn.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    overlay.addEventListener('click', e => { if (e.target === overlay || e.target.classList.contains('menu-scene')) shut(); });
    document.querySelectorAll('[data-menu-close]').forEach(el => el.addEventListener('click', shut));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('on')) shut(); });
  };
  bind();
  window.addEventListener('ns:partials-mounted', bind);
})();

/* Sound — atmosphere via WebAudio (no bundled audio files) */
(function soundToggle() {
  const bind = () => {
    const btn = document.getElementById('soundToggle');
    if (!btn || btn._nsBound) return;
    btn._nsBound = true;
    let ctx = null, gain = null, on = false;
    btn.addEventListener('click', () => {
      if (!on) {
        if (!ctx) {
          ctx = new (window.AudioContext || window.webkitAudioContext)();
          gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destination);
          const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 110;
          const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 165;
          const g2 = ctx.createGain(); g2.gain.value = 0.5;
          const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
          const lfoG = ctx.createGain(); lfoG.gain.value = 0.15;
          lfo.connect(lfoG); lfoG.connect(g2.gain);
          o1.connect(gain); o2.connect(g2); g2.connect(gain);
          o1.start(); o2.start(); lfo.start();
        }
        gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1.5);
        btn.classList.add('on'); on = true;
      } else {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
        btn.classList.remove('on'); on = false;
      }
    });
  };
  bind();
  window.addEventListener('ns:partials-mounted', bind);
})();

/* Day/night lighting via body class */
(function daynight() {
  const h = new Date().getHours();
  const body = document.body;
  body.classList.remove('morning', 'day', 'evening', 'night');
  if (h >= 5 && h < 12) body.classList.add('morning');
  else if (h >= 12 && h < 18) body.classList.add('day');
  else if (h >= 18 && h < 22) body.classList.add('evening');
  else body.classList.add('night');
})();

/* Hidden mode — type "future" anywhere */
(function hidden() {
  let buf = '';
  const target = 'future';
  const bind = () => {
    const overlay = document.getElementById('hiddenMode');
    const close = document.getElementById('hiddenClose');
    if (!overlay || overlay._nsBound) return;
    overlay._nsBound = true;
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') { overlay.classList.remove('on'); buf = ''; return; }
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key.length === 1) buf = (buf + e.key.toLowerCase()).slice(-target.length);
      if (buf === target) { overlay.classList.add('on'); buf = ''; }
    });
    if (close) close.addEventListener('click', () => overlay.classList.remove('on'));
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('on'); });
  };
  bind();
  window.addEventListener('ns:partials-mounted', bind);
})();

/* Contact form — client-side validation + graceful mailto fallback */
(function contactForm() {
  const bind = () => {
    document.querySelectorAll('form[data-contact]').forEach(form => {
      if (form._nsBound) return; form._nsBound = true;
      form.addEventListener('submit', e => {
        e.preventDefault();
        // Honeypot check
        const hp = form.querySelector('.honeypot input');
        if (hp && hp.value) return; // silent drop
        const name = (form.querySelector('[name=name]') || {}).value || '';
        const email = (form.querySelector('[name=email]') || {}).value || '';
        const msg = (form.querySelector('[name=message]') || {}).value || '';
        const subject = encodeURIComponent(`Enquiry from ${name || 'the website'}`);
        const body = encodeURIComponent(`From: ${name} <${email}>\n\n${msg}`);
        window.location.href = `mailto:support@pairnow.in?subject=${subject}&body=${body}`;
      });
    });
  };
  bind();
  window.addEventListener('ns:partials-mounted', bind);
})();
