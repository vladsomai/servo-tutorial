/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/*.tsx","./components/*.tsx"],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"),require("daisyui")],
  daisyui: {
    themes: ["night","winter"],
  },
}
