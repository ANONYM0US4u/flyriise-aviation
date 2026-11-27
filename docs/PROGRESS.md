# PROGRESS — Flyriise Aviation

Build log. Updated **4 October 2026**.

---

## Status at a glance

| Area | State |
| --- | --- |
| Design system | ✅ complete |
| Content model + claim layer | ✅ complete |
| 3D hero (tiers A/B/C) | ✅ complete |
| All 15 routes | ✅ complete |
| Forms + lead API | ✅ complete |
| Accessibility | ✅ zero axe violations, 9 routes |
| Responsive 320 → 1920 | ✅ no overflow anywhere |
| Performance | ✅ 171.5 KB gzip on the fallback path |
| Verification suite | ✅ 26 tests · content gate PASS · typecheck clean |
| Client content inputs | ⏳ **blocked on client** — `INPUTS_NEEDED.md` |
| Legal sign-off | ⏳ **blocked on counsel** — `LEGAL_REVIEW.md` |
| Deployment | ⏳ **blocked on domain + hosting** — `DEPLOY.md` |

The build is finished. What remains is content, policy and infrastructure —
none of it code.

---

## Phase log

### Phase 0 — Reconnaissance
Brief read in full; dependency set pinned to the brief's list; Next.js 16 +
Tailwind v4 + TypeScript strict scaffolded. GSAP and framer-motion deliberately
dropped (see `DECISIONS.md` D-07).

### Phase 1 — Foundation
Design tokens, type scale, container rules, focus system, motion kill switch.
**Key decision:** the claim system (`lib/claims.ts`) and content gate
(`lib/content-mode.ts`) were built *before* any copy, so every string was
written through the trust layer rather than retrofitted.

### Phase 2 — Content model
Twelve data modules in `data/`. Unverified values are `null` with visible
`[CLIENT INPUT REQUIRED — …]` tokens. Career destinations and hiring partners
modelled as separate types.

### Phase 3 — 3D system
`aircraft`, `apron`, `atmosphere`, `hero-scene`, `hero-canvas`, `hero-poster`,
`scene-config`. Tier detection, poster fallback, context-loss handling, scroll
narrative driven by a single value.

### Phase 4 — Pages
Homepage (9 sections), programmes index + 5 detail routes, placement, about,
campus, contact, apply, legal index + 4 documents, sitemap, robots, error,
not-found.

### Phase 5 — Forms
Enquiry form + 3-step boarding-pass application wizard. `POST /api/lead` with
Zod re-validation, 8 KB cap, honeypot, rate limit, pluggable sink.

### Phase 6 — Verification *(this session)*
Full audit and remediation pass, continued into a second and third round.
Twenty-three defects found and fixed, including four critical or serious ones:

- **CSP-1** — the security policy blocked *all* JavaScript in the production
  build; the page rendered completely inert.
- **RENDER-1** — a canvas gradient stop outside `0…1` crashed the hero.
- **MOTION-1** — reduced-motion visitors had 28 sections stuck at `opacity: 0`,
  i.e. most of the homepage invisible.

Plus the accessibility remediation (contrast tokens, landmark structure,
surface-aware accent) and the two performance wins (prefetch off, three.js out
of the fallback bundle).

Round two fixed two defects a client report surfaced: a Content Security Policy
that broke `npm run dev` entirely (CSP-2), and the hero's supporting paragraph
sitting directly on top of the aircraft takeoff (HERO-1). Round three compacted
the hero after that moved the crowding into view — at 320×720 the sticky hero
was clipping 185 px of its own content, including the trust strip (LAYOUT-5).

Full detail and evidence: `QA_REPORT.md`, `PERF_REPORT.md`.

### Phase 7 — Client inputs ⏳
Waiting on: registration details, grievance officer, business hours, placement
statistics with methodology, fee structure, story consent, facility details.
**Nothing in the build is blocked by this.**

### Phase 8 — Launch ⏳
Waiting on: domain DNS, hosting decision, counsel sign-off, and switching
`CONTENT_MODE=production`.

---

## Running the project

```bash
npm install
npm run dev            # development
npm run build && npm start
npm run check          # typecheck + lint + tests + content gate
```

| Script | Purpose |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | vitest (26 tests) |
| `npm run verify:content` | Claim/token/partner gate over 74 files |
| `npm run verify:content:self-test` | Proves the gate catches violations (9 probes) |
| `node scripts/report-bundles.mjs` | Chunk size analysis by dependency |
| `bash scripts/dev-restart.sh <port>` | Kill, typecheck, build, start, probe |

> On this host `PORT=0` is set in the environment, so `npm start` picks a random
> port unless one is passed explicitly. Always start through
> `scripts/dev-restart.sh <port>`.

---

## File map

```
app/            routes, layout, API, metadata, error boundaries
components/
  forms/        enquiry form, application wizard, field primitives
  home/         homepage sections
  motion/       reveal, motion provider, toggle, tier detection
  placement/    departures board, partners manifest, placement section
  programs/     programme scenes
  site/         header, footer, mobile action bar, logo
  three/        the 3D layer + scroll-progress
  ui/           button, section, chips, icons, image slot, legal text
data/           all copy and claims
lib/            claims, content mode, contact, lead schema/sink, rate limit,
                seo, utils
scripts/        verify-content, report-bundles, dev-restart
tests/          claims + lead schema
docs/           these documents
```

---

## Photography (added October 2026)

The client supplied nine campus photographs (`website/pictures/`). All nine are
wired into the site through `next/image` (AVIF → WebP, `sizes` per usage, aspect
ratio reserved by the frame so CLS stays at 0), plus one licensed stock image for
the closing CTA band:

| Where | Image |
| --- | --- |
| `/campus` slots 1–2 | reception-hall, training-session |
| `/campus` slots 3–4 | mock-interview, counselling-desk |
| `/campus` slots 5–6 | theory-room, admissions-corner |
| `/campus` slot 7 | campus-banner |
| Placement section (home + `/placement`) | placement-board |
| `/about` aside | candidate-desk |
| Closing CTA band (decorative) | atmosphere-tarmac (Unsplash) |

Provenance, dimensions and the consent/rights checklist are tracked in
`docs/ASSETS.md`. Originals kept in `website/pictures/`; served copies live in
`website/public/images/`.

---

## Next session — the fastest way to continue

1. Client replies to `INPUTS_NEEDED.md` → fill `data/*.ts` only, run
   `npm run verify:content`
2. `CONTENT_MODE=production` → confirm unverified content disappears as designed
3. Re-run `npm run check` and one axe pass over the changed routes
4. Follow `DEPLOY.md`