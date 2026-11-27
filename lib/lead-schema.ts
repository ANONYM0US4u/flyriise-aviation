import { z } from "zod";

/**
 * Lead payload schemas. Shared by the client form (resolver) and the API
 * route (server-side re-validation — never trust the client).
 */

const PHONE_PATTERN = /^\+?[0-9][0-9\s\-()]{7,17}$/;

/* Note: no transforms here — keeps react-hook-form resolver types predictable.
   Empty strings are normalised server-side before the lead is stored. */
const optionalText = (max: number) => z.string().trim().max(max).optional();

export const PROGRAM_INTEREST_OPTIONS = [
  "airport-management",
  "cabin-crew-training",
  "air-hostess-training",
  "airport-utility-ground-ops",
  "hospitality-management",
  "not-sure",
] as const;

export const leadBaseSchema = z.object({
  kind: z.enum(["enquiry", "application"]),
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Please keep your name under 80 characters."),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Please enter a reachable phone number."),
  email: z
    .union([z.email("Please enter a valid email address."), z.literal("")])
    .optional(),
  programSlug: z.enum(PROGRAM_INTEREST_OPTIONS).optional(),
  location: optionalText(80),
  message: optionalText(600),
  /**
   * Explicit consent to be contacted — required, and never pre-ticked. Typed as
   * a boolean so form state stays predictable; the rule enforces `true`.
   */
  consent: z.boolean().refine((value) => value === true, {
    error: "Please confirm you agree to be contacted about your enquiry.",
  }),
  /**
   * Honeypot. Real users never see this field; bots fill it.
   * Deliberately permissive at the schema level: a bot should not be told it
   * was detected. The API route drops filled submissions silently (202 + a
   * neutral reference) and strips the field before anything is stored.
   */
  company: z.string().max(200).optional(),
});

export const enquirySchema = leadBaseSchema.extend({
  kind: z.literal("enquiry"),
});

export const applicationSchema = leadBaseSchema.extend({
  kind: z.literal("application"),
  /** Admissions-only fields — kept minimal so the first step stays frictionless. */
  highestQualification: z
    .enum(["10th", "12th", "diploma", "graduate", "postgraduate"])
    .optional(),
  preferredStart: optionalText(40),
});

export const leadSchema = z.discriminatedUnion("kind", [enquirySchema, applicationSchema]);

export type EnquiryInput = z.input<typeof enquirySchema>;
export type ApplicationInput = z.input<typeof applicationSchema>;
export type LeadPayload = z.output<typeof leadSchema>;

export type LeadSubmission = {
  id: string;
  receivedAt: string;
  kind: LeadPayload["kind"];
  fullName: string;
  phone: string;
  email?: string;
  programSlug?: string;
  location?: string;
  message?: string;
  highestQualification?: string;
  preferredStart?: string;
  source: "website";
};

export const MAX_BODY_BYTES = 8 * 1024;
