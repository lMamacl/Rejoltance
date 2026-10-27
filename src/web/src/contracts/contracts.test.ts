import { describe, expect, it } from 'vitest';
import type { MatchView } from './index';
import sample from './match-view.sample.json';

// Compile-time contract check: this assignment fails `tsc -b` when the C# wire format
// (written by tests/Rejoltance.Server.Tests ContractSampleTests) and the TS types drift apart.
// (`phase` is widened to string by JSON imports, so it is narrowed explicitly; every other field is checked structurally.)
const exact: MatchView = { ...sample, phase: sample.phase as MatchView['phase'] };

describe('MatchView contract', () => {
  it('sample has every top-level field of MatchView', () => {
    const expected: (keyof MatchView)[] = [
      'matchId', 'round', 'phase', 'yourSeat', 'activeSeat', 'you', 'opponent', 'legalActions', 'pending', 'result',
    ];
    expect(Object.keys(sample).sort()).toEqual([...expected].sort());
  });

  it('opponent hand is only a count (fog of war)', () => {
    expect(exact.opponent).not.toHaveProperty('hand');
    expect(exact.opponent.handCount).toBe(4);
  });
});
