const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background-light)",
          dark: "var(--background-dark)",
        },
        foreground: {
          DEFAULT: "var(--foreground-light)",
          dark: "var(--foreground-dark)",
        },
        primary: {
          DEFAULT: "#2563eb",
          dark: "#3b82f6",
        },
      },
    },
  },
  plugins: [],
};
export default config;
