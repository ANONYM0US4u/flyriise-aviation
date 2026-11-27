import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/motion/reveal";
import { PlacementSection } from "@/components/placement/placement-section";
import { PartnersManifest } from "@/components/placement/partners-manifest";
import { StoriesSection } from "@/components/home/stories-section";
import { Section, SectionHeader, SectionMeta } from "@/components/ui/section";
import { ArrowRight } from "@/components/ui/icons";
import { FinalCta } from "@/components/home/final-cta";
import { placementDisclaimer, careerPaths } from "@/data/placement";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Placement",
  description:
    "How Flyriise Aviation supports placement: the five-stage career route, the roles each track prepares you for, and the employer destinations its graduates have joined.",
  path: "/placement",
});

export default function PlacementPage() {
  return (
    <>
      <PageHeader
        eyebrow="Placement"
        title={<>Assistance, measured honestly.</>}
        lede={
          <>
            <p>
              Placement support is a real service: preparation, recruiter introductions, campus drives and
              application help. It is not a promise of employment.
            </p>
            <p>{placementDisclaimer}</p>
          </>
        }
        meta={
          <>
            <span>Five-stage route</span>
          </>
        }
        aside={
          <div className="rounded-[var(--radius-md)] border border-hairline p-5">
            <p className="mono-label text-amber">Jump to</p>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: "/placement#route", label: "The career route" },
                { href: "/placement#destinations", label: "Career destinations" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="mono-label inline-flex items-center gap-2 text-steel transition-colors hover:text-amber"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <div id="route">
        <PlacementSection />
      </div>

      <PartnersManifest />

      {/* Career paths */}
      <Section tone="cloud" className="py-16 lg:py-24">
        <div className="container-wide">
          <SectionMeta code="ROLES" label="Career outcomes" marker="ROUTE" tone="light" />
          <SectionHeader
            level={2}
            eyebrow="Roles and sectors"
            heading="Where a Flyriise track typically leads."
            tone="light"
            className="mt-8"
            body={
              <p>
                These are the roles each track prepares you for — published as career direction, not as a
                placement promise. Every employer applies its own selection.
              </p>
            }
          />
          <ul className="mt-10 border-t border-hairline-light">
            {careerPaths.map((path, index) => (
              <Reveal as="li" key={path.code} delay={index * 45}>
                <div className="grid grid-cols-12 items-baseline gap-4 border-b border-hairline-light py-4">
                  <span className="mono-label col-span-2 text-graphite lg:col-span-1">{path.code}</span>
                  <span className="col-span-10 text-[0.9375rem] text-ink lg:col-span-4">{path.role}</span>
                  <span className="mono-label col-span-6 text-graphite lg:col-span-3">{path.sector}</span>
                  <span className="mono-label col-span-6 text-right text-graphite lg:col-span-4">
                    {path.track}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <StoriesSection />

      <FinalCta />    </>
  );
}
