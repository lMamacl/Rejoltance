// Wire contracts — mirror of src/Rejoltance.Contracts (C#). camelCase properties, enums as camelCase strings.
// Do NOT change without changing the C# record in the same PR (constitution, article IV).
// The shape is checked against match-view.sample.json, which the C# tests produce (contracts.test.ts).

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

export interface OpponentView {
  hp: number;
  blood: number;
  maxBlood: number;
  handCount: number;
  deckCount: number;
  discardCount: number;
  lanes: (UnitView | null)[];
}

export interface LegalAction {
  kind: string;
  cardInstanceId: number | null;
  lanes: number[] | null;
}

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

export interface TargetRef {
  unitInstanceId?: number;
  heroSeat?: number;
  handCardInstanceId?: number;
  choiceIndex?: number;
}

/** Intents — the only thing the client sends. `type` is the polymorphic discriminator. */
export type Intent =
  | { type: 'mulligan'; cardInstanceIds: number[] }
  | { type: 'chooseOrder'; wantsFirst: boolean }
  | { type: 'playCard'; cardInstanceId: number; lane: number | null; targets: TargetRef[] }
  | { type: 'endStep' }
  | { type: 'answerPending'; pendingId: string; targets: TargetRef[] }
  | { type: 'surrender' };

export interface CardDefinition {
  id: number;
  name: string;
  type: 'Unit' | 'Spell';
  cost: number;
  attack: number | null;
  health: number | null;
  description: string;
  keywords: string[];
}
