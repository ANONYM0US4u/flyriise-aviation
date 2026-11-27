/**
 * SHARED SCROLL STATE — deliberately free of any three.js import.
 *
 * The hero stage (which runs on every device, including tier C where no WebGL
 * context is ever created) needs the same scroll progress value the scene
 * reads. Keeping it here means the fallback path never has to load the 3D
 * engine: `scene-config` re-exports these for the scene files.
 */

export const scrollProgress = { current: 0 };

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}