import { describe, expect, it } from 'vitest';
import { nextInt, playerOf, seedRng, shuffle } from '../src/index.ts';
import { stableJson, start } from './helpers.ts';

describe('determinism', () => {
  it('R83_same_seed_gives_identical_match', () => {
    expect(stableJson(start(7).state)).toBe(stableJson(start(7).state));
  });

  it('different seeds give different decks', () => {
    expect(playerOf(start(1).state, 0).deck).not.toEqual(playerOf(start(2).state, 0).deck);
  });

  it('shuffle is a permutation', () => {
    const items = Array.from({ length: 30 }, (_, i) => i);

    const [shuffled] = shuffle(seedRng(123), items);

    expect([...shuffled].sort((a, b) => a - b)).toEqual(items);
    expect(shuffled).not.toEqual(items);
  });

  it('nextInt stays in range', () => {
    let rng = seedRng(99);
    for (let i = 0; i < 1000; i++) {
      const [value, next] = nextInt(rng, 4);
      rng = next;
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(3);
    }
  });
});
