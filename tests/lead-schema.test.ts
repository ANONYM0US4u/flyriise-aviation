import { describe, expect, it } from "vitest";
import { applicationSchema, enquirySchema } from "@/lib/lead-schema";
import { rateLimit, resetRateLimits } from "@/lib/rate-limit";

const validEnquiry = {
  kind: "enquiry",
  fullName: "Priya Sharma",
  phone: "+91 84209 94153",
  email: "priya@example.com",
  programSlug: "cabin-crew-training",
  location: "Kolkata",
  message: "Could you share the next batch date?",
  consent: true,
  company: "",
};

describe("enquiry schema", () => {
  it("accepts a complete, consented enquiry", () => {
    const result = enquirySchema.safeParse(validEnquiry);
    expect(result.success).toBe(true);
  });

  it("rejects a phone number that cannot be called", () => {
    const result = enquirySchema.safeParse({ ...validEnquiry, phone: "call me" });
    expect(result.success).toBe(false);
  });

  it("requires explicit consent", () => {
    const result = enquirySchema.safeParse({ ...validEnquiry, consent: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes("consent"))).toBe(true);
    }
  });

  it("accepts a filled honeypot so bots learn nothing from the schema", () => {
    // The API route drops filled honeypot submissions silently instead of
    // returning a validation error that would teach the bot what tripped it.
    const result = enquirySchema.safeParse({ ...validEnquiry, company: "Acme Ltd" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.company).toBe("Acme Ltd");
  });

  it("allows an empty optional email", () => {
    const result = enquirySchema.safeParse({ ...validEnquiry, email: "" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = enquirySchema.safeParse({ ...validEnquiry, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("caps free-text length", () => {
    const result = enquirySchema.safeParse({ ...validEnquiry, message: "x".repeat(700) });
    expect(result.success).toBe(false);
  });

  it("keeps the discriminated application variant strict", () => {
    const result = applicationSchema.safeParse({ ...validEnquiry, kind: "application" });
    expect(result.success).toBe(true);
    const wrongKind = applicationSchema.safeParse({ ...validEnquiry, kind: "enquiry" });
    expect(wrongKind.success).toBe(false);
  });
});

describe("rate limiting", () => {
  it("blocks once the window limit is exceeded and reports retry timing", () => {
    resetRateLimits();
    const options = { limit: 3, windowMs: 60_000 };
    expect(rateLimit("lead:1.1.1.1", options).ok).toBe(true);
    expect(rateLimit("lead:1.1.1.1", options).ok).toBe(true);
    expect(rateLimit("lead:1.1.1.1", options).ok).toBe(true);

    const blocked = rateLimit("lead:1.1.1.1", options);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks keys independently", () => {
    resetRateLimits();
    const options = { limit: 1, windowMs: 60_000 };
    expect(rateLimit("lead:a", options).ok).toBe(true);
    expect(rateLimit("lead:b", options).ok).toBe(true);
    expect(rateLimit("lead:a", options).ok).toBe(false);
  });
});