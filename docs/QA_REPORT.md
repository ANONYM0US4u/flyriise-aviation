# QA REPORT — Flyriise Aviation

Verification pass against the production build. All checks below were executed
against `npm start` output (not the dev server) on **4 October 2026**.

**Result: 23 defects found, 23 fixed, 0 open.** Two are recorded as accepted
limitations with evidence.

---

## 1. How it was verified

| Method | Tool | Scope |
| --- | --- | --- |
| Types | `tsc --noEmit` | Whole project, strict |
| Unit tests | `vitest run` | Claims, data integrity, class merging, lead schema |
| Content gate | `node scripts/verify-content.mjs` (+ `--self-test`) | 74 source files, rules R1–R4 |
| Build | `next build` | 15 routes |
| Dev server | `npm run dev` | Home, programmes, forms — added after CSP-2 |
| Route smoke | `curl` | All 17 routes, expected status codes |
| API behaviour | `curl` | Valid, invalid, method, honeypot, rate limit |
| Responsive | Chromium (320/375/768/1024/1440/1920) | 9 routes, horizontal overflow + offender list |
| Accessibility | axe-core 4.10.3 | All 9 routes, full rule set |
| Keyboard | Real key events + DOM audit | Tab order, drawer, Escape, focus return |
| Capability tiers | `?tier=A\|B\|C` | Canvas presence, render loop, bundle weight |
| Reduced motion | `localStorage` preference + in-page toggle | Reveal state, canvas, transitions |
| Performance | Performance API + gzip analysis | LCP, CLS, TBT, chunk weights |

---

## 2. Defects found and fixed

### CSP-1 — Content Security Policy blocked all JavaScript *(critical)*
`script-src 'strict-dynamic'` with a nonce. The page rendered and was **completely
inert**: no hydration, no interactivity, no hero.
**Cause.** Turbopack emits zero `nonce` attributes on its own `<script>` tags
(`grep -c 'nonce="'` → `0`), so nothing matched the policy. Adding
`'unsafe-inline'` alongside the nonce does not help — browsers ignore
`'unsafe-inline'` whenever a nonce or hash is present, and no nonce exists to
match.
**Fix.** `script-src 'self' 'unsafe-inline'` with no nonce in the list. The nonce
is still generated and forwarded as `x-nonce` so the strict policy is a one-line
upgrade once the builder attaches nonces.
**Verified.** Hydration, drawers, tabs, forms and the 3D layer all function under
the shipping policy.

### CSP-2 — Development mode was completely broken *(critical)*
`npm run dev` failed with React's *"eval() is not supported in this
environment"* error and a hydration failure. Every page threw, and the
production-mode fix above does not cover it: React's **development** build calls
`eval()` to reconstruct call stacks from another environment, and the same CSP
was being served in development.
**Cause.** The policy is built in `middleware.ts` with no environment branch.
This one was found by the client, not by this report — every check in §1 runs
against the production build, so development mode had never been exercised.
**Fix.** `'unsafe-eval'` is appended to `script-src` **only** when
`NODE_ENV !== "production"`. The production policy is unchanged and still
blocks `eval` entirely.
**Verified.**
| Server | CSP `script-src` | Result |
| --- | --- | --- |
| `npm run dev` :3000 | `'self' 'unsafe-inline' 'unsafe-eval'` | Page renders, hydration runs, HMR connects, 3D mounts, **console clean** |
| `npm start` :3219 | `'self' 'unsafe-inline'` (no eval) | Unchanged from before |

### RENDER-1 — Canvas crash took down the whole hero *(critical)*
`radialTexture(..., falloff = 1.6)` computed `addColorStop(0.7 × 1.6 = 1.12)`,
raising `IndexSizeError`. The error boundary caught it, but the hero was blank.
**Fix.** Clamp the computed stop to `0…1` in `scene-config.ts`.

### LAYOUT-1 — `cn()` let a base `inline-flex` beat a caller's `hidden`
CSS source order, not class order, decides — so responsive overrides were
silently dropped and the header's secondary CTA stayed visible on small screens.
**Fix.** `cn()` now merges conflicting `display` classes (later wins), with a
regression test.

### LAYOUT-2 — `cn()` let a base text colour beat a caller's override *(serious)*
A light-surface footnote rendered `text-graphite text-steel-deep`; the base
colour won the cascade and contrast fell to **2.54:1** (axe-core).
**Fix.** `cn()` extended to merge conflicting text *colour* utilities while
leaving type sizes and alignment utilities untouched. Three regression tests.

### LAYOUT-3 — 6 px horizontal overflow at 320 px
The header action group (Enquire/Apply/menu) exceeded a 320 px viewport.
**Fix.** Short wordmark below `sm`, tighter gaps, smaller CTA padding. Verified
clean at 320 px across nine routes.

### HERO-1 — Supporting paragraph sat on top of the aircraft *(reported by the client)*
The hero used a 12-column grid: headline left, supporting paragraph and CTAs in
the right five columns — exactly where the aircraft taxis and rotates. The
takeoff effect was played behind a wall of text.
**Fix.** One left-hand column: eyebrow → headline → supporting copy → CTAs. The
scene keeps the whole right side of the frame.
**Verified numerically**, by projecting the aircraft's world position through the
same keyframes and camera (`scene-config.ts`, fov 38 from `hero-canvas.tsx`) at
1440×900:

| Scroll (ascent) | 0.0 | 0.1 | 0.2 | 0.3 | 0.5 | 0.7 | 1.0 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Aircraft centre, x | **55.8 %** | 67.7 % | 85.9 % | off-screen | 111 % | 79.5 % | 71.9 % |

The aircraft is **never left of 55.8 %** at any scroll position. The paragraph now
ends at **34 %** and the CTAs at **44 %** — clear of it throughout. On mobile the
aircraft starts at 70 % and exits right immediately, so the phone layout had room
already and is unchanged.

### LAYOUT-5 — Hero content was clipped and unreachable on short phones *(serious)*
The sticky hero is `h-[100svh] overflow-hidden`. At 320×720 the content block was
905 px tall inside a 720 px box: **185 px clipped**, including the entire trust
strip — unreachable, because a pinned element cannot be scrolled to. Only visible
by accident on a taller phone.
**Fix.** Compact rules for short viewports (`max-height: 820px`): tighter
padding, a 15 px paragraph, tighter button padding below 420 px so the two
primary CTAs stay on one row, and a trust strip that drops to one item only when
the screen is both narrow and short.
**Verified**, content height vs. viewport and clearance to the fixed conversion bar:

| Viewport | Content vs. viewport | CTA rows | Trust items | Clearance to conversion bar |
| --- | --- | --- | --- | --- |
| 320 × 720 | 704 / 720 — fits | 1 | 1 | +31 px |
| 360 × 800 | fits (−56 px) | 1 | 1 | +71 px |
| 375 × 667 | 644 / 667 — fits | 1 | 1 | +38 px |
| 390 × 844 | fits (−56 px) | 1 | 2 | +87 px |
| 1440 × 900 | unchanged | 1 | 4 | n/a (bar is `lg:hidden`) |

Confirmed on the production build as well as the dev server.

### LAYOUT-4 — Positioning stat row overflowed at 320 px
A 12-column grid gave an unbreakable word a 143 px track in a 100 px column.
**Fix.** The row flex-wraps below `sm` and becomes the 12-column grid at `sm` and
above, so the desktop composition is unchanged.

### DEV-1 — Next.js dev-tools badge sat over the site
The circular "N" indicator rendered in the bottom-left corner, on top of the
mobile conversion bar.
**Fix.** `devIndicators: false` in `next.config.ts` — development chrome only, no
effect on any build.

### A11Y-1 — Small mono labels failed contrast on dark surfaces *(serious)*
`--color-steel-deep` (`#5d6f8d`) measured **3.61–3.86:1** for 11 px text on apron
surfaces; WCAG AA requires 4.5:1.
**Fix.** Token lightened to `#8695b6`, which clears 4.5:1 on apron, twilight and
twilight-2. Fixed globally, so every faint label benefits.

### A11Y-2 — Accent text unreadable on light surfaces *(serious)*
`--color-amber` (`#ffb224`) measures **~1.5:1** on cloud/cirrus — the "awaiting
data" chips on `/campus` were effectively invisible.
**Fix.** New token `--color-amber-ink` (`#8a5a00`, 5.0:1 on cloud) applied by one
unlayered `[data-surface="light"] .text-amber` rule. It has to sit outside
`@layer components`: Tailwind's utilities layer outranks any selector
specificity inside it.

### A11Y-3 — `<aside>` nested inside a labelled section *(minor)*
axe-core `landmark-complementary-is-top-level` on `/apply` and
`/programs/[slug]`. These are grid columns, not page-level landmarks.
**Fix.** Changed to `<div>`.

### A11Y-4 — "(optional)" hint at 70 % alpha on white *(minor)*
`text-graphite/70` measured **3.64:1**.
**Fix.** Full graphite (6.57:1).

### A11Y-5 — Mobile conversion bar sat outside every landmark *(minor)*
Below `lg`, the fixed Call/WhatsApp/Apply bar rendered as a stray `<div>` after
the footer — page content with no landmark and no place in the structure for a
screen-reader user.
**Fix.** It is now `<nav aria-label="Quick contact">`.

### A11Y-6 — Horizontally scrollable departures board unreachable by keyboard *(minor)*
`scrollable-region-focusable`: the table rail scrolls for touch but a keyboard
user could not focus it, so the columns past the fold were unreachable.
**Fix.** `tabIndex={0}`, `role="group"` and a descriptive label on the scroller.

### MOTION-1 — Reduced-motion users lost page content *(serious)*
`Reveal` marked below-the-fold elements `data-reveal="pending"` (opacity 0) on
first mount, because the motion preference resolves *after* mount. When motion
was then reduced — either from a stored preference or from the in-page toggle —
the observer effect returned early and **28 elements stayed at opacity 0
permanently**.
**Fix.** When motion is still (or `IntersectionObserver` is missing) the effect
now clears `data-reveal` instead of returning early.
**Verified.** Stored preference on load: 28 hidden → 0 hidden. Mid-session
toggle: 28 pending → 0 hidden, canvas removed.

### PERF-1 — Route prefetch dragged the form engine into the homepage
Next's automatic prefetch of `/apply` and `/contact` pulled
`react-hook-form` + `zod` + resolver chunks — **223 KB gzip** — into the first
load of a page with no form.
**Fix.** `prefetch = false` by default on `Action`; explicit `prefetch={false}`
on header, footer and section links.
**Measured.** Homepage JS **533.4 KB → 418.7 KB gzip** (−21.5 %). Prefetched
routes: 7 → 1.

### PERF-2 — three.js leaked into the tier-C bundle *(serious)*
`hero-stage.tsx` imported `scrollProgress` from `scene-config.ts`, which imports
three. The fallback path therefore downloaded a 99.9 KB gzip 3D chunk it could
never use.
**Fix.** `scrollProgress` / `clamp01` / `smoothstep` moved to
`components/three/scroll-progress.ts`; `scene-config.ts` re-exports them.
**Measured.** Tier C JS **≈271 KB → 171.5 KB gzip**, and no three.js chunk is
requested at all.

### BUILD-1 — The linter could not start
`npm run lint` crashed with `TypeError: Converting circular structure to JSON`
while validating the config: `eslint-config-next` 16 ships **native flat
configs**, and translating them through `FlatCompat` walked a circular plugin
graph.
**Fix.** `eslint.config.mjs` imports the flat configs directly. The lint gate
actually runs now and surfaced 24 real errors (unescaped apostrophes, an `<a>`
used where `next/link` belongs, React Compiler immutability rules) — all fixed.
Current state: **0 errors, 1 warning** — React Hook Form's `watch()` is not
compiler-safe, so the wizard is not auto-memoised. Acceptable and documented.

---

## 3. Verification evidence

### Content gate
```
Content verification · 74 source files scanned
  PASS  no unqualified claims, no stray tokens, partner metadata intact
Self-test: 9/9 probes pass
```

### Tests
```
 ✓ tests/claims.test.ts (16 tests)
 ✓ tests/lead-schema.test.ts (10 tests)
 Test Files  2 passed (2)      Tests  26 passed (26)
```

### Routes (production build)
`/` `/programs` `/programs/cabin-crew-training` `/placement` `/about` `/campus`
`/contact` `/apply` `/legal` `/legal/privacy-policy`
`/legal/terms-and-conditions` `/legal/refund-and-cancellation` `/legal/disclaimer`
`/sitemap.xml` `/robots.txt` → all 200. `/nope-404` → 404.

### Lead API
| Request | Result |
| --- | --- |
| Valid payload | `201` + reference `FA-261004-SXKC` |
| Missing consent | `422` |
| `GET` | `405` |
| Honeypot filled | `202`, nothing written |
| >5 in 10 min | `429` |

### Accessibility (axe-core 4.10.3, full rule set)
| Route | Violations | Passes |
| --- | --- | --- |
| `/` | 0 | 48–49 |
| `/programs` | 0 | 40 |
| `/programs/cabin-crew-training` | 0 | 41 |
| `/placement` | 0 | 45–47 |
| `/about` | 0 | 40 |
| `/campus` | 0 | 38 |
| `/contact` | 0 | 45 |
| `/apply` | 0 | 42 |
| `/legal`, `/legal/privacy-policy` | 0 | 38 |

Re-audited at **1440 px** and again at **839 px** (where the mobile bar and the
scrollable board are both live) after the final refactors: still 0 violations.

### Forms driven through the interface, not just the endpoint
| Flow | Result |
| --- | --- |
| Enquiry form (`/contact#enquire`) | Submitted in-browser → boarding-pass success stub, reference `FA-261004-SW4V` |
| Application wizard (`/apply`) | Step 1 track → Step 2 details → Step 3 confirm → submitted, reference `FA-261004-QXAN` |
| Sink | Both records present in `.data/leads.jsonl` with `id` = the reference the applicant is shown |
| Honeypot | Submitted and **absent** from the sink |

The candidate quotes a reference on a phone call; the desk searches the sink by
that same reference. That link was verified, not assumed.

### Keyboard
- 66 focusable elements on the homepage; **every one has an accessible name**
- First tab stop is "Skip to content"; `lang="en-IN"`; no positive `tabindex`
- Tab order follows DOM order: skip link → logo → nav → phone → Enquire → Apply → menu
- Mobile drawer: opens with `aria-expanded="true"`, focus moves inside, body
  scroll locks, **Escape closes it and focus returns to the trigger**
- `:focus-visible` ring confirmed present in the compiled stylesheet
  (see limitation L1)

### Responsive — horizontal overflow, all routes
| Viewport | clientWidth | scrollWidth | Offenders |
| --- | --- | --- | --- |
| 320 × 720 | 303 | 303 | none |
| 375 × 812 | 358 | 358 | none |
| 768 × 1024 | 751 | 751 | none |
| 1024 × 900 | 1007 | 1007 | none |
| 1440 × 900 | 1403 | 1403 | none |
| 1920 × 1080 | 1903 | 1903 | none |

Routes swept at 320 px: `/`, `/programs`, `/programs/[slug]`, `/placement`,
`/about`, `/campus`, `/contact`, `/apply`, `/legal/privacy-policy` — all clean.
The departures-board table scrolls horizontally inside its own container, which
is intended.

### Capability tiers
| Tier | Canvas | Render loop | Notes |
| --- | --- | --- | --- |
| A | 1423 × 900 | 61 fps | DPR-capped, no context loss |
| B | 374 × 844 | 61 fps | LOD scene, DPR ≤ 1.25 |
| C | none | — | Poster only, **no three.js request** |

Scroll narrative verified end to end: `--ascent` moves `0.0000 → 1.0000` as the
runway scrolls; 60 fps sustained through a scripted 1.8 s scroll.

### Reduced motion
Stored preference on load and mid-session toggle both yield: no canvas,
`scroll-behavior: auto`, transition durations ~0, **0 elements hidden**.

---

## 4. Accepted limitations

**L1 — `:focus-visible` could not be observed in the preview window.**
`document.activeElement` updates correctly on Tab, but `matches(':focus-visible')`
and even `matches(':focus')` return `false` in this automation window — the
render window has no system focus, so the browser does not apply the focus-visible
heuristic. This is an artefact of the harness, not the site.
*Evidence:* `:focus-visible{outline:2px solid var(--color-amber);outline-offset:3px}`
is present in the compiled stylesheet, and the DOM audit confirms every
interactive element is focusable and named.
*Action:* confirm the ring on a physical keyboard before launch.

**L2 — No third-party accessibility or SEO run.**
axe-core is a rules engine, not a screen-reader test. No Lighthouse, no manual
NVDA/VoiceOver pass, no real-device audit. `PERF_REPORT.md` records the same
limitation for performance.

---

## 5. Not verified (out of scope until client inputs arrive)

- Real lead delivery into a CRM (`LEAD_SINK_URL` is untested end to end)
- Payment flow — **there is no payment flow**; fees are shared at counselling
- Email delivery of application confirmations (the success stub prints the
  reference on screen; no mail is sent)
- CMS editing — there is no CMS
- Multi-language — English only
- Real-device testing on a low-end Android handset