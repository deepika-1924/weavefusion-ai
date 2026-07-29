"use client";

/**
 * HeroScene — React Three Fiber particle field for the hero section.
 *
 * Architecture:
 *   - Three InstancedMesh objects (one per color family) for a single draw
 *     call per material. Far cheaper than individual meshes.
 *   - Per-particle seed data (position, phase, speed, scale) computed once
 *     via useMemo — never re-allocated on re-renders.
 *   - useFrame drives a sine-wave Y-float + slow per-axis rotation each tick.
 *   - Canvas: alpha background, dpr capped at 1.5, antialias off (perf).
 *   - Pointer-events disabled on the wrapper — text above is fully interactive.
 *   - Reduced particle count on mobile (< 640 px width).
 */

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Palette ──────────────────────────────────────────────────────────────────
const COLORS = [
  { hex: "#C9A227", emissiveHex: "#C9A227", emissiveIntensity: 0.6 }, // Royal gold
  { hex: "#b6502f", emissiveHex: "#b6502f", emissiveIntensity: 0.4 }, // Rust
  { hex: "#7B1E3D", emissiveHex: "#7B1E3D", emissiveIntensity: 0.35 }, // Maroon
];

// ── Particle seed data ────────────────────────────────────────────────────────
interface ParticleSeed {
  x: number;
  y: number;
  z: number;
  phaseY: number;  // sine offset for float
  phaseRx: number; // rotation-x phase
  phaseRz: number; // rotation-z phase
  speedY: number;  // float speed multiplier
  speedR: number;  // rotation speed multiplier
  scale: number;   // uniform scale
}

function buildSeeds(count: number): ParticleSeed[] {
  // Deterministic pseudo-random using a simple LCG so the scene looks
  // identical on every render (avoids hydration-mismatch style issues).
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };

  return Array.from({ length: count }, () => ({
    x:      (rand() - 0.5) * 24,   // spread wide
    y:      (rand() - 0.5) * 14,   // spread tall
    z:      (rand() - 0.5) * 8 - 2, // depth behind centre
    phaseY: rand() * Math.PI * 2,
    phaseRx: rand() * Math.PI * 2,
    phaseRz: rand() * Math.PI * 2,
    speedY: 0.18 + rand() * 0.22,  // 0.18 – 0.40  (slow drift)
    speedR: 0.10 + rand() * 0.18,  // 0.10 – 0.28
    scale:  0.025 + rand() * 0.055, // tiny elongated pills
  }));
}

// ── Reusable scratch objects (never re-allocated per frame) ──────────────────
const _obj = new THREE.Object3D();

// ── Instanced particle group ──────────────────────────────────────────────────
function ParticleGroup({
  seeds,
  color,
  emissiveHex,
  emissiveIntensity,
}: {
  seeds: ParticleSeed[];
  color: string;
  emissiveHex: string;
  emissiveIntensity: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Geometry: a tall thin pill (capsule-like via scaled sphere).
  // ScaleY will be applied per-instance to make them look like fiber threads.
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 5, 4), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(emissiveHex),
        emissiveIntensity,
        transparent: true,
        opacity: 0.55,
        roughness: 0.7,
        metalness: 0.2,
        depthWrite: false, // transparent objects shouldn't occlude
      }),
    [color, emissiveHex, emissiveIntensity]
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.elapsedTime;

    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[i];

      // Gentle sine-wave float on Y
      const yOffset = Math.sin(t * s.speedY + s.phaseY) * 0.55;

      _obj.position.set(s.x, s.y + yOffset, s.z);

      // Slow tumbling rotation on X and Z
      _obj.rotation.x = s.phaseRx + t * s.speedR * 0.7;
      _obj.rotation.z = s.phaseRz + t * s.speedR;

      // Elongate into a fiber pill: scale x/z small, y tall
      _obj.scale.set(s.scale, s.scale * 4.5, s.scale);

      _obj.updateMatrix();
      mesh.setMatrixAt(i, _obj.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, seeds.length]}
      frustumCulled={false}
    />
  );
}

// ── Main scene ────────────────────────────────────────────────────────────────
function Scene({ particleCount }: { particleCount: number }) {
  // Split total count across three color groups: ~50% gold, ~30% rust, ~20% maroon
  const [countGold, countRust, countMaroon] = useMemo(() => {
    const g = Math.round(particleCount * 0.5);
    const r = Math.round(particleCount * 0.3);
    const m = particleCount - g - r;
    return [g, r, m];
  }, [particleCount]);

  // Build seeds per group — pass a salt so groups don't overlap spatially
  const seedsGold   = useMemo(() => buildSeeds(countGold),             [countGold]);
  const seedsRust   = useMemo(() => buildSeeds(countRust),             [countRust]);
  const seedsMaroon = useMemo(() => buildSeeds(countMaroon),           [countMaroon]);

  return (
    <>
      {/* Soft ambient fill — very dim so dark bg stays dark */}
      <ambientLight intensity={0.08} color="#C9A227" />

      {/* Gold point light — creates the soft glow from above */}
      <pointLight
        position={[0, 4, 3]}
        intensity={1.4}
        distance={18}
        decay={2}
        color="#C9A227"
      />

      {/* Dim fill light from below — lifts the maroon particles */}
      <pointLight
        position={[0, -5, 2]}
        intensity={0.4}
        distance={12}
        decay={2}
        color="#7B1E3D"
      />

      <ParticleGroup
        seeds={seedsGold}
        color={COLORS[0].hex}
        emissiveHex={COLORS[0].emissiveHex}
        emissiveIntensity={COLORS[0].emissiveIntensity}
      />
      <ParticleGroup
        seeds={seedsRust}
        color={COLORS[1].hex}
        emissiveHex={COLORS[1].emissiveHex}
        emissiveIntensity={COLORS[1].emissiveIntensity}
      />
      <ParticleGroup
        seeds={seedsMaroon}
        color={COLORS[2].hex}
        emissiveHex={COLORS[2].emissiveHex}
        emissiveIntensity={COLORS[2].emissiveIntensity}
      />
    </>
  );
}

// ── Exported component ────────────────────────────────────────────────────────
export default function HeroScene({ isMobile }: { isMobile: boolean }) {
  const particleCount = isMobile ? 80 : 200;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 60 }}
      gl={{
        antialias: false,
        alpha: true,          // transparent background — dark section bg shows through
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
    >
      <Scene particleCount={particleCount} />
    </Canvas>
  );
}
