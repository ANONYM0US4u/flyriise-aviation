"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ProgramSceneGraphic } from "@/components/programs/program-scene";
import { Action } from "@/components/ui/button";
import { ArrowRight, WhatsApp } from "@/components/ui/icons";
import { Eyebrow, Section, SectionMeta } from "@/components/ui/section";
import { programs } from "@/data/programs";
import { programsSection } from "@/data/home";
import { programWhatsappHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

/**
 * SECTION 3 — Programme discovery (brief §10 section 3).
 * Desktop: a track list with an adjacent detail panel, keyboard operable as a
 * proper tablist. Mobile: the same semantics with the panel stacked below.
 * Every track states name, duration, career path, value and CTA immediately.
 */
export function ProgramsSection() {
  const [active, setActive] = useState(0);
  const tabListRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const program = programs[active]!;

  const focusTab = (index: number) => {
    setActive(index);
    const list = tabListRef.current;
    const tab = list?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[index];
    tab?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const last = programs.length - 1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(active === last ? 0 : active + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(active === 0 ? last : active - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(last);
    }
  };

  return (
    <Section tone="apron" id="programs" labeledBy="programs-heading" className="py-20 lg:py-28">
      <div className="container-wide">
        <SectionMeta code="SEC 03" label="Programmes" marker="CLIMB · CONFIDENCE" />

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>{programsSection.eyebrow}</Eyebrow>
            <h2 id="programs-heading" className="display mt-5 text-display-2 text-cirrus">
              {programsSection.heading}
            </h2>
          </div>
          <p className="measure text-[1.0625rem] leading-[1.68] text-steel lg:col-span-5">{programsSection.body}</p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Track list */}
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Programme tracks"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="lg:col-span-5"
          >
            <div className="border-t border-hairline">
              {programs.map((item, index) => {
                const selected = index === active;
                return (
                  <button
                    key={item.slug}
                    id={`${id}-tab-${item.slug}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={`${id}-panel-${item.slug}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    className={cn(
                      "group flex w-full items-baseline justify-between gap-6 border-b border-hairline py-5 text-left transition-colors",
                      selected ? "bg-cirrus/[0.04]" : "hover:bg-cirrus/[0.02]",
                    )}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className={cn("mono-label", selected ? "text-amber" : "text-steel-deep")}>
                        {item.code}
                      </span>
                      <span
                        className={cn(
                          "display text-[1.125rem] transition-colors sm:text-[1.3rem]",
                          selected ? "text-cirrus" : "text-steel group-hover:text-cirrus",
                        )}
                      >
                        {item.shortName}
                      </span>
                    </span>
                    <span className="mono-label shrink-0 text-right text-steel-deep">
                      {item.duration ?? "On request"}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mono-label mt-5 text-steel-deep normal-case tracking-[0.03em]">
              {programsSection.footerNote}
            </p>
          </div>

          {/* Active track detail */}
          <div
            id={`${id}-panel-${program.slug}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${program.slug}`}
            tabIndex={0}
            className="lg:col-span-7"
          >
            <ProgramSceneGraphic scene={program.scene} className="aspect-[16/10]" />

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mono-label text-steel-deep">Track</p>
                <h3 className="display mt-2 text-[1.375rem] text-cirrus">{program.name}</h3>
                <p className="mono-label mt-3 text-amber">{program.kicker}</p>
              </div>
              <div>
                <p className="mono-label text-steel-deep">Career path</p>
                <ul className="mt-2 space-y-2">
                  {program.pathways.slice(0, 3).map((pathway) => (
                    <li key={pathway} className="flex items-baseline gap-3 text-[0.9375rem] text-steel">
                      <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-amber" />
                      {pathway}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="measure mt-6 text-[1.0625rem] leading-[1.68] text-cirrus">{program.summary}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Action href={`/programs/${program.slug}`} variant="primary" icon={<ArrowRight />}>
                Programme detail
              </Action>
              <Action
                href={programWhatsappHref(program.name)}
                external
                variant="secondary"
                icon={<WhatsApp />}
              >
                Ask about this track
              </Action>
              <Link
                href="/apply"
                className="mono-label text-steel underline underline-offset-4 transition-colors hover:text-amber"
              >
                Apply now
              </Link>
            </div>

            <p className="mono-label mt-6 text-steel-deep normal-case tracking-[0.03em]">
              {program.durationNote} · {program.screeningNote}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
