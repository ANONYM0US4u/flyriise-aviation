import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { renderLegalText } from "@/components/ui/legal-text";
import { legalDocs } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { mailHref } from "@/lib/contact";

export function generateStaticParams() {
  return legalDocs.map((doc) => ({ doc: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const found = legalDocs.find((item) => item.slug === doc);
  if (!found) return {};
  return buildMetadata({
    title: found.title,
    description: found.summary,
    path: `/legal/${found.slug}`,
  });
}

export default async function LegalDocPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const found = legalDocs.find((item) => item.slug === doc);
  if (!found) notFound();

  return (
    <>
      <PageHeader
        eyebrow={`Legal · ${found.shortLabel}`}
        title={found.title}
        lede={<p>{found.summary}</p>}
        meta={
          <>
            <span>Last revised {found.lastUpdated}</span>
          </>
        }
      />

      <Section tone="cloud" className="py-16 lg:py-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <nav aria-label="Legal documents" className="lg:col-span-3">
              <p className="mono-label text-graphite">Trust centre</p>
              <ul className="mt-5 space-y-3">
                {legalDocs.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/legal/${item.slug}`}
                      aria-current={item.slug === found.slug ? "page" : undefined}
                      className={
                        item.slug === found.slug
                          ? "mono-label inline-flex items-center gap-2 text-ink underline underline-offset-4"
                          : "mono-label inline-flex items-center gap-2 text-graphite hover:text-ink"
                      }
                    >
                      <span aria-hidden className={item.slug === found.slug ? "h-1 w-1 rounded-full bg-amber" : "h-1 w-1 rounded-full bg-transparent"} />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/legal" className="mono-label mt-6 inline-block text-graphite underline underline-offset-4">
                All trust information
              </Link>
            </nav>

            <article className="lg:col-span-9">
              <div className="space-y-12">
                {found.sections.map((section, index) => (
                  <Reveal key={section.heading} delay={index * 40}>
                    <section>
                      <h2 className="display text-[1.375rem] text-ink">
                        <span className="mono-label mr-3 text-graphite">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {section.heading}
                      </h2>
                      <div className="mt-4 space-y-4">
                        {section.body.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="measure text-[1rem] leading-[1.72] text-graphite"
                          >
                            {renderLegalText(paragraph)}
                          </p>
                        ))}
                      </div>
                    </section>
                  </Reveal>
                ))}
              </div>

              <div className="mt-14 rounded-[var(--radius-md)] border border-hairline-light bg-cirrus p-6">
                <p className="mono-label text-graphite">Questions about this document</p>
                <p className="measure mt-3 text-[0.9375rem] leading-[1.7] text-ink">
                  {site.brand.legalName} — admissions {site.contact.phone.display} ·{" "}
                  <a href={mailHref} className="underline underline-offset-4">
                    {site.contact.email.display}
                  </a>
                </p>
                <p className="mono-label mt-4 text-graphite normal-case tracking-[0.03em]">
                  Grievance details are published on the contact page once the grievance officer is
                  nominated.
                </p>
              </div>
            </article>
          </div>
        </div>
      </Section>
    </>
  );
}