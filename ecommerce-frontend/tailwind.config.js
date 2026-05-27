/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a", // slate-900 (rất sang và thanh lịch)
        primaryHover: "#334155", // slate-700
        secondary: "#f1f5f9", // slate-100 (cho background nhạt)
        accent: "#3b82f6", // blue-500 (điểm nhấn nhẹ nhàng nếu cần)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Font chữ hiện đại, sạch sẽ
      }
    },
  },
  plugins: [],
}