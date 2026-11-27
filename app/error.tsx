"use client";

import { useEffect } from "react";
import { Action } from "@/components/ui/button";
import { ArrowRight, Phone } from "@/components/ui/icons";
import { site } from "@/data/site";
import { telHref } from "@/lib/contact";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Only the digest is recorded — never any submitted content.
    if (process.env.NODE_ENV !== "production") {
      console.error("Route error", error.digest ?? error.message);
    }
  }, [error]);

  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-apron pt-28">
      <div aria-hidden className="absolute inset-0 grid-lines opacity-40" />
      <div className="container-wide relative">
        <p className="mono-label flex items-center gap-3 text-amber">
          <span aria-hidden className="h-px w-6 bg-amber" />
          Something went wrong
        </p>
        <h1 className="display mt-6 max-w-[18ch] text-display-1 text-cirrus">
          This page hit turbulence.
        </h1>
        <p className="measure mt-6 text-[1.0625rem] leading-[1.68] text-steel">
          The error has been logged. Try again — or contact the admissions desk directly and we will
          help you straight away.
        </p>
        {error.digest ? (
          <p className="mono-label mt-4 text-steel-deep">Reference: {error.digest}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Action variant="primary" size="lg" onClick={reset} icon={<ArrowRight />}>
            Try again
          </Action>
          <Action href={telHref} variant="secondary" size="lg" icon={<Phone />}>
            {site.contact.phone.display}
          </Action>
          <Action href="/contact#enquire" variant="secondary" size="lg">
            Send an enquiry
          </Action>
        </div>
      </div>
    </section>
  );
}