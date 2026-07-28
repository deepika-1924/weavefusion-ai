"use client";

import { useRef, useState } from "react";

interface PhotoUploadProps {
  onPhotoChange: (dataUrl: string | null) => void;
  photoDataUrl: string | null;
}

export default function PhotoUpload({
  onPhotoChange,
  photoDataUrl,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onPhotoChange((e.target?.result as string) ?? null);
    };
    reader.readAsDataURL(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleClear() {
    onPhotoChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="w-full">
      {photoDataUrl ? (
        <div className="relative group">
          {/* Preview */}
          <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-loom-gold/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoDataUrl}
              alt="Your uploaded photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-loom-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={handleClear}
                className="bg-white/90 text-loom-ink text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
              >
                Remove photo
              </button>
            </div>
          </div>
          <p className="text-[11px] text-loom-gold/80 text-center mt-1.5">
            Virtual try-on enabled
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center gap-2 transition-colors cursor-pointer ${
            dragging
              ? "border-loom-gold bg-loom-gold/10"
              : "border-white/20 hover:border-loom-gold/50 hover:bg-white/5"
          }`}
        >
          <svg
            className="w-7 h-7 text-loom-cream/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span className="text-xs text-loom-cream/60 text-center leading-snug">
            Upload your photo
            <span className="block text-[11px] text-loom-cream/30">
              for virtual try-on (optional)
            </span>
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
