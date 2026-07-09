# Changelog

All notable changes to the `nxtspacelabs-website` repo are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions are date-based milestones for this site (not semver in the strict library sense — there's no package consumers this needs to stay compatible for), tagged in git as `vX.Y.Z`.

---

## [1.0.16] — 2026-07-09 — Insights trimmed to a minimal, honest placeholder

Decided not to lead a brand-new company with thought-leadership essays. For a company with no public track record yet, philosophy essays can undercut credibility rather than build it, and a standing blog is a publishing commitment a small team shouldn't take on at launch. Kept Insights in the nav but stripped it to a single honest line — it returns when there are real launches/case studies behind it.

### Changed
- `insights.html`: removed the 7 placeholder essay teasers, 4 whitepaper/memo cards, and the dead filter CSS/JS. Left the hero + one honest "we write after the work, not before it" statement with a personal notify link.

### Preserved
- The three drafted essays (calm software, Tuesday evening, ten-day native) are parked in `docs/insights-drafts.md` (not deployed). The ten-day-native piece is earmarked as source material for a forthcoming product case study.

---

## [1.0.15] — 2026-07-09 — Legal docs: HTML is the single source of truth (removed PDFs)

Adopted the Infosys / modern-enterprise convention — the HTML legal pages are now the only authoritative version.

### Removed
- Deleted all 10 `/legal/*.pdf` files and the "Download PDF" button on every legal page. Rationale: two public versions of a legal document can drift out of sync (we just saw this with the grievance-officer name), creating ambiguity over which governs. One HTML source is simpler to maintain and legally cleaner.

### Kept
- The **Print** button on every legal page (`window.print()`) — anyone can Save-as-PDF from the always-current page on demand. Point-in-time reference is preserved by each page's effective-date + version-history block and by git history.
- The `@media print` styling (now serves Print / Save-as-PDF only).

### Housekeeping
- Removed dead `.doc-download` CSS; updated `DEVELOPER_GUIDE.md` §10 (no more PDF regeneration step).

---

## [1.0.14] — 2026-07-09 — Founder biography: more visionary, less résumé

Refined the founder biography per direction — inspirational, timeless, and vision-led rather than a list of activities. Now foregrounds conviction, values, and the long-arc philosophy (build fewer things, exceptionally well; decades not quarters; earn a lasting place) in the site's premium literary voice. Original and free of exaggerated claims. `company.html`.

---

## [1.0.13] — 2026-07-09 — Regenerate Terms + Privacy PDFs + fix print stylesheet

The two legal PDFs needed to reflect the corrected grievance-officer name (Saidulu Shaik). Regenerating them surfaced two latent bugs in the print pipeline — now fixed.

### Fixed
- **Legal PDFs rendered nearly blank.** Body sections use `.reveal` (opacity:0 until a scroll-triggered JS observer reveals them). A headless print-to-PDF never scrolls, so everything below the hero stayed invisible — PDFs came out as a title plus an illegible footer. Added `.reveal { opacity:1 !important; transform:none !important }` to the `@media print` block so all content is always visible in print.
- **Site footer leaked into legal PDFs.** `partials.js` replaces the `#ns-footer` placeholder via `outerHTML`, so the print hide-list (targeting `#ns-footer` / `.foot-grid`) missed the rendered `<footer>` and its `.foot-compliance` block. Now the whole `footer` (plus `.foot-compliance`) is hidden in print.

### Changed
- Regenerated `legal/nxtspacelabs-terms-of-use.pdf` and `legal/nxtspacelabs-privacy-policy.pdf` via the documented Chrome print pipeline. Both now render fully in the site's premium fonts (Fraunces / Instrument Serif), show the corrected grievance-officer name **Saidulu Shaik**, and end cleanly with no footer. Verified page-by-page.

### Note
- The other 8 legal PDFs were built before these print fixes; regenerating them would bring the whole set to the same premium, footer-free rendering.

---

## [1.0.12] — 2026-07-09 — Founder biography + legal-name correction (Saidulu Shaik)

The founder supplied his identity and a visionary bio brief. Two things shipped.

### Added
- **Founder biography on the Company page.** Replaced the cramped leadership card with a proper founder feature — a portrait medallion (photo-ready; monogram until a professional portrait is supplied), name, title, a three-paragraph biography refined from the founder's brief, and a pull-quote of the founding philosophy (*"Build fewer things. Build them exceptionally well. Earn trust through quality and consistency."*). The two open *in residence* seats move to a two-column grid below.

### Changed
- **Founder name corrected site-wide** — placeholder "S. K. Jeevan" → legal name **Saidulu Shaik**, with **Jeevan** as the commonly used name. Updated the visible Company block, the JSON-LD `founder` on every page (`name` + `alternateName` + `jobTitle` "Founder & CEO"), the shared `partials.js` org schema, and the **grievance-officer legal name** in `terms.html` + `privacy.html`.

### Follow-up needed
- `legal/nxtspacelabs-terms-of-use.pdf` and `legal/nxtspacelabs-privacy-policy.pdf` still carry the old grievance-officer name and must be regenerated from their source to match the HTML.

---

## [1.0.11] — 2026-07-09 — Factual-accuracy cleanup: every public claim now true & verifiable

Pre-content-phase truth pass. The founder's rule: every public statement must be accurate and verifiable today, and unhappened milestones wait until they happen. Three facts were confirmed directly with the founder (company incorporated — CIN issued; PairNow live with tens of thousands of users; **two** other products in development — JeldiGo + PayNest, not three), which set the correct wording.

### Fixed
- **Newsroom "releases" were fabricated placeholders.** Five dated press rows (`newsroom.html`) were headline-only teasers for articles that don't exist, several with invented specifics (a "MAY · 21" beta date, "feedback from users who used the product for less than five minutes"). None were real published posts, so per the accuracy rule they couldn't stand — even where the underlying milestone (incorporation, product growth) is genuinely true. Replaced the five rows with one honest note; real, correctly-dated posts will land in the content phase.
- **Product count off by one.** Boilerplate "quietly working on **three** more" → "**two** more" (`newsroom.html`); company stat strip "**03** In the lab" → "**02**" (`company.html`) — matching the two confirmed products in development.
- **Unverifiable "first hire" claim.** `company.html` "the city where our first product, our first hire, and our first breath began" → dropped "our first hire" (can't be verified; the founder can restore it if a hire has happened).

### Deliberately kept (confirmed true & verifiable)
- "Incorporated in Hyderabad, India in 2026" and JSON-LD `foundingDate` — CIN issued.
- "First shipped product … used by tens of thousands of people in India" — PairNow is live at that scale.

---

## [1.0.10] — 2026-07-09 — Content-audit defect sweep: dead links + absolute wording

Pre-content-phase cleanup. A full-site audit turned up exactly two classes of defect; both fixed.

### Fixed
- **Dead links (5).** Anchors with no `href` — 4 whitepaper/research cards on `insights.html`, the media-kit card on `newsroom.html` — did nothing when clicked. All now resolve to the appropriate `mailto:` (matching the sibling links). Two verbs adjusted for honesty (e.g. "Read the note" → "Ask for the note", since the note isn't published yet).
- **Absolute-promise wording (2).** `insights.html` newsletter line "Nothing else. Ever." → "Nothing else — no digests, no drip campaigns." `esg.html` commitment "Never sell personal data. Ever." → "Never sell personal data." (drops the redundant absolute; the commitment stays).

### Deliberately left as-is
- Honest hedges that *should* stay absolute-free the correct way: "we cannot guarantee absolute security" (privacy), "reviewed but not guaranteed" (refunds), and the already-scalable "every enquiry is reviewed personally *during our early growth*" phrasing used on contact/careers/company.

---

## [1.0.9] — 2026-07-09 — Cursor: an innovative custom cursor that's actually visible

Founder wanted the distinctive custom cursor back — but *user-friendly*, not the old one that vanished. Rebuilt it correctly.

### Added
- **Custom cursor, always visible.** A glowing white dot + a ring that trails behind it with easing. Both read on *any* background via a purple glow + soft shadow — the root cause of the original "can't find the pointer" bug was `mix-blend-mode: difference` (which inverted the cursor to invisible over the ambient scene); the new cursor uses normal blending, so it's never lost.
- **Clear interactive feedback.** Hovering any link/button/field expands the ring (34px → 60px) and fills it faintly purple, and the dot turns nebula-purple — an unmistakable "this is clickable" cue.
- **Safe fallbacks.** The custom cursor runs only on true desktop pointers (`hover: hover` + `pointer: fine`); touch devices and anyone with `prefers-reduced-motion` get the native cursor with normal pointer affordances. No permanent animation loop on those devices.

Applied in `assets/premium.css` + `assets/premium.js` (all content pages) and `index.html` (homepage). Verified live: dot visible at opacity 1 with glow, ring expands to 60px on hover, native cursor hidden on desktop, zero console errors.

---

## [1.0.8] — 2026-07-08 — Production QA: real social image, dead-code cleanup

Final pre-launch end-to-end review (assets, SEO, dead code, console, a11y, consistency). The site passed on nearly every axis; two real fixes shipped.

### Fixed
- **Social share image was an SVG** — `og:image` and `twitter:image` pointed to `logo.svg` on all 24 pages. Most platforms (Facebook, LinkedIn, X, WhatsApp, iMessage, Slack) don't render SVG, so shared links showed a blank preview. Created a proper branded **1200×630 `og-image.png`** (dark brand backdrop, gradient logo mark, "NextSpace Labs — We shape what comes next.") and repointed `og:image` + `twitter:image` across every page. Favicons and the JSON-LD `logo` (which may be SVG) are unchanged.
- **Dead cursor code** — after retiring the custom dot/ring (v1.0.6), `premium.js` and `index.html` still ran a permanent `requestAnimationFrame` loop updating the now-hidden dot/ring and bound `mouseenter`/`mouseleave` listeners to *every* link/button/input to toggle a hidden element's class. Reduced to a single function that only drives the ambient light, guarded to `hover:hover` devices (no loop at all on touch). Removes wasted per-frame work and dozens of event listeners.

### Verified clean (no change needed)
- All favicon / manifest / icon assets exist and resolve. `sitemap.xml` lists all 22 public URLs (404/500 correctly excluded); `robots.txt` allows crawl, disallows admin surfaces + `/api/`, and references the sitemap. No `console.log`/TODO/debug artifacts in shipped code (the one `console.error` is legitimate server-side SMTP logging). Per-page `<title>`, description, canonical, and OG/Twitter tags all present. Native cursor + ambient light confirmed working; zero console errors.

### Note for the founder (dashboard, not code)
- The Vercel Web Analytics / Speed Insights scripts (`/_vercel/insights/*`) 404 on a local static server by design. Confirm **Web Analytics + Speed Insights are enabled in the Vercel project dashboard** so they don't 404 for real visitors in production.

---

## [1.0.7] — 2026-07-08 — Responsive QA sweep across all pages + touch-target fixes

Full end-to-end responsive pass. Every page was audited at mobile (390px) and tablet (768px) with a live script that flags horizontal overflow, off-screen/clipped elements, and undersized tap targets, covering every layout archetype: the homepage, marketing pages with card grids (services, company, industries), legal longform pages with tables (privacy, cookies, open-source), the contact form, and the filter/article page (insights).

### Result
- **Zero horizontal overflow / no clipped content** on every page and archetype tested, at both 390px and 768px. Heroes, card grids, data tables, forms, and filter chips all reflow correctly — the existing breakpoint system (900 / 700 / 600 / 500px) is sound. Body copy holds a readable ~15.5px floor on mobile.

### Fixed (the two real issues the audit surfaced)
- **Menu secondary links** (`.menu-group a` — "About us", "Leadership", "Admin login", etc.) were only ~21px tall. Enlarged to a ~40px tap target on touch (`≤900px`), verified on both the homepage and content pages. Primary menu links were already 90px.
- **Cookie-banner policy links** ("Read the Cookie Policy" / "Read the Privacy Policy") were a cramped ~14px; given a larger tap area on phones (`≤600px`).

Both fixes applied in `assets/premium.css` (all content pages) and `index.html` (homepage's inline menu). No layout changes — padding-only, so nothing shifts.

---

## [1.0.6] — 2026-07-08 — UX: retire the custom cursor, restore native pointer + touch-friendly targets

Addresses two review items: (1) the mouse pointer was hard to locate, and (2) mobile polish.

### Changed — cursor & hover (site-wide)
- **Restored the native OS cursor everywhere.** The site previously set `cursor: none` on the body and every interactive element (desktop only) and drew a custom 6px dot + ring in its place. That custom cursor used `mix-blend-mode: difference`, so it inverted against the background and became nearly invisible over the ambient WebGL scene and imagery — the "can't find the pointer" problem. Removed all `cursor: none` (≈20 occurrences across `assets/premium.css`, `index.html`, `insights.html`) and retired the dot/ring.
- **Every interactive element now shows a clear `cursor: pointer` on hover** — the native affordance established sites (Apple, Stripe) rely on. Non-link hover-cards (e.g. the homepage "Living Ideas" tiles) correctly keep `cursor: default`. Existing CSS `:hover` states (nav underline, button borders, menu item colour/arrow) are unchanged, so interactivity is reinforced, not lost.
- **Kept** the soft ambient light that follows the mouse as a subtle desktop-only touch (it never hid the pointer); it's disabled on touch/coarse-pointer devices.

### Changed — responsive polish
- **Touch targets** on phones (`≤600px`): nav Menu/Search pills, menu-close, and document Download/Print buttons now have a 44px minimum height (finger-friendly), verified at 390px.
- **Homepage mobile spacing**: tightened per-section padding (`120px` → `96px`) so sections feel intentionally composed on a phone rather than sparse.

### Notes
- The site already carried a comprehensive set of breakpoints (900 / 700 / 600 / 500px) across nav, menu, hero, grids, cards, and footer; the homepage and content pages verify as clean, intentional layouts at 390px. Deeper per-page mobile art-direction can be iterated against real-device testing.

---

## [1.0.5] — 2026-07-08 — Homepage: fix broken skip-link, remove decorative time label

Two homepage items spotted in review.

### Fixed
- **"Skip to content" link was visible on load and unstyled.** Root cause: `index.html` is fully self-contained (all CSS inline) and does **not** load `assets/premium.css`, where the `.skip-link` rule lives — so on the homepage the skip link rendered as plain, always-visible text at the top-left. (Every other page loads `premium.css`, so it was correct there — this was homepage-only.) Copied the `.skip-link` rule into the homepage's inline `<style>`: it's now off-screen (`top: -100px`) until keyboard focus, slides in on Tab (`:focus` → `top: 24px`), and activating it moves focus to `<main id="main" tabindex="-1">` (verified). No visual change for mouse users; correct accessibility behavior restored for keyboard users.

### Removed
- **"— [time] in Hyderabad" decorative label** — it was a purely aesthetic time-of-day whisper with no functional purpose and nothing planned around it. Removed the markup, its CSS, and the `timeText`-setting branch of the `daynight()` script. The invisible day/night ambient-lighting body class (a separate concern) is untouched — the page still tints subtly by time of day; only the visible text label is gone.

---

## [1.0.4] — 2026-07-08 — Homepage: stop rewriting the URL hash while scrolling

Founder wants the homepage to behave like an established company site (Apple, Microsoft, Stripe) — the address bar should stay `nxtspacelabs.com` during normal browsing rather than churning through `#hero`, `#labs`, `#careers`, … as sections scroll past.

### Changed
- **`index.html` chapter rail** — removed the single `history.replaceState(..., '#' + id)` call inside the scroll `IntersectionObserver`. The observer still runs and still highlights the active chapter dot in the side rail; it just no longer mutates the URL. Scrolling now leaves the address bar untouched.

### Unchanged (verified still works)
- **Direct hash visits** — loading `/#contact` (or any section id) still scrolls to that section on load, via the browser's native anchor behavior.
- **Clicking a rail / nav link** — still smooth-scrolls to the target section and sets the hash, because those are ordinary `<a href="#id">` anchors the browser handles natively (nothing in the removed line was involved).

---

## [1.0.3] — 2026-07-08 — Homepage: fix Hyderabad time label, remove ambient sound

Two founder-requested fixes after a review of the live homepage.

### Fixed
- **"— [x] in Hyderabad" time label** (`index.html`) was computing morning/day/evening/night from the *visitor's own device clock*, not Hyderabad's actual time — a visitor outside India would see a time-of-day label that had nothing to do with Hyderabad. Now computed via `Intl.DateTimeFormat` with `timeZone: 'Asia/Kolkata'`, independent of the visitor's local timezone. The page's ambient day/night lighting theme (body class) intentionally still follows the visitor's own local clock — that behavior wasn't reported as wrong and wasn't touched.

### Removed
- **Ambient sound toggle**, completely: the WebAudio-synthesized ambient drone, the speaker-icon button, and every trace of it across the codebase — founder decision that background audio doesn't fit the brand and the site should stay visual-only. Removed from:
  - `index.html` — button markup, `.sound-toggle` CSS block, the `soundToggle()` script.
  - `assets/premium.js` / `assets/partials.js` — the shared `soundToggle()` function and `SOUND_HTML` injection used by every other page.
  - `assets/premium.css` — the `.sound-toggle` rule block, plus its entries in the print-media hide-list and the `:focus-visible` selector list.
  - All 23 remaining HTML pages — the empty `<div id="ns-sound"></div>` mount point.
  - `docs/DEVELOPER_GUIDE.md` — updated the shared-partials section and the new-page checklist to no longer mention `#ns-sound`.

### Unchanged
- The `#hero`-style URL hash sync (chapter rail + `history.replaceState`) — founder confirmed this deep-linking behavior is intentional and should stay as-is.

---

## [1.0.2] — 2026-07-08 — Contact form: drop CAPTCHA, harden server-side instead

Founder decision: keep the contact form frictionless for launch rather than add a CAPTCHA challenge. Removed hCaptcha entirely (it was still on the public test sitekey, so it was providing zero real protection anyway) and replaced it with layered server-side defenses appropriate for a low-traffic company contact form.

### Added
- **Elapsed-time bot trap** in `api/contact.js` — client records when the form became interactive and sends the elapsed milliseconds as `_t`; server silently drops (200 response, no email sent) anything submitted faster than 1.5 seconds, the minimum plausible time for a human to read the form and type a message.
- **Second rate-limit window** — was 5 requests/15 minutes per IP; added a 20 requests/24 hours per IP secondary cap to catch slow-drip abuse the short window doesn't see.
- **Strict `intent` allow-list** — the field now validates against the exact five `<select>` options server-side, rather than accepting arbitrary sanitized free text.

### Removed
- hCaptcha entirely: the widget and script tag from `contact.html`, the `verifyCaptcha()` function and `HCAPTCHA_SECRET` handling from `api/contact.js`, the hCaptcha CSP allowances (`js.hcaptcha.com`, `*.hcaptcha.com`, `hcaptcha.com`, `newassets.hcaptcha.com`) from `vercel.json` — CSP `frame-src` tightened to `'none'` since nothing on the site needs to embed an iframe anymore.
- hCaptcha references from the legal/governance surface: removed as a named sub-processor in `privacy.html` §6, removed its cookie-table row from `cookies.html`, removed its vendor-license row from `open-source.html`.

### Unchanged (already present, verified still correct)
- Honeypot field (`name="website"`, hidden, `aria-hidden`) — was already implemented on both the client and server; no changes needed.
- Full field sanitization, length caps, and email-format validation — already present; retained as-is.

### Known trade-off, stated plainly
This is a soft-defense stack, not a hard guarantee — the in-memory rate limiter resets per cold-start instance, and none of these layers stop a determined, patient attacker the way a CAPTCHA challenge would. This is an intentional, informed trade-off in exchange for zero friction on a low-traffic form; if real spam shows up post-launch, the documented next step is re-adding hCaptcha (`docs/DEVELOPER_GUIDE.md` §9), not endlessly tightening these numbers.

Legal PDFs regenerated: `nxtspacelabs-privacy-policy.pdf`, `nxtspacelabs-cookie-policy.pdf`, `nxtspacelabs-open-source.pdf` (content changed; version/effective dates unchanged since this is a factual correction, not a policy change).

---

## [1.0.1] — 2026-07-08 — Final verification & hardening

A live-production verification pass against `v1.0.0` — every claim below was checked against the actual deployed site (`curl`, live Lighthouse run, `npm audit`), not assumed from source alone.

### Security
- Fixed a **high-severity** dependency vulnerability: `nodemailer` was pinned at `^6.9.14`, affected by 8 published advisories (SMTP/CRLF command injection, SSRF via `jsonTransport`, TLS certificate validation bypass on OAuth2 token fetch, ReDoS in address parsing). Upgraded to `^9.0.3`. Verified the only breaking change between major versions (stricter default TLS validation on remote-content fetches) does not affect this codebase — `api/contact.js` uses plain SMTP auth with no attachments and no OAuth2. `npm audit`: 8 vulnerabilities → 0.
- Added `package-lock.json` (previously absent, so `npm audit` could not run at all).

### Accessibility
- **Added a `<main>` landmark to all 24 pages.** Previously, `id="main"` (the skip-link target) lived on a `<header>` or, on the homepage, a bare `<a>` — meaning no page had an actual `<main>` landmark for screen-reader users to jump to. Verified via a live Lighthouse accessibility audit against production, which flagged `landmark-one-main` as failing before this fix.
- **Fixed heading-order violation**: the hamburger-menu overlay used `<h5>Company</h5>`, `<h5>Team access</h5>`, `<h5>Reach</h5>` as purely stylistic labels — appearing before the page's `<h1>` in DOM order on every page. Converted to `<div class="menu-label">`, preserving identical visual styling (verified via screenshot, unchanged) while removing the false heading semantics. Footer column headings (also `<h5>`) were deliberately left as-is — they sit after all page headings and are a much more common, lower-severity pattern.
- Paired all 10 `backdrop-filter` declarations in `assets/premium.css` with the `-webkit-backdrop-filter` prefix Safari requires; 6 of 10 were previously missing it, meaning glass-blur effects (nav, menu overlay, cookie banner, cards) silently lost their blur on Safari, with graceful degradation to a plain translucent background.

### SEO
- **`sitemap.xml` was stale** — missing all 8 legal/governance pages added since the last update (`compliance`, `security`, `accessibility`, `responsible-ai`, `ip`, `acceptable-use`, `refunds`, `open-source`), and used `.html`-suffixed URLs inconsistent with the site's extensionless canonical convention. Rebuilt with all 22 public pages, extensionless URLs, and current `lastmod` dates.
- **Found, not yet fixed** (requires a Vercel dashboard change, not a code change): the live site redirects `nxtspacelabs.com` → `www.nxtspacelabs.com`, but every canonical URL, Open Graph tag, and sitemap entry in the codebase declares the bare apex domain as canonical — the opposite of where the redirect sends traffic. See `docs/DEVELOPER_GUIDE.md` §8 for the two ways to resolve this.

### Performance
- Ran a live Lighthouse audit against production twice (with and without software WebGL rendering) to separate genuine findings from headless-Chrome-without-a-real-GPU artifacts, which are well-documented to produce unrepresentative Total Blocking Time / Speed Index numbers for WebGL-heavy pages. **Performance score is not reported here** as a single authoritative number for that reason. What's environment-independent and verified: Accessibility 96/100, Best Practices 96/100 (see below), SEO 100/100.
- Verified real byte weights directly (not Lighthouse-derived): homepage first-party payload is 42KB gzipped (HTML+CSS+JS combined); the one heavy dependency is the `three.js` CDN import (~150KB gzipped, not cacheable across sites in modern browsers due to cache partitioning). Documented as the performance budget baseline in `docs/DEVELOPER_GUIDE.md` §14.

### Monitoring — found via live testing, not previously known
- **`/_vercel/insights/script.js` (Vercel Web Analytics) returns 404 in production.** The script tag is correctly present in every page's HTML, but Vercel only serves that endpoint once Web Analytics is toggled on for the project in the Vercel dashboard (Project → Analytics). No page-view data is currently being collected. `/_vercel/speed-insights/script.js` (Speed Insights) is confirmed working (200, actively collecting).
- SSL certificate confirmed valid and auto-renewing (Let's Encrypt via R12, issued 27 May 2026, expires 25 Aug 2026 — comfortably inside Vercel's ~30-day-before-expiry auto-renewal window).
- All security headers (CSP, HSTS w/ `includeSubDomains; preload`, Permissions-Policy, X-Frame-Options, COOP, X-Content-Type-Options) confirmed present on live production responses, matching `vercel.json` exactly.

### Known issues carried forward from v1.0.0 (still open)
- `contact.html` hCaptcha sitekey is still the public test key. Founder is obtaining a real sitekey/secret pair.
- CSP retains `'unsafe-inline'` for `script-src`/`style-src` (documented trade-off, `docs/DEVELOPER_GUIDE.md` §6).
- Domain-registrar auto-renew and third-party uptime/error-alerting tooling still require founder account setup (`docs/DEVELOPER_GUIDE.md` §15).
- Apex/www canonical mismatch (above) — Vercel dashboard fix pending.

---

## Release verification checklist — v1.0.1

Every line below was checked against the live production deployment on 2026-07-08, not assumed from source:

- [x] **Deployment successful** — `curl -sL https://nxtspacelabs.com/` → follows to `www.nxtspacelabs.com`, HTTP 200.
- [x] **SSL certificate active** — valid Let's Encrypt cert, issued 27 May 2026, expires 25 Aug 2026, auto-renewal confirmed within Vercel's standard window.
- [x] **All routes verified** — 20 legal/marketing pages, the 3 admin-proxy sample routes (`/login`, `/dashboard`, `/kyc`), and the 404 fallback all return their correct status codes on live production.
- [x] **`robots.txt`** — live, correctly disallows every admin-proxied path, points to `sitemap.xml`.
- [x] **`sitemap.xml`** — rebuilt to include all 22 public pages (was missing 8); confirmed live and parseable.
- [x] **No broken internal links** — spot-checked via Lighthouse's link-crawlability audit (pass) plus manual route verification above.
- [x] **Secret scan passed** — grepped every client-side file for API-key/token patterns; zero matches. `api/contact.js` (the one server-side file with credentials) reads all secrets from `process.env`, never hardcoded.
- [x] **Dependency/security audit** — `npm audit`: 1 high-severity finding (nodemailer), fixed, now 0 vulnerabilities.
- [x] **Repository clean** — `git status --porcelain` empty after this round's commit; nothing uncommitted.
- [x] **Tag pushed** — `v1.0.1` created and pushed, following `v1.0.0`.

### Rollback readiness
Two independent rollback paths, both already documented in `docs/DEVELOPER_GUIDE.md` §12:
1. **Vercel Dashboard → Deployments → Promote to Production** on any prior deployment — instant, no git operations needed.
2. **Git tag checkout** — `git checkout v1.0.0 -- .` restores the exact pre-this-round state; every tag is a permanent, pushed recovery point.

### Browser compatibility — honest scope
Verified in this pass: **Chromium only** (headless Chrome, both via Lighthouse and the local preview browser). This environment has no access to real Safari, Firefox, or physical mobile devices, so those are **not tested** here — that claim is not made. What was checked and fixed proactively for Safari specifically: the `backdrop-filter` prefix gap above (a real, verifiable Safari-only rendering difference, confirmed by reading the CSS rather than by running Safari). Recommend a manual pass in BrowserStack or real devices before or shortly after this promotion, particularly for the custom-cursor and WebGL starfield, which are the two most platform-sensitive pieces of the page.

### Lighthouse scores (live production, 2026-07-08)
| Category | Score | Note |
|---|---|---|
| Accessibility | 96/100 | Up from a lower baseline after the `<main>` landmark + heading-order fixes above; remaining 4 points not itemized in this pass |
| Best Practices | 96/100 | The one deduction is the Web Analytics 404 (above) — a dashboard toggle, not a code defect |
| SEO | 100/100 | |
| Performance | *not reported* | Headless Chrome without real GPU acceleration produces unrepresentative WebGL/animation timings for this page — see Performance section above for the real, environment-independent measurements used instead |

---

## [1.0.0] — 2026-07-04 — Production baseline

The site is promoted to serve as NextSpace Labs' official digital headquarters. This tag is the recovery point referenced in `docs/DEVELOPER_GUIDE.md` §13 (Backup procedure) — see that document for how to roll back to it.

### Added
- Full legal/governance suite: Privacy Policy, Terms of Use, Cookie Policy, Acceptable Use Policy, Refund & Cancellation Policy, Intellectual Property Notice, Security Policy (with Responsible Disclosure), Accessibility Statement, Responsible AI Statement, Open-Source Attribution — ten documents, each with a downloadable PDF, version history, and consistent effective-date metadata.
- `/compliance` — Compliance Center indexing all ten governance documents, with client-side search/filter and audience-first framing.
- Cookie consent banner (Accept all / Reject non-essential / Manage preferences), honoring Global Privacy Control, persisted to `localStorage`.
- Raster icon set (16/32/180/192/512/512-maskable PNG) rendered from `logo.svg`, wired into every page's `<head>` and `site.webmanifest`, alongside the existing scalable SVG favicon.
- "Popular destinations" quick-links row on the 404 page.
- Vercel Image Optimization configuration (`images` block in `vercel.json`) — ready for the first raster photo/illustration the site adds, with automatic AVIF/WebP negotiation.
- Internal documentation: `docs/DEVELOPER_GUIDE.md` (deployment, folder structure, routing, shared components, environment variables, analytics, SEO, contact form, legal-page maintenance, new-page checklist, backup/rollback, performance budget, monitoring) and `docs/BRAND_GUIDELINES.md` (logo, color, type, spacing, motion, icons, voice/tone, email signature).
- Security header hardening: `object-src 'none'`, `upgrade-insecure-requests` added to CSP; `Permissions-Policy` expanded to explicitly deny unused device APIs (USB, Bluetooth, sensors, picture-in-picture, Topics API).

### Changed
- Footer "Responsibility" column renamed to "Compliance," now leads with a link to the Compliance Center.
- Softened several public commitments that read as absolute/unscalable promises: "every note is read" → "every report is reviewed and routed to the appropriate team"; "pay above market" → "we aim to offer fair and competitive compensation"; ESG ownership language moved from naming the founder personally to "the company's leadership."
- Legal document effective/last-updated dates unified to 4 July 2026 across all ten documents (previously a one-day drift existed between the earliest three docs and the later additions).

### Fixed
- `terms.html` §2 (Eligibility) expanded to include an export-control and sanctions warranty (comprehensively-sanctioned jurisdictions, UN/EU/UK/US/India restricted-party lists) — was previously silent on this.

### Removed
- `index-legacy-v2.html` — a tracked, publicly-reachable orphaned page (an earlier homepage draft), not linked from any current navigation and not in `sitemap.xml`. Founder-confirmed deletion; fully recoverable from git history (`git show <pre-removal-commit>:index-legacy-v2.html`) if ever needed.

### Known issues (tracked, not yet resolved)
- **`contact.html` uses hCaptcha's public test sitekey** (`10000000-ffff-ffff-ffff-000000000001`), which always passes verification. The contact form currently has no real bot protection. Founder-owned follow-up: create an hCaptcha account, generate a production sitekey + secret, and provide both — the sitekey goes in `contact.html`, the secret goes in Vercel's `HCAPTCHA_SECRET` environment variable. No code change needed beyond swapping these two values once issued.
- CSP retains `'unsafe-inline'` for `script-src`/`style-src` — documented, deliberate trade-off; see `docs/DEVELOPER_GUIDE.md` §6 for what a nonce-based CSP migration would require.
- No third-party uptime/error-alerting/domain-expiry monitoring is wired up yet — this requires account creation the founder needs to do directly; recommendations and exact setup steps are in `docs/DEVELOPER_GUIDE.md` §15.

---

## [0.9.0] — 2026-07-04 — Legal hardening pass

### Added
- Acceptable Use Policy, Refund & Cancellation Policy, Open-Source Attribution pages.
- Export-control/sanctions clause in Terms of Use.

### Changed
- Compliance Center card copy simplified to plain-English first sentences; audience-first intro added; version/effective dates unified across documents.

---

## [0.8.0] — 2026-07-04 — Compliance Center

### Added
- `/compliance`, `/security` (with Responsible Disclosure), `/accessibility`, `/responsible-ai`, `/ip` pages.
- Cookie consent banner.
- Version-history blocks on all legal documents.

---

## [0.7.0] — 2026-07-04 — Multi-jurisdictional legal rewrite

### Added
- Privacy Policy, Terms of Use, and Cookie Policy rewritten to cover DPDP 2023 (India), EU/UK GDPR, CCPA/CPRA (California), and LGPD (Brazil) baseline, with downloadable PDFs and a print stylesheet.

---

## [0.6.0] — 2026-07-03 — Digital Headquarters v3 promotion

### Changed
- The v3 site (interactive hero, full company/services/industries/insights/newsroom/careers structure) promoted to serve at `/`, replacing the earlier v2 site.
- Contact email corrected to `connect@nxtspacelabs.com` everywhere (previously leaking a PairNow-scoped address on company surfaces).
- SEO completeness pass: inline JSON-LD, Open Graph images on legal and error pages.

---

## [0.5.0] — 2026-06-12 to 2026-07-01 — Admin proxy expansion

### Added
- Incremental admin-proxy rewrites in `vercel.json` as the admin console grew: `/kyc/history`, `/pricing` (+ `/men`, `/women`), `/admins`, `/payments`, `/live-calls`, `/users/:id`, `/rooms-waitlist`, `/broadcast` (+ `/scheduled`), and matching `/api/*` routes.
- TradePilot product route at `/tradepilot`.

---

## [0.1.0] — 2026-05-27 — Initial launch

### Added
- First version of the corporate site: v1 → v2 (fuller IT-services positioning) → v3 (interactive hero, rotating phrase, particles, parallax) shipped same-day.
- Founder's note section, correct entity naming (NextSpace Labs Private Limited), PairNow/NextSpace brand separation established from day one.

---

[1.0.0]: https://github.com/GOneTechnologies/nxtspacelabs-website/releases/tag/v1.0.0
