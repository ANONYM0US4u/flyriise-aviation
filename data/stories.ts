import type { Claim } from "@/lib/claims";

/**
 * STUDENT STORIES
 * ---------------------------------------------------------------------------
 * Only authentic, client-supplied stories. These are condensed excerpts of
 * testimonials the institute publishes itself, recorded here with their consent
 * status so nothing is republished on a production route until consent and
 * accuracy are confirmed (brief §10 section 8, §17).
 */

export type Story = {
  id: string;
  name: string;
  role: string;
  employer: string;
  programSlug: string;
  programLabel: string;
  /** Condensed excerpt of the client-published testimonial. */
  quote: string;
  consent: "confirmed" | "pending";
  edited: boolean;
  claim: Claim;
};

export const stories: Story[] = [
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    role: "Cabin crew",
    employer: "IndiGo",
    programSlug: "cabin-crew-training",
    programLabel: "Cabin crew training",
    quote:
      "The grooming sessions, mock interviews and aviation etiquette training gave me the confidence I did not have before.",
    consent: "pending",
    edited: true,
    claim: {
      status: "reference",
      source: "client public website (alumni story)",
      note: "Excerpted. Confirm consent to publish, current job title and employer before launch.",
    },
  },
  {
    id: "rahul-dey",
    name: "Rahul Dey",
    role: "Ground staff",
    employer: "Air India",
    programSlug: "airport-utility-ground-ops",
    programLabel: "Ground staff training",
    quote:
      "The ground staff training module was aligned with what recruiters look for. The trainers were industry-experienced throughout.",
    consent: "pending",
    edited: true,
    claim: {
      status: "reference",
      source: "client public website (alumni story)",
      note: "Excerpted. Confirm consent to publish and current employment details.",
    },
  },
  {
    id: "sneha-paul",
    name: "Sneha Paul",
    role: "Passenger services",
    employer: "SpiceJet",
    programSlug: "airport-management",
    programLabel: "Airport management",
    quote:
      "Trainers who had worked in the industry gave us real-world scenarios, which is exactly what the job demands.",
    consent: "pending",
    edited: true,
    claim: {
      status: "reference",
      source: "client public website (alumni story)",
      note: "Excerpted. Confirm consent to publish and current employment details.",
    },
  },
  {
    id: "tania-mondal",
    name: "Tania Mondal",
    role: "Cabin crew",
    employer: "Air Arabia",
    programSlug: "cabin-crew-training",
    programLabel: "Cabin crew training",
    quote:
      "The communication and personality development sessions were the real differentiator when I faced international interviews.",
    consent: "pending",
    edited: true,
    claim: {
      status: "reference",
      source: "client public website (alumni story)",
      note: "Excerpted. Confirm consent to publish and current employment details.",
    },
  },
];

/** Stories published in the client's own listing that are not shown by default. */
export const additionalStoryCount = 6;

export const storiesProvenanceNote =
  "Stories are condensed from testimonials the institute publishes itself, and appear only with the candidate's written consent.";
