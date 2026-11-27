import { CLAIM_LABEL, isPlaceholderText, type Claim, type ClaimStatus } from "@/lib/claims";
import { cn } from "@/lib/utils";

const toneByStatus: Record<ClaimStatus, string> = {
  verified: "border-verified/45 text-verified",
  reference: "border-hairline-strong text-steel",
  placeholder: "border-amber/40 text-amber",
};

/**
 * Provenance chip. Renders the verification state of a claim wherever a
 * trust-sensitive statement appears — the site's credibility made visible.
 */
export function ClaimChip({
  status,
  className,
  label,
}: {
  status: ClaimStatus;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "mono-label inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-2.5 py-1",
        toneByStatus[status],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "verified" ? "bg-verified" : status === "reference" ? "bg-steel" : "bg-amber",
        )}
      />
      {label ?? CLAIM_LABEL[status]}
    </span>
  );
}

/** Compact status lamp for dense rows (departures board, manifests). */
export function StatusLamp({ status, className }: { status: ClaimStatus; className?: string }) {
  const text =
    status === "verified" ? "VERIFIED" : status === "reference" ? "PENDING" : "NOT PUBLISHED";
  const color =
    status === "verified" ? "text-verified" : status === "reference" ? "text-steel" : "text-amber";
  return (
    <span className={cn("mono-label inline-flex items-center gap-2", color, className)}>
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "verified" ? "bg-verified" : status === "reference" ? "bg-steel" : "bg-amber",
        )}
      />
      {text}
    </span>
  );
}

/**
 * Renders a value that the client still has to supply. An unsupplied value
 * renders nothing at all — the site never shows its own scaffolding to a
 * visitor — so callers can keep the placeholder in data without leaking it.
 */
export function PendingValue({
  children,
  className,
  label = "Not yet supplied",
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  if (isPlaceholderText(children)) return null;
  return (
    <span
      className={cn(
        "mono-label inline-flex items-center gap-2 rounded-[var(--radius-xs)] border border-dashed border-amber/45 bg-amber/[0.06] px-2.5 py-1.5 text-amber",
        className,
      )}
    >
      <span className="sr-only">{label}: </span>
      {children}
    </span>
  );
}

/** Explanation row used by trust surfaces to describe a claim's provenance. */
export function ClaimNote({ claim, className }: { claim: Claim; className?: string }) {
  if (!claim.note && !claim.source) return null;
  return (
    <p className={cn("mono-label text-steel-deep normal-case tracking-[0.04em]", className)}>
      {[claim.note, claim.source ? `Source: ${claim.source}` : null, claim.asOf ? `As of ${claim.asOf}` : null]
        .filter(Boolean)
        .join(" · ")}
    </p>
  );
}
