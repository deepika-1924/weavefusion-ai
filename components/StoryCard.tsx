"use client";

import { motion } from "framer-motion";

interface StoryCardProps {
  story: string | null;
  ecoNote: string | null;
  source: "watsonx" | "fallback" | null;
  handloomName: string | null;
  waterSavedLiters: number | null;
  comparedTo: string | null;
  bestFor: string[] | null;
  occasions: string[] | null;
  stylingTip: string | null;
  loading: boolean;
}

export default function StoryCard({
  story,
  ecoNote,
  source,
  handloomName,
  waterSavedLiters,
  comparedTo,
  bestFor,
  occasions,
  stylingTip,
  loading,
}: StoryCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 h-full flex flex-col gap-4 animate-pulse">
        <div className="h-5 bg-loom-cream rounded w-2/3" />
        <div className="space-y-2">
          <div className="h-3 bg-loom-cream rounded w-full" />
          <div className="h-3 bg-loom-cream rounded w-5/6" />
          <div className="h-3 bg-loom-cream rounded w-4/6" />
        </div>
        <div className="mt-4 h-4 bg-loom-cream rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-3 bg-loom-cream rounded w-full" />
          <div className="h-3 bg-loom-cream rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 h-full flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-loom-cream flex items-center justify-center">
          <svg
            className="w-6 h-6 text-loom-rust"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>
        <p className="text-sm text-[#57606a] font-medium">
          Heritage story will appear here
        </p>
        <p className="text-xs text-[#57606a]/60">
          Select a handloom and silhouette, then click Generate Fusion
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-[#e5e7eb] p-6 flex flex-col gap-6 overflow-y-auto"
    >
      {/* Heritage Story */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#57606a]">
            Heritage Story
          </h3>
          {source && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                source === "watsonx"
                  ? "bg-loom-gold/20 text-loom-gold"
                  : "bg-loom-cream text-[#57606a]"
              }`}
            >
              {source === "watsonx" ? "IBM Granite" : "Built-in"}
            </motion.span>
          )}
        </div>
        <p className="text-sm text-[#1f2328] leading-relaxed">{story}</p>
      </motion.section>

      {/* Eco Scorecard */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.18 }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#57606a] mb-3">
          Sustainability Scorecard
        </h3>

        {waterSavedLiters !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.28 }}
            className="bg-loom-cream rounded-xl px-4 py-3 mb-3"
          >
            <p className="text-[11px] text-[#57606a] uppercase tracking-wide font-semibold mb-1">
              Water Saved
            </p>
            <p className="text-2xl font-bold text-loom-rust">
              {waterSavedLiters.toLocaleString()}
              <span className="text-sm font-normal text-[#57606a] ml-1">
                liters
              </span>
            </p>
            {comparedTo && (
              <p className="text-xs text-[#57606a]/70 mt-1">
                vs. {comparedTo}
              </p>
            )}
          </motion.div>
        )}

        {ecoNote && (
          <p className="text-sm text-[#1f2328] leading-relaxed border-l-2 border-loom-rust pl-3 italic">
            {ecoNote}
          </p>
        )}
      </motion.section>

      {bestFor && bestFor.length > 0 && (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#57606a] mb-3">Style Recommendations</h3>
          <div className="mb-3">
            <p className="text-[11px] text-[#57606a] uppercase tracking-wide font-semibold mb-1.5">Best for</p>
            <div className="flex flex-wrap gap-1.5">
              {bestFor.map((item) => (
                <span key={item} className="text-xs px-2.5 py-1 rounded-full bg-loom-cream text-[#57606a] border border-[#e5e7eb]">
                  {item}
                </span>
              ))}
            </div>
          </div>
          {occasions && occasions.length > 0 && (
            <div className="mb-3">
              <p className="text-[11px] text-[#57606a] uppercase tracking-wide font-semibold mb-1.5">Best occasions</p>
              <div className="flex flex-wrap gap-1.5">
                {occasions.map((item) => (
                  <span key={item} className="text-xs px-2.5 py-1 rounded-full bg-loom-gold/10 text-loom-gold border border-loom-gold/30">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {stylingTip && (
            <p className="text-sm text-[#1f2328] leading-relaxed border-l-2 border-loom-rust pl-3 italic">
              {stylingTip}
            </p>
          )}
        </div>
      )}

      {handloomName && (
        <p className="text-[11px] text-[#57606a]/50 border-t border-[#e5e7eb] pt-3">
          Fabric: {handloomName}
        </p>
      )}
    </motion.div>
  );
}
