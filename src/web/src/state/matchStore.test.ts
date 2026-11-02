import { describe, expect, it } from 'vitest';
import type { MatchView } from '../contracts';
import sample from '../contracts/match-view.sample.json';
import type { MatchTransport } from '../net/matchConnection';
import { createMatchStore } from './matchStore';

const view = { ...sample, phase: 'mulligan' } as MatchView;

/** Fake transport: UI work does not need a running server. */
function fakeTransport(overrides: Partial<MatchTransport> = {}): MatchTransport {
  return {
    startSandbox: async () => view,
    sendIntent: async () => ({ ...view, pending: null }),
    ...overrides,
  };
}

describe('matchStore', () => {
  it('stores the view returned by the server', async () => {
    const store = createMatchStore(fakeTransport(), async () => []);

    await store.getState().startSandbox('A', 'B');

    expect(store.getState().view?.matchId).toBe('sample');
  });

  it('shows server errors instead of throwing', async () => {
    const store = createMatchStore(
      fakeTransport({ sendIntent: async () => { throw new Error('not implemented yet'); } }),
      async () => [],
    );
    await store.getState().startSandbox('A', 'B');

    await store.getState().send({ type: 'endStep' });

    expect(store.getState().error).toContain('not implemented yet');
    expect(store.getState().busy).toBe(false);
  });
});
