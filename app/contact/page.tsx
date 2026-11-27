import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Action } from "@/components/ui/button";
import { Mail, Phone, Pin, WhatsApp } from "@/components/ui/icons";
import { Section, SectionMeta } from "@/components/ui/section";
import { site } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import { mailHref, telHref, whatsappHref } from "@/lib/contact";
import { registrationDisclaimer } from "@/data/legal-disclaimer";

export const metadata: Metadata = buildMetadata({
  title: "Contact & admissions",
  description:
    "Contact the Flyriise Aviation admissions desk by phone, WhatsApp, email or enquiry form. Campus address in Barrackpore, North 24 Parganas, West Bengal.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={<>Talk to a person, not a form.</>}
        lede={
          <p>
            Admissions answers phone calls, WhatsApp messages and emails during working hours. Call if you
            would rather talk it through than type it.
          </p>
        }
        meta={
          <>
            <span>{site.contact.phone.display}</span>
            <span>{site.contact.email.display}</span>
            <span>Walk-ins welcome on weekdays</span>
          </>
        }
        aside={
          <div className="grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-hairline bg-hairline sm:grid-cols-3">
            {[
              { href: telHref, label: "Call", icon: Phone, value: site.contact.phone.display },
              {
                href: whatsappHref("Hello Flyriise Aviation, I have a question about your programmes."),
                label: "WhatsApp",
                icon: WhatsApp,
                value: "Fastest reply",
                external: true,
              },
              { href: mailHref, label: "Email", icon: Mail, value: site.contact.email.display },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex flex-col gap-3 bg-apron p-5 transition-colors hover:bg-twilight"
              >
                <item.icon className="h-5 w-5 text-amber" />
                <span className="mono-label text-steel-deep">{item.label}</span>
                <span className="text-[0.9375rem] text-cirrus group-hover:text-amber">{item.value}</span>
              </a>
            ))}
          </div>
        }
      />

      {/* Enquiry form */}
      <Section tone="cloud" id="enquire" className="scroll-mt-24 py-16 lg:py-24">
        <div className="container-wide">
          <SectionMeta code="ENQUIRE" label="Enquiry form" marker="ADMISSIONS" tone="light" />
          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="mono-label text-graphite">What happens next</p>
              <ol className="mt-6 space-y-5">
                {[
                  {
                    title: "A real person reads it",
                    body: "Admissions reviews your details and calls you — usually the same working day.",
                  },
                  {
                    title: "You get current facts",
                    body: "Eligibility, duration, fee structure and the next batch date are confirmed on that call.",
                  },
                  {
                    title: "You decide without pressure",
                    body: "Counselling is not a sales call. If the track is wrong for you, you will be told.",
                  },
                ].map((item, index) => (
                  <li key={item.title} className="border-t border-hairline-light pt-4">
                    <p className="mono-label text-ink">{String(index + 1).padStart(2, "0")}</p>
                    <h2 className="display mt-2 text-[1.0625rem] text-ink">{item.title}</h2>
                    <p className="mt-2 text-[0.9375rem] leading-[1.65] text-graphite">{item.body}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-5">
                <p className="mono-label text-graphite">Prefer to apply formally?</p>
                <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink">
                  The application flow is three steps and issues a reference number on submission.
                </p>
                <Action href="/apply" variant="light" className="mt-4 w-full">
                  Start an application
                </Action>
              </div>
            </div>

            <div className="lg:col-span-8">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </Section>

      {/* Location + grievance */}
      <Section tone="twilight" className="py-16 lg:py-24">
        <div className="container-wide">
          <SectionMeta code="DETAILS" label="Location & grievance" marker="BARRACKPORE" tone="twilight" />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <h2 className="display text-display-3 text-cirrus">Where to find us</h2>
              <address className="mt-6 flex items-start gap-3 text-[1.0625rem] leading-[1.75] text-steel not-italic">
                <Pin className="mt-1.5 h-5 w-5 shrink-0 text-amber" />
                <span>
                  {site.contact.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </address>
              <div className="mt-8 rounded-[var(--radius-md)] border border-hairline p-5">
                <p className="mono-label text-amber">Indicative location</p>
                <svg
                  viewBox="0 0 480 240"
                  className="mt-4 w-full"
                  role="img"
                  aria-label="Indicative map showing the campus on Barasat Road in Barrackpore"
                >
                  <g fill="none" stroke="#e6edf6" strokeOpacity="0.3" strokeWidth="1.2">
                    <path d="M0 168H480" strokeOpacity="0.25" />
                    <path d="M0 168h480" strokeDasharray="14 12" strokeOpacity="0.2" />
                    <path d="M120 0v168M300 40v128" strokeOpacity="0.18" strokeDasharray="10 10" />
                    <path d="M0 60h480" strokeOpacity="0.12" />
                  </g>
                  <rect x="180" y="96" width="66" height="52" fill="#ffb224" fillOpacity="0.14" stroke="#ffb224" strokeOpacity="0.5" />
                  <circle cx="213" cy="122" r="6" fill="#ffb224" />
                  <g fill="#e6edf6" opacity="0.5" fontSize="10" letterSpacing="1.6">
                    <text x="16" y="160">BARASAT ROAD</text>
                    <text x="308" y="52">BARRACKPORE</text>
                    <text x="16" y="52">NORTH 24 PARGANAS</text>
                  </g>
                  <g fill="#ffb224" fontSize="10" letterSpacing="1.8">
                    <text x="180" y="88">CAMPUS</text>
                  </g>
                </svg>
                <p className="mono-label mt-2 text-steel-deep normal-case tracking-[0.03em]">
                  Indicative only. Exact directions are shared when a visit is scheduled.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <h2 className="display text-display-3 text-cirrus">Grievance &amp; compliance</h2>
              <p className="measure mt-6 text-[0.9375rem] leading-[1.7] text-steel">
                Concerns about admissions, conduct, fees or this website should be raised with the
                admissions team using the contact details above. Requests are acknowledged in writing.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  site.grievance.officerName,
                  site.grievance.email,
                  site.grievance.phone,
                ].some(Boolean)
                  ? [site.grievance.officerName, site.grievance.email, site.grievance.phone].map(
                      (value, index) =>
                        value ? (
                          <p key={index} className="text-[0.9375rem] text-cirrus">
                            {value}
                          </p>
                        ) : null,
                    )
                  : null}
              </div>

              <div className="mt-8 border-t border-hairline pt-6">
                <p className="mono-label text-steel-deep">What we do not claim</p>
                <p className="measure mt-3 text-[0.875rem] leading-[1.7] text-steel-deep">
                  {registrationDisclaimer}
                </p>
                <p className="mono-label mt-5 text-steel-deep normal-case tracking-[0.03em]">
                  Data handling is described in the privacy policy. This form sets no tracking cookies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}