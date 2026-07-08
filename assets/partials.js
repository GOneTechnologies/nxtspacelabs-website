/* ═══════════════════════════════════════════════════════════════
   NextSpace Labs — shared partials injector
   Loads the same nav / menu / footer / hidden-mode into every
   page, so a single edit propagates across the whole site.
   © 2026 NextSpace Labs Private Limited · Original code
   ═══════════════════════════════════════════════════════════════ */

(function partials() {
  const SKIP_HTML = `<a href="#main" class="skip-link">Skip to content</a>`;

  const JSONLD = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://nxtspacelabs.com/#org",
        "name": "NextSpace Labs Private Limited",
        "alternateName": "NextSpace Labs",
        "url": "https://nxtspacelabs.com/",
        "logo": "https://nxtspacelabs.com/logo.svg",
        "email": "connect@nxtspacelabs.com",
        "foundingDate": "2026",
        "founder": { "@type": "Person", "name": "S. K. Jeevan" },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Hyderabad",
          "addressRegion": "Telangana",
          "addressCountry": "IN"
        },
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "@id": "https://nxtspacelabs.com/#site",
        "url": "https://nxtspacelabs.com/",
        "name": "NextSpace Labs",
        "publisher": { "@id": "https://nxtspacelabs.com/#org" },
        "inLanguage": "en-IN"
      }
    ]
  };

  const NAV_HTML = `
<nav class="top">
  <a href="/" class="brand" data-hover>
    <svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="nv-m" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1E1B4B"/><stop offset="45%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#3B82F6"/></linearGradient>
        <linearGradient id="nv-a" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#EC4899"/><stop offset="60%" stop-color="#A21CAF"/><stop offset="100%" stop-color="#5B21B6"/></linearGradient>
      </defs>
      <path d="M 40 30 L 40 195 L 78 195 L 78 100 L 78 30 Z" fill="url(#nv-m)"/>
      <path d="M 65 30 L 158 195 L 195 195 L 105 30 Z" fill="url(#nv-m)"/>
      <path d="M 158 30 L 158 195 L 195 195 L 195 30 Z" fill="url(#nv-m)"/>
      <path d="M 178 45 L 195 30 L 210 45 L 132 195 L 100 195 Z" fill="url(#nv-a)" opacity="0.92"/>
    </svg>
    <span class="brand-text">
      <span class="brand-name">NextSpace</span>
      <span class="brand-sub">Labs</span>
    </span>
  </a>
  <div class="nav-right">
    <a href="/services.html" data-hover class="hide-sm">Services</a>
    <a href="/insights.html" data-hover class="hide-sm">Insights</a>
    <a href="/contact.html" data-hover class="hide-sm">Contact</a>
    <button class="search-pill" id="searchBtn" data-hover aria-label="Search — command palette (coming soon)" title="Search — coming soon">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="7" cy="7" r="4.5"/><line x1="10.5" y1="10.5" x2="14" y2="14" stroke-linecap="round"/></svg>
      <span class="search-label">Search</span>
      <kbd>&#8984;K</kbd>
    </button>
    <button class="menu-btn" data-hover id="menuBtn" aria-label="Open menu">
      <span class="menu-btn-icon"><span></span><span></span><span></span></span>
      <span>Menu</span>
    </button>
  </div>
</nav>`;

  const MENU_HTML = `
<div class="menu-overlay" id="menuOverlay" aria-hidden="true">
  <div class="menu-scene"></div>
  <a href="/" class="menu-brand" data-menu-close>
    <svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mn-m" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1E1B4B"/><stop offset="45%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#3B82F6"/></linearGradient>
        <linearGradient id="mn-a" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#EC4899"/><stop offset="60%" stop-color="#A21CAF"/><stop offset="100%" stop-color="#5B21B6"/></linearGradient>
      </defs>
      <path d="M 40 30 L 40 195 L 78 195 L 78 100 L 78 30 Z" fill="url(#mn-m)"/>
      <path d="M 65 30 L 158 195 L 195 195 L 105 30 Z" fill="url(#mn-m)"/>
      <path d="M 158 30 L 158 195 L 195 195 L 195 30 Z" fill="url(#mn-m)"/>
      <path d="M 178 45 L 195 30 L 210 45 L 132 195 L 100 195 Z" fill="url(#mn-a)" opacity="0.92"/>
    </svg>
    <span>NextSpace Labs</span>
  </a>
  <button class="menu-close" id="menuClose" data-hover aria-label="Close menu">
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>
    <span>Close</span>
  </button>
  <div class="menu-inner">
    <div class="menu-primary">
      <a href="/" data-hover><span class="num">01</span><span class="body"><span>Home</span><span class="desc">The digital headquarters.</span></span><span class="arr">→</span></a>
      <a href="/company.html" data-hover><span class="num">02</span><span class="body"><span>Company</span><span class="desc">Our philosophy, people, and identity.</span></span><span class="arr">→</span></a>
      <a href="/#ideas" data-hover><span class="num">03</span><span class="body"><span>Products</span><span class="desc">Living ideas we've shipped into the world.</span></span><span class="arr">→</span></a>
      <a href="/services.html" data-hover><span class="num">04</span><span class="body"><span>Services</span><span class="desc">Four ways we carry the pen for teams.</span></span><span class="arr">→</span></a>
      <a href="/industries.html" data-hover><span class="num">05</span><span class="body"><span>Industries</span><span class="desc">Where our craft lands hardest.</span></span><span class="arr">→</span></a>
      <a href="/innovation.html" data-hover><span class="num">06</span><span class="body"><span>Innovation</span><span class="desc">How we think, prototype, and research tomorrow.</span></span><span class="arr">→</span></a>
      <a href="/insights.html" data-hover><span class="num">07</span><span class="body"><span>Insights</span><span class="desc">Slow writing on products &amp; the digital century.</span></span><span class="arr">→</span></a>
      <a href="/newsroom.html" data-hover><span class="num">08</span><span class="body"><span>Newsroom</span><span class="desc">Announcements, releases, and press.</span></span><span class="arr">→</span></a>
      <a href="/careers.html" data-hover><span class="num">09</span><span class="body"><span>Careers</span><span class="desc">We hire builders. Small teams, real ownership.</span></span><span class="arr">→</span></a>
      <a href="/contact.html" data-hover><span class="num">10</span><span class="body"><span>Contact</span><span class="desc">One inbox. A real human on the other end.</span></span><span class="arr">→</span></a>
    </div>
    <div class="menu-side">
      <div class="menu-group">
        <div class="menu-label">Company</div>
        <ul>
          <li><a href="/company.html#about" data-hover>About us</a></li>
          <li><a href="/company.html#vision" data-hover>Vision &amp; Mission</a></li>
          <li><a href="/company.html#leadership" data-hover>Leadership</a></li>
          <li><a href="/company.html#culture" data-hover>Culture</a></li>
        </ul>
      </div>
      <div class="menu-group">
        <div class="menu-label">Team access</div>
        <ul>
          <li><a href="/login" data-hover>Admin login →</a></li>
          <li><a href="/dashboard" data-hover>Dashboard →</a></li>
        </ul>
      </div>
      <div class="menu-group">
        <div class="menu-label">Reach</div>
        <ul>
          <li><a href="mailto:connect@nxtspacelabs.com" data-hover>connect@nxtspacelabs.com</a></li>
          <li class="plain">Hyderabad · India</li>
        </ul>
      </div>
    </div>
  </div>
</div>`;

  const FOOTER_HTML = `
<footer>
  <div class="foot-coda">
    <div class="foot-coda-mark"><span></span></div>
    <p class="foot-coda-line">
      We shape what comes <span class="italic">next</span> —<br>
      thoughtfully crafted in <span class="italic">Hyderabad</span>, built for the century ahead.
    </p>
    <p class="foot-coda-sub">Thank you for spending a moment here. If any of this reached you, write to us. It reaches a person, not a queue.</p>
  </div>
  <div class="foot-grid">
    <div class="foot-brand">
      <svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" fill="none">
        <defs>
          <linearGradient id="ft-m" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1E1B4B"/><stop offset="45%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#3B82F6"/></linearGradient>
          <linearGradient id="ft-a" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#EC4899"/><stop offset="100%" stop-color="#5B21B6"/></linearGradient>
        </defs>
        <path d="M 40 30 L 40 195 L 78 195 L 78 100 L 78 30 Z" fill="url(#ft-m)"/>
        <path d="M 65 30 L 158 195 L 195 195 L 105 30 Z" fill="url(#ft-m)"/>
        <path d="M 158 30 L 158 195 L 195 195 L 195 30 Z" fill="url(#ft-m)"/>
        <path d="M 178 45 L 195 30 L 210 45 L 132 195 L 100 195 Z" fill="url(#ft-a)" opacity="0.92"/>
      </svg>
      <p>An innovation lab. Building the software the next century will run on.</p>
    </div>
    <div class="foot-col">
      <h5>Company</h5>
      <ul>
        <li><a href="/company.html#about">About us</a></li>
        <li><a href="/company.html#vision">Vision &amp; Mission</a></li>
        <li><a href="/company.html#leadership">Leadership</a></li>
        <li><a href="/company.html#culture">Culture</a></li>
        <li><a href="/careers.html">Careers</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h5>Work</h5>
      <ul>
        <li><a href="/services.html">Services</a></li>
        <li><a href="/industries.html">Industries</a></li>
        <li><a href="/innovation.html">Innovation</a></li>
        <li><a href="/#ideas">Products</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h5>Reach</h5>
      <ul>
        <li><a href="/contact.html">Contact</a></li>
        <li><a href="/newsroom.html">Newsroom</a></li>
        <li><a href="/insights.html">Insights</a></li>
        <li><a href="mailto:connect@nxtspacelabs.com">Email us</a></li>
        <li><a href="/login">Team login ↗</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h5>Compliance</h5>
      <ul>
        <li><a href="/compliance.html"><strong>Compliance Center</strong> &rarr;</a></li>
        <li><a href="/privacy.html">Privacy Policy</a></li>
        <li><a href="/terms.html">Terms of use</a></li>
        <li><a href="/cookies.html">Cookies</a></li>
        <li><a href="/acceptable-use.html">Acceptable Use</a></li>
        <li><a href="/refunds.html">Refunds &amp; Cancellation</a></li>
        <li><a href="/ip.html">Intellectual Property</a></li>
        <li><a href="/security.html">Security</a></li>
        <li><a href="/responsible-ai.html">Responsible AI</a></li>
        <li><a href="/accessibility.html">Accessibility</a></li>
        <li><a href="/open-source.html">Open-Source Attribution</a></li>
        <li><a href="/esg.html">People &amp; ESG</a></li>
        <li><a href="#" data-cookie-open>Cookie preferences</a></li>
      </ul>
    </div>
  </div>

  <div class="foot-compliance">
    <div>
      <h6>Registered office</h6>
      <address>
        NextSpace Labs Private Limited<br>
        Door No 1-60/8/A &amp; B, 3<sup>rd</sup> Floor<br>
        KNR Square, Opp. The Platina<br>
        Gachibowli, Kondapur<br>
        Hyderabad &mdash; 500 032, Telangana, India
      </address>
    </div>
    <div>
      <h6>Statutory</h6>
      <div><span style="color:var(--dim-2);font-family:Inter;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;">CIN&nbsp;&nbsp;</span><span class="value">U72900TG2026PTCXXXXXX</span></div>
      <div><span style="color:var(--dim-2);font-family:Inter;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;">GSTIN</span>&nbsp;&nbsp;<span class="value">36XXXXXXXXXXXX1ZX</span></div>
      <div class="value note">Statutory identifiers publish on issuance.</div>
    </div>
    <div>
      <h6>Official contact</h6>
      <div><a href="mailto:connect@nxtspacelabs.com">connect@nxtspacelabs.com</a></div>
      <div class="value note">Direct phone line coming with the operations office.</div>
    </div>
  </div>

  <div class="foot-bottom">
    <span>© 2026 · NextSpace Labs Private Limited · Hyderabad, India</span>
    <span>Every pixel authored here. <a href="/" style="color:var(--dim-2);">Try typing &ldquo;future&rdquo;.</a></span>
  </div>
</footer>`;

  const HIDDEN_HTML = `
<div class="hidden-mode" id="hiddenMode">
  <div class="hidden-panel">
    <h2>An experimental corridor.</h2>
    <p>You found a door. Behind it: quiet rooms where we are working on things we cannot yet describe. When they are ready, they will find you.</p>
    <span class="hidden-close" id="hiddenClose">[ press esc to return ]</span>
  </div>
</div>`;

  const COOKIE_HTML = `
<div class="cookie-banner" id="cookieBanner" role="dialog" aria-live="polite" aria-label="Cookie preferences" hidden>
  <div class="cookie-inner">
    <div class="cookie-copy">
      <h4>A short word about <span class="italic">cookies</span>.</h4>
      <p>We use a small set of first-party cookies to keep the site working and, with your consent, to understand which pages people read. We do not currently use advertising cookies or cross-site tracking.</p>
      <p class="cookie-links">
        <a href="/cookies.html" data-hover>Read the Cookie Policy</a>
        &middot;
        <a href="/privacy.html" data-hover>Read the Privacy Policy</a>
      </p>
    </div>
    <div class="cookie-actions">
      <button class="cookie-btn cookie-manage" type="button" id="cookieManage" data-hover>Manage preferences</button>
      <button class="cookie-btn cookie-reject" type="button" id="cookieReject" data-hover>Reject non-essential</button>
      <button class="cookie-btn cookie-accept" type="button" id="cookieAccept" data-hover>Accept all</button>
    </div>
    <div class="cookie-prefs" id="cookiePrefs" hidden>
      <div class="cookie-pref">
        <label>
          <input type="checkbox" checked disabled>
          <span><strong>Strictly necessary</strong> &mdash; required for the site to load and remember your consent. Cannot be disabled.</span>
        </label>
      </div>
      <div class="cookie-pref">
        <label>
          <input type="checkbox" id="cookiePrefPreferences">
          <span><strong>Preferences</strong> &mdash; remembers small choices like sound-atmosphere on or off.</span>
        </label>
      </div>
      <div class="cookie-pref">
        <label>
          <input type="checkbox" id="cookiePrefAnalytics">
          <span><strong>Analytics</strong> &mdash; anonymous first-party page counts via Vercel. No individual profiling.</span>
        </label>
      </div>
      <div class="cookie-prefs-actions">
        <button class="cookie-btn cookie-save" type="button" id="cookieSave" data-hover>Save my choices</button>
      </div>
    </div>
  </div>
</div>`;

  function mount() {
    const navSlot = document.getElementById('ns-nav');
    const menuSlot = document.getElementById('ns-menu');
    const footerSlot = document.getElementById('ns-footer');
    const hiddenSlot = document.getElementById('ns-hidden');
    if (navSlot)     navSlot.outerHTML = NAV_HTML;
    if (menuSlot)    menuSlot.outerHTML = MENU_HTML;
    if (footerSlot)  footerSlot.outerHTML = FOOTER_HTML;
    if (hiddenSlot)  hiddenSlot.outerHTML = HIDDEN_HTML;

    // Cookie banner — inject once at end of body, wire behaviour.
    if (!document.getElementById('cookieBanner')) {
      document.body.insertAdjacentHTML('beforeend', COOKIE_HTML);
    }

    // Skip-to-content link for keyboard users — first focusable on the page.
    if (!document.querySelector('.skip-link')) {
      document.body.insertAdjacentHTML('afterbegin', SKIP_HTML);
    }
    // JSON-LD Organization + WebSite schema — one copy per page.
    if (!document.getElementById('ns-jsonld-org')) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = 'ns-jsonld-org';
      s.textContent = JSON.stringify(JSONLD);
      document.head.appendChild(s);
    }

    // Wire the menu directly — inline handlers avoid any timing races with premium.js.
    wireMenu();
    wireCookieBanner();
    // Fire the shared event so premium.js re-binds cursor / reveal handlers against the new DOM.
    window.dispatchEvent(new CustomEvent('ns:partials-mounted'));
  }

  /* ─────────── Cookie consent ───────────
     Stored as JSON in localStorage['ns_cookie_consent'] with shape:
       { v:1, ts:<epoch ms>, necessary:true, preferences:bool, analytics:bool }
     Absence of the key = banner surfaces on the next page load.
     Any of the three actions (Accept all / Reject / Save) closes the banner and
     persists a decision. A "Cookie preferences" link in the footer re-opens it. */
  const CONSENT_KEY = 'ns_cookie_consent';
  function readConsent() {
    try { const r = JSON.parse(localStorage.getItem(CONSENT_KEY)); return r && r.v === 1 ? r : null; }
    catch (_) { return null; }
  }
  function writeConsent(preferences, analytics) {
    const row = { v: 1, ts: Date.now(), necessary: true, preferences: !!preferences, analytics: !!analytics };
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(row)); } catch (_) {}
    document.documentElement.dataset.cookiePreferences = row.preferences ? '1' : '0';
    document.documentElement.dataset.cookieAnalytics = row.analytics ? '1' : '0';
    window.dispatchEvent(new CustomEvent('ns:consent-changed', { detail: row }));
    return row;
  }
  function wireCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    const prefs = document.getElementById('cookiePrefs');
    const cbPref = document.getElementById('cookiePrefPreferences');
    const cbAnal = document.getElementById('cookiePrefAnalytics');
    const btnManage = document.getElementById('cookieManage');
    const btnReject = document.getElementById('cookieReject');
    const btnAccept = document.getElementById('cookieAccept');
    const btnSave   = document.getElementById('cookieSave');

    const show = () => { banner.hidden = false; requestAnimationFrame(() => banner.classList.add('on')); };
    const hide = () => { banner.classList.remove('on'); setTimeout(() => { banner.hidden = true; }, 260); };

    // Detect Global Privacy Control — treat as "reject non-essential" per Cookie Policy.
    const gpc = navigator.globalPrivacyControl === true;
    const existing = readConsent();
    if (!existing) {
      if (gpc) {
        writeConsent(false, false);           // honour GPC silently, do not surface the banner
      } else {
        show();
      }
    } else {
      document.documentElement.dataset.cookiePreferences = existing.preferences ? '1' : '0';
      document.documentElement.dataset.cookieAnalytics = existing.analytics ? '1' : '0';
    }

    btnManage && btnManage.addEventListener('click', () => {
      const opening = prefs.hidden;
      prefs.hidden = !opening;
      btnManage.setAttribute('aria-expanded', opening ? 'true' : 'false');
      if (opening && existing) {
        cbPref.checked = !!existing.preferences;
        cbAnal.checked = !!existing.analytics;
      }
    });
    btnReject && btnReject.addEventListener('click', () => { writeConsent(false, false); hide(); });
    btnAccept && btnAccept.addEventListener('click', () => { writeConsent(true, true);   hide(); });
    btnSave   && btnSave.addEventListener('click',   () => { writeConsent(!!cbPref.checked, !!cbAnal.checked); hide(); });

    // Any footer link with [data-cookie-open] re-opens the banner.
    document.querySelectorAll('[data-cookie-open]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const cur = readConsent();
        if (cur) {
          if (cbPref) cbPref.checked = !!cur.preferences;
          if (cbAnal) cbAnal.checked = !!cur.analytics;
          if (prefs) prefs.hidden = false;
        }
        show();
      });
    });
  }

  function wireMenu() {
    const btn = document.getElementById('menuBtn');
    const overlay = document.getElementById('menuOverlay');
    const close = document.getElementById('menuClose');
    if (!btn || !overlay || btn.dataset.wired === '1') return;
    btn.dataset.wired = '1';
    const open = () => { overlay.classList.add('on'); overlay.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    const shut = () => { overlay.classList.remove('on'); overlay.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    btn.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    overlay.addEventListener('click', e => { if (e.target === overlay || e.target.classList.contains('menu-scene')) shut(); });
    document.querySelectorAll('[data-menu-close]').forEach(el => el.addEventListener('click', shut));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('on')) shut(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
