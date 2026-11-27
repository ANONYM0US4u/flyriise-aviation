import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tone = "apron" | "twilight" | "light" | "cloud";

const toneClasses: Record<Tone, string> = {
  apron: "bg-apron text-cirrus",
  twilight: "bg-twilight text-cirrus",
  light: "bg-cirrus text-ink",
  cloud: "bg-cloud text-ink",
};

export function Section({
  children,
  tone = "apron",
  id,
  className,
  as: Tag = "section",
  labeledBy,
}: {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
  as?: "section" | "div" | "article" | "footer";
  labeledBy?: string;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labeledBy}
      /* Lets the stylesheet re-tone accent text that assumes a dark surface
         (amber measures 1.5:1 on cloud). See globals.css. */
      data-surface={tone === "light" || tone === "cloud" ? "light" : "dark"}
      className={cn("relative", toneClasses[tone], className)}
    >
      {children}
    </Tag>
  );
}

/**
 * Section meta row — the site's signature "flight plan" annotation: section
 * number, name and a positional marker. Provides rhythm between sections.
 */
export function SectionMeta({
  code,
  label,
  marker,
  tone = "apron",
  className,
}: {
  code: string;
  label: string;
  marker?: string;
  tone?: Tone;
  className?: string;
}) {
  const muted = tone === "apron" || tone === "twilight";
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border-b pb-3",
        muted ? "border-hairline text-steel" : "border-hairline-light text-graphite",
        className,
      )}
    >
      <span className="mono-label">
        <span className={muted ? "text-amber" : "text-ink"}>{code}</span>
        <span className="mx-2 opacity-40">/</span>
        {label}
      </span>
      {marker ? <span className="mono-label hidden sm:block">{marker}</span> : null}
    </div>
  );
}

export function Eyebrow({
  children,
  tone = "apron",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const muted = tone === "apron" || tone === "twilight";
  return (
    <p className={cn("mono-label flex items-center gap-3", muted ? "text-amber" : "text-graphite", className)}>
      <span aria-hidden className={cn("h-px w-6", muted ? "bg-amber" : "bg-graphite")} />
      {children}
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  heading,
  body,
  tone = "apron",
  level = 2,
  id,
  className,
  aside,
}: {
  eyebrow?: string;
  heading: ReactNode;
  body?: ReactNode;
  tone?: Tone;
  level?: 1 | 2 | 3;
  id?: string;
  className?: string;
  aside?: ReactNode;
}) {
  const muted = tone === "apron" || tone === "twilight";
  const Heading = `h${level}` as const;
  return (
    <div className={cn("grid gap-8 lg:grid-cols-12 lg:gap-12", className)}>
      <div className="lg:col-span-7">
        {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
        <Heading
          id={id}
          className={cn(
            "display mt-5 text-display-2",
            muted ? "text-cirrus" : "text-ink",
          )}
        >
          {heading}
        </Heading>
        {body ? (
          <div
            className={cn(
              "measure mt-6 space-y-4 text-[1.0625rem] leading-[1.66]",
              muted ? "text-steel" : "text-graphite",
            )}
          >
            {body}
          </div>
        ) : null}
      </div>
      {aside ? <div className="lg:col-span-5 lg:pt-14">{aside}</div> : null}
    </div>
  );
}

/** Hairline row used by manifests and boards. */
export function DataRow({
  children,
  tone = "apron",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const muted = tone === "apron" || tone === "twilight";
  return (
    <div
      className={cn(
        "grid items-baseline gap-x-6 gap-y-2 border-b py-4",
        muted ? "border-hairline" : "border-hairline-light",
        className,
      )}
    >
      {children}
    </div>
  );
}
