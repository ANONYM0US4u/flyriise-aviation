# LEGAL REVIEW — Flyriise Aviation

**Status: engineering review complete. Indian legal sign-off outstanding.**
This document records what the code and copy already do, what is drafted, what
is deliberately missing, and what a lawyer should check before launch. It is
written by the build team, not by counsel — it is an engineering readiness
document for counsel, and it is not legal advice.

---

## 1. Documents published

| Document | Route | State |
| --- | --- | --- |
| Privacy Policy | `/legal/privacy-policy` | Drafted, marked as requiring review |
| Terms & Conditions | `/legal/terms-and-conditions` | Drafted, marked as requiring review |
| Refund & Cancellation Policy | `/legal/refund-and-cancellation` | Drafted with explicit gaps the client must fill |
| Disclaimer | `/legal/disclaimer` | Drafted |
| Trust centre (index) | `/legal` | Registration, grievance, document status |

Every legal page renders a **draft status chip** in the interface, so no one can
mistake the current text for counsel-approved wording.

## 2. Applicable frameworks (engineer's reading — confirm with counsel)

| Instrument | Why it applies |
| --- | --- |
| Consumer Protection Act 2019 & E-Commerce Rules | The site takes enquiries and applications online and solicits consumers for a paid service |
| Information Technology Act, 2000 | Website operation, intermediary obligations |
| Digital Personal Data Protection Act, 2023 | Personal data of prospective students (name, contact, programme of interest) |
| Companies Act, 2013 | Registered private limited company making claims about itself |
| Consumer Protection (Advertising) Rules / CCPA guidelines on misleading advertising | Outcome claims, affiliation claims, comparative claims |
| Sector rules (DGCA / hospitality bodies) | Only if the institute claims regulator recognition — it currently claims none |

## 3. Already implemented in the build

### 3.1 Grievance officer (Consumer Protection Act 2019, s.35 read with the
E-Commerce Rules) — **placeholder, must be filled**
The trust centre, contact page and footer carry the grievance officer's name,
designation, email, phone and an acknowledgement/resolution window. Every field
is a labelled `[CLIENT INPUT REQUIRED — …]` token in demo mode and is **absent**
in production mode. This is a statutory disclosure; the site cannot launch
without it (`INPUTS_NEEDED.md` A2).

### 3.2 Business identification and contact details
Legal name, entity type, address, phone, email and a map link are published.
CIN and GSTIN are published only once supplied. The disclaimer page states
plainly that registration and accreditation documents have not been provided for
publication, so no such claim is made.

### 3.3 No misleading outcome claims — enforced mechanically
`scripts/verify-content.mjs` rule **R2** scans every source file for banned claim
language ("guaranteed placement", "100% placement", "sure success", …). A match
is only allowed inside a negation ("no offer is guaranteed"). This is a build
gate, not a review step — the claim discipline is enforced by CI.

### 3.4 No unauthorised partnerships — enforced mechanically
Rule **R4** and the unit tests require that career destinations carry
`relationshipType: "STUDENT_CAREER_DESTINATION"`, `verificationStatus:
"PENDING"`, no logo and no authorisation reference. Logos appear only for
entities with written authorisation. The site states in copy that destinations
are not partnerships.

### 3.5 Statistics discipline
Every placement metric requires a definition, cohort, period, numerator and
denominator before it may be published, and is rendered as `n of N` — never a
bare percentage. Ratios are validated in tests (`placed ≤ total`, no
future-dated records, no skewed values).

### 3.6 Consent for testimonials
Student stories carry `consent: "confirmed" | "pending"`. All four currently sit
at `pending`, render a visible consent-pending line, and are withheld in
production mode.

### 3.7 Data minimisation in the lead path
`app/api/lead/route.ts` collects: name, phone, email, programme of interest,
optional message, and consent. It does **not** collect documents, Aadhaar,
passport numbers, photographs or payment details. The copy on the apply page
states that nothing is uploaded on this page. The 8 KB body cap, the honeypot and
the 5-per-10-minute rate limit limit scraping.

### 3.8 Cookies and tracking — the default is none
The site ships **no third-party scripts, no analytics, no pixels, no fonts from
a CDN, no embedded maps** (the map is a link out). The only client-side storage
is `localStorage["flyriise:motion"]` — a motion preference. There is no cookie
banner because there is nothing to consent to. **If analytics is added
(`OPEN_QUESTIONS.md` Q8), the privacy policy and a consent mechanism must change
first.**

### 3.9 Transport and site security
HSTS (production), `X-Content-Type-Options`, `X-Frame-Options: DENY`,
`Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`,
and a Content Security Policy that allows no third-party script origin. See
`middleware.ts` and `next.config.ts`. The CSP decision and its caveat (D-10 in
`DECISIONS.md`) should be reviewed before launch.

### 3.10 Accessibility as a consumer obligation
axe-core reports zero violations on all nine audited routes, contrast tokens
clear WCAG AA, the site honours reduced-motion preferences and works at 320 px.
This supports — and is not a substitute for — the WCAG obligations that apply
under the Rights of Persons with Disabilities Act, 2016.

## 4. Gaps that must close before launch

| # | Gap | Owner |
| --- | --- | --- |
| L1 | Grievance officer details and the response window | Client |
| L2 | Business hours (currently withheld) | Client |
| L3 | CIN / GSTIN / date of incorporation | Client |
| L4 | Fee structure and the refund policy that must reference it | Client |
| L5 | Refund and rescheduling terms — the draft policy states these are pending | Client |
| L6 | Consent records for the four student stories | Client |
| L7 | Written authorisation for any partner logo | Client |
| L8 | Freshness decision on Vistara and GoFirst | Client |
| L9 | Counsel review of all four legal documents | Counsel |
| L10 | Confirmation that no accreditation claim is intended | Client |

## 5. Points counsel should look at specifically

1. **Refund policy adequacy.** The draft policy refuses to state terms until the
   client supplies them. A paid service with no published refund terms is an
   exposure; "contact us" is not a policy.
2. **"No guarantee" wording.** The placement disclaimer is written to be
   unambiguous without discouraging applicants. Counsel should confirm it neither
   promises an outcome nor reads as a disclaimer of the institute's own service
   obligation.
3. **Application data as personal data.** The apply form collects a prospective
   student's identity and contact details. Under the DPDP Act the institute
   becomes a Data Fiduciary and needs a clear notice of purpose, retention and
   consent. The draft privacy policy covers this; counsel should confirm the
   retention period and whether a separate consent for marketing contact is
   needed.
4. **Grievance response commitments.** Any window published becomes a commitment
   the institute must meet. Choose a window the admissions desk can actually
   staff.
5. **Advertisement standards.** Programme names, durations and facilities are
   described from the client's own published material. Counsel should confirm
   this is descriptive of the institute's own offering and not a misleading
   representation of any regulator's approval.
6. **Regulator recognition.** No DGCA approval, statutory recognition or
   accreditation is claimed anywhere on the site, and the disclaimer says so
   explicitly. Counsel should confirm that remains true as the institute's
   marketing evolves.

## 6. Reservations

- The site states the institute is a registered private limited company because
  the client publishes that. The certificate has not been sighted by the build
  team. **This must be verified before launch** (`INPUTS_NEEDED.md` A1).
- All factual content is marked `reference` with an as-of date. Nothing has been
  treated as `verified`, because verification is the client's to perform.
- The four student stories are condensed from the client's own published
  material and carry pending consent. They must not go live without L6.

## 7. Sign-off block

```
Content accuracy      ______________________  date __________
Grievance officer     ______________________  date __________
Legal review (counsel) ______________________ date __________
Launch approval       ______________________  date __________
```