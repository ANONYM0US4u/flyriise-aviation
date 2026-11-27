import {
  type Claim,
  type HiringPartner,
  type PlacementStatistic,
  placeholder,
} from "@/lib/claims";

/**
 * PLACEMENT EVIDENCE
 * ---------------------------------------------------------------------------
 * Nothing in this file is invented. Where the client has not supplied a
 * verified figure, `value` stays null and the UI renders an explicit
 * "awaiting verified data" state instead of a number (brief §10, §17).
 *
 * Production rule: statistics render only when claim.status === "verified";
 * otherwise the section shows the placement *process* instead of a figure.
 */

export const placementPhilosophy = {
  eyebrow: "Placement",
  heading: "Readiness first. Evidence second. Claims last.",
  body: [
    "Aviation and hospitality recruiters hire on presentation, procedure and composure. Our placement programme exists to get candidates in front of recruiters already fluent in all three.",
  ],
};

export type PlacementStep = {
  code: string;
  title: string;
  summary: string;
  detail: string;
};

/** TRAIN → PREPARE → INTERVIEW → PLACE → GROW (brief §10 section 5). */
export const placementProcess: PlacementStep[] = [
  {
    code: "01",
    title: "Train",
    summary: "Complete the programme modules and assessments.",
    detail:
      "Attendance, module assessments and grooming checks run through the programme. Candidates who miss modules are scheduled for catch-up sessions rather than pushed forward.",
  },
  {
    code: "02",
    title: "Prepare",
    summary: "Portfolio, résumé, photographs and document set.",
    detail:
      "Résumé formatting, professional photographs, documentation checks and a personal presentation review — the paperwork recruiters screen before anyone speaks to a candidate.",
  },
  {
    code: "03",
    title: "Interview",
    summary: "Mock panels, group discussions and feedback loops.",
    detail:
      "Airline-style assessment practice: group discussions, personal interviews, English and announcement drills — recorded and debriefed so candidates improve between attempts.",
  },
  {
    code: "04",
    title: "Place",
    summary: "Recruiter introductions, drives and application support.",
    detail:
      "The placement cell coordinates campus drives and referrals, and supports applications to openings that match the candidate's track and standards.",
  },
  {
    code: "05",
    title: "Grow",
    summary: "Post-offer guidance and alumni pathways.",
    detail:
      "Guidance on joining formalities, grooming standards for the employer, and onward pathways — including internal transfers and cross-training that aviation careers depend on.",
  },
];

/** What counts as "placed" must be defined before any figure is published. */
export const placementMethodology = {
  heading: "How placement figures are counted",
  rules: [
    "A cohort is a single intake batch with a start date and a track. Figures are never pooled across batches without saying so.",
    "A candidate counts as placed when a written offer is accepted. A written offer accepted but not joined is reported separately, never counted as a placement.",
    "Every published figure carries a numerator and denominator (n of N), the period it covers, and the date it was last verified.",
    "Candidates who withdraw, defer or leave for higher studies are recorded in the denominator with a reason, not quietly removed.",
    "Figures are verified against offer letters or recruiter confirmations held by the institute. If verification is not possible, no figure is published.",
  ],
  guardrails: [
    "No percentage is published without its cohort and denominator.",
    "No guaranteed-employment language appears anywhere on this site.",
    "Employer names are published only as career destinations unless a current, authorized hiring partnership is on record.",
  ],
};

/** Replacement tokens for anything the client has not supplied yet. */
export const placementDataNeeds = {
  definition: placeholder("DEFINITION OF \"PLACED\" FOR YOUR INSTITUTE"),
  cohort: placeholder("COHORT / BATCH CONVENTION"),
  period: placeholder("MEASUREMENT PERIOD (E.G. APR 2023 – MAR 2026)"),
  counts: placeholder("NUMERATOR & DENOMINATOR PER COHORT"),
  method: placeholder("VERIFICATION METHOD & DOCUMENTATION HELD"),
  owner: placeholder("DATA OWNER / RESPONSIBLE STAFF MEMBER"),
};

const pendingStat = (note: string): Claim => ({
  status: "placeholder",
  note,
});

/**
 * Requested metrics (brief §10 section 7). All figures are deliberately
 * unresolved until verified data arrives — the UI shows the measurement
 * contract, not a placeholder number pretending to be data.
 */
export const placementStatistics: PlacementStatistic[] = [
  {
    id: "placement-rate",
    label: "Placement rate",
    value: null,
    unit: "%",
    definition: null,
    cohort: null,
    period: null,
    placed: null,
    total: null,
    asOf: null,
    method: null,
    claim: pendingStat("Requires definition, cohort, period and n of N before publication."),
  },
  {
    id: "students-trained",
    label: "Candidates trained",
    value: null,
    definition: null,
    cohort: "All cohorts",
    period: null,
    placed: null,
    total: null,
    asOf: null,
    method: null,
    claim: pendingStat("Cumulative enrolment count has not been supplied."),
  },
  {
    id: "time-to-placement",
    label: "Average time to offer",
    value: null,
    unit: "weeks",
    definition: "written offer",
    cohort: null,
    period: null,
    placed: null,
    total: null,
    asOf: null,
    method: null,
    claim: pendingStat("Needs a stated measurement window and the cohort it covers."),
  },
  {
    id: "employers-hired",
    label: "Employers that have hired graduates",
    value: null,
    definition: null,
    cohort: null,
    period: null,
    placed: null,
    total: null,
    asOf: null,
    method: null,
    claim: pendingStat("Distinct from hiring partners — requires offer records, not logos."),
  },
  {
    id: "years-operating",
    label: "Years of operation",
    value: null,
    unit: "years",
    definition: null,
    cohort: null,
    period: null,
    placed: null,
    total: null,
    asOf: null,
    method: null,
    claim: pendingStat("Confirm incorporation or first-batch date with supporting record."),
  },
  {
    id: "campuses",
    label: "Training locations",
    value: null,
    definition: null,
    cohort: null,
    period: null,
    placed: null,
    total: null,
    asOf: null,
    method: null,
    claim: pendingStat("Barrackpore campus is published; confirm whether any other centre operates."),
  },
];

/**
 * PUBLISHED ONLY AS CAREER DESTINATIONS.
 * The client's public site lists employers its students have joined. That is a
 * destination list, not proof of partnership, and no logo is used (brief §18).
 */
export const careerDestinations: HiringPartner[] = (
  [
    "IndiGo",
    "Air India",
    "SpiceJet",
    "Akasa Air",
    "Vistara",
    "Emirates",
    "Air Arabia",
    "GMR Group",
    "Taj Hotels",
    "Hyatt Hotels",
    "Oberoi Hotels",
    "ITC Hotels",
    "GoFirst",
  ] as const
).map((name) => ({
  name,
  relationshipType: "STUDENT_CAREER_DESTINATION" as const,
  verificationStatus: "PENDING" as const,
  verificationSource: "client public website (alumni destinations)",
  authorizationRef: undefined,
  logoUsageApproved: false,
  lastVerifiedAt: undefined,
}));

export const careerDestinationsNote =
  "These employers were listed publicly by the institute as destinations its graduates have joined. They are shown as career destinations only — not as hiring partners, and without logos.";

/** Career roles, derived from the client's published programme descriptions. */
export const careerPaths = [
  { code: "R·01", role: "Cabin crew", sector: "Airline in-cabin", track: "Cabin crew · Air hostess" },
  { code: "R·02", role: "Airport customer service", sector: "Terminal / concourse", track: "Airport management" },
  { code: "R·03", role: "Ground staff & utility", sector: "Airside operations", track: "Utility & ground ops" },
  { code: "R·04", role: "Guest relations", sector: "Hotels / lounges", track: "Hospitality" },
  { code: "R·05", role: "Front office & F&B", sector: "Hospitality", track: "Hospitality" },
  { code: "R·06", role: "Airport hospitality support", sector: "Lounge / premium services", track: "Air hostess · Hospitality" },
];

export const placementDisclaimer =
  "Flyriise provides placement assistance. Employment is decided by recruiting organisations applying their own standards, and no offer, salary or outcome is guaranteed by the institute.";
