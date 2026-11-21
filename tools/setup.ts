// `npm run setup`: one-time setup after `git clone`. Safe to re-run.
// Uses only Node built-ins, so it works before `npm install`.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const run = (command: string, args: string[]) =>
  execFileSync(command, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
const step = (msg: string) => console.log(`\n==> ${msg}`);

step('Checking tools');
run(process.execPath, ['tools/doctor.ts']);

step('git settings for this repo');
run('git', ['config', 'core.longpaths', 'true']);
run('git', ['config', 'pull.ff', 'only']);

step('Installing dependencies (all workspaces)');
run('npm', ['ci', '--no-audit', '--no-fund']);

if (!existsSync(new URL('../.env', import.meta.url))) {
  step('Creating .env from .env.example (git-ignored; put your own tokens there)');
  copyFileSync(new URL('../.env.example', import.meta.url), new URL('../.env', import.meta.url));
}

step('Running the tests');
run('npm', ['test']);

console.log('\nDone. Start the game with:  npm run dev');
