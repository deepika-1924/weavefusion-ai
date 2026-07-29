"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SIZE = 400;
const COLORS = ["#3a1620", "#5c1024", "#0B6E4F", "#F8F6F1", "#efe9dc"];
const ACCENTS = ["#C9A227", "#C9A227", "#C9A227", "#C9A227", "#7B1E3D"];

function drawSwatch(ctx: CanvasRenderingContext2D, seed: number) {
  const bg = COLORS[seed % COLORS.length];
  const fg = ACCENTS[seed % ACCENTS.length];
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = fg;
  ctx.strokeStyle = fg;
  const grid = 6 + (seed % 3);
  const step = SIZE / grid;
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      if ((x + y + seed) % 2 !== 0) continue;
      const cx = x * step + step / 2;
      const cy = y * step + step / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((seed % 2 === 0 ? 1 : -1) * (Math.PI / 4));
      ctx.globalAlpha = 0.75;
      ctx.fillRect(-step / 3, -step / 3, (step / 3) * 2, (step / 3) * 2);
      ctx.restore();
    }
  }
  ctx.globalAlpha = 1;
  const borderW = SIZE * 0.08;
  ctx.fillRect(0, 0, SIZE, borderW);
  ctx.fillRect(0, SIZE - borderW, SIZE, borderW);
}

function useSwatchTextures() {
  return useMemo(() => {
    return [0, 1, 2, 3, 4].map((seed) => {
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      if (ctx) drawSwatch(ctx, seed);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      return texture;
    });
  }, []);
}

function Carousel() {
  const groupRef = useRef<THREE.Group>(null);
  const textures = useSwatchTextures();
  const radius = 1.6;
  const count = textures.length;

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={groupRef}>
      {textures.map((texture, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
            <planeGeometry args={[1.15, 1.45]} />
            <meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.55} metalness={0.08} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function HandloomGallery() {
  return (
    <div className="pointer-events-none absolute right-[2%] top-[8%] h-[46%] w-[42%] max-w-[420px] opacity-90 md:right-[4%] md:top-[10%]">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.4, 4.2], fov: 40 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.65} />
        <pointLight position={[3, 3, 3]} intensity={1} color="#C9A227" />
        <pointLight position={[-3, -2, 2]} intensity={0.4} color="#7B1E3D" />
        <Carousel />
      </Canvas>
    </div>
  );
}
