"use client";

import Image from "next/image";

interface OutfitCanvasProps {
  imageUrl: string | null;
  loading: boolean;
  handloomName: string | null;
  styleName: string | null;
  tryOnApplied: boolean;
}

export default function OutfitCanvas({
  imageUrl,
  loading,
  handloomName,
  styleName,
  tryOnApplied,
}: OutfitCanvasProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden flex flex-col">
      {/* 3:4 aspect ratio container */}
      <div className="relative w-full" style={{ paddingBottom: "133.33%" }}>
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-loom-cream gap-5">
            {/* Loom weaving animation */}
            <div className="flex flex-col items-center gap-3">
              {/* Warp threads */}
              <div className="flex gap-1.5 items-end h-10">
                {[6, 10, 8, 12, 7, 11, 9].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-loom-rust/70 rounded-full animate-pulse"
                    style={{
                      height: `${h * 3}px`,
                      animationDelay: `${i * 100}ms`,
                      animationDuration: "1s",
                    }}
                  />
                ))}
              </div>
              {/* Shuttle line */}
              <div className="w-24 h-1 rounded-full bg-loom-gold/40 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full w-6 bg-loom-gold rounded-full animate-bounce"
                  style={{ animationDuration: "700ms" }}
                />
              </div>
            </div>
            <p className="text-sm font-medium text-[#57606a]">
              Weaving your outfit…
            </p>
            <p className="text-xs text-[#57606a]/60 text-center px-6">
              {handloomName ?? "Fabric"} × {styleName ?? "Style"}
            </p>
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${handloomName ?? "Handloom"} × ${styleName ?? "Style"} fusion outfit`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-loom-cream gap-4">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-loom-cream flex items-center justify-center">
              <svg
                className="w-8 h-8 text-loom-rust/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 19.5h16.5M3 7.5h18M3 12h18"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-[#57606a]">
              Outfit canvas is empty
            </p>
            <p className="text-xs text-[#57606a]/60 text-center px-8">
              Your AI-generated fusion look will appear here after you click
              Generate Fusion
            </p>
          </div>
        )}

        {/* Try-on badge (top-right corner) */}
        {imageUrl && !loading && (
          <div className="absolute top-3 right-3">
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm ${
                tryOnApplied
                  ? "bg-loom-rust text-white"
                  : "bg-loom-ink/80 text-loom-cream/80"
              }`}
            >
              {tryOnApplied ? "Virtual Try-On" : "Garment Preview"}
            </span>
          </div>
        )}
      </div>

      {/* Caption bar */}
      {imageUrl && !loading && (
        <div className="px-4 py-3 bg-loom-ink flex items-center justify-between">
          <p className="text-xs text-loom-cream/80 leading-snug">
            <span className="text-loom-gold font-semibold">{handloomName}</span>
            {styleName && (
              <>
                {" "}
                &times;{" "}
                <span className="text-loom-cream/60">{styleName}</span>
              </>
            )}
          </p>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-loom-cream/50 hover:text-loom-gold transition-colors"
          >
            Open full ↗
          </a>
        </div>
      )}
    </div>
  );
}
