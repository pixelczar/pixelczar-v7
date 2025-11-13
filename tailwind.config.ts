import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["Lust", "Lust Display", "lust-display", "var(--font-serif)"],
      },
      fontSize: {
        display: ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        hero: ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        headline: ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        title: ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
        subtitle: ["clamp(1.25rem, 2.5vw, 1.5rem)", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        "body-large": ["1.125rem", { lineHeight: "1.55", letterSpacing: "-0.008em" }],
        body: ["1rem", { lineHeight: "1.6", letterSpacing: "-0.011em" }],
        "body-small": ["0.875rem", { lineHeight: "1.5", letterSpacing: "-0.006em" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
      },
      letterSpacing: {
        tighter: "-0.03em",
        tight: "-0.025em",
        snug: "-0.015em",
        normal: "-0.011em",
        wide: "0.01em",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
