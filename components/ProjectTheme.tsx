"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ── Animated count-up hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1.6, decimals = 0) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration, decimals]);

  return { value, ref };
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCounter({
  value,
  suffix,
  label,
  accent = false,
}: {
  value: number;
  suffix: string;
  label: string;
  accent?: boolean;
}) {
  const { value: count, ref } = useCountUp(value, 1.8);
  return (
    <div className="flex flex-col gap-1">
      <span
        ref={ref}
        className={`text-4xl sm:text-5xl font-bold tabular-nums ${
          accent ? "text-loom-gold" : "text-loom-ink"
        }`}
      >
        {Math.round(count).toLocaleString()}
        <span className="text-xl sm:text-2xl font-semibold ml-0.5">{suffix}</span>
      </span>
      <span className="text-xs text-loom-ink/50 leading-snug">{label}</span>
    </div>
  );
}

// ── Bento tile variants ───────────────────────────────────────────────────────
const tileVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const, delay },
  }),
};

const HANDLOOM_SWATCHES = [
  { name: "Banarasi Silk", region: "Uttar Pradesh", color: "#b6502f", texture: "Lustrous silk" },
  { name: "Kanjivaram", region: "Tamil Nadu", color: "#8a3324", texture: "Heavy silk weave" },
  { name: "Pochampally Ikat", region: "Telangana", color: "#c8963e", texture: "Geometric ikat" },
  { name: "Pashmina", region: "Kashmir", color: "#6b6355", texture: "Fine wool shawl" },
  { name: "Chanderi", region: "Madhya Pradesh", color: "#9c6644", texture: "Silk-cotton blend" },
  { name: "Jamdani", region: "West Bengal", color: "#4a5d4e", texture: "Muslin lace weave" },
];

export default function ProjectTheme() {
  return (
    <section className="bg-loom-cream px-6 py-24 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">

        {/* ── Section eyebrow ──────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xs uppercase tracking-[0.2em] font-semibold text-loom-rust/70 mb-5"
        >
          The project
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-loom-ink mb-6"
        >
          Why WeaveFusion AI
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.18 }}
          className="text-base sm:text-lg leading-relaxed text-loom-ink/65 max-w-2xl mb-16"
        >
          Circular fashion isn&apos;t a trend — it&apos;s a return. Fewer synthetic garments,
          more pieces worth keeping, made from natural fiber that&apos;s healthier against
          your skin and lighter on the earth.
        </motion.p>

        {/* ── Bento grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">

          {/* Tile 1 — large hero text tile (spans 2 cols on lg) */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={tileVariants}
            className="lg:col-span-2 bg-loom-ink rounded-2xl p-8 flex flex-col justify-between min-h-[200px]"
          >
            <p className="text-xs uppercase tracking-widest text-loom-cream/30 font-semibold">
              Our dataset
            </p>
            <div className="mt-6 grid grid-cols-2 gap-8">
              <StatCounter value={104} suffix="" label="GI-tagged handloom traditions in India" accent />
              <StatCounter value={2800} suffix="L" label="average water saved per handloom garment vs. synthetic" accent />
            </div>
          </motion.div>

          {/* Tile 2 — circular fashion fact */}
          <motion.div
            custom={0.1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={tileVariants}
            className="bg-loom-rust rounded-2xl p-6 flex flex-col justify-between min-h-[200px]"
          >
            <p className="text-xs uppercase tracking-widest text-loom-cream/50 font-semibold">Zero electricity</p>
            <div>
              <p className="text-4xl font-bold text-loom-cream mt-4 mb-2">100%</p>
              <p className="text-sm text-loom-cream/65 leading-snug">
                of handloom weaving is powered by human hands — no turbines, no looms, no grid.
              </p>
            </div>
          </motion.div>

          {/* Tile 3 — handloom swatch showcase */}
          <motion.div
            custom={0.15}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={tileVariants}
            className="sm:col-span-2 lg:col-span-1 bg-white border border-[#e5e7eb] rounded-2xl p-6 flex flex-col gap-3 min-h-[220px]"
          >
            <p className="text-xs uppercase tracking-widest text-loom-ink/35 font-semibold mb-1">
              Featured handlooms
            </p>
            <div className="grid grid-cols-2 gap-2 flex-1">
              {HANDLOOM_SWATCHES.map((h) => (
                <motion.div
                  key={h.name}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className="flex items-center gap-2 p-2 rounded-lg cursor-default"
                  style={{ background: `${h.color}12` }}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: h.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-loom-ink leading-tight truncate">
                      {h.name}
                    </p>
                    <p className="text-[10px] text-loom-ink/40 truncate">{h.region}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tile 4 — water saved stat */}
          <motion.div
            custom={0.2}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={tileVariants}
            className="bg-loom-gold/15 border border-loom-gold/30 rounded-2xl p-6 flex flex-col justify-between min-h-[180px]"
          >
            <p className="text-xs uppercase tracking-widest text-loom-ink/40 font-semibold">
              Water saved
            </p>
            <div className="mt-4">
              <StatCounter value={20} suffix="%" label="of industrial water pollution from textile dyeing — handlooms skip all of it" />
            </div>
          </motion.div>

          {/* Tile 5 — mission statement */}
          <motion.div
            custom={0.25}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={tileVariants}
            className="bg-loom-cream border border-loom-ink/10 rounded-2xl p-6 flex flex-col justify-center min-h-[180px]"
          >
            <p className="text-sm leading-relaxed text-loom-ink/70 italic border-l-2 border-loom-rust pl-4">
              &ldquo;WeaveFusion AI starts with India&apos;s 104 GI-registered traditions —
              and the same model is built to extend to natural-fiber textile heritage
              anywhere in the world.&rdquo;
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
