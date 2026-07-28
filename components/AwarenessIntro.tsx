"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const headlines = [
  { text: "Fashion was never", delay: 0 },
  { text: "about creating", delay: 0.12 },
  { text: "something new.", delay: 0.24 },
];

const statLines = [
  {
    label: "10%",
    detail: "of all carbon emissions come from global fashion",
    accent: false,
  },
  {
    label: "20%",
    detail: "of industrial water pollution caused by textile dyeing",
    accent: false,
  },
  {
    label: "0",
    detail:
      "electricity used by handloom weaving — the original circular fashion",
    accent: true,
  },
];

export default function AwarenessIntro() {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: background moves up at 30% of scroll speed
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-loom-ink"
    >
      {/* ── Parallax textile-grid background ──────────────────────────── */}
      <motion.div
        style={{ y: bgY }}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
      >
        {/* Woven grid overlay — pure CSS, no images */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #c8963e 0px, transparent 1px, transparent 32px), " +
              "repeating-linear-gradient(90deg, #c8963e 0px, transparent 1px, transparent 32px)",
          }}
        />
        {/* Diagonal thread accent */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #b6502f 0px, transparent 1px, transparent 48px)",
          }}
        />
        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, rgba(28,20,16,0.8) 100%)",
          }}
        />
      </motion.div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 px-6 py-24 sm:px-12 lg:px-24 max-w-5xl"
      >
        {/* Eyebrow label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-[11px] uppercase tracking-[0.22em] font-semibold text-loom-gold/60 mb-8"
        >
          WeaveFusion AI — Heritage × Fashion × Sustainability
        </motion.p>

        {/* Staggered headline words */}
        <div className="overflow-hidden">
          {headlines.map(({ text, delay }) => (
            <div key={text} className="overflow-hidden">
              <motion.h1
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight text-loom-cream block"
              >
                {text}
              </motion.h1>
            </div>
          ))}
        </div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.55 }}
          className="mt-8 text-lg sm:text-xl leading-relaxed text-loom-cream/55 max-w-xl"
        >
          It was about preserving what protects you — your body, and the planet you live on.
        </motion.p>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
          {statLines.map(({ label, detail, accent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
              className={`border-t-2 pt-4 ${
                accent ? "border-loom-gold" : "border-loom-rust/50"
              }`}
            >
              <p
                className={`text-3xl font-bold tabular-nums mb-1 ${
                  accent ? "text-loom-gold" : "text-loom-cream"
                }`}
              >
                {label}
              </p>
              <p className="text-xs text-loom-cream/45 leading-snug">{detail}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Scroll cue ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-loom-cream/25 font-medium">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-8 rounded-full bg-gradient-to-b from-loom-cream/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
