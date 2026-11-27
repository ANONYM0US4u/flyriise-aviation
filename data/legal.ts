import { type Claim } from "@/lib/claims";

/**
 * LEGAL DOCUMENTS — DRAFTS
 * ---------------------------------------------------------------------------
 * These are working drafts prepared for the client's legal review. They
 * describe how this website actually behaves (no non-essential cookies, no
 * third-party pixels, enquiry data used for admissions contact only) and leave
 * explicit placeholders wherever the institute's own policy must be supplied.
 *
 * They are NOT legal advice and must not be represented as compliant until a
 * competent reviewer signs them off. See docs/LEGAL_REVIEW.md.
 */

export type LegalSection = {
  heading: string;
  body: string[];
  /** True when the section contains values the client must supply. */
  needsClientInput?: boolean;
};

export type LegalDoc = {
  slug: string;
  title: string;
  shortLabel: string;
  summary: string;
  lastUpdated: string;
  draft: true;
  sections: LegalSection[];
  claim: Claim;
};

const draftClaim: Claim = {
  status: "placeholder",
  note: "Draft prepared for legal review. Must not be published as final without sign-off.",
};

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    shortLabel: "Privacy",
    summary:
      "What this website collects, why it is collected, how long it is kept, and how to have it corrected or deleted.",
    lastUpdated: "2026-10-04",
    draft: true,
    claim: draftClaim,
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you submit an enquiry or application, we collect the details you enter: your name, phone number, email address (optional), the programme you are interested in, your location (optional) and any message you write.",
          "We also receive the technical information any web server records to serve a page and keep the service available and secure.",
        ],
      },
      {
        heading: "Why we collect it",
        body: [
          "To respond to your enquiry, arrange counselling, share programme and batch information, and support your admission if you choose to proceed.",
          "We do not sell your details, and we do not use them for unrelated marketing.",
        ],
      },
      {
        heading: "Cookies and tracking",
        body: [
          "This website sets no advertising cookies and loads no third-party analytics, advertising or social pixels.",
          "If measurement or advertising tools are introduced later, they will only load after you actively consent, and you will be able to accept or reject them with equal ease.",
        ],
      },
      {
        heading: "Who can see your enquiry",
        body: [
          "Enquiry details are visible to the institute's admissions team and to staff who need them to respond to you.",
          "Where a candidate asks to be considered for a recruiter opportunity, relevant details may be shared with that recruiter with the candidate's knowledge.",
          "We do not publish enquiries, and we keep personal data out of application logs.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Enquiries are retained for as long as needed to answer them and to maintain admissions records, after which they are deleted or anonymised.",
        ],
        needsClientInput: true,
      },
      {
        heading: "Your choices",
        body: [
          "You can ask to see the details we hold about you, have them corrected, or have them deleted.",
          "To do so, contact the grievance contact listed on this site and we will action the request within a reasonable period.",
          "If you are below 18, please have a parent or guardian submit enquiries on your behalf, or tell us so we can involve them.",
        ],
      },
      {
        heading: "Security",
        body: [
          "Enquiry submissions are validated on the server, rate-limited, and stored on access-controlled infrastructure.",
          "No system is perfectly secure; if we become aware of a breach affecting your data, we will inform affected individuals as required by applicable law.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "Privacy questions and data requests can be raised with the grievance contact listed on this site and will be acknowledged in writing.",
        ],
        needsClientInput: true,
      },
    ],
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    shortLabel: "Terms",
    summary:
      "The terms on which this website, its content and the admissions process are offered.",
    lastUpdated: "2026-10-04",
    draft: true,
    claim: draftClaim,
    sections: [
      {
        heading: "Using this website",
        body: [
          "By using this site you agree to these terms. If you do not agree with them, please do not use the site.",
          "You agree not to misuse the site, attempt to disrupt it, submit false information, or use automated tools to submit enquiries.",
        ],
      },
      {
        heading: "Information on this site",
        body: [
          "Programme descriptions, durations, facilities and other information are provided for general guidance and may be updated as the institute's offering changes.",
          "Where a detail is confirmed only at counselling — such as final fees, batch dates or seat availability — the counselling information prevails.",
          "This site does not publish unverified placement figures, partnership claims or accreditation claims, and nothing on it should be read as a promise of employment.",
        ],
      },
      {
        heading: "Admissions",
        body: [
          "Submitting an enquiry or application does not create a contract or guarantee a seat. Admission is confirmed by the institute after documentation and eligibility checks.",
          "Programme fees, instalment options and refund terms are governed by the institute's admissions policy and the refund and cancellation policy published on this site.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "The site's design, text, graphics and code are owned by the institute or used with permission, and may not be reproduced commercially without written consent.",
          "Third-party names mentioned as career destinations remain the property of their respective owners and are used factually, without implying endorsement or partnership.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "The institute aims to keep this site accurate and available, but does not warrant uninterrupted availability or freedom from error.",
          "To the extent permitted by law, the institute is not liable for indirect or consequential loss arising from use of this site.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of India.",
        ],
        needsClientInput: true,
      },
      {
        heading: "Changes",
        body: [
          "These terms may be updated as the institute's policies change. The revision date shown on this page is updated when they change.",
        ],
      },
    ],
  },
  {
    slug: "refund-and-cancellation",
    title: "Refund & Cancellation Policy",
    shortLabel: "Refunds",
    summary:
      "How cancellations, refunds and batch changes are handled, and how to raise a request.",
    lastUpdated: "2026-10-04",
    draft: true,
    claim: draftClaim,
    sections: [
      {
        heading: "Status of this policy",
        body: [
          "This page sets out the institute's refund and cancellation structure. The applicable refund terms are confirmed to each candidate in writing at the time of admission.",
        ],
        needsClientInput: true,
      },
      {
        heading: "Cancellation by a candidate",
        body: [
          "The detailed refund schedule — the cooling-off window before a batch begins, the refund percentage within it, any registration, material or administrative deductions, and the terms after a batch has commenced — is confirmed in writing at the time of admission.",
        ],
        needsClientInput: true,
      },
      {
        heading: "Cancellation by the institute",
        body: [
          "If the institute cancels or indefinitely postpones a batch, candidates are offered a full refund of tuition paid or a transfer to the next available batch, at the candidate's choice.",
        ],
      },
      {
        heading: "How to request a refund",
        body: [
          "Submit a written request to the admissions desk with your admission details and payment reference. Requests are acknowledged in writing, and the processing time and mode of refund are confirmed with you at that point.",
        ],
        needsClientInput: true,
      },
      {
        heading: "Non-refundable items",
        body: [
          "Where a candidate has received kits, materials or third-party services, those amounts may be non-refundable.",
        ],
        needsClientInput: true,
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    shortLabel: "Disclaimer",
    summary:
      "What this site does and does not claim — including placement, partner and certification statements.",
    lastUpdated: "2026-10-04",
    draft: true,
    claim: draftClaim,
    sections: [
      {
        heading: "Employment outcomes",
        body: [
          "The institute provides training and placement assistance. It does not guarantee employment, a specific employer, a role or a salary.",
          "Recruiting organisations apply their own eligibility, medical, age, height and language standards. Selection is always at their discretion.",
        ],
      },
      {
        heading: "Employer names",
        body: [
          "Employer names appear on this site only where the institute has stated that its graduates have joined them, and they are labelled as career destinations.",
          "No partnership, endorsement or affiliation is implied by the appearance of a company name, and no company logo is reproduced without written authorization.",
        ],
      },
      {
        heading: "Accreditation and approvals",
        body: [
          "No affiliation, accreditation or regulatory approval (including any aviation regulator recognition) is claimed on this site. Any such claim will be published only with supporting documentation.",
        ],
      },
      {
        heading: "Content accuracy",
        body: [
          "Information is reviewed periodically; programme details, durations and fees may change. Confirmed details are provided at counselling.",
          "If you spot an error, please report it using the contact details on this site so it can be corrected.",
        ],
      },
      {
        heading: "Imagery",
        body: [
          "Campus photographs on this site were supplied by the institute and show its own premises.",
          "One decorative image — the dusk airfield scene in the closing section — is licensed stock photography used for atmosphere only. It does not show the institute, its premises or its equipment.",
        ],
      },
      {
        heading: "External links",
        body: [
          "Any external website linked from this site is outside the institute's control, and the institute is not responsible for its content or availability.",
        ],
      },
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((doc) => doc.slug === slug);
}

