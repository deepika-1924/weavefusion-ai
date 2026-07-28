"use client";

import { motion } from "framer-motion";

const stats = [
  "Global fashion produces 10% of the world's carbon emissions and is the second-largest consumer of fresh water on Earth.",
  "Textile dyeing alone causes 20% of industrial water pollution, using roughly 20,000 different chemicals.",
  "Handloom weaving uses zero electricity and closes the loop with natural fiber and natural dye — it's the original circular fashion.",
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export default function AwarenessIntro() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-loom-ink px-6 py-24 sm:px-12 lg:px-24">

      {/* Headline block */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.18 } },
        }}
        className="max-w-3xl"
      >
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-loom-cream"
        >
          Fashion was never about creating something new.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mt-6 text-lg sm:text-xl lg:text-2xl leading-relaxed text-loom-cream/65 max-w-2xl"
        >
          It was about preserving something that protects you — your body, and the planet you live on.
        </motion.p>
      </motion.div>

      {/* Stats — animate in as each enters viewport */}
      <div className="mt-16 max-w-2xl space-y-6">
        {stats.map((stat, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
            className={`text-sm sm:text-base leading-relaxed pl-4 border-l-2 ${
              i === 2
                ? "border-loom-gold text-loom-cream/80"
                : "border-loom-rust/60 text-loom-cream/55"
            }`}
          >
            {stat}
          </motion.p>
        ))}
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-loom-cream/30 font-medium">
          scroll
        </span>
        <motion.svg
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-loom-cream/25"
        >
          <path
            d="M8 2v12M3 9l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
