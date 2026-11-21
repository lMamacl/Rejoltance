// `npm run doctor`: checks that this machine can run Rejoltance. Read-only: changes nothing.
// Exits with code 1 when something required is missing.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
let failed = 0;

const ok = (msg: string) => console.log(`  [OK]   ${msg}`);
const warn = (msg: string) => console.log(`  [WARN] ${msg}`);
const fail = (msg: string) => {
  console.log(`  [FAIL] ${msg}`);
  failed++;
};

function version(command: string, args = ['--version']): string | null {
  try {
    return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], shell: process.platform === 'win32' }).trim().split('\n')[0];
  } catch {
    return null;
  }
}

const [major] = process.versions.node.split('.').map(Number);
if (major >= 24) ok(`Node.js ${process.versions.node}`);
else fail(`Node.js ${process.versions.node} is too old (need 24+) -> winget install OpenJS.NodeJS.LTS`);

const git = version('git');
if (git) ok(git);
else fail('git not found -> winget install Git.Git');

const python = version('python') ?? version('python3');
if (python) ok(`${python} (repo tools in tools/*.py)`);
else fail('Python 3.11+ not found (needed by tools/*.py) -> winget install Python.Python.3.13');

const uv = version('uv');
if (uv) ok(`${uv} (Jira/Confluence MCP server)`);
else warn('uv not found — only needed for the optional Jira/Confluence MCP server -> winget install astral-sh.uv');

if (root.includes('OneDrive')) warn('Repo is inside OneDrive — file locks on node_modules are likely. Clone outside OneDrive.');
else ok('Repo is not inside OneDrive');

if (existsSync(new URL('../node_modules', import.meta.url))) ok('Dependencies installed (node_modules)');
else warn('node_modules missing -> npm run setup');

if (existsSync(new URL('../.env', import.meta.url))) ok('.env present (local tokens, git-ignored)');
else warn('.env missing -> npm run setup creates it from .env.example');

console.log(failed ? `\n${failed} problem(s) to fix.` : '\nAll required tools are in place.');
process.exit(failed ? 1 : 0);
