/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `npm run dev` in the repo root starts the game server and this dev server together.
// The client calls /api, /health and /socket.io on its own origin; Vite forwards them to the game server.
const serverUrl = process.env.SERVER_URL ?? 'http://127.0.0.1:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: serverUrl, changeOrigin: true },
      '/health': { target: serverUrl, changeOrigin: true },
      '/socket.io': { target: serverUrl, changeOrigin: true, ws: true },
    },
  },
  test: {
    name: 'web',
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
