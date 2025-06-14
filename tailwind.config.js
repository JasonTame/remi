/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        // All colors are automatically handled by CSS variables in Tailwind v4
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        nunito: ["var(--font-nunito)"],
        comfortaa: ["var(--font-comfortaa)"],
      },
      borderRadius: {
        // Border radius is automatically handled by CSS variables in Tailwind v4
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
} 