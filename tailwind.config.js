/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@spartan-ng/ui-core/hlm-tailwind-preset")],
  darkMode: "selector",
  content: ["./src/**/*.{html,ts}", "./libs/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
      },
    },
  },
  plugins: [],
};
