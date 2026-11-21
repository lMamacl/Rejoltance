import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// Module boundaries (ADR-0015): imports point one way only.
//   apps/web  ──► contracts            (never engine/content: the client does not know the rules)
//   apps/server ──► engine ──► content ──► contracts
const forbid = (...names) => names.map((name) => ({ group: [name, `${name}/*`], message: `Module boundary: do not import ${name} here (ADR-0015).` }));
const NODE_BUILTINS = { group: ['node:*'], message: 'The rules engine and content are pure: no I/O, network or process access (constitution, art. II).' };

export default defineConfig(
  globalIgnores(['**/dist', '**/node_modules', 'prototype', 'docs', '.artifacts', 'openspec']),
  {
    extends: [js.configs.recommended, tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['packages/contracts/src/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [...forbid('@rejoltance/content', '@rejoltance/engine', '@rejoltance/server', '@rejoltance/web'), NODE_BUILTINS] }],
    },
  },
  {
    files: ['packages/content/src/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [...forbid('@rejoltance/engine', '@rejoltance/server', '@rejoltance/web'), NODE_BUILTINS] }],
    },
  },
  {
    // Deterministic kernel: same seed + same intents = same result (R-83).
    files: ['packages/engine/src/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [...forbid('@rejoltance/server', '@rejoltance/web'), NODE_BUILTINS] }],
      'no-restricted-globals': ['error',
        { name: 'Date', message: 'No clock in the engine (R-83). Pass time in as data.' },
        { name: 'setTimeout', message: 'No timers in the engine.' },
        { name: 'setInterval', message: 'No timers in the engine.' },
        { name: 'crypto', message: 'Use the seeded RNG (rng.ts), not crypto.' },
        { name: 'fetch', message: 'No I/O in the engine.' },
      ],
      'no-restricted-properties': ['error', { object: 'Math', property: 'random', message: 'Use the seeded RNG (rng.ts), not Math.random (R-83).' }],
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-restricted-imports': ['error', { patterns: forbid('@rejoltance/engine', '@rejoltance/content', '@rejoltance/server') }],
    },
  },
);
