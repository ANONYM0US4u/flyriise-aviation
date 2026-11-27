# INPUTS NEEDED — Flyriise Aviation

Everything the build needs from the client before launch. Each item names **the
exact field** it fills, so nothing has to be interpreted or re-found later.

Rule for the whole document: **supply the record, not the summary.** A
screenshot of a certificate is not an affiliation claim; a WhatsApp forward is
not a statistic.

---

## A. Blocking — the site cannot go live honestly without these

### A1. Institute registration
**Lands in:** `data/site.ts` → `registration.cin`, `registration.gstin`
- CIN (exact, as printed on the certificate)
- GSTIN, if the institute is registered
- Date of incorporation
- A copy of the certificate for our records

*Until supplied, the site says only what the client publishes publicly: "a
registered private limited company". No accreditation, affiliation or DGCA claim
is made anywhere.*

### A2. Grievance officer (mandatory for a consumer-facing Indian site)
**Lands in:** `data/site.ts` → `grievance.*`
- Name and designation
- Email
- Phone
- The acknowledgement/resolution window the institute commits to
  (e.g. "acknowledged within 48 hours, resolved within 15 days")

### A3. Business hours and admissions desk timing
**Lands in:** `data/site.ts` → `contact.hours.value`
- Which days the desk is open
- Opening and closing times
- Whether Saturdays are open, and whether walk-ins need an appointment

### A4. Placement statistics — the methodology contract
**Lands in:** `data/placement.ts` → `placementStatistics[]`
For **each** metric the institute wants published:
- Metric name
- Definition (what counts as "placed": written offer accepted? offer accepted
  *and* joined?)
- Cohort / batch convention
- Measurement period (e.g. Apr 2023 – Mar 2026)
- Numerator and denominator (`n of N` — never a bare percentage)
- The documents held that prove it (offer letters, recruiter confirmations)
- Date last verified

*The departures board already renders any metric supplied here automatically —
no redesign, no copy rewrite. Until then every row reads `AWAITING DATA`.*

### A5. Hiring-partnership authorisation (only if the institute wants one)
**Lands in:** `data/placement.ts` → `hiringPartners[]`
- Organisation name
- Exact relationship wording ("recruitment partner", "refers candidates",
  "placement support")
- Written authorisation on letterhead, retained by the institute
- Logo file **plus** written permission to use it

*The site deliberately keeps career destinations and hiring partners as two
separate lists. Destinations are names only; partners need proof.*

### A6. Fee structure and batch calendar
**Lands in:** `data/programs.ts` → per-programme `fees`, plus
`data/site.ts` → batch dates
- Fee per programme, per term or per batch
- Instalment options
- Next batch start date and application deadline
- What the fee includes and excludes

*Fees are shared at counselling by design (no stale published figures). If the
client wants published fees, supply them here with an "effective from" date.*

---

## B. Required before the claim layer can go live

### B1. Contact details confirmation
Phone, WhatsApp number, email, address — all currently marked `reference`
(sourced from the client's public website, as of 2026-10-04). Confirm or correct.
**Also supply the postal code**, which is deliberately `null` rather than guessed.

### B2. Student story consent
**Lands in:** `data/stories.ts` → `consent`
For each of the four published stories:
- Written consent from the named candidate
- Confirmation the role and employer are current
- Permission to publish the photograph (or confirmation there is none)

*Stories render with a consent-pending line until confirmed.*

### B3. Career destination freshness
Two entries need a decision (see `OPEN_QUESTIONS.md` Q6):
- **Vistara** — merged into Air India. Keep, replace, or remove?
- **GoFirst** — ceased operations. Keep as historical record or remove?

---

## C. Content confirmation

### C1. Programme facts
**Lands in:** `data/programs.ts`
- Exact programme names (currently the client's published wording)
- Duration per programme (two are currently "on request")
- Eligibility per programme
- Curriculum module list per programme
- Minimum age, and whether male candidates are accepted per track

### C2. Faculty and trainers
**Lands in:** `data/about.ts` (new module) or the existing about content
- Names, roles, and aviation/hospitality background
- Which programmes each one teaches
- Consent to publish photographs

*Currently the site speaks of practitioner-led training without naming anyone —
deliberately.*

### C3. Facilities
**Lands in:** `data/campus.ts`
- Room-by-room list replacing the activity-based descriptions
- Which rooms can be photographed, and when they are free
- Capacity per room / per batch

### C4. FAQ answers that only the institute can answer
- Documents required at admission, and any medical/fitness test
- Class size caps
- Whether training includes uniforms, grooming kits or travel
- Refund and rescheduling policy specifics (feeds `legal/refund-and-cancellation`)

---

## D. Assets (specifications in `ASSETS.md`)

| # | Asset | Why | Priority |
| --- | --- | --- | --- |
| D1 | Logo files (SVG + PNG, light and dark) | Replace the concept mark | High |
| D2 | Campus photographs — exterior, classroom, grooming studio, interview room | Replaces two image slots | High |
| D3 | Programme photography (one per track) | Programme pages currently use drawn scenes | Medium |
| D4 | Founder / trainer portrait (with consent) | About page | Medium |
| D5 | Official brand colour value, if the client has one | Confirm or keep the amber | Low |
| D6 | Brochure PDF (for a download link, if wanted) | Admissions aid | Low |

---

## E. Access the team needs

| # | Item | Used for |
| --- | --- | --- |
| E1 | Domain DNS access | `DEPLOY.md` — point the domain at the host |
| E2 | Google Business Profile ownership | Map links, consistent NAP data |
| E3 | Existing analytics or tag manager account, if wanted | Deferred by default: the site ships **no third-party scripts** |
| E4 | A decision on the lead sink | `LEAD_SINK_URL` — CRM/webhook, or the included file sink for the pilot period |

---

## F. How to hand these over

Email replies are fine for text. For documents, anything readable works
(PDF, photo of the certificate, spreadsheet) — we transcribe, and every
transcription is read back to the client for confirmation before it is published.

**Nothing on this list blocks design or engineering.** The build is complete and
running in demo mode; these inputs convert it from a preview into a live site.