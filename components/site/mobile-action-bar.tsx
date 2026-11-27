import { Action } from "@/components/ui/button";
import { Phone, WhatsApp } from "@/components/ui/icons";
import { site } from "@/data/site";
import { telHref, whatsappHref } from "@/lib/contact";

/**
 * Mobile conversion bar (brief §12: a mobile user must be able to contact the
 * institute in seconds). Fixed to the bottom on small screens only, with
 * safe-area padding for gesture-bar devices. Content padding is reserved in
 * the layout so nothing is ever hidden behind it.
 */
export function MobileActionBar() {
  return (
    /* A landmark, not a stray fixed div: axe-core requires page content to sit
       inside a landmark, and a screen-reader user needs these three actions in
       the structure rather than floating after the footer. */
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-apron/92 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
    >
      <div className="flex items-center gap-2 px-3 pt-2">
        <a
          href={telHref}
          className="mono-label flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-hairline text-cirrus"
        >
          <Phone />
          Call
        </a>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="mono-label flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-hairline text-cirrus"
        >
          <WhatsApp />
          WhatsApp
        </a>
        <Action href="/apply" variant="primary" className="flex-1">
          {site.cta.apply}
        </Action>
      </div>
    </nav>
  );
}
