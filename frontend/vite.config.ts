/// <reference types="vitest/config" />

import path from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true
    }),
    react()
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src")
    }
  },
  test: {
    globals: true,
    environment: "node"
  },
  server: {
    proxy: {
      "/api": "http://localhost:8080",
      "/oauth2": "http://localhost:4000"
    }
  }
});
