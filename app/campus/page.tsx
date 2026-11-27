import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/motion/reveal";
import { ImageSlot } from "@/components/ui/image-slot";
import { Action } from "@/components/ui/button";
import { Mail, Phone, Pin, WhatsApp } from "@/components/ui/icons";
import { Section, SectionHeader, SectionMeta } from "@/components/ui/section";
import { FinalCta } from "@/components/home/final-cta";
import { facilities, photoSlots, visitSteps } from "@/data/campus";
import { site } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import { mailHref, telHref, whatsappHref } from "@/lib/contact";

export const metadata: Metadata = buildMetadata({
  title: "Campus",
  description:
    "The Barrackpore campus: training rooms, grooming studio, service practice area, interview room and the admissions desk, plus how to book a visit.",
  path: "/campus",
});

export default function CampusPage() {
  return (
    <>
      <PageHeader
        eyebrow="Campus"
        title={<>Training happens in rooms built for rehearsal.</>}
        lede={
          <p>
            The Barrackpore campus is where grooming assessments, service practice, mock interview panels
            and counselling sessions run. Facilities are described room by room below, alongside the
            institute&rsquo;s own photographs of the campus.
          </p>
        }
        meta={
          <>
            <span>199 Barasat Road · Barrackpore · North 24 Parganas</span>
            <span>Walk-ins welcome on weekdays</span>
          </>
        }
        aside={
          <div className="rounded-[var(--radius-md)] border border-hairline p-5">
            <p className="mono-label text-amber">Address</p>
            <address className="mt-3 text-[0.9375rem] leading-[1.7] text-cirrus not-italic">
              {site.contact.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <div className="mt-5 flex flex-col gap-2">
              <a href={telHref} className="mono-label inline-flex items-center gap-2 text-steel hover:text-amber">
                <Phone className="h-4 w-4" />
                {site.contact.phone.display}
              </a>
              <a href={whatsappHref()} className="mono-label inline-flex items-center gap-2 text-steel hover:text-amber">
                <WhatsApp className="h-4 w-4" />
                WhatsApp the desk
              </a>
              <a href={mailHref} className="mono-label inline-flex items-center gap-2 text-steel hover:text-amber">
                <Mail className="h-4 w-4" />
                {site.contact.email.display}
              </a>
            </div>
          </div>
        }
      />

      {/* Facilities */}
      <Section tone="twilight" className="py-16 lg:py-24">
        <div className="container-wide">
          <SectionMeta code="SEC 01" label="Facilities" marker="GROUND OPERATIONS" tone="twilight" />
          <SectionHeader
            level={2}
            eyebrow="Facility manifest"
            heading="Six places where the work gets practised."
            tone="twilight"
            className="mt-8"
            body={
              <p>
                Each space exists to rehearse something specific. Room names and descriptions reflect the
                activities the institute publishes; confirm the current layout on your visit.
              </p>
            }
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility, index) => (
              <Reveal as="li" key={facility.code} delay={index * 55}>
                <div className="h-full rounded-[var(--radius-md)] border border-hairline bg-apron/40 p-6">
                  <p className="mono-label text-amber">{facility.code}</p>
                  <h3 className="display mt-4 text-[1.125rem] text-cirrus">{facility.name}</h3>
                  <p className="measure-tight mt-3 text-[0.9375rem] leading-[1.7] text-steel">
                    {facility.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Photography */}
      <Section tone="apron" className="py-16 lg:py-24">
        <div className="container-wide">
          <SectionMeta code="SEC 02" label="Photography" marker="INSTITUTE PHOTOGRAPHS · OCT 2026" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {photoSlots.map((slot, index) => (
              <Reveal key={slot.id} delay={index * 60}>
                <ImageSlot slot={slot} />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Visit */}
      <Section tone="cloud" className="py-16 lg:py-24">
        <div className="container-wide">
          <SectionMeta code="SEC 03" label="Visits" marker="APPROACH" tone="light" />
          <SectionHeader
            level={2}
            eyebrow="Book a visit"
            heading="Four steps from first call to confirmed batch."
            tone="light"
            className="mt-8"
          />
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {visitSteps.map((step, index) => (
              <Reveal as="li" key={step.code} delay={index * 60}>
                <div className="border-t-2 border-ink pt-4">
                  <p className="mono-label text-ink">{step.code}</p>
                  <h3 className="display mt-3 text-[1.125rem] text-ink">{step.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-[1.65] text-graphite">{step.detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-6">
            <p className="text-[0.9375rem] leading-[1.65] text-ink">
              Visits are by appointment — book a slot before you travel.
            </p>
            <div className="flex flex-wrap gap-3">
              <Action href={whatsappHref("Hello, I would like to book a campus visit.")} external variant="primary">
                Book via WhatsApp
              </Action>
              <Action href="/contact#enquire" variant="light">
                Enquire
              </Action>
            </div>
          </div>

          <p className="mono-label mt-8 flex items-center gap-2 text-graphite">
            <Pin className="h-4 w-4" />
            Reachability: on the Barasat–Barrackpore route from Kolkata
          </p>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}