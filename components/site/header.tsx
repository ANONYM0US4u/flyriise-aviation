"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState, useSyncExternalStore } from "react";
import { LogoLockup } from "@/components/site/logo";
import { Action } from "@/components/ui/button";
import { Close, Mail, Menu, Phone, WhatsApp } from "@/components/ui/icons";
import { site } from "@/data/site";
import { primaryNav } from "@/data/navigation";
import { mailHref, telHref, whatsappHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

/**
 * Scroll position as an external store: the header surface switches at 24px
 * without an effect writing state on every scroll frame.
 */
function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function hasScrolled() {
  return window.scrollY > 24;
}

/**
 * Header. Sticky, quiet, and always one tap from admissions: phone, WhatsApp
 * and Apply Now are present in the bar itself on every viewport (brief §12).
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeToScroll, hasScrolled, () => false);

  /* Closing on navigation is done at the link, not in an effect keyed on the
     pathname — the drawer closes on tap, including taps on the current page. */
  const closeDrawer = useCallback(() => setOpen(false), []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-hairline bg-apron/85 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-apron/70 to-transparent",
      )}
    >
      <div className="container-wide flex h-[4.25rem] items-center justify-between gap-2 sm:gap-4 lg:h-[4.75rem] lg:gap-6">
        <Link
          href="/"
          className="min-w-0 rounded-[var(--radius-sm)] py-2"
          aria-label={`${site.brand.name} — home`}
        >
          <LogoLockup showDescriptor={false} short />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "mono-label rounded-[var(--radius-sm)] px-3 py-2.5 transition-colors",
                      active ? "text-amber" : "text-steel hover:text-cirrus",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <a
            href={telHref}
            className="mono-label hidden items-center gap-2 px-3 text-steel transition-colors hover:text-cirrus xl:flex"
          >
            <Phone />
            {site.contact.phone.display}
          </a>
          <Action
            href="/contact#enquire"
            variant="secondary"
            className="hidden whitespace-nowrap md:inline-flex"
          >
            {site.cta.enquire}
          </Action>
          <Action
            href="/apply"
            variant="primary"
            className="whitespace-nowrap px-3.5 sm:px-5"
          >
            <span className="hidden sm:inline">{site.cta.apply}</span>
            <span className="sm:hidden">Apply</span>
          </Action>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] border border-hairline text-cirrus transition-colors hover:border-hairline-strong lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-apron/80 backdrop-blur-sm data-[state=open]:animate-[fadeIn_180ms_ease-out]" />
              <Dialog.Content
                className={cn(
                  "fixed inset-y-0 right-0 z-50 flex w-full max-w-[26rem] flex-col overflow-y-auto",
                  "border-l border-hairline bg-apron px-6 pb-10 pt-6 shadow-[var(--shadow-board)]",
                )}
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <div className="flex items-center justify-between">
                  <LogoLockup showDescriptor={false} />
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] border border-hairline text-cirrus"
                      aria-label="Close menu"
                    >
                      <Close className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav aria-label="Mobile" className="mt-8">
                  <ul className="border-t border-hairline">
                    {primaryNav.map((item, index) => (
                      <li key={item.href} className="border-b border-hairline">
                        <Link
                          href={item.href}
                          prefetch={false}
                          onClick={closeDrawer}
                          className="flex items-baseline justify-between gap-4 py-5"
                        >
                          <span className="display text-[1.35rem] text-cirrus">{item.label}</span>
                          <span className="mono-label text-steel-deep">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </Link>
                        {item.hint ? (
                          <p className="pb-4 text-[0.8125rem] leading-[1.55] text-steel">
                            {item.hint}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-8 space-y-3">
                  <Action href="/apply" variant="primary" size="lg" className="w-full">
                    {site.cta.apply}
                  </Action>
                  <Action
                    href={whatsappHref()}
                    external
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    icon={<WhatsApp />}
                  >
                    {site.cta.whatsapp}
                  </Action>
                  <div className="grid grid-cols-2 gap-3">
                    <Action href={telHref} variant="secondary" icon={<Phone />}>
                      {site.cta.call}
                    </Action>
                    <Action href={mailHref} variant="secondary" icon={<Mail />}>
                      Email
                    </Action>
                  </div>
                </div>

                <div className="mt-8 border-t border-hairline pt-5">
                  <p className="mono-label text-steel-deep">{site.contact.address.lines.join(", ")}</p>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
