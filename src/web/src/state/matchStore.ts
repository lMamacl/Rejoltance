import { create } from 'zustand';
import type { CardDefinition, Intent, MatchView } from '../contracts';
import { createSignalRTransport, type MatchTransport } from '../net/matchConnection';

interface MatchStore {
  view: MatchView | null;
  cards: Record<number, CardDefinition>;
  error: string | null;
  busy: boolean;
  loadCards(): Promise<void>;
  startSandbox(deckA: string, deckB: string): Promise<void>;
  send(intent: Intent): Promise<void>;
}

/** Builds the store around a transport, so tests can inject a fake one. */
export function createMatchStore(transport: MatchTransport, fetchCards: () => Promise<CardDefinition[]>) {
  return create<MatchStore>((set, get) => {
    const run = async (action: () => Promise<MatchView | void>) => {
      set({ busy: true, error: null });
      try {
        const view = await action();
        if (view) set({ view });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : String(err) });
      } finally {
        set({ busy: false });
      }
    };

    return {
      view: null,
      cards: {},
      error: null,
      busy: false,
      loadCards: () =>
        run(async () => {
          const cards = await fetchCards();
          set({ cards: Object.fromEntries(cards.map((c) => [c.id, c])) });
        }),
      startSandbox: (deckA, deckB) => run(() => transport.startSandbox(deckA, deckB)),
      send: (intent) =>
        run(() => {
          const view = get().view;
          if (!view) throw new Error('No active match');
          return transport.sendIntent(view.matchId, intent);
        }),
    };
  });
}

async function fetchCardsFromApi(): Promise<CardDefinition[]> {
  const response = await fetch('/api/cards');
  if (!response.ok) throw new Error(`GET /api/cards failed: ${response.status}`);
  return response.json();
}

export const useMatchStore = createMatchStore(createSignalRTransport(), fetchCardsFromApi);
