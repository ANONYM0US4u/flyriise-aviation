import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeader, SectionMeta } from "@/components/ui/section";
import { Action } from "@/components/ui/button";
import { FaqSection } from "@/components/home/faq-section";
import { site } from "@/data/site";
import { faqJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";
import { faqs } from "@/data/faqs";


export const metadata: Metadata = buildMetadata({
  title: "About the institute",
  description:
    "Who Flyriise Aviation & Hospitality Services is: how the institute trains, what it promises, and what it deliberately does not claim.",
  path: "/about",
});

const missionVision = [
  {
    code: "01",
    title: "Mission",
    body: "To train aviation and hospitality professionals who meet the standards recruiters actually screen for — presentation, procedure and composure under pressure — through practical, assessed teaching rather than classroom attendance alone.",
  },
  {
    code: "02",
    title: "Vision",
    body: "To be known in the region for the readiness of its graduates and the honesty of its reporting: outcomes described accurately, limitations stated plainly, and no claim published that the institute cannot evidence.",
  },
  {
    code: "03",
    title: "How we decide what to teach",
    body: "Syllabi are checked against current industry requirements and reviewed each batch. Where employers change standards, modules change — and candidates are told what changed and why.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={<>An institute for people who take the work seriously.</>}
        lede={
          <p>
            {site.brand.legalName} operates as an aviation and hospitality training institute from
            Barrackpore, North 24 Parganas. This page explains what we do, how we train, and — just as
            importantly — what we do not claim.
          </p>
        }
        meta={
          <>
            <span>Barrackpore · North 24 Parganas · West Bengal</span>
            <span>Five programme tracks</span>
            <span>Placement assistance, never a guarantee</span>
          </>
        }
        aside={
          <div className="rounded-[var(--radius-md)] border border-hairline p-5">
            <p className="mono-label text-amber">Institute identity</p>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="mono-label text-steel-deep">Legal name</dt>
                <dd className="mt-1 text-[0.9375rem] text-cirrus">{site.brand.legalName}</dd>
              </div>
              {site.registration.cin ? (
                <div>
                  <dt className="mono-label text-steel-deep">Registration</dt>
                  <dd className="mt-2 text-[0.9375rem] text-cirrus">CIN {site.registration.cin}</dd>
                </div>
              ) : null}
              {site.grievance.email ? (
                <div>
                  <dt className="mono-label text-steel-deep">Grievance contact</dt>
                  <dd className="mt-2 text-[0.9375rem] text-cirrus">{site.grievance.email}</dd>
                </div>
              ) : null}
            </dl>
            <p className="mono-label mt-4 text-steel-deep normal-case tracking-[0.03em]">
              {site.registration.note}
            </p>
          </div>
        }
      />

      {/* Mission / vision */}
      <Section tone="twilight" className="py-16 lg:py-24">
        <div className="container-wide">
          <SectionMeta code="SEC 01" label="Purpose" marker="PURPOSE" tone="twilight" />
          <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-12">
            {missionVision.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <p className="mono-label text-amber">{item.code}</p>
                <h2 className="display mt-4 text-[1.5rem] text-cirrus">{item.title}</h2>
                <p className="measure mt-4 text-[0.9375rem] leading-[1.7] text-steel">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Why the institute */}
      <Section tone="apron" className="py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeader
            level={2}
            eyebrow="Why the institute"
            heading="Four things candidates ask about, answered plainly."
            body={
              <p>
                Faculty experience, practical training, interview preparation and placement support — with
                the boundary of what assistance means stated up front.
              </p>
            }
            aside={
              <figure className="overflow-hidden rounded-[var(--radius-md)] border border-hairline bg-apron">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/images/candidate-desk.jpg"
                    alt="A candidate in a white shirt and tie working at a campus desk with a notebook and tablet, beside sunflowers and a framed certificate."
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-3 border-t border-hairline px-4 py-3">
                  <span className="mono-label text-steel-deep">At the campus desk</span>
                  <span className="mono-label text-steel-deep">Institute photograph</span>
                </figcaption>
              </figure>
            }
          />

          <ul className="mt-12 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
            {site.pillars.map((pillar, index) => (
              <Reveal as="li" key={pillar.title} delay={index * 60}>
                <div className="h-full bg-apron p-7">
                  <p className="mono-label text-amber">{pillar.code}</p>
                  <h3 className="display mt-4 text-[1.25rem] text-cirrus">{pillar.title}</h3>
                  <p className="measure mt-3 text-[0.9375rem] leading-[1.7] text-steel">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* How training runs */}
      <Section tone="cloud" className="py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeader
            level={2}
            eyebrow="The seven stations"
            heading="From ground school to interview room, in a fixed order."
            tone="light"
            body={
              <p>
                Presence, language, safety, service, operations, selection and composure. Modules are
                assessed as they are taught, and gaps are found in the classroom rather than the interview.
              </p>
            }
          />
          <div className="mt-10">
            <Action href="/programs" variant="light" size="lg">
              See the programme tracks
            </Action>
          </div>
        </div>
      </Section>

      <FaqSection />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd(faqs))} />
    </>
  );
}