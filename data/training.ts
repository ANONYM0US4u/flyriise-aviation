import type { Claim } from "@/lib/claims";

/**
 * THE TRAINING EXPERIENCE (brief §10 section 4)
 * Represented as an ascent profile: each station is a step up the climb from
 * ground school to interview room. Markers are display metadata for the
 * altitude chart, not claims about flight time.
 */

export type TrainingStation = {
  code: string;
  marker: string;
  title: string;
  detail: string;
  skill: string;
};

export const trainingStations: TrainingStation[] = [
  {
    code: "S01",
    marker: "FL050",
    title: "Grooming & presentation",
    detail:
      "Airline-standard grooming, posture, uniform discipline and photographic presentation — assessed, not assumed.",
    skill: "Presence",
  },
  {
    code: "S02",
    marker: "FL100",
    title: "Communication & spoken English",
    detail:
      "Announcement delivery, conversational fluency and telephone-grade manners, practised aloud in every session.",
    skill: "Language",
  },
  {
    code: "S03",
    marker: "FL150",
    title: "Aviation safety awareness",
    detail:
      "Safety culture, emergency orientation, first-aid basics and the discipline that keeps cabins and aprons safe.",
    skill: "Safety",
  },
  {
    code: "S04",
    marker: "FL200",
    title: "Customer service & recovery",
    detail:
      "Service standards, complaint handling and service recovery during delays, disruptions and difficult conversations.",
    skill: "Service",
  },
  {
    code: "S05",
    marker: "FL250",
    title: "Operational knowledge",
    detail:
      "Airport and airline structure, check-in and boarding flows, baggage rules and the operational vocabulary of the industry.",
    skill: "Operations",
  },
  {
    code: "S06",
    marker: "FL300",
    title: "Interview & group discussion preparation",
    detail:
      "Mock panels, group discussions, English and announcement drills — recorded, debriefed and repeated until consistent.",
    skill: "Selection",
  },
  {
    code: "S07",
    marker: "FL350",
    title: "Practical scenario drills",
    detail:
      "Full dress rehearsals of the situations recruiters screen for: passenger conflict, service failure, safety briefing, team coordination.",
    skill: "Composure",
  },
];

export const trainingIntro = {
  eyebrow: "The training experience",
  heading: "Seven stations between ground school and the interview room.",
  body:
    "Each programme follows the same climb: presence, language, safety, service, operations, selection and composure. Modules are assessed as they are taught, so gaps are found in the classroom rather than the interview.",
};

export const trainingClaim: Claim = {
  status: "reference",
  source: "derived from client-published curriculum outline",
  note: "Module names reflect the client's published syllabus. Confirm final module list and assessment policy.",
};
