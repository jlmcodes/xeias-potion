/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- Make sure this line is here
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}