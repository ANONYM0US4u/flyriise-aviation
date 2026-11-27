import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeader, SectionMeta } from "@/components/ui/section";
import { stories } from "@/data/stories";
import { storiesSection } from "@/data/home";
import { initials } from "@/lib/utils";

/**
 * SECTION 8 — Student stories (brief §10 section 8).
 * Only client-supplied stories with confirmed consent are published. When
 * nothing is confirmed the section is not rendered at all.
 */
export function StoriesSection() {
  const visible = stories.filter((story) => story.consent === "confirmed");

  if (visible.length === 0) return null;

  return (
    <Section tone="light" id="stories" labeledBy="stories-heading" className="py-20 lg:py-28">
      <div className="container-wide">
        <SectionMeta code="SEC 08" label="Student stories" marker="EVIDENCE" tone="light" />

        <SectionHeader
          level={2}
          id="stories-heading"
          eyebrow={storiesSection.eyebrow}
          heading={storiesSection.heading}
          tone="light"
          className="mt-10"
        />

        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {visible.map((story, index) => (
            <Reveal as="li" key={story.id} delay={index * 70}>
              <figure className="flex h-full flex-col justify-between rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-6">
                <blockquote className="text-[1.0625rem] leading-[1.6] text-ink">
                  <span aria-hidden className="mr-1 text-2xl leading-none text-[color:var(--color-graphite)]">
                    “
                  </span>
                  {story.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-start gap-4 border-t border-hairline-light pt-5">
                  <span
                    aria-hidden
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-hairline-light-strong font-mono text-[0.8125rem] text-ink"
                  >
                    {initials(story.name)}
                  </span>
                  <span>
                    <span className="block text-[0.9375rem] font-medium text-ink">{story.name}</span>
                    <span className="mono-label block text-graphite">
                      {story.role} · {story.employer}
                    </span>
                    <span className="mono-label block text-graphite">{story.programLabel}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
