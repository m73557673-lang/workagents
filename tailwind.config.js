/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 6px -1px rgba(0,0,0,0.04)',
        'elevated': '0 10px 30px -8px rgba(0,0,0,0.12), 0 4px 12px -4px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
