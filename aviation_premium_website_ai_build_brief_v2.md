# PREMIUM AVIATION WEBSITE — AI BUILD BRIEF

## Role

You are a senior product designer, creative director, frontend engineer, motion designer, and 3D web developer working as one team.

Your job is to design and build a **high-end aviation / aviation-training website** that feels like a premium aviation brand, not a generic coaching institute template.

Treat this as a real client project with production-level expectations.


# 00 — OPERATING CONTRACT

Before writing application code, operate as a multidisciplinary team: **creative director + senior product designer + frontend engineer + motion designer + 3D web developer + QA engineer**.

### Priority when decisions conflict

1. Truth, legal safety and user trust
2. Accessibility, performance and security
3. Conversion: **Apply Now** / **Enquire Now** must remain usable and obvious
4. Art direction and 3D quality
5. Nice-to-have effects and secondary features

**Rule:** when 3D conflicts with performance, accessibility, content clarity or conversion, **3D loses**.

### Operating loop

Work in this loop:

**Plan → Build → Verify → Report**

Do not declare something verified unless you actually ran the relevant check in this session and reviewed its output. Clearly label items as `VERIFIED`, `UNVERIFIED`, or `FAILED`.

### Evidence discipline

Never say:

- “looks good” without visual evidence
- “fully responsive” without breakpoint testing
- “performance is excellent” without measurements
- “SEO is done” without checking metadata, routes and generated output
- “the partner is genuine” without client-supplied authorization evidence

If the environment can capture and inspect screenshots, use that capability. If it cannot, report screenshot capture as evidence for human visual review rather than pretending to have seen the rendered composition.

### Human approval gates

Use two deliberate review gates:

**Gate A — Creative/architecture approval:** after discovery, information architecture, visual direction, wireframes and 3D concept are defined.

**Gate B — Content-first baseline approval:** after the complete responsive site works without the heavy 3D layer, forms work end-to-end against a mock sink, accessibility/performance basics pass, and legal/content placeholders are clearly identified.

Do not silently skip these gates. The production-quality baseline must work even if 3D is disabled.

The client has **no fixed budget constraint** for the design and development direction. Prioritize quality, visual impact, polish, usability, performance, trust, and conversion.

---

# 01 — PROJECT CONTEXT

The organization is an aviation and hospitality training institute.

Primary business goals:

- Build immediate trust with prospective students and parents.
- Present the organization as premium, established, professional, and career-focused.
- Generate qualified enquiries and applications.
- Clearly explain programs and career pathways.
- Present placement information transparently.
- Establish credibility through genuine hiring partnerships, registration details, policies, and contact information.
- Create a memorable digital identity that differentiates the institute from typical Indian aviation-training websites.

Primary audiences:

1. Students exploring aviation careers.
2. Parents evaluating whether the institute is credible.
3. Students looking for cabin crew, airport, ground operations, and hospitality careers.
4. Working professionals / career switchers researching aviation opportunities.

The emotional positioning should be:

**Aviation ambition + premium professionalism + confidence + movement + precision + future career.**

Avoid:

- Cheap coaching-institute aesthetics.
- Excessive gradients.
- Template-looking cards everywhere.
- Stock-photo-heavy layouts with no visual concept.
- Fake luxury.
- Excessive glassmorphism.
- Overuse of aircraft icons.
- Generic “Dream Big / Fly High” copy repeated everywhere.
- Corporate SaaS visual language.
- Cluttered Indian education-site layouts.

---

# 02 — REFERENCE WEBSITE

Reference:

https://www.flyriiseaviation.in/about.php

Also inspect the site's homepage and related public pages where useful to understand the current content architecture and business context.

Important:

**The reference is for information architecture and business understanding, NOT for visual imitation.**

Do not copy its layout, wording, design, component structure, or visual styling.

Use it to understand the type of information the organization currently communicates:

- About / organization introduction
- Mission and vision
- Training programs
- Why choose the institute
- Placement support
- Contact / enquiry
- Gallery
- Brochure
- Student placement stories
- FAQ

Current public reference content suggests an aviation + hospitality institute operating from Barrackpore/Kolkata, with programs around airport management/customer service, ground staff, cabin crew, utility, and hospitality. Treat all public claims as **reference data only** and verify them with the client before publishing.

Never assume that a number, partnership, salary figure, accreditation, certification, or placement percentage is true simply because it appears on the reference site.

---

# 03 — CLIENT'S REQUIRED CONTENT / COMPLIANCE

The final website must include or provide clear locations for all of the following:

### Brand

- Professional logo / logo treatment
- Brand identity
- Consistent typography
- Color system
- Iconography
- Visual language
- Photography direction
- Motion language

### Organization

- Short introduction about the organization
- Registration / company or institute details
- Grievance / contact information
- Address
- Phone / WhatsApp
- Email

### Conversion

- Apply Now
- Enquire Now
- Clear CTAs throughout the experience
- Contact / enquiry form

### Placements

- Placement details
- Placement statistics
- Hiring partners
- Hiring partners ONLY where the partnership is genuine, current, and authorized
- Placement process / methodology
- Student success stories where verified

### Legal / trust

- Privacy Policy
- Terms & Conditions
- Refund / Cancellation Policy
- Disclaimer
- Grievance / contact information
- Company / institute registration details

The website should make compliance feel intentional and trustworthy rather than hiding legal information in tiny footer text.

---

# 04 — DESIGN DIRECTION

Create a visual language inspired by **modern aviation, private terminals, premium travel brands, aircraft engineering, airport architecture, navigation systems, and editorial luxury.**

Think:

- premium airline brand
- private aviation company
- futuristic airport terminal
- high-end transportation brand
- aerospace editorial
- cinematic aircraft photography
- precision engineering
- quiet luxury

Do NOT make the website look like a training institute first.

It should feel like a **premium aviation company that happens to educate the next generation of aviation professionals.**

---

# 04A — SIGNATURE CREATIVE CONCEPT: “ASCENT”

Use one coherent visual story across the homepage rather than a collection of unrelated premium effects.

The homepage should feel like a **journey from ground to altitude**:

- **Apron / Dusk:** hero — aircraft at rest, deep navy/black, runway light accents.
- **Climb / Blue hour:** introduction + programs — confidence and anticipation.
- **Cloud break / First light:** placement proof + verified outcomes — evidence becomes brighter and clearer.
- **Cruise / Daylight:** admissions, FAQ and practical information — maximum readability.
- **Arrival / Night:** final CTA + footer — calm, decisive close.

The exact metaphor can evolve during design exploration, but the page should feel like one cinematic system.

### Signature moments — maximum three

Keep these as the only major “wow” moments:

1. **The Ascent** — the main hero 3D/scroll narrative.
2. **The Departures Board** — verified placement/outcome data presented like an aviation operations display.
3. **The Boarding Pass** — application progress UI with a flight-line motif and a final reference ID.

Do **not** spread 3D, parallax, counters, glows, tilt cards and gimmicks across every section. Premium comes from restraint.

# 05 — VISUAL SYSTEM

## Color direction

Start from a dark premium aviation palette. Use exactly one primary accent unless the final brand system proves another approach is stronger.

Starter tokens (adapt only through the central token file):

| Token | Starter value | Role |
|---|---|---|
| `--apron-night` | `#070B14` | Hero/footer/deepest dark |
| `--twilight` | `#12203A` | Dark surfaces |
| `--cirrus` | `#E6EDF6` | Light section surface/dividers |
| `--cloud` | `#F7F9FC` | Forms/legal/reading surfaces |
| `--ink` | `#0A1222` | Dark text |
| `--runway-amber` | `#FFB224` | Primary CTA/focus/data accent |

These are **starting values, not a brand lock**. Rishu may override them centrally after the visual exploration. Do not scatter hard-coded color values across components.

Keep the “expensive” feeling even when the accent disappears. Avoid rainbow gradients, purple AI-style gradients, and decorative color noise.

## Typography

Use a strong editorial display face with a clean modern body/UI face. Prefer typography that feels engineered and premium rather than “aviation themed” through gimmicky lettering.

Starter direction:

- **Archivo Variable** for display/body; use width/weight axes where available.
- **B612 Mono** for instrument-style data: statistics, timestamps, departures-board metadata and small operational labels.

Keep body text at **16px+ on mobile**, line-height around 1.6, and text measure around 70 characters or less. Use no more than three weights in the core system.

Typography should create hierarchy through scale, spacing, weight and rhythm—not decorative effects.

Example tone:

> BUILD A CAREER ABOVE THE ORDINARY.

But generate original copy rather than blindly using this example.

---

# 06 — HERO EXPERIENCE

The hero is extremely important.

Do not build a normal:

“Welcome to XYZ Aviation Institute”

hero with a rectangular image and two buttons.

Instead create a cinematic opening experience.

Possible concept:

A full-screen aircraft / airport visual environment with:

- subtle atmospheric depth
- animated aircraft or 3D aircraft model
- runway / terminal geometry
- dynamic lighting
- restrained particles
- camera movement tied subtly to scrolling or pointer movement
- large editorial headline
- short supporting statement
- strong primary CTA
- secondary enquiry CTA
- subtle scroll indicator

The first 5 seconds should communicate:

**Aviation. Premium. Serious. Career-oriented.**

Do not make the animation slow enough to hurt usability.

---

# 07 — 3D / MOTION DIRECTION

3D is encouraged because budget is not the constraint.

Potential technology:

- Three.js
- React Three Fiber
- Drei
- GSAP
- WebGL
- CSS 3D transforms
- Lottie where genuinely useful

Do not add 3D simply because it is technically impressive.

Each 3D element must have a purpose.

Good candidates:

### Hero

A detailed but optimized aircraft model, abstract aircraft silhouette, engine turbine, runway, or terminal environment.

### Programs

Use depth or spatial transitions to make program discovery feel like moving through an airport / flight path.

### Placement section

Visualize career progression as a route / flight path / departure board / destination system.

### Statistics

Use subtle animated counters with restrained spatial transitions.

### Footer / CTA

A quiet atmospheric aviation scene can close the experience.

---

# 07A — 3D CAPABILITY TIERS + FALLBACKS

Build the cinematic layer progressively. Never assume the visitor has a desktop GPU.

### Tier A — Full experience

Desktop GPU, Apple silicon, high-end mobile:

- Full aircraft scene
- Scroll-driven camera movement
- Detailed atmosphere/cloud treatment
- Selective bloom only where it adds value
- DPR capped around 2

### Tier B — Balanced experience

Mid-range laptops and phones:

- Lower-poly / LOD aircraft
- Simpler atmospheric treatment
- No expensive post-processing
- DPR around 1–1.25
- Shorter hero sequence where useful

### Tier C — Content-first fallback

Low-end devices, no WebGL, context loss, Save-Data, or reduced-motion:

- Static AVIF/WebP poster
- CSS/UI transitions only
- No pinned scrub animation
- Same headline, copy, CTAs and information architecture

Expose a footer control such as **“Reduce motion and 3D”**.

Development should support a forced tier for QA, e.g. `?tier=A`, `?tier=B`, `?tier=C`.

### 3D implementation rules

- Load 3D only after first content paint; do not make WebGL a prerequisite for understanding the hero.
- Prefer `position: sticky` for pinning stability and a normalized scroll progress value for the scene.
- Pause rendering when the hero is off-screen or the document is hidden.
- Dispose geometries/materials/textures on unmount.
- Handle WebGL context loss by falling back to the poster.
- Prefer one strong light setup and restrained effects over multiple expensive post-processing passes.
- Use an **unbranded aircraft** unless the client supplies licensed brand-specific assets.

### Performance budgets for the 3D layer

Starter targets:

- 3D JS chunk ≤ ~450 KB gzip
- Total 3D assets ≤ ~6 MB on Tier A and ~2.5 MB on Tier B
- Aircraft GLB ≤ ~2.5 MB on Tier A and ~1 MB for a Tier B LOD
- Hero mobile poster ≤ ~120 KB where practical

Measure and report deviations instead of hiding them.

# 08 — MOTION LANGUAGE

Motion should feel:

- smooth
- cinematic
- precise
- engineered
- premium
- physically believable

Avoid:

- random floating animations
- excessive bouncing
- constant parallax everywhere
- gimmicky cursor effects
- distracting particle clouds
- animation on every element

Use motion hierarchy:

1. Hero transition
2. Section reveals
3. Large visual transitions
4. Important CTA feedback
5. Micro-interactions

Animation should guide attention, not demand attention.

Recommended principles:

- short micro-interactions
- medium section transitions
- occasional slow cinematic sequences
- smooth easing
- meaningful scroll-linked animation
- reduced-motion fallback

Respect `prefers-reduced-motion`.

---

# 09 — PROPOSED INFORMATION ARCHITECTURE

Build a coherent premium experience rather than an oversized one-page brochure.

Suggested sitemap:

### Home

- Hero
- Positioning / trust statement
- Organization introduction
- Programs overview
- Why the institute
- Placement credibility
- Verified hiring partners
- Placement statistics
- Student outcomes / stories
- Campus / experience
- FAQ
- Final CTA
- Footer / legal

### About

- Organization story
- Mission
- Vision
- Values
- Leadership / faculty if supplied
- Registration information
- Campus / facilities

### Programs / Courses

- All programs overview
- Individual program detail pages
- Eligibility
- Duration
- Curriculum
- Skills gained
- Career paths
- Training methodology
- Enquiry CTA

### Placement

- Placement philosophy
- Process
- Verified statistics
- Current verified hiring partners
- Roles / career outcomes
- Student stories
- Placement disclaimer

### Campus / Gallery

- Facilities
- Training environment
- Student activities
- Events
- Media / videos

### Contact / Enquire

- Enquiry form
- Phone
- WhatsApp
- Email
- Address
- Map
- Grievance information
- Business hours

### Legal

- Privacy Policy
- Terms & Conditions
- Refund / Cancellation Policy
- Disclaimer
- Grievance / contact

---

# 10 — HOMEPAGE SECTION DIRECTION

## Section 1 — Cinematic Hero

Goal: immediate premium positioning.

Include:

- strong headline
- concise supporting copy
- Apply Now
- Enquire Now
- subtle trust indicators
- cinematic aviation visual

Keep copy concise.

## Section 2 — “More Than Training” / Positioning

Explain what the institute actually does in one strong narrative section.

Use editorial composition rather than a three-card feature row.

## Section 3 — Programs

Show programs as premium visual modules.

Potential interaction:

- horizontal scrolling
- magnetic cursor / hover
- 3D depth
- image transitions
- expanding program panel

Every program must quickly communicate:

- program name
- duration
- intended career path
- primary value
- CTA

## Section 4 — The Training Experience

Show the actual experience of becoming aviation-ready:

- grooming
- communication
- safety
- customer service
- operational knowledge
- interview preparation
- practical training

Represent the process visually rather than dumping text into cards.

## Section 5 — Placement / Career Path

This is a major trust section.

Use a high-end information visualization.

Possible concept:

**TRAIN → PREPARE → INTERVIEW → PLACE → GROW**

Do not claim guaranteed placement unless legally and factually authorized.

## Section 6 — Verified Hiring Partners

Only show companies for which the client can prove a genuine and currently authorized partnership.

Do not use airline logos merely because graduates have worked there.

Separate concepts clearly:

- “Hiring Partners”
- “Student Career Destinations”

These are NOT necessarily the same thing.

## Section 7 — Placement Statistics

### Evidence display rule

Do not show a bare percentage. Every placement figure must communicate:

- what “placed” means;
- cohort/batch;
- time period;
- numerator and denominator (`n of N`);
- `asOf` date;
- short method note;
- a route/link to the methodology or trust page.

When nothing is verified, show the placement **process** instead of fake numbers.


Use real verified data.

Potential metrics:

- students trained
- placement rate
- hiring companies
- average time to placement
- campuses / locations
- years of operation

Every statistic needs a source/date or a backend-maintained value where appropriate.

Never invent statistics during development.

Use placeholders such as:

`[VERIFY: PLACEMENT_RATE]`

until the client supplies the data.

## Section 8 — Student Stories

Use authentic testimonials only.

Include:

- name
- role
- company
- course
- outcome
- photo if authorized

No fabricated testimonials.

## Section 9 — Campus / Atmosphere

Make visitors feel the physical environment.

Use cinematic photography, layered layouts, and immersive transitions.

## Section 10 — FAQ

Focus on actual pre-admission questions.

Do not use generic filler FAQ.

## Section 11 — Final CTA

Strong closing statement.

Example direction:

> YOUR CAREER HAS A DESTINATION.

Follow with:

- Apply Now
- Enquire Now
- WhatsApp

Then legal / trust information.

---

# 11 — BRAND IDENTITY DIRECTION

Do not treat the logo as an afterthought.

Create a mini brand system:

- primary logo
- responsive logo mark
- monochrome version
- favicon
- wordmark treatment
- color palette
- typography system
- button style
- icon style
- imagery style
- motion style
- radius / border language
- grid system

The identity should feel scalable beyond the website.

Potential visual metaphors:

- flight paths
- navigation coordinates
- runway markings
- aircraft wings
- altitude lines
- airport signage
- boarding pass geometry
- terminal architecture
- compass / directional systems
- aerospace engineering diagrams

Use metaphors subtly.

Do not make the website look like a literal airport dashboard.

---

# 12 — UX PRINCIPLES

The site should feel premium without becoming difficult to use.

Rules:

- Navigation remains obvious.
- Important CTAs remain accessible.
- The visitor should understand the business in seconds.
- Program information should never be buried inside animations.
- Motion must never block content.
- Mobile UX is a first-class experience, not a desktop adaptation.
- Forms should be short and easy.
- Users should be able to contact the institute quickly through WhatsApp or phone.
- Visual storytelling must support conversion.

Desktop can be cinematic.

Mobile should be **focused, fast, and elegant**.

Do not force heavy WebGL effects onto low-end mobile devices.

---

# 13 — TECHNICAL DIRECTION

## 13A — RECOMMENDED PRODUCTION STACK

Use a modern stack suitable for a premium interactive site:

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS driven by centralized design tokens
- React Three Fiber / Three.js / Drei for 3D
- GSAP + ScrollTrigger for the main scroll narrative
- Motion for lightweight UI transitions
- Radix primitives for accessible dialog/accordion behavior
- React Hook Form + Zod for forms and validation
- Vitest + Playwright + axe-core for quality checks

Resolve compatible stable versions at build time, pin exact versions where possible, and record why each dependency exists. Keep the dependency graph lean.

### Data architecture

No hard-coded factual copy inside visual components. Centralize structured content for:

- site identity
- programs
- placement stats
- hiring partners
- testimonials
- FAQs
- registration/approvals
- contact/grievance
- legal content
- placeholder tokens

This allows future CMS/backend integration without redesigning the frontend.


Preferred stack if no existing stack is mandated:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Three.js / React Three Fiber where beneficial
- GSAP for advanced motion
- Framer Motion only where simpler than GSAP
- modern image optimization
- semantic HTML
- accessible forms

Suggested architecture:

`app/`

`components/`

`components/3d/`

`components/motion/`

`components/sections/`

`components/ui/`

`lib/`

`public/`

`data/`

`content/`

Keep content separate from presentation so client updates are easy.

---

# 14 — PERFORMANCE REQUIREMENTS

Premium does not mean slow.

Target:

- fast initial render
- optimized images
- lazy-loaded heavy 3D assets
- code splitting
- GPU-friendly animation
- minimal layout shift
- good Core Web Vitals
- responsive images
- progressive enhancement

3D must have fallbacks.

For unsupported / low-power devices:

- use a high-quality static image/video fallback
- disable unnecessary WebGL
- reduce particle count
- simplify post-processing

Never sacrifice the basic website experience for effects.

---

# 14A — SECURITY / PRIVACY BASELINE

The website is public-facing and handles lead data, so security is part of the premium experience.

- No secrets in frontend code or repository.
- Validate server-side inputs with Zod.
- Rate-limit form endpoints.
- Use honeypot and/or Cloudflare Turnstile where appropriate.
- Keep PII out of logs.
- Do not echo submitted data in error messages.
- Use secure headers such as CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `frame-ancestors 'none'` where compatible with the hosting setup.
- No non-essential cookies or third-party trackers by default.
- If analytics/ad pixels are introduced later, nothing fires before consent and Accept/Reject choices must be presented with equal weight.

The legal pages remain drafts until reviewed and approved by the client/counsel. Do not state that the site “complies with” a law merely because a legal page exists.

# 15 — ACCESSIBILITY

Implement production-level accessibility:

- semantic HTML
- visible focus states
- keyboard navigation
- proper labels
- sufficient contrast
- alt text
- accessible forms
- reduced-motion support
- touch-friendly targets
- no information communicated only through animation

---

# 16 — SEO

Implement:

- unique page titles
- meta descriptions
- Open Graph metadata
- Twitter/X metadata where relevant
- semantic headings
- clean URLs
- sitemap
- robots.txt
- structured data where appropriate
- organization schema
- local business / educational organization markup where appropriate
- course structured data where appropriate

Do not make unsupported claims in SEO copy.

---

# 17 — CONTENT SAFETY / FACTUALITY RULES

## CLAIM GATE — MAKE TRUST STRUCTURAL, NOT MANUAL

Treat every trust-sensitive factual statement as structured content rather than loose prose.

Every claim should support fields similar to:

```ts
{
  status: 'verified' | 'placeholder',
  source: '',
  asOf: '',
  approvedBy: ''
}
```

Partners additionally require:

```ts
{
  authorized: true,
  authorizationRef: '',
  logoUsageApproved: true
}
```

Placement statistics additionally require:

```ts
{
  definition: 'written offer' | 'joined',
  cohort: '',
  period: '',
  placed: 0,
  total: 0,
  method: ''
}
```

In production, the verification script should fail when:

- a placeholder is reachable from a production route;
- `{{TOKEN}}` placeholders remain in rendered HTML/content;
- a partner lacks authorization metadata;
- `placed > total`;
- `asOf` is in the future;
- banned outcome superlatives appear without an explicitly verified claim.

Banned/high-risk language includes examples such as **100%, guaranteed, assured, No.1, best, top-ranked, guaranteed job, guaranteed placement**.

This is not about making the site cautious. It is about making its credibility defensible.


This is critical.

**Never fabricate business claims.**

Never invent:

- placement rates
- hiring partners
- government affiliation
- ISO certification
- DGCA approval / recognition
- airline tie-ups
- salary ranges
- student counts
- years of operation
- registration numbers
- accreditation
- awards
- testimonials
- job guarantees

Use explicit verification placeholders where source data is missing.

Example:

`[CLIENT INPUT REQUIRED — VERIFIED PLACEMENT RATE]`

`[CLIENT INPUT REQUIRED — AUTHORIZED HIRING PARTNERS]`

`[CLIENT INPUT REQUIRED — COMPANY REGISTRATION DETAILS]`

This is especially important because aviation-training websites often make trust-sensitive claims.

---

# 18 — PARTNER LOGO RULE

Do not download random company logos from the internet and present them as official partnerships.

For every hiring partner, maintain fields like:

```ts
{
  name: "Company Name",
  logo: "/assets/partners/company.svg",
  relationshipType: "AUTHORIZED_HIRING_PARTNER",
  verificationStatus: "PENDING",
  verificationSource: "",
  lastVerifiedAt: ""
}
```

Only display partners after the client confirms authorization. If there are zero verified partners, **remove the partner section entirely in production** rather than filling it with logos for visual symmetry. Never imply a relationship through imagery, copy, alt text, metadata, structured data or decorative airline liveries.

Potential relationship labels:

- Authorized Hiring Partner
- Recruitment Partner
- Campus Recruitment Partner
- Student Career Destination
- Alumni Employer

Never merge these categories.

---

# 19 — FORMS / LEAD FLOW

Create a polished enquiry experience.

Suggested fields:

- Full Name
- Phone Number
- Email
- Course Interested In
- Location
- Optional Message

Keep the first interaction frictionless.

Primary conversion paths:

**Apply Now** → application / admissions flow

**Enquire Now** → enquiry form

**WhatsApp** → instant conversation

**Call** → phone action on mobile

Include validation, loading, success, and error states.

Never expose secrets in frontend code.

---

# 20 — ADMIN / CONTENT READINESS

Architect content so later development can connect to a CMS or backend.

At minimum, structure dynamic content as data:

- courses
- testimonials
- statistics
- partners
- gallery items
- FAQs
- contact information

This makes future updates possible without redesigning the site.

---

# 21 — FOOTER

Footer should feel like part of the brand—not a legal dump.

Include:

- logo
- short positioning statement
- navigation
- courses
- contact
- address
- phone
- email
- WhatsApp
- grievance/contact information
- legal pages
- company/institute registration information
- copyright

Legal links should remain clearly accessible.

---

# 22 — DESIGN EXPLORATION BEFORE CODING

Do not immediately start writing random components.

First establish:

1. Visual concept
2. Brand direction
3. Color system
4. Typography
5. Grid
6. Hero concept
7. Motion language
8. 3D concept
9. Information architecture
10. Component system

Then implement.

The final result should feel intentional from the first viewport to the footer.

---

# 23 — QUALITY BAR

Ask yourself:

> Would this website look credible next to a premium airline, private aviation company, or modern aerospace brand?

If the answer is no, keep iterating.

The goal is not to make the most animated website.

The goal is to make the **most believable premium aviation experience**.

It should feel like:

**precision + aspiration + trust + movement + calm confidence.**

---

# 24 — DEVELOPMENT WORKFLOW

Work in this order:

### Phase 1 — Discovery

Inspect the provided reference website and extract:

- business model
- current information architecture
- publicly stated programs
- current contact information
- current placement messaging
- existing visual conventions

Do not copy the UI.

### Phase 2 — Creative Direction

Produce a clear visual concept.

Choose:

- theme
- type system
- colors
- photography style
- visual metaphors
- motion language
- 3D strategy

### Phase 3 — Architecture

Create the page and component structure.

### Phase 4 — High-Fidelity Build

Build the desktop experience first while keeping responsive constraints in mind.

### Phase 5 — Mobile Experience

Redesign interaction patterns where needed instead of simply stacking desktop components.

### Phase 6 — 3D / Motion

Add the cinematic experience after the core layout works.

### Phase 7 — Verification

Test:

- navigation
- CTAs
- forms
- animations
- mobile
- tablet
- desktop
- keyboard access
- reduced motion
- slow devices
- broken image states
- loading states
- SEO
- console errors

### Phase 8 — Final Polish

Fix spacing, typography, transitions, hierarchy, responsiveness, edge cases, and visual inconsistencies.

Do not stop at “it works.”

Stop at “it feels finished.”

---

# 25 — AI AGENT BEHAVIOR

You are allowed to make design decisions independently.

Do not ask for approval for every small choice.

Use strong design judgment.

However, **do ask for client data when factual information is required**.

Separate:

- creative decisions → make them yourself
- technical decisions → make them yourself
- factual business claims → require verified client input

Never block the project because a visual decision is ambiguous.

Never invent factual data just to make the page look complete.

Use placeholders cleanly when needed.

---

# 26 — WHEN REVIEWING YOUR OWN OUTPUT

Before declaring the work complete, inspect the rendered page and ask:

### Visual

- Does it look premium at first glance?
- Does the hero feel unique?
- Is the typography expensive-looking rather than decorative?
- Is the whitespace intentional?
- Are sections visually related?
- Is the visual rhythm strong?

### UX

- Can a user understand the business quickly?
- Are Apply / Enquire actions obvious?
- Can a mobile user contact the institute in seconds?
- Are forms easy?

### Motion

- Are animations purposeful?
- Does the website remain usable without them?
- Does the motion feel aviation-inspired rather than generic web animation?

### Trust

- Are partner claims verified?
- Are placement statistics verified?
- Are legal pages present?
- Is company/institute registration information clearly surfaced?

### Technical

- No console errors.
- No broken assets.
- No unnecessary dependencies.
- No obvious performance bottlenecks.
- Responsive at real breakpoints.

---

# 26A — EVIDENCE-BASED QA GATES

Minimum production checks should include:

### Performance

Target roughly:

- LCP ≤ 2.5s
- CLS ≤ 0.1
- INP ≤ 200ms
- Lighthouse Performance ≥ 90 with 3D deferred
- Lighthouse Performance ≥ 80 on Tier B with 3D mounted

Test with a mobile profile, CPU throttling and Fast 4G—not only on the development machine.

### Accessibility

- WCAG 2.2 AA target
- zero serious/critical axe issues
- complete keyboard path for nav, dialogs, accordion and forms
- reduced-motion route/behavior tested
- visible focus states
- touch targets ≥ 44px
- 3D canvas `aria-hidden` with an equivalent textual experience
- text over moving visuals remains readable at multiple scroll positions

### Responsive matrix

Stress test at least: 320, 375, 390, 768, 1024, 1440 and 1920px. Check for overflow, long names, empty states, network failures and missing imagery.

### Route smoke test

Every route must have:

- no console errors
- no broken critical assets
- valid title/description/canonical behavior
- functioning Apply/Enquire CTA
- intentional loading/error/empty states

# 26B — PHASED BUILD PLAN

### Phase 0 — Recon + design plan

Produce:

- business/content reconnaissance
- sitemap
- visual concept
- tokens
- homepage wireframes for mobile and desktop
- 3D concept
- open questions/data checklist
- anti-default design review

Then stop at **Gate A** for human review.

### Phase 1 — Foundation

Scaffold the app, tokens, content schema, placeholder system, navigation shell, forms, SEO foundations and accessibility primitives. Prove that placeholder content can be detected.

### Phase 2 — Brand

Build logo/identity directions, favicon/OG assets, typography system, iconography and visual usage rules. Mark exploratory concepts as concepts until Rishu chooses the direction.

### Phase 3 — Content-first baseline

Build all core routes **without depending on the heavy 3D layer**. Forms should work against a mock lead sink. Legal pages exist as clearly marked drafts. Responsive and accessibility checks happen here.

Then stop at **Gate B**. This is the shippable baseline.

### Phase 4 — 3D + motion

Layer in the Ascent hero, capability tiers, Departures board and Boarding Pass interaction. Re-run performance and accessibility checks.

### Phase 5 — Hardening

Security headers, audit, cross-browser checks, reduced motion, 320px stress test, throttled-network checks, screenshot capture and final content verification.

### Phase 6 — Handoff

Deliver README, content guide, deployment notes, asset/license log, legal review list, decisions log, QA report, performance report and unresolved questions.

# 27 — FINAL CREATIVE NORTH STAR

Build a website that makes someone think:

> “This doesn't feel like an aviation coaching website.”
>
> “This feels like a serious aviation brand.”

The visual experience should create aspiration without becoming theatrical.

The interaction design should feel effortless.

The information architecture should feel obvious.

The trust layer should feel transparent.

The technology should disappear into the experience.

**Premium is not more effects. Premium is better decisions.**

---

Before final content lock, the agent should generate or maintain these working documents in the repo:

- `PLAN.md`
- `DESIGN_PLAN.md`
- `INPUTS_NEEDED.md`
- `OPEN_QUESTIONS.md`
- `DECISIONS.md`
- `ASSETS.md`
- `LEGAL_REVIEW.md`
- `QA_REPORT.md`
- `PERF_REPORT.md`
- `PROGRESS.md`
- `CONTENT_GUIDE.md`
- `DEPLOY.md`

Keep `PROGRESS.md` current so another session can resume the work without guessing what has already happened.

# 28 — CLIENT INPUTS REQUIRED BEFORE FINAL CONTENT LOCK

Create a clear data checklist and keep these values configurable:

- [CLIENT] Official legal organization name
- [CLIENT] Official logo / brand assets
- [CLIENT] Final brand colors, if already defined
- [CLIENT] Registration details
- [CLIENT] Institute address
- [CLIENT] Phone
- [CLIENT] Email
- [CLIENT] WhatsApp number
- [CLIENT] Official programs and exact names
- [CLIENT] Course duration
- [CLIENT] Eligibility
- [CLIENT] Fees, if public
- [CLIENT] Placement statistics + measurement period
- [CLIENT] Authorized hiring partners + proof / confirmation
- [CLIENT] Student success stories
- [CLIENT] Testimonials + consent
- [CLIENT] Campus photos / videos
- [CLIENT] Refund / cancellation terms
- [CLIENT] Privacy policy text
- [CLIENT] Terms & Conditions text
- [CLIENT] Disclaimer text
- [CLIENT] Grievance officer / contact details
- [CLIENT] Any official accreditation / affiliation claims

Until supplied, use elegant placeholders rather than made-up content.

---

# 29 — DELIVERABLE STANDARD

The implementation is not complete merely because all routes render. It is complete when the experience, evidence, conversion path and engineering quality have all been checked.


The finished implementation should include:

- complete responsive website
- reusable design system
- polished navigation
- premium hero
- purposeful motion
- optimized 3D where beneficial
- courses/program presentation
- placement section
- verified-partner architecture
- statistics section
- enquiry/application flow
- contact section
- legal pages
- SEO foundations
- accessibility foundations
- performance fallbacks
- clean maintainable code

Do not deliver a rough prototype disguised as a finished site.

Build it like it will actually be presented to a paying client.


---

# APPENDIX — REQUIRED PHASE REPORT FORMAT

End each major phase with:

```text
PHASE <n> REPORT

Done:

Verified (command/check → result):

Unverified / needs human eyes:

Deviations from brief (and why):

Open questions:

Risks:

Next:
```

The report must be evidence-based. Never manufacture a successful result to keep momentum.

# APPENDIX — NON-NEGOTIABLE REMINDERS

1. Truth beats polish.
2. A verified partner is better than ten decorative logos.
3. A real `n of N` outcome is better than a seductive percentage.
4. 3D is an enhancement, not the website.
5. The content-first baseline must work without WebGL.
6. Apply Now and Enquire Now must remain obvious and functional.
7. One memorable cinematic idea is stronger than twenty effects.
8. Never copy the reference sites.
9. Never claim visual verification you did not perform.
10. Premium is not more effects. Premium is better decisions.
