import { io, type Socket } from 'socket.io-client';
import type { Ack, ClientToServerEvents, Intent, MatchView, ServerToClientEvents } from '@rejoltance/contracts';

/**
 * The only place that talks to the server (component catalogue: useMatch / transport).
 * Components never call fetch or the socket directly — they use the store (state/matchStore.ts).
 * A fake implementation of this interface lets UI work proceed without a running server.
 */
export interface MatchTransport {
  startSandbox(deckA: string, deckB: string): Promise<MatchView>;
  sendIntent(matchId: string, intent: Intent): Promise<MatchView>;
}

const unwrap = <T>(result: Ack<T>): T => {
  if (!result.ok) throw new Error(result.error);
  return result.value;
};

/** The socket is created lazily on first use, so importing this module has no side effects. */
export function createSocketTransport(url?: string): MatchTransport {
  let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  const ready = () => (socket ??= url ? io(url) : io());

  return {
    startSandbox: (deckA, deckB) =>
      new Promise((resolve, reject) => ready().emit('startSandbox', { deckA, deckB }, (r) => (r.ok ? resolve(unwrap(r)) : reject(new Error(r.error))))),
    sendIntent: (matchId, intent) =>
      new Promise((resolve, reject) => ready().emit('sendIntent', { matchId, intent }, (r) => (r.ok ? resolve(unwrap(r)) : reject(new Error(r.error))))),
  };
}
