/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1d1d1f",       // primary text — near-black, not pure black
        muted: "#86868b",      // secondary text
        canvas: "#ffffff",     // main background
        canvasAlt: "#f5f5f7",  // alternating section background
        border: "#d2d2d7",     // hairline dividers
        brand: "#0071e3",      // single accent — used sparingly
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: { card: "0 1px 3px rgba(0,0,0,0.04)" },
    },
  },
  plugins: [],
};
