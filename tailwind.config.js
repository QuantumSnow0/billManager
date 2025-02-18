/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navyBlue: "#1A237E",
        accentGold: "#FFD700",
        darkGray: "#333333",
        teal: "#008080",
        tealBlue: "#12708a",
        primary: "rgba(18, 112, 138, 0.45)"
      },
      fontFamily:{
        spaceMonoRegular: "SpaceMono-Regular",
        Jersey15Regular: "Jersey15-Regular",
        ABeeZeeRegular: "ABeeZee-Regular",
        InterVariable: "Inter-Variable",
        InterItalic: "Inter-Italic",
      }
    },
  },
  plugins: [],
}