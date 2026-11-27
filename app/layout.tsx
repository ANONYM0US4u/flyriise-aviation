import type { Metadata, Viewport } from "next";
import { Archivo, B612_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

import { MotionProvider } from "@/components/motion/motion-provider";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { site } from "@/data/site";
import { organizationJsonLd, jsonLdScript, websiteJsonLd } from "@/lib/seo";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  axes: ["wdth"],
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const b612 = B612_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-b612",
  weight: ["400", "700"],
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

const description =
  "Aviation and hospitality training in Barrackpore, Kolkata: cabin crew, airport management, ground staff and hospitality programmes with grooming, safety, service and interview preparation.";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain.url),
  title: {
    default: `${site.brand.name} — aviation & hospitality training in Barrackpore, Kolkata`,
    template: `%s · ${site.brand.name}`,
  },
  description,
  applicationName: site.brand.name,
  keywords: [
    "aviation training institute Kolkata",
    "cabin crew training Barrackpore",
    "airport management diploma",
    "ground staff training",
    "hospitality management training Kolkata",
    "aviation and hospitality career",
  ],
  authors: [{ name: site.brand.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.brand.name,
    url: "/",
    title: `${site.brand.name} — aviation & hospitality training`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brand.name} — aviation & hospitality training`,
    description,
  },
  robots: { index: true, follow: true },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#070b14",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${archivo.variable} ${b612.variable}`}>
      <body className="pb-[4.75rem] lg:pb-0">
        <a
          href="#main"
          className="mono-label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-sm)] focus:bg-amber focus:px-4 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>

        <MotionProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <MobileActionBar />
        </MotionProvider>

        <script
          type="application/ld+json"
          // Structured data is generated from centralised content only.
          dangerouslySetInnerHTML={jsonLdScript({
            "@context": "https://schema.org",
            "@graph": [organizationJsonLd(), websiteJsonLd()],
          })}
        />
      </body>
    </html>
  );
}