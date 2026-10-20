import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./messages/**/*.{json,js,ts}"],
  theme: {
    extend: {
      colors: {
        "blc-green-900": "#023830",
        "blc-green-700": "#334e3d",
        "blc-cream-100": "#f2e1d1",
        "blc-sand-200": "#e3dacb",
        "blc-gold-300": "#e5c690",
        "blc-gold-500": "#b57f1b",
        "blc-yellow-400": "#f9d549",
      },
      fontFamily: {
        ar: ["var(--font-body)"],
        en: ["var(--font-body)"],
        sans: ["var(--font-body)"],
      },
      borderRadius: { card: "16px" },
      boxShadow: { soft: "0 8px 24px rgb(2 56 48 / 0.08)" },
    },
  },
  plugins: [],
};

export default config;
