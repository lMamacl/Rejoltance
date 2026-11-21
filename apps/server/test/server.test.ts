import type { AddressInfo } from 'node:net';
import { io as connect, type Socket } from 'socket.io-client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Ack, ClientToServerEvents, MatchView, ServerToClientEvents } from '@rejoltance/contracts';
import { buildServer, type GameServer } from '../src/app.ts';

let server: GameServer;
let client: Socket<ServerToClientEvents, ClientToServerEvents>;

beforeAll(async () => {
  server = buildServer();
  await server.app.listen({ port: 0, host: '127.0.0.1' });
  const { port } = server.app.server.address() as AddressInfo;
  client = connect(`http://127.0.0.1:${port}`, { transports: ['websocket'] });
  await new Promise<void>((resolve) => client.on('connect', () => resolve()));
});

afterAll(async () => {
  client.close();
  server.io.close();
  await server.app.close();
});

const startSandbox = (seed: number) =>
  new Promise<Ack<MatchView>>((resolve) => client.emit('startSandbox', { deckA: 'OG. M', deckB: 'OG C.', seed }, resolve));

const unwrap = <T>(result: Ack<T>): T => {
  if (!result.ok) throw new Error(result.error);
  return result.value;
};

describe('REST', () => {
  it.each(['/health', '/api/info', '/api/cards', '/api/decks'])('%s responds 200', async (url) => {
    const response = await server.app.inject({ method: 'GET', url });

    expect(response.statusCode).toBe(200);
  });

  it('/api/cards returns public camelCase card data', async () => {
    const cards = (await server.app.inject({ method: 'GET', url: '/api/cards' })).json();

    expect(cards[0]).toEqual(expect.objectContaining({ id: 1, name: expect.any(String), cost: expect.any(Number) }));
    expect(cards[0]).not.toHaveProperty('Effects');
  });
});

describe('matches over Socket.IO', () => {
  it('starts a sandbox and accepts a mulligan', async () => {
    const view = unwrap(await startSandbox(42));

    const after = unwrap(
      await new Promise<Ack<MatchView>>((resolve) => client.emit('sendIntent', { matchId: view.matchId, intent: { type: 'mulligan', cardInstanceIds: [] } }, resolve)),
    );

    expect(view.you.hand).toHaveLength(4);
    expect(view.opponent.handCount).toBe(4);
    expect(after.pending).toBeNull();
  });

  it('rejects unimplemented intents with a message', async () => {
    const view = unwrap(await startSandbox(1));

    const result = await new Promise<Ack<MatchView>>((resolve) => client.emit('sendIntent', { matchId: view.matchId, intent: { type: 'endStep' } }, resolve));

    expect(result).toEqual({ ok: false, error: expect.stringContaining('not implemented yet') });
  });

  it('rejects a malformed intent before it reaches the engine', async () => {
    const view = unwrap(await startSandbox(1));
    const bogus = { type: 'mulligan', cardInstanceIds: 'all' } as unknown as never;

    const result = await new Promise<Ack<MatchView>>((resolve) => client.emit('sendIntent', { matchId: view.matchId, intent: bogus }, resolve));

    expect(result).toEqual({ ok: false, error: expect.stringContaining('Invalid intent') });
  });
});
