import type { Claim } from "@/lib/claims";

/**
 * FAQ — real pre-admission questions (brief §10 section 10).
 * Answers are written from the client's own published information, with
 * high-risk outcome claims deliberately removed and replaced by accurate
 * descriptions of what the institute does.
 */

export type Faq = {
  id: string;
  question: string;
  answer: string[];
  claim: Claim;
};

const referenceClaim: Claim = {
  status: "reference",
  source: "client public website (FAQ, re-edited)",
  asOf: "2026-10-04",
  note: "Rewritten to remove unverifiable outcome claims. Confirm final wording with the institute.",
};

export const faqs: Faq[] = [
  {
    id: "programmes",
    question: "Which programmes does the institute run?",
    answer: [
      "Five tracks: Diploma in Airport Management (3 months), Cabin Crew Training (6 months), Diploma in Air Hostess Training (6 months), Airport Utility & Ground Staff Operations, and Hospitality Management.",
      "Durations for the ground operations and hospitality tracks are confirmed by the admissions team at counselling.",
    ],
    claim: referenceClaim,
  },
  {
    id: "eligibility",
    question: "What are the eligibility requirements?",
    answer: [
      "Most diploma tracks require completion of 10+2 (Higher Secondary) from a recognised board, with a typical age range of 17–26 years at admission.",
      "Cabin-crew-facing tracks additionally expect good communication skills and a presentable personality. Airlines set their own height, weight, vision and medical standards, so candidates are briefed on those before committing.",
    ],
    claim: referenceClaim,
  },
  {
    id: "duration",
    question: "How long are the programmes, and how are classes scheduled?",
    answer: [
      "Published durations: Airport Management is a three-month diploma; Cabin Crew Training and the Air Hostess diploma run for six months.",
      "Class scheduling for working candidates, and durations for the ground operations and hospitality tracks, are confirmed directly by admissions.",
    ],
    claim: referenceClaim,
  },
  {
    id: "no-guarantee",
    question: "Does the institute guarantee a job?",
    answer: [
      "No. The institute provides placement assistance — preparation, introductions, drives and application support.",
      "Hiring decisions are made by recruiting organisations applying their own standards. Any institute claiming to guarantee an airline or hotel job is making a promise it cannot control, and this site makes no such claim.",
    ],
    claim: {
      status: "verified",
      source: "policy statement authored for this site",
      asOf: "2026-10-04",
      approvedBy: "pending client sign-off",
    },
  },
  {
    id: "placement-support",
    question: "What does placement assistance actually include?",
    answer: [
      "Résumé and documentation preparation, professional photographs, mock group discussions and interviews with feedback, campus drives and recruiter introductions for roles matching your track.",
      "Verified placement figures — with cohort, period and the number of candidates they cover — are published on the placement page once the institute has supplied and verified them.",
    ],
    claim: referenceClaim,
  },
  {
    id: "male-candidates",
    question: "Can male candidates join these programmes?",
    answer: [
      "Yes. Cabin crew, ground staff, airport operations, customer service and hospitality roles are open to candidates of all genders, and training is delivered on the same curriculum and standards.",
    ],
    claim: referenceClaim,
  },
  {
    id: "experience",
    question: "Do I need prior aviation knowledge to join?",
    answer: [
      "No. Programmes start from fundamentals — industry vocabulary, airport and airline structure, safety orientation — and build towards interview-ready skills.",
      "Candidates from non-science backgrounds and career switchers are trained in the same cohorts.",
    ],
    claim: referenceClaim,
  },
  {
    id: "fees",
    question: "What are the fees, and are payment plans available?",
    answer: [
      "The institute discusses the fee schedule, instalment options and any current concessions directly at counselling, so candidates receive accurate current figures rather than outdated numbers.",
      "Fee details are not published on this site to avoid quoting a figure that may have changed.",
    ],
    claim: referenceClaim,
  },
  {
    id: "registration",
    question: "Is the institute registered, and what certification will I receive?",
    answer: [
      "The institute operates as a registered private limited company in India. Registration details are shared at counselling and in the admission paperwork.",
      "Candidates receive a certificate on programme completion. Any claim of affiliation, accreditation or regulatory recognition will be published only when the institute provides supporting documents.",
    ],
    claim: referenceClaim,
  },
  {
    id: "visit",
    question: "How do I visit the campus or speak to admissions?",
    answer: [
      "Call or WhatsApp the admissions desk, or send an enquiry through this site. The campus is at 199 Barasat Road, Barrackpore, North 24 Parganas, West Bengal — walk-ins are welcome on weekdays.",
      "Counselling covers programme fit, eligibility, fees and the next batch date.",
    ],
    claim: referenceClaim,
  },
];
