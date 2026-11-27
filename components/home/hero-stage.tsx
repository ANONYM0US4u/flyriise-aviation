"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStillness } from "@/components/motion/motion-provider";
import { useTier } from "@/components/motion/use-tier";
import { HeroPoster } from "@/components/three/hero-poster";
import { scrollProgress } from "@/components/three/scroll-progress";
import { Action } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { ArrowRight, WhatsApp } from "@/components/ui/icons";
import { whatsappHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

/** three.js + R3F are code-split: the hero text paints without them. */
const HeroCanvas = dynamic(
  () => import("@/components/three/hero-canvas").then((module) => module.HeroCanvas),
  { ssr: false },
);

export type HeroStageProps = {
  eyebrow: string;
  headline: string[];
  supporting: string;
  primaryCta: string;
  secondaryCta: string;
  scrollHint: string;
  hudLeft: string;
  hudRight: string;
  trustStrip: string[];
};

/**
 * THE ASCENT — signature moment 1 (brief §04A, §06).
 *
 * Structure: a 190svh scroll runway with a sticky viewport. The poster is the
 * first paint, the WebGL scene fades in over it once it has actually rendered,
 * and a single scroll progress value drives the camera, the aircraft departure
 * and the headline fade. Reduced motion, low-power devices, Save-Data, missing
 * WebGL or a lost context all resolve to the poster with identical content.
 */
export function HeroStage({
  eyebrow,
  headline,
  supporting,
  primaryCta,
  secondaryCta,
  scrollHint,
  hudLeft,
  hudRight,
  trustStrip,
}: HeroStageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { tier, ready } = useTier();
  const still = useStillness();

  const [deferred, setDeferred] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);

  const tierSupports3d = tier === "A" || tier === "B";
  const enable3d = ready && tierSupports3d && !failed && !still;
  const canvasTier: "A" | "B" = tier === "A" ? "A" : "B";

  /*
   * Mount the scene only after first paint so LCP is never blocked. The mount
   * decision is derived, not synchronised: `deferred` becomes true once, and the
   * canvas only exists while the current tier still allows it — so dropping to
   * tier C mid-session unmounts the canvas with no state reset effect.
   */
  useEffect(() => {
    if (!enable3d) return;
    const timer = window.setTimeout(() => setDeferred(true), 240);
    return () => window.clearTimeout(timer);
  }, [enable3d]);

  const canvasMounted = enable3d && deferred;

  /* Scroll narrative: one rAF-throttled value, no per-frame React work. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      scrollProgress.current = progress;
      section.style.setProperty("--ascent", progress.toFixed(4));
    };

    const request = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /* Pause rendering when the hero is not on screen or the tab is hidden. */
  useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setVisible(entry.isIntersecting);
      },
      { threshold: 0.01 },
    );
    observer.observe(sticky);

    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const handleReady = useCallback(() => setSceneReady(true), []);
  const handleContextLost = useCallback(() => {
    // A lost context unmounts the canvas through `failed` → `enable3d`; the
    // poster underneath is already in place and never moves.
    scrollProgress.current = 0;
    setFailed(true);
    setSceneReady(false);
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className={cn(
        "relative bg-apron",
        enable3d ? "h-[190svh]" : "h-[100svh] min-h-[38rem]",
      )}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-[100svh] min-h-[38rem] overflow-hidden"
      >
        {/* Tier C / first paint poster — the scene in vector form */}
        <HeroPoster />

        {/* WebGL layer, faded in only after it has rendered frames */}
        {canvasMounted ? (
          <div
            className="absolute inset-0 transition-opacity duration-[1100ms] ease-out"
            style={{ opacity: sceneReady ? 1 : 0 }}
          >
            <HeroCanvas
              tier={canvasTier}
              active={visible}
              onReady={handleReady}
              onContextLost={handleContextLost}
            />
          </div>
        ) : null}

        {/* Legibility scrims: text sits over moving imagery at every scroll position */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-apron via-apron/35 to-apron/5"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-apron/75 via-apron/12 to-transparent"
        />

        <div className="relative flex h-full flex-col">
          <div
            className="container-wide flex flex-1 flex-col justify-end pb-24 pt-28 lg:pb-14 lg:pt-32
                        [@media(max-height:820px)]:pb-20 [@media(max-height:820px)]:pt-20"
            style={{
              // The whole content block leaves as the aircraft climbs, so copy is
              // never left sitting on the bright end of the sky gradient.
              opacity: "max(0, calc(1.18 - var(--ascent, 0) * 1.75))",
              transform: "translate3d(0, calc(var(--ascent, 0) * -26px), 0)",
              willChange: "opacity, transform",
            }}
          >
            {/*
              One left column, deliberately. The aircraft climbs through the
              centre-right of the frame, so the supporting paragraph and the CTAs
              used to sit exactly on top of it. Stacking everything left keeps
              the scene's right half — and the whole departure — unobstructed,
              and reads more composed than a headline beside a second column.
            */}
            <div className="max-w-[44rem]">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h1 id="hero-heading" className="display mt-6 text-display-1 text-cirrus">
                <span className="block">{headline[0]}</span>
                <span className="block text-steel">{headline[1]}</span>
              </h1>

              <p className="measure mt-7 max-w-[44ch] text-[1rem] leading-[1.62] text-steel sm:text-[1.0625rem] sm:leading-[1.68] [@media(max-height:820px)]:mt-5 [@media(max-height:820px)]:text-[0.9375rem] [@media(max-height:820px)]:leading-[1.55]">
                {supporting}
              </p>

              <div className="mt-8 flex flex-wrap gap-3 [@media(max-height:820px)]:mt-6 max-[420px]:gap-2">
                {/*
                  Tighter buttons on small phones so the two primary actions stay on
                  one row — a wrapped second row pushed the trust strip off a
                  720px-tall screen, where the sticky hero clips it.
                */}
                <Action
                  href="/apply"
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight />}
                  className="max-[420px]:px-3.5"
                >
                  {primaryCta}
                </Action>
                <Action
                  href="/contact#enquire"
                  variant="secondary"
                  size="lg"
                  className="max-[420px]:px-3.5"
                >
                  {secondaryCta}
                </Action>
                <Action
                  href={whatsappHref()}
                  external
                  variant="secondary"
                  size="lg"
                  icon={<WhatsApp />}
                  className="hidden sm:inline-flex max-[420px]:px-3.5"
                >
                  WhatsApp admissions
                </Action>
              </div>
            </div>

            <div className="mt-10 border-t border-hairline pt-5 [@media(max-height:820px)]:mt-7 [@media(max-height:820px)]:pt-4">
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {trustStrip.map((item, index) => (
                  <li
                    key={item}
                    className={cn(
                      "mono-label flex items-center gap-2.5 text-steel",
                      // Below `sm` the strip shows two items on a tall phone and one
                      // on a short one — an extra row would push the strip past
                      // the bottom of the sticky hero, which clips its overflow.
                      index > 1 && "hidden sm:flex",
                      index === 1 && "[@media(max-width:639px)_and_(max-height:820px)]:hidden",
                    )}
                  >
                    <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-amber" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instrument rail: altitude scale tied to the scroll narrative */}
          {enable3d ? (
            <div
              aria-hidden
              className="pointer-events-none absolute right-[var(--gutter)] top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
            >
              <span className="mono-label text-steel-deep">{hudRight}</span>
              <span className="relative block h-40 w-px bg-hairline">
                <span
                  className="absolute -left-[3px] h-[7px] w-[7px] rounded-full bg-amber"
                  style={{ top: "calc(var(--ascent, 0) * 100%)" }}
                />
              </span>
              <span className="mono-label text-steel-deep">{hudLeft}</span>
            </div>
          ) : null}

          <div className="container-wide flex items-end justify-between pb-6">
            <Link
              href="#more-than-training"
              className="mono-label group inline-flex items-center gap-3 text-steel transition-colors hover:text-cirrus"
              style={{ opacity: "max(0, calc(1.2 - var(--ascent, 0) * 3))" }}
            >
              <span
                aria-hidden
                className="block h-8 w-px bg-gradient-to-b from-transparent via-amber to-transparent motion-safe:animate-pulse"
              />
              {scrollHint}
            </Link>
            <p className="mono-label hidden text-steel-deep lg:block">
              {hudRight} · {hudLeft}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
