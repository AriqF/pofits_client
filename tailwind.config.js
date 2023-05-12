/** @type {import('tailwindcss').Config} */
const { join } = require('path');
module.exports = {
  content: [
    join(__dirname, './src/pages/**/*.{ts,tsx}'),
    join(__dirname, './src/components/**/*.{ts,tsx}'),
    // join(__dirname, './node_modules/flowbite-react/**/*.js'),
    join(__dirname, './src/public/**/*.html'),
    join(__dirname, "./node_modules/flowbite/**/*.js"),
    "./node_modules/flowbite/**/*.js",
  ],
  plugins: [
    require("flowbite/plugin"),
  ],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        white: "#FFFFFF",
        hovwhite: "#f2f2f2",
        whitegrey: "#F8F8F8",
        white2 : "#F6F7FC",
        mute: "#8F8F8F",
        quarterdark: "#0d0d0d",
        dark: "#1a1a1a",
        darkHover:"#333333",
        darktext: "#334155",
        blue: "#4d6dcb",
        lightblue: "#b0d8ff",
        hovblue: "#395cc6",
        palepurple: "#8c4dcb",
        hovpalepurple: "#7f39c6",
        hovoutpurple: "#f2ebfa",
        lighterpurple: "#b288dd",
        hovlighterpurple: "#a674d8",
        darkpurple: "#8c4dcb",
        hovdarkpurple: "#7334b2",
        errorRed: "#cb1a52",
        hovErrorRed: "#b51749",
        warnOrange: "#FF5630",
        hovWarnOrange: "#e62a00",
        successGreen: "#2abb81",
        hovSuccessGreen: "#26a673",
        infoBlue: "#4a7dcf",
        hovInfoBlue: "#366ec9",
        moneySafe: "#1ac1c7",
        moneyDanger: "#c74238",
        moneyWarn: "#e2be1d"
      },
    },
  },
};