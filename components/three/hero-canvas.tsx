"use client";

import { Canvas, type RootState } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { HeroScene } from "@/components/three/hero-scene";
import { TIER_QUALITY } from "@/components/three/scene-config";

/**
 * WebGL wrapper.
 * - Quality is chosen from the capability tier, never guessed per frame.
 * - Rendering pauses while the hero is off-screen or the tab is hidden.
 * - A lost context reports upward so the caller can fall back to the poster.
 */
export function HeroCanvas({
  tier,
  active,
  onReady,
  onContextLost,
}: {
  tier: "A" | "B";
  active: boolean;
  onReady: () => void;
  onContextLost: () => void;
}) {
  const quality = TIER_QUALITY[tier];
  const cleanup = useRef<(() => void) | null>(null);

  const handleCreated = useCallback(
    (state: RootState) => {
      const renderer = state.gl;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;

      const canvas = renderer.domElement;
      const handleLoss = (event: Event) => {
        // Prevent the default so the browser does not discard the element, then
        // hand control back to the poster fallback.
        event.preventDefault();
        onContextLost();
      };
      canvas.addEventListener("webglcontextlost", handleLoss, false);
      cleanup.current = () => canvas.removeEventListener("webglcontextlost", handleLoss, false);
    },
    [onContextLost],
  );

  useEffect(() => () => cleanup.current?.(), []);

  return (
    <Canvas
      dpr={quality.dpr}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 38, near: 0.5, far: 3000, position: [17.5, 2.3, 18.5] }}
      gl={{
        antialias: quality.antialias,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        depth: true,
      }}
      onCreated={handleCreated}
      style={{ position: "absolute", inset: 0 }}
    >
      <HeroScene tier={tier} onFirstFrame={onReady} />
    </Canvas>
  );
}
