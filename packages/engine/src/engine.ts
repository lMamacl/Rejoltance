import type { DomainEvent, Intent, LegalAction } from '@rejoltance/contracts';
import { validateDeck, type CardCatalog } from '@rejoltance/content';
import { seedRng, shuffle } from './rng.ts';
import { GameRules, newPlayer, playerOf, withPlayer, type MatchState } from './state.ts';

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
