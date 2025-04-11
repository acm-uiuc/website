import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      colors: {
        acmdark: "rgb(var(--rgb-acmdark) / <alpha-value>)",
        primary: "rgb(var(--rgb-primary) / <alpha-value>)",
        secondary: "rgb(var(--rgb-secondary) / <alpha-value>)",
        surface: {
          "000": "rgb(var(--rgb-surface-000) / <alpha-value>)",
          "050": "rgb(var(--rgb-surface-050) / <alpha-value>)",
          "100": "rgb(var(--rgb-surface-100) / <alpha-value>)",
          "150": "rgb(var(--rgb-surface-200) / <alpha-value>)",
          "200": "rgb(var(--rgb-surface-200) / <alpha-value>)",
          "250": "rgb(var(--rgb-surface-200) / <alpha-value>)",
        },
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
  darkMode: "class",
  plugins: [heroui()],
}

