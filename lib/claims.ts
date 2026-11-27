/**
 * CLAIM GATE
 * ---------------------------------------------------------------------------
 * Every trust-sensitive statement on this site is structured content, not
 * loose prose. Components render provenance from these helpers so that a
 * claim can never silently graduate from "pending" to "published".
 *
 * Brief §17 / §18.
 */

export type ClaimStatus =
  /** Confirmed by the client with a source on file. Safe in production. */
  | "verified"
  /** Published by the client elsewhere (reference site) but not yet signed off. */
  | "reference"
  /** Not supplied at all. Blocked in production, labelled in demo. */
  | "placeholder";

export type Claim = {
  status: ClaimStatus;
  /** Where the value came from. Required for anything not `placeholder`. */
  source?: string;
  /** ISO date (YYYY-MM-DD) the value was last confirmed. */
  asOf?: string;
  approvedBy?: string;
  /** Short provenance note surfaced to reviewers in the demo mode UI. */
  note?: string;
};

export type HiringPartner = {
  name: string;
  /**
   * Relationship categories are never merged (brief §18).
   * `STUDENT_CAREER_DESTINATION` = an employer that has hired graduates.
   * It is NOT a partnership and must never be described as one.
   */
  relationshipType: "AUTHORIZED_HIRING_PARTNER" | "RECRUITMENT_PARTNER" | "STUDENT_CAREER_DESTINATION";
  verificationStatus: "VERIFIED" | "PENDING";
  verificationSource?: string;
  authorizationRef?: string;
  logoUsageApproved?: boolean;
  lastVerifiedAt?: string;
};

export type PlacementStatistic = {
  id: string;
  label: string;
  /** null until the client supplies a verified figure — never invented. */
  value: number | null;
  unit?: string;
  /** What "placed" means for this figure. Mandatory before publishing. */
  definition?: "written offer" | "joined" | null;
  cohort?: string | null;
  period?: string | null;
  placed?: number | null;
  total?: number | null;
  asOf?: string | null;
  method?: string | null;
  claim: Claim;
};

export const CLAIM_LABEL: Record<ClaimStatus, string> = {
  verified: "Verified",
  reference: "Verification pending",
  placeholder: "Awaiting client input",
};

/** Canonical placeholder token. Detectable by scripts/verify-content.mjs. */
export function placeholder(label: string): string {
  return `[CLIENT INPUT REQUIRED — ${label}]`;
}

const PLACEHOLDER_PATTERNS = [
  /\[CLIENT INPUT REQUIRED[^\]]*\]/i,
  /\[VERIFY:[^\]]*\]/i,
  /\[LEGAL REVIEW REQUIRED[^\]]*\]/i,
  /\{\{[A-Z0-9_]+\}\}/,
];

export function isPlaceholderText(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value));
}

/** True when a claim is safe to publish as-is on a production route. */
export function isPublishable(claim: Claim | undefined): boolean {
  return claim?.status === "verified";
}

/**
 * High-risk outcome language. The verification script fails the build when
 * these appear outside an explicitly verified claim. (brief §17)
 */
export const BANNED_CLAIM_PHRASES = [
  "100%",
  "100 %",
  "guaranteed",
  "guarantee",
  "assured",
  "no.1",
  "no 1",
  "number one",
  "best aviation",
  "top-ranked",
  "top ranked",
  "guaranteed job",
  "guaranteed placement",
  "guaranteed salary",
  "assured placement",
  "job guarantee",
] as const;

/** Ratio presentation helper — "18 of 24", never a bare percentage. */
export function formatRatio(placed: number | null | undefined, total: number | null | undefined): string {
  if (typeof placed !== "number" || typeof total !== "number" || total <= 0) return "—";
  return `${placed} of ${total}`;
}

/** Guards against impossible statistics before they reach the UI. */
export function isSkewedStat(stat: PlacementStatistic): boolean {
  if (typeof stat.placed === "number" && typeof stat.total === "number") {
    return stat.placed > stat.total;
  }
  return false;
}

export function isFutureDate(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return false;
  return parsed > Date.now() + 24 * 60 * 60 * 1000; // allow same-day timezones
}
