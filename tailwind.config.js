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
        whitegrey: "#F8F8F8",
        white2 : "#F6F7FC",
        mute: "#8F8F8F",
        dark: "#1a1a1a",
        darktext: "#334155",
        blue: "#4d6dcb",
        hovblue: "#395cc6",
        palepurple: "#8c4dcb",
        hovpalepurple: "#7f39c6",
        darkpurple: "#8c4dcb",
        hovdarkpurple: "#7334b2",
        errorRed: "#cb1a52",
        warnYellow: "#e3d61c",
        successGreen: "#2abb81",
        infoBlue: "#4a7dcf",
      },
    },
  },
  plugins: [],
};