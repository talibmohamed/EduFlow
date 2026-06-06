import { heroui } from "@heroui/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    // HeroUI 2.x packages are split — scan all @heroui/* dist folders
    // so Modal/Popover/Drawer slot classes are picked up.
    "./node_modules/@heroui/**/dist/**/*.{js,ts,jsx,tsx,mjs}",
  ],
  theme: {
    extend: {
      colors: {
        edublue: '#2563EB',
        edugreen: '#16A34A',
        eduyellow: '#FACC15',
        edusoft: '#F3F4F6',
        eduink: '#1F2937',
        // EduFlow landing design tokens (oklch via channel vars so /opacity works).
        linen: 'oklch(var(--linen-c) / <alpha-value>)',
        clay: 'oklch(var(--clay-c) / <alpha-value>)',
        ink: 'oklch(var(--ink-c) / <alpha-value>)',
        sky: 'oklch(var(--sky-c) / <alpha-value>)',
        meadow: 'oklch(var(--meadow-c) / <alpha-value>)',
        honey: 'oklch(var(--honey-c) / <alpha-value>)',
        card: {
          DEFAULT: 'oklch(var(--card-c) / <alpha-value>)',
          foreground: 'oklch(var(--ink-c) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--clay-c) / <alpha-value>)',
          foreground: 'oklch(var(--mutfg-c) / <alpha-value>)',
        },
        border: 'oklch(var(--border-c) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['General Sans', 'Söhne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: { DEFAULT: '#2563EB', foreground: '#FFFFFF' },
            success: { DEFAULT: '#16A34A', foreground: '#FFFFFF' },
            warning: { DEFAULT: '#FACC15', foreground: '#1F2937' },
          },
        },
      },
    }),
  ],
};
