"use client";

import {
  useEffect,
  useRef,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "@/lib/utils";
import { useStillness } from "@/components/motion/motion-provider";

/**
 * Section reveal.
 *
 * Content is visible on first paint (protects LCP and the no-JS experience).
 * Only elements that sit *below* the viewport at mount are hidden and then
 * revealed on intersect, so nothing ever flashes in and nothing depends on
 * JavaScript to be readable (brief §08, §14).
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  className,
  amount = 0.12,
}: {
  children: ReactNode;
  as?: "div" | "li" | "section" | "article" | "figure";
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
  /** How much of the element must be visible before it reveals. */
  amount?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const still = useStillness();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    // Reduced motion (or no IntersectionObserver): make sure nothing is left
    // in the hidden state. The preference resolves after the first render, so
    // an element may already be "pending" from an earlier mount — without this
    // it would stay at opacity 0 forever (QA-3).
    if (still || typeof IntersectionObserver === "undefined") {
      delete element.dataset.reveal;
      return;
    }

    // Above-the-fold content is never hidden — it is already being read.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return;

    element.dataset.reveal = "pending";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.dataset.reveal = "active";
            observer.disconnect();
          }
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [still, amount]);

  const Tag = as as unknown as ComponentType<{
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    ref?: Ref<HTMLElement>;
  }>;

  return (
    <Tag
      ref={ref}
      className={cn("reveal", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
