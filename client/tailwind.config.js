import { heroui } from "@heroui/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        edublue: '#2563EB',
        edugreen: '#16A34A',
        eduyellow: '#FACC15',
        edusoft: '#F3F4F6',
        eduink: '#1F2937',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
