import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteCommonjs()],
  server: {
    port: 5173, // Altere para 5173 ou qualquer outra porta disponível
    /* proxy: {
    '/api': {
        target: 'http://217.196.61.218:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
    },
    }, */
  },
});
