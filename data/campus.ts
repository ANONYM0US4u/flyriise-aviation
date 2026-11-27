import { type Claim, placeholder } from "@/lib/claims";

/**
 * CAMPUS / ATMOSPHERE (brief §10 section 9)
 * The campus is described structurally and photographed by the institute
 * itself: every slot below carries a client-supplied photograph, never stock
 * imagery and never a render. Slots whose photograph has not arrived yet
 * render as explicitly labelled frames (see docs/ASSETS.md).
 */

export type Facility = {
  code: string;
  name: string;
  detail: string;
};

export const facilities: Facility[] = [
  {
    code: "F01",
    name: "Classroom & theory rooms",
    detail: "Airline and airport orientation, safety briefings and service standards taught in small cohorts.",
  },
  {
    code: "F02",
    name: "Grooming & presentation studio",
    detail: "Grooming assessments, photograph sessions and interview-day presentation reviews.",
  },
  {
    code: "F03",
    name: "Service & scenario practice area",
    detail: "Rehearsal space for passenger handling, service sequences and service-recovery drills.",
  },
  {
    code: "F04",
    name: "Interview & group discussion room",
    detail: "Mock panels, recorded interviews and group discussion rounds with debrief sessions.",
  },
  {
    code: "F05",
    name: "Admissions & counselling desk",
    detail: "Programme counselling, documentation checks, fee discussion and batch planning.",
  },
  {
    code: "F06",
    name: "Barrackpore campus",
    detail: "199 Barasat Road, Barrackpore — reached from Kolkata on the Barasat–Barrackpore route.",
  },
];

export const campusClaim: Claim = {
  status: "reference",
  source: "client public website (self-described facilities), campus photographs supplied by the institute",
  note: "Facility list reflects activities the institute publishes. Photographs on this page were supplied by the institute in October 2026; confirm the rooms still look like this on your visit.",
};

export type PhotoSlot = {
  id: string;
  title: string;
  caption: string;
  /** Framing brief for any shot that is still outstanding (see docs/ASSETS.md). */
  spec: string;
  orientation: "landscape" | "portrait" | "square";
  /** Set once the institute supplies the photograph; the slot then renders it. */
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
};

/**
 * Ordered: the home page campus preview shows the first two slots, so both
 * open with the wide, identifying views.
 */
export const photoSlots: PhotoSlot[] = [
  {
    id: "reception-hall",
    title: "Reception & admissions hall",
    caption: "Where a candidate's first conversation with the institute happens.",
    spec: "2400×1600 · daylight · wide · no identifiable minors without consent",
    orientation: "landscape",
    src: "/images/reception-hall.jpg",
    width: 1600,
    height: 900,
    alt: "Wide view of the institute reception: a wooden counter with sunflowers, a waiting sofa and programme notice boards along a panelled wall.",
  },
  {
    id: "training-session",
    title: "Training room in session",
    caption: "Candidates working through a session at the campus.",
    spec: "2400×1600 · available light · candid · consent forms required",
    orientation: "landscape",
    src: "/images/training-session.jpg",
    width: 900,
    height: 1600,
    alt: "Three candidates in white shirts seated at a long desk, working through a session with notebooks and water bottles.",
  },
  {
    id: "mock-interview",
    title: "Interview rehearsal",
    caption: "A one-to-one practice interview across the desk, with feedback afterwards.",
    spec: "2400×1600 · landscape · avoid readable personal documents",
    orientation: "landscape",
    src: "/images/mock-interview.jpg",
    width: 1200,
    height: 1600,
    alt: "A candidate seated across the desk from an assessor during an interview rehearsal at the campus.",
  },
  {
    id: "counselling-desk",
    title: "Counselling & documentation",
    caption: "An admissions counsellor walking a candidate through the paperwork.",
    spec: "1600×2400 · portrait · counselling setup visible · consent required",
    orientation: "portrait",
    src: "/images/counselling-desk.jpg",
    width: 900,
    height: 1600,
    alt: "An admissions counsellor in a white shirt reviewing a set of documents with a candidate across the desk.",
  },
  {
    id: "theory-room",
    title: "Theory room",
    caption: "A theory room set up for a session: screen, desk and seating for a small cohort.",
    spec: "1600×2400 · portrait · available light",
    orientation: "portrait",
    src: "/images/theory-room.jpg",
    width: 900,
    height: 1600,
    alt: "An empty theory room with a desk, office chairs, a globe, a projector screen and curtains along one wall.",
  },
  {
    id: "admissions-corner",
    title: "Admissions corner",
    caption: "The enquiry desk inside the campus, with programme material on the wall.",
    spec: "2400×1600 · landscape · wide",
    orientation: "landscape",
    src: "/images/admissions-corner.jpg",
    width: 1600,
    height: 900,
    alt: "An admissions desk and chair against a cream wall, with a programme poster and a model aircraft mounted above the desk.",
  },
  {
    id: "campus-banner",
    title: "Campaign material",
    caption: "Institute banner displayed on the campus wall.",
    spec: "2400×1600 · landscape · straight-on",
    orientation: "landscape",
    src: "/images/campus-banner.jpg",
    width: 1600,
    height: 900,
    alt: "A printed aviation-training banner hung on a campus wall beside a door with a shelf of trophies.",
  },
];

export const visitSteps = [
  {
    code: "V01",
    title: "Call or message",
    detail: "Speak to the admissions desk and share the track you are considering.",
  },
  {
    code: "V02",
    title: "Counselling",
    detail: "Discuss eligibility, duration, fees, batch dates and the standards recruiters expect.",
  },
  {
    code: "V03",
    title: "Campus visit",
    detail: "Walk the rooms, meet trainers, and sit in on a session where the schedule allows.",
  },
  {
    code: "V04",
    title: "Documentation & enrolment",
    detail: "Submit documents, complete the admission form and confirm your batch.",
  },
];

export const campusVisitNote = placeholder("CAMPUS VISIT TIMINGS & BATCH CALENDAR");
