# ASSETS — Flyriise Aviation

Every asset the site uses, and every asset it still needs. Nothing in this
document is invented: placeholders are declared as placeholders.

---

## 1. Assets already in the build

| Asset | Format | Where it lives | Notes |
| --- | --- | --- | --- |
| Logo mark ("ascent") | Inline SVG | `components/site/logo.tsx` | Drawn in code: departure point, climb path, arrival vector, altitude ticks. Monochrome-capable, legible at 16 px |
| Wordmark + short form | Text | `data/site.ts` → `brand` | "Flyriise Aviation" / "Flyriise". Short form is display-only, below `sm` |
| Favicon / app icon | SVG | `app/icon.svg` | Derived from the mark |
| Hero poster (tier C) | Inline SVG | `components/three/hero-poster.tsx` | Runway edge lights in perspective, HUD frame, dawn grade. First paint at every tier |
| Programme scenes | Inline SVG | `components/programs/program-scene.tsx` | One drawn scene per track |
| Campus plan | Inline SVG | campus section | Indicative, labelled "not to scale" |
| Training ascent profile | Inline SVG | `components/home/training-ascent.tsx` | FL050 → FL350 altitude profile |
| Career route | Inline SVG | `components/placement/placement-section.tsx` | Five waypoints, train → grow |
| Film grain | Inline SVG data URI | `app/globals.css` | feTurbulence, 140 × 140 tile |
| Departures board | HTML table + CSS | `components/placement/departures-board.tsx` | Real `<table>` with caption and row headers |

**Photography used:** 10 images in `public/images/` — nine institute
photographs supplied by the client (October 2026) and one licensed stock image
used for atmosphere only. What each one is, and where it appears:

| File | Dimensions | Source | Where it appears |
| --- | --- | --- | --- |
| `reception-hall.jpg` | 1600 × 900 | Institute photograph | `/campus` slot 1 + home campus preview |
| `training-session.jpg` | 900 × 1600 | Institute photograph | `/campus` slot 2 + home campus preview |
| `mock-interview.jpg` | 1200 × 1600 | Institute photograph | `/campus` slot 3 |
| `counselling-desk.jpg` | 900 × 1600 | Institute photograph | `/campus` slot 4 |
| `theory-room.jpg` | 900 × 1600 | Institute photograph | `/campus` slot 5 |
| `admissions-corner.jpg` | 1600 × 900 | Institute photograph | `/campus` slot 6 |
| `campus-banner.jpg` | 1600 × 900 | Institute photograph | `/campus` slot 7 |
| `placement-board.jpg` | 1600 × 1200 | Institute photograph | Placement section (home + `/placement`) |
| `candidate-desk.jpg` | 900 × 1600 | Institute photograph | `/about` section aside |
| `atmosphere-tarmac.jpg` | 2000 × 1279 | **Stock** — Unsplash, photo by Jimmy Liu ([Unsplash License](https://unsplash.com/license)) | Decorative band in the closing CTA — not campus photography |

Source files as delivered are kept in `website/pictures/` (WhatsApp JPEGs,
verified free of EXIF/geotag metadata). All were 900–1600 px wide — below the
2400 × 1600 target in §3B, which is the one technical gap to close when the
next batch is shot.

## 2. Typography (self-hosted)

| Family | Role | Files | Licence |
| --- | --- | --- | --- |
| Archivo | Display + body | WOFF2 subsets via `next/font` | OFL 1.1 |
| B612 Mono | Instrument labels | WOFF2 subsets via `next/font` | OFL 1.1 |

Self-hosted with `display: swap`, preloaded, subset for Latin + Latin Extended.
No third-party font CDN, so no extra DNS/TLS cost on an Indian mobile
connection and no third party in the CSP.

## 3. Assets required from the client

Specifications are written for a phone camera as much as a camera — most of
these will be shot on site, not in a studio.

### A. Logo (priority: high)
- `logo-mark.svg` — vector, single colour (white or amber), no outlined text
- `logo-lockup-horizontal.svg` — mark + wordmark, light and dark variants
- `logo-lockup-horizontal.png` — 2× PNG fallback, ≥ 1200 px wide
- Favicon set: `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` (180 × 180)
- **Registration:** if the mark is registered, supply the registration number —
  it belongs in the trust centre

### B. Campus photography (priority: high)
| Shot | Framing | Notes |
| --- | --- | --- |
| Exterior + signboard | Wide, daylight, straight-on | The only shot that proves the location |
| Classroom in session | Wide, from the back corner | People add life; faces must have consent |
| Grooming / presentation studio | Wide, available light | Mirror reflections can betray an empty room |
| Interview room | Wide, chairs arranged | Include the room's scale |
| Reception / counselling desk | Medium | Candidates ask questions here — show it |

Requirements for every shot:
- **2400 × 1600 px minimum**, landscape, straight enough to crop to 16:9, 4:3 and 1:1
- Delivered as JPEG q85 **and** WebP/AVIF if the client can export them
  (`next.config.ts` already negotiates AVIF → WebP automatically)
- No identifiable minors, and no identifiable adult faces without written consent
- No geotag metadata, no EXIF
- Real rooms, current date. Not stock, not renders, not 3D mock-ups

### C. Programme photography (priority: medium)
One image per track (five tracks), same technical spec. Subject: the *training*,
not the job — students in a mock interview beat a uniformed model on a jet bridge.

### D. Portraits (priority: medium)
Founder / trainers for the About page. 1200 × 1500, natural light, neutral
background. Written consent required for each named person.

### E. Partner logos (priority: low, gated)
Only for organisations with **written authorisation**. Required per partner:
- Logo file, vector preferred
- Written permission naming this website
- Exact relationship wording to publish
Without all three, the name appears as a career destination and the logo does not
appear at all.

### F. Documents (priority: high, not published)
Registration certificate, GST certificate, affiliation/accreditation letters,
any MoU. These are **evidence for our records**, not page content. If the client
wants a certification section, they must be published by the client's own choice
with the certificate number and expiry visible.

## 4. Image pipeline (already built)

```
client file → public/ or components/ui/image-slot.tsx
           → next/image with sizes + priority on the hero only
           → AVIF → WebP → original, negotiated per request
           → width/height always set (CLS stays at 0)
```

- `sizes` is declared per usage; the hero poster is SVG so it costs nothing
- `priority` is applied to the LCP candidate only
- Below-the-fold imagery is lazy by default
- AVIF and WebP are enabled in `next.config.ts`; a cache-control header marks
  `/_next/image` output immutable

## 5. Placeholder policy

Where an asset is missing, the site shows a **labelled image slot** — an outlined
frame naming the shot, its aspect ratio and the consent requirement — never a
grey box, never a stock substitute, never a generated face.

**Current open slots: none.** The four original slots (2 on `/campus`, 1 in the
placement section, 1 on `/about`) plus three additional campus frames all carry
institute-supplied photographs as of October 2026.

Still missing from the shot list in §3B, and worth shooting next:

| Shot | Why it matters |
| --- | --- |
| Exterior + signboard | The one frame that proves the location — no photograph of the building exists yet |
| Grooming / presentation studio | Grooming is sold as an assessed module; no room has been photographed |
| Programme photography (5 tracks) | One image per track, subject = the training |
| Founder / trainer portraits | For `/about` — named people need written consent |
| Higher-resolution versions | Current files are 900–1600 px wide; the spec is 2400 × 1600 |

## 6. Rights checklist before anything ships

- [ ] **Written consent for people** — several photographs show identifiable
      adults (staff, a counselling session, candidates on the placement board,
      named and photographed on it). The client confirmed ownership of the
      images on 10 Oct 2026; individual consent forms are still outstanding and
      must be collected before public launch.
- [x] **Branding** — "AIR FLY Aviation Management" material appears on walls in
      several photographs. The client confirmed on 10 Oct 2026 that this is
      their own brand, not a competitor's.
- [x] **No candidate documents readable** — checked frame by frame at full
      resolution; the notice-board identity cards are too small to read at
      published sizes. Re-check if higher-resolution replacements arrive.
- [x] **Logos** — the only logo visible in photography is the client's own
      (above). No third-party airline logo is endorsed anywhere; airline names
      on the notice board are career destinations only.
- [ ] **Client's registered mark** — the site's drawn "ascent" mark is
      interim until the client confirms whether a registered mark exists.
- [x] **EXIF** — all ten files verified free of EXIF/geotag metadata.
- [ ] **Client confirms the images represent the campus as it is today** —
      confirmation requested with the photo set; not yet returned.
- [x] **Stock image disclosed** — `atmosphere-tarmac.jpg` is Unsplash-licensed
      atmosphere, labelled as decorative in `data/legal.ts` (Imagery clause).