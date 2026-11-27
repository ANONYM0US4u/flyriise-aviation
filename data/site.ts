import { type Claim, placeholder } from "@/lib/claims";

/**
 * SITE IDENTITY
 * ---------------------------------------------------------------------------
 * Centralised so the client can update factual details in one place (brief
 * §13A "no hard-coded factual copy inside visual components").
 *
 * Values sourced from the client's own public website are marked `reference`
 * and must be confirmed before launch — see docs/INPUTS_NEEDED.md.
 */

export const site = {
  brand: {
    name: "Flyriise Aviation",
    shortName: "Flyriise",
    legalName: "Flyriise Aviation & Hospitality Services Private Limited",
    descriptor: "Aviation & hospitality training",
    /** Positioning line used in the footer + metadata. */
    positioning: "Aviation and hospitality training institute in Barrackpore, Kolkata.",
    foundedNote: null as string | null,
  },

  domain: {
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.flyriiseaviation.in",
    locale: "en_IN",
  },

  contact: {
    phone: {
      display: "+91 84209 94153",
      href: "tel:+918420994153",
      claim: { status: "reference", source: "client public website", asOf: "2026-10-04" } satisfies Claim,
    },
    whatsapp: {
      /** International format, digits only — used by wa.me links. */
      number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917595952320",
      display: "+91 75959 52320",
      claim: { status: "reference", source: "client instruction", asOf: "2026-11-27" } satisfies Claim,
    },
    email: {
      display: "info@flyriiseaviation.in",
      href: "mailto:info@flyriiseaviation.in",
      claim: { status: "reference", source: "client public website", asOf: "2026-10-04" } satisfies Claim,
    },
    address: {
      lines: [
        "199 Barasat Road",
        "P.O. Nona Chandan Purkur",
        "Barrackpore, North 24 Parganas",
        "West Bengal, India",
      ],
      /** Postal code not supplied publicly — do not invent one. */
      postalCode: null as string | null,
      locality: "Barrackpore",
      region: "West Bengal",
      country: "IN",
      claim: { status: "reference", source: "client public website", asOf: "2026-10-04" } satisfies Claim,
    },
    hours: {
      value: null as string | null,
      placeholder: placeholder("BUSINESS HOURS"),
      claim: {
        status: "placeholder",
        note: "Admissions desk hours have not been supplied. Confirm weekdays/Saturdays and timings.",
      } satisfies Claim,
    },
    mapQuery: "199 Barasat Road, Barrackpore, North 24 Parganas, West Bengal",
  },

  /** Institute registration / compliance block (brief §03, §17). */
  registration: {
    entityType: "Private limited company registered in India",
    entityTypeClaim: {
      status: "reference",
      source: "client public website",
      asOf: "2026-10-04",
      note: "Registration certificate not sighted — confirm entity name, CIN and date of incorporation.",
    } satisfies Claim,
    cin: null as string | null,
    cinPlaceholder: placeholder("COMPANY REGISTRATION NUMBER (CIN)"),
    gstin: null as string | null,
    gstinPlaceholder: placeholder("GSTIN, IF APPLICABLE"),
    affiliations: [] as string[],
    affiliationsPlaceholder: placeholder("OFFICIAL AFFILIATIONS / ACCREDITATIONS, IF ANY"),
    note: "Registered as a private limited company in India. No accreditation, affiliation or regulator recognition is claimed anywhere on this site.",
  },

  /** Grievance officer details (brief §03, §21). */
  grievance: {
    officerName: null as string | null,
    officerPlaceholder: placeholder("GRIEVANCE OFFICER NAME & DESIGNATION"),
    email: null as string | null,
    emailPlaceholder: placeholder("GRIEVANCE EMAIL"),
    phone: null as string | null,
    phonePlaceholder: placeholder("GRIEVANCE PHONE"),
    acknowledgementWindow: placeholder("ACKNOWLEDGEMENT & RESOLUTION TIMELINE"),
  },

  /** Short trust strip shown under the hero — no numeric claims. */
  trustStrip: [
    {
      label: "Registered private limited company",
      claim: { status: "reference", source: "client public website" } satisfies Claim,
    },
    {
      label: "Campus in Barrackpore, Kolkata",
      claim: { status: "reference", source: "client public website" } satisfies Claim,
    },
    {
      label: "Cabin crew · airport · ground operations · hospitality tracks",
      claim: { status: "reference", source: "client public website" } satisfies Claim,
    },
    {
      label: "Grooming, safety, service and interview preparation in every track",
      claim: { status: "reference", source: "client public website" } satisfies Claim,
    },
  ],

  /** "Why the institute" pillars (brief §10 section direction). */
  pillars: [
    {
      code: "01",
      title: "Practitioner-led training",
      body: "Sessions are led by trainers with airline and hospitality floor experience, teaching the standards recruiters actually screen for.",
      claim: { status: "reference", source: "client public website" } satisfies Claim,
    },
    {
      code: "02",
      title: "Scenario-first delivery",
      body: "Passenger handling, service recovery, safety drills and grooming are rehearsed as scenarios, not summarised as slides.",
      claim: { status: "reference", source: "client public website" } satisfies Claim,
    },
    {
      code: "03",
      title: "Interview preparation built in",
      body: "Group discussions, personal interviews and airline-style mock panels run alongside the syllabus rather than as an afterthought.",
      claim: { status: "reference", source: "client public website" } satisfies Claim,
    },
    {
      code: "04",
      title: "Placement assistance programme",
      body: "A placement cell coordinates drives and recruiter introductions. Assistance is support — not a guarantee of employment.",
      claim: {
        status: "reference",
        source: "client public website",
        note: "Placement assistance exists per the client. No rates or guarantees are published here.",
      } satisfies Claim,
    },
  ],

  /** Standard short lines reused by navigation, footer and CTAs. */
  cta: {
    apply: "Apply Now",
    enquire: "Enquire Now",
    whatsapp: "WhatsApp",
    call: "Call",
    programs: "View programmes",
  },
} as const;

export type Site = typeof site;
