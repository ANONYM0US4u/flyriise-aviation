# PHASE REPORT — Flyriise Aviation

**Phase:** build complete, awaiting client inputs
**Date:** 4 October 2026
**Workspace:** `D:\Freebuff\website`
**Live preview in this session:** `http://localhost:3219`

---

## 1. What was delivered

A premium, mobile-first website for Flyriise Aviation & Hospitality Services —
15 routes, a cinematic scroll-driven 3D hero with three capability tiers, a
complete admissions journey (programmes → placement → enquiry → application),
and a trust layer that makes the site's own honesty visible.

| Area | Result |
| --- | --- |
| Routes | 15 built, all returning expected status codes |
| 3D hero | Dusk apron scene; scroll-driven camera and aircraft departure; tiers A/B/C |
| Fallback | Complete SVG poster at every tier — a finished page, not a degraded one |
| Forms | Enquiry + 3-step application wizard, both verified end to end in the browser |
| Trust layer | Claim metadata on every factual value; mechanical gate in CI |
| Accessibility | **0 axe-core violations** across 9 audited routes at 1440 px and 839 px |
| Performance | **171.5 KB gzip** on the fallback path; 418.7 KB with 3D; CLS 0, 60 fps |
| Quality gates | typecheck clean · lint 0 errors · 26 tests · content gate PASS · build clean |
| Working documents | 12 in `docs/`, plus this report |

---

## 2. Verification evidence

```
tsc --noEmit                 clean
eslint                       0 errors, 1 documented warning (RHF compiler-safe)
vitest                       26 passed (2 files)
verify-content               74 files scanned — PASS
verify-content --self-test   every rule rejects a planted violation
next build                   15 routes compiled
curl route sweep             15 × 200, /nope-404 → 404
POST /api/lead               201 · 422 (no consent) · 422 (bad phone)
                             405 (GET) · 413 (oversize) · 202 (honeypot, unwritten)
Security headers             CSP, HSTS, nosniff, DENY, Referrer-Policy, Permissions-Policy
Browser                      1440 / 1920 / 1024 / 768 / 375 / 320 — no horizontal overflow
axe-core 4.10.3              0 violations, 9 routes, 2 viewports
Forms in-browser             enquiry → FA-261004-SW4V · application → FA-261004-QXAN
```

---

## 3. Defects found and fixed this phase

Twenty in total; three were serious enough to name here.

**CSP-1 — the site was completely inert in production.** The shipping
Content Security Policy used `'strict-dynamic'` with a nonce, but the Turbopack
builder attaches **no nonce to its own script tags**, so every chunk and every
inline bootstrap was blocked. The page rendered and did nothing — no hydration,
no forms, no 3D. Fixed to `script-src 'self' 'unsafe-inline'` with the nonce
still generated and forwarded, so the strict policy is a one-line upgrade later.

**MOTION-1 — reduced-motion visitors lost most of the page.** `Reveal` marked
below-the-fold sections hidden during the first mount; the motion preference only
resolves after mount; when motion was then reduced, the observer returned early
and **28 elements stayed at opacity 0**. A visitor with reduced motion enabled —
or anyone who used the in-page toggle — would have seen a mostly blank page.
Fixed, verified both ways (stored preference and mid-session toggle).

**RENDER-1 — a canvas crash took the whole hero down.** A gradient stop computed
at `1.12` (outside the legal `0…1` range) raised `IndexSizeError`. Clamped.

Also fixed: 320 px header overflow; a stat row overflowing at 320 px; two
`cn()` cascade bugs that silently dropped responsive and colour overrides;
two contrast-token failures (3.6:1 faint labels, 1.5:1 accent on light surfaces);
a landmark nesting error; two more contrast misses; a non-keyboard-scrollable
data table; a mobile bar outside the landmark structure; and a lint
configuration that could not start at all.

Full detail, evidence and reproduction steps: `QA_REPORT.md`.

---

## 4. Two performance wins, measured

| Change | Before | After | Effect |
| --- | --- | --- | --- |
| Disable route prefetch | 533.4 KB gzip homepage JS | **418.7 KB** | −114.7 KB (−21.5 %); prefetched routes 7 → 1 |
| Remove three.js from the fallback graph | ≈271 KB on tier C | **171.5 KB** | −99.5 KB; tier C now requests **zero** 3D chunks |

The second one is the structural fix: the hero stage read scroll state from the
scene config, which imports three — so phones that would never create a WebGL
context were still downloading the engine. Moving three-free helpers into their
own module removed it from that path entirely.

Against the brief's 450 KB budget for the 3D layer: **247.3 KB used (55 %)**,
with no model files, no HDRI, no post-processing.

---

## 5. What the client should look at first

1. **`?tier=C` on a phone** — the experience 70 % of visitors will actually get.
   It is deliberately complete: same headline, same CTAs, same trust strip.
2. **The trust centre** (`/legal`) — it is unusual to see a training institute
   publishing its own gaps. That is the point, and it should be a conscious
   decision before launch, not a surprise.
3. **The departures board** — every metric currently reads `AWAITING DATA`.
   Supply the numbers with their methodology (`INPUTS_NEEDED.md` A4) and it
   publishes itself, with no redesign.
4. **`/apply`** — the boarding-pass application flow, submitted end to end.

---

## 6. Honest limitations

- **No throttled performance run.** No CDP network emulation in this harness, so
  the Core Web Vitals figures are localhost measurements. The network projection
  in `PERF_REPORT.md` §6 is arithmetic on measured bytes and is labelled as such.
- **No Lighthouse, no real device, no screen-reader pass.** axe-core is a rules
  engine; it does not replace a human with NVDA or a mid-range Android handset.
  Both are on the pre-launch checklist.
- **`:focus-visible` could not be observed** in the preview window (the render
  window has no system focus). The rule is confirmed present in the compiled
  CSS, and every focusable element is named and in DOM order — but confirm the
  ring on a physical keyboard before launch.
- **Content is reference-grade, not verified.** Every factual value is marked
  `reference` with a source and date. Nothing has been treated as verified
  because verification is the client's to perform.
- **One lint warning remains by design** — React Hook Form's `watch()` is not
  React-Compiler-safe, so the wizard is not auto-memoised. Harmless at this size,
  documented rather than silenced.

---

## 7. What the client must supply, and who owns what

**Blocking launch:** registration details (CIN/GSTIN) · grievance officer and
response window · business hours · placement statistics with methodology · fee
structure and refund terms · story consent · logo and photography.
Full list with exact destinations: `INPUTS_NEEDED.md`.

**Decisions only the client can make:** twelve questions, each with a default
and a recommendation: `OPEN_QUESTIONS.md`.

**Counsel:** four legal drafts are written and marked as drafts. They are an
engineering readiness document, not legal advice: `LEGAL_REVIEW.md`.

---

## 8. Handover

| Document | What it is for |
| --- | --- |
| `PLAN.md` | Scope, phases, constraints, definition of done |
| `DESIGN_PLAN.md` | Tokens, type, motion, 3D art direction, component language |
| `DECISIONS.md` | 17 decisions with the road not taken |
| `CONTENT_GUIDE.md` | How to edit copy without breaking anything |
| `INPUTS_NEEDED.md` | Exactly what to send, and where each value lands |
| `OPEN_QUESTIONS.md` | Twelve decisions, each with a recommendation |
| `ASSETS.md` | Asset specifications and the rights checklist |
| `QA_REPORT.md` | Every defect, the fix, and the verification evidence |
| `PERF_REPORT.md` | Measured weights, CWV, tier behaviour, CDN checklist |
| `LEGAL_REVIEW.md` | Compliance readiness and the gaps to counsel |
| `DEPLOY.md` | Hosting, environment, launch checklist, rollback |
| `PROGRESS.md` | Build log and the fastest way to continue |

**Run it:**
```bash
cd D:\Freebuff\website
npm install
npm run check       # typecheck + lint + tests + content gate
npm run build && npm start
```

Set `CONTENT_MODE=production` for the live site. Until the client inputs land,
the site runs in `demo` mode, where unverified content is visible but labelled
— which is the correct state for a preview and the wrong state for a launch.