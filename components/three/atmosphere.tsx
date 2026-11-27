"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  SUN_DIRECTION,
  TIER_QUALITY,
  cloudTexture,
  createSkySample,
  radialTexture,
  sampleSky,
  scrollProgress,
} from "@/components/three/scene-config";

/**
 * ATMOSPHERE — the cockpit grade of the whole experience.
 * One shader sky, one star field, a cloud deck built from a canvas texture and
 * a single strong light rig drift through dusk → blue hour → first light as the
 * visitor scrolls. No post-processing passes: the grade is in the materials.
 */

const SKY_VERTEX = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    vDirection = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAGMENT = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform vec3 uSunDirection;
  uniform float uSunIntensity;
  varying vec3 vDirection;

  void main() {
    vec3 dir = normalize(vDirection);
    float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);

    vec3 colour = mix(uHorizon, uMid, smoothstep(0.47, 0.63, h));
    colour = mix(colour, uTop, smoothstep(0.62, 0.98, h));

    float alignment = max(dot(dir, normalize(uSunDirection)), 0.0);
    float disc = pow(alignment, 14.0) * uSunIntensity;
    float halo = pow(alignment, 2.6) * uSunIntensity * 0.28;

    colour += vec3(1.0, 0.74, 0.44) * (disc + halo);
    gl_FragColor = vec4(colour, 1.0);

    #include <colorspace_fragment>
  }
`;

export function Atmosphere({ tier }: { tier: "A" | "B" }) {
  const quality = TIER_QUALITY[tier];
  const { scene } = useThree();

  const skyMaterial = useRef<THREE.ShaderMaterial>(null);
  const starsMaterial = useRef<THREE.PointsMaterial>(null);
  const sunMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const rimLight = useRef<THREE.DirectionalLight>(null);
  const bounceLight = useRef<THREE.DirectionalLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const cloudRefs = useRef<Array<THREE.Mesh | null>>([]);

  const sample = useMemo(() => createSkySample(), []);
  const fogColor = useMemo(() => new THREE.Color("#0b1424"), []);
  const starTexture = useMemo(() => radialTexture("255, 255, 255", 1, 32), []);
  const sunTexture = useMemo(() => radialTexture("255, 208, 150", 1.4, 256), []);
  const cloudMap = useMemo(() => cloudTexture(), []);
  const targetPosition = useMemo(() => new THREE.Vector3(), []);

  const starGeometry = useMemo(() => {
    const count = quality.stars;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      // Upper hemisphere distribution, biased away from the horizon.
      const theta = Math.random() * Math.PI * 2;
      const y = 0.12 + Math.random() * 0.88;
      const radius = Math.sqrt(1 - y * y);
      const distance = 900;
      positions[index * 3] = Math.cos(theta) * radius * distance;
      positions[index * 3 + 1] = y * distance;
      positions[index * 3 + 2] = Math.sin(theta) * radius * distance;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [quality.stars]);

  const clouds = useMemo(() => {
    const list: Array<{ position: [number, number, number]; scale: number; speed: number }> = [];
    for (let index = 0; index < quality.clouds; index += 1) {
      const t = index / Math.max(1, quality.clouds - 1);
      list.push({
        position: [
          -120 + t * 320 + (index % 2 === 0 ? -40 : 40),
          16 + t * 46 + (index % 3) * 7,
          -60 + (index % 2 === 0 ? 70 : -90) + t * 40,
        ],
        scale: 150 + (index % 3) * 60,
        speed: 4 + (index % 3) * 2,
      });
    }
    return list;
  }, [quality.clouds]);

  useEffect(() => {
    return () => {
      starGeometry.dispose();
      starTexture.dispose();
      sunTexture.dispose();
      cloudMap.dispose();
    };
  }, [starGeometry, starTexture, sunTexture, cloudMap]);

  useEffect(() => {
    scene.fog = new THREE.FogExp2(fogColor.getHex(), 0.016);
    return () => {
      scene.fog = null;
    };
  }, [scene, fogColor]);

  useFrame((_, delta) => {
    const p = scrollProgress.current;
    sampleSky(p, sample);
    const step = Math.min(delta, 1 / 30);

    if (skyMaterial.current) {
      const uniforms = skyMaterial.current.uniforms;
      uniforms.uTop!.value.copy(sample.top);
      uniforms.uMid!.value.copy(sample.mid);
      uniforms.uHorizon!.value.copy(sample.horizon);
      uniforms.uSunIntensity!.value = sample.sunOpacity;
      uniforms.uSunDirection!.value.copy(targetPosition.copy(SUN_DIRECTION));
    }

    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      const fog = scene.fog;
      fog.color.copy(sample.horizon).lerp(sample.mid, 0.55);
      fog.density = sample.fogDensity;
    }

    if (starsMaterial.current) starsMaterial.current.opacity = sample.starOpacity;
    if (sunMaterial.current) sunMaterial.current.opacity = sample.sunOpacity * 0.9;

    if (keyLight.current) {
      keyLight.current.position.set(SUN_DIRECTION.x * 120, 40 + p * 120, SUN_DIRECTION.z * 120);
      keyLight.current.intensity = 1.05 + p * 1.1;
      keyLight.current.color.setRGB(
        0.66 + p * 0.34,
        0.74 + p * 0.22,
        0.98 - p * 0.05,
      );
    }
    if (rimLight.current) {
      rimLight.current.intensity = 0.55 - p * 0.25;
    }
    if (bounceLight.current) {
      // Warm flood bouncing off the apron — what actually lights a parked
      // aircraft at night.
      bounceLight.current.intensity = 0.55 + (1 - p) * 0.35;
    }
    if (ambient.current) ambient.current.intensity = sample.ambient;

    // Cloud deck drifts slowly and fades in as the aircraft climbs into it.
    cloudRefs.current.forEach((cloud, index) => {
      if (!cloud) return;
      const config = clouds[index];
      cloud.position.x += step * (config?.speed ?? 4);
      if (cloud.position.x > 260) cloud.position.x = -220;
      const material = cloud.material as THREE.MeshBasicMaterial;
      material.opacity = sample.cloudOpacity * (index % 2 === 0 ? 0.5 : 0.34);
    });
  });

  return (
    <>
      {/* Sky dome */}
      <mesh>
        <sphereGeometry args={[1200, 32, 24]} />
        <shaderMaterial
          ref={skyMaterial}
          vertexShader={SKY_VERTEX}
          fragmentShader={SKY_FRAGMENT}
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={{
            uTop: { value: new THREE.Color("#04060d") },
            uMid: { value: new THREE.Color("#0b1424") },
            uHorizon: { value: new THREE.Color("#3b2a1f") },
            uSunDirection: { value: SUN_DIRECTION.clone() },
            uSunIntensity: { value: 0.06 },
          }}
        />
      </mesh>

      {/* Stars */}
      <points geometry={starGeometry}>
        <pointsMaterial
          ref={starsMaterial}
          map={starTexture}
          size={2.4}
          sizeAttenuation={false}
          transparent
          opacity={0.85}
          depthWrite={false}
          toneMapped={false}
        />
      </points>

      {/* Cloud deck: horizontal sheets the aircraft climbs through */}
      {clouds.map((cloud, index) => (
        <mesh
          key={`${cloud.position[0]}-${index}`}
          ref={(mesh) => {
            cloudRefs.current[index] = mesh;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={cloud.position}
          scale={cloud.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={cloudMap}
            transparent
            opacity={0.2}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Sun glow near the horizon */}
      <mesh
        position={[SUN_DIRECTION.x * 900, SUN_DIRECTION.y * 620 - 40, SUN_DIRECTION.z * 900]}
        scale={420}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={sunMaterial}
          map={sunTexture}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* One strong key light, a cool rim, and the apron's warm bounce */}
      <directionalLight ref={keyLight} position={[60, 60, -120]} intensity={1.05} />
      <directionalLight ref={rimLight} position={[-90, 70, 90]} intensity={0.55} color="#9dbbe6" />
      <directionalLight ref={bounceLight} position={[10, -30, 30]} intensity={0.55} color="#ffb224" />
      {/* Hemisphere keeps horizontal surfaces (wings, stabilisers) readable */}
      <hemisphereLight args={["#4a6da3", "#3a2a1c", 0.85]} />
      <ambientLight ref={ambient} intensity={0.5} />
    </>
  );
}
