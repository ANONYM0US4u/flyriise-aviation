# DESIGN PLAN — "Ascent"

The visual and motion system, written so another designer can extend it without
re-deriving the logic. Direction approved as a *direction*; see
`OPEN_QUESTIONS.md` Q1 for the mark itself.

---

## 1. The idea

A training institute sells the *journey*, not the certificate. The site is one
continuous departure: a dark apron at dusk, a runway, an aircraft that lifts,
and a climb from blue hour into daylight as the candidate scrolls. Every
section is a station on that climb, labelled with flight-instrument language
(`FL050` … `FL350`) that carries real structure without pretending to be an
aviation authority.

Tone: quiet luxury, aerospace precision. Confident, never loud. The most
expensive-looking thing on the page is usually the least coloured.

## 2. Palette

| Token | Value | Role |
| --- | --- | --- |
| `apron` | `#070b14` | Deepest dark — hero, footer, departures board |
| `twilight` / `twilight-2` | `#12203a` / `#17294a` | Raised dark surfaces |
| `cirrus` / `cloud` | `#e6edf6` / `#f7f9fc` | Light surfaces, forms, legal reading |
| `ink` | `#0a1222` | Text on light |
| `amber` | `#ffb224` | **The** accent — CTA, focus, data, nothing else |
| `amber-ink` | `#8a5a00` | Accent *as text on light surfaces* (5.0:1) |
| `steel` | `#93a6c4` | Muted text on dark |
| `steel-deep` | `#8695b6` | Faintest text on dark (4.5:1 minimum — see A11Y-1) |
| `graphite` | `#46536b` | Muted text on light |
| `verified` / `pending` / `alert` | `#2fb383` / `#7f8fab` / `#e0603c` | Trust lamps and errors |

Rules the palette enforces:

- **One accent.** Amber appears on roughly 2 % of pixels. It marks the single
  action you want, the single number that matters, and nothing else.
- **Surface-aware accent.** `Section` tags itself `data-surface="light|dark"`;
  an unlayered CSS rule re-tints amber text on light surfaces. Amber measured
  1.5:1 on cloud — unusable as text. Now 5.0:1.
- **Contrast is a token problem, not a per-page problem.** Every text token
  clears WCAG AA on every surface it is allowed to sit on.

## 3. Typography

- **Display** — Archivo at 600, `font-stretch: 108 %`, `-0.025em`, balanced
  wrapping. Used at `clamp(2.5rem, 9.2vw, 6rem)` for the hero only.
- **Body** — Archivo 400, 1 rem / 1.62, `text-wrap: pretty`.
- **Instrument** — B612 Mono at 11 px, uppercase, `0.18em` tracking, tabular
  numerals. This is the site's voice: section codes, markers, timestamps,
  definitions, and every trust label.
- Reading measure capped at 68ch (`52ch` for tight blocks).

Fonts are self-hosted WOFF2 subsets (`next/font`), `display: swap`, preloaded.

## 4. Geometry and surface

- Radii stay near-zero: 2 / 4 / 6 px. Premium reads as precision, not softness.
- Hairlines: 1 px `rgb(230 237 246 / 0.12)` on dark, `rgb(10 18 34 / 0.14)` on
  light. This is the main structural device — it replaces boxes and shadows.
- Shadows only where something genuinely floats (boards, drawers).
- Film grain (`.grain`) at 28 % soft-light over flat darks, so the palette reads
  photographic rather than flat.
- Engineering motifs: corner ticks, runway dashes, a 96 px grid overlay used at
  low opacity, never behind text.

## 5. The 3D scene

A dusk apron. Runway edge lights in perspective, an aircraft on stand, haze
bands, stars fading as the sky grades toward daylight. Camera flies on a keyframed
path; the aircraft lifts on its own track; both are pure functions of one scroll
progress value (`0 → 1`) with no per-frame state and no allocation.

Posture, deliberately:

- No physics engine, no glTF downloads, no HDRI environment maps, no
  post-processing. Every pixel is procedural or CSS.
- Geometry is authored in code, which keeps the whole 3D layer at ~247 KB
  gzip and makes the art direction tunable from `scene-config.ts`.
- The poster (`hero-poster.tsx`, pure SVG) sits **beneath** the canvas at every
  tier, so first paint never waits for a shader.

## 6. Motion

| Purpose | Treatment |
| --- | --- |
| Scroll narrative | One `--ascent` value drives camera, departure and headline fade |
| Section entrance | 720 ms opacity/translate, staggered, below-the-fold only |
| Instrument draw-in | SVG stroke-dash draw, 2.1 s |
| Micro-interaction | 200 ms, `cubic-bezier(0.4, 0, 0.2, 1)` |
| Kill switch | OS preference **or** the in-page "Motion & 3D" toggle |

Motion is never load-bearing: every element is visible by default, and JS only
*adds* the animation. Reduced motion removes the 3D layer, the sticky runway and
all transitions — the page is a complete document without a single animation.

## 7. Component language

- **Action** — the only button. `primary` (amber fill) for the one conversion
  you want; `secondary` (hairline outline) for everything else. No third
  emphasis level, no gradients, no shadows on buttons.
- **Section** — `apron` / `twilight` / `light` / `cloud`, each a full-bleed
  surface with an optional `SectionMeta` "flight plan" annotation.
- **Claim chips** — the trust layer made visible: `VERIFIED` / `PENDING` /
  `AWAITING DATA` with a coloured lamp.
- **Boards** — the departures board, the hero HUD: tabular numerals, hairlines,
  a single amber marker that reads like a runway light.

## 8. Responsive rules

- 320 px is a supported viewport, not an afterthought — verified by measurement.
- Below `sm` the wordmark shortens to the brand's short form and the header
  action group tightens, so nothing overflows.
- Data-dense rows (statistics, manifests) become horizontal snap rails or
  stack; they never squeeze into unreadable columns.
- The conversion bar (Call · WhatsApp · Apply) is fixed below `lg`, with
  safe-area padding, and layout space is reserved so it never covers content.

## 9. What "premium" was *not* allowed to mean here

No glassmorphism, no neon glow, no floating gradient blobs, no parallax on text,
no autoplaying video, no stock photography of a smiling cabin crew. The brief is
a trust document as much as a look document, and generic luxury decoration
undercuts it.