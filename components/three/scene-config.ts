import * as THREE from "three";
import { clamp01, scrollProgress, smoothstep } from "@/components/three/scroll-progress";

export { clamp01, scrollProgress, smoothstep };

/**
 * ASCENT — SCENE CONFIG
 * ---------------------------------------------------------------------------
 * All cinematic values live here: the dusk→daylight grade, the camera flight
 * plan and the aircraft departure track. Keeping them in one file means the
 * look can be tuned without touching scene graph code.
 */

/* ------------------------------------------------------------------ scroll */
/* scrollProgress, clamp01 and smoothstep live in ./scroll-progress so the hero
   stage can read scroll state without importing three.js. */

/* --------------------------------------------------------------------- sky */

export type SkyKey = {
  p: number;
  top: string;
  mid: string;
  horizon: string;
  fogDensity: number;
  starOpacity: number;
  sunOpacity: number;
  cloudOpacity: number;
  ambient: number;
};

export const SKY_KEYS: SkyKey[] = [
  {
    p: 0,
    top: "#070d1c",
    mid: "#142544",
    horizon: "#5a3a26",
    fogDensity: 0.014,
    starOpacity: 0.85,
    sunOpacity: 0.1,
    cloudOpacity: 0.12,
    ambient: 0.5,
  },
  {
    p: 0.28,
    top: "#08122a",
    mid: "#1a3159",
    horizon: "#8a5527",
    fogDensity: 0.0115,
    starOpacity: 0.75,
    sunOpacity: 0.18,
    cloudOpacity: 0.24,
    ambient: 0.58,
  },
  {
    p: 0.52,
    top: "#091a33",
    mid: "#1e3a60",
    horizon: "#8d5c2b",
    fogDensity: 0.0105,
    starOpacity: 0.4,
    sunOpacity: 0.32,
    cloudOpacity: 0.46,
    ambient: 0.44,
  },
  {
    p: 0.76,
    top: "#153463",
    mid: "#41739f",
    horizon: "#cb8e4c",
    fogDensity: 0.0072,
    starOpacity: 0.1,
    sunOpacity: 0.58,
    cloudOpacity: 0.68,
    ambient: 0.6,
  },
  {
    p: 1,
    top: "#27608f",
    mid: "#7fa8ce",
    horizon: "#d9b78e",
    fogDensity: 0.0035,
    starOpacity: 0,
    sunOpacity: 0.8,
    cloudOpacity: 0.78,
    ambient: 0.82,
  },
];

export type SkySample = {
  top: THREE.Color;
  mid: THREE.Color;
  horizon: THREE.Color;
  fogDensity: number;
  starOpacity: number;
  sunOpacity: number;
  cloudOpacity: number;
  ambient: number;
};

export function createSkySample(): SkySample {
  return {
    top: new THREE.Color(SKY_KEYS[0]!.top),
    mid: new THREE.Color(SKY_KEYS[0]!.mid),
    horizon: new THREE.Color(SKY_KEYS[0]!.horizon),
    fogDensity: SKY_KEYS[0]!.fogDensity,
    starOpacity: SKY_KEYS[0]!.starOpacity,
    sunOpacity: SKY_KEYS[0]!.sunOpacity,
    cloudOpacity: SKY_KEYS[0]!.cloudOpacity,
    ambient: SKY_KEYS[0]!.ambient,
  };
}

const scratch = { a: new THREE.Color(), b: new THREE.Color() };

/** Writes the interpolated grade for progress `p` into `out` (no allocation). */
export function sampleSky(p: number, out: SkySample): SkySample {
  const clamped = clamp01(p);
  let index = 0;
  while (index < SKY_KEYS.length - 2 && clamped > SKY_KEYS[index + 1]!.p) index += 1;
  const from = SKY_KEYS[index]!;
  const to = SKY_KEYS[index + 1] ?? from;
  const span = to.p - from.p || 1;
  const t = smoothstep((clamped - from.p) / span);

  out.top.copy(scratch.a.set(from.top)).lerp(scratch.b.set(to.top), t);
  out.mid.copy(scratch.a.set(from.mid)).lerp(scratch.b.set(to.mid), t);
  out.horizon.copy(scratch.a.set(from.horizon)).lerp(scratch.b.set(to.horizon), t);

  out.fogDensity = THREE.MathUtils.lerp(from.fogDensity, to.fogDensity, t);
  out.starOpacity = THREE.MathUtils.lerp(from.starOpacity, to.starOpacity, t);
  out.sunOpacity = THREE.MathUtils.lerp(from.sunOpacity, to.sunOpacity, t);
  out.cloudOpacity = THREE.MathUtils.lerp(from.cloudOpacity, to.cloudOpacity, t);
  out.ambient = THREE.MathUtils.lerp(from.ambient, to.ambient, t);
  return out;
}

/** Scene is graded against this sun direction (low, ahead of the aircraft). */
export const SUN_DIRECTION = new THREE.Vector3(0.42, 0.16, -0.9).normalize();

/* ------------------------------------------------------------------ camera */

type Vec3 = [number, number, number];
type CameraKey = { p: number; position: Vec3; target: Vec3 };

/** Camera flight plan: apron walk-around → pull-back → climb alongside. */
export const CAMERA_KEYS: CameraKey[] = [
  { p: 0, position: [22.0, 4.4, 27.0], target: [-4.0, 1.8, -1.0] },
  { p: 0.2, position: [15.0, 4.6, 21.0], target: [-1.0, 2.2, -1.0] },
  { p: 0.4, position: [3.0, 5.6, 19.0], target: [5.0, 3.4, -1.0] },
  { p: 0.6, position: [-10.0, 9.0, 23.0], target: [18.0, 10.0, -4] },
  { p: 0.8, position: [-14.0, 14.0, 26.0], target: [58.0, 38.0, -12] },
  { p: 1, position: [-10.0, 24.0, 34.0], target: [120.0, 84.0, -28] },
];

/** Writes the interpolated camera position and look-at target into `out`. */
export function sampleCamera(
  p: number,
  outPosition: THREE.Vector3,
  outTarget: THREE.Vector3,
): void {
  const clamped = clamp01(p);
  let index = 0;
  while (index < CAMERA_KEYS.length - 2 && clamped > CAMERA_KEYS[index + 1]!.p) index += 1;
  const from = CAMERA_KEYS[index]!;
  const to = CAMERA_KEYS[index + 1] ?? from;
  const span = to.p - from.p || 1;
  const t = smoothstep((clamped - from.p) / span);

  outPosition.set(
    THREE.MathUtils.lerp(from.position[0], to.position[0], t),
    THREE.MathUtils.lerp(from.position[1], to.position[1], t),
    THREE.MathUtils.lerp(from.position[2], to.position[2], t),
  );
  outTarget.set(
    THREE.MathUtils.lerp(from.target[0], to.target[0], t),
    THREE.MathUtils.lerp(from.target[1], to.target[1], t),
    THREE.MathUtils.lerp(from.target[2], to.target[2], t),
  );
}

/* --------------------------------------------------------------- aircraft */

export type AircraftState = {
  x: number;
  y: number;
  pitch: number;
  roll: number;
  gear: number;
  throttle: number;
};

type AircraftKey = AircraftState & { p: number };

/** Departure track: parked → taxi → rotate → climb. */
export const AIRCRAFT_KEYS: AircraftKey[] = [
  { p: 0, x: 0, y: 0, pitch: 0, roll: 0, gear: 1, throttle: 0.15 },
  { p: 0.18, x: 9, y: 0, pitch: 0, roll: 0, gear: 1, throttle: 0.25 },
  { p: 0.32, x: 22, y: 0, pitch: -0.012, roll: 0, gear: 1, throttle: 0.55 },
  { p: 0.44, x: 36, y: 2.4, pitch: 0.1, roll: 0, gear: 1, throttle: 0.9 },
  { p: 0.58, x: 58, y: 14, pitch: 0.24, roll: 0.02, gear: 0, throttle: 1 },
  { p: 0.78, x: 96, y: 46, pitch: 0.15, roll: 0.03, gear: 0, throttle: 0.92 },
  { p: 1, x: 170, y: 104, pitch: 0.07, roll: 0, gear: 0, throttle: 0.86 },
];

/** Samples the departure track into `out` (no allocation per frame). */
export function sampleAircraft(p: number, out: AircraftState): AircraftState {
  const clamped = clamp01(p);
  let index = 0;
  while (index < AIRCRAFT_KEYS.length - 2 && clamped > AIRCRAFT_KEYS[index + 1]!.p) index += 1;
  const from = AIRCRAFT_KEYS[index]!;
  const to = AIRCRAFT_KEYS[index + 1] ?? from;
  const span = to.p - from.p || 1;
  const t = smoothstep((clamped - from.p) / span);

  out.x = THREE.MathUtils.lerp(from.x, to.x, t);
  out.y = THREE.MathUtils.lerp(from.y, to.y, t);
  out.pitch = THREE.MathUtils.lerp(from.pitch, to.pitch, t);
  out.roll = THREE.MathUtils.lerp(from.roll, to.roll, t);
  out.gear = THREE.MathUtils.lerp(from.gear, to.gear, t);
  out.throttle = THREE.MathUtils.lerp(from.throttle, to.throttle, t);
  return out;
}

export function createAircraftState(): AircraftState {
  return { x: 0, y: 0, pitch: 0, roll: 0, gear: 1, throttle: 0.15 };
}

/* ---------------------------------------------------- procedural textures */

/** Soft radial sprite — used for runway light glow, stars and engine heat. */
export function radialTexture(
  color = "255,255,255",
  falloff = 1,
  size = 128,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d")!;
  // Gradient offsets must stay within 0…1 — a `falloff` above ~1.4 would
  // otherwise throw an IndexSizeError and take the whole scene down.
  const stop = (value: number) => Math.min(1, Math.max(0, value));
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, `rgba(${color},1)`);
  gradient.addColorStop(stop(0.35 * falloff), `rgba(${color},0.45)`);
  gradient.addColorStop(stop(0.7 * falloff), `rgba(${color},0.12)`);
  gradient.addColorStop(1, `rgba(${color},0)`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Soft cloud puff sheet, built from layered radial gradients (no downloads). */
export function cloudTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, size, size);

  const puffs = 26;
  for (let index = 0; index < puffs; index += 1) {
    const x = size * (0.15 + Math.random() * 0.7);
    const y = size * (0.3 + Math.random() * 0.4);
    const radius = size * (0.08 + Math.random() * 0.22);
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    const alpha = 0.06 + Math.random() * 0.1;
    gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
    gradient.addColorStop(0.6, `rgba(255,255,255,${alpha * 0.4})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  // Feather the edges so planes never show a hard border.
  const edge = context.createRadialGradient(size / 2, size / 2, size * 0.2, size / 2, size / 2, size * 0.5);
  edge.addColorStop(0, "rgba(0,0,0,0)");
  edge.addColorStop(1, "rgba(0,0,0,1)");
  context.globalCompositeOperation = "destination-out";
  context.fillStyle = edge;
  context.fillRect(0, 0, size, size);
  context.globalCompositeOperation = "source-over";

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* ------------------------------------------------------------- tier config */

export type TierQuality = {
  dpr: [number, number];
  antialias: boolean;
  stars: number;
  clouds: number;
  runwayLights: number;
  shadowSegments: number;
};

export const TIER_QUALITY: Record<"A" | "B", TierQuality> = {
  A: {
    dpr: [1, 2],
    antialias: true,
    stars: 520,
    clouds: 5,
    runwayLights: 46,
    shadowSegments: 48,
  },
  B: {
    dpr: [1, 1.25],
    antialias: false,
    stars: 190,
    clouds: 3,
    runwayLights: 30,
    shadowSegments: 24,
  },
};
