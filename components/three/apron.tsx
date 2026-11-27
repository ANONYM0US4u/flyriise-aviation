"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { clamp01, radialTexture, scrollProgress } from "@/components/three/scene-config";

/**
 * APRON & RUNWAY
 * ---------------------------------------------------------------------------
 * The aircraft's stage: dark apron, a taxiway guide light leading to the stand,
 * a runway lit along both edges, and a fogged terminal silhouette. Everything
 * is instanced or a single draw call so Tier B phones stay comfortable.
 */

function linearGlowTexture(color = "255, 190, 110"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 4;
  const context = canvas.getContext("2d")!;
  const gradient = context.createLinearGradient(0, 0, 0, 4);
  gradient.addColorStop(0, `rgba(${color},0)`);
  gradient.addColorStop(0.5, `rgba(${color},0.85)`);
  gradient.addColorStop(1, `rgba(${color},0)`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 4);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function Apron({ tier }: { tier: "A" | "B" }) {
  const group = useRef<THREE.Group>(null);
  const glowPlaneNorth = useRef<THREE.Mesh>(null);
  const glowPlaneSouth = useRef<THREE.Mesh>(null);
  const lightPool = useRef<THREE.Mesh>(null);

  const runwayLightsPerSide = tier === "A" ? 26 : 16;
  const dashCount = tier === "A" ? 40 : 26;

  const textureLightPool = useMemo(() => radialTexture("255, 186, 108", 1.6, 256), []);
  const textureEdgeGlow = useMemo(() => linearGlowTexture(), []);
  const textureApproach = useMemo(() => radialTexture("255, 233, 200", 1.2, 128), []);

  const scene = useMemo(() => {
    const materials: THREE.Material[] = [];
    const geometries: THREE.BufferGeometry[] = [];

    const track = <T extends THREE.Material | THREE.BufferGeometry>(item: T): T => {
      if (item instanceof THREE.Material) materials.push(item);
      else geometries.push(item);
      return item;
    };

    /* --- ground ------------------------------------------------------- */
    const groundGeometry = track(new THREE.PlaneGeometry(1600, 1600));
    const groundMaterial = track(
      new THREE.MeshStandardMaterial({
        color: "#080b12",
        roughness: 0.72,
        metalness: 0.14,
        envMapIntensity: 0.35,
      }),
    );

    /* --- apron surface ------------------------------------------------- */
    const apronGeometry = track(new THREE.PlaneGeometry(200, 120));
    const apronMaterial = track(
      new THREE.MeshStandardMaterial({
        color: "#0d1219",
        roughness: 0.5,
        metalness: 0.22,
        envMapIntensity: 0.65,
      }),
    );

    /* --- runway strip -------------------------------------------------- */
    const runwayGeometry = track(new THREE.PlaneGeometry(520, 30));
    const runwayMaterial = track(
      new THREE.MeshStandardMaterial({
        color: "#0a0e16",
        roughness: 0.38,
        metalness: 0.3,
        envMapIntensity: 0.8,
      }),
    );

    /* --- centreline dashes (instanced) --------------------------------- */
    const dashGeometry = track(new THREE.BoxGeometry(0.34, 0.04, 7));
    const dashMaterial = track(
      new THREE.MeshStandardMaterial({
        color: "#8f9bab",
        roughness: 0.75,
        metalness: 0.1,
      }),
    );
    const dashes = new THREE.InstancedMesh(dashGeometry, dashMaterial, dashCount);
    const matrix = new THREE.Matrix4();
    for (let index = 0; index < dashCount; index += 1) {
      matrix.makeTranslation(-240 + index * 12.5, 0.03, -34);
      dashes.setMatrixAt(index, matrix);
    }
    dashes.instanceMatrix.needsUpdate = true;
    dashes.frustumCulled = false;

    /* --- runway edge lights (instanced emissive markers) --------------- */
    const markerGeometry = track(new THREE.CapsuleGeometry(0.09, 0.5, 4, 8));
    const markerMaterial = track(
      new THREE.MeshStandardMaterial({
        color: "#ffe3b0",
        emissive: new THREE.Color("#ffb224"),
        emissiveIntensity: 2.4,
        roughness: 0.4,
      }),
    );
    const markerCount = runwayLightsPerSide * 2;
    const markers = new THREE.InstancedMesh(markerGeometry, markerMaterial, markerCount);
    for (let index = 0; index < runwayLightsPerSide; index += 1) {
      const x = -240 + index * (480 / (runwayLightsPerSide - 1));
      matrix.makeTranslation(x, 0.22, -49.6);
      markers.setMatrixAt(index * 2, matrix);
      matrix.makeTranslation(x, 0.16, -18.4);
      markers.setMatrixAt(index * 2 + 1, matrix);
    }
    markers.instanceMatrix.needsUpdate = true;
    markers.frustumCulled = false;

    /* --- taxiway guide: an amber curve leading to the stand ------------ */
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-150, 0.05, 52),
      new THREE.Vector3(-90, 0.05, 38),
      new THREE.Vector3(-40, 0.05, 18),
      new THREE.Vector3(-6, 0.05, 6.4),
      new THREE.Vector3(26, 0.05, 6.4),
    ]);
    const guideGeometry = track(new THREE.TubeGeometry(curve, 96, 0.055, 6, false));
    const guideMaterial = track(
      new THREE.MeshStandardMaterial({
        color: "#ffb224",
        emissive: new THREE.Color("#ffb224"),
        emissiveIntensity: 0.5,
        roughness: 0.5,
      }),
    );

    /* --- stand markings ------------------------------------------------- */
    const standGeometry = track(new THREE.BoxGeometry(0.22, 0.03, 26));
    const standMaterial = track(
      new THREE.MeshStandardMaterial({
        color: "#9c8f6d",
        roughness: 0.8,
        metalness: 0.1,
      }),
    );

    /* --- terminal silhouette -------------------------------------------- */
    const blockGeometry = track(new THREE.BoxGeometry(1, 1, 1));
    const blockMaterial = track(
      new THREE.MeshStandardMaterial({
        color: "#0a1018",
        roughness: 0.85,
        metalness: 0.1,
      }),
    );
    const windowGeometry = track(new THREE.PlaneGeometry(1, 1));
    const windowMaterial = track(
      new THREE.MeshBasicMaterial({
        color: "#ffcf8a",
        transparent: true,
        opacity: 0.5,
        toneMapped: false,
      }),
    );

    return {
      groundGeometry,
      groundMaterial,
      apronGeometry,
      apronMaterial,
      runwayGeometry,
      runwayMaterial,
      dashes,
      markers,
      guideGeometry,
      guideMaterial,
      standGeometry,
      standMaterial,
      blockGeometry,
      blockMaterial,
      windowGeometry,
      windowMaterial,
      materials,
      geometries,
    };
  }, [dashCount, runwayLightsPerSide]);

  useEffect(() => {
    const { materials, geometries } = scene;
    return () => {
      for (const material of materials) material.dispose();
      for (const geometry of geometries) geometry.dispose();
    };
  }, [scene]);

  useFrame(() => {
    const p = clamp01(scrollProgress.current);
    // Ground detail fades as we climb — lights stop dominating the frame.
    const fade = 1 - clamp01((p - 0.45) / 0.5);
    for (const ref of [glowPlaneNorth, glowPlaneSouth]) {
      const mesh = ref.current;
      if (!mesh) continue;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 * fade;
    }
    if (lightPool.current) {
      const material = lightPool.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.5 * (1 - clamp01(p / 0.55));
    }
    if (group.current) {
      group.current.visible = p < 0.985;
    }
  });

  return (
    <group ref={group}>
      <mesh
        geometry={scene.groundGeometry}
        material={scene.groundMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
      />

      <mesh
        geometry={scene.apronGeometry}
        material={scene.apronMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
      />

      <mesh
        geometry={scene.runwayGeometry}
        material={scene.runwayMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.008, -34]}
      />

      <primitive object={scene.dashes} />
      <primitive object={scene.markers} />

      {/* Amber taxiway guide */}
      <mesh geometry={scene.guideGeometry} material={scene.guideMaterial} />

      {/* Stand markings: lead-in lines and a stop bar ahead of the nose */}
      {[-1.15, 1.15].map((z) => (
        <mesh
          key={z}
          geometry={scene.standGeometry}
          material={scene.standMaterial}
          position={[6.2, 0.02, z]}
          rotation={[0, Math.PI / 2, 0]}
        />
      ))}
      <mesh
        geometry={scene.standGeometry}
        material={scene.standMaterial}
        position={[9.4, 0.02, 0]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 0.55]}
      />

      {/* Floodlit pool on the apron beneath the aircraft */}
      <mesh ref={lightPool} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[70, 46]} />
        <meshBasicMaterial
          map={textureLightPool}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Glow bands along the runway edges (cheap stand-in for bloom) */}
      <mesh ref={glowPlaneNorth} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, -49.4]}>
        <planeGeometry args={[480, 1.6]} />
        <meshBasicMaterial
          map={textureEdgeGlow}
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={glowPlaneSouth} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, -18.6]}>
        <planeGeometry args={[480, 1.6]} />
        <meshBasicMaterial
          map={textureEdgeGlow}
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Approach lights receding into the fog, as a depth cue */}
      {Array.from({ length: 9 }).map((_, index) => (
        <mesh
          key={index}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-230 - index * 34, 0.05, -34]}
        >
          <planeGeometry args={[16, 16]} />
          <meshBasicMaterial
            map={textureApproach}
            transparent
            opacity={0.34 - index * 0.03}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Terminal silhouette with lit window bands */}
      {[
        { x: -90, y: 9, z: -150, w: 90, h: 18, d: 26 },
        { x: 30, y: 7, z: -168, w: 120, h: 14, d: 30 },
        { x: 150, y: 11, z: -140, w: 70, h: 22, d: 22 },
      ].map((block) => (
        <group key={`${block.x}-${block.z}`}>
          <mesh
            geometry={scene.blockGeometry}
            material={scene.blockMaterial}
            position={[block.x, block.y / 2, block.z]}
            scale={[block.w, block.h, block.d]}
          />
          <mesh
            geometry={scene.windowGeometry}
            material={scene.windowMaterial}
            position={[block.x, block.y * 0.55, block.z + block.d / 2 + 0.4]}
            scale={[block.w * 0.92, 1.6, 1]}
          />
        </group>
      ))}
    </group>
  );
}
