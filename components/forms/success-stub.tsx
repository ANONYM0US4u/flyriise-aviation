import { Check } from "@/components/ui/icons";
import { site } from "@/data/site";
import { whatsappHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

/**
 * SIGNATURE MOMENT 3 — "The Boarding Pass" (brief §04A).
 * The confirmation of an enquiry/application is presented as a boarding-pass
 * stub with a real reference ID, so the handoff to admissions feels like an
 * operational record rather than a browser alert.
 */
export function SuccessStub({
  reference,
  name,
  track,
  kind,
  whatsappLink,
  className,
}: {
  reference: string;
  name: string;
  track: string;
  kind: "enquiry" | "application";
  whatsappLink?: string;
  className?: string;
}) {
  const label = kind === "application" ? "Application received" : "Enquiry received";
  const fallback = whatsappHref(
    `Hello ${site.brand.name}, my reference number is ${reference}. I would like to discuss my ${kind}.`,
  );
  return (
    <div
      className={cn(
        "board relative overflow-hidden rounded-[var(--radius-md)] p-6 text-cirrus sm:p-8",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-amber/60" />
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="mono-label flex items-center gap-2 text-verified">
            <Check />
            {label}
          </p>
          <p className="display mt-4 text-[1.5rem] text-cirrus">
            We will call you on the number you provided.
          </p>
          <p className="measure mt-3 text-[0.9375rem] leading-[1.7] text-steel">
            Admissions will confirm eligibility, batch dates and fees. Keep your reference number for
            any follow-up — it is how your file is tracked.
          </p>
        </div>
        <div className="w-full max-w-[16rem] border-l border-dashed border-hairline pl-6">
          <p className="mono-label text-steel-deep">Reference</p>
          <p className="tnum mt-2 font-mono text-[1.375rem] tracking-[0.08em] text-amber">{reference}</p>
          <dl className="mt-5 space-y-2">
            <div>
              <dt className="mono-label text-steel-deep">Candidate</dt>
              <dd className="text-[0.9375rem] text-cirrus">{name}</dd>
            </div>
            <div>
              <dt className="mono-label text-steel-deep">Track</dt>
              <dd className="text-[0.9375rem] text-cirrus">{track}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a
          href={whatsappLink ?? fallback}
          target="_blank"
          rel="noopener noreferrer"
          className="mono-label inline-flex min-h-[2.75rem] items-center rounded-[var(--radius-sm)] border border-hairline px-4 text-cirrus transition-colors hover:border-hairline-strong"
        >
          Send on WhatsApp
        </a>
        <p className="mono-label text-steel-deep">Opens with your details filled in — press send.</p>
      </div>
      <p className="mono-label mt-3 text-steel-deep">
        No placement or admission is confirmed by this submission.
      </p>
    </div>
  );
}
