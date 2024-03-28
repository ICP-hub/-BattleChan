/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "green-gradient": "url('/src/images/dashboard_bg.png')",
      },
      fontFamily: {
        istok: ["istok", "sans-serif"],
      },
    },
    colors: {
      dark: "#000",
      light: "#fff",
      red: "#FF4343",
      green: "#3A6841",
      grey: "#9a9a9a",
      "dark-green": "#0C150D",
      "dirty-light-green": "#345D3A",
      "light-green": "#18AF00",
      transparent: "#00000000",
    },
    screens: {
      tablet: "700px",
      laptop: "1000px",
      xl: "1280px",
    },
  },
  plugins: [],
  darkMode: "class",
};
