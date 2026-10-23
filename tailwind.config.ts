import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { brand: { 50: "#F0F8FF", 100: "#D9ECFF", 500: "#4A90E2", 600: "#347BCB", 700: "#245F9F" }, ink: "#243447", line: "#DCE8F2" }, boxShadow: { soft: "0 10px 35px rgba(54, 115, 168, 0.08)" } } },
  plugins: []
};
export default config;
