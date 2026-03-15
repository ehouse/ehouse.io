import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  appType: "spa",
  build: {
    target: "es2020",
  },
});
