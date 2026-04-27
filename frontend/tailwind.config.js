/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        axon: {
          blue: '#1A283E',
          black: '#0D1A29',
          white: '#F6F7F6',
          gray: '#0F1B2B',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        title: ['Raleway', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
