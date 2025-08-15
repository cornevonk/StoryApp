/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0027FF',
          emerald: '#03FFB2',
          midnight: '#00132B',
        },
        accent: {
          orange: '#F97316',
          red: '#DC2626', 
          yellow: '#FACC15',
          green: '#22C55E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}