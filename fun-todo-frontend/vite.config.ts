import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["5989-2a02-ce0-1802-88e4-814-1998-5335-5eae.ngrok-free.app"],
  },
});
