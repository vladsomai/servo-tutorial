/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/*.tsx","./components/*.tsx"],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["night"],
  },
}
