export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts,jsx,tsx}", // Keep shared components
    "!../shared/node_modules/**/*",  // Exclude node_modules in shared
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}