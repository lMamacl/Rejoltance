import type { DomainEvent } from './events.ts';
import type { Intent } from './intents.ts';
import type { MatchView } from './view.ts';

// Real-time protocol (Socket.IO). Typed on both ends: the server and the client import these interfaces,
// so a renamed event or a changed payload is a compile error in the same PR.

/** Every request is answered through an acknowledgement callback. */
export type Ack<T> = { ok: true; value: T } | { ok: false; error: string };

export interface StartSandboxRequest {
  deckA: string;
  deckB: string;
  seed?: number;
}

export interface SendIntentRequest {
  matchId: string;
  intent: Intent;
}

export interface ClientToServerEvents {
  startSandbox(request: StartSandboxRequest, ack: (result: Ack<MatchView>) => void): void;
  sendIntent(request: SendIntentRequest, ack: (result: Ack<MatchView>) => void): void;
}

export interface ServerToClientEvents {
  matchUpdated(update: { view: MatchView; events: DomainEvent[] }): void;
}

/** Public card data served by GET /api/cards (camelCase, without the effect DSL). */
export interface CardInfo {
  id: number;
  name: string;
  type: 'Unit' | 'Spell';
  cost: number;
  attack: number | null;
  health: number | null;
  description: string;
  keywords: string[];
}

/** Starter deck served by GET /api/decks. */
export interface DeckInfo {
  name: string;
  cards: number[];
}
