import type { DomainEvent } from '@rejoltance/contracts';
import { describe, expect, it } from 'vitest';
import { draw, IllegalIntentError, maxBloodForRound, NotImplementedError, playerOf, withPlayer } from '../src/index.ts';
import { engine, start } from './helpers.ts';

// Test names start with the rule id from docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md (R-nn), so coverage can be traced.
describe('match setup rules', () => {
  it('R02_players_start_with_20_hp_and_4_cards', () => {
    const { state } = start();

    for (const p of state.players) {
      expect(p.hp).toBe(20);
      expect(p.hand).toHaveLength(4);
      expect(p.deck).toHaveLength(26);
    }
    expect(state.phase).toBe('mulligan');
  });

  it('R03_mulligan_replaces_cards_and_keeps_deck_size', () => {
    const { state } = start();
    const returned = playerOf(state, 0).hand.slice(0, 2).map((c) => c.instanceId);

    const player = playerOf(engine.reduce(state, 0, { type: 'mulligan', cardInstanceIds: returned }).state, 0);

    expect(player.hand).toHaveLength(4);
    expect(player.deck).toHaveLength(26);
    expect(player.hand.map((c) => c.instanceId)).not.toEqual(expect.arrayContaining(returned));
    expect(player.mulliganDone).toBe(true);
  });

  it('R03_mulligan_twice_is_illegal', () => {
    const once = engine.reduce(start().state, 0, { type: 'mulligan', cardInstanceIds: [] }).state;

    expect(() => engine.reduce(once, 0, { type: 'mulligan', cardInstanceIds: [] })).toThrow(IllegalIntentError);
  });

  it('R03_mulligan_of_a_card_not_in_hand_is_illegal', () => {
    expect(() => engine.reduce(start().state, 0, { type: 'mulligan', cardInstanceIds: [999] })).toThrow(IllegalIntentError);
  });

  it('R03_both_mulligans_move_the_match_to_choose_order', () => {
    let { state } = start();

    state = engine.reduce(state, 0, { type: 'mulligan', cardInstanceIds: [] }).state;
    state = engine.reduce(state, 1, { type: 'mulligan', cardInstanceIds: [] }).state;

    expect(state.phase).toBe('chooseOrder');
  });

  it.each([
    [1, 1],
    [5, 5],
    [10, 10],
    [14, 10],
  ])('R10_max_blood_equals_round_capped_at_10 (round %i → %i)', (round, expected) => {
    expect(maxBloodForRound(round)).toBe(expected);
  });

  it('R14_drawing_from_empty_deck_deals_growing_fatigue_damage', () => {
    let { state } = start();
    state = withPlayer(state, 0, { ...playerOf(state, 0), deck: [] });
    const events: DomainEvent[] = [];

    state = draw(state, 0, events);
    state = draw(state, 0, events);
    state = draw(state, 0, events);

    expect(playerOf(state, 0).hp).toBe(20 - 1 - 2 - 3);
    expect(events.flatMap((e) => (e.type === 'fatigueDamage' ? [e.amount] : []))).toEqual([1, 2, 3]);
  });

  it('R70_fatigue_can_end_the_match', () => {
    let { state } = start();
    state = withPlayer(state, 0, { ...playerOf(state, 0), deck: [], hp: 1 });

    state = draw(state, 0, []);

    expect(state.result).toEqual({ winnerSeat: 1, reason: 'hp' });
    expect(state.phase).toBe('finished');
  });

  it('R13_drawing_with_full_hand_sends_card_to_discard', () => {
    let { state } = start();
    const fullHand = Array.from({ length: 8 }, (_, i) => ({ instanceId: 100 + i, cardId: 1 }));
    state = withPlayer(state, 0, { ...playerOf(state, 0), hand: fullHand });
    const events: DomainEvent[] = [];

    state = draw(state, 0, events);

    expect(playerOf(state, 0).hand).toHaveLength(8);
    expect(playerOf(state, 0).discard).toHaveLength(1);
    expect(events.filter((e) => e.type === 'cardBurned')).toHaveLength(1);
  });

  it('R72_surrender_ends_the_match_for_the_opponent', () => {
    const { state } = engine.reduce(start().state, 0, { type: 'surrender' });

    expect(state.result).toEqual({ winnerSeat: 1, reason: 'surrender' });
  });

  it('R68_unimplemented_intents_fail_loud', () => {
    expect(() => engine.reduce(start().state, 0, { type: 'endStep' })).toThrow(NotImplementedError);
  });
});
