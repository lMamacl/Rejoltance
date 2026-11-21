import type { DomainEvent, MatchView, PendingInteraction, UnitView } from '@rejoltance/contracts';
import type { CardCatalog } from '@rejoltance/content';
import type { MatchEngine } from './engine.ts';
import { playerOf, type MatchState, type PlayerState } from './state.ts';

/**
 * The only way state leaves the engine: one MatchView per seat (fog of war in one place).
 * The opponent's hand and both decks are reduced to counts (R-80…R-82).
 */
export function toView(catalog: CardCatalog, engine: MatchEngine, state: MatchState, seat: number): MatchView {
  const you = playerOf(state, seat);
  const opponent = playerOf(state, 1 - seat);
  return {
    matchId: state.matchId,
    round: state.round,
    phase: state.phase,
    yourSeat: seat,
    activeSeat: state.activeSeat,
    you: {
      hp: you.hp,
      blood: you.blood,
      maxBlood: you.maxBlood,
      hand: you.hand.map((c) => ({ instanceId: c.instanceId, cardId: c.cardId, cost: catalog.getCard(c.cardId).Cost })),
      deckCount: you.deck.length,
      discardCount: you.discard.length,
      lanes: lanes(you),
    },
    opponent: {
      hp: opponent.hp,
      blood: opponent.blood,
      maxBlood: opponent.maxBlood,
      handCount: opponent.hand.length,
      deckCount: opponent.deck.length,
      discardCount: opponent.discard.length,
      lanes: lanes(opponent),
    },
    legalActions: engine.legalActions(state, seat),
    pending: pending(state, seat),
    result: state.result,
  };
}

/** Events about hidden cards are redacted for the other seat. */
export const toViewerEvents = (events: readonly DomainEvent[], seat: number): DomainEvent[] =>
  events.map((e) => (e.type === 'cardDrawn' && e.seat !== seat ? { ...e, instanceId: 0, cardId: 0 } : e));

function pending(state: MatchState, seat: number): PendingInteraction | null {
  return state.phase === 'mulligan' && !playerOf(state, seat).mulliganDone ? { id: `mulligan-${seat}`, kind: 'mulligan', seat, options: [] } : null;
}

const lanes = (player: PlayerState): (UnitView | null)[] =>
  player.lanes.map((u) => (u ? { instanceId: u.instanceId, cardId: u.cardId, attack: u.attack, health: u.health, keywords: [...u.keywords] } : null));
