import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { playerOf, toView, toViewerEvents } from '../src/index.ts';
import { catalog, deck, engine, start } from './helpers.ts';

describe('projection (fog of war)', () => {
  it('R80_opponent_hand_is_only_a_count', () => {
    const { state } = start();

    const view = toView(catalog, engine, state, 0);

    expect(view.you.hand).toHaveLength(4);
    expect(view.opponent.handCount).toBe(4);
    expect(view.opponent).not.toHaveProperty('hand');
    const json = JSON.stringify(view.opponent);
    for (const card of playerOf(state, 1).hand) expect(json).not.toContain(`"instanceId":${card.instanceId},`);
  });

  it('R80_opponent_draw_events_are_redacted', () => {
    const { events } = start();

    const drawn = toViewerEvents(events, 0).flatMap((e) => (e.type === 'cardDrawn' ? [e] : []));

    for (const e of drawn.filter((d) => d.seat === 1)) expect([e.instanceId, e.cardId]).toEqual([0, 0]);
    for (const e of drawn.filter((d) => d.seat === 0)) expect(e.cardId).not.toBe(0);
  });

  it('R84_mulligan_is_offered_as_legal_action_and_pending_interaction', () => {
    const view = toView(catalog, engine, start().state, 1);

    expect(view.legalActions.map((a) => a.kind)).toContain('mulligan');
    expect(view.pending?.kind).toBe('mulligan');
  });
});

/**
 * The committed MatchView sample (packages/contracts/samples) is the wire format the web client's tests use.
 * Regenerate after an approved contract change: UPDATE_CONTRACT_SAMPLES=1 npm test
 */
describe('MatchView sample', () => {
  it('matches the committed sample', () => {
    const state = engine.newMatch({ matchId: 'sample', seed: 2026, deckSeatA: deck(), deckSeatB: deck() }).state;
    const json = `${JSON.stringify(toView(catalog, engine, state, 0), null, 2)}\n`;
    const path = fileURLToPath(import.meta.resolve('@rejoltance/contracts/samples/match-view.sample.json'));

    if (process.env.UPDATE_CONTRACT_SAMPLES === '1') writeFileSync(path, json);

    expect(json).toBe(readFileSync(path, 'utf8').replaceAll('\r\n', '\n'));
  });
});
