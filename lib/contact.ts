import { site } from "@/data/site";

export function whatsappHref(
  message = `Hello ${site.brand.name}, I would like to know more about your programmes and the next batch.`,
): string {
  return `https://wa.me/${site.contact.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export function programWhatsappHref(programName: string): string {
  return whatsappHref(
    `Hello ${site.brand.name}, I am interested in the ${programName}. Could you share eligibility, fees and the next batch date?`,
  );
}

/**
 * One-tap handoff after a successful submission. The visitor's own WhatsApp
 * opens with the enquiry already written, so admissions can answer in a thread
 * instead of waiting for a callback. The visitor still presses send — nothing
 * leaves the browser without that action.
 */
export function leadWhatsappHref(input: {
  kind: "enquiry" | "application";
  reference: string;
  name: string;
  phone: string;
  track: string;
  location?: string;
  message?: string;
}): string {
  const lines = [
    `Hello ${site.brand.name}, I have just sent an ${input.kind} through your website.`,
    "",
    `Reference: ${input.reference}`,
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Programme: ${input.track}`,
  ];
  if (input.location) lines.push(`City: ${input.location}`);
  if (input.message) lines.push(`Notes: ${input.message}`);
  lines.push("", "Please call me to confirm the next step.");
  return whatsappHref(lines.join("\n"));
}

export const telHref = site.contact.phone.href;
export const mailHref = site.contact.email.href;
