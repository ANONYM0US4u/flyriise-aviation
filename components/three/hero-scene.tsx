"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Aircraft } from "@/components/three/aircraft";
import { Apron } from "@/components/three/apron";
import { Atmosphere } from "@/components/three/atmosphere";
import { sampleCamera, scrollProgress } from "@/components/three/scene-config";

/**
 * Camera flight plan driver. Progress is damped so the motion is cinematic
 * rather than twitchy, and (on Tier A) a small pointer offset adds parallax
 * without ever moving the composition enough to hurt readability.
 */
function CameraRig({ allowPointer }: { allowPointer: boolean }) {
  const { camera } = useThree();
  const smoothed = useRef(0);
  const targetSmoothed = useRef({ x: 0, y: 0 });
  const position = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!allowPointer) return;
    const handle = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handle, { passive: true });
    return () => window.removeEventListener("pointermove", handle);
  }, [allowPointer]);

  useFrame((state, delta) => {
    const step = Math.min(delta, 1 / 30);
    smoothed.current += (scrollProgress.current - smoothed.current) * Math.min(1, step * 3.4);
    const p = smoothed.current;

    sampleCamera(p, position, target);

    // Slow handheld drift keeps the frame alive without calling attention.
    const time = state.clock.elapsedTime;
    position.x += Math.sin(time * 0.16) * 0.28;
    position.y += Math.cos(time * 0.21) * 0.16;

    if (allowPointer) {
      targetSmoothed.current.x += (pointer.current.x - targetSmoothed.current.x) * Math.min(1, step * 2.2);
      targetSmoothed.current.y += (pointer.current.y - targetSmoothed.current.y) * Math.min(1, step * 2.2);
      position.x += targetSmoothed.current.x * 0.9;
      position.y -= targetSmoothed.current.y * 0.45;
    }

    camera.position.copy(position);
    camera.lookAt(target);
  });

  return null;
}

/**
 * Environment probe: a tiny dusk scene is pre-filtered once into an
 * environment map so metal reads correctly (aircraft skin, nacelles, wet
 * apron) without downloading an HDR file.
 */
function EnvironmentProbe() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const probe = new THREE.Scene();

    const domeMaterial = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTop: { value: new THREE.Color("#0b1526") },
        uMid: { value: new THREE.Color("#2a4b7d") },
        uHorizon: { value: new THREE.Color("#d08a3a") },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDirection;
        void main() {
          vDirection = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop;
        uniform vec3 uMid;
        uniform vec3 uHorizon;
        varying vec3 vDirection;
        void main() {
          float h = clamp(normalize(vDirection).y * 0.5 + 0.5, 0.0, 1.0);
          vec3 colour = mix(uHorizon, uMid, smoothstep(0.44, 0.6, h));
          colour = mix(colour, uTop, smoothstep(0.6, 0.95, h));
          gl_FragColor = vec4(colour, 1.0);
          #include <colorspace_fragment>
        }
      `,
    });

    const domeGeometry = new THREE.SphereGeometry(30, 24, 16);
    probe.add(new THREE.Mesh(domeGeometry, domeMaterial));

    // Warm runway strip and a cool overhead sheet give metals something to catch.
    const warmGeometry = new THREE.PlaneGeometry(80, 5);
    const warmMaterial = new THREE.MeshBasicMaterial({ color: "#ffb224" });
    const warm = new THREE.Mesh(warmGeometry, warmMaterial);
    warm.position.set(0, 1, -22);
    warm.scale.set(1.4, 2.2, 1);
    probe.add(warm);

    const coolGeometry = new THREE.PlaneGeometry(60, 30);
    const coolMaterial = new THREE.MeshBasicMaterial({ color: "#3d638f" });
    const cool = new THREE.Mesh(coolGeometry, coolMaterial);
    cool.position.set(-18, 12, 6);
    cool.rotation.set(Math.PI / 2.2, 0.4, 0);
    probe.add(cool);

    const target = pmrem.fromScene(probe, 0.05);
    scene.environment = target.texture;

    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      domeGeometry.dispose();
      domeMaterial.dispose();
      warmGeometry.dispose();
      warmMaterial.dispose();
      coolGeometry.dispose();
      coolMaterial.dispose();
    };
  }, [gl, scene]);

  return null;
}

/** Forces one frame after mount so the poster can hand over to the canvas. */
function FirstFrameSignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) onReady();
  });
  return null;
}

export function HeroScene({
  tier,
  onFirstFrame,
}: {
  tier: "A" | "B";
  onFirstFrame: () => void;
}) {
  return (
    <>
      <Atmosphere tier={tier} />
      <Apron tier={tier} />
      <Aircraft />
      <CameraRig allowPointer={tier === "A"} />
      <EnvironmentProbe />
      <FirstFrameSignal onReady={onFirstFrame} />
    </>
  );
}
