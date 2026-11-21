import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Fitness function: the dependency graph between workspace packages points one way only (ADR-0015).
//   web ──► contracts;  server ──► engine ──► content ──► contracts
// ESLint (eslint.config.js) enforces the same rule on every import line; this test guards package.json.
const allowed: Record<string, string[]> = {
  '@rejoltance/contracts': [],
  '@rejoltance/content': [],
  '@rejoltance/engine': ['@rejoltance/contracts', '@rejoltance/content'],
  '@rejoltance/server': ['@rejoltance/contracts', '@rejoltance/content', '@rejoltance/engine'],
  '@rejoltance/web': ['@rejoltance/contracts'],
};

const manifests = ['packages/contracts', 'packages/content', 'packages/engine', 'apps/server', 'apps/web'].map((dir) => {
  const pkg = JSON.parse(readFileSync(new URL(`../${dir}/package.json`, import.meta.url), 'utf8')) as {
    name: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  return { dir, pkg };
});

describe('module boundaries', () => {
  it.each(manifests.map((m) => [m.pkg.name, m] as const))('%s depends only on allowed workspace packages', (name, { pkg }) => {
    const internal = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter((d) => d.startsWith('@rejoltance/'));
    expect(allowed[name], `unknown workspace package ${name}`).toBeDefined();
    expect(internal.filter((d) => !allowed[name].includes(d))).toEqual([]);
  });

  it('the engine and content have no runtime dependencies outside the workspace', () => {
    for (const name of ['@rejoltance/engine', '@rejoltance/content']) {
      const { pkg } = manifests.find((m) => m.pkg.name === name)!;
      expect(Object.keys(pkg.dependencies ?? {}).filter((d) => !d.startsWith('@rejoltance/'))).toEqual([]);
    }
  });
});
