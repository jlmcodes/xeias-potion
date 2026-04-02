/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Critical for your dark mode toggle to work
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}