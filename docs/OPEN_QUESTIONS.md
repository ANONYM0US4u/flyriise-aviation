# OPEN QUESTIONS — Flyriise Aviation

Decisions that are not ours to make. Each one has a recommendation so the client
can answer with a single word. Nothing here blocks the running preview — the
site resolves to a safe default in every case.

---

### Q1. Is the logo mark concept approved?
**Default now:** the "ascent" mark drawn in code (departure point → climb path →
arrival vector). It is monochrome-capable, legible at 16 px and scale-free.
**Question:** keep it, or supply the client's existing logo (`ASSETS.md` D1)?
**Recommendation:** keep it if the institute has no registered mark. If it does,
supply the files and we swap without touching layout.

### Q2. Is "Aviation is a discipline. We train you like one." the right headline?
**Default now:** yes — it states a standard without promising an outcome.
**Question:** confirm tone. The alternative register (warmer, more local) is a
single data-file edit (`data/home.ts` → `hero.headline`).

### Q3. Should fees be published or shared at counselling?
**Default now:** shared at counselling, stated explicitly on every programme.
**Trade-off:** publishing fees converts better for price-sensitive candidates but
goes stale and creates a refund-policy surface.
**Recommendation:** keep "shared at counselling" until the fee structure is
supplied with an effective-from date (`INPUTS_NEEDED.md` A6).

### Q4. Do male candidates get a clear answer on the site?
**Current copy:** the FAQ asks the question honestly and answers it as "per track
and batch — confirm with admissions".
**Question:** does the institute have a single policy it can state?
**Recommendation:** a clear answer beats a careful non-answer here. One sentence
in `data/faqs.ts` if the policy is uniform.

### Q5. Should the placement board appear at all before there is data?
**Default now:** yes — it appears with every metric in an `AWAITING DATA` state,
plus a visible list of the data still required.
**Reason:** it demonstrates the measurement discipline and pre-solves the client's
own reporting. **Risk:** an empty-looking board can read as weakness to a
first-time visitor.
**Recommendation:** keep it, and switch `CONTENT_MODE=production` before launch —
in production mode unverified metrics are withheld rather than shown empty.

### Q6. What happens to Vistara and GoFirst on the destinations list?
**Question:** both have changed status (Vistara merged into Air India; GoFirst
ceased operations). Keep as history, replace, or remove?
**Default now:** both listed with a "re-verification watchlist" note.
**Recommendation:** remove GoFirst, keep Vistara only if alumni can be
re-verified through Air India.

### Q7. Which photograph style? Stock-looking or documentary?
**Default now:** drawn/abstract scenes in the site's own visual language; no
photography at all until the client supplies it.
**Question:** real campus and classroom photography, or a fully illustrated
site? Real photography raises trust fastest; illustrated stays perfectly
consistent and costs nothing to maintain.

### Q8. Do we launch with analytics?
**Default now:** **no third-party scripts.** The site ships zero trackers, which
is part of the trust story and part of the performance budget.
**Question:** does the institute want GA4 / Meta Pixel / a call-tracking number?
**Recommendation:** if yes, add through the lead sink and a consent-gated tag,
never hard-coded into the layout — and record the decision in
`LEGAL_REVIEW.md`, because analytics plus a privacy policy is a disclosure duty.

### Q9. Who answers the phone?
The number is published as the institute's main line. **Question:** is it a
desk during business hours and a personal number outside them? If so, the site
should state office hours rather than imply 24-hour availability
(`INPUTS_NEEDED.md` A3).

### Q10. Is WhatsApp Business on a dedicated number?
**Default now:** the same number as the phone line.
**Question:** a dedicated admissions number is better for the conversion bar and
allows different availability messaging.

### Q11. Domain and hosting — who owns the decision?
**Recommendation:** the client's own registrar and a host they can pay directly,
so the site and its data belong to the institute rather than to the agency.
See `DEPLOY.md` for the technical checklist either way.

### Q12. Any language other than English?
**Default now:** English only, `lang="en-IN"`.
**Question:** Bengali or Hindi versions, or English-only with a phone-first
admissions desk? A second language is a content project, not a translation
toggle — it doubles the copy that needs verification.