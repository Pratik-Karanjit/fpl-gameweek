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
          bg: "#1F0022",
          surface: "#28002B",
          elevated: "#37003C",
          border: "#54245A",
          cyan: "#0BE6FF",
          sky: "#35B9FB",
          periwinkle: "#6A72F6",
          violet: "#8A49DC",
          royal: "#5F3290",
          mutedBlue: "#406E9E",
          textPrimary: "#FFFFFF",
          textSecondary: "#E9E6EB",
          textMuted: "#A28DA6",
        },
      },
    },
  },
  plugins: [],
};
export default config;
