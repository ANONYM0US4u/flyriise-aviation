import Link from "next/link";
import { Action } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { primaryNav } from "@/data/navigation";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-apron pt-28">
      <div aria-hidden className="absolute inset-0 grid-lines opacity-40" />
      <div className="container-wide relative">
        <p className="mono-label flex items-center gap-3 text-amber">
          <span aria-hidden className="h-px w-6 bg-amber" />
          Route not found · 404
        </p>
        <h1 className="display mt-6 max-w-[16ch] text-display-1 text-cirrus">
          This runway does not lead anywhere.
        </h1>
        <p className="measure mt-6 text-[1.0625rem] leading-[1.68] text-steel">
          The page you asked for has moved or never existed. Head back to the programmes, or talk to the
          admissions desk if you were looking for something specific.
        </p>

        <nav aria-label="Suggested pages" className="mt-8">
          <ul className="flex flex-wrap gap-3">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="mono-label inline-flex min-h-[2.75rem] items-center rounded-[var(--radius-sm)] border border-hairline px-4 text-steel transition-colors hover:border-hairline-strong hover:text-cirrus"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 flex flex-wrap gap-3">
          <Action href="/" variant="primary" size="lg" icon={<ArrowRight />}>
            Back to home
          </Action>
          <Action href="/contact#enquire" variant="secondary" size="lg">
            Contact admissions
          </Action>
        </div>
      </div>
    </section>
  );
}