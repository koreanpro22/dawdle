import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { transform: "translateY(0.25vh) scale(1.05)", opacity: "0", overflow: 'hidden', },
          "100%": { transform: "translateY(0vh) scale(1.0)", opacity: "1", overflow: 'hidden', },
        },
      },
      colors: {
        'background-color': '#8A58FF',
        'primary-text-color': '#FFFFFF',
        'primary-accent-color': '#360F50',
        'secondary-accent-color': "#FFCD80",
        'hover-color': "#FFED86",
      },
      animation: {
        fadeIn: "fadeIn 0.5s forwards cubic-bezier(.44,0,.68,.96)",
      },
    },
  },
  plugins: [],
};
export default config;
