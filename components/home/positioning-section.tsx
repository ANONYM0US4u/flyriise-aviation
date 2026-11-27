import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeader, SectionMeta } from "@/components/ui/section";
import { positioning } from "@/data/home";
import { trainingStations } from "@/data/training";

/**
 * SECTION 2 — "More than training" (brief §10).
 * Editorial composition rather than a three-card feature row: one strong
 * narrative column, one annotated data column in the instrument language.
 */
export function PositioningSection() {
  return (
    <Section tone="twilight" id="more-than-training" labeledBy="positioning-heading" className="py-20 lg:py-28">
      <div aria-hidden className="absolute inset-0 grid-lines opacity-40" />
      <div className="container-wide relative">
        <SectionMeta code="SEC 02" label="Positioning" marker="CLIMB · BLUE HOUR" />

        <SectionHeader
          level={2}
          id="positioning-heading"
          eyebrow={positioning.eyebrow}
          heading={positioning.heading}
          tone="twilight"
          className="mt-10"
          body={positioning.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          aside={
            <Reveal className="space-y-px">
              <div className="border-t border-hairline">
                {positioning.stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-hairline py-5 sm:grid sm:grid-cols-12"
                  >
                    <span className="mono-label text-steel-deep sm:col-span-2">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 text-[0.9375rem] text-cirrus sm:col-span-5 sm:flex-none">
                      {stat.label}
                    </span>
                    <span className="w-full min-w-0 text-right sm:col-span-5 sm:w-auto">
                      <span className="display text-[1.5rem] text-amber">{stat.value}</span>
                      <span className="mt-1 block text-[0.75rem] leading-[1.5] text-steel">
                        {stat.note}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="mono-label pt-4 text-steel-deep normal-case tracking-[0.03em]">
                {positioning.footnote}
              </p>
            </Reveal>
          }
        />

        {/* Training stations preview: the climb, in order */}
        <Reveal className="mt-16 border-t border-hairline pt-8" delay={80}>
          <p className="mono-label text-steel-deep">The climb · seven stations</p>
          <ol className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {trainingStations.map((station) => (
              <li key={station.code} className="flex items-baseline gap-3">
                <span className="mono-label text-amber">{station.marker}</span>
                <span className="text-[0.9375rem] leading-[1.5] text-cirrus">{station.title}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
