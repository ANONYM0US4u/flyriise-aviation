"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Field primitives. Every control gets a visible label, an optional hint, and
 * an error that is wired through aria-describedby + aria-invalid rather than
 * colour alone (brief §15).
 */

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* The "(optional)" hint uses full graphite: 70% alpha measured 3.6:1 on
          white, below WCAG AA for 11px text (axe-core A11Y-1). */}
      <label htmlFor={htmlFor} className="mono-label text-graphite">
        {label}
        {required ? (
          <span className="ml-1 text-amber" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-2 text-graphite">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="text-[0.8125rem] leading-[1.6] text-graphite">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-[0.8125rem] font-medium text-[#c0432a]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, { hint, error }: { hint?: string; error?: string }): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

export function ErrorSummary({ errors }: { errors: Array<{ id: string; message: string }> }) {
  if (errors.length === 0) return null;
  return (
    <div
      role="alert"
      className="rounded-[var(--radius-sm)] border border-[#c0432a]/45 bg-[#fff4f1] p-4"
    >
      <p className="mono-label text-[#c0432a]">Please check {errors.length === 1 ? "this field" : "these fields"}</p>
      <ul className="mt-3 space-y-1.5">
        {errors.map((error) => (
          <li key={error.id}>
            <a href={`#${error.id}`} className="text-[0.875rem] text-ink underline underline-offset-4">
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
