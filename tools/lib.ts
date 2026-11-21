// Shared helpers for the repository scripts in tools/ (Node built-ins only).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Absolute path of the repository root, with forward slashes. */
export const ROOT = fileURLToPath(new URL('..', import.meta.url)).replace(/[\\/]$/, '').replaceAll('\\', '/');

export const repoPath = (...parts: string[]): string => [ROOT, ...parts].join('/');

/** Repository-relative path with forward slashes (as shown in messages and generated files). */
export const rel = (absolute: string): string => relative(ROOT, absolute).split(sep).join('/');

/** Reads a text file as UTF-8 with LF line endings. */
export const readText = (path: string): string => readFileSync(path, 'utf8').replaceAll('\r\n', '\n');

/**
 * Compares generated files with what is on disk. In check mode reports stale files and returns their count;
 * otherwise writes the stale ones (UTF-8, LF). Returns the list of stale paths.
 */
export function syncOutputs(outputs: Map<string, string | Buffer>, check: boolean): string[] {
  const stale = [...outputs].filter(([path, content]) => {
    if (!existsSync(path)) return true;
    const current = readFileSync(path);
    return typeof content === 'string' ? current.toString('utf8') !== content : !current.equals(content);
  });
  if (!check) {
    for (const [path, content] of stale) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
    }
  }
  return stale.map(([path]) => path);
}

/** Exits with the code returned by `main`, printing unexpected errors without a stack trace for known failures. */
export function run(main: () => number | Promise<number>): void {
  Promise.resolve()
    .then(main)
    .then((code) => process.exit(code))
    .catch((error: unknown) => {
      console.error(error instanceof Error ? `error: ${error.message}` : error);
      process.exit(1);
    });
}
