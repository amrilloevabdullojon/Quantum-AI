import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slateDeep: "#0F172A",
        surface: "#F8FAFC",
        navy: "#1E3A8A",
        emeraldStrict: "#059669",
        crimson: "#B91C1C",
        borderSoft: "#E2E8F0"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "SFMono-Regular", "Consolas", "monospace"]
      }
    }
  },
  plugins: []
} satisfies Config;
