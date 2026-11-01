import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        fpl: {
          purple: "#37003c",
          darkPurple: "#240027",
          deepPurple: "#160018",
          green: "#00ff87",
          greenHover: "#02df75",
          cyan: "#04f5ff",
          magenta: "#e90052",
          card: "#1e1427",
          cardBorder: "#342243",
          surface: "#120a17",
        },
      },
    },
  },
  plugins: [],
};
export default config;

