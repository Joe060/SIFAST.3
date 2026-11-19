import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F0F5FA",
          100: "#E1EBF5",
          200: "#C4D8EC",
          300: "#96BCDE",
          400: "#609BCB",
          500: "#387EB4",
          600: "#276497",
          700: "#1E4F7A",
          800: "#1A4367",
          900: "#0F294A",
          950: "#08172C",
        },
        surface: {
          light: "#F8FAFC",
          dark: "#111827",
        },
        border: {
          light: "#E2E8F0",
          dark: "#1E293B",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
