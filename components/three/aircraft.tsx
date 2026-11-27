"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  clamp01,
  createAircraftState,
  radialTexture,
  sampleAircraft,
  scrollProgress,
  smoothstep,
} from "@/components/three/scene-config";

/**
 * UNBRANDED AIRCRAFT
 * ---------------------------------------------------------------------------
 * Built from primitives at runtime — no GLB download, no third-party model and
 * no airline livery. Lathe profiles give the fuselage, nacelles and stripes
 * smooth engineered surfaces; the accent stripe is the only colour.
 *
 * Local origin = fuselage centreline. The ground sits at y = -2.35.
 */

const LENGTH = 18;
const RADIUS = 1.02;
const GROUND = 2.35;

/* ------------------------------------------------------------- geometries */

function fuselageProfile(): THREE.Vector2[] {
  const points: THREE.Vector2[] = [];
  const samples = 52;
  const noseEnd = 3.3;
  const tailStart = 12.4;

  for (let index = 0; index <= samples; index += 1) {
    const x = (index / samples) * LENGTH;
    let radius: number;
    if (x < noseEnd) {
      const t = smoothstep(x / noseEnd);
      radius = 0.05 + (RADIUS - 0.05) * Math.pow(t, 0.68);
    } else if (x <= tailStart) {
      const t = (x - noseEnd) / (tailStart - noseEnd);
      radius = RADIUS * (1 - 0.035 * t);
    } else {
      const t = smoothstep((x - tailStart) / (LENGTH - tailStart));
      radius = THREE.MathUtils.lerp(RADIUS * 0.965, 0.15, t);
    }
    points.push(new THREE.Vector2(Math.max(0.03, radius), x));
  }
  return points;
}

/** Swept planform, chord running aft (-X), span along +Y before rotation. */
function wingShape(rootChord: number, tipChord: number, span: number, sweep: number): THREE.Shape {
  const shape = new THREE.Shape();
  const tipLead = -sweep * span;
  shape.moveTo(0, 0);
  shape.lineTo(tipLead, span);
  shape.lineTo(tipLead - tipChord, span);
  shape.lineTo(-rootChord, 0);
  shape.closePath();
  return shape;
}

function nacelleShell(): THREE.Vector2[] {
  return [
    new THREE.Vector2(0.68, 0),
    new THREE.Vector2(0.9, 0.07),
    new THREE.Vector2(0.92, 0.55),
    new THREE.Vector2(0.88, 2.0),
    new THREE.Vector2(0.8, 2.8),
    new THREE.Vector2(0.7, 3.25),
    new THREE.Vector2(0.42, 3.4),
    new THREE.Vector2(0.4, 3.3),
    new THREE.Vector2(0.62, 3.0),
    new THREE.Vector2(0.72, 2.2),
    new THREE.Vector2(0.76, 0.9),
    new THREE.Vector2(0.7, 0.1),
    new THREE.Vector2(0.68, 0),
  ];
}

/** One gear leg: strut plus wheels that can spin. */
function GearLeg({
  x,
  z,
  wheels,
  onWheel,
  materials,
  geometries,
  double = false,
}: {
  x: number;
  z: number;
  wheels: number;
  onWheel: (mesh: THREE.Mesh | null, key: string) => void;
  materials: Record<string, THREE.Material>;
  geometries: Record<string, THREE.BufferGeometry>;
  double?: boolean;
}) {
  const strutCenter = -GROUND + 0.75;
  const axle = -GROUND + 0.38;
  return (
    <group position={[x, strutCenter, z]}>
      <mesh geometry={geometries.strut} material={materials.metal!} />
      {Array.from({ length: wheels }).map((_, index) => {
        const offset = double ? (index % 2 === 0 ? 0.17 : -0.17) : 0;
        return (
          <mesh
            key={index}
            ref={(mesh) => onWheel(mesh, `${x}:${z}:${index}`)}
            geometry={geometries.wheel}
            material={materials.rubber!}
            position={[0, axle - strutCenter, offset]}
          />
        );
      })}
    </group>
  );
}

/* ---------------------------------------------------------------- component */

export function Aircraft() {
  const group = useRef<THREE.Group>(null);
  const gearGroup = useRef<THREE.Group>(null);
  const exhaustGlow = useRef<THREE.Mesh>(null);
  const contactShadow = useRef<THREE.Mesh>(null);
  const strobes = useRef<THREE.Mesh[]>([]);
  const wheels = useRef<Map<string, THREE.Mesh>>(new Map());
  const spin = useRef(0);
  const state = useMemo(() => createAircraftState(), []);

  const materials = useMemo(() => {
    const body = new THREE.MeshStandardMaterial({
      color: "#e6eef8",
      metalness: 0.5,
      roughness: 0.3,
      envMapIntensity: 1.6,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: "#d99a1c",
      metalness: 0.5,
      roughness: 0.34,
      emissive: new THREE.Color("#3d2606"),
      envMapIntensity: 0.75,
    });
    const metal = new THREE.MeshStandardMaterial({
      color: "#aab6c6",
      metalness: 0.72,
      roughness: 0.3,
      envMapIntensity: 1.5,
    });
    const glass = new THREE.MeshStandardMaterial({
      color: "#16202e",
      metalness: 0.55,
      roughness: 0.12,
      envMapIntensity: 1.6,
    });
    const nacelle = new THREE.MeshStandardMaterial({
      color: "#c6d0dd",
      metalness: 0.7,
      roughness: 0.36,
      side: THREE.DoubleSide,
      envMapIntensity: 1.3,
    });
    const intake = new THREE.MeshStandardMaterial({
      color: "#10141b",
      metalness: 0.45,
      roughness: 0.5,
    });
    const rubber = new THREE.MeshStandardMaterial({ color: "#0f1116", roughness: 0.88 });
    return { body, accent, metal, glass, nacelle, intake, rubber } as unknown as Record<
      string,
      THREE.Material
    >;
  }, []);

  const textureGlow = useMemo(() => radialTexture("255, 255, 255", 1, 64), []);
  const textureWarm = useMemo(() => radialTexture("255, 172, 96", 1, 64), []);
  const textureShadow = useMemo(() => radialTexture("0, 0, 0", 1.5, 128), []);

  const exhaustMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: textureWarm,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [textureWarm],
  );

  const shadowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: textureShadow,
        color: "#000000",
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    [textureShadow],
  );

  const strobeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: textureGlow,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [textureGlow],
  );

  const geometries = useMemo(() => {
    const fuselage = new THREE.LatheGeometry(fuselageProfile(), 44);
    fuselage.rotateZ(-Math.PI / 2);
    fuselage.translate(-LENGTH / 2, 0, 0);
    fuselage.computeVertexNormals();

    const stripeProfile = fuselageProfile().map((p) => new THREE.Vector2(p.x * 1.01, p.y));
    const stripeStarboard = new THREE.LatheGeometry(stripeProfile, 10, Math.PI / 2 - 0.11, 0.22);
    stripeStarboard.rotateZ(-Math.PI / 2);
    stripeStarboard.translate(-LENGTH / 2, 0, 0);
    const stripePort = new THREE.LatheGeometry(stripeProfile, 10, (3 * Math.PI) / 2 - 0.11, 0.22);
    stripePort.rotateZ(-Math.PI / 2);
    stripePort.translate(-LENGTH / 2, 0, 0);

    // Wings: chord aft (-X), span along Y (rotated into Z per side).
    const wing = new THREE.ExtrudeGeometry(
      wingShape(4.4, 1.35, 7.7, 0.47),
      { depth: 0.3, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 },
    );
    const winglet = new THREE.ExtrudeGeometry(wingShape(1.5, 0.7, 1.7, 0.6), {
      depth: 0.16,
      bevelEnabled: false,
    });
    const stabiliser = new THREE.ExtrudeGeometry(wingShape(2.2, 0.9, 3.6, 0.5), {
      depth: 0.2,
      bevelEnabled: false,
    });
    const fin = new THREE.ExtrudeGeometry(wingShape(3.3, 1.3, 3.1, 0.78), {
      depth: 0.2,
      bevelEnabled: false,
    });
    fin.translate(0, 0, -0.1);

    const nacelle = new THREE.LatheGeometry(nacelleShell(), 26);
    nacelle.rotateZ(-Math.PI / 2);
    nacelle.center();

    const intake = new THREE.CircleGeometry(0.62, 24);
    const exhaust = new THREE.CircleGeometry(0.38, 20);
    const wheel = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 18);
    wheel.rotateX(Math.PI / 2);
    const strut = new THREE.CylinderGeometry(0.085, 0.085, 1.15, 10);
    const pylon = new THREE.BoxGeometry(1.6, 0.8, 0.16);
    const cabinWindow = new THREE.CircleGeometry(0.062, 10);
    const cockpit = new THREE.SphereGeometry(1, 26, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const navLight = new THREE.SphereGeometry(0.07, 10, 8);
    const shadowPlane = new THREE.PlaneGeometry(30, 13);
    const strobePlane = new THREE.PlaneGeometry(1.6, 1.6);

    return {
      fuselage,
      stripeStarboard,
      stripePort,
      wing,
      winglet,
      stabiliser,
      fin,
      nacelle,
      intake,
      exhaust,
      wheel,
      strut,
      pylon,
      cabinWindow,
      cockpit,
      navLight,
      shadowPlane,
      strobePlane,
    } as unknown as Record<string, THREE.BufferGeometry>;
  }, []);

  const windowPositions = useMemo(
    () => Array.from({ length: 8 }, (_, index) => 1.4 - index * 0.66),
    [],
  );

  /** Dispose everything created outside JSX. */
  useEffect(() => {
    return () => {
      for (const geometry of Object.values(geometries)) geometry.dispose();
      for (const material of Object.values(materials)) material.dispose();
      exhaustMaterial.dispose();
      shadowMaterial.dispose();
      strobeMaterial.dispose();
      textureGlow.dispose();
      textureWarm.dispose();
      textureShadow.dispose();
    };
  }, [geometries, materials, exhaustMaterial, shadowMaterial, strobeMaterial, textureGlow, textureWarm, textureShadow]);

  const registerWheel = (mesh: THREE.Mesh | null, key: string) => {
    if (mesh) wheels.current.set(key, mesh);
    else wheels.current.delete(key);
  };

  useFrame((clockState, delta) => {
    const aircraft = sampleAircraft(scrollProgress.current, state);
    const step = Math.min(delta, 1 / 30);

    if (group.current) {
      group.current.position.set(aircraft.x, aircraft.y, 0);
      group.current.rotation.z = aircraft.pitch;
      group.current.rotation.x = aircraft.roll;
    }

    if (gearGroup.current) {
      const retract = 1 - aircraft.gear;
      gearGroup.current.rotation.z = retract * 1.3;
      gearGroup.current.position.y = retract * 0.95;
      gearGroup.current.visible = aircraft.gear > 0.03;
    }

    if (aircraft.gear > 0.1) spin.current += step * (5 + aircraft.throttle * 32);
    for (const wheel of wheels.current.values()) wheel.rotation.x = spin.current;

    // Strobe: double flash every 1.6 s.
    const cycle = clockState.clock.elapsedTime % 1.6;
    const flashing = cycle < 0.06 || (cycle > 0.17 && cycle < 0.23);
    strobeMaterial.opacity = flashing ? 0.85 : 0;
    for (const strobe of strobes.current) {
      if (strobe) strobe.scale.setScalar(flashing ? 1 + Math.random() * 0.3 : 1);
    }

    if (exhaustGlow.current) {
      exhaustMaterial.opacity = 0.06 + aircraft.throttle * 0.3;
      exhaustGlow.current.visible = aircraft.throttle > 0.22;
    }

    if (contactShadow.current) {
      const altitude = clamp01(aircraft.y / 36);
      shadowMaterial.opacity = 0.55 * (1 - altitude) * (1 - altitude);
      contactShadow.current.position.x = aircraft.x;
      contactShadow.current.scale.setScalar(1 - altitude * 0.3);
      contactShadow.current.visible = altitude < 0.98;
    }
  });

  const wingRotation = Math.PI / 2 - 0.075;

  return (
    <group>
      {/* Contact shadow stays on the apron beneath the aircraft */}
      <mesh
        ref={contactShadow}
        geometry={geometries.shadowPlane!}
        material={shadowMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
      />

      <group ref={group} scale={0.9}>
        <mesh geometry={geometries.fuselage!} material={materials.body!} />
        <mesh geometry={geometries.stripeStarboard!} material={materials.accent!} />
        <mesh geometry={geometries.stripePort!} material={materials.accent!} />

        {/* Windscreen shoulder */}
        <mesh
          geometry={geometries.cockpit!}
          material={materials.glass!}
          position={[6.1, 0.42, 0]}
          scale={[1.75, 0.5, 1.0]}
          rotation={[0, 0, -0.05]}
        />

        {/* Cabin windows, both sides */}
        {windowPositions.map((x) => (
          <group key={x}>
            <mesh
              geometry={geometries.cabinWindow!}
              material={materials.glass!}
              position={[x, 0.30, RADIUS * 0.99]}
            />
            <mesh
              geometry={geometries.cabinWindow!}
              material={materials.glass!}
              position={[x, 0.30, -RADIUS * 0.99]}
              rotation={[0, Math.PI, 0]}
            />
          </group>
        ))}

        {/* Wings — root leading edge at x = 2.3, tips trailing aft */}
        <mesh
          geometry={geometries.wing!}
          material={materials.body!}
          position={[2.3, -0.58, 1.15]}
          rotation={[wingRotation, 0, 0]}
        />
        <mesh
          geometry={geometries.wing!}
          material={materials.body!}
          position={[2.3, -0.58, -1.15]}
          rotation={[-wingRotation, 0, 0]}
        />

        {/* Winglets, canted outward at the tips */}
        <mesh
          geometry={geometries.winglet!}
          material={materials.accent!}
          position={[-1.32, 0.5, 8.85]}
          rotation={[0, 0, 0.3]}
        />
        <mesh
          geometry={geometries.winglet!}
          material={materials.accent!}
          position={[-1.32, 0.5, -8.85]}
          rotation={[0, 0, -0.3]}
        />

        {/* Fin: chord along X, thickness across Z — no rotation required */}
        <mesh
          geometry={geometries.fin!}
          material={materials.body!}
          position={[-4.6, 0.98, 0]}
        />

        {/* Horizontal stabilisers */}
        <mesh
          geometry={geometries.stabiliser!}
          material={materials.body!}
          position={[-6.5, 0.05, 0.45]}
          rotation={[wingRotation, 0, 0]}
        />
        <mesh
          geometry={geometries.stabiliser!}
          material={materials.body!}
          position={[-6.5, 0.05, -0.45]}
          rotation={[-wingRotation, 0, 0]}
        />

        {/* Engines */}
        {[3.9, -3.9].map((z) => (
          <group key={z} position={[0.2, -0.92, z]}>
            <mesh geometry={geometries.nacelle!} material={materials.nacelle!} />
            <mesh
              geometry={geometries.intake!}
              material={materials.intake!}
              position={[1.66, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
            />
            <mesh
              ref={z > 0 ? exhaustGlow : undefined}
              geometry={geometries.exhaust!}
              material={exhaustMaterial}
              position={[-1.7, 0, 0]}
              rotation={[0, -Math.PI / 2, 0]}
            />
            <mesh
              geometry={geometries.pylon!}
              material={materials.body!}
              position={[0, 0.86, 0]}
            />
          </group>
        ))}

        {/* Landing gear */}
        <group ref={gearGroup}>
          <GearLeg
            x={6.3}
            z={0}
            wheels={2}
            onWheel={registerWheel}
            materials={materials}
            geometries={geometries}
            double
          />
          <GearLeg x={-0.9} z={1.2} wheels={2} onWheel={registerWheel} materials={materials} geometries={geometries} double />
          <GearLeg x={-0.9} z={-1.2} wheels={2} onWheel={registerWheel} materials={materials} geometries={geometries} double />
        </group>

        {/* Navigation lights and strobes at the wingtips */}
        <mesh geometry={geometries.navLight!} position={[-1.32, 0.42, 8.9]}>
          <meshBasicMaterial color="#ff4436" toneMapped={false} />
        </mesh>
        <mesh geometry={geometries.navLight!} position={[-1.32, 0.42, -8.9]}>
          <meshBasicMaterial color="#34e07f" toneMapped={false} />
        </mesh>
        <mesh
          ref={(mesh) => {
            if (mesh) strobes.current[0] = mesh;
          }}
          geometry={geometries.strobePlane!}
          material={strobeMaterial}
          position={[-1.32, 0.45, 8.95]}
        />
        <mesh
          ref={(mesh) => {
            if (mesh) strobes.current[1] = mesh;
          }}
          geometry={geometries.strobePlane!}
          material={strobeMaterial}
          position={[-1.32, 0.45, -8.95]}
        />
      </group>
    </group>
  );
}
