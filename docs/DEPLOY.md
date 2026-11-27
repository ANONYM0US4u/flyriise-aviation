# DEPLOY — Flyriise Aviation

From this checkout to a live domain. Written so a hosting provider can follow
it without reading the code.

---

## 1. Requirements

| Item | Value |
| --- | --- |
| Node | ≥ 20.9 (built and tested on 24.x) |
| Package manager | npm 11 |
| Build | `npm ci && npm run check && npm run build` |
| Output | Next.js standalone-style build, served by `next start` |
| Databases | **none** — lead intake is a file or an HTTP webhook |

No database, no Redis, no queue, no third-party JavaScript. The whole site is
static pages plus one small API route.

---

## 2. Hosting options

| Option | Fit | Notes |
| --- | --- | --- |
| **Vercel** | Best default | Zero-config Next.js, edge CDN, preview deploys per push. Free tier is enough to start |
| **Node host (Railway / Render / Fly / a VPS)** | Full control | Needs Node 20+, ~512 MB RAM is comfortable, 1 GB safer for build |
| **Static export + separate form handler** | Only if hosting is very cheap | Not recommended: the lead API is part of the product |

**Recommendation:** Vercel or a Node host close to Indian users (Mumbai region).
The audience is in and around Kolkata — an origin in the US adds ~200 ms per
connection, which is the single biggest performance lever left
(`PERF_REPORT.md` §6).

---

## 3. Environment variables

Copy `.env.example` to `.env.local` (or set them in the host's dashboard).
**Never commit real values.**

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `CONTENT_MODE` | **yes** | `demo` | **Set `production` for the live site** |
| `LEAD_SINK_FILE` | no | `leads.jsonl` | File name inside `./.data` (mock sink) |
| `LEAD_SINK_URL` | no | — | POST leads here — CRM webhook or the Apps Script email relay |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | no | `917595952320` | Digits only, international format |
| `NEXT_PUBLIC_SITE_URL` | recommended | `https://www.flyriiseaviation.in` | Used for canonical URLs, sitemap, Open Graph |

### About the lead sink
The request body is the validated lead JSON; retries are the sink's job.

- **Local / VPS pilot:** leave the file sink. Leads append to `.data/leads.jsonl`
  (gitignored). Check it daily.
- **Production:** set `LEAD_SINK_URL`. Serverless hosts (Vercel, Netlify) have a
  read-only filesystem, so the file sink cannot work there.
- **No CRM yet?** `docs/apps-script/lead-webhook.gs` is a ready-to-paste Google
  Apps Script web app that appends each enquiry to a spreadsheet and emails it
  to admissions. Deploy it, then use its `/exec` URL as `LEAD_SINK_URL`.

If the sink cannot be reached the API returns `502` with a neutral message
rather than silently dropping the enquiry.

---

## 4. Build and start

```bash
npm ci
npm run check        # typecheck + lint + tests + content gate
npm run build
npm start            # add PORT=<port> if PORT is preset to 0
```

Post-build smoke test before pointing DNS at it:

```bash
curl -I  https://<host>/                    # 200
curl -I  https://<host>/sitemap.xml         # 200
curl -I  https://<host>/definitely-not-a-page   # 404
curl -X POST https://<host>/api/lead -H 'content-type: application/json' \
  -d '{"name":"Test","phone":"+91 00000 00000","email":"t@example.com","programSlug":"cabin-crew-training","consent":true}'
# expect 201 with a reference like FA-261004-SXKC
```

---

## 5. Security headers

Set by `next.config.ts` and `middleware.ts` — confirm they arrive:

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; …` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (production only) |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera, microphone, geolocation and payment disabled |

**CSP caveat (read before changing it).** The policy does not use `'strict-dynamic'`
because the current Turbopack build emits script tags **without nonce attributes**;
adding the nonce blocked every script and made the page inert. A nonce is still
generated and forwarded as `x-nonce`. When the builder attaches nonces, switch to
`script-src 'nonce-…' 'strict-dynamic'` — a one-line change. See
`DECISIONS.md` D-10 and `QA_REPORT.md` CSP-1.

**Development adds `'unsafe-eval'`, production does not.** React's development
build needs `eval()` to reconstruct call stacks, so `middleware.ts` appends
`'unsafe-eval'` to `script-src` when `NODE_ENV !== "production"`. The header
above is what ships. Do not copy the dev policy into a production config — see
`QA_REPORT.md` CSP-2.

---

## 6. CDN and caching

| Path | Recommended |
| --- | --- |
| `/_next/static/*` | `public, max-age=31536000, immutable` |
| `/_next/image` | `public, max-age=31536000, immutable` |
| HTML | short TTL or revalidate on deploy; keep it simple |
| `api/lead` | never cached |

Enable **Brotli** (not just gzip) and HTTP/2 or 3. These are worth more than any
code-level optimisation at this point.

---

## 7. DNS and domain

1. Point the apex and `www` at the host (A/AAAA or CNAME per provider)
2. TLS certificate — automatic on all recommended hosts
3. `NEXT_PUBLIC_SITE_URL` set to the final origin **before** the first build
4. Rebuild and redeploy so canonical URLs, the sitemap and Open Graph tags are
   correct
5. Submit the sitemap in Google Search Console
6. Create/claim the Google Business Profile so the address matches the site
   exactly (NAP consistency)

---

## 8. Launch checklist

**Content and trust**
- [ ] `CONTENT_MODE=production` is set on the live deployment
- [ ] Grievance officer name, email, phone and response window are live
- [ ] CIN / GSTIN published (or the client has confirmed the wording without them)
- [ ] Business hours published
- [ ] Four student stories have written consent, or are withheld
- [ ] Vistara / GoFirst decision applied (`OPEN_QUESTIONS.md` Q6)
- [ ] `npm run verify:content` passes on the final content

**Legal**
- [ ] Counsel has reviewed the four legal documents
- [ ] Refund policy states real terms, not "contact us"
- [ ] Fee data published or the "shared at counselling" wording confirmed

**Technical**
- [ ] `npm run check` passes; `npm run build` clean
- [ ] All routes return expected codes; `/api/lead` returns 201 with a real sink
- [ ] Security headers present (table in §5)
- [ ] HSTS active
- [ ] CDN caching + Brotli configured
- [ ] Uptime monitor on `/` and a weekly check of the lead sink
- [ ] Backup plan for leads if using the file sink

**Physical world**
- [ ] Phone number on the site is staffed during published hours
- [ ] Printed brochure matches the site's copy

---

## 9. After launch

| When | Do |
| --- | --- |
| Daily (pilot) | Check leads arrived; check the server log for 5xx |
| Weekly | `npm run verify:content`; review `QA_REPORT.md` defects still open |
| Monthly | Re-check partner/destination freshness; refresh `asOf` dates; request alumni consent for new stories |
| On content change | `npm run check` → rebuild → deploy; never edit `components/` to change a sentence |

---

## 10. Rollback

1. Redeploy the previous successful build (every recommended host keeps
   immutable deployments)
2. If leads were being written to a file sink, they are still on disk — no loss
3. If leads were going to a webhook, the webhook must own its retries; the site
   does not retry
4. Post-incident: record what failed in `QA_REPORT.md` before closing it

---

## 11. Handover bundle

Give the client, in one folder:

1. This `docs/` directory — the operating manual
2. `.env.example` — the variable list with no values
3. A short written walkthrough of `CONTENT_GUIDE.md` §5 (the four edits they will
   actually make)
4. Written confirmation of who owns the domain registrar and the hosting account
   — the site and its data should belong to the institute