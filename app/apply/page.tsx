import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ApplyWizard } from "@/components/forms/apply-wizard";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionMeta } from "@/components/ui/section";
import { Check } from "@/components/ui/icons";
import { Action } from "@/components/ui/button";
import { telHref, whatsappHref } from "@/lib/contact";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata: Metadata = buildMetadata({
  title: "Apply now",
  description:
    "Apply to Flyriise Aviation in three steps: choose a track, give your details, and confirm. A reference number is issued on submission.",
  path: "/apply",
});

const expectations = [
  "You choose a programme — or ask us to advise if you are unsure.",
  "You give the details admissions needs for one call: name, phone, email and location.",
  "You confirm, and a reference number is issued immediately.",
];

const boundaries = [
  "Applying is not an admission offer. Seats are confirmed after eligibility and documentation checks.",
  "No placement or employment is guaranteed by submitting this form.",
  "Your details are used only to respond to this application — see the privacy policy.",
  "Fees are discussed at counselling and never collected through this form.",
];

export default function ApplyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admissions"
        title={<>Three steps, one reference number.</>}
        lede={
          <p>
            The application is deliberately short. Complete it online, or start on WhatsApp if you would
            rather talk it through — the admissions desk handles both.
          </p>
        }
        meta={
          <>
            <span>Takes about three minutes</span>
            <span>Reference issued on submission</span>
            <span>No payment collected here</span>
          </>
        }
        aside={
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Action
              href={whatsappHref("Hello Flyriise Aviation, I would like to start an application.")}
              external
              variant="secondary"
              size="lg"
            >
              Start on WhatsApp
            </Action>
            <Action href={telHref} variant="secondary" size="lg">
              {site.contact.phone.display}
            </Action>
          </div>
        }
      />

      <Section tone="cloud" className="py-16 lg:py-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Grid column, not a page-level landmark: axe-core rejects an
                <aside> nested inside a labelled section (A11Y-2). */}
            <div className="lg:col-span-4">
              <SectionMeta code="BEFORE" label="What happens" marker="APPLICATION" tone="light" />
              <ol className="mt-6 space-y-5">
                {expectations.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-[1.7] text-ink">
                    <span className="mono-label mt-1 text-graphite">{String(index + 1).padStart(2, "0")}</span>
                    {item}
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-5">
                <p className="mono-label text-graphite">Keep ready</p>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Photo ID and date of birth",
                    "10th / 12th marksheets",
                    "Recent passport-style photograph",
                    "Any medical or fitness record your track requires",
                  ].map((item) => (
                    <li key={item} className="flex items-baseline gap-3 text-[0.875rem] leading-[1.6] text-graphite">
                      <Check className="h-3.5 w-3.5 shrink-0 text-verified" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mono-label mt-4 text-graphite normal-case tracking-[0.03em]">
                  Documents are checked at counselling. Nothing is uploaded on this page.
                </p>
              </div>

              <div className="mt-6 rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-5">
                <p className="mono-label text-graphite">Before you submit</p>
                <ul className="mt-4 space-y-2.5">
                  {boundaries.map((item) => (
                    <li key={item} className="flex items-baseline gap-3 text-[0.875rem] leading-[1.6] text-graphite">
                      <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-graphite" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8">
              <Reveal>
                <ApplyWizard />
              </Reveal>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}