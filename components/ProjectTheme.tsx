"use client";

import { motion } from "framer-motion";

export default function ProjectTheme() {
  return (
    <section className="min-h-screen flex flex-col justify-center bg-loom-cream px-6 py-24 sm:px-12 lg:px-24">
      <div className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xs uppercase tracking-[0.2em] font-semibold text-loom-rust/70 mb-5"
        >
          The project
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-loom-ink mb-8"
        >
          Why WeaveFusion AI
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.18 }}
          className="text-base sm:text-lg lg:text-xl leading-relaxed text-loom-ink/70 max-w-2xl"
        >
          Circular fashion isn&apos;t a trend, it&apos;s a return: fewer synthetic garments cycling
          through, more pieces worth keeping, made from natural fiber that&apos;s healthier against
          your skin and lighter on the earth. WeaveFusion AI is one way to make that real —
          starting with India&apos;s 104 GI-registered handloom traditions, with the same model
          built to extend to natural-fiber textile heritage anywhere in the world.
        </motion.p>
      </div>
    </section>
  );
}
