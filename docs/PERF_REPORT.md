# PERFORMANCE REPORT — Flyriise Aviation

Measured against the production build on **4 October 2026**, Chromium, local
host. Every number below is a measurement, not an estimate — except the §6
network projection, which is labelled as one.

---

## 1. The constraint that shaped everything

Roughly 70 % of this audience will arrive on a mid-range Android phone over
mobile data in and around Kolkata. So the rule was: **the 3D layer is paid for
only by devices that can afford it**, and the fallback path must be a finished
page, not a degraded one.

---

## 2. Bundle weight

### Homepage, by capability tier

| Tier | JS chunks | Gzip | three.js downloaded |
| --- | --- | --- | --- |
| A / B (3D enabled) | 13 | **418.7 KB** | yes |
| C (fallback) | 11 | **171.5 KB** | **no** |

Before this session's optimisations the homepage shipped **533.4 KB gzip** and
the tier-C path still pulled a 3D chunk it could never use.

### Where the bytes go (tier A/B)

| Chunk | Gzip | Contents |
| --- | --- | --- |
| `1qcf30i92wwfo` | 147.4 KB | three.js runtime + R3F + forms |
| `0veysnyic2jto` | 99.9 KB | three.js scene layer |
| `1rj7ns8rte9vc` | 69.8 KB | form engine + app shell |
| `2z-e6jheq0ftu` | 44.0 KB | components |
| 9 smaller chunks | 57.6 KB | React, Next runtime, page code |
| **Total** | **418.7 KB** | |

**3D layer total: 247.3 KB gzip** against the brief's 450 KB budget — 55 % of
budget used, with no model files, no HDRI and no textures.

### Session-wide
- All client chunks across every route: **581.5 KB gzip / 20 chunks**
- CSS: one stylesheet, 52 KB decoded
- Fonts: 112 KB across three WOFF2 subsets, self-hosted, preloaded
- **Third-party JavaScript: 0 bytes.** No analytics, no pixels, no font CDN, no
  embedded map.

---

## 3. Core Web Vitals (local network)

| Metric | Desktop 1440 × 900 | Verdict |
| --- | --- | --- |
| TTFB | 12 ms | good |
| FCP | 193 ms | good |
| LCP | 193 ms | good |
| CLS | 0.0000 | good |
| Long tasks (>50 ms) | 0 | good |
| Total Blocking Time | 0 ms | good |

Scroll performance: **60 fps sustained** across a scripted 1.8 s scroll of the
hero runway with the scene active; 0 long tasks.

**Read these with care.** They are measured on localhost, where network latency
is zero. They describe the site's own cost — parsing, hydration, layout, paint,
main-thread time — and say nothing about a real 4G connection. §6 projects that.

---

## 4. Optimisations applied in this pass

### 4.1 Route prefetch disabled (PERF-1)
Next prefetched every visible `<Link>`, which pulled the conversion routes' client
chunks into the homepage — including the form engine.
**Result:** homepage JS **533.4 → 418.7 KB gzip** (−114.7 KB, −21.5 %).
Prefetched routes on load: **7 → 1**. The trade — ~1 s extra on a 4G route fetch —
is correct when most sessions stay on the homepage.

### 4.2 three.js removed from the fallback path (PERF-2)
`hero-stage.tsx` needed `scrollProgress` but imported it from `scene-config.ts`,
which imports three. The fallback downloaded a 99.9 KB chunk it never used.
**Fix:** moved the three-free helpers to `components/three/scroll-progress.ts`.
**Result:** tier C **≈271 → 171.5 KB gzip**, and zero 3D requests.

### 4.3 Rendering budget
- The canvas is `next/dynamic({ ssr: false })`, so the hero text paints first.
- The poster sits **under** the canvas at every tier — first paint never waits
  for a shader.
- One `useFrame` loop; camera, aircraft and atmosphere are pure functions of a
  single scroll value with no allocation per frame.
- DPR capped per tier (2 / 1.25), `powerPreference` set, context-loss handled.

### 4.4 Fonts and images
- `next/font` self-hosting: no extra DNS, no extra TLS handshake, no third party
  in the CSP; subsets for Latin + Latin Extended; `display: swap`.
- `next/image` with AVIF → WebP negotiation, explicit `sizes`, `width`/`height`
  always set (CLS 0), `priority` on the LCP candidate only.
- Zero raster images on the homepage today — the hero, programme scenes, campus
  plan and board are all SVG.

---

## 5. Tier behaviour verified

| Tier | Trigger set | Measured |
| --- | --- | --- |
| A | Desktop-class GPU, cores > 4, memory > 4, DPR ≤ 3 | Canvas 1423 × 900 @ 61 fps |
| B | Coarse pointer, or short edge < 640 px, or modest desktop | Canvas 374 × 844 @ 61 fps |
| C | No WebGL · reduced motion · Save-Data · ≤ 2 GB RAM + ≤ 380 px · `?tier=C` | No canvas, **no three.js request** |

Auto-detection was cross-checked against forced overrides (`?tier=A|B|C`) on
every run.

---

## 6. Network projection — the honest part

Measured homepage transfer, gzip:

| Tier | Bytes | 4G (≈ 9 Mbps effective) | 3G (≈ 1.6 Mbps effective) |
| --- | --- | --- | --- |
| A / B | ~420 KB JS + ~165 KB CSS/fonts | ~0.6 s transfer, ~1.0 s with RTT | ~2.9 s transfer |
| C | ~172 KB JS + ~165 KB CSS/fonts | ~0.3 s transfer | ~1.2 s transfer |

Adding ~200 ms RTT per origin connection and assuming a CDN with Brotli, expect
a **first meaningful paint in roughly 1.0–1.6 s on 4G for tier C** and
**1.3–2.0 s for tier A/B**. On 3G, budget 3–5 s and accept that the hero 3D will
not have appeared — which is exactly why tier C exists.

**Mitigations that carry this on a real network** (cannot be measured from
localhost, listed so they are not lost):
- Cache `/_next/static` and `/_next/image` immutable for 1 year at the CDN
- Brotli for HTML/JS/CSS; gzip is fine for everything else
- HTTP/3 and 0-RTT where the host supports it
- Never put a third-party script above the fold
- The poster means the LCP element is HTML, not a canvas

---

## 7. What was not measured

- **No throttled run.** CDP network emulation is not available in this harness,
  so there is no Fast-3G profile trace. §6 is arithmetic on measured bytes, and
  is labelled as such.
- **No Lighthouse run**, so no lab scores.
- **No real device.** Everything is Chromium on the build host. A low-end Android
  handset could behave differently — particularly WebGL memory and shader
  compile time, which is why the tier gate is conservative.
- **No long-session memory profile** (scroll the full site for 5 minutes).

## 8. Pre-launch performance checklist

- [ ] CDN with Brotli + Brotli-static, HTTP/2 or 3
- [ ] `Cache-Control: public, max-age=31536000, immutable` on `/_next/static/*`
- [ ] Real-domain TTFB < 400 ms (India-based edge, not a US origin)
- [ ] Confirm `CONTENT_MODE=production` so withheld content is truly absent
- [ ] Re-run `node scripts/report-bundles.mjs` after any dependency change
- [ ] One real-device check: mid-range Android, mobile data, cold cache
- [ ] Add analytics **only** through `LEAD_SINK_URL`, never as a blocking tag
      (`OPEN_QUESTIONS.md` Q8)