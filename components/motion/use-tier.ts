"use client";

import { useEffect, useState } from "react";
import { useStillness } from "@/components/motion/motion-provider";

/**
 * CAPABILITY TIERS (brief §07A)
 * ---------------------------------------------------------------------------
 * A — full experience: desktop-class GPU, detailed scene, DPR ≤ 2
 * B — balanced: phones and mid-range laptops, LOD scene, DPR ≤ 1.25, no
 *     post-processing
 * C — content-first: no WebGL, reduced motion, Save-Data, or forced by QA.
 *
 * QA can force a tier with ?tier=A|B|C (recorded in docs/QA_REPORT.md).
 */

export type Tier = "A" | "B" | "C";

export function readTierOverride(): Tier | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("tier");
  if (value === "A" || value === "B" || value === "C") return value;
  return null;
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    return Boolean(context);
  } catch {
    return false;
  }
}

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function detectTier({ reduceMotion }: { reduceMotion: boolean }): Tier {
  if (typeof window === "undefined") return "C";

  const override = readTierOverride();
  if (override) return override;

  if (reduceMotion) return "C";
  if (!webglAvailable()) return "C";

  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return "C";

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const dpr = window.devicePixelRatio || 1;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const shortEdge = Math.min(window.innerWidth, window.innerHeight);
  const lowMemory = memory <= 2;
  const verySmall = shortEdge <= 380;

  if (lowMemory && verySmall) return "C";
  if (cores <= 3 && lowMemory) return "C";

  const isPhone = coarsePointer || shortEdge < 640;
  if (isPhone) return "B";

  // Desktop: treat weak integrated devices as balanced rather than full.
  if (cores <= 4 || memory <= 4) return "B";
  if (dpr > 3) return "B";

  return "A";
}

/**
 * Resolves the tier after mount. `ready` stays false during SSR and the first
 * client render so the fallback poster is what users and crawlers see first.
 */
export function useTier(): { tier: Tier; ready: boolean; override: Tier | null } {
  const still = useStillness();
  const [tier, setTier] = useState<Tier>("C");
  const [ready, setReady] = useState(false);
  const [override, setOverride] = useState<Tier | null>(null);

  useEffect(() => {
    setOverride(readTierOverride());
  }, []);

  useEffect(() => {
    setTier(detectTier({ reduceMotion: still }));
    setReady(true);
  }, [still]);

  return { tier, ready, override };
}
