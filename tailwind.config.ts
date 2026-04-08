import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui"],
      },

      fontSize: {
        // Headings
        "heading-xl": ["2rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        "heading-lg": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
        "heading-md": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],

        // Body
        body: ["1rem", { lineHeight: "1.5rem" }],
        "body-sm": ["0.875rem", { lineHeight: "1.25rem" }],

        // Labels
        label: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500" }],
      },

      colors: {
        primary: "#495E57",
        accent: "#F4CE14",
      },

      borderRadius: {
        xl: "16px", // matches your UI kit
      },
    },
  },
  plugins: [],
};

export default config;