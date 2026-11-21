// Contract 5 of 5: facts emitted by the engine. The client animates events instead of diffing states.
// Events carrying hidden information are filtered per seat by the projection.

export type DomainEvent =
  | { type: 'matchStarted'; matchId: string }
  /** A card moved from deck to hand. `cardId` (and `instanceId`) are 0 for the opponent. */
  | { type: 'cardDrawn'; seat: number; instanceId: number; cardId: number }
  /** Drawn with a full hand: the card goes to the discard pile (public). */
  | { type: 'cardBurned'; seat: number; cardId: number }
  /** Draw from an empty deck: 1, 2, 3... damage. */
  | { type: 'fatigueDamage'; seat: number; amount: number }
  | { type: 'mulliganDone'; seat: number; replaced: number }
  | { type: 'matchFinished'; winnerSeat: number | null; reason: string };

export type DomainEventType = DomainEvent['type'];
