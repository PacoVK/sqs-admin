import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  base: process.env.GITHUB_PAGES ? "/sqs-admin/" : "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        // 1. Improved build splitting with hashing for better caching
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
        // 3. Optimize build splitting for better performance
        manualChunks: {
          vendor: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
          mui: ["@mui/material", "@mui/icons-material"],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  // 2. Updated environment variable handling to use Vite's approach
  define: {
    "import.meta.env.REACT_APP_VERSION": JSON.stringify(
      process.env.NODE_ENV === "production" ? "v0.8.1" : "development",
    ),
  },
});
