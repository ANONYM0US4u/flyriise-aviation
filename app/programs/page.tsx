import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/motion/reveal";
import { ProgramSceneGraphic } from "@/components/programs/program-scene";
import { Action } from "@/components/ui/button";
import { ArrowRight, WhatsApp } from "@/components/ui/icons";
import { Section, SectionHeader } from "@/components/ui/section";
import { programs } from "@/data/programs";
import { programWhatsappHref, whatsappHref } from "@/lib/contact";
import { buildMetadata, courseJsonLd, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Programmes",
  description:
    "Five aviation and hospitality programme tracks: airport management, cabin crew, air hostess diploma, airport utility and ground operations, and hospitality management.",
  path: "/programs",
});

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Programmes · 5 tracks"
        title={<>Training that ends in a selection panel, not a certificate.</>}
        lede={
          <p>
            Each track is built around the roles it leads to, taught in sequence, and assessed as it is
            taught. Programmes start from fundamentals, so no prior aviation knowledge is assumed.
          </p>
        }
        meta={
          <>
            <span>Fees &amp; batch dates confirmed at counselling</span>
            <span>No programme guarantees employment</span>
          </>
        }
      />

      <Section tone="twilight" className="py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeader
            level={2}
            eyebrow="Choose a track"
            heading="Five programmes, one standard of readiness."
            tone="twilight"
            body={
              <p>
                Every track ends with grooming assessment, interview rehearsal and documentation
                preparation — because recruiters screen on all three.
              </p>
            }
          />

          <ul className="mt-14 grid gap-8 lg:grid-cols-2">
            {programs.map((program, index) => (
              <Reveal as="li" key={program.slug} delay={index * 60}>
                <article className="flex h-full flex-col rounded-[var(--radius-md)] border border-hairline bg-apron/40">
                  <ProgramSceneGraphic scene={program.scene} className="aspect-[16/9] rounded-none border-0 border-b" />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="mono-label text-amber">{program.code}</span>
                    </div>
                    <h3 className="display mt-4 text-[1.375rem] text-cirrus">{program.name}</h3>
                    <p className="mono-label mt-2 text-steel-deep">{program.kicker}</p>
                    <p className="measure mt-4 text-[0.9375rem] leading-[1.7] text-steel">
                      {program.summary}
                    </p>

                    <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-hairline pt-5">
                      <div>
                        <dt className="mono-label text-steel-deep">Duration</dt>
                        <dd className="mt-1 text-[0.9375rem] text-cirrus">
                          {program.duration ?? "On request"}
                        </dd>
                      </div>
                      <div>
                        <dt className="mono-label text-steel-deep">Leads to</dt>
                        <dd className="mt-1 text-[0.9375rem] text-cirrus">
                          {program.pathways[0]}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
                      <Link
                        href={`/programs/${program.slug}`}
                        className="mono-label inline-flex items-center gap-2 text-amber underline underline-offset-4"
                      >
                        Detail &amp; curriculum
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <Action
                        href={programWhatsappHref(program.name)}
                        external
                        variant="secondary"
                        icon={<WhatsApp />}
                      >
                        Ask
                      </Action>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>

          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-hairline pt-8">
            <Action href="/apply" variant="primary" size="lg">
              Apply now
            </Action>
            <Action href={whatsappHref()} external variant="secondary" size="lg" icon={<WhatsApp />}>
              Compare tracks on WhatsApp
            </Action>
            <p className="mono-label text-steel-deep">
              Eligibility is checked per track at counselling — most require 10+2.
            </p>
          </div>
        </div>
      </Section>

      {programs.slice(0, 3).map((program) => (
        <script
          key={program.slug}
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(courseJsonLd(program.slug) ?? {})}
        />
      ))}
    </>
  );
}