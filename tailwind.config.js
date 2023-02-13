/** @type {import('tailwindcss').Config} */
const { join } = require('path');
module.exports = {
  content: [
    join(__dirname, './src/pages/**/*.{ts,tsx}'),
    join(__dirname, './src/components/**/*.{ts,tsx}'),
    join(__dirname, './src/node_modules/flowbite-react/**/*.js'),
    join(__dirname, './src/public/**/*.html'),
  ],
  plugins: [
    require("flowbite/plugin")
  ],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        white: "#FFFFFF",
        white1: "#FAFBFC",
        white2 : "#F6F7FC",
        mute: "#8F8F8F",
        dark: "#1a1a1a",
        darkText: "#334155",
        blue: "#0072f5",
        hoverBlue: "#006be6",
      },
    },
  },
  plugins: [],
};