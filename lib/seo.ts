import type { Metadata } from "next";
import { site } from "@/data/site";
import { programs } from "@/data/programs";
import type { Faq } from "@/data/faqs";

const BASE = site.domain.url.replace(/\/$/, "");

export function absoluteUrl(path = "/"): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.brand.name,
      locale: "en_IN",
      type: type === "article" ? "article" : "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Organisation schema. Contains only details the institute publishes, and
 * deliberately no ratings, awards, accreditations or partnership claims.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.brand.name,
    legalName: site.brand.legalName,
    url: BASE,
    email: site.contact.email.display,
    telephone: site.contact.phone.display,
    description: site.brand.positioning,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address.lines[0],
      addressLocality: site.contact.address.locality,
      addressRegion: site.contact.address.region,
      addressCountry: site.contact.address.country,
    },
    areaServed: "IN",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.brand.name,
    url: BASE,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.join(" "),
      },
    })),
  };
}

/** Course schema without duration/price claims that have not been confirmed. */
export function courseJsonLd(slug: string) {
  const program = programs.find((item) => item.slug === slug);
  if (!program) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.name,
    description: program.summary,
    url: absoluteUrl(`/programs/${program.slug}`),
    inLanguage: "en-IN",
    provider: {
      "@type": "EducationalOrganization",
      name: site.brand.name,
      url: BASE,
    },
    ...(program.duration ? { timeRequired: program.duration } : {}),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: site.contact.address.locality,
    },
  };
}

export function jsonLdScript(data: object) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
