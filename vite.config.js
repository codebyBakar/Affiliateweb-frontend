import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PORT = process.env.PORT || 5173;
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    host: true,
    port: Number(PORT),
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
      },
      '/uploads': {
        target: API_URL,
        changeOrigin: true,
      },
    },
  },
});
