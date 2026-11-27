/**
 * In-memory sliding-window rate limiter.
 *
 * Suitable for a single-instance deployment (or local/preview). When the site
 * is deployed serverless or across instances, replace the Map with a shared
 * store (Redis / Upstash) — the interface is intentionally tiny so the swap is
 * a one-file change. Documented in README + DEPLOY.
 */

type Window = { hits: number[] };

const buckets = new Map<string, Window>();
const MAX_TRACKED_KEYS = 5_000;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);
  const hits = existing ? existing.hits.filter((at) => now - at < windowMs) : [];

  if (hits.length >= limit) {
    const oldest = hits[0] ?? now;
    buckets.set(key, { hits });
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }

  hits.push(now);
  buckets.set(key, { hits });

  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [bucketKey, bucket] of buckets) {
      const alive = bucket.hits.filter((at) => now - at < windowMs);
      if (alive.length === 0) buckets.delete(bucketKey);
      else buckets.set(bucketKey, { hits: alive });
      if (buckets.size <= MAX_TRACKED_KEYS / 2) break;
    }
  }

  return { ok: true, remaining: limit - hits.length, retryAfterSeconds: 0 };
}

/** Test helper — clears all windows. */
export function resetRateLimits(): void {
  buckets.clear();
}
