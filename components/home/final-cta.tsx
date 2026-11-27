import Image from "next/image";
import Link from "next/link";
import { HeroPoster } from "@/components/three/hero-poster";
import { Action } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, WhatsApp } from "@/components/ui/icons";
import { Eyebrow } from "@/components/ui/section";
import { finalCta } from "@/data/home";
import { site } from "@/data/site";
import { legalNav } from "@/data/navigation";
import { mailHref, telHref, whatsappHref } from "@/lib/contact";
import { registrationDisclaimer } from "@/data/legal-disclaimer";

/**
 * SECTION 11 — Final CTA / arrival (brief §04A, §10 section 11).
 * The night close: a quiet atmospheric scene, one decisive statement, three
 * ways to reach admissions, and the trust/legal line left visible rather than
 * buried in the footer.
 */
export function FinalCta() {
  return (
    <section id="apply" aria-labelledby="final-cta-heading" className="relative overflow-hidden bg-apron">
      {/* Quiet atmospheric close — the same apron, mirrored, low in the frame */}
      <div aria-hidden className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 scale-x-[-1]">
          <HeroPoster />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-apron via-apron/80 to-apron" />
      <div aria-hidden className="absolute inset-0 grid-lines opacity-30" />

      {/*
        Cinematic close: dusk on the tarmac, fading into the night section.
        Decorative atmosphere only — it is not campus photography, and no
        outcome is implied by it (Unsplash licence, see docs/ASSETS.md).
      */}
      <div
        aria-hidden
        className="relative h-[150px] w-full overflow-hidden sm:h-[210px] lg:h-[250px]"
      >
        <Image
          src="/images/atmosphere-tarmac.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_62%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-apron/45 via-apron/45 to-apron" />
      </div>

      <div className="container-wide relative py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>{finalCta.eyebrow}</Eyebrow>
            <h2 id="final-cta-heading" className="display mt-6 text-display-1 text-cirrus">
              Your career has a destination.
            </h2>
            <p className="measure mt-6 text-[1.0625rem] leading-[1.68] text-steel">{finalCta.body}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Action href="/apply" variant="primary" size="lg" icon={<ArrowRight />}>
                {site.cta.apply}
              </Action>
              <Action href="/contact#enquire" variant="secondary" size="lg">
                {site.cta.enquire}
              </Action>
              <Action href={whatsappHref()} external variant="secondary" size="lg" icon={<WhatsApp />}>
                <span className="hidden sm:inline">WhatsApp admissions</span>
                <span className="sm:hidden">WhatsApp</span>
              </Action>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[var(--radius-md)] border border-hairline bg-apron/60 p-6 backdrop-blur-sm">
              <p className="mono-label text-amber">Reach admissions</p>
              <ul className="mt-5 space-y-4">
                <li>
                  <a
                    href={telHref}
                    className="flex items-center gap-3 text-[0.9375rem] text-cirrus transition-colors hover:text-amber"
                  >
                    <Phone className="text-steel" />
                    <span className="tnum">{site.contact.phone.display}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[0.9375rem] text-cirrus transition-colors hover:text-amber"
                  >
                    <WhatsApp className="text-steel" />
                    WhatsApp — fastest route
                  </a>
                </li>
                <li>
                  <a
                    href={mailHref}
                    className="flex items-center gap-3 text-[0.9375rem] text-cirrus transition-colors hover:text-amber"
                  >
                    <Mail className="text-steel" />
                    {site.contact.email.display}
                  </a>
                </li>
              </ul>

              <p className="mono-label mt-6 border-t border-hairline pt-4 text-steel-deep normal-case tracking-[0.03em]">
                {finalCta.note}
              </p>
              <p className="measure-tight mt-3 text-[0.8125rem] leading-[1.65] text-steel-deep">
                {registrationDisclaimer}
              </p>
            </div>
          </div>
        </div>

        <nav aria-label="Legal" className="mt-14 flex flex-wrap gap-x-6 gap-y-3 border-t border-hairline pt-6">
          {legalNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mono-label text-steel transition-colors hover:text-amber"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/legal" className="mono-label text-steel transition-colors hover:text-amber">
            Trust centre
          </Link>
        </nav>
      </div>
    </section>
  );
}