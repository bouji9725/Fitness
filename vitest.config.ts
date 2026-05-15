import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@frontend": path.resolve(__dirname, "./src/frontend"),
      "@backend": path.resolve(__dirname, "./src/backend"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@": path.resolve(__dirname, "."),
    },
  },
});
