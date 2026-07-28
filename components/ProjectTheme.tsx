"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ── Animated count-up hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1.8, decimals = 0) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration, decimals]);

  return { value, ref };
}

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
      {/* Playfair Display for the count number — carries typographic weight */}
      <span
        ref={ref}
        className={`font-display text-4xl sm:text-5xl font-bold tabular-nums ${
          accent ? "text-loom-gold" : "text-loom-ink"
        }`}
      >
        {Math.round(count).toLocaleString()}
        <span className="font-display text-xl sm:text-2xl font-semibold ml-0.5">{suffix}</span>
      </span>
      <span className="font-sans text-xs text-loom-ink/50 leading-snug">{label}</span>
    </div>
  );
}

// ── 3-D tilt card ─────────────────────────────────────────────────────────────
// Mouse-tracked perspective tilt using CSS transforms + framer-motion.
// No WebGL, no Three.js — purely CSS perspective + rotateX/rotateY.
function TiltCard({
  children,
  className = "",
  intensity = 8,         // max tilt degrees
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glare: { x: 50, y: 50 } });
  const [hovered, setHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;   // 0..1 left→right
    const ny = (e.clientY - rect.top)  / rect.height;  // 0..1 top→bottom
    setTilt({
      x: (ny - 0.5) * -intensity * 2,  // rotateX: mouse near bottom → tilt forward
      y: (nx - 0.5) *  intensity * 2,  // rotateY: mouse near right  → tilt right
      glare: { x: nx * 100, y: ny * 100 },
    });
  }

  function reset() {
    setHovered(false);
    setTilt({ x: 0, y: 0, glare: { x: 50, y: 50 } });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={reset}
      style={{ perspective: "900px" }}
      className={className}
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: hovered ? 1.025 : 1,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 26, mass: 0.6 }}
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        className="relative h-full w-full"
      >
        {children}
        {/* Soft glare layer */}
        {hovered && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
            style={{
              background: `radial-gradient(circle at ${tilt.glare.x}% ${tilt.glare.y}%, rgba(255,255,255,0.09) 0%, transparent 65%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

// ── Comparison row data ───────────────────────────────────────────────────────
const COMPARISONS = [
  {
    icon: "🌿",
    topic: "Your skin",
    fast: {
      headline: "Synthetic fibres",
      detail:
        "Polyester and nylon trap heat, retain moisture, and sit against your skin with residual dye chemicals — linked to contact dermatitis and microplastic absorption.",
    },
    handloom: {
      headline: "Natural fibre",
      detail:
        "Cotton, silk and wool breathe with your body, regulate temperature naturally, and carry none of the petrochemical finishes of synthetic fabrics.",
    },
  },
  {
    icon: "⏳",
    topic: "Durability",
    fast: {
      headline: "Months, not years",
      detail:
        "Fast-fashion pieces are engineered for a season. Loose threads, colour bleed, and structural failure are features, not bugs — they keep you coming back.",
    },
    handloom: {
      headline: "Decades, not seasons",
      detail:
        "A Kanjivaram silk sari or a Pashmina shawl is a heirloom. The tensile strength of hand-interlocked threads outlasts any power-loom construction.",
    },
  },
  {
    icon: "💧",
    topic: "The planet",
    fast: {
      headline: "20,000 chemicals",
      detail:
        "Textile dyeing uses up to 20,000 different chemicals, making fashion the second-largest polluter of clean water. Much of it reaches rivers untreated.",
    },
    handloom: {
      headline: "Zero electricity",
      detail:
        "Traditional handlooms run on no grid power. Natural dyes from plant sources, mordanted in water — the same water returned to the earth safely.",
    },
  },
];

// ── Bento data ────────────────────────────────────────────────────────────────
const tileVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const, delay },
  }),
};

const HANDLOOM_SWATCHES = [
  { name: "Banarasi Silk",    region: "Uttar Pradesh", color: "#b6502f" },
  { name: "Kanjivaram",       region: "Tamil Nadu",    color: "#8a3324" },
  { name: "Pochampally Ikat", region: "Telangana",     color: "#c8963e" },
  { name: "Pashmina",         region: "Kashmir",       color: "#6b6355" },
  { name: "Chanderi",         region: "Madhya Pradesh",color: "#9c6644" },
  { name: "Jamdani",          region: "West Bengal",   color: "#4a5d4e" },
];

// ── Parallax wrapper ──────────────────────────────────────────────────────────
// Lightweight depth layer — moves a subtle background element at a different rate
function ParallaxLayer({
  children,
  className = "",
  speed = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.closest("section");
    if (!parent) return;

    const onScroll = () => {
      const rect = parent.getBoundingClientRect();
      const viewMid = window.innerHeight / 2;
      const sectionMid = rect.top + rect.height / 2;
      setOffsetY((viewMid - sectionMid) * speed);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      style={{ transform: `translateY(${offsetY}px)`, willChange: "transform" }}
      className={className}
    >
      {children}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProjectTheme() {
  return (
    <section className="relative bg-loom-cream overflow-hidden">

      {/* ── Background depth texture — parallax at a slower rate ──────── */}
      <ParallaxLayer
        speed={0.05}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #1c1410 0px, transparent 1px, transparent 40px), " +
              "repeating-linear-gradient(90deg, #1c1410 0px, transparent 1px, transparent 40px)",
          }}
        />
      </ParallaxLayer>

      {/* ──────────────────────────────────────────────────────────────────
          PART 1 — Quality & Health lead section
      ────────────────────────────────────────────────────────────────── */}
      <div className="relative px-6 pt-24 pb-20 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-loom-rust/70 mb-5"
          >
            Why it matters to you
          </motion.p>

          {/* Playfair Display — primary section title */}
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
            className="font-display font-bold leading-tight tracking-tight text-loom-ink mb-5
                       text-4xl sm:text-5xl lg:text-6xl"
          >
            What you wear<br className="hidden sm:block" /> touches everything.
          </motion.h2>

          {/* Cormorant Garamond — sub-heading body intro */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.18 }}
            className="font-heading text-lg sm:text-xl leading-relaxed text-loom-ink/65 max-w-2xl mb-16"
          >
            Fabric sits against your skin for hours every day. It shapes how
            you feel, how long it lasts, and what trace it leaves on the world
            when you&apos;re done with it.
          </motion.p>

          {/* ── Comparison cards ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {COMPARISONS.map(({ icon, topic, fast, handloom }, i) => (
              <motion.div
                key={topic}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.65, ease: "easeOut", delay: i * 0.1 }}
              >
                {/* Topic label — small caps Inter */}
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-loom-ink/35 mb-3">
                  {icon}&nbsp;&nbsp;{topic}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {/* Fast fashion column */}
                  <TiltCard
                    intensity={6}
                    className="rounded-xl min-h-[160px]"
                  >
                    <div className="h-full bg-loom-cream border border-loom-ink/8 rounded-xl p-4 flex flex-col gap-2">
                      <span className="font-sans text-[9px] uppercase tracking-widest font-bold text-loom-rust/60">
                        Fast fashion
                      </span>
                      {/* Cormorant Garamond for comparison card headlines */}
                      <p className="font-heading text-base font-semibold text-loom-ink leading-tight">
                        {fast.headline}
                      </p>
                      <p className="font-sans text-xs text-loom-ink/55 leading-relaxed mt-auto">
                        {fast.detail}
                      </p>
                    </div>
                  </TiltCard>

                  {/* Handloom column */}
                  <TiltCard
                    intensity={6}
                    className="rounded-xl min-h-[160px]"
                  >
                    <div className="h-full bg-loom-ink rounded-xl p-4 flex flex-col gap-2">
                      <span className="font-sans text-[9px] uppercase tracking-widest font-bold text-loom-gold/60">
                        Handloom
                      </span>
                      <p className="font-heading text-base font-semibold text-loom-cream leading-tight">
                        {handloom.headline}
                      </p>
                      <p className="font-sans text-xs text-loom-cream/50 leading-relaxed mt-auto">
                        {handloom.detail}
                      </p>
                    </div>
                  </TiltCard>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Subtle section divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="h-px bg-loom-ink/8 origin-left mx-6 sm:mx-12 lg:mx-24"
      />

      {/* ──────────────────────────────────────────────────────────────────
          PART 2 — Supporting stats bento grid
      ────────────────────────────────────────────────────────────────── */}
      <div className="relative px-6 py-20 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-loom-rust/70 mb-5"
          >
            The numbers behind it
          </motion.p>

          {/* Cormorant Garamond — secondary section heading */}
          <motion.h3
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
            className="font-heading font-semibold text-loom-ink mb-12 max-w-xl leading-snug
                       text-2xl sm:text-3xl"
          >
            WeaveFusion AI starts with India&apos;s
            104 GI-registered handloom traditions.
          </motion.h3>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">

            {/* Tile 1 — spans 2 cols — key numbers */}
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={tileVariants}
            >
              <TiltCard intensity={4} className="rounded-2xl h-full">
                <div className="h-full bg-loom-ink rounded-2xl p-8 flex flex-col justify-between min-h-[200px]">
                  <p className="font-sans text-xs uppercase tracking-widest text-loom-cream/30 font-semibold">
                    Our dataset
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-8">
                    <StatCounter value={104}  suffix=""  label="GI-tagged handloom traditions in India"                accent />
                    <StatCounter value={2800} suffix="L" label="avg. water saved per handloom garment vs. synthetic"   accent />
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Tile 2 — zero electricity */}
            <motion.div
              custom={0.1}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={tileVariants}
            >
              <TiltCard intensity={5} className="rounded-2xl h-full">
                <div className="h-full bg-loom-maroon rounded-2xl p-6 flex flex-col justify-between min-h-[200px]">
                  <p className="font-sans text-xs uppercase tracking-widest text-loom-cream/50 font-semibold">
                    Zero electricity
                  </p>
                  <div>
                    <p className="font-display text-4xl font-bold text-loom-cream mt-4 mb-2">100%</p>
                    <p className="font-sans text-sm text-loom-cream/65 leading-snug">
                      powered by human hands — no turbines, no grid, no carbon cost.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Tile 3 — handloom swatches */}
            <motion.div
              custom={0.15}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={tileVariants}
              className="sm:col-span-2 lg:col-span-1"
            >
              <TiltCard intensity={4} className="rounded-2xl h-full">
                <div className="h-full bg-white border border-[#e5e7eb] rounded-2xl p-6 flex flex-col gap-3 min-h-[220px]">
                  <p className="font-sans text-xs uppercase tracking-widest text-loom-ink/35 font-semibold mb-1">
                    Featured handlooms
                  </p>
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {HANDLOOM_SWATCHES.map((h) => (
                      <div
                        key={h.name}
                        className="flex items-center gap-2 p-2 rounded-lg"
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
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Tile 4 — water pollution stat */}
            <motion.div
              custom={0.2}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={tileVariants}
            >
              <TiltCard intensity={5} className="rounded-2xl h-full">
                <div className="h-full bg-loom-emerald/10 border border-loom-emerald/25 rounded-2xl p-6 flex flex-col justify-between min-h-[180px]">
                  <p className="font-sans text-xs uppercase tracking-widest text-loom-ink/40 font-semibold">
                    Water pollution
                  </p>
                  <div className="mt-4">
                    <StatCounter
                      value={20}
                      suffix="%"
                      label="of all industrial water pollution comes from textile dyeing — handlooms skip this entirely"
                    />
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Tile 5 — pull quote */}
            <motion.div
              custom={0.25}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={tileVariants}
            >
              <TiltCard intensity={4} className="rounded-2xl h-full">
                <div className="h-full bg-loom-cream border border-loom-ink/10 rounded-2xl p-6 flex flex-col justify-center min-h-[180px]">
                  {/* Cormorant Garamond — pull-quote */}
                  <p className="font-heading text-lg leading-relaxed text-loom-ink/70 italic border-l-2 border-loom-maroon pl-4">
                    &ldquo;The same model is built to extend to natural-fiber
                    textile heritage anywhere in the world — not just India.&rdquo;
                  </p>
                </div>
              </TiltCard>
            </motion.div>

          </div>
        </div>
      </div>

    </section>
  );
}
