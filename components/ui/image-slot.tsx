import Image from "next/image";
import type { PhotoSlot } from "@/data/campus";
import { cn } from "@/lib/utils";

/**
 * PHOTOGRAPHY SLOT
 * A slot with a client-supplied photograph renders it (next/image, AVIF → WebP,
 * aspect ratio reserved by the frame so CLS stays at 0). A slot without one is
 * drawn in the site's own instrument language and states exactly what is needed
 * — not a grey box, never a stock stand-in (see docs/ASSETS.md).
 */
export function ImageSlot({
  slot,
  className,
  compact = false,
  sizes,
}: {
  slot: PhotoSlot;
  className?: string;
  compact?: boolean;
  sizes?: string;
}) {
  const hasImage = Boolean(slot.src && slot.width && slot.height);

  /**
   * Aspect ratios are a fixed literal set (not built from slot.width/height at
   * runtime) so Tailwind's scanner can see every class — a dynamic
   * `aspect-[${w}/${h}]` would emit no CSS. Each ratio is derived from the
   * photo's real dimensions in data/campus.ts, so a supplied photo is never
   * cropped into a box it was never meant for, and the reserved ratio (from the
   * same width/height handed to next/image) keeps CLS at 0.
   */
  const ASPECT_BY_RATIO: Record<string, string> = {
    "3:2": "aspect-[3/2]",
    "2:3": "aspect-[2/3]",
    "1:1": "aspect-square",
  };
  const ratio = slot.width && slot.height ? `${slot.width / slot.height}` : null;
  const closest =
    ratio === null
      ? null
      : Object.entries({ "3:2": 1.5, "2:3": 2 / 3, "1:1": 1 }).reduce(
          (best, [key, value]) =>
            Math.abs(value - Number(ratio)) < Math.abs(best.value - Number(ratio))
              ? { key, value }
              : best,
          { key: "3:2", value: 1.5 },
        );

  const aspect = hasImage
    ? ASPECT_BY_RATIO[closest!.key]
    : slot.orientation === "portrait"
      ? "aspect-[3/4]"
      : slot.orientation === "square"
        ? "aspect-square"
        : "aspect-[3/2]";

  if (slot.src && slot.width && slot.height) {
    return (
      <figure
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-md)] border border-hairline bg-twilight",
          aspect,
          className,
        )}
      >
        <Image
          src={slot.src}
          alt={slot.alt ?? slot.title}
          fill
          sizes={sizes ?? "(min-width: 1024px) 44vw, (min-width: 640px) 46vw, 92vw"}
          className="object-cover"
        />
        {/* Legibility scrim — the caption sits on the photograph, not over it. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[rgb(7_11_20/0.88)] via-[rgb(7_11_20/0.15)] to-transparent"
        />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
          <span className="text-[0.9rem] font-medium leading-snug text-cirrus">{slot.title}</span>
          {!compact ? (
            <span className="mono-label hidden shrink-0 text-steel-deep sm:block">
              Institute photograph
            </span>
          ) : null}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-md)] border border-hairline bg-twilight",
        aspect,
        className,
      )}
    >
      {/* Instrument grid — reads as intentional, not as a broken image. */}
      <div aria-hidden className="absolute inset-0 grid-lines opacity-70" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 20% 0%, rgb(255 178 36 / 0.10), transparent 60%), linear-gradient(180deg, rgb(18 32 58 / 0.2), rgb(7 11 20 / 0.85))",
        }}
      />
      <div aria-hidden className="absolute inset-0 grain" />

      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="mono-label text-amber">Image slot · pending</span>
          <span className="mono-label text-steel-deep">{slot.id}</span>
        </div>
        <figcaption className="space-y-2">
          <p className="display text-[0.95rem] font-medium text-cirrus">{slot.title}</p>
          {!compact ? (
            <p className="text-[0.8125rem] leading-[1.55] text-steel">{slot.caption}</p>
          ) : null}
          <p className="mono-label text-steel-deep normal-case tracking-[0.03em]">{slot.spec}</p>
        </figcaption>
      </div>
    </figure>
  );
}
