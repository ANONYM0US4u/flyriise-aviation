import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/**
 * Interior page header. Same language as the hero (mono eyebrow, display
 * headline, hairline, runway rule) so every route feels like one system.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  meta,
  aside,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Right-hand annotation, e.g. an index or a status note. */
  meta?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative overflow-hidden bg-apron pb-14 pt-28 lg:pb-20 lg:pt-40", className)}>
      <div aria-hidden className="absolute inset-0 grid-lines opacity-40" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-apron to-transparent"
      />
      <div className="container-wide relative">
        <div aria-hidden className="runway-rule mb-10 w-[114px]" />
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <h1 className="display text-display-1 text-cirrus">{title}</h1>
          </div>
          {aside ? <div className="lg:col-span-5">{aside}</div> : null}
        </div>
        {lede ? (
          <div className="measure mt-7 space-y-4 text-[1.0625rem] leading-[1.68] text-steel">{lede}</div>
        ) : null}
        {meta ? (
          <div className="mono-label mt-9 flex flex-wrap gap-x-8 gap-y-2 border-t border-hairline pt-5 text-steel-deep">
            {meta}
          </div>
        ) : null}
      </div>
    </header>
  );
}