import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        acmdark: 'rgb(var(--rgb-acmdark) / <alpha-value>)',
        surface: {
          '000': 'rgb(var(--rgb-surface-000) / <alpha-value>)',
          '050': 'rgb(var(--rgb-surface-050) / <alpha-value>)',
          100: 'rgb(var(--rgb-surface-100) / <alpha-value>)',
          150: 'rgb(var(--rgb-surface-200) / <alpha-value>)',
          200: 'rgb(var(--rgb-surface-200) / <alpha-value>)',
          250: 'rgb(var(--rgb-surface-200) / <alpha-value>)',
        },
        'primary': {
          DEFAULT: '#00397a',
          100: '#000b18',
          200: '#001731',
          300: '#002249',
          400: '#002e62',
          500: '#00397a',
          600: '#005dc8',
          700: '#1683ff',
          800: '#64acff',
          900: '#b1d6ff'
        },
        'secondary': {
          DEFAULT: '#83a8ec',
          100: '#0a1d40',
          200: '#14397f',
          300: '#1e56bf',
          400: '#447be2',
          500: '#83a8ec',
          600: '#9cb9f0',
          700: '#b5cbf3',
          800: '#cedcf7',
          900: '#e6eefb'
        },
        'atomic_tangerine': {
          DEFAULT: '#ea9571',
          100: '#3c1809',
          200: '#793112',
          300: '#b5491b',
          400: '#e16835',
          500: '#ea9571',
          600: '#eeaa8d',
          700: '#f2c0aa',
          800: '#f7d5c6',
          900: '#fbeae3'
        },
        'cambridge_blue': {
          DEFAULT: '#8cba9b',
          100: '#18291e',
          200: '#31523c',
          300: '#497a5a',
          400: '#63a278',
          500: '#8cba9b',
          600: '#a3c8af',
          700: '#bad6c3',
          800: '#d1e3d7',
          900: '#e8f1eb'
        },
        'blush': {
          DEFAULT: '#c9697f',
          100: '#2d1017',
          200: '#5a202e',
          300: '#873145',
          400: '#b4415c',
          500: '#c9697f',
          600: '#d48799',
          700: '#dfa5b2',
          800: '#e9c3cc',
          900: '#f4e1e5'
        }
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [heroui()],
  darkMode: 'class',
};
