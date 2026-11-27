import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * IDENTITY
 * ---------------------------------------------------------------------------
 * Mark concept: "ascent" — a departure point, a rising flight path and an
 * arrival vector, drawn as a single engineered stroke. Monochrome-capable,
 * legible at 16px, and scalable to signage. Concept direction under review by
 * the client (see docs/DESIGN_PLAN.md).
 */

export function LogoMark({
  className,
  tone = "light",
  title = `${site.brand.name} mark`,
}: {
  className?: string;
  tone?: "light" | "dark" | "mono";
  /** Pass null when the mark sits next to an adjacent wordmark. */
  title?: string | null;
}) {
  const stroke = tone === "dark" ? "#0A1222" : "#E6EDF6";
  const accent = tone === "mono" ? stroke : "var(--color-amber)";
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-9 w-9", className)}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {/* Departure point */}
      <circle cx="7" cy="31.5" r="2.4" fill={accent} />
      {/* Climb path */}
      <path
        d="M7 31.5C16.5 31.5 25.5 26 33 11.5"
        fill="none"
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.92"
      />
      {/* Arrival vector */}
      <path
        d="M26.5 9.5L34.5 10.2L31.2 18"
        fill="none"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Altitude ticks — precision detail */}
      <path d="M12.5 34.5H16M9.5 37.5H15" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function Wordmark({
  className,
  tone = "light",
  showDescriptor = true,
  short = false,
}: {
  className?: string;
  tone?: "light" | "dark";
  showDescriptor?: boolean;
  /** Below `sm`, swap the full name for the short form so the header fits 320px. */
  short?: boolean;
}) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span
        className={cn(
          "display whitespace-nowrap text-[0.98rem] font-semibold tracking-[-0.01em] sm:text-[1.06rem]",
          tone === "dark" ? "text-ink" : "text-cirrus",
        )}
      >
        {short ? (
          <>
            <span className="sm:hidden">{site.brand.shortName}</span>
            <span className="hidden sm:inline">{site.brand.name}</span>
          </>
        ) : (
          site.brand.name
        )}
      </span>
      {showDescriptor ? (
        <span
          className={cn(
            "mono-label mt-1 text-[0.58rem] tracking-[0.24em]",
            tone === "dark" ? "text-graphite" : "text-steel",
          )}
        >
          Aviation &amp; hospitality
        </span>
      ) : null}
    </span>
  );
}

export function LogoLockup({
  className,
  tone = "light",
  showDescriptor = true,
  short = false,
}: {
  className?: string;
  tone?: "light" | "dark";
  showDescriptor?: boolean;
  short?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      <LogoMark tone={tone} title={null} className="h-8 w-8 shrink-0" />
      <Wordmark tone={tone} showDescriptor={showDescriptor} short={short} />
    </span>
  );
}
