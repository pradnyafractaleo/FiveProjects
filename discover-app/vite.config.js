import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Builds into ../discover, which GitHub Pages serves from the main branch.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "../discover",
    emptyOutDir: true,
    rollupOptions: { input: { index: "index.html", admin: "admin.html", about: "about.html" } },
  },
});
