/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        loom: {
          ink: "#1c1410",
          rust: "#b6502f",
          gold: "#c8963e",
          cream: "#f4ecdd",
        },
      },
    },
  },
  plugins: [],
};
