import { describe, expect, it } from "vitest";
import { site } from "@/data/site";
import { leadWhatsappHref } from "@/lib/contact";

const enquiry = {
  kind: "enquiry" as const,
  reference: "FA-261127-AB12",
  name: "Priya Sharma",
  phone: "+91 84209 94153",
  track: "Cabin Crew Training",
  location: "Kolkata",
  message: "Could you share the next batch date?",
};

function textOf(href: string): string {
  const encoded = href.split("?text=")[1] ?? "";
  return decodeURIComponent(encoded);
}

describe("lead WhatsApp handoff", () => {
  it("targets the configured WhatsApp number", () => {
    const href = leadWhatsappHref(enquiry);
    expect(href.startsWith(`https://wa.me/${site.contact.whatsapp.number}?text=`)).toBe(true);
  });

  it("pre-fills the reference and every submitted detail", () => {
    const text = textOf(leadWhatsappHref(enquiry));
    expect(text).toContain("FA-261127-AB12");
    expect(text).toContain("Priya Sharma");
    expect(text).toContain("+91 84209 94153");
    expect(text).toContain("Cabin Crew Training");
    expect(text).toContain("Kolkata");
    expect(text).toContain("Could you share the next batch date?");
  });

  it("omits optional lines that were left blank", () => {
    const text = textOf(leadWhatsappHref({ ...enquiry, location: "", message: undefined }));
    expect(text).not.toContain("City:");
    expect(text).not.toContain("Notes:");
  });

  it("describes applications as applications", () => {
    const text = textOf(leadWhatsappHref({ ...enquiry, kind: "application" })).toLowerCase();
    expect(text).toContain("application");
    expect(text).not.toContain("enquiry");
  });
});
