import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        darkBg: "#060907",
        panelBg: "#0b120e",
        emeraldGlow: "#059669",
        fireRed: "#ef4444",
        alertOrange: "#f97316",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fire-glow": "fireGlow 1.5s infinite alternate",
        "radar-sweep": "radar 4s linear infinite",
      },
      keyframes: {
        fireGlow: {
          "0%": { boxShadow: "0 0 15px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(239, 68, 68, 0.2)" },
          "100%": { boxShadow: "0 0 35px rgba(239, 68, 68, 0.9), inset 0 0 20px rgba(239, 68, 68, 0.5)" },
        },
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
