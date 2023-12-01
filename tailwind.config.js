/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        text: "#010309",
        background: "#f1f1f4",
        primary: "#0736cf",
        secondary: "#c3c8da",
        accent: "#1d1dc3",
        darktext: "#f6f8fe",
        darkbackground: "#050b1f",
        darkprimary: "#305ff8",
        darksecondary: "#252a3c",
        darkaccent: "#3c3ce2",
// #0b0b0e
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
