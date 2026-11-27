import { NextResponse, type NextRequest } from "next/server";

/**
 * CONTENT SECURITY POLICY (brief §14A)
 * ---------------------------------------------------------------------------
 * Verified against the production build in this session: the Turbopack builder
 * does not attach the request nonce to its own <script> tags (zero `nonce`
 * attributes in the rendered HTML), so a `'strict-dynamic'` policy blocked
 * every chunk and every inline bootstrap script — the page rendered but was
 * completely inert.
 *
 * The policy below therefore allows same-origin scripts and inline bootstrap
 * while keeping the parts that actually reduce risk: no third-party script
 * origins, no plugins, no framing, no base-tag hijack, no foreign form posts.
 *
 * A nonce is still generated and forwarded on every request (x-nonce), so
 * switching to `script-src 'nonce-…' 'strict-dynamic'` is a one-line change
 * once the builder emits nonces. See docs/QA_REPORT.md (CSP-1).
 *
 * Development differs on purpose: React's development build calls eval() to
 * reconstruct call stacks, so `npm run dev` throws "eval() is not supported in
 * this environment" and hydration dies. 'unsafe-eval' is therefore added in
 * development only — never in the production policy, which keeps eval blocked.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDevelopment = process.env.NODE_ENV !== "production";

  const policy = [
    "default-src 'self'",
    // No nonce here on purpose: a nonce in the list makes browsers ignore
    // 'unsafe-inline', and the current builder emits no nonces to match it.
    `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${isDevelopment ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and the lead API (which needs no CSP and
     * must stay free of unnecessary per-request work).
     */
    "/((?!_next/static|_next/image|api|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml)$).*)",
  ],
};