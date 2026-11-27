import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ImageSlot } from "@/components/ui/image-slot";
import { Section, SectionHeader, SectionMeta } from "@/components/ui/section";
import { ArrowRight } from "@/components/ui/icons";
import { facilities, photoSlots, visitSteps } from "@/data/campus";
import { campusSection } from "@/data/home";
import { site } from "@/data/site";

/**
 * SECTION 9 — Campus / atmosphere (brief §10 section 9).
 * The campus is described structurally (what happens in each room) with a plan
 * diagram, and photography is requested explicitly rather than faked with
 * stock imagery that would misrepresent the institute.
 */
export function CampusPreview() {
  return (
    <Section tone="cloud" id="campus" labeledBy="campus-heading" className="py-20 lg:py-28">
      <div className="container-wide">
        <SectionMeta code="SEC 09" label="Campus" marker="APPROACH" tone="light" />

        <SectionHeader
          level={2}
          id="campus-heading"
          eyebrow={campusSection.eyebrow}
          heading={campusSection.heading}
          tone="light"
          className="mt-10"
          body={<p>{campusSection.body}</p>}
          aside={
            <div className="rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-5">
              <p className="mono-label text-graphite">Find us</p>
              <address className="mt-3 text-[0.9375rem] leading-[1.7] text-ink not-italic">
                {site.contact.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="mono-label mt-4 text-graphite">
                Walk-ins welcome on weekdays · directions confirmed on call
              </p>
              <Link
                href="/campus"
                className="mono-label mt-4 inline-flex items-center gap-2 text-ink underline underline-offset-4"
              >
                Campus &amp; visit details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          }
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Facility manifest */}
          <Reveal className="lg:col-span-6">
            <p className="mono-label text-graphite">Facility manifest</p>
            <ol className="mt-5 border-t border-hairline-light">
              {facilities.map((facility) => (
                <li
                  key={facility.code}
                  className="grid grid-cols-12 items-baseline gap-4 border-b border-hairline-light py-4"
                >
                  <span className="mono-label col-span-2 text-graphite">{facility.code}</span>
                  <span className="col-span-10">
                    <span className="block text-[0.9375rem] text-ink">{facility.name}</span>
                    <span className="mt-1 block text-[0.875rem] leading-[1.6] text-graphite">
                      {facility.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* Plan diagram + photography requests */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="rounded-[var(--radius-md)] border border-hairline-light bg-apron p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="mono-label text-amber">Plan view · indicative</p>
                  <p className="mono-label text-steel-deep">Not to scale</p>
                </div>
                <svg viewBox="0 0 480 300" className="mt-4 w-full" role="img" aria-label="Indicative plan of the campus and its surroundings">
                  <g fill="none" stroke="#e6edf6" strokeOpacity="0.35" strokeWidth="1.2">
                    {/* Roads */}
                    <path d="M0 214H480" strokeOpacity="0.25" />
                    <path d="M0 214h480" strokeDasharray="14 12" strokeOpacity="0.2" />
                    <path d="M352 0v214" strokeOpacity="0.2" strokeDasharray="14 12" />
                    {/* Campus block */}
                    <rect x="96" y="64" width="188" height="118" rx="3" strokeOpacity="0.75" />
                    <path d="M96 112h188M190 64v118" strokeOpacity="0.4" />
                    {/* Rooms */}
                    <rect x="110" y="78" width="66" height="24" strokeOpacity="0.45" />
                    <rect x="204" y="78" width="66" height="24" strokeOpacity="0.45" />
                    <rect x="110" y="126" width="66" height="42" strokeOpacity="0.45" />
                    <rect x="204" y="126" width="66" height="42" strokeOpacity="0.45" />
                    {/* Approach */}
                    <path d="M284 182h56v32h-56z" strokeOpacity="0.5" strokeDasharray="6 6" />
                    <path d="M340 198h84" strokeOpacity="0.35" strokeDasharray="8 8" />
                    <circle cx="330" cy="198" r="4" stroke="#ffb224" strokeOpacity="1" />
                  </g>
                  <g fill="#e6edf6" fontSize="10" letterSpacing="1.6" opacity="0.6">
                    <text x="110" y="94">THEORY</text>
                    <text x="204" y="94">GROOMING</text>
                    <text x="110" y="142">SERVICE</text>
                    <text x="204" y="142">INTERVIEW</text>
                  </g>
                  <g fill="#ffb224" fontSize="10" letterSpacing="1.8">
                    <text x="284" y="176">ENTRY</text>
                    <text x="96" y="56">CAMPUS BLOCK</text>
                  </g>
                  <g fill="#e6edf6" fontSize="10" letterSpacing="1.6" opacity="0.45">
                    <text x="12" y="206">BARASAT ROAD</text>
                    <text x="360" y="20">NORTH ↑</text>
                  </g>
                </svg>
                <p className="mono-label mt-3 text-steel-deep normal-case tracking-[0.03em]">
                  Indicative layout for orientation only.
                </p>
              </div>
            </Reveal>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {photoSlots.slice(0, 2).map((slot, index) => (
                <Reveal key={slot.id} delay={index * 70}>
                  <ImageSlot slot={slot} compact />
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Visit sequence */}
        <Reveal className="mt-14">
          <p className="mono-label text-graphite">Visiting &amp; admissions</p>
          <ol className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {visitSteps.map((step) => (
              <li key={step.code} className="border-t border-hairline-light pt-4">
                <p className="mono-label text-ink">{step.code}</p>
                <h3 className="display mt-3 text-[1rem] text-ink">{step.title}</h3>
                <p className="mt-2 text-[0.875rem] leading-[1.65] text-graphite">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
