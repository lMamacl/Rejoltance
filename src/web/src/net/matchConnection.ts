import * as signalR from '@microsoft/signalr';
import type { Intent, MatchView } from '../contracts';

/**
 * The only place that talks to the server (component catalogue: useMatch / transport).
 * Components never call fetch or SignalR directly — they use the store (state/matchStore.ts).
 * A fake implementation of this interface lets UI work proceed without a running server.
 */
export interface MatchTransport {
  startSandbox(deckA: string, deckB: string): Promise<MatchView>;
  sendIntent(matchId: string, intent: Intent): Promise<MatchView>;
}

/** The hub connection is created lazily on first use, so importing this module has no side effects. */
export function createSignalRTransport(url = '/api/hubs/match'): MatchTransport {
  let connection: signalR.HubConnection | null = null;

  const ready = async () => {
    connection ??= new signalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      await connection.start();
    }
    return connection;
  };

  return {
    async startSandbox(deckA, deckB) {
      return (await ready()).invoke<MatchView>('StartSandbox', deckA, deckB, null);
    },
    async sendIntent(matchId, intent) {
      return (await ready()).invoke<MatchView>('SendIntent', matchId, intent);
    },
  };
}
