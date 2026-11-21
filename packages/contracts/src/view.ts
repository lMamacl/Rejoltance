// Contracts 2–4 of 5: what one seat is allowed to see. Produced only by the engine's projection (fog of war),
// never by hand. The server never sends the full game state to a client.

export type MatchPhase = 'mulligan' | 'chooseOrder' | 'unitStep' | 'mixedStep' | 'actionStep' | 'combat' | 'finished';

export interface HandCardView {
  instanceId: number;
  cardId: number;
  cost: number;
}

export interface UnitView {
  instanceId: number;
  cardId: number;
  attack: number;
  health: number;
  keywords: string[];
}

export interface PlayerView {
  hp: number;
  blood: number;
  maxBlood: number;
  hand: HandCardView[];
  deckCount: number;
  discardCount: number;
  lanes: (UnitView | null)[];
}

/** The opponent's hand and deck are only counts: card identities never leave the server (R-80…R-82). */
export interface OpponentView {
  hp: number;
  blood: number;
  maxBlood: number;
  handCount: number;
  deckCount: number;
  discardCount: number;
  lanes: (UnitView | null)[];
}

/** Contract 2: the single source of legality. The UI highlights it, the server validates against it, bots generate moves from it. */
export interface LegalAction {
  kind: string;
  cardInstanceId: number | null;
  lanes: number[] | null;
}

/** Contract 3: the engine asks a question instead of blocking (mulligan, order, target choice). */
export interface PendingInteraction {
  id: string;
  kind: string;
  seat: number;
  options: string[];
}

export interface MatchResult {
  winnerSeat: number | null;
  reason: string;
}

/** Contract 4: one seat's view of the match. */
export interface MatchView {
  matchId: string;
  round: number;
  phase: MatchPhase;
  yourSeat: number;
  activeSeat: number | null;
  you: PlayerView;
  opponent: OpponentView;
  legalActions: LegalAction[];
  pending: PendingInteraction | null;
  result: MatchResult | null;
}
