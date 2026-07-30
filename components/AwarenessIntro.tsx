"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// ── HeroScene loaded client-only (Three.js cannot run in SSR) ────────────────
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const HandloomGallery = dynamic(() => import("./HandloomGallery"), { ssr: false });

// ── Narrative lines — max ~6 words each ──────────────────────────────────────
// hold = how long (ms) the line is displayed at full opacity before exit begins
const STORY_LINES: { text: string; hold: number }[] = [
  { text: "Before machines,",                         hold: 1000 },
  { text: "before factories,",                        hold: 1000 },
  { text: "there were hands.",                        hold: 1400 },
  { text: "Threads passed down through generations.", hold: 1600 },
  { text: "Then fashion got fast.",                   hold: 1400 },
  { text: "Really, really fast.",                     hold: 1200 },
  { text: "We forgot what it cost.",                  hold: 1600 },
  { text: "Our skin. Our rivers.",                    hold: 1600 },
  { text: "Our craft.",                               hold: 1400 },
];

// How long each AnimatePresence enter/exit animation runs (ms).
// AnimatePresence mode="wait" plays enter then exit back-to-back, so the
// total "slot" for line i = FADE_MS(enter) + hold[i], then we fire the next
// setTimeout which triggers the exit of i and the enter of i+1 concurrently
// (mode="wait" ensures i+1 doesn't enter until i fully exits).
const FADE_MS = 420;

// ── Stat data ─────────────────────────────────────────────────────────────────
const statLines = [
  { label: "10%",   detail: "of global carbon emissions — from fashion alone",         accent: false },
  { label: "20%",   detail: "of industrial water pollution caused by textile dyeing",   accent: false },
  { label: "0 kWh", detail: "used by handloom weaving — the original circular craft",  accent: true  },
];

// ── Line variants ─────────────────────────────────────────────────────────────
const lineVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  show:   { opacity: 1, scale: 1,    y: 0 },
  exit:   { opacity: 0, scale: 1.04, y: -8 },
};

// ── Hook: drives the sequence entirely with setTimeout chains ────────────────
//
// WHY NOT rAF + elapsed state:
//   React 18 batches setState calls inside rAF callbacks. Under GC pressure,
//   tab-background throttling, or a burst of batched renders, multiple ticks
//   can fire before React commits — the intermediate elapsed values are
//   discarded, causing lines whose entire visibility window (often ~80ms gap)
//   falls between two batched renders to be silently skipped.
//
// THIS APPROACH:
//   Build a chain of setTimeout calls, one per line. Each timeout fires once,
//   sets activeIndex to the next line index, and nothing else. No stale
//   closures over elapsed, no range windows to miss, no RAF batching hazard.
//   AnimatePresence mode="wait" handles the exit/enter sequencing visually.
//
function useSequence(): { activeIndex: number | null; statsVisible: boolean } {
  // Start at -1 so the first setTimeout (delay=0) advances to 0 cleanly.
  // "null" means no line is showing (gap between lines, or sequence done).
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  // Guard ref so cleanup in React Strict Mode's double-invoke doesn't
  // fire callbacks after the component unmounts.
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;

    // Schedule each line in turn.
    // Line i shows for FADE_MS (enter) + hold[i] ms, then we fire the next line.
    // We don't need an explicit null step: just advancing the key from i to i+1
    // triggers AnimatePresence to exit i and enter i+1. mode="wait" ensures
    // i+1 doesn't appear until i's exit animation completes.
    let accumulated = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STORY_LINES.forEach(({ hold }, i) => {
      const t = accumulated;
      timers.push(
        setTimeout(() => {
          if (aliveRef.current) setActiveIndex(i);
        }, t)
      );
      // Advance cursor: enter animation + hold duration = total time this line occupies
      // before we fire the next one.
      accumulated += FADE_MS + hold;
    });

    // After the last line's enter + hold, clear the index (triggers exit animation).
    timers.push(
      setTimeout(() => {
        if (aliveRef.current) setActiveIndex(null);
      }, accumulated)
    );

    // Stats appear after the last exit animation has played through.
    timers.push(
      setTimeout(() => {
        if (aliveRef.current) setStatsVisible(true);
      }, accumulated + FADE_MS + 200)
    );

    return () => {
      aliveRef.current = false;
      timers.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { activeIndex, statsVisible };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AwarenessIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const { activeIndex, statsVisible } = useSequence();

  // Detect mobile once on mount to pass reduced particle count into the scene.
  // Using state so it only runs client-side (window is undefined during SSR).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 639px)").matches);
  }, []);

  // Parallax: background drifts at 30% scroll speed, content at 12%
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY      = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const fadeOut  = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-loom-ink"
    >

      {/* ── R3F particle scene — sits at z-0 behind all content ───────── */}
      {/* pointer-events-none so it never intercepts clicks/touches       */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <HeroScene isMobile={isMobile} />
      <HandloomGallery />
      </div>

      {/* ── Parallax textile-grid background ──────────────────────────── */}
      <motion.div
        style={{ y: bgY }}
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
      >
        {/* Woven grid — pure CSS, royal gold threads */}
        <div
          className="absolute inset-0 opacity-[0.065]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #C9A227 0px, transparent 1px, transparent 32px), " +
              "repeating-linear-gradient(90deg, #C9A227 0px, transparent 1px, transparent 32px)",
          }}
        />
        {/* Diagonal accent thread — maroon */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #7B1E3D 0px, transparent 1px, transparent 56px)",
          }}
        />
        {/* Depth gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(27,27,27,0) 20%, rgba(27,27,27,0.75) 100%)",
          }}
        />
      </motion.div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity: fadeOut }}
        className="relative z-10 flex flex-col items-center justify-center px-6 py-24 sm:px-12 lg:px-24"
      >

        {/* Eyebrow — appears immediately */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          className="font-sans text-lg sm:text-2xl uppercase tracking-[0.26em] font-bold text-loom-gold mb-16 sm:mb-20"
        >
          WeaveFusion AI
        </motion.p>

        {/* ── Timed pop-in / pop-out story sequence ─────────────────── */}
        {/* Fixed-height container so layout doesn't jump between lines */}
        <div className="relative w-full max-w-2xl" style={{ height: "clamp(80px, 14vw, 130px)" }}>
          <AnimatePresence mode="wait">
            {activeIndex !== null && (
              <motion.p
                key={activeIndex}
                variants={lineVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                transition={{
                  opacity: { duration: FADE_MS / 1000, ease: "easeOut" },
                  scale:   { duration: FADE_MS / 1000, ease: "easeOut" },
                  y:       { duration: FADE_MS / 1000, ease: "easeOut" },
                }}
                className="absolute inset-0 flex items-center justify-center text-center
                           font-display font-bold tracking-tight leading-tight text-loom-cream
                           text-3xl sm:text-4xl lg:text-5xl xl:text-6xl"
              >
                {STORY_LINES[activeIndex].text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* ── Stats row — revealed after the sequence completes ─────── */}
        <AnimatePresence>
          {statsVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mt-20 sm:mt-24 w-full max-w-3xl"
            >
              {/* Thin divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-px bg-loom-cream/10 origin-left mb-10"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statLines.map(({ label, detail, accent }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.12 }}
                    className={`border-t-2 pt-4 ${
                      accent ? "border-loom-gold" : "border-loom-rust/50"
                    }`}
                  >
                    {/* Stat number — Playfair Display for typographic weight */}
                    <p
                      className={`font-display text-3xl font-bold tabular-nums mb-1 ${
                        accent ? "text-loom-gold" : "text-loom-cream"
                      }`}
                    >
                      {label}
                    </p>
                    <p className="font-sans text-xs text-loom-cream/45 leading-snug">{detail}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* ── Scroll cue — appears after stats ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: statsVisible ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-loom-cream/25 font-medium">
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
