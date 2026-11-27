import { describe, expect, it } from "vitest";
import {
  BANNED_CLAIM_PHRASES,
  formatRatio,
  isFutureDate,
  isPublishable,
  isSkewedStat,
  isPlaceholderText,
  placeholder,
} from "@/lib/claims";
import { careerDestinations, placementStatistics } from "@/data/placement";
import { programs } from "@/data/programs";
import { stories } from "@/data/stories";
import { site } from "@/data/site";

describe("placeholder tokens", () => {
  it("produces a detectable token", () => {
    const token = placeholder("PLACEMENT RATE");
    expect(token).toContain("CLIENT INPUT REQUIRED");
    expect(isPlaceholderText(token)).toBe(true);
  });

  it("does not flag ordinary copy", () => {
    expect(isPlaceholderText("Cabin crew training, six months.")).toBe(false);
    expect(isPlaceholderText(42)).toBe(false);
  });
});

describe("programme data integrity", () => {
  it("has unique slugs and complete basics", () => {
    const slugs = programs.map((program) => program.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const program of programs) {
      expect(program.name.length).toBeGreaterThan(3);
      expect(program.summary.length).toBeGreaterThan(20);
      expect(program.curriculum.length).toBeGreaterThanOrEqual(5);
      expect(program.pathways.length).toBeGreaterThanOrEqual(3);
      expect(program.eligibility.length).toBeGreaterThanOrEqual(2);
      // Duration is either published copy or explicitly null (never invented).
      expect(program.duration === null || program.duration.length > 0).toBe(true);
    }
  });

  it("never implies a guarantee in programme copy", () => {
    const corpus = programs
      .map((program) => [program.summary, ...program.overview, program.screeningNote].join(" "))
      .join(" ")
      .toLowerCase();

    for (const phrase of BANNED_CLAIM_PHRASES) {
      if (corpus.includes(phrase)) {
        expect(corpus).toMatch(new RegExp(`(?:no|not|never)[^.]*${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
      }
    }
  });
});

describe("placement statistics", () => {
  it("has no impossible or future-dated values", () => {
    for (const stat of placementStatistics) {
      expect(isSkewedStat(stat)).toBe(false);
      expect(isFutureDate(stat.asOf)).toBe(false);
      if (stat.value !== null) {
        // A published value must come with its measurement contract.
        expect(stat.claim.status).toBe("verified");
        expect(stat.definition).toBeTruthy();
        expect(stat.asOf).toBeTruthy();
      }
    }
  });

  it("publishes ratios as n of N, never bare percentages", () => {
    const withRatio = placementStatistics.filter(
      (stat) => typeof stat.placed === "number" && typeof stat.total === "number",
    );
    for (const stat of withRatio) {
      expect(formatRatio(stat.placed, stat.total)).toMatch(/^\d+ of \d+$/);
      expect(stat.placed!).toBeLessThanOrEqual(stat.total!);
    }
    expect(formatRatio(null, 24)).toBe("—");
  });

  it("keeps unresolved metrics unresolved", () => {
    for (const stat of placementStatistics) {
      expect(stat.value).toBeNull();
      expect(isPublishable(stat.claim)).toBe(false);
    }
  });
});

describe("partner records (brief §18)", () => {
  it("publishes destinations only — never an unauthorized partner", () => {
    for (const partner of careerDestinations) {
      expect(partner.relationshipType).toBe("STUDENT_CAREER_DESTINATION");
      expect(partner.verificationStatus).toBe("PENDING");
      expect(partner.logoUsageApproved).toBe(false);
      expect(partner.authorizationRef).toBeUndefined();
    }
  });

  it("carries no logo assets", () => {
    expect(careerDestinations.every((partner) => !("logo" in partner))).toBe(true);
  });
});

describe("stories", () => {
  it("marks consent so production can withhold unconfirmed stories", () => {
    for (const story of stories) {
      expect(["confirmed", "pending"]).toContain(story.consent);
      expect(story.quote.length).toBeGreaterThan(20);
      expect(story.quote.length).toBeLessThan(220);
    }
  });
});

describe("institution identity", () => {
  it("keeps unverified institutional values null", () => {
    expect(site.registration.cin).toBeNull();
    expect(site.registration.gstin).toBeNull();
    expect(isPlaceholderText(site.registration.cinPlaceholder)).toBe(true);
    expect(site.registration.affiliations).toHaveLength(0);
  });

  it("keeps grievance details as explicit tokens until supplied", () => {
    expect(site.grievance.officerName).toBeNull();
    expect(isPlaceholderText(site.grievance.emailPlaceholder)).toBe(true);
  });

  it("exposes a working WhatsApp number for wa.me links", () => {
    expect(site.contact.whatsapp.number).toMatch(/^\d{10,15}$/);
    expect(site.contact.phone.href.startsWith("tel:")).toBe(true);
  });
});
describe("class-name merging", () => {
  it("lets a caller's display utility override a component base class", async () => {
    const { cn } = await import("@/lib/utils");
    // Regression: Action's base `inline-flex` used to beat a caller's `hidden`,
    // so the header's secondary CTA stayed visible on small screens.
    expect(cn("inline-flex items-center", "hidden md:inline-flex")).toBe(
      "items-center hidden md:inline-flex",
    );
    expect(cn("inline-flex", "flex")).toBe("flex");
    expect(cn("text-sm", false, undefined, "font-medium")).toBe("text-sm font-medium");
  });

  it("lets a caller's text colour override a component base class", async () => {
    const { cn } = await import("@/lib/utils");
    // Regression: a light-surface footnote kept `text-steel-deep` from the base
    // class, which won the cascade and dropped contrast to 2.5:1 (axe-core).
    expect(cn("mono-label text-steel-deep normal-case", "text-graphite")).toBe(
      "mono-label normal-case text-graphite",
    );
    expect(cn("text-steel text-cirrus/85")).toBe("text-cirrus/85");
  });

  it("never treats type sizes or alignment utilities as colours", async () => {
    const { cn } = await import("@/lib/utils");
    // Sizes and alignment must survive untouched — only colours are deduped.
    expect(cn("text-[0.98rem]", "sm:text-[1.06rem]")).toBe(
      "text-[0.98rem] sm:text-[1.06rem]",
    );
    expect(cn("mono-label text-center", "text-right")).toBe(
      "mono-label text-center text-right",
    );
    expect(cn("text-display-1", "text-display-3")).toBe("text-display-1 text-display-3");
    expect(cn("text-steel", "text-[13px]")).toBe("text-steel text-[13px]");
  });
});
