/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563EB", // Primary
          dark: "#1D4ED8",    // Primary (pressed/hover state)
          navy: "#1E3A8A",    // Dark
          light: "#EFF6FF",   // Light
        },
        surface: "#F8FAFC",   // Background
        ink: "#0F172A",       // Text
        success: "#16A34A",
        danger: "#DC2626",
      },
    },
  },
  plugins: [],
};
