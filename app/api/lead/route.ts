import { NextResponse } from "next/server";
import { MAX_BODY_BYTES, leadSchema, type LeadPayload } from "@/lib/lead-schema";
import { rateLimit } from "@/lib/rate-limit";
import { submitLead } from "@/lib/lead-sink";

/**
 * LEAD ENDPOINT (brief §14A, §19)
 * ---------------------------------------------------------------------------
 * - Server-side re-validation with Zod (the client is never trusted).
 * - Rate limited per client address.
 * - Honeypot field silently dropped without recording anything.
 * - No personal data is ever written to logs; only status codes are logged.
 * - Never echoes submitted values back in an error message.
 */

export const runtime = "nodejs";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  return `lead:${ip}`;
}

/** Empty optional strings become undefined so the sink stays clean. */
function normalise(payload: LeadPayload): LeadPayload {
  const cleaned: Record<string, unknown> = { ...payload };
  for (const [key, value] of Object.entries(cleaned)) {
    if (typeof value === "string" && value.trim() === "") delete cleaned[key];
  }
  delete cleaned.company;
  return cleaned as LeadPayload;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "Unsupported request format." },
      { status: 415 },
    );
  }

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Submission is too large." }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(body);
  } catch {
    return NextResponse.json({ ok: false, error: "Submission could not be read." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    // Only our own validation messages are returned — never the input values.
    const issues = parsed.error.issues.map((issue) => ({
      field: issue.path.join(".") || "form",
      message: issue.message,
    }));
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields.", issues },
      { status: 422 },
    );
  }

  // Honeypot: accept quietly, store nothing, teach bots nothing.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true, reference: "FA-REC-0000" }, { status: 202 });
  }

  const limit = rateLimit(clientKey(request), RATE_LIMIT);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions from this connection. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  const result = await submitLead(normalise(parsed.data));
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, reference: result.reference }, { status: 201 });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 });
}
