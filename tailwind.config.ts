import type { Config } from "tailwindcss";
//import daisyui from "daisyui";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./_Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        helvetica: ["Helvetica", "Arial", "sans-serif"], // Add Helvetica
        serif: ["ui-serif", "Georgia"],
        mono: ["ui-monospace", "SFMono-Regular"],
        display: ["Oswald"],
        body: ['"Open Sans"'],
      },
      animation: {
        "infinite-scroll": "infinite-scroll 125s linear infinite",
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "openbox-green": "#bcd727",
        "hover-obgreen": "#819417",
        white: "#ffffff",
        gray_og: "#d4d4d4",
        "hover-gray": "#a1a1aa",
        background_gray: "#f6f6f6",
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      fontSize: {
        xxs: ".65rem",
        xxl: "1.75rem",
        "3.5xl": "2rem",
      },
      zIndex: {
        "0": "0",
        "10": "10",
        "20": "20",
        "30": "30",
        "40": "40",
        "50": "50",
        "60": "60", // custom value
        "70": "70", // custom value
        "80": "80", // custom value
        "90": "90", // custom value
        "100": "100", // custom value
        auto: "auto",
      },
      width: {
        "4.5": "1.125rem", // Custom width, example
        "18": "4.5rem", // Equivalent to 72px
        "100": "25rem", // Custom width
        "110": "27.5rem", // Custom width
        "120": "30rem", // Custom width
        "128": "32rem", // Custom width
        "160": "40rem", // Custom width
        "1/7": "14.2857143%", // Custom fraction width
        "2/7": "28.5714286%", // Custom fraction width
      },

      height: {
        "4.5": "1.125rem", // Custom width, example
        "18": "4.5rem", // Equivalent to 72px
        "20": "10rem",
        "25": "12rem",
        "100": "25rem",
        "105": "25.5rem", // Custom width
        "110": "27.5rem", // Custom width
        "120": "30rem", // Custom width
        "128": "32rem", // Custom width
        "160": "40rem", // Custom width
        "1/7": "14.2857143%", // Custom fraction width
        "2/7": "28.5714286%", // Custom fraction width
      },
    },
  },

  //plugins: [daisyui],
};
export default config;
