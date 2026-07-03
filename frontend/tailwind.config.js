/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d9488',
          hover: '#0f766e',
          light: '#ccfbf1',
        },
        secondary: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
        },
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          light: '#94a3b8',
        },
        surface: {
          DEFAULT: '#ffffff',
          glass: 'rgba(255, 255, 255, 0.8)',
          bg: '#f8fafc',
        },
        border: '#e2e8f0',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '16px',
        'lg': '28px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.05)',
        'md': '0 10px 15px -3px rgba(13, 148, 136, 0.05), 0 4px 6px -2px rgba(0,0,0,0.02)',
        'lg': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
        'glow': '0 0 20px rgba(13, 148, 136, 0.15)',
      }
    },
  },
  plugins: [],
}
