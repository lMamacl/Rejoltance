// `npm run dev`: starts the game server (restarts on change) and the Vite dev server together.
// Ctrl+C stops both.
import { spawn, type ChildProcess } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children: ChildProcess[] = [
  spawn(process.execPath, ['--watch', 'apps/server/src/main.ts'], { stdio: 'inherit' }),
  spawn(npm, ['run', 'dev', '-w', '@rejoltance/web'], { stdio: 'inherit', shell: process.platform === 'win32' }),
];

const stop = () => {
  for (const child of children) child.kill();
  process.exit();
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
for (const child of children) child.on('exit', (code) => code && stop());
