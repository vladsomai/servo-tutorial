/**
 * @type {import('tailwindcss').Config}
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [
    "./pages/*.tsx",
    "./pages/tutorial/*.tsx",
    "./components/*.tsx",
    "./components/ImplementedCommands/*.tsx",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        night: {
          ...require("daisyui/src/colors/themes")["[data-theme=night]"],
        },
      },
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
        },
      },
    ],
  },
};
