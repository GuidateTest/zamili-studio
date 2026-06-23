import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { studioApiPlugin } from "./src/studio/plugins/studioApiPlugin";

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), studioApiPlugin()],
    root: ".",
    publicDir: "public",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: 3000,
      open: true,
      watch: {
        ignored: [
          "**/.cursor/**",
          "**/data/**",
          "**/out/**",
          "**/*.db",
          "**/ChatGPT Image*",
          "**/node_modules/**",
        ],
      },
    },
    build: {
      outDir: "dist-studio",
      emptyOutDir: true,
    },
    optimizeDeps: {
      include: ["react", "react-dom", "framer-motion", "lucide-react"],
    },
    envPrefix: ["VITE_"],
  };
});
