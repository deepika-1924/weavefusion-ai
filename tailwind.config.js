/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Color palette ────────────────────────────────────────────────────
      colors: {
        loom: {
          // Dark neutral — deep charcoal (replaces old "ink")
          ink:     "#1B1B1B",
          // Light background — ivory (replaces old "cream")
          cream:   "#F8F6F1",
          // Accent warm — rust (unchanged)
          rust:    "#b6502f",
          // Accent metallic — royal gold (updated from #c8963e)
          gold:    "#C9A227",
          // New accent — maroon
          maroon:  "#7B1E3D",
          // New accent — emerald
          emerald: "#0B6E4F",
        },
      },
      // ── Font families ────────────────────────────────────────────────────
      // CSS variables injected by next/font/google in layout.tsx:
      //   --font-playfair    → Playfair Display (display / hero headings)
      //   --font-cormorant   → Cormorant Garamond (secondary headings)
      //   --font-inter       → Inter (body — already the Next.js default)
      fontFamily: {
        display:   ["var(--font-playfair)", "Georgia", "serif"],
        heading:   ["var(--font-cormorant)", "Georgia", "serif"],
        sans:      ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
