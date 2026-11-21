import { randomInt } from 'node:crypto';
import type { DomainEvent, Intent, MatchView } from '@rejoltance/contracts';
import type { CardCatalog } from '@rejoltance/content';
import { IllegalIntentError, toView, toViewerEvents, type MatchEngine, type MatchState } from '@rejoltance/engine';

interface MatchSession {
  readonly id: string;
  readonly seed: number;
  readonly ownerId: string;
  state: MatchState;
  /** Replay = seed + ordered intents (ADR-0004). */
  readonly intents: Intent[];
}

/**
 * Owns live matches in memory. Node runs one intent at a time and the engine is synchronous,
 * so the engine never sees concurrent changes to one match.
 */
export class MatchSessionManager {
  readonly #sessions = new Map<string, MatchSession>();
  readonly #catalog: CardCatalog;
  readonly #engine: MatchEngine;
  readonly #now: () => Date;

  constructor(catalog: CardCatalog, engine: MatchEngine, now: () => Date = () => new Date()) {
    this.#catalog = catalog;
    this.#engine = engine;
    this.#now = now;
  }

  get activeMatches(): number {
    return this.#sessions.size;
  }

  createSandbox(ownerId: string, deckA: string, deckB: string, seed?: number): MatchView {
    const stamp = this.#now().toISOString().replace(/\D/g, '').slice(0, 14);
    const matchId = `m-${stamp}-${randomInt(1000, 10000)}`;
    const matchSeed = seed ?? randomInt(0, 2 ** 48);
    const { state } = this.#engine.newMatch({ matchId, seed: matchSeed, deckSeatA: this.#deck(deckA), deckSeatB: this.#deck(deckB) });
    this.#sessions.set(matchId, { id: matchId, seed: matchSeed, ownerId, state, intents: [] });
    return toView(this.#catalog, this.#engine, state, 0);
  }

  apply(matchId: string, playerId: string, intent: Intent): { view: MatchView; events: DomainEvent[] } {
    const session = this.#sessions.get(matchId);
    if (!session) throw new IllegalIntentError(`Match '${matchId}' does not exist.`);
    // Sandbox: the creator controls seat 0. Seat assignment for PvP is backlog E3.
    if (session.ownerId !== playerId) throw new IllegalIntentError('You are not a player in this match.');

    const seat = 0;
    const result = this.#engine.reduce(session.state, seat, intent);
    session.state = result.state;
    session.intents.push(intent);
    return { view: toView(this.#catalog, this.#engine, result.state, seat), events: toViewerEvents(result.events, seat) };
  }

  #deck(name: string): number[] {
    const deck = this.#catalog.starterDecks.find((d) => d.name === name);
    if (!deck) throw new IllegalIntentError(`Unknown starter deck '${name}'.`);
    return [...deck.cards];
  }
}
