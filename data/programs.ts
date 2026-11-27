import { type Claim } from "@/lib/claims";

/**
 * PROGRAMMES
 * ---------------------------------------------------------------------------
 * Programme names and durations mirror the client's own public listing and are
 * marked `reference` until the institute confirms final names, durations and
 * eligibility (see docs/INPUTS_NEEDED.md). Nothing here is invented: where the
 * client has not published a value, the field is null and renders as an
 * explicit "on request" state.
 */

export type CurriculumModule = {
  code: string;
  title: string;
  detail: string;
};

export type ProgramScene = "concourse" | "cabin" | "presence" | "ramp" | "lobby";

export type Program = {
  slug: string;
  code: string;
  name: string;
  shortName: string;
  kicker: string;
  summary: string;
  overview: string[];
  /** null when the client has not published a duration. */
  duration: string | null;
  durationNote: string;
  eligibility: string[];
  curriculum: CurriculumModule[];
  pathways: string[];
  screeningNote: string;
  scene: ProgramScene;
  claim: Claim;
};

const referenceClaim: Claim = {
  status: "reference",
  source: "client public website",
  asOf: "2026-10-04",
  note: "Name and outline are client-published; confirm final programme title, duration and fee schedule before launch.",
};

export const programs: Program[] = [
  {
    slug: "airport-management",
    code: "P·01",
    name: "Diploma in Airport Management",
    shortName: "Airport Management",
    kicker: "Three-month diploma",
    summary:
      "Airport operations, passenger handling and customer service essentials for a career on the concourse.",
    overview: [
      "A focused diploma for candidates who want to work airside of the passenger experience: check-in, boarding, arrival and departure flows, and the service standards that keep a terminal moving.",
      "The syllabus pairs airport and airline orientation with supervised practice in customer conversations, documentation and disruption handling, so day one at an airport feels familiar rather than foreign.",
    ],
    duration: "3 months",
    durationNote: "Client-published duration for the diploma track.",
    eligibility: [
      "Completed 10+2 (Higher Secondary) from a recognised board.",
      "Typically 17–26 years of age at admission.",
      "Comfortable with spoken English and everyday customer interaction.",
    ],
    curriculum: [
      {
        code: "M01",
        title: "Airport & airline orientation",
        detail: "Terminal zones, airline structure, ground handling roles and the vocabulary of daily operations.",
      },
      {
        code: "M02",
        title: "Passenger handling & check-in",
        detail: "Document checks, seat allocation, special-assistance passengers and boarding gate coordination.",
      },
      {
        code: "M03",
        title: "Baggage, boarding & disruption",
        detail: "Baggage rules, irregular operations, delays and how service teams communicate under pressure.",
      },
      {
        code: "M04",
        title: "Aviation security awareness",
        detail: "Screening basics, access control etiquette and the security mindset expected of terminal staff.",
      },
      {
        code: "M05",
        title: "Customer service craft",
        detail: "Service language, complaint recovery, queue and crowd handling, service standards and SLAs.",
      },
      {
        code: "M06",
        title: "Grooming, communication & interviews",
        detail: "Aviation grooming standards, spoken English practice, mock personal interviews and group discussions.",
      },
    ],
    pathways: [
      "Airport customer service agent",
      "Check-in / boarding agent",
      "Passenger service executive",
      "Ground operations coordinator",
    ],
    screeningNote:
      "Airport and airline recruiters apply their own selection standards, including height, vision and medical requirements for some roles.",
    scene: "concourse",
    claim: referenceClaim,
  },
  {
    slug: "cabin-crew-training",
    code: "P·02",
    name: "Cabin Crew Training",
    shortName: "Cabin Crew",
    kicker: "Six-month professional track",
    summary:
      "Safety procedures, in-flight service and interview readiness for aspirants targeting cabin crew selection.",
    overview: [
      "Cabin crew work is safety work first and hospitality second. This track trains both: emergency procedure, first aid and crew coordination alongside in-cabin service choreography.",
      "Selection panels screen for presence, communication and composure. Grooming, spoken English and mock interview rounds are therefore part of the timetable, not an add-on.",
    ],
    duration: "6 months",
    durationNote: "Client-published duration for the cabin crew track.",
    eligibility: [
      "Completed 10+2 (Higher Secondary) from a recognised board.",
      "Typically 17–26 years of age at admission.",
      "Airlines set their own height, weight, vision and medical standards for cabin crew — candidates are briefed on these during counselling.",
    ],
    curriculum: [
      {
        code: "M01",
        title: "Aviation safety & emergency procedures",
        detail: "Cabin safety fundamentals, emergency equipment, evacuation roles and crew discipline.",
      },
      {
        code: "M02",
        title: "First aid & emergency handling",
        detail: "Basic life support awareness, in-flight medical scenarios and incident reporting.",
      },
      {
        code: "M03",
        title: "In-flight service protocols",
        detail: "Service sequence, trolley work, meal and beverage service standards for domestic and international cabins.",
      },
      {
        code: "M04",
        title: "Crew resource management",
        detail: "Communication, authority gradients, teamwork and decision-making inside the cabin crew ecosystem.",
      },
      {
        code: "M05",
        title: "Grooming & personal presentation",
        detail: "Airline grooming standards: skincare, hair, uniform discipline, posture and carriage.",
      },
      {
        code: "M06",
        title: "English communication & public speaking",
        detail: "Announcement delivery, conversational fluency, pronunciation and passenger-facing language.",
      },
      {
        code: "M07",
        title: "Airline mock drills & selection practice",
        detail: "Airline-style assessment exercises, group discussions and personal interview rehearsals.",
      },
    ],
    pathways: [
      "Cabin crew — domestic carriers",
      "Cabin crew — international carriers",
      "In-flight service associate",
      "Aviation hospitality roles",
    ],
    screeningNote:
      "Airline cabin crew selection is competitive and set entirely by the recruiting airline. Training here builds readiness; it does not bypass airline standards.",
    scene: "cabin",
    claim: referenceClaim,
  },
  {
    slug: "air-hostess-training",
    code: "P·03",
    name: "Diploma in Air Hostess Training",
    shortName: "Air Hostess Diploma",
    kicker: "Six-month diploma",
    summary:
      "An in-cabin hospitality pathway focused on presence, etiquette, service polish and passenger care.",
    overview: [
      "Built for candidates who want the service-facing side of aviation: personal presence, hospitality etiquette, passenger care and confident communication in a cabin environment.",
      "The diploma spends more timetable on presence and soft skills — grooming, voice, hosting and guest psychology — and pairs it with aviation orientation so graduates can speak the industry's language.",
    ],
    duration: "6 months",
    durationNote: "Client-published duration for the air hostess diploma track.",
    eligibility: [
      "Completed 10+2 (Higher Secondary) from a recognised board.",
      "Typically 17–26 years of age at admission.",
      "Willing to work on grooming, voice and presentation as assessed skills.",
    ],
    curriculum: [
      {
        code: "M01",
        title: "Aviation & cabin orientation",
        detail: "Airline types, cabin layouts, passenger profiles and the standards of an airline cabin environment.",
      },
      {
        code: "M02",
        title: "In-cabin hospitality etiquette",
        detail: "Hosting language, passenger greeting and care, cabin courtesy and cultural sensitivity.",
      },
      {
        code: "M03",
        title: "Grooming, styling & carriage",
        detail: "Personal styling, uniform discipline, walk and posture, photo-ready presentation for interviews.",
      },
      {
        code: "M04",
        title: "Voice & communication",
        detail: "Voice clarity, announcement practice, English fluency drills and telephone-grade manners.",
      },
      {
        code: "M05",
        title: "Passenger care & service recovery",
        detail: "Handling nervous flyers, families, difficult conversations and service breakdowns with composure.",
      },
      {
        code: "M06",
        title: "Safety awareness & drills",
        detail: "Cabin safety orientation, emergency briefings and the responsibilities of cabin crew.",
      },
      {
        code: "M07",
        title: "Interview preparation",
        detail: "Portfolio presentation, group discussions, personal interviews and airline-style screening practice.",
      },
    ],
    pathways: [
      "Cabin crew aspirants",
      "Airport hospitality and lounge service",
      "Airline customer relations",
      "Guest-facing aviation service roles",
    ],
    screeningNote:
      "Overlaps with the cabin crew track by design; the client should confirm how the two are differentiated in the final prospectus.",
    scene: "presence",
    claim: referenceClaim,
  },
  {
    slug: "airport-utility-ground-ops",
    code: "P·04",
    name: "Airport Utility & Ground Staff Operations",
    shortName: "Utility & Ground Ops",
    kicker: "Ground operations track",
    summary:
      "Ground staff and utility responsibilities across the ramp, terminal assistance and baggage flow.",
    overview: [
      "An operational track for candidates who want to run the airport rather than serve at the counter: baggage flow, ramp coordination awareness, terminal assistance and safety compliance.",
      "Training is scenario heavy — shift handovers, equipment discipline, safety briefings and the coordination rhythm between airline, ground handler and airport operator.",
    ],
    duration: null,
    durationNote: "Duration not published by the client — confirmed at counselling.",
    eligibility: [
      "Completed 10th or 10+2; the client confirms the requirement per batch.",
      "Typically 18 years and above for ramp-linked duties.",
      "Physical fitness for airside duties where required by the employer.",
    ],
    curriculum: [
      {
        code: "M01",
        title: "Airside & terminal orientation",
        detail: "Ramp layout, apron safety, vehicle movement rules and the vocabulary of ground operations.",
      },
      {
        code: "M02",
        title: "Baggage & equipment handling",
        detail: "Baggage flow, tagging, load coordination awareness and equipment care discipline.",
      },
      {
        code: "M03",
        title: "Safety, PPE & compliance",
        detail: "FOD awareness, hazard reporting, protective equipment and incident escalation.",
      },
      {
        code: "M04",
        title: "Shift coordination & documentation",
        detail: "Handovers, logging, coordination with airline and ground handling teams.",
      },
      {
        code: "M05",
        title: "Terminal assistance & customer interaction",
        detail: "Passenger assistance, wheelchair and special assistance handling, queue discipline.",
      },
      {
        code: "M06",
        title: "Interview preparation",
        detail: "Ground operations interview practice, physical standards briefing and document readiness.",
      },
    ],
    pathways: [
      "Ground staff / ramp associate",
      "Airport utility technician roles",
      "Baggage handling supervisor (with experience)",
      "Terminal support and assistance roles",
    ],
    screeningNote: "Employers set their own medical, age and physical requirements for airside roles.",
    scene: "ramp",
    claim: referenceClaim,
  },
  {
    slug: "hospitality-management",
    code: "P·05",
    name: "Hospitality Management",
    shortName: "Hospitality",
    kicker: "Hospitality track",
    summary:
      "Front office, food and beverage, and guest relations skills aligned to hotel and travel employers.",
    overview: [
      "Hotels, lounges, travel and airline hospitality teams hire the same core skills: presence, service sequencing, guest relations and composure under volume.",
      "This track trains those skills against real hospitality standards and gives candidates a parallel path if airline selection timelines stretch.",
    ],
    duration: null,
    durationNote: "Duration not published by the client — confirmed at counselling.",
    eligibility: [
      "Completed 10+2 (Higher Secondary) from a recognised board.",
      "Comfortable with guest-facing, shift-based work.",
      "No prior hospitality experience required.",
    ],
    curriculum: [
      {
        code: "M01",
        title: "Hospitality foundations",
        detail: "Hotel and travel industry structure, guest journey mapping and service culture.",
      },
      {
        code: "M02",
        title: "Front office operations",
        detail: "Reservations, check-in and check-out etiquette, guest records and concierge-grade communication.",
      },
      {
        code: "M03",
        title: "Food & beverage service",
        detail: "Service sequence, table etiquette, menu knowledge and hygiene standards.",
      },
      {
        code: "M04",
        title: "Guest relations & recovery",
        detail: "Handling complaints, expectations and service recovery while protecting guest trust.",
      },
      {
        code: "M05",
        title: "Grooming & professional presence",
        detail: "Hospitality grooming standards, posture, voice and professional etiquette.",
      },
      {
        code: "M06",
        title: "Interview preparation",
        detail: "Hotel panel interview practice, situational questions and personality presentation.",
      },
    ],
    pathways: [
      "Front office associate",
      "Guest relations executive",
      "Food & beverage service",
      "Airline lounge / travel hospitality roles",
    ],
    screeningNote: "Hotel groups apply their own grooming, language and age criteria during selection.",
    scene: "lobby",
    claim: referenceClaim,
  },
];

export function getProgram(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}

export function programNames(): string[] {
  return programs.map((program) => program.name);
}

