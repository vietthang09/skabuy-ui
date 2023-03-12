/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary': '#17a2b8',
      },
    },
    screens: {
      'mobile': '576px',
      'tablet': '768px',
      'laptop': '992px',
      'desktop': '1200px'
    },
  },
  plugins: [],
}
