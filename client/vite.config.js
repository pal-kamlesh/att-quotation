import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  server: {
    port: 3000,
    https: {
      key: fs.readFileSync("localhost-key.pem"),
      cert: fs.readFileSync("localhost-cert.pem"),
    },
    proxy: {
      "/api/": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
    host: true, // Allow access from your local network
  },
  plugins: [react()],
});
