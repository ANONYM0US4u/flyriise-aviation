import { Reveal } from "@/components/motion/reveal";
import { careerDestinations, careerDestinationsNote } from "@/data/placement";
import { isDemoMode } from "@/lib/content-mode";

/**
 * SECTION 6 — Career destinations (brief §10 section 6, §18).
 *
 * Relationship categories are never merged. These employers are student career
 * destinations: no logo, no partnership implication, no airline livery, and
 * nothing in metadata or alt text that suggests an affiliation.
 */
export function PartnersManifest() {
  const demo = isDemoMode();
  const publishable = careerDestinations.filter(
    (partner) => partner.verificationStatus === "VERIFIED" && partner.logoUsageApproved,
  );
  const showDestinations = demo || publishable.length > 0;
  const names =
    publishable.length > 0
      ? publishable.map((partner) => partner.name)
      : careerDestinations.map((partner) => partner.name);

  return (
    <section id="destinations" aria-labelledby="destinations-heading" className="bg-cirrus py-20 text-ink lg:py-28">
      <div className="container-wide">
        <div className="flex items-baseline justify-between gap-4 border-b border-hairline-light pb-3">
          <span className="mono-label text-graphite">
            <span className="text-ink">SEC 06</span>
            <span className="mx-2 opacity-40">/</span>
            Career destinations
          </span>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="mono-label flex items-center gap-3 text-graphite">
              <span aria-hidden className="h-px w-6 bg-graphite" />
              Destinations, not partnerships
            </p>
            <h2 id="destinations-heading" className="display mt-5 text-display-2 text-ink">
              Where graduates have gone.
            </h2>
            <p className="measure mt-6 text-[1.0625rem] leading-[1.68] text-graphite">
              {careerDestinationsNote}
            </p>
          </div>

          <div className="lg:col-span-7">
            {showDestinations ? (
              <Reveal>
                <ol className="grid grid-cols-1 border-l border-t border-hairline-light sm:grid-cols-2 lg:grid-cols-3">
                  {names.map((name, index) => (
                    <li key={name} className="border-b border-r border-hairline-light px-4 py-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="mono-label text-graphite">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="mono-label text-graphite">Destination</span>
                      </div>
                      <p className="display mt-3 text-[0.9375rem] text-ink">{name}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            ) : (
              <div className="rounded-[var(--radius-md)] border border-hairline-light bg-cloud p-6">
                <p className="text-[0.9375rem] leading-[1.7] text-ink">
                  Written authorization is required before any employer name or mark is presented as a
                  hiring partner.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
