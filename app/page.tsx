"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Handloom } from "@/lib/handlooms";
import type { WesternStyle } from "@/lib/styles";
import Sidebar from "@/components/Sidebar";
import StoryCard from "@/components/StoryCard";
import OutfitCanvas from "@/components/OutfitCanvas";
import AwarenessIntro from "@/components/AwarenessIntro";
import ProjectTheme from "@/components/ProjectTheme";

interface GenerateResponse {
  handloom: Handloom;
  style: WesternStyle;
  story: string;
  ecoNote: string;
  source: "watsonx" | "fallback";
  imageUrl: string;
  tryOnApplied: boolean;
}

export default function HomePage() {
  const [selectedHandloom, setSelectedHandloom] = useState<Handloom | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<WesternStyle | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!selectedHandloom || !selectedStyle) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handloomId: selectedHandloom.id,
          styleId: selectedStyle.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      const data: GenerateResponse = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectHandloom(h: Handloom) {
    setSelectedHandloom(h);
    setResult(null);
    setError(null);
  }

  function handleSelectStyle(s: WesternStyle) {
    setSelectedStyle(s);
    setResult(null);
    setError(null);
  }

  return (
    <div className="bg-loom-cream font-sans">

      {/* ── Section 1: Cinematic hero ──────────────────────────────────── */}
      <AwarenessIntro />

      {/* ── Transition divider ─────────────────────────────────────────── */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-px bg-loom-ink/10 origin-left"
      />

      {/* ── Section 2: Bento stats + project theme ─────────────────────── */}
      <ProjectTheme />

      {/* ── Transition divider ─────────────────────────────────────────── */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-px bg-loom-ink/10 origin-left"
      />

      {/* ── Section 3: The generator ───────────────────────────────────── */}
      <section className="bg-loom-cream">

        {/* Section header — slides in from bottom */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 pt-20 pb-10 sm:px-12 lg:px-24 max-w-3xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-loom-rust/70 mb-4"
          >
            Try it yourself
          </motion.p>
          {/* Playfair Display — primary section heading */}
          <h2 className="font-display font-bold leading-tight tracking-tight text-loom-ink
                         text-4xl sm:text-5xl">
            See it for yourself
          </h2>
          {/* Cormorant Garamond — lead-in paragraph */}
          <p className="font-heading mt-4 text-lg sm:text-xl leading-relaxed text-loom-ink/60 max-w-xl">
            Pick a handloom, pick a silhouette, and see what choosing quality
            over quantity actually looks like.
          </p>
        </motion.div>

        {/* 3-step generator */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex h-screen overflow-hidden"
        >
          {/* Left sidebar */}
          <Sidebar
            selectedHandloom={selectedHandloom}
            selectedStyle={selectedStyle}
            onSelectHandloom={handleSelectHandloom}
            onSelectStyle={handleSelectStyle}
            onGenerate={handleGenerate}
            loading={loading}
          />

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Top bar */}
            <header className="flex items-center justify-between">
              <div>
                {/* Cormorant Garamond — generator canvas title */}
                <h2 className="font-heading text-xl font-semibold text-loom-ink">
                  {selectedHandloom && selectedStyle
                    ? `${selectedHandloom.name} × ${selectedStyle.name}`
                    : "Select a handloom and silhouette to begin"}
                </h2>
                {selectedHandloom && (
                  <p className="text-xs text-[#57606a] mt-0.5">
                    {selectedHandloom.region} &mdash; {selectedHandloom.texture}
                  </p>
                )}
              </div>

              {result && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`text-[11px] px-3 py-1 rounded-full border font-medium ${
                    result.source === "watsonx"
                      ? "border-loom-gold/50 text-loom-gold bg-loom-gold/10"
                      : "border-[#e5e7eb] text-[#57606a] bg-white"
                  }`}
                >
                  {result.source === "watsonx"
                    ? "Powered by IBM Granite"
                    : "Powered by built-in data"}
                </motion.span>
              )}
            </header>

            {/* Error banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}

            {/* Two-column canvas + story */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
              {/* Left: outfit image */}
              <OutfitCanvas
                imageUrl={result?.imageUrl ?? null}
                loading={loading}
                handloomName={result?.handloom.name ?? selectedHandloom?.name ?? null}
                styleName={result?.style.name ?? selectedStyle?.name ?? null}
                tryOnApplied={result?.tryOnApplied ?? false}
              />

              {/* Right: story + eco scorecard */}
              <StoryCard
                story={result?.story ?? null}
                ecoNote={result?.ecoNote ?? null}
                source={result?.source ?? null}
                handloomName={result?.handloom.name ?? null}
                waterSavedLiters={result?.handloom.ecoStats.waterSavedLiters ?? null}
                comparedTo={result?.handloom.ecoStats.comparedTo ?? null}
                loading={loading}
              />
            </div>
          </main>
        </motion.div>

      </section>
    </div>
  );
}
