import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        lg: "4rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        black: {
          DEFAULT: "#000000",
          90: "rgba(0, 0, 0, 0.9)",
          70: "rgba(0, 0, 0, 0.7)",
          50: "rgba(0, 0, 0, 0.5)",
          30: "rgba(0, 0, 0, 0.3)",
          10: "rgba(0, 0, 0, 0.1)",
          5: "rgba(0, 0, 0, 0.05)",
        },
        white: {
          DEFAULT: "#FFFFFF",
          90: "rgba(255, 255, 255, 0.9)",
          70: "rgba(255, 255, 255, 0.7)",
          50: "rgba(255, 255, 255, 0.5)",
          30: "rgba(255, 255, 255, 0.3)",
          10: "rgba(255, 255, 255, 0.1)",
        },
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      spacing: {
        xs: "0.5rem",    // 8px
        sm: "1rem",      // 16px
        md: "2rem",      // 32px
        lg: "4rem",      // 64px
        xl: "6rem",      // 96px
        "2xl": "8rem",   // 128px
        "3xl": "12rem",  // 192px
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.19, 1, 0.22, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      boxShadow: {
        "luxury-sm": "0 2px 8px rgba(0, 0, 0, 0.04)",
        "luxury-md": "0 4px 16px rgba(0, 0, 0, 0.06)",
        "luxury-lg": "0 8px 32px rgba(0, 0, 0, 0.08)",
        "luxury-xl": "0 16px 48px rgba(0, 0, 0, 0.12)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.6s cubic-bezier(0.19, 1, 0.22, 1)",
        fadeInUp: "fadeInUp 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
        slideIn: "slideIn 0.5s cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
