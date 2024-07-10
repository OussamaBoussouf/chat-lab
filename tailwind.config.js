/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "light-navy": "#3e3c62",
        "dark-navy": "#2f2c53",
        "light-blue": "#5f5b8f"
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

