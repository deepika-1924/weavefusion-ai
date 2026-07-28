"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HANDLOOMS, type Handloom } from "@/lib/handlooms";
import { WESTERN_STYLES, type WesternStyle } from "@/lib/styles";

interface SidebarProps {
  selectedHandloom: Handloom | null;
  selectedStyle: WesternStyle | null;
  onSelectHandloom: (h: Handloom) => void;
  onSelectStyle: (s: WesternStyle) => void;
  onGenerate: () => void;
  loading: boolean;
}

const STEPS = ["Choose handloom", "Choose style", "Generate"] as const;

export default function Sidebar({
  selectedHandloom,
  selectedStyle,
  onSelectHandloom,
  onSelectStyle,
  onGenerate,
  loading,
}: SidebarProps) {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<string | null>(null);

  // Unique regions sorted
  const regions = useMemo(() => {
    const set = new Set(HANDLOOMS.map((h) => h.region));
    return Array.from(set).sort();
  }, []);

  // Filtered handlooms
  const filtered = useMemo(() => {
    return HANDLOOMS.filter((h) => {
      const matchSearch =
        search.trim() === "" ||
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.region.toLowerCase().includes(search.toLowerCase());
      const matchRegion = !regionFilter || h.region === regionFilter;
      return matchSearch && matchRegion;
    });
  }, [search, regionFilter]);

  // Derive current step (1-indexed, 3 steps)
  const currentStep = !selectedHandloom ? 1 : !selectedStyle ? 2 : 3;

  const canGenerate = !!selectedHandloom && !!selectedStyle && !loading;

  return (
    <aside className="w-72 shrink-0 bg-loom-ink text-loom-cream flex flex-col h-full overflow-hidden">

      {/* ── App header + step indicator (sticky, never scrolls) ──────── */}
      <div className="px-5 pt-5 pb-4 border-b border-white/10 shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-loom-cream leading-snug">
          Weave<span className="text-loom-gold">Fusion</span> AI
        </h1>
        <p className="text-[11px] text-loom-cream/40 mt-0.5">
          Heritage × Fashion × Sustainability
        </p>

        {/* 3-step indicator */}
        <div className="mt-4 flex items-center gap-1">
          {STEPS.map((label, i) => {
            const stepNum = i + 1;
            const done = stepNum < currentStep;
            const active = stepNum === currentStep;
            return (
              <div key={label} className="flex items-center gap-1 min-w-0 flex-1">
                <motion.div
                  animate={{
                    backgroundColor: done
                      ? "#c8963e"
                      : active
                      ? "#b6502f"
                      : "rgba(255,255,255,0.10)",
                    color: done || active ? "#fff" : "rgba(244,236,221,0.3)",
                  }}
                  transition={{ duration: 0.35 }}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                >
                  {done ? "✓" : stepNum}
                </motion.div>
                {i < STEPS.length - 1 && (
                  <motion.div
                    animate={{ backgroundColor: done ? "rgba(200,150,62,0.6)" : "rgba(255,255,255,0.10)" }}
                    transition={{ duration: 0.35 }}
                    className="h-px flex-1"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-1.5 flex">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`text-[9px] font-medium leading-tight transition-colors ${
                i + 1 === currentStep
                  ? "text-loom-cream/70"
                  : "text-loom-cream/25"
              }`}
              style={{ width: `${100 / STEPS.length}%`, textAlign: "center" }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Single scrollable column — ALL steps flow here ───────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ── Step 1 — Handloom picker ──────────────────────────────── */}
        <div className="px-4 pt-4 pb-4 border-b border-white/10">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-loom-cream/40 mb-3">
            Step 1 · Handloom
            <span className="ml-2 text-loom-cream/20 font-normal normal-case">
              ({HANDLOOMS.length} GI-registered)
            </span>
          </h2>

          {/* Search */}
          <div className="relative mb-2">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-loom-cream/30 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search handlooms…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-loom-cream placeholder-loom-cream/25 focus:outline-none focus:border-loom-gold/50 transition-colors"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </div>

          {/* Region filter pills */}
          <div className="flex flex-wrap gap-1 mb-2">
            <button
              onClick={() => setRegionFilter(null)}
              className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                !regionFilter
                  ? "border-loom-gold text-loom-gold bg-loom-gold/10"
                  : "border-white/15 text-loom-cream/40 hover:border-white/30"
              }`}
            >
              All
            </button>
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(regionFilter === r ? null : r)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                  regionFilter === r
                    ? "border-loom-gold text-loom-gold bg-loom-gold/10"
                    : "border-white/15 text-loom-cream/40 hover:border-white/30"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Handloom cards grid — capped height with fade hint */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto pr-0.5">
              {filtered.length === 0 ? (
                <p className="col-span-2 text-xs text-loom-cream/30 text-center py-4">
                  No handlooms match your search
                </p>
              ) : (
                filtered.map((h) => {
                  const active = selectedHandloom?.id === h.id;
                  return (
                    <motion.button
                      key={h.id}
                      onClick={() => onSelectHandloom(h)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 24 }}
                      animate={{
                        borderColor: active
                          ? "rgba(200,150,62,0.6)"
                          : "rgba(255,255,255,0.08)",
                        background: active
                          ? "rgba(255,255,255,0.10)"
                          : "rgba(255,255,255,0.04)",
                      }}
                      className="text-left rounded-lg p-2 border"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: h.swatchColor }}
                        />
                        <AnimatePresence>
                          {active && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.6 }}
                              transition={{ duration: 0.2 }}
                              className="text-loom-gold text-[8px] font-bold"
                            >
                              ✓
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className="text-[11px] font-medium text-loom-cream leading-tight line-clamp-2">
                        {h.name}
                      </p>
                      <p className="text-[10px] text-loom-cream/35 mt-0.5 leading-tight truncate">
                        {h.region}
                      </p>
                    </motion.button>
                  );
                })
              )}
            </div>
            {/* Bottom fade — signals more cards inside the scroll box */}
            {filtered.length > 8 && (
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 rounded-b-lg"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(28,20,16,0.85))",
                }}
              />
            )}
          </div>
          {filtered.length > 8 && (
            <p className="text-[10px] text-loom-cream/25 text-center mt-1">
              ↕ scroll inside the grid for more
            </p>
          )}
        </div>

        {/* ── Step 2 — Silhouette ───────────────────────────────────── */}
        <div className="px-4 pt-4 pb-4 border-b border-white/10">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-loom-cream/40 mb-2">
            Step 2 · Silhouette
          </h2>
          <ul className="space-y-1.5">
            {WESTERN_STYLES.map((s) => {
              const active = selectedStyle?.id === s.id;
              return (
                <li key={s.id}>
                  <motion.button
                    onClick={() => onSelectStyle(s)}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    animate={{
                      backgroundColor: active
                        ? "rgba(182,80,47,0.8)"
                        : "transparent",
                      color: active
                        ? "rgb(244,236,221)"
                        : "rgba(244,236,221,0.65)",
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors"
                  >
                    {s.name}
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Step 3 — Generate (inline, always reachable by scrolling) */}
        <div className="px-4 pt-4 pb-6">
          {/* Weaving animation shown while loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-3 flex flex-col items-center gap-2 overflow-hidden"
              >
                <div className="flex gap-1 items-end h-5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-loom-gold rounded-full animate-pulse"
                      style={{
                        height: `${8 + (i % 3) * 5}px`,
                        animationDelay: `${i * 120}ms`,
                        animationDuration: "900ms",
                      }}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-loom-cream/50 text-center">
                  Weaving your fusion look…
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={onGenerate}
            disabled={!canGenerate}
            whileHover={canGenerate ? { scale: 1.02 } : {}}
            whileTap={canGenerate ? { scale: 0.97 } : {}}
            transition={{ type: "spring", stiffness: 380, damping: 20 }}
            className={`w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all ${
              canGenerate
                ? "bg-loom-gold text-loom-ink hover:brightness-110"
                : "bg-white/10 text-loom-cream/25 cursor-not-allowed"
            }`}
          >
            {loading ? "Generating…" : "Step 3 · Generate Fusion"}
          </motion.button>

          {!canGenerate && !loading && (
            <p className="text-[10px] text-loom-cream/25 text-center mt-1.5">
              {!selectedHandloom
                ? "Pick a handloom first"
                : "Pick a silhouette to continue"}
            </p>
          )}
        </div>

      </div>{/* end scrollable body */}
    </aside>
  );
}
