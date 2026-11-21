import { loadCatalog } from '@rejoltance/content';
import { createEngine } from '../src/index.ts';

/** Shared fixtures: the real catalogue and helpers to start a match. */
export const catalog = loadCatalog();
export const engine = createEngine(catalog);

export const deck = (name = 'OG. M'): number[] => {
  const found = catalog.starterDecks.find((d) => d.name === name);
  if (!found) throw new Error(`No starter deck '${name}'`);
  return [...found.cards];
};

export const start = (seed = 42) => engine.newMatch({ matchId: 'test', seed, deckSeatA: deck(), deckSeatB: deck('OG C.') });

/** JSON with BigInt support (the RNG state is a 64-bit integer). */
export const stableJson = (value: unknown): string => JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString() : v));
