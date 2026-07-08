# Changelog

All notable changes to the `nxtspacelabs-website` repo are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions are date-based milestones for this site (not semver in the strict library sense — there's no package consumers this needs to stay compatible for), tagged in git as `vX.Y.Z`.

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

### Known issues (tracked, not yet resolved)
- **`contact.html` uses hCaptcha's public test sitekey** (`10000000-ffff-ffff-ffff-000000000001`), which always passes verification. The contact form currently has no real bot protection until this is swapped for a production sitekey from an hCaptcha account the founder controls, with the matching `HCAPTCHA_SECRET` set in Vercel's environment variables.
- **`index-legacy-v2.html`** is a tracked, publicly-reachable, orphaned page (an earlier homepage draft) not linked from any current navigation, not in `sitemap.xml`, and not disallowed in `robots.txt`. Pending a founder decision on whether to delete it (fully recoverable from git history regardless) or keep it intentionally reachable.
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
