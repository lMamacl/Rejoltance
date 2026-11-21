import type { DomainEvent } from '@rejoltance/contracts';
import { describe, expect, it } from 'vitest';
import { IllegalIntentError, playerOf, startRound, toView, withPlayer, type MatchState } from '../src/index.ts';
import { catalog, engine, start } from './helpers.ts';

// E1-S01: choosing the order after the mulligan and starting rounds (openspec/specs/match-setup R-04, round-flow R-10, R-11).

const afterMulligans = (seed = 42): MatchState => {
  let { state } = start(seed);
  state = engine.reduce(state, 0, { type: 'mulligan', cardInstanceIds: [] }).state;
  return engine.reduce(state, 1, { type: 'mulligan', cardInstanceIds: [] }).state;
};

const choose = (state: MatchState, first: boolean, second: boolean): MatchState => {
  state = engine.reduce(state, 0, { type: 'chooseOrder', wantsFirst: first }).state;
  return engine.reduce(state, 1, { type: 'chooseOrder', wantsFirst: second }).state;
};

describe('R-04 choosing the order', () => {
  it('R04_different_choices_are_respected', () => {
    const state = choose(afterMulligans(), true, false);

    expect(state.firstSeat).toBe(0);
    expect(state.round).toBe(1);
    expect(state.phase).toBe('unitStep');
    expect(state.activeSeat).toBe(0);
  });

  it('R04_a_player_who_wants_to_go_second_lets_the_other_start', () => {
    expect(choose(afterMulligans(), false, true).firstSeat).toBe(1);
  });

  it('R04_same_choices_pick_the_starting_player_from_the_seed', () => {
    const firstSeats = Array.from({ length: 20 }, (_, i) => choose(afterMulligans(i + 1), true, true).firstSeat);

    expect(choose(afterMulligans(7), true, true).firstSeat).toBe(choose(afterMulligans(7), true, true).firstSeat);
    expect(choose(afterMulligans(7), false, false).firstSeat).toBe(choose(afterMulligans(7), false, false).firstSeat);
    expect(new Set(firstSeats)).toEqual(new Set([0, 1]));
  });

  it('R04_the_round_waits_until_both_players_answer', () => {
    const state = engine.reduce(afterMulligans(), 0, { type: 'chooseOrder', wantsFirst: true }).state;

    expect(state.phase).toBe('chooseOrder');
    expect(state.round).toBe(0);
    expect(engine.legalActions(state, 0).map((a) => a.kind)).not.toContain('chooseOrder');
    expect(engine.legalActions(state, 1).map((a) => a.kind)).toContain('chooseOrder');
  });

  it('R04_choosing_twice_or_before_the_mulligan_is_illegal', () => {
    const once = engine.reduce(afterMulligans(), 0, { type: 'chooseOrder', wantsFirst: true }).state;

    expect(() => engine.reduce(once, 0, { type: 'chooseOrder', wantsFirst: false })).toThrow(IllegalIntentError);
    expect(() => engine.reduce(start().state, 0, { type: 'chooseOrder', wantsFirst: true })).toThrow(IllegalIntentError);
  });

  it('R04_the_choice_is_offered_as_a_legal_action_and_a_pending_question', () => {
    const view = toView(catalog, engine, afterMulligans(), 1);

    expect(view.legalActions.map((a) => a.kind)).toContain('chooseOrder');
    expect(view.pending).toEqual({ id: 'chooseOrder-1', kind: 'chooseOrder', seat: 1, options: ['first', 'second'] });
  });
});

describe('R-10 round start and Blood', () => {
  it('R10_round_1_gives_both_players_1_of_1_Blood_and_no_extra_card', () => {
    const before = afterMulligans();
    const state = choose(before, true, false);

    for (const seat of [0, 1]) {
      expect(playerOf(state, seat)).toMatchObject({ blood: 1, maxBlood: 1 });
      expect(playerOf(state, seat).hand).toHaveLength(playerOf(before, seat).hand.length);
    }
  });

  it('R10_round_2_refills_Blood_to_2_and_each_player_draws_a_card', () => {
    const round1 = choose(afterMulligans(), true, false);
    const events: DomainEvent[] = [];

    const round2 = startRound(round1, events);

    expect(round2.round).toBe(2);
    for (const seat of [0, 1]) {
      expect(playerOf(round2, seat)).toMatchObject({ blood: 2, maxBlood: 2 });
      expect(playerOf(round2, seat).hand).toHaveLength(playerOf(round1, seat).hand.length + 1);
    }
    expect(events.filter((e) => e.type === 'cardDrawn').map((e) => (e.type === 'cardDrawn' ? e.seat : -1))).toEqual([0, 1]);
  });

  it('R10_unspent_Blood_does_not_carry_over', () => {
    let state = startRound(choose(afterMulligans(), true, false), []);
    state = withPlayer(state, 0, { ...playerOf(state, 0), blood: 1 });

    const round3 = startRound(state, []);

    expect(playerOf(round3, 0)).toMatchObject({ blood: 3, maxBlood: 3 });
  });

  it('R10_max_Blood_stops_at_10', () => {
    const late = { ...choose(afterMulligans(), true, false), round: 13 };

    expect(playerOf(startRound(late, []), 0)).toMatchObject({ blood: 10, maxBlood: 10 });
  });
});

describe('R-11 starting player', () => {
  it('R11_the_starting_player_alternates_every_round', () => {
    const round1 = choose(afterMulligans(), false, true);
    const round2 = startRound(round1, []);
    const round3 = startRound(round2, []);

    expect([round1.activeSeat, round2.activeSeat, round3.activeSeat]).toEqual([1, 0, 1]);
  });
});
