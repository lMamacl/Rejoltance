/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Aspire injects SERVER_HTTP(S) via WithReference(server). Without Aspire: `dotnet run --project src/Rejoltance.Server`
// and set SERVER_HTTP=http://localhost:5000 (or whatever the server prints).
const serverUrl = process.env.SERVER_HTTPS || process.env.SERVER_HTTP || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // REST + SignalR hub (/api/hubs/match) — ws: true forwards WebSockets.
      '/api': { target: serverUrl, changeOrigin: true, ws: true, secure: false },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
