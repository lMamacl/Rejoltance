import Fastify, { type FastifyInstance } from 'fastify';
import { Server } from 'socket.io';
import { IntentSchema, type Ack, type CardInfo, type ClientToServerEvents, type ServerToClientEvents } from '@rejoltance/contracts';
import { isUnit, loadCatalog, type CardCatalog } from '@rejoltance/content';
import { createEngine, IllegalIntentError, NotImplementedError } from '@rejoltance/engine';
import { MatchSessionManager } from './sessions.ts';

export interface GameServer {
  app: FastifyInstance;
  io: Server<ClientToServerEvents, ServerToClientEvents>;
  sessions: MatchSessionManager;
}

/** Builds the server without listening, so tests can use `app.inject` or listen on a random port. */
export function buildServer(options: { catalog?: CardCatalog; logger?: boolean } = {}): GameServer {
  const catalog = options.catalog ?? loadCatalog();
  const engine = createEngine(catalog);
  const sessions = new MatchSessionManager(catalog, engine);
  const app = Fastify({ logger: options.logger ?? false });

  const cards: CardInfo[] = catalog.all.map((c) => ({
    id: c.Id,
    name: c.Name,
    type: isUnit(c) ? 'Unit' : 'Spell',
    cost: c.Cost,
    attack: c.Attack ?? null,
    health: c.Health ?? null,
    description: c.Description,
    keywords: c.Keywords ?? [],
  }));

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/api/info', async () => ({ name: 'Rejoltance', activeMatches: sessions.activeMatches }));
  app.get('/api/cards', async () => cards);
  app.get('/api/decks', async () => catalog.starterDecks);

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(app.server, { serveClient: false });

  io.on('connection', (socket) => {
    socket.on('startSandbox', (request, ack) => {
      reply(ack, () => sessions.createSandbox(socket.id, String(request?.deckA), String(request?.deckB), request?.seed));
    });

    socket.on('sendIntent', (request, ack) => {
      reply(ack, () => {
        // Contract check at the boundary: anything that is not a valid Intent never reaches the engine.
        const parsed = IntentSchema.safeParse(request?.intent);
        if (!parsed.success) throw new IllegalIntentError(`Invalid intent: ${parsed.error.issues.map((i) => i.message).join('; ')}`);
        const { view, events } = sessions.apply(String(request.matchId), socket.id, parsed.data);
        socket.emit('matchUpdated', { view, events });
        return view;
      });
    });
  });

  return { app, io, sessions };
}

/** Rule errors go back to the caller as a message; anything else is a server bug and is logged. */
function reply<T>(ack: (result: Ack<T>) => void, action: () => T): void {
  if (typeof ack !== 'function') return;
  try {
    ack({ ok: true, value: action() });
  } catch (error) {
    if (error instanceof IllegalIntentError || error instanceof NotImplementedError) {
      ack({ ok: false, error: error.message });
      return;
    }
    console.error(error);
    ack({ ok: false, error: 'Internal server error.' });
  }
}
