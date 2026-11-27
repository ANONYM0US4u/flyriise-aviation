# CONTENT GUIDE — Flyriise Aviation

How to edit this website without breaking it. Written for the client's marketing
team, not for engineers.

---

## 1. One rule to start with

**Facts live in `data/`. Design lives in `components/`. Never edit a component to
change a sentence.**

Every piece of copy on the site is a value in one of twelve files in
`website/data/`. If you can only edit files in `data/`, you cannot break the
build.

| File | What lives there |
| --- | --- |
| `site.ts` | Name, phone, WhatsApp, email, address, registration, grievance, trust strip, CTAs |
| `home.ts` | Hero headline and copy, positioning section, section framing |
| `programs.ts` | The five tracks: name, duration, summary, curriculum, eligibility, career paths |
| `placement.ts` | Placement statistics, career destinations, hiring partners, disclaimer |
| `training.ts` | The seven stations and the climb narrative |
| `stories.ts` | Student stories and consent state |
| `faqs.ts` | Questions and answers |
| `campus.ts` | Facilities, visiting information, map details |
| `legal.ts` | Privacy policy, terms, refund policy, disclaimer |
| `legal-disclaimer.ts` | The registration/no-accreditation statement |
| `navigation.ts` | Menu labels and footer link groups |

## 2. The claim levels

Every trust-sensitive value carries a `claim` object:

| Status | Means | What the site does |
| --- | --- | --- |
| `verified` | Checked against records the institute holds | Publishes the value with its source and date |
| `reference` | Taken from the client's own public material, not independently checked | Publishes it **labelled** with the source and as-of date |
| `placeholder` | Not supplied | Publishes a visible `[CLIENT INPUT REQUIRED — …]` token in demo mode; **withheld entirely** in production mode |

The pattern to follow:

```ts
duration: "Six months",
durationClaim: {
  status: "reference",
  source: "client public website",
  asOf: "2026-10-04",
} satisfies Claim,
```

When the institute supplies evidence, change `status` to `"verified"`, update
`asOf`, and add a `note` describing what was checked. **The layout does not
change** — the chip, the lamp and the footnote all respond to the status.

## 3. Three things you may not say

These are blocked by `npm run verify:content`, which fails the build:

1. **No outcome guarantee.** "Guaranteed placement", "100% placement", "sure
   success", "guaranteed selection" — unless the sentence negates them
   ("no offer is guaranteed"). The rule is negation-aware.
2. **No unlabelled client-input token.** `[CLIENT INPUT REQUIRED — …]` may only
   appear inside `data/`. It must never leak into a component or a page heading.
3. **No unauthorised partnership.** A career destination may never carry a logo,
   an authorisation reference, or a status other than `PENDING`.

Run `npm run verify:content` after any copy edit. If it fails, the message names
the file and the rule.

## 4. Tone of voice

| Do | Don't |
| --- | --- |
| State a standard: "trained on the standards recruiters screen for" | Promise a result: "get placed with Emirates" |
| Name what is included | Name what the institute cannot control |
| Use plain English for instructions, instrument language for framing | Use aviation jargon as decoration in applicant-facing copy |
| Say "the institute does not publish this yet" | Say nothing, and leave a blank |
| Answer the anxious question directly | Hide behind "it depends" |

Two voices coexist on purpose:

- **Instrument** (B612 Mono, uppercase, `0.18em`) — section codes, timestamps,
  definitions, trust labels: `SEC 02 / POSITIONING`, `VERIFIED`, `FL250`.
- **Plain** (Archivo) — everything a candidate needs to decide.

If you find yourself writing a sentence in the instrument voice that a
17-year-old must act on, rewrite it in plain voice.

## 5. Editing recipes

**Change the hero headline**
`data/home.ts` → `hero.headline` (array of lines — line 1 is the hook, line 2 the
promise). Keep it under about 6 words per line; the type scale is large.

**Publish a placement statistic**
`data/placement.ts` → `placementStatistics[]`. You need: `value`, `placed`,
`total`, `definition`, `cohort`, `asOf`, and `claim.status: "verified"`. Publish
it as `n of N` — never a bare percentage. The departures board picks it up and
renders it automatically.

**Add a hiring partner**
`data/placement.ts` → `hiringPartners[]`. Requires `relationshipType`, a written
authorisation reference and `logoUsageApproved: true`. Without authorisation it
belongs in `careerDestinations` instead (names only, no logo).

**Add a student story**
`data/stories.ts`. Quotes are condensed to 20–220 characters. Set
`consent: "confirmed"` only after written consent is on file. Until then the
story shows a consent-pending line and disappears in production mode.

**Withdraw something the institute no longer stands behind**
Set the value to `null` and change `claim.status` to `"placeholder"`. Never
leave a stale figure visible because removing it "might look odd" — an empty
state with a label is the honest state.

## 6. Content-mode: demo vs production

| `CONTENT_MODE` | Behaviour |
| --- | --- |
| `demo` (default) | Unverified reference content is visible **with** provenance labels; client-input tokens render as labelled placeholders |
| `production` | Unverified partners, statistics and testimonials are **not reachable** from any route |

Preview with `demo`. Launch with `production`. This is the switch that makes the
site defensible, so do not ship with `demo`.

## 7. Checklist before you publish an edit

- [ ] `npm run verify:content` passes
- [ ] Any new factual claim has a `claim` object with a real `source`
- [ ] Nothing implies a guaranteed outcome
- [ ] Any statistic has a definition, a cohort and an as-of date
- [ ] Any name that appears is one the institute can evidence
- [ ] Photographs have consent and are current
- [ ] `CONTENT_MODE=production` for the live build
- [ ] Re-run `npm run check`

## 8. Words we use on purpose

- **"Placement assistance"** — never "placement guarantee". Assistance is real;
  the outcome belongs to the employer.
- **"Awaiting data"** — a metric with no verified number yet. Not "—", not zero.
- **"Destinations, not partnerships"** — the distinction the trust centre exists
  to make.
- **"Shared at counselling"** — for fees, until an effective-from date exists.
- **"Awaiting client input"** — for registration numbers, grievance details and
  hours. Visible honesty beats a plausible guess.