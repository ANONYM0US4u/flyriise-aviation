import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ProgramSceneGraphic } from "@/components/programs/program-scene";
import { Reveal } from "@/components/motion/reveal";
import { Action } from "@/components/ui/button";
import { ArrowRight, WhatsApp } from "@/components/ui/icons";
import { Section, SectionHeader } from "@/components/ui/section";
import { getProgram, programs } from "@/data/programs";
import { programWhatsappHref, whatsappHref } from "@/lib/contact";
import { breadcrumbJsonLd, buildMetadata, courseJsonLd, jsonLdScript } from "@/lib/seo";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) return {};
  return buildMetadata({
    title: program.name,
    description: program.summary,
    path: `/programs/${program.slug}`,
    type: "article",
  });
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const others = programs.filter((item) => item.slug !== program.slug).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={`${program.code} · Programme detail`}
        title={program.name}
        lede={program.overview.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        meta={
          <>
            <span>Duration: {program.duration ?? "confirmed at counselling"}</span>
            <span>Eligibility: {program.eligibility[0]}</span>
          </>
        }
        aside={
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Action href="/apply" variant="primary" size="lg">
              Apply now
            </Action>
            <Action
              href={programWhatsappHref(program.name)}
              external
              variant="secondary"
              size="lg"
              icon={<WhatsApp />}
            >
              Ask about this track
            </Action>
          </div>
        }
      />

      {/* Course facts */}
      <Section tone="apron" className="py-14 lg:py-20">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <ProgramSceneGraphic scene={program.scene} className="aspect-[16/10]" />
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[var(--radius-md)] border border-hairline p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="mono-label text-amber">Course facts</p>
                </div>
                <dl className="mt-5 divide-y divide-[color:var(--color-hairline)]">
                  {[
                    { label: "Programme", value: program.name },
                    { label: "Duration", value: program.duration ?? "On request" },
                    { label: "Mode", value: "In person, practical" },
                    { label: "Level", value: "Beginner-friendly" },
                  ].map((row) => (
                    <div key={row.label} className="grid grid-cols-3 gap-4 py-3">
                      <dt className="mono-label text-steel-deep">{row.label}</dt>
                      <dd className="col-span-2 text-[0.9375rem] text-cirrus">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mono-label mt-4 text-steel-deep normal-case tracking-[0.03em]">
                  {program.durationNote}
                </p>
              </div>

              <div className="mt-6 rounded-[var(--radius-md)] border border-hairline p-6">
                <p className="mono-label text-amber">Career pathways</p>
                <ul className="mt-4 space-y-2.5">
                  {program.pathways.map((pathway) => (
                    <li key={pathway} className="flex items-baseline gap-3 text-[0.9375rem] text-steel">
                      <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-amber" />
                      {pathway}
                    </li>
                  ))}
                </ul>
                <p className="measure-tight mt-4 text-[0.8125rem] leading-[1.65] text-steel-deep">
                  {program.screeningNote}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Curriculum */}
            <div className="lg:col-span-8">
              <p className="mono-label text-amber">Curriculum</p>
              <ol className="mt-6 border-t border-hairline">
                {program.curriculum.map((module, index) => (
                  <Reveal as="li" key={module.code} delay={index * 50}>
                    <div className="grid grid-cols-12 gap-4 border-b border-hairline py-5">
                      <span className="mono-label col-span-2 text-steel-deep">{module.code}</span>
                      <div className="col-span-10">
                        <h2 className="display text-[1.0625rem] text-cirrus">{module.title}</h2>
                        <p className="measure-tight mt-2 text-[0.9375rem] leading-[1.65] text-steel">
                          {module.detail}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            {/* Eligibility */}
            <div className="lg:col-span-4">
              <div className="rounded-[var(--radius-md)] border border-hairline p-6">
                <p className="mono-label text-amber">Eligibility</p>
                <ul className="mt-4 space-y-3">
                  {program.eligibility.map((item) => (
                    <li key={item} className="flex items-baseline gap-3 text-[0.9375rem] leading-[1.6] text-steel">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mono-label mt-5 border-t border-hairline pt-4 text-steel-deep normal-case tracking-[0.03em]">
                  Requirements are confirmed per batch. Admissions will verify documents before enrolment.
                </p>
              </div>

              <div className="mt-6 rounded-[var(--radius-md)] border border-amber/35 bg-amber/[0.06] p-6">
                <p className="mono-label text-amber">Fees &amp; batches</p>
                <p className="mt-3 text-[0.9375rem] leading-[1.7] text-cirrus">
                  Fee structure, instalment options and the next batch date are shared at counselling so
                  you receive current figures rather than published ones that may have changed.
                </p>
                <Action
                  href={whatsappHref(`Hello, I would like the current fee structure and batch dates for the ${program.name}.`)}
                  external
                  variant="primary"
                  className="mt-5 w-full"
                  icon={<WhatsApp />}
                >
                  Get current details
                </Action>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Other tracks */}
      <Section tone="light" className="py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeader
            level={2}
            eyebrow="Other tracks"
            heading="Compare the rest of the programme line."
            tone="light"
          />
          <ul className="mt-10 grid gap-6 lg:grid-cols-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/programs/${other.slug}`}
                  className="group flex h-full flex-col rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-6 transition-colors hover:border-ink"
                >
                  <span className="mono-label text-graphite">{other.code}</span>
                  <span className="display mt-3 text-[1.125rem] text-ink">{other.name}</span>
                  <span className="mt-3 text-[0.9375rem] leading-[1.65] text-graphite">
                    {other.summary}
                  </span>
                  <span className="mono-label mt-6 inline-flex items-center gap-2 text-ink">
                    Open track
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript({
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Programmes", path: "/programs" },
              { name: program.name, path: `/programs/${program.slug}` },
            ]),
            courseJsonLd(program.slug),
          ].filter(Boolean),
        })}
      />
    </>
  );
}