import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        radar: {
          bg: "#0b0f1a",
          surface: "#111827",
          card: "#1a2236",
          border: "#1e293b",
          accent: "#3b82f6",
          "accent-light": "#60a5fa",
          green: "#22c55e",
          red: "#ef4444",
          amber: "#f59e0b",
          muted: "#64748b",
          text: "#e2e8f0",
          "text-secondary": "#94a3b8",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
