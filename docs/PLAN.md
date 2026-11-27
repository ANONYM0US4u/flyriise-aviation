# PLAN — Flyriise Aviation & Hospitality Services

Working plan for the website build, written to
`aviation_premium_website_ai_build_brief_v2.md`. Status as of **4 October 2026**.

---

## 1. What this is

A premium marketing and admissions website for Flyriise Aviation & Hospitality
Services (Barrackpore, Kolkata) — built mobile-first, cinematic where the device
allows, and honest everywhere else.

Two audiences, in priority order:

1. **A 17–24 year-old candidate in India on a mid-range Android phone**, on
   mobile data, deciding within seconds whether this institute is worth a call.
2. **A parent or counsellor on a laptop**, looking for registration details,
   placement evidence and fee transparency.

Every design decision below serves those two.

## 2. Non-negotiable constraints

| Constraint | How it is honoured |
| --- | --- |
| Premium look and feel | One design system, one accent, engineering-drawing language, generous type scale |
| Must load on mid-range phones | 3D is code-split and tier-gated; tier C ships **171 KB gzip** of JS with zero WebGL |
| 3D as enhancement, never a gate | The poster is the first paint at every tier; identical content, no blank hero |
| No invented business facts | Every factual string carries claim metadata; `npm run verify:content` fails the build on unlabelled claims |
| Honest trust layer | Unverified values render as instrument states ("awaiting data"), never as numbers |
| Working forms | Zod-validated on both ends, honeypot, rate limit, mock sink or CRM webhook |
| Work stays in `D:\Freebuff` | Everything written under `website/` |

## 3. Phases

### Phase 0 — Reconnaissance *(done)*
Brief read end to end. Dependency versions pinned to the brief's list. Project
scaffolded with Next.js 16 (App Router, Turbopack), Tailwind v4, TypeScript
strict.

### Phase 1 — Foundation *(done)*
Design tokens (`app/globals.css`), typography, layout primitives, container
rules, focus system, motion kill-switch. Claim system (`lib/claims.ts`) and
content gate (`lib/content-mode.ts`) built **before** any copy was written, so
every string is written through the trust layer.

### Phase 2 — Content model *(done)*
All copy lives in `data/*.ts` — never inside components. Nine data modules:
site, navigation, programs, placement, stories, faqs, training, campus, home,
legal, legal-disclaimer. Values that the client has not supplied are `null` with
a visible token (`[CLIENT INPUT REQUIRED — …]`), never a plausible guess.

### Phase 3 — 3D system *(done)*
three.js scene built from scratch: aircraft, apron, atmosphere, scroll-driven
camera flight. Capability tiers A/B/C, poster fallback, context-loss handling,
reduced-motion path.

### Phase 4 — Pages *(done)*
Homepage (9 sections), programmes index + 5 detail pages, placement, about,
campus, contact, apply (3-step wizard), legal index + 4 documents, sitemap,
robots, error and not-found.

### Phase 5 — Forms *(done)*
Enquiry form and the boarding-pass application wizard, both wired to
`POST /api/lead` with server-side re-validation, honeypot, rate limiting and a
pluggable sink.

### Phase 6 — Verification *(done — see QA_REPORT.md, PERF_REPORT.md)*
Content verification, unit tests, type check, production build, route smoke
tests, responsive matrix, axe-core audit, keyboard paths, tier and reduced-motion
checks, bundle and Core-Web-Vitals measurement.

### Phase 7 — Client inputs *(blocked on client)*
See `INPUTS_NEEDED.md` and `OPEN_QUESTIONS.md`. Nothing else in the build is
waiting; these are content and policy decisions only.

### Phase 8 — Launch *(blocked on client + hosting)*
See `DEPLOY.md`.

## 4. Information architecture

```
/                     Narrative home: hero → positioning → programmes →
                      training → placement → evidence → stories → campus → CTA
/programs             Track index with tabbed detail (server-rendered)
/programs/[slug]      Per-track page: curriculum, eligibility, career paths
/placement            Method, departures board, destinations, stories
/about                Institute, team, FAQ
/campus               Facilities, plan view, visiting
/contact              Enquiry form, contact routes, grievance
/apply                3-step application wizard (boarding-pass styling)
/legal                Trust centre: registration, grievance, legal index
/legal/[doc]          privacy-policy · terms-and-conditions ·
                      refund-and-cancellation · disclaimer
/api/lead             POST only — validated lead intake
```

## 5. Capability tiers (brief §07A)

| Tier | Trigger | Behaviour |
| --- | --- | --- |
| A | Desktop-class GPU, ≥5 cores, >4 GB, DPR ≤ 3 | Full scene, DPR ≤ 2 |
| B | Phone, coarse pointer, or modest desktop | LOD scene, DPR ≤ 1.25, no post-processing |
| C | No WebGL · reduced motion · Save-Data · ≤2 GB RAM + ≤380 px · forced via `?tier=C` | Poster only — **no three.js download at all** |

## 6. Risk register

| Risk | Mitigation | Status |
| --- | --- | --- |
| Mid-range phone cannot afford 3D | Tiering + poster + three.js fully code-split | Measured: 171 KB gzip tier C |
| WebGL context lost mid-session | Error boundary → poster, event preserved | Verified in code path |
| Client publishes unverifiable stats | Claim gate + `verify:content` in CI | Enforced |
| Legal pages written without counsel | Draft watermark + `LEGAL_REVIEW.md` | Drafted, needs counsel |
| CSP blocks the app | Tested policy, documented, nonce ready for upgrade | Verified in production build |

## 7. Definition of done

- [x] `npm run typecheck` clean
- [x] `npm run test` — 26 passing
- [x] `npm run verify:content` — 74 files scanned, PASS
- [x] `npm run build` — 15 routes
- [x] axe-core: 0 violations on all 9 audited routes
- [x] No horizontal overflow 320 → 1920
- [x] Forms verified end to end (201 / 422 / 405 / honeypot)
- [ ] Client inputs supplied (`INPUTS_NEEDED.md`)
- [ ] Legal review signed off (`LEGAL_REVIEW.md`)
- [ ] Domain + hosting live (`DEPLOY.md`)