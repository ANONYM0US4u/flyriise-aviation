/**
 * Content mode gate.
 *
 * demo       — client preview. Reference / pending content is rendered with
 *              explicit provenance so reviewers can see exactly what needs
 *              sign-off.
 * production — anything not `verified` is withheld from the rendered page
 *              (partners, statistics, stories). scripts/verify-content.mjs
 *              fails the build if a placeholder is reachable here.
 */
export type ContentMode = "demo" | "production";

export function contentMode(): ContentMode {
  return process.env.CONTENT_MODE === "production" ? "production" : "demo";
}

export function isDemoMode(): boolean {
  return contentMode() === "demo";
}
