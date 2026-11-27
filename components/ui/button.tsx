import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2.5 font-medium tracking-[-0.01em] " +
  "transition-[background-color,border-color,color,transform] duration-200 ease-[var(--ease-instrument)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Variant, string> = {
  /* Single accent, used deliberately — the primary conversion action. */
  primary:
    "bg-amber text-ink hover:bg-[#ffc04d] active:translate-y-[1px] focus-visible:outline-amber",
  /* Outline for the secondary action; inherits current surface colour. */
  secondary:
    "border border-hairline-strong text-cirrus hover:border-cirrus hover:bg-cirrus/5 active:translate-y-[1px] focus-visible:outline-amber",
  ghost:
    "text-cirrus/85 hover:text-cirrus underline underline-offset-4 decoration-hairline-strong hover:decoration-amber",
  /* On light surfaces. */
  light:
    "border border-hairline-light-strong text-ink hover:bg-ink hover:text-cloud active:translate-y-[1px] focus-visible:outline-ink",
};

const sizes: Record<Size, string> = {
  md: "min-h-[2.75rem] px-5 text-[0.9375rem] rounded-[var(--radius-sm)]",
  lg: "min-h-[3.25rem] px-7 text-[1rem] rounded-[var(--radius-sm)]",
};

export type ActionProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  href?: string;
  /** Renders an anchor with target/rel for outbound links (WhatsApp, mail, tel). */
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  /** Accessible label when the visible text is short. */
  ariaLabel?: string;
  icon?: ReactNode;
  onClick?: () => void;
  /**
   * Route prefetch. Defaults to false: on this 3D-first build, prefetching the
   * conversion routes dragged the form engine (react-hook-form + zod, ~223 KB
   * gzip) into the homepage's first load. See docs/PERF_REPORT.md.
   */
  prefetch?: boolean;
};

export function Action({
  children,
  variant = "primary",
  size = "md",
  className,
  href,
  external,
  type = "button",
  disabled,
  ariaLabel,
  icon,
  onClick,
  prefetch = false,
}: ActionProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href && !disabled) {
    const isProtocolLink = /^(tel:|mailto:|https?:)/.test(href);
    if (external || isProtocolLink) {
      return (
        <a
          href={href}
          className={classes}
          aria-label={ariaLabel}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {icon}
          {children}
        </a>
      );
    }
    return (
      <Link href={href} prefetch={prefetch} className={classes} aria-label={ariaLabel}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}
