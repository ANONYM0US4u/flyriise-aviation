import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { LeadPayload, LeadSubmission } from "@/lib/lead-schema";

/**
 * MOCK LEAD SINK
 * ---------------------------------------------------------------------------
 * Development/preview destination for submitted leads. Writes newline-delimited
 * JSON into .data/leads.jsonl (gitignored, never committed).
 *
 * Production: set LEAD_SINK_URL to an endpoint that accepts a JSON POST — a CRM
 * webhook, or the Google Apps Script web app in docs/apps-script/lead-webhook.gs
 * that emails each enquiry to admissions. No secrets live in client code — the
 * URL is read server-side only.
 */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function referenceId(now: Date): string {
  const year = String(now.getUTCFullYear()).slice(2);
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  let suffix = "";
  for (let index = 0; index < 4; index += 1) {
    suffix += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `FA-${year}${month}${day}-${suffix}`;
}

export type LeadSinkResult =
  | { ok: true; reference: string; sink: "file" | "webhook" }
  | { ok: false; error: string };

export async function submitLead(payload: LeadPayload): Promise<LeadSinkResult> {
  const now = new Date();
  const submission: LeadSubmission = {
    id: referenceId(now),
    receivedAt: now.toISOString(),
    kind: payload.kind,
    fullName: payload.fullName,
    phone: payload.phone,
    ...(payload.email ? { email: payload.email } : {}),
    ...(payload.programSlug ? { programSlug: payload.programSlug } : {}),
    ...(payload.location ? { location: payload.location } : {}),
    ...(payload.message ? { message: payload.message } : {}),
    ...("highestQualification" in payload && payload.highestQualification
      ? { highestQualification: payload.highestQualification }
      : {}),
    ...("preferredStart" in payload && payload.preferredStart
      ? { preferredStart: payload.preferredStart }
      : {}),
    source: "website",
  };

  const webhook = process.env.LEAD_SINK_URL;
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(submission),
        // A stalled sink must not hold the request open until the platform
        // times it out. Apps Script answers via a redirect, so keep following.
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        // Deliberately does not log the payload (no PII in logs — brief §14A).
        return { ok: false, error: `Upstream sink rejected the submission (${response.status}).` };
      }
      return { ok: true, reference: submission.id, sink: "webhook" };
    } catch {
      return { ok: false, error: "Could not reach the lead sink." };
    }
  }

  try {
    // Path is statically scoped to the project's .data directory (never an
    // arbitrary user-supplied path), so the bundler can trace it safely.
    const sinkDirectory = path.join(process.cwd(), ".data");
    const fileName = (process.env.LEAD_SINK_FILE ?? "leads.jsonl").replace(/[^a-zA-Z0-9._-]/g, "");
    await mkdir(sinkDirectory, { recursive: true });
    await appendFile(path.join(sinkDirectory, fileName), `${JSON.stringify(submission)}\n`, "utf8");
    return { ok: true, reference: submission.id, sink: "file" };
  } catch {
    return { ok: false, error: "Could not record the submission." };
  }
}
