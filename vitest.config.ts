import { defineConfig } from 'vitest/config';

// One `npm test` for the whole repo: Node-side packages and the server run in Node,
// the web client runs with its own Vite config (jsdom).
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'node',
          environment: 'node',
          include: ['packages/*/test/**/*.test.ts', 'apps/server/test/**/*.test.ts', 'tools/**/*.test.ts'],
        },
      },
      'apps/web',
    ],
  },
});
