# NextSpace Labs — Website Developer Guide

Internal engineering reference for `nxtspacelabs-website`, the static site serving `nxtspacelabs.com`. Read this before touching the repo — it should answer "how does this work" without needing to reverse-engineer the code.

Not legal advice, not for external distribution. Internal engineering doc only.

---

## 1. What this repo is (and isn't)

This repo is a **static site** — plain HTML, CSS, and vanilla JS, deployed as-is to Vercel. There is no build step, no bundler, no framework, no `npm run build`. What's in the repo is what ships.

It is **not** the admin console, and it does not hold the PairNow product backend. Those live in separate repos and separate Vercel projects. This repo only:

- Serves the marketing/legal/company website at `nxtspacelabs.com`.
- Runs one serverless function (`api/contact.js`) for the contact form.
- Proxies a fixed list of paths (`/login`, `/dashboard`, `/kyc`, `/api/*`, etc.) to the separate admin project, so that admin surfaces feel like they live on the same domain without actually being in this codebase.

If you're looking for PairNow app code or the admin console source, you're in the wrong repo.

---

## 2. Folder structure

```
nxtspacelabs-website/
├── *.html                  Every page is a standalone .html file at repo root.
│                            e.g. privacy.html → served at /privacy (cleanUrls: true)
├── assets/
│   ├── premium.css          The entire design system — one shared stylesheet, every page.
│   ├── premium.js           Cursor, reveal-on-scroll, menu wiring, misc interaction glue.
│   ├── partials.js          Injects shared nav / menu / footer / cookie banner into every page.
│   └── scene-lite.js        WebGL starfield background (three.js).
├── legal/
│   └── *.pdf                Downloadable PDF versions of every legal document.
│                            Regenerate these whenever the source .html changes — see §9.
├── api/
│   └── contact.js           The ONE serverless function in this repo. Contact form handler.
├── docs/                     You are here. Excluded from the live deployment via
│                            `.vercelignore` — kept in git for the team, but never reachable
│                            at any public URL. Do not remove that exclusion: this guide
│                            documents known/open issues (§9, §10) that shouldn't be public.
├── logo.svg                  Source-of-truth brand mark. All PNG icons are rendered FROM this.
├── apple-touch-icon.png       Rendered from logo.svg — see docs/BRAND_GUIDELINES.md.
├── icon-192.png / icon-512.png / icon-512-maskable.png / favicon-16.png / favicon-32.png
├── site.webmanifest           PWA manifest — icon set, name, theme color.
├── robots.txt                 Disallows admin-proxy paths from indexing.
├── sitemap.xml                 Hand-maintained. Update when you add or remove a public page.
├── vercel.json                 THE most important config file in this repo. See §3 and §6.
├── package.json                 Only real dependency: nodemailer (used by api/contact.js).
└── .gitignore
```

There is no `src/`, no `public/`, no `dist/`. Every `.html` file at the repo root is a live, directly-servable page.

---

## 3. Routing

Routing has three layers, all defined in `vercel.json`:

### 3.1 Clean URLs
`"cleanUrls": true` means `privacy.html` is reachable at both `/privacy.html` and `/privacy` — but internal links should always use the extensionless form (`/privacy`), which is what every page on the site does. Vercel handles the rewrite automatically; you don't need a redirect rule per page.

### 3.2 Static pages
Any `.html` file at the repo root becomes a route automatically — no entry in `vercel.json` needed. Add `newsroom.html` and `/newsroom` just works.

### 3.3 Admin proxy rewrites
The `rewrites` array in `vercel.json` forwards specific paths to `https://nxtspacelabs-admin.vercel.app` — a **separate** Vercel project with its own codebase, its own auth, and its own database access. This site never talks to Supabase, Cashfree, or any product backend directly; it only forwards HTTP requests.

**Rule: every path the admin app needs must be listed explicitly.** There's no wildcard `/​*` catch-all to the admin app — each route (`/login`, `/dashboard`, `/kyc`, `/api/kyc/:path*`, etc.) is named individually. This is intentional: it means a typo or a new admin route doesn't silently start proxying unrelated traffic, and it keeps `robots.txt` (which disallows the same list) trivially in sync.

**When the admin team adds a new route that needs to be reachable at `nxtspacelabs.com`:**
1. Add the exact path to the `rewrites` array in `vercel.json`.
2. Add the same path to `robots.txt` under the `Disallow:` block (admin surfaces are never meant to be indexed).
3. Do **not** add a wildcard unless you've confirmed with the admin team exactly what it should match — overly broad wildcards risk unintentionally proxying public API routes that should stay 404 on this domain.

### 3.4 Error pages
`404.html` and `500.html` are plain static files. Vercel serves `404.html` automatically for any unmatched path. `500.html` is not auto-served by Vercel for static-only projects (there's no server to fail) — it exists mainly for consistency/design parity and for the admin app to redirect to if it wants a branded error page; the admin app's own runtime errors are handled on its own side.

---

## 4. Shared components (`assets/partials.js`)

There are no React/Vue components here — "shared components" means **injected HTML fragments**, all defined in one file: `assets/partials.js`.

Every page includes these three empty mount points in the same spot:

```html
<div id="ns-nav"></div>
<div id="ns-menu"></div>
<div id="ns-sound"></div>
...
<div id="ns-footer"></div>
<div id="ns-hidden"></div>
```

On page load, `partials.js` replaces each of these with the shared nav bar, full-screen menu overlay, sound toggle, footer, and the hidden "easter egg" mode. It also:
- Injects the site-wide JSON-LD (`Organization` + `WebSite` schema) once per page.
- Injects the skip-to-content link for keyboard users.
- Wires up the mobile-style hamburger menu (open/close/escape/click-outside).
- Injects and wires the cookie-consent banner (`Accept all` / `Reject non-essential` / `Manage preferences`), persisting the choice to `localStorage['ns_cookie_consent']` and honoring the browser's Global Privacy Control signal.

**To change the nav, footer, or menu on every page at once: edit `assets/partials.js`. Do not copy-paste nav/footer markup into individual `.html` files** — that's exactly the duplication this file exists to avoid.

If a page needs something in the footer or nav that others don't, that's a sign it should be a page-specific section instead, added after the shared partial mounts, not a change to the shared partial itself.

---

## 5. Environment variables

The only code that reads environment variables is `api/contact.js`. There are **no client-side environment variables** — nothing in this repo uses `NEXT_PUBLIC_*`-style build-time injection, because there's no build step.

| Variable | Required | Purpose | Where to set |
|---|---|---|---|
| `ZOHO_SMTP_PASS` | Yes | Zoho mailbox app-password for `connect@nxtspacelabs.com`. Without it, the contact form returns `smtp_not_configured` (500) — form fails safe, no crash. | Vercel Project → Settings → Environment Variables |
| `ZOHO_SMTP_HOST` | No (defaults `smtp.zoho.in`) | Override if the mailbox ever migrates off Zoho India. | same |
| `ZOHO_SMTP_PORT` | No (defaults `465`) | SMTP port. | same |
| `ZOHO_SMTP_USER` | No (defaults `connect@nxtspacelabs.com`) | Sending mailbox. | same |
| `HCAPTCHA_SECRET` | Yes for real bot protection | Server-side hCaptcha secret. **If unset, `verifyCaptcha()` returns `true` unconditionally** — a deliberate dev fallback, but it means CAPTCHA verification is silently disabled if this is missing in production. | same |

**Never commit real values for any of these.** There is no `.env` file in this repo (checked — none tracked in git) and there should never be one. Vercel injects these directly into the serverless function's runtime.

To pull current values locally for testing (requires Vercel CLI + project link):
```
vercel env pull .env.local
```
`.env.local` must stay gitignored if you ever create it.

---

## 6. Security headers (`vercel.json`)

Every response gets this header set (see the `headers` block in `vercel.json`):

| Header | Value | Why |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years, including subdomains, eligible for browser preload lists. |
| `X-Content-Type-Options` | `nosniff` | Stops MIME-sniffing attacks. |
| `X-Frame-Options` | `SAMEORIGIN` | Blocks the site from being iframed elsewhere (clickjacking defense). |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Doesn't leak full URLs (with query strings) to third-party sites on outbound link clicks. |
| `Permissions-Policy` | camera/mic/geo/USB/bluetooth/sensors all `()` denied | The site uses none of these APIs — deny by default so no injected/compromised third-party script could invoke them. |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolates the browsing context from cross-origin popups. |
| `Content-Security-Policy` | see `vercel.json` | Restricts script/style/font/connect/frame sources to an explicit allowlist (self, Google Fonts, hCaptcha, jsdelivr for three.js, Vercel Insights). `object-src 'none'` and `upgrade-insecure-requests` included. |

**Known trade-off, documented on purpose:** the CSP includes `'unsafe-inline'` for both `script-src` and `style-src`. This is because several pages use inline `onclick` handlers (e.g. the Print button: `onclick="window.print()"`) and inline `<style>`/`<script type="application/ld+json">` blocks. Removing `'unsafe-inline'` in favor of a nonce-based CSP would require:
1. Moving every inline event handler to `addEventListener` calls in external JS.
2. Either externalizing every inline `<script>`/`<style>` block, or wiring a per-request nonce — which requires Vercel Edge Middleware (a real code change, not a config tweak) since this is a static deploy with no per-request templating today.

This is real, worthwhile hardening for later — but it's a project of its own, not a header tweak. Do not attempt a partial version (e.g. adding a nonce to only some scripts) — that creates a false sense of security while leaving the rest of the inline surface exploitable.

**Whenever you add a new external script/font/API dependency** (a new analytics tool, a new CDN font, a new embed), you must add its origin to the relevant CSP directive in `vercel.json` or the browser will silently block it. Test with the browser console open — a CSP violation shows as a console error, not a visible page break, so it's easy to miss without checking.

### Image optimization (`vercel.json` → `images`)
Vercel's built-in Image Optimization API is configured and ready, even though the site currently has zero raster images (everything is inline SVG, CSS gradients, or WebGL). When you add a photo or raster illustration:

```html
<img
  src="/_vercel/image?url=/my-photo.jpg&w=1200&q=75"
  srcset="/_vercel/image?url=/my-photo.jpg&w=640&q=75 640w,
          /_vercel/image?url=/my-photo.jpg&w=1200&q=75 1200w,
          /_vercel/image?url=/my-photo.jpg&w=1920&q=75 1920w"
  sizes="(max-width: 700px) 100vw, 1200px"
  width="1200" height="800"
  alt="Describe the image"
  loading="lazy"
  decoding="async">
```

Vercel automatically serves AVIF or WebP based on the visitor's `Accept` header, with the original format as fallback — no separate encoding pipeline needed. Always set explicit `width`/`height` (prevents layout shift / CLS) and `loading="lazy"` for anything below the fold. Never link a raw uploaded photo directly — always route it through `/_vercel/image`.

---

## 7. Analytics

Two first-party, privacy-respecting scripts are wired into every page, right before `</body>`:

```html
<script defer src="/_vercel/insights/script.js"></script>
<script defer src="/_vercel/speed-insights/script.js"></script>
```

- **Vercel Web Analytics** — anonymous page-view counts, referrers, and countries. No cookies, no cross-site tracking, no individual profiling.
- **Vercel Speed Insights** — real-user Core Web Vitals (LCP, CLS, INP) sampled from actual visitor sessions.

Both respect the site's own cookie-consent gate (see `partials.js` §4) — the `analytics` checkbox in the cookie banner controls whether these are allowed to report. There is no Google Analytics, no Meta Pixel, no third-party ad-tech tracker anywhere on the site — this is a standing commitment stated on `/compliance` and `/esg`. Do not add one without a full policy review; adding an ad-tech tracker would directly contradict a public commitment made in the Cookie Policy and the "What we will not do" section of the Compliance Center.

---

## 8. SEO

- **`sitemap.xml`** — hand-maintained, not auto-generated. When you add or remove a public page, update this file. It is not validated automatically; a stale sitemap silently under- or over-reports pages to search engines.
- **`robots.txt`** — disallows every admin-proxied path (kept in sync with the `rewrites` list in `vercel.json` — see §3.3) and points to the sitemap.
- **Per-page metadata** — every page defines its own `<title>`, `<meta name="description">`, canonical URL, Open Graph tags, and Twitter card tags directly in its `<head>`. There's no shared template for these — copy the pattern from an existing page (e.g. `security.html`) when creating a new one, and write real, distinct copy for the description (don't leave a copy-pasted description from another page).
- **JSON-LD** — the site-wide `Organization` + `WebSite` schema is injected once per page by `partials.js` (§4). Don't duplicate it manually in a new page's `<head>`.
- **`cleanUrls: true`** — canonical URLs across the site use the extensionless form; make sure any new page's `<link rel="canonical">` also omits `.html`.

---

## 9. Contact form

`contact.html` (client) → `api/contact.js` (server, the only serverless function in the repo).

Flow:
1. Visitor fills the form. An invisible hCaptcha challenge runs on submit (`data-size="invisible"`).
2. **Current state: the sitekey in `contact.html` is hCaptcha's public test key (`10000000-ffff-ffff-ffff-000000000001`), which always passes.** This must be swapped for a real sitekey (from an hCaptcha account you control) before this form provides any actual bot protection. See `docs/DEVELOPER_GUIDE.md` §5 for the matching server-side secret (`HCAPTCHA_SECRET`).
3. `api/contact.js` re-verifies the captcha server-side (never trust client-side verification alone), rate-limits by IP (5 requests / 15 minutes, in-memory — resets on cold start, which is an accepted trade-off for a low-traffic contact form), checks a honeypot field, sanitizes and length-caps every field, and validates the email format.
4. On success, sends via Zoho SMTP (`nodemailer`) to `connect@nxtspacelabs.com`, with the visitor's message as the reply-to so replying goes straight back to them.
5. All user-supplied values are HTML-escaped before being interpolated into the email body — this prevents a malicious message from injecting HTML/script into the email client rendering it.

**Do not** add additional serverless functions casually — the Vercel Hobby plan caps a project at 12 serverless functions, and this repo currently uses exactly 1. Adding new API routes without checking the count risks a **silent deployment failure** — the build succeeds, but new functions beyond the cap don't deploy. Always run a quick count (`find api -type f | wc -l` equivalent) before adding a new endpoint.

---

## 10. Legal pages

Ten legal/governance documents live at repo root, all following the same template pattern (see any of them, e.g. `privacy.html`, for the exact structure to copy):

`privacy.html` · `terms.html` · `cookies.html` · `acceptable-use.html` · `refunds.html` · `ip.html` · `security.html` · `accessibility.html` · `responsible-ai.html` · `open-source.html`

All ten are indexed from `compliance.html` (the Compliance Center), which also has a client-side search box (`data-cc-terms` attribute on each card drives the search-matching).

Every legal page has:
- A `.legal-header` block with `.legal-meta` (Effective date / Version / Last updated / a fourth context-specific field) and a `.legal-note` callout.
- A **version-history** block (`.legal-version-history`) near the bottom — append a new `<li>` every time you materially change the document; never delete old entries.
- Matching **Download PDF** and **Print** buttons in the hero (`.doc-actions`) — the PDF must be regenerated whenever the source `.html` changes (see §9 below in this same guide — actually see the note directly below).

**Whenever you edit a legal `.html` file, regenerate its PDF.** The PDFs in `/legal/*.pdf` are static files checked into git — editing the HTML does **not** automatically update the PDF. Process (no dependencies beyond a locally-installed Chrome and Node's `npx serve`):

```bash
npx serve -l <any-free-port> -n            # serve the repo locally
"/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --virtual-time-budget=15000 \
  --print-to-pdf=legal/nxtspacelabs-<doc-name>.pdf \
  --print-to-pdf-no-header \
  http://localhost:<port>/<page-slug>
```

The print stylesheet (`@media print` block in `assets/premium.css`) controls exactly what renders in the PDF — it hides the nav, cursor effects, cookie banner, and footer coda, and forces light-background/dark-text for print legibility.

**Cross-document consistency to preserve whenever you edit any legal page:**
- Registered office address, CIN/GSTIN placeholders, and contact emails must read identically across every document (grep for the address string to verify after any edit).
- Governing law / jurisdiction / arbitration seat (India, Hyderabad, non-exclusive courts) must not diverge between `privacy.html`, `terms.html`, and any new legal doc.
- `Version` and `Effective`/`Last updated` dates should stay in sync across documents updated in the same round — don't leave one doc on an old date while others advance.

**CIN / GSTIN placeholders** (`U72900TG2026PTCXXXXXX` and `36XXXXXXXXXXXX1ZX`) appear in exactly these files: `assets/partials.js` (footer, every page), `contact.html`, `privacy.html`, `terms.html`. When the real numbers are issued, replace all four occurrences and regenerate the affected PDFs.

---

## 11. Creating a new page

1. Copy an existing page that's structurally closest to what you're building (a legal-style doc → copy `security.html`; a marketing page → copy `services.html` or `industries.html`).
2. Update, in the `<head>`: `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:url`, `<link rel="canonical">`. Do not skip these — a copy-pasted description is worse than none.
3. Keep the shared partial mount points intact: `#ns-nav`, `#ns-menu`, `#ns-sound`, `#ns-footer`, `#ns-hidden`, and the closing script tags (`scene-lite.js`, `partials.js`, `premium.js`, plus the two Vercel Insights scripts).
4. Add the page to `sitemap.xml`.
5. Add a link to the page from wherever it's discoverable — the menu (`assets/partials.js` → `MENU_HTML`), the footer (`assets/partials.js` → `FOOTER_HTML`), or a relevant hub page like `compliance.html`. An orphaned page that's live but not linked from anywhere is a real, verified issue — see the Production Hardening review that flagged `index-legacy-v2.html` for exactly this.
6. If it's a legal/governance document, follow the full template pattern in §10 above, including the version-history block and PDF generation.
7. Test locally before pushing: `npx serve -l <port> -n`, then check the page renders, links work, and — if it's a new top-level nav destination — that the mobile menu and footer both reflect it.

---

## 12. Deployment process

Deployment is **fully automatic via Vercel's GitHub integration** — there is no manual deploy step, no CI pipeline to babysit, no separate staging promotion.

1. Push to `main` on GitHub (`GOneTechnologies/nxtspacelabs-website`).
2. Vercel picks up the push, builds (for a static site, "build" is close to instant — no compilation), and deploys to production automatically.
3. The deploy is live at `nxtspacelabs.com` within roughly a minute.

**There is no separate preview/staging environment configured for this repo today.** Every push to `main` goes straight to production. If you want to test something risky before it's live, either:
- Test locally with `npx serve` first (see §11 step 7), or
- Push to a feature branch — Vercel's GitHub integration automatically creates a preview deployment (a unique `*.vercel.app` URL) for any non-`main` branch or PR, without touching production. Merge to `main` only once you've checked the preview.

**Rollback:** Vercel keeps every previous deployment. To roll back:
1. Vercel Dashboard → the `nxtspacelabs-website` project → Deployments tab.
2. Find the last-known-good deployment (they're listed with their commit message and timestamp).
3. Click "Promote to Production" (or the equivalent "Instant Rollback" action).

This re-points the production domain at the old deployment **immediately**, without needing a `git revert` first. It's the fastest path back to a working state; do the `git revert`/fix-forward afterward, at normal speed, once the site is stable again.

---

## 13. Backup procedure

Because the entire site is plain static files in git, **git history is the backup.** There's no database to snapshot, no build artifacts to preserve separately.

Before any large structural change (a homepage replacement, a full redesign, a framework migration), tag the current state so it's a one-command recovery, not an archaeology exercise through commit history:

```bash
git tag -a pre-<change-name> -m "Snapshot before <change-name>"
git push origin pre-<change-name>
```

To recover to that exact state later:
```bash
git checkout pre-<change-name> -- .
```
or, to see it without touching your working tree:
```bash
git show pre-<change-name>:index.html
```

See `CHANGELOG.md` at the repo root for the tagged release history, starting with `v1.0.0` — the production-hardening baseline this guide was written alongside.

---

## 14. Performance budget

Measured, not guessed — as of this writing:

| Asset | Raw size | Gzipped |
|---|---|---|
| `index.html` | 97 KB | 21.5 KB |
| `assets/premium.css` (shared, every page) | 39 KB | 7.8 KB |
| `assets/premium.js` (shared, every page) | 10.5 KB | 3.3 KB |
| `assets/partials.js` (shared, every page) | 21.8 KB | 6.0 KB |
| `assets/scene-lite.js` (shared, every page) | 8.2 KB | 3.0 KB |
| **First-party total, homepage** | **~183 KB** | **~42 KB** |

The single heaviest dependency is **not first-party**: `three.js` (imported via `<script type="importmap">` from `cdn.jsdelivr.net`, module build) is roughly 150 KB gzipped and is **not** reliably cross-site-cached anymore — modern browsers (Chrome, Safari, Firefox) partition the HTTP cache per top-level site, so a visitor's browser having `three.js` cached from another site does not save a request here.

**Budget going forward:**
- First-party gzipped weight (HTML + shared CSS/JS) per page: **stay under 60 KB.** Current homepage is 42 KB — there's headroom, but it should be spent deliberately, not by accident.
- Any new page-specific `<style>` or inline script block should be small; if it's reused by more than one page, move it into `premium.css`/`premium.js` instead of duplicating.
- Images: always via `/_vercel/image` (§6), always with explicit dimensions, always lazy-loaded below the fold. A single unoptimized photo can outweigh the entire rest of the homepage — treat every new image as a budget decision, not a drive-by addition.
- Don't add a second animation/WebGL library. `scene-lite.js` (using `three.js`) is the one heavy visual dependency the site carries; a second one would roughly double the non-cacheable payload for comparatively little visual gain.
- Re-measure with the same method (`wc -c` for raw, `gzip -c | wc -c` for compressed) after any significant page addition, and compare against this table.

**Core Web Vitals targets** (standard "Good" thresholds — Vercel Speed Insights, already wired in per §7, reports real-user data against these automatically):
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1 — the main risk here is adding an image without explicit `width`/`height`, or adding a web font without `font-display: swap` (already set correctly for the four current fonts).
- INP (Interaction to Next Paint): < 200ms

---

## 15. Monitoring & alerting

**What Vercel already does automatically, with zero setup:**
- **SSL certificates** — auto-provisioned and auto-renewed (Let's Encrypt) for any domain attached to the Vercel project. There is no manual renewal step and, practically, no expiry risk **unless DNS is repointed away from Vercel**, which would break the renewal's domain-validation challenge. An uptime monitor (below) that checks HTTPS will surface this as a certificate error immediately if it ever happens.
- **Deployment failure emails** — if a push to `main` fails to build/deploy, Vercel emails project members automatically. No configuration needed.
- **Real-user performance data** — Speed Insights (already wired, §7) reports Core Web Vitals from actual visitor sessions in the Vercel dashboard, no extra setup.

**What needs a founder decision + a short manual setup (I can't create third-party accounts on your behalf):**

| Need | Recommended | Why | Setup time |
|---|---|---|---|
| Uptime monitoring | [Checkly](https://vercel.com/marketplace/checkly) (native Vercel Marketplace integration) or [UptimeRobot](https://uptimerobot.com) free tier | Checkly installs with auto-wired env vars since it's a native Vercel integration; UptimeRobot is the simplest zero-cost fallback (50 monitors, 5-min interval, free). Point either at `https://nxtspacelabs.com/` and expect `200`. | ~10 min |
| Domain expiry | Enable auto-renew at your registrar (wherever `nxtspacelabs.com` was purchased) | This is the actual fix — a calendar reminder is a backup, not a substitute. Vercel does not manage domain *registration* expiry, only DNS/SSL for domains already pointed at it. | ~5 min |
| Error alerting (the one serverless function) | [Sentry](https://vercel.com/marketplace/sentry) via Vercel Marketplace | Native integration auto-wires the DSN as an env var. Wrap `api/contact.js`'s catch block to report to Sentry once installed — currently it only `console.error`s, which is visible in Vercel's function logs but not proactively alerted. | ~15 min |
| Domain + SSL combined check | Whichever uptime tool above — most flag cert errors and expiry as part of the same check | Avoids paying for/maintaining a second, separate tool just for SSL. | included above |

None of these require new code in this repo beyond, optionally, a few lines in `api/contact.js`'s `catch` block once Sentry is installed (to call `Sentry.captureException(e)` before the existing `console.error`). Everything else is account setup + pointing the tool at the live URL.

---

## 16. Brand & content consistency

See `docs/BRAND_GUIDELINES.md` for the full design system (colors, type, spacing, motion, voice/tone, icon usage, email signature). The short version: **don't invent new colors, fonts, or spacing values.** Everything the site needs is already a CSS custom property in `assets/premium.css` — reuse it.

---

## 17. Release history

See `CHANGELOG.md` at the repo root.
