import Link from "next/link";
import { LogoLockup } from "@/components/site/logo";
import { MotionToggle } from "@/components/motion/motion-toggle";
import { ArrowUpRight, Mail, Phone, Pin, WhatsApp } from "@/components/ui/icons";
import { site } from "@/data/site";
import { footerNav, legalNav } from "@/data/navigation";
import { mailHref, telHref, whatsappHref } from "@/lib/contact";

/**
 * Footer (brief §21). Brand close, navigation, contact, compliance and legal —
 * structured so trust information reads as part of the brand, not a legal dump.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-apron text-cirrus">
      <div aria-hidden className="runway-rule w-full opacity-40" />
      <div aria-hidden className="absolute inset-0 grid-lines opacity-30" />

      <div className="container-wide relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <LogoLockup />
            <p className="measure mt-6 text-[0.9375rem] leading-[1.7] text-steel">
              {site.brand.positioning} Training for cabin crew, airport operations, ground staff and
              hospitality careers — with placement assistance.
            </p>
            <MotionToggle className="mt-8" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="mono-label text-steel-deep">{group.title}</h2>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className="text-[0.9375rem] text-cirrus/85 transition-colors hover:text-amber"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h2 className="mono-label text-steel-deep">Contact</h2>
            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={telHref}
                  className="flex items-center gap-3 text-[0.9375rem] text-cirrus/90 transition-colors hover:text-amber"
                >
                  <Phone className="text-steel" />
                  {site.contact.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[0.9375rem] text-cirrus/90 transition-colors hover:text-amber"
                >
                  <WhatsApp className="text-steel" />
                  WhatsApp the desk
                </a>
              </li>
              <li>
                <a
                  href={mailHref}
                  className="flex items-center gap-3 text-[0.9375rem] text-cirrus/90 transition-colors hover:text-amber"
                >
                  <Mail className="text-steel" />
                  {site.contact.email.display}
                </a>
              </li>
              <li className="flex items-start gap-3 text-[0.9375rem] leading-[1.6] text-steel">
                <Pin className="mt-0.5 text-steel" />
                <address className="not-italic">
                  {site.contact.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              {site.contact.hours.value ? (
                <li className="flex items-start gap-3 text-[0.9375rem] text-steel">
                  <span>{site.contact.hours.value}</span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* Compliance / trust block */}
        <div className="mt-16 grid gap-8 border-t border-hairline pt-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="mono-label text-steel-deep">Institute &amp; registration</h2>
            <p className="mt-4 text-[0.875rem] leading-[1.7] text-steel">
              {site.brand.legalName}. {site.registration.entityType}.
            </p>
            {site.registration.cin || site.registration.affiliations.length > 0 ? (
              <div className="mt-4 space-y-2">
                {site.registration.cin ? (
                  <p className="mono-label text-steel">CIN {site.registration.cin}</p>
                ) : null}
                {site.registration.affiliations.length > 0 ? (
                  <p className="mono-label text-steel">{site.registration.affiliations.join(" · ")}</p>
                ) : null}
              </div>
            ) : null}
            <p className="measure-tight mt-4 text-[0.8125rem] leading-[1.65] text-steel-deep">
              {site.registration.note}
            </p>
          </div>

          <div className="lg:col-span-4">
            <h2 className="mono-label text-steel-deep">Grievance</h2>
            <p className="measure-tight mt-4 text-[0.875rem] leading-[1.7] text-steel">
              Concerns about admissions, conduct or this website can be raised at{" "}
              <a
                href={mailHref}
                className="text-cirrus underline underline-offset-4 transition-colors hover:text-amber"
              >
                {site.grievance.email ?? site.contact.email.display}
              </a>{" "}
              and will be acknowledged in writing.
            </p>
            {site.grievance.officerName ? (
              <p className="mono-label mt-4 text-steel">{site.grievance.officerName}</p>
            ) : null}
          </div>

          <div className="lg:col-span-3">
            <h2 className="mono-label text-steel-deep">Legal</h2>
            <ul className="mt-4 space-y-3">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="group inline-flex items-center gap-2 text-[0.9375rem] text-cirrus/85 transition-colors hover:text-amber"
                  >
                    {item.label}
                    <ArrowUpRight className="opacity-50 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/legal"
                  prefetch={false}
                  className="mono-label text-steel transition-colors hover:text-amber"
                >
                  Trust centre
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-label text-steel-deep">
            © {year} {site.brand.legalName}
          </p>
          <p className="mono-label text-steel-deep">
            Placement assistance provided · Employment decided by recruiting organisations
          </p>
        </div>
      </div>
    </footer>
  );
}
