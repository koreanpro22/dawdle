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
        rain: {
          "0%": {
            opacity: "100%",
            transform: "translateY(0%) rotate(0deg)",
          },
          "100%": {
            opacity: "100%",
            transform: "translateY(1500%) rotate(360deg)",
          },
        },
        scaleIn: {
          "0%": { transform: "translateY(-25%) scale(0.5)", opacity: "0" },
          "100%": { transform: "translateY(0%) scale(1)", opacity: "1" },
        },
        scaleOut: {
          "0%": { transform: "translateY(0%) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-25%) scale(0)", opacity: "0" },
        },
        slideDown: {
          "0%": {
            transform: "translateY(-100%)",
          },
          "100%": {
            transform: "translateY(0%)",
          },
        },
        slideUp: {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0%)",
          },
        },
        slideUpOut: {
          "0%": {
            transform: "translateY(0%)",
          },
          "100%": {
            transform: "translateY(-100%)",
          },
        },
        slideOut: {
          "0%": {
            transform: "translateY(0%)",
          },
          "100%": {
            transform: "translateY(100%)",
          },
        },
        fadeUpMin: {
          "0%": {
            transform: "translateY(25%)",
            opacity: "0.251",
          },
          "100%": {
            transform: "translateY(0%)",
            opacity: "1",
          },
        },
        fadeUp: {
          "0%": {
            transform: "translateY(5dvh)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0dvh)",
            opacity: "1",
          },
        },
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
        fadeOut: {
          "0%": {
            transform: "translateY(0vh) scale(1.0)",
            opacity: "1",
            overflow: "hidden",
          },
          "100%": {
            transform: "translateY(0.25vh) scale(1.05)",
            opacity: "0",
            overflow: "hidden",
          },
        },
        flip: {
          "0%, 100%": {
            transform: "rotateY(0deg)",
          },
          "50%": {
            transform: "rotateY(180deg)",
          },
        },
        rotate: {
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
          "50%": {
            transform: "translateY(-15vh) scale(1) rotate(12deg)",
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
        rain: "rain 1s cubic-bezier(.23,0,.77,.95) forwards",
        scaleIn: "scaleIn 0.5s forwards cubic-bezier(.21,.76,.68,1)",
        scaleOut: "scaleOut 0.5s forwards cubic-bezier(.21,.76,.68,1)",
        slideDown: "slideDown 0.5s forwards cubic-bezier(1,.37,.39,1)",
        slideUp: "slideUp 0.5s forwards cubic-bezier(1,.37,.39,1)",
        slideOut: "slideOut 0.5s forwards cubic-bezier(1,.37,.39,1)",
        slideUpOut: "slideUpOut 0.5s forwards cubic-bezier(1,.37,.39,1)",
        fadeUpMin: "fadeUpMin 0.5s forwards cubic-bezier(.17,.67,.55,1.13)",
        fadeUp: "fadeUp 0.5s forwards cubic-bezier(.17,.67,.55,1.13)",
        fadeIn: "fadeIn 0.5s forwards cubic-bezier(.44,0,.68,.96)",
        fadeOut: "fadeOut 0.5s forwards cubic-bezier(.44,0,.68,.96)",
        flip: "flip 3.25s forwards cubic-bezier(0,1.65,.73,.45)",
        rotate: "rotate 3.25s forwards cubic-bezier(0,1.65,.73,.45)",
        swim: "swim 6s infinite forwards",
      },
    },
  },
  plugins: [],
};
export default config;
