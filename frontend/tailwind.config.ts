import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"]
      },
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          light: "#eff6ff"
        },
        secondary: {
          DEFAULT: "#64748b",
          dark: "#1e293b"
        }
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover": "0 10px 25px -5px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)"
      }
    }
  },
  plugins: []
} satisfies Config;
