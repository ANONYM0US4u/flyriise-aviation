"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

/**
 * FAQ accordion. Radix supplies the button/region semantics and keyboard
 * behaviour (arrow keys, Home/End); the content is present in the DOM for
 * search engines and in-page find because it is only visually collapsed
 * (brief §15, §16).
 */

export type AccordionItem = {
  id: string;
  question: string;
  answer: string[];
};

export function FaqAccordion({
  items,
  className,
}: {
  items: AccordionItem[];
  className?: string;
}) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={items[0]?.id}
      className={cn("w-full border-t border-hairline-light", className)}
    >
      {items.map((item, index) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          className="border-b border-hairline-light"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              className={cn(
                "group flex w-full items-start justify-between gap-6 py-5 text-left",
                "transition-colors hover:text-graphite",
              )}
            >
              <span className="flex items-baseline gap-4">
                <span className="mono-label pt-1 text-graphite">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="display text-[1.0625rem] leading-[1.35] font-medium text-ink sm:text-[1.1875rem]">
                  {item.question}
                </span>
              </span>
              <span
                aria-hidden
                className="relative mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-hairline-light-strong"
              >
                <span className="absolute h-px w-2.5 bg-ink" />
                <span className="absolute h-2.5 w-px bg-ink transition-transform duration-300 ease-[var(--ease-ascent)] group-data-[state=open]:scale-y-0" />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:hidden">
            <div className="grid gap-3 pb-6 pl-0 sm:pl-10">
              {item.answer.map((paragraph) => (
                <p key={paragraph} className="measure text-[0.9375rem] leading-[1.7] text-graphite">
                  {paragraph}
                </p>
              ))}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
