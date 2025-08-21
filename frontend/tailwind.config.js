/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#008C5A",        // ChefMate green from logo
        secondary: "#F9F6F0",      // Light cream background
        accent: "#005734",         // Darker green for hover/CTA
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // optional
      },
    },
  },
  plugins: [],
};
