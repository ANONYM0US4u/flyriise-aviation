import type { MetadataRoute } from "next";
import { legalDocs } from "@/data/legal";
import { programs } from "@/data/programs";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const primary: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/programs"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/placement"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/campus"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/apply"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/legal"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  const programmeRoutes: MetadataRoute.Sitemap = programs.map((program) => ({
    url: absoluteUrl(`/programs/${program.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const legalRoutes: MetadataRoute.Sitemap = legalDocs.map((doc) => ({
    url: absoluteUrl(`/legal/${doc.slug}`),
    lastModified: new Date(doc.lastUpdated),
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  return [...primary, ...programmeRoutes, ...legalRoutes];
}