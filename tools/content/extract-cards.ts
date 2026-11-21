// Extracts card and deck data from the JS prototype into the canonical JSON content files.
//
//   npm run cards          # regenerate packages/content/data/*.json
//   npm run cards:check    # fail when the committed JSON differs from the prototype (CI)
//
// The prototype (prototype/game/cards.js + decks.js, PanCoto/rejoltance-prototype) is the canonical rules source
// (ADR-0013). Both files are plain JS object literals, so they are evaluated in an empty sandbox.
// Legacy cards (cards-legacy.js, decks-legacy.js) are not part of the canon and are not extracted.
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { runInNewContext } from 'node:vm';
import { rel, repoPath, run, syncOutputs } from '../lib.ts';

const SOURCES = [repoPath('prototype/game/cards.js'), repoPath('prototype/game/decks.js')];
const TARGET_DIR = repoPath('packages/content/data');

const render = (data: unknown): string => `${JSON.stringify(data, null, 2)}\n`;

run(() => {
  const { values } = parseArgs({ options: { check: { type: 'boolean', default: false } } });

  const code = SOURCES.map((file) => readFileSync(file, 'utf8')).join('\n;\n');
  const { CARDS, DECKS } = runInNewContext(`${code}\n;({ CARDS, DECKS })`, Object.create(null), { timeout: 5000 }) as {
    CARDS: unknown[];
    DECKS: { n: string; c: number[] }[];
  };
  const decks = DECKS.map((deck) => ({ name: deck.n, cards: deck.c }));

  const outputs = new Map([
    [`${TARGET_DIR}/cards.json`, render(CARDS)],
    [`${TARGET_DIR}/decks.json`, render(decks)],
  ]);
  const stale = syncOutputs(outputs, values.check);

  if (values.check) {
    for (const path of stale) console.log(`stale: ${rel(path)} (run: npm run cards)`);
    if (stale.length === 0) console.log('OK: card data matches the prototype');
    return stale.length ? 1 : 0;
  }
  console.log(`cards: ${CARDS.length}, decks: ${decks.length} -> ${rel(TARGET_DIR)}`);
  return 0;
});
