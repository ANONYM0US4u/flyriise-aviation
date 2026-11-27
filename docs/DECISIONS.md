# DECISIONS — Flyriise Aviation

Architecture and design decisions taken during the build, with the reasoning and
the road not taken. Written so a future maintainer does not "fix" a deliberate
choice by accident.

---

## D-01 — Content lives in `data/*.ts`, never in components
**Decision.** Every factual string sits in a typed data module; components
render props and never hard-code copy.
**Why.** The brief forbids inventing business facts and requires claims to be
auditable. Copy inside components makes auditing impossible.
**Cost.** Slightly more plumbing. **Benefit.** `verify-content.mjs` can scan data
files mechanically, and a client editor never touches a component.

## D-02 — A claim system before any copy was written
**Decision.** `lib/claims.ts` defines `Claim` / `ClaimStatus` /
`HiringPartner` / `PlacementStatistic`, and every trust-sensitive value carries
one. Unverified values are `null` plus a visible `[CLIENT INPUT REQUIRED — …]`
token.
**Why.** Retro-fitting provenance onto finished marketing copy is where sites
start making promises nobody checked.
**Rejected.** A CMS integration — it would add a vendor and a login before we
knew what the client actually needs to edit.

## D-03 — `CONTENT_MODE=demo | production` as a hard gate
**Decision.** `lib/content-mode.ts` reads the environment variable. In demo mode
unverified reference content renders *with* provenance labels; in production it
is withheld entirely.
**Why.** The preview must be honest and complete enough to judge. The live site
must be defensible. One flag, two correct behaviours.
**Evidence.** `scripts/verify-content.mjs` fails when a client-input token
escapes into `data/`, or when an unnegated claim phrase appears in source.

## D-04 — three.js, no game engine, no glTF
**Decision.** The aircraft, apron, atmosphere and camera are authored in code.
**Why.** The whole 3D layer is ~247 KB gzip and loads as two chunks. A glTF
aircraft with PBR materials would have been 2–4 MB before optimisation — the
single largest risk to the "must load on phones" requirement.
**Cost.** The aircraft is stylised, not photoreal. **Mitigation.** The art
direction treats it as a dusk silhouette against a lit sky, where the stylisation
reads as intentional.

## D-05 — Tier A/B/C with the poster as first paint
**Decision.** `use-tier.ts` resolves a capability tier from WebGL support, Save-Data,
device memory, core count, pointer type and screen size. `hero-stage.tsx` renders
the SVG poster first and only mounts the canvas when a tier allows it, fading it
in once the scene has actually rendered.
**Why.** "3D as enhancement" only means something if the non-3D path is genuinely
finished. It is: same headline, same CTAs, same trust strip, same art direction.
**Measured.** Tier C ships **171.5 KB gzip** of JS and never downloads three.js.

## D-06 — Scroll drives one value, not a state machine
**Decision.** `scroll-progress.ts` exports a single mutable `scrollProgress`
object; camera, aircraft and atmosphere sample from it every frame.
**Why.** One value means the 3D layer cannot desynchronise from the DOM, costs
nothing to maintain, and is trivially killable.
**Rule.** Scene files may read `scrollProgress.current`; they may not subscribe
to scroll events.

## D-07 — No GSAP, no framer-motion
**Decision.** Native Web Animations / CSS transitions only.
**Why.** The pinned dependency list excludes them, and neither is needed: the
scroll narrative is a value read in `useFrame`, and section reveals are a CSS
transition triggered by an IntersectionObserver. A 30–70 KB dependency would have
been paid by every phone for animation we can express in 40 lines.

## D-08 — Route prefetch disabled site-wide
**Decision.** `Action` takes `prefetch` and defaults to `false`; header, footer
and section links pass `prefetch={false}` explicitly.
**Why.** Next's automatic prefetch pulled the conversion routes' client chunks
into the homepage's first load — including the form engine, 223 KB gzip, for
visitors who may never open a form.
**Measured.** Homepage JS fell from **533.4 KB → 418.7 KB gzip** (desktop) with
identical behaviour. The trade — a ~1 s route fetch on 4G — is the right one when
most sessions stay on the homepage.

## D-09 — `three` removed from the hero's module graph
**Decision.** `scrollProgress`, `clamp01` and `smoothstep` moved to
`components/three/scroll-progress.ts`; `scene-config.ts` re-exports them for the
scene files.
**Why.** `hero-stage.tsx` needs scroll state even when no canvas is ever created.
Importing it from `scene-config` dragged three.js (99.9 KB gzip) into the tier-C
bundle. One small module removed an entire engine from the fallback path.

## D-10 — CSP without `strict-dynamic`
**Decision.** `script-src 'self' 'unsafe-inline'`, no nonce in the source list,
with the nonce still generated and forwarded as an `x-nonce` request header.
**Why.** Turbopack emits **zero** `nonce` attributes on its own script tags
(verified: `grep -c 'nonce="' → 0`). `'strict-dynamic'` blocked every chunk and
every inline bootstrap — the page rendered completely inert. Adding a nonce to
the list alongside `'unsafe-inline'` does not help either: browsers ignore
`'unsafe-inline'` when a nonce or hash is present, and no nonce exists to match.
**Upgrade path.** When the builder attaches nonces, switch the list to
`'nonce-…' 'strict-dynamic'` — the value is already threaded through.
**Development differs deliberately.** `'unsafe-eval'` is appended to `script-src`
when `NODE_ENV !== "production"`, because React's development build calls
`eval()` to reconstruct call stacks; without it `npm run dev` throws and
hydration dies. The production policy is unchanged and still blocks `eval`
(verified on both servers — see `QA_REPORT.md` CSP-1 and CSP-2).

## D-11 — `cn()` merges `display` and `color` conflicts
**Decision.** The class joiner behaves like `tailwind-merge` for exactly two
properties, with everything else passed through untouched.
**Why.** CSS source order decides conflicts, not class-attribute order. A
component's base `inline-flex` was beating a caller's `hidden`; a base
`text-steel-deep` was beating a caller's `text-graphite` and dropping a
light-surface footnote to 2.5:1 contrast. Both are regression-tested.
**Rejected.** Pulling in `tailwind-merge` — ~10 KB for a problem with two cases.

## D-12 — Accent colour is surface-aware in CSS, not per-component
**Decision.** `Section` emits `data-surface`, and one unlayered rule re-tints
`.text-amber` to `--color-amber-ink` on light surfaces.
**Why.** Amber measures 1.5:1 on cloud. Threading a `tone` prop through every
chip, marker and label would have been error-prone; the fix has to be
unconditional to be trustworthy. It must sit outside `@layer components` because
Tailwind's utilities layer outranks any selector specificity there.

## D-13 — Forms: Zod on both sides, honest error surfaces
**Decision.** The client validates with the same Zod schema the server imports;
the server re-validates independently, caps the body at 8 KB, silently accepts
honeypot hits with `202`, and rate-limits to 5 requests / 10 minutes / IP.
**Why.** Client validation is a UX feature; server validation is the security
feature. Sharing the schema avoids drift, and the re-validation proves it.
**Honeypot returns 202, not 400** — telling a bot it was detected is free
optimisation for whoever is running it.

## D-14 — Lead sink is pluggable
**Decision.** `lib/lead-sink.ts` writes newline-delimited JSON to
`./.data/leads.jsonl` (gitignored) unless `LEAD_SINK_URL` is set, in which case it
POSTs there.
**Why.** The client should be able to run the site on day one without a CRM, and
switch to their CRM on day two without a code change. The file path is built
with a static `path.join` precisely so Turbopack does not trace the whole project
directory into the server bundle.

## D-15 — Destination ≠ partner, enforced in code and tests
**Decision.** `careerDestinations` and `hiringPartners` are separate types.
Destinations carry `relationshipType: "STUDENT_CAREER_DESTINATION"`,
`verificationStatus: "PENDING"`, no logo and no authorisation reference. Tests
fail if a destination is promoted without evidence.
**Why.** "Our students work at Emirates" and "Emirates is our hiring partner" are
different claims with different legal weight. A logo wall implies the second.

## D-16 — Draw, don't photograph (for now)
**Decision.** Programme scenes, the campus plan and the hero fallback are drawn in
SVG/CSS. Photography slots exist and are labelled, but nothing is faked with
placeholder imagery.
**Why.** Generic stock aviation photography is the fastest way to look cheap, and
the client has not supplied real photography yet. Drawn scenes stay consistent
with the palette and can be replaced one at a time when assets arrive.

## D-17 — Content gate runs in CI, not at deploy
**Decision.** `npm run verify:content` is part of `npm run check`, not a manual
step; `scripts/dev-restart.sh` runs typecheck + build + smoke probe.
**Why.** A gate nobody runs is decoration. Four content rules (R1 tokens, R2
claim language, R3 token leakage, R4 partner metadata) fail the build, and the
script self-tests its own rules so a broken rule cannot pass silently.