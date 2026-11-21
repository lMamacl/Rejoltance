import type { DomainEvent, Intent, LegalAction } from '@rejoltance/contracts';
import { validateDeck, type CardCatalog } from '@rejoltance/content';
import { nextInt, seedRng, shuffle } from './rng.ts';
import { GameRules, maxBloodForRound, newPlayer, playerOf, startingSeat, withPlayer, type MatchState } from './state.ts';

export interface MatchSetup {
  readonly matchId: string;
  readonly seed: number | bigint;
  readonly deckSeatA: readonly number[];
  readonly deckSeatB: readonly number[];
}

export interface ReduceResult {
  readonly state: MatchState;
  readonly events: readonly DomainEvent[];
}

/** An intent the rules do not allow in the current state. The state is left unchanged. */
export class IllegalIntentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IllegalIntentError';
  }
}

/** A rule that is specified but not implemented yet (fail loud, R-68). */
export class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
  }
}

export interface MatchEngine {
  newMatch(setup: MatchSetup): ReduceResult;
  reduce(state: MatchState, seat: number, intent: Intent): ReduceResult;
  legalActions(state: MatchState, seat: number): LegalAction[];
}

/** The rules engine: reduce(state, seat, intent) → (state, events). Pure and deterministic. */
export function createEngine(catalog: CardCatalog): MatchEngine {
  const assertLegalDeck = (cards: readonly number[], owner: string) => {
    const problems = validateDeck({ name: owner, cards: [...cards] }, catalog.findCard);
    if (problems.length > 0) throw new IllegalIntentError(problems.join('; '));
  };

  return {
    newMatch(setup) {
      assertLegalDeck(setup.deckSeatA, 'seat 0');
      assertLegalDeck(setup.deckSeatB, 'seat 1');

      let rng = seedRng(setup.seed);
      const [deckA, afterA] = shuffle(rng, setup.deckSeatA);
      const [deckB, afterB] = shuffle(afterA, setup.deckSeatB);
      rng = afterB;

      let state: MatchState = {
        matchId: setup.matchId,
        rng,
        players: [newPlayer(0, deckA), newPlayer(1, deckB)],
        round: 0,
        phase: 'mulligan',
        activeSeat: null,
        firstSeat: null,
        nextInstanceId: 1,
        result: null,
      };
      const events: DomainEvent[] = [{ type: 'matchStarted', matchId: setup.matchId }];

      // R-02: both players start at 20 HP and draw 4 cards before the mulligan.
      for (const seat of [0, 1]) {
        for (let i = 0; i < GameRules.OpeningHand; i++) state = draw(state, seat, events);
      }
      return { state, events };
    },

    reduce(state, seat, intent) {
      if (seat !== 0 && seat !== 1) throw new RangeError(`Seat must be 0 or 1, got ${seat}.`);
      if (state.result !== null) throw new IllegalIntentError('The match is already finished.');

      const events: DomainEvent[] = [];
      switch (intent.type) {
        case 'mulligan':
          return { state: mulligan(state, seat, intent.cardInstanceIds, events), events };
        case 'surrender':
          return { state: finish(state, 1 - seat, 'surrender', events), events };
        case 'chooseOrder':
          return { state: chooseOrder(state, seat, intent.wantsFirst, events), events };
        case 'playCard':
        case 'endStep':
        case 'answerPending':
          throw new NotImplementedError(`${intent.type}: not implemented yet (backlog E1 — engine).`);
        default: {
          const unknown: never = intent;
          throw new IllegalIntentError(`Unknown intent ${JSON.stringify(unknown)}.`);
        }
      }
    },

    legalActions(state, seat) {
      if (state.result !== null) return [];
      const actions: LegalAction[] = [];
      if (state.phase === 'mulligan' && !playerOf(state, seat).mulliganDone) actions.push({ kind: 'mulligan', cardInstanceId: null, lanes: null });
      if (state.phase === 'chooseOrder' && playerOf(state, seat).wantsFirst === null) actions.push({ kind: 'chooseOrder', cardInstanceId: null, lanes: null });
      actions.push({ kind: 'surrender', cardInstanceId: null, lanes: null });
      return actions;
    },
  };
}

/**
 * R-03 (prototype v11 behaviour, engine.js mulligan; re-check against prototype/game, ADR-0013):
 * draw replacements first, then put the returned cards back and shuffle the deck.
 */
function mulligan(state: MatchState, seat: number, cardInstanceIds: readonly number[], events: DomainEvent[]): MatchState {
  let player = playerOf(state, seat);
  if (state.phase !== 'mulligan' || player.mulliganDone) throw new IllegalIntentError('Mulligan is not available now.');

  const returned = [...new Set(cardInstanceIds)].map((id) => {
    const card = player.hand.find((c) => c.instanceId === id);
    if (!card) throw new IllegalIntentError(`Card instance ${id} is not in your hand.`);
    return card;
  });

  state = withPlayer(state, seat, { ...player, hand: player.hand.filter((c) => !returned.includes(c)) });
  for (let i = 0; i < returned.length; i++) state = draw(state, seat, events);

  player = playerOf(state, seat);
  const [deck, rng] = shuffle(state.rng, [...player.deck, ...returned.map((c) => c.cardId)]);
  state = { ...withPlayer(state, seat, { ...player, deck, mulliganDone: true }), rng };
  events.push({ type: 'mulliganDone', seat, replaced: returned.length });

  if (state.players.every((p) => p.mulliganDone)) state = { ...state, phase: 'chooseOrder' };
  return state;
}

/**
 * R-04: after the mulligan each player declares whether they want to go first. Different answers are respected;
 * the same answer from both is settled by the match RNG (repeatable for the same seed). Then round 1 starts.
 * Prototype: engine.js `decideStart`.
 */
function chooseOrder(state: MatchState, seat: number, wantsFirst: boolean, events: DomainEvent[]): MatchState {
  const player = playerOf(state, seat);
  if (state.phase !== 'chooseOrder' || player.wantsFirst !== null) throw new IllegalIntentError('Choosing the order is not available now.');
  state = withPlayer(state, seat, { ...player, wantsFirst });

  const [a, b] = state.players;
  if (a.wantsFirst === null || b.wantsFirst === null) return state;

  let firstSeat: number;
  let rng = state.rng;
  if (a.wantsFirst !== b.wantsFirst) firstSeat = a.wantsFirst ? 0 : 1;
  else [firstSeat, rng] = nextInt(rng, 2);

  return startRound({ ...state, rng, firstSeat }, events);
}

/**
 * R-10, R-11: a new round. The round number grows by 1, max Blood is min(10, round) and Blood refills to it
 * (unspent Blood does not carry over); from round 2 each player draws a card (seat 0 first, as in the prototype).
 * The starting player alternates; the round opens with the starting player's unit step (R-12).
 * Prototype: engine.js `startRound`.
 */
export function startRound(state: MatchState, events: DomainEvent[]): MatchState {
  if (state.firstSeat === null) throw new IllegalIntentError('The starting player has not been decided yet.');
  const round = state.round + 1;
  const maxBlood = maxBloodForRound(round);
  for (const seat of [0, 1]) state = withPlayer(state, seat, { ...playerOf(state, seat), maxBlood, blood: maxBlood });
  state = { ...state, round };

  if (round > 1) {
    for (const seat of [0, 1]) {
      state = draw(state, seat, events);
      if (state.result !== null) return state;
    }
  }
  return { ...state, phase: 'unitStep', activeSeat: startingSeat(state.firstSeat!, round) };
}

/** R-14: empty deck → fatigue damage 1, 2, 3… (no reshuffle). R-13: full hand (8) → the drawn card goes to the discard pile. */
export function draw(state: MatchState, seat: number, events: DomainEvent[]): MatchState {
  const player = playerOf(state, seat);
  if (player.deck.length === 0) {
    const amount = player.fatigueCounter + 1;
    state = withPlayer(state, seat, { ...player, fatigueCounter: amount, hp: player.hp - amount });
    events.push({ type: 'fatigueDamage', seat, amount });
    return checkDefeat(state, events);
  }

  const [cardId, ...deck] = player.deck;
  if (player.hand.length >= GameRules.HandLimit) {
    events.push({ type: 'cardBurned', seat, cardId });
    return withPlayer(state, seat, { ...player, deck, discard: [...player.discard, cardId] });
  }

  const instance = { instanceId: state.nextInstanceId, cardId };
  events.push({ type: 'cardDrawn', seat, instanceId: instance.instanceId, cardId });
  return { ...withPlayer(state, seat, { ...player, deck, hand: [...player.hand, instance] }), nextInstanceId: state.nextInstanceId + 1 };
}

function checkDefeat(state: MatchState, events: DomainEvent[]): MatchState {
  const dead = state.players.filter((p) => p.hp <= 0).map((p) => p.seat);
  if (dead.length === 0) return state;
  // R-71: both heroes dead at once = draw (prototype outcome depends on check order, see 04-rozbieznosci-prototypu.md D-01).
  if (dead.length === 2) return finish(state, null, 'draw', events);
  return finish(state, 1 - dead[0], 'hp', events);
}

function finish(state: MatchState, winnerSeat: number | null, reason: string, events: DomainEvent[]): MatchState {
  events.push({ type: 'matchFinished', winnerSeat, reason });
  return { ...state, phase: 'finished', activeSeat: null, result: { winnerSeat, reason } };
}
