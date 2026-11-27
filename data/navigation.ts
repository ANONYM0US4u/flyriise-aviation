export type NavItem = {
  label: string;
  href: string;
  /** Short operational description used in the mobile menu. */
  hint?: string;
};

export const primaryNav: NavItem[] = [
  { label: "Programmes", href: "/programs", hint: "Five tracks across aviation and hospitality" },
  { label: "Placement", href: "/placement", hint: "Process, evidence and methodology" },
  { label: "About", href: "/about", hint: "Who we are and how we train" },
  { label: "Campus", href: "/campus", hint: "Facilities and admissions visits" },
  { label: "Contact", href: "/contact", hint: "Talk to admissions" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Institute",
    items: [
      { label: "About", href: "/about" },
      { label: "Campus", href: "/campus" },
      { label: "Placement", href: "/placement" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Admissions",
    items: [
      { label: "Apply now", href: "/apply" },
      { label: "Enquire", href: "/contact#enquire" },
      { label: "Programmes", href: "/programs" },
      { label: "Frequently asked questions", href: "/about#faq" },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms & Conditions", href: "/legal/terms-and-conditions" },
  { label: "Refund & Cancellation", href: "/legal/refund-and-cancellation" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
];
