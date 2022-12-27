/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        parkspace: "url('/src/assets/images/bg_space.svg')"
      },
    },
  },
  plugins: [],
}
