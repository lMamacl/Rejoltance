import type { MatchPhase, MatchResult } from '@rejoltance/contracts';
import type { RngState } from './rng.ts';

/** Numbers from the rules (docs/01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md). Changing one is a rules change: update R-nn and its test. */
export const GameRules = {
  StartingHp: 20,
  MaxBlood: 10,
  HandLimit: 8,
  OpeningHand: 4,
  LaneCount: 4,
} as const;

/** R-10: max Blood equals the round number, capped at 10. */
export const maxBloodForRound = (round: number): number => Math.min(Math.max(round, 0), GameRules.MaxBlood);

export interface CardInstance {
  readonly instanceId: number;
  readonly cardId: number;
}

export interface UnitState {
  readonly instanceId: number;
  readonly cardId: number;
  readonly attack: number;
  readonly health: number;
  readonly keywords: readonly string[];
}

export interface PlayerState {
  readonly seat: number;
  readonly hp: number;
  readonly blood: number;
  readonly maxBlood: number;
  /** Card ids only: instance ids are assigned when a card leaves the deck, so they never leak deck order. */
  readonly deck: readonly number[];
  readonly hand: readonly CardInstance[];
  readonly discard: readonly number[];
  readonly lanes: readonly (UnitState | null)[];
  readonly fatigueCounter: number;
  readonly mulliganDone: boolean;
  /** R-04: the answer to "do you want to go first?"; null until the player answers. */
  readonly wantsFirst: boolean | null;
}

/**
 * Full authoritative state of one match. Lives only on the server; clients get a MatchView.
 * Immutable: the engine returns a new state for every intent.
 */
export interface MatchState {
  readonly matchId: string;
  readonly rng: RngState;
  readonly players: readonly [PlayerState, PlayerState];
  readonly round: number;
  readonly phase: MatchPhase;
  readonly activeSeat: number | null;
  /** R-04/R-11: the seat that started round 1; set once both players chose the order. */
  readonly firstSeat: number | null;
  readonly nextInstanceId: number;
  readonly result: MatchResult | null;
}

export const newPlayer = (seat: number, deck: readonly number[]): PlayerState => ({
  seat,
  hp: GameRules.StartingHp,
  blood: 0,
  maxBlood: 0,
  deck,
  hand: [],
  discard: [],
  lanes: Array.from({ length: GameRules.LaneCount }, () => null),
  fatigueCounter: 0,
  mulliganDone: false,
  wantsFirst: null,
});

/** R-11: round 1 is started by `firstSeat`, then the role alternates every round. */
export const startingSeat = (firstSeat: number, round: number): number => (round % 2 === 1 ? firstSeat : 1 - firstSeat);

export const playerOf = (state: MatchState, seat: number): PlayerState => state.players[seat === 0 ? 0 : 1];

export function withPlayer(state: MatchState, seat: number, player: PlayerState): MatchState {
  const players: [PlayerState, PlayerState] = seat === 0 ? [player, state.players[1]] : [state.players[0], player];
  return { ...state, players };
}
