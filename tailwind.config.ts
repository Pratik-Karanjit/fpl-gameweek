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
          primary: "#FFFFFF",
          bg: "#F8F9FA",
          surface: "#FFFFFF",
          elevated: "#F3E8F5",
          theme: "#37003C",
          themeHover: "#4D0054",
          themeDark: "#240027",
          themeLight: "#5F3290",
          themeMuted: "#8A49DC",
          border: "#E5E7EB",
          borderTheme: "#D8C5DF",
          cyan: "#00BDD6",
          cyanHover: "#0BE6FF",
          sky: "#0284C7",
          green: "#00A859",
          greenLight: "#E6F9F0",
          magenta: "#E90052",
          textPrimary: "#111827",
          textSecondary: "#4B5563",
          textMuted: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};
export default config;
