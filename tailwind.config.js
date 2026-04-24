/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Match the MapCanvas background so surrounding chrome blends in.
        bg: {
          base:  '#0a0e12',
          panel: '#111820',
          alt:   '#182230',
        },
      },
    },
  },
  plugins: [],
};
