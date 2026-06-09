import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0a0a0f",
        surface: "#111118",
        card: "#16161f",
        border: "#1e1e2e",
        muted: "#2a2a3a",
        violet: {
          dim: "#3d3566",
          mid: "#6d5fd4",
          bright: "#8b7ff0",
          glow: "#a99ff5",
        },
        spectral: {
          dim: "#0d3340",
          mid: "#1a7a9a",
          bright: "#22c5e8",
        },
        signal: "#c8b4f8",
        ghost: "#8888aa",
        whisper: "#555570",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        serif: ["var(--font-serif)"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
export default config;
