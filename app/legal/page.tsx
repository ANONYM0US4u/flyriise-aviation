import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionMeta } from "@/components/ui/section";
import { Action } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { legalDocs } from "@/data/legal";
import { site } from "@/data/site";
import { registrationDisclaimer } from "@/data/legal-disclaimer";
import { buildMetadata } from "@/lib/seo";
import { mailHref } from "@/lib/contact";

export const metadata: Metadata = buildMetadata({
  title: "Trust centre",
  description:
    "Registration details, grievance contact, privacy, terms, refund policy and the institute's data and claims policy.",
  path: "/legal",
});

const policies = [
  {
    title: "Claims policy",
    points: [
      "No placement rate, salary, award or accreditation is published without evidence held on file.",
      "Every statistic states its definition, cohort, period, numerator, denominator and verification date.",
      "High-risk outcome language — guarantees, superlatives, 100% claims — is rejected by the build.",
    ],
  },
  {
    title: "Partner policy",
    points: [
      "Hiring partners appear only with current written authorization and approved logo usage.",
      "Employers named as graduate destinations are labelled as destinations — never as partners.",
      "No airline liveries, logos or brand marks are reproduced without permission.",
    ],
  },
  {
    title: "Privacy practice",
    points: [
      "Enquiry data is used only to answer the enquiry.",
      "No advertising cookies, no third-party pixels, no cross-site tracking.",
      "Personal data is kept out of application logs.",
    ],
  },
];

export default function LegalIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trust centre"
        title={<>What we publish, and what we refuse to.</>}
        lede={
          <>
            <p>
              Compliance information is treated as part of the brand, not as footer filler. This page
              lists every policy document, the institute&rsquo;s registration status, the grievance route, and
              the rules this website holds itself to.
            </p>
          </>
        }
        meta={
          <>
            <span>4 policy documents</span>
            <span>Zero tracking cookies</span>
          </>
        }
      />

      <Section tone="cloud" className="py-16 lg:py-24">
        <div className="container-wide">
          <SectionMeta code="DOCUMENTS" label="Policies" marker="STATED" tone="light" />

          <ul className="grid gap-6 lg:grid-cols-2">
            {legalDocs.map((doc, index) => (
              <Reveal as="li" key={doc.slug} delay={index * 55}>
                <Link
                  href={`/legal/${doc.slug}`}
                  className="group flex h-full flex-col rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-6 transition-colors hover:border-ink"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="mono-label text-graphite">{doc.shortLabel}</span>
                  </div>
                  <h2 className="display mt-4 text-[1.25rem] text-ink">{doc.title}</h2>
                  <p className="measure mt-3 text-[0.9375rem] leading-[1.7] text-graphite">{doc.summary}</p>
                  <span className="mono-label mt-6 inline-flex items-center gap-2 text-ink">
                    Read document
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <SectionMeta code="REGISTRATION" label="Institute details" marker="ON RECORD" tone="light" />
              <div className="mt-6 space-y-4">
                <div>
                  <p className="mono-label text-graphite">Legal name</p>
                  <p className="mt-1 text-[0.9375rem] text-ink">{site.brand.legalName}</p>
                </div>
                <div>
                  <p className="mono-label text-graphite">Entity type</p>
                  <p className="mt-1 text-[0.9375rem] text-ink">{site.registration.entityType}</p>
                </div>
                {site.registration.cin || site.registration.gstin ? (
                  <div className="flex flex-wrap gap-2">
                    {site.registration.cin ? (
                      <p className="mono-label text-ink">CIN {site.registration.cin}</p>
                    ) : null}
                    {site.registration.gstin ? (
                      <p className="mono-label text-ink">GSTIN {site.registration.gstin}</p>
                    ) : null}
                  </div>
                ) : null}
                {site.registration.affiliations.length > 0 ? (
                  <div>
                    <p className="mono-label text-graphite">Affiliations</p>
                    {site.registration.affiliations.map((item) => (
                      <p key={item} className="mt-1 text-[0.9375rem] text-ink">
                        {item}
                      </p>
                    ))}
                  </div>
                ) : null}
                <p className="measure-tight mt-4 text-[0.8125rem] leading-[1.7] text-graphite">
                  {registrationDisclaimer}
                </p>
              </div>

              <div className="mt-8">
                <p className="mono-label text-graphite">Grievance contact</p>
                <div className="mt-3 space-y-2">
                  {site.grievance.officerName ? (
                    <p className="text-[0.9375rem] text-ink">{site.grievance.officerName}</p>
                  ) : null}
                  <p className="text-[0.9375rem] text-ink">
                    <a href={mailHref} className="underline underline-offset-4">
                      {site.grievance.email ?? site.contact.email.display}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <SectionMeta code="POLICY" label="How we operate" marker="STATED" tone="light" />
              <div className="mt-6 space-y-8">
                {policies.map((policy) => (
                  <div key={policy.title}>
                    <h2 className="display text-[1.0625rem] text-ink">{policy.title}</h2>
                    <ul className="mt-3 space-y-2">
                      {policy.points.map((point) => (
                        <li key={point} className="flex items-baseline gap-3 text-[0.9375rem] leading-[1.65] text-graphite">
                          <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-5">
                <p className="mono-label text-graphite">Spotted an error?</p>
                <p className="measure mt-3 text-[0.9375rem] leading-[1.7] text-ink">
                  Accuracy matters more than polish here. If something on this site is out of date or
                  wrong, tell the admissions desk and it will be corrected.
                </p>
                <Action href="/contact#enquire" variant="light" className="mt-4">
                  Report an error
                </Action>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}