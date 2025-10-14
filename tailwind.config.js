/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Angular scan
  ],
  darkMode: "class", // usamos clase 'dark' en body
  theme: {
    extend: {
      colors: {
        lightBg: "#f5f5f5",
        darkBg: "#1f2937",
        lightText: "#111827",
        darkText: "#f9fafb",
      },
    },
  },
  plugins: [],
};
