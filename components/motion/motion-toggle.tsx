"use client";

import { useMotion } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";

/**
 * Footer control required by the brief (§07A): "Reduce motion and 3D".
 * Cosmetic 3D and scroll animation are enhancements; this switch returns the
 * visit to the content-first experience immediately.
 */
export function MotionToggle({ className }: { className?: string }) {
  const { reduce, setReduce, ready } = useMotion();

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={reduce}
        onClick={() => setReduce(!reduce)}
        className="mono-label group inline-flex min-h-[2.75rem] items-center gap-3 rounded-[var(--radius-sm)] border border-hairline px-3.5 text-steel transition-colors hover:border-hairline-strong hover:text-cirrus"
      >
        <span
          aria-hidden
          className={cn(
            "relative h-4 w-8 rounded-[var(--radius-pill)] border transition-colors",
            reduce ? "border-amber bg-amber/25" : "border-hairline-strong bg-transparent",
          )}
        >
          <span
            className={cn(
              "absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full transition-[left,background-color] duration-200",
              reduce ? "left-[1.1rem] bg-amber" : "left-[0.15rem] bg-steel",
            )}
          />
        </span>
        {ready && reduce ? "Motion & 3D off" : "Reduce motion & 3D"}
      </button>
      <p className="mono-label max-w-[36ch] text-steel-deep normal-case tracking-[0.03em]">
        Turns off camera movement and the 3D scene. All content stays available.
      </p>
    </div>
  );
}
