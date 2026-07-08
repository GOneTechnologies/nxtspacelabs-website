# NextSpace Labs — Brand Guidelines (Internal)

Every value in this document is taken directly from `assets/premium.css` and the live site — nothing here is aspirational or unimplemented. If a value here and the CSS ever disagree, the CSS is correct and this document is stale; update this file, not the other way around.

Internal reference only — not for external distribution.

---

## 1. Logo usage

**Source of truth:** `logo.svg` at the repo root. Every other logo asset (`apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `favicon-16.png`, `favicon-32.png`) is rendered *from* this SVG — never hand-edit a PNG independently of the source, or the icon set will drift out of sync.

The mark is an "N" monogram built from three elements:
1. A left leg + diagonal + right leg forming the "N", filled with the **main gradient** (deep indigo → violet → azure).
2. A magenta accent diagonal stroke crossing through it, at 92% opacity.
3. A four-point sparkle above the right leg, in a pink-to-violet gradient.

**Clear space:** maintain padding equal to at least the width of one leg-stroke of the N around the mark. The rendered PNG icons already bake in ~28% padding on all sides (72% logo fill), and the maskable 512 variant uses ~56% fill to survive Android's adaptive-icon safe-zone cropping — don't tighten either of these.

**Do:**
- Use the SVG directly wherever scalability matters (nav bar, footer, menu overlay — see any of these in `assets/partials.js`).
- Use the pre-rendered PNGs only for contexts that require a raster (favicons, PWA manifest, apple-touch-icon, email signature).
- Keep the dark background (`--void`, `#020209`) behind the mark wherever possible — the gradient was tuned against that background.

**Don't:**
- Recolor, flatten, or "simplify" the gradients into a solid fill.
- Stretch or skew the mark — it's drawn on a 240×220 viewBox for a reason; always preserve aspect ratio.
- Place the mark on a light or busy background without testing contrast first — it was not designed against light backgrounds and no light-mode variant exists yet.

---

## 2. Color palette

All colors are CSS custom properties on `:root` in `assets/premium.css`. Reference the variable, never hardcode the hex value in new code — that's what makes the "day/night" and future theme variants possible with a single override block.

| Token | Hex | Role |
|---|---|---|
| `--void` | `#020209` | Primary background (near-black, slightly blue) |
| `--void-2` | `#08081A` | Secondary background depth |
| `--mist` | `#F7F5F0` | Primary text (warm off-white, not pure white) |
| `--mist-2` | `#E8E4DB` | Secondary text / headings |
| `--dim` | `#8A8798` | Muted / tertiary text |
| `--dim-2` | `#4C4A5A` | Faintest text (labels, meta) |
| `--nebula` | `#A78BFA` | **Primary accent** — violet |
| `--nebula-2` | `#7C3AED` | Accent, darker step (hover/active states, gradients) |
| `--azure` | `#60A5FA` | Secondary accent — blue |
| `--magenta` | `#F472B6` | Tertiary accent — pink |
| `--magenta-2` | `#EC4899` | Accent, darker step |
| `--amber` | `#FBBF24` | Warning / warm accent (used sparingly) |
| `--line` | `rgba(247,245,240,0.08)` | Hairline borders |
| `--line-2` | `rgba(247,245,240,0.16)` | Slightly stronger borders |

**Time-of-day accent variants** — a nuance worth knowing about: the body element can carry a class that re-tints the accent trio without touching the base palette:

```css
body.morning  { --nebula: #FBBF24; --nebula-2: #F59E0B; --magenta: #F87171; }  /* warm amber/coral */
body.day      { --nebula: #A78BFA; --nebula-2: #7C3AED; }                      /* default violet */
body.evening  { --nebula: #F472B6; --nebula-2: #EC4899; --magenta: #F472B6; }  /* pink/magenta */
body.night    { --nebula: #A78BFA; --nebula-2: #7C3AED; }                      /* default violet */
```

Every page currently ships with `<body class="night">` — the violet identity is the one visitors actually see today. The morning/evening variants exist in the CSS but aren't switched on anywhere; treat them as a dormant feature, not dead code to remove.

**Contrast:** `--mist` on `--void` is the primary text/background pairing and passes WCAG AA comfortably (this is asserted, not just claimed, in `accessibility.html`). If you introduce a new color combination, check contrast before shipping — don't assume a palette color pairs safely with every other palette color at every text size.

---

## 3. Typography

Four typefaces, each with a specific, consistent job. Never introduce a fifth without a real reason — the whole point of a constrained type system is that four is already enough.

| Typeface | Role | Where it shows up |
|---|---|---|
| **Inter** | Body copy, UI labels, buttons, nav | The workhorse. Site-wide default (`body { font-family: "Inter", ... }`), weight 300 by default. |
| **Fraunces** | Display headings (h1/h2 scale) | Large serif headlines — weight 300 (light), often paired with an italic accent word in Instrument Serif for contrast within the same heading. |
| **Instrument Serif** | Italic accent words within headings, menu link labels, quotes | Always used in *italic* — this typeface's whole job on this site is the italic accent, not body text. |
| **JetBrains Mono** | Eyebrow labels, meta tags, version/date stamps, code-like UI chrome | Small size (9.5–12px), wide letter-spacing (2–4px), uppercase. The "engineering" texture against the otherwise editorial type system. |

**Letter-spacing scale** (used consistently for uppercase micro-labels): `0.3px` → `0.5px` → `1px` → `1.5px` → `2px` → `2.5px` → `3px` → `4px`. Pick from this scale rather than inventing a new spacing value — the ladder is deliberate (tighter for slightly-larger uppercase text, wider for the smallest labels).

**Pattern for a page hero heading** (copy this structure, don't reinvent it):
```html
<h1 class="page-title">
  Plain-language opening line,<br>
  <span class="italic">the accented phrase</span>.
</h1>
```
`.italic` renders in Instrument Serif italic, colored `--nebula`. This is the site's single most repeated typographic gesture — every page hero uses it.

---

## 4. Spacing system

The layout rhythm is built on one repeating unit: **section (`.chapter`) padding of `100px 48px`**, collapsing to `80px 24px` under 700px viewport width. Don't introduce a third breakpoint value for section padding — the two-step system (desktop / mobile) is intentional and consistent across all 24+ pages.

For anything smaller than section-level spacing, the codebase doesn't use a strict 4px/8px grid — it uses purpose-built values per component (e.g. card padding, gap between grid items). When adding a new component, look at the closest existing analog (a `.card`, a `.cc-card`, a `.pillar`) and match its padding/gap values rather than picking a new number.

---

## 5. Motion principles

**One easing curve family, used almost everywhere:** `cubic-bezier(0.16, 1, 0.3, 1)` — a fast-out, gentle-settle curve. This is the site's motion signature; if you add a new transition, reach for this curve first.

**Standard durations:**
- Micro-interactions (hover states, button feedback): `0.3s`–`0.5s`
- Reveal-on-scroll (the `.reveal` class every content block uses): `1.4s` — deliberately slow and confident, not snappy.
- Menu overlay open/close: `0.7s`

**The `.reveal` pattern** — almost every content block on every page carries this class:
```css
.reveal {
  opacity: 0; transform: translateY(30px);
  transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```
An IntersectionObserver in `premium.js` adds an `.on`/active state when the element scrolls into view, animating it in. Stagger classes `d1`, `d2`, `d3` (defined alongside `.reveal`) add incremental delay for sequential reveals within the same section.

**Reduced motion is respected, not optional:** `@media (prefers-reduced-motion: reduce)` collapses every transition/animation to near-zero duration and hides the WebGL scene/cursor effects entirely, replacing them with a static gradient. **Any new animation you add must work inside this media query** — either by inheriting the blanket `animation-duration: 0.01ms !important` rule already in place, or, if it's a JS-driven animation (not CSS transition/keyframe), by checking `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before running it.

**Founder direction, standing:** no new animations or visual features are wanted at this stage. The motion system above exists to keep what's already shipped consistent — it is not an invitation to add more.

---

## 6. Icon usage

The site uses two icon sources, never mixed within the same context:

1. **Inline SVG, hand-drawn, stroke-based** — every UI icon (search, menu, close, print, download, arrows) is a small inline `<svg>` with `stroke="currentColor"` and `stroke-width` between `1.4` and `1.6`. This lets icons inherit the surrounding text color automatically and stay crisp at any size. When adding a new icon, match this stroke-width range and use `fill="none"` with stroke-based paths, not filled shapes — a filled icon next to a stroked one will look inconsistent.
2. **The logo mark** (§1) — never used as a generic "icon," only as brand identification (nav, footer, menu, favicons, manifest).

No third-party icon font or icon library (Font Awesome, Material Icons, etc.) is used anywhere — don't introduce one. Every icon on the site is authored inline specifically for it.

---

## 7. Voice and tone

The clearest articulation of the site's voice is already written on the site itself — treat these as the standing style guide, not just page copy:

> "Building software for other humans is a serious act." — `esg.html`
> "The humans come first." — `esg.html`

**Characteristics, observed across the copy:**
- **Direct, declarative sentences.** Short. Confident. Avoids hedging language except where a hedge is legally or factually necessary (see the next point).
- **Precise, not promotional.** Claims are calibrated to what's actually true today, not aspirational marketing language. See `docs/../feedback` pattern already enforced site-wide: no "every note is read," no "we will always X" — replaced with scalable, honest phrasing like "every report is reviewed and routed to the appropriate team," "we aim to," "we do not currently."
- **Warmth without cuteness.** The tone is serious and human, not playful or jokey. There's no emoji, no exclamation-heavy copy, no forced enthusiasm.
- **Technical fluency assumed, jargon un-gatekept.** Legal and security pages use precise terms (DPDP, GDPR, CSP, RLS) but always gloss them in plain language nearby — see the Compliance Center's card-description pattern ("Learn how we collect, use, protect, and delete your information" as the first line, acronym badges below).
- **Self-aware honesty over polish.** The Accessibility Statement's "What we are still working on" section and the legal pages' draft-notice callouts are deliberate — the copy would rather admit an honest gap than project false completeness.

**When writing new copy for this site, avoid:**
- Absolute promises about the future ("we will never," "always," "every X is Y") unless it's a genuinely permanent commitment (the two examples the founder has explicitly signed off on: "we will never sell personal data," "no dark patterns" — both structural, not operational, promises).
- Marketing superlatives ("revolutionary," "best-in-class," "industry-leading") — the copy earns its confidence through specificity, not adjectives.
- Public commitments about HR/compensation/benefits policy unless they reflect an actual, funded, written policy — see the ESG page's softened language ("we aim to offer fair and competitive compensation") for the pattern to follow.

---

## 8. Email signature standard

No email signature template exists in the repo today (email is sent via Zoho, external to this codebase) — this is the recommended standard, derived from the brand system above, for whoever sets one up in Zoho Mail:

```
[Name]
[Title] · NextSpace Labs

connect@nxtspacelabs.com
nxtspacelabs.com

NextSpace Labs Private Limited
Door No 1-60/8/A & B, 3rd Floor, KNR Square
Opp. The Platina, Gachibowli, Kondapur
Hyderabad — 500 032, Telangana, India
```

- **Font:** plain system sans-serif (Arial/Helvetica/system-ui) in the email body — do not attempt to load Inter/Fraunces via web font in an email signature; email client support is unreliable and a broken font request looks worse than a system font.
- **Logo:** the PNG rendering of `logo.svg` at a small fixed size (32–40px tall), never the full-color gradient on a light background without testing — Zoho Mail's default compose background is white, and the mark was tuned for a dark background (§1). If it doesn't hold up visually on white, use a monochrome/single-color rendering instead of the gradient version, rather than forcing the dark-background version into a white email.
- **No animated GIFs, no promotional banners, no social icon rows** — matches the site's "warmth without cuteness" tone (§7). A signature is identification, not a marketing unit.
- **Color:** if any text in the signature is colored (e.g. the name), use `--nebula-2` (`#7C3AED`) — it's the palette's most legible accent color against a white background, unlike `--nebula` itself which is tuned for dark backgrounds.

---

## 9. What this document is not

This is not a public brand book, not a pitch-deck asset, and not a legal trademark filing. For the legal trademark scope (what's actually protectable, what third-party marks the site references, and how reuse requests are handled), see `ip.html` on the live site — that's the authoritative legal document. This file is the internal "how do I keep new work visually consistent" reference.
