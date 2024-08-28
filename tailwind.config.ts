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
          "0%": {
            transform: "translateY(0.25vh) scale(1.05)",
            opacity: "0",
            overflow: "hidden",
          },
          "100%": {
            transform: "translateY(0vh) scale(1.0)",
            opacity: "1",
            overflow: "hidden",
          },
        },
        flip : {
          "0%, 100%": {
            transform: "rotateY(0deg)",
          },
          "50%": {
            transform: "rotateY(180deg)",
          },
        },
        swim: {
          "0%, 100": {
            transform: "translateY(0vh) scale(0.5) rotate(0deg)",
            animationTimingFunction: "cubic-bezier(.17,.67,.87,.45)",
          },
          "50%": { transform: "translateY(-15vh) scale(1) rotate(12deg)", 
            animationTimingFunction: "cubic-bezier(.7,.28,.45,.93)",
           },
        },
      },
      colors: {
        "background-color": "#8A58FF",
        "primary-text-color": "#FFFFFF",
        "primary-accent-color": "#360F50",
        "secondary-accent-color": "#FFCD80",
        "hover-color": "#FFED86",
      },
      animation: {
        fadeIn: "fadeIn 0.5s forwards cubic-bezier(.44,0,.68,.96)",
        flip: "flip 3.25s forwards cubic-bezier(0,1.65,.73,.45)",
        swim: "swim 6s infinite forwards",
      },
    },
  },
  plugins: [],
};
export default config;
