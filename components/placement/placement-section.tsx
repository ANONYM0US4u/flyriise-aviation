import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeader, SectionMeta } from "@/components/ui/section";
import { ArrowRight } from "@/components/ui/icons";
import { placementDisclaimer, placementPhilosophy, placementProcess } from "@/data/placement";
import { placementSection } from "@/data/home";

/**
 * SECTION 5 — Placement / career path (brief §10 section 5).
 * The route: TRAIN → PREPARE → INTERVIEW → PLACE → GROW, drawn as a flight
 * path with waypoints. Deliberately no percentage and no guarantee language.
 */
export function PlacementSection() {
  return (
    <Section tone="cloud" id="placement" labeledBy="placement-heading" className="py-20 lg:py-28">
      <div className="container-wide">
        <SectionMeta
          code="SEC 05"
          label="Placement"
          marker="CLOUD BREAK · EVIDENCE"
          tone="light"
        />

        <SectionHeader
          level={2}
          id="placement-heading"
          eyebrow={placementSection.eyebrow}
          heading={placementPhilosophy.heading}
          tone="light"
          className="mt-10"
          body={placementPhilosophy.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          aside={
            <div className="rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-5">
              <p className="mono-label text-graphite">What placement support means</p>
              <p className="mt-3 text-[0.9375rem] leading-[1.65] text-ink">{placementDisclaimer}</p>
              <Link
                href="/placement"
                className="mono-label mt-4 inline-flex items-center gap-2 text-ink underline underline-offset-4"
              >
                Placement
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          }
        />

        {/* Institute photograph — the placement notice board in the campus corridor */}
        <Reveal className="mt-14">
          <figure className="overflow-hidden rounded-[var(--radius-md)] border border-hairline-light bg-cirrus">
            <div className="relative h-[220px] sm:h-[300px] lg:h-[360px] w-full">
              <Image
                src="/images/placement-board.jpg"
                alt="The campus corridor: a notice board carrying photographs of placed candidates, beside glass-partitioned training rooms and programme posters."
                fill
                sizes="(min-width: 1024px) 1200px, 100vw"
                className="object-cover object-[50%_45%]"
              />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline-light px-5 py-3">
              <span className="mono-label text-graphite">Placement board · campus corridor</span>
              <span className="mono-label text-graphite">Institute photograph</span>
            </figcaption>
          </figure>
        </Reveal>

        {/* Route map */}
        <Reveal className="mt-16">
          <div className="rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="mono-label text-graphite">Career route · five waypoints</p>
              <p className="mono-label text-graphite">No guaranteed outcomes at any waypoint</p>
            </div>

            <svg
              viewBox="0 0 1000 200"
              className="mt-6 h-32 w-full sm:h-44"
              role="img"
              aria-label="Career route showing five waypoints: train, prepare, interview, place and grow"
            >
              <defs>
                <linearGradient id="route-line" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8a9ab4" />
                  <stop offset="100%" stopColor="#ffb224" />
                </linearGradient>
              </defs>

              {/* Route path */}
              <path
                d="M60 156 C 220 156, 260 92, 400 92 S 620 148, 740 148 S 880 60, 940 52"
                fill="none"
                stroke="url(#route-line)"
                strokeWidth="2.5"
                strokeDasharray="10 8"
                className="draw-path"
              />

              {placementProcess.map((step, index) => {
                const positions = [
                  { x: 60, y: 156 },
                  { x: 248, y: 114 },
                  { x: 400, y: 92 },
                  { x: 640, y: 148 },
                  { x: 940, y: 52 },
                ];
                const point = positions[index]!;
                return (
                  <g key={step.code}>
                    <circle cx={point.x} cy={point.y} r="8" fill="#F7F9FC" stroke="#0A1222" strokeWidth="2" />
                    <circle cx={point.x} cy={point.y} r="3" fill="#ffb224" />
                    <text x={point.x} y={point.y - 20} textAnchor="middle" fontSize="11" letterSpacing="2" fill="#46536b">
                      {step.code}
                    </text>
                    <text
                      x={point.x}
                      y={point.y + 30}
                      textAnchor="middle"
                      fontSize="13"
                      fill="#0a1222"
                      letterSpacing="0.6"
                    >
                      {step.title.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>

            <ol className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
              {placementProcess.map((step, index) => (
                <Reveal as="li" key={step.code} delay={index * 60}>
                  <p className="mono-label text-ink">{step.code}</p>
                  <h3 className="display mt-3 text-[1.0625rem] text-ink">{step.title}</h3>
                  <p className="mt-2 text-[0.875rem] font-medium text-graphite">{step.summary}</p>
                  <p className="mt-3 text-[0.875rem] leading-[1.65] text-graphite">{step.detail}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/placement" className="mono-label inline-flex items-center gap-2 text-ink underline underline-offset-4">
            Placement
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link href="/apply" className="mono-label inline-flex items-center gap-2 text-ink underline underline-offset-4">
            Start an application
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
