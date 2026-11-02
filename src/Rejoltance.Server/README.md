# Rejoltance.Server — serwer gry

**Po co:** autorytatywny serwer: hub SignalR, sesje meczów w pamięci, REST, baza.

**Publiczne API:**

- SignalR `/api/hubs/match`: `StartSandbox(deckA, deckB, seed?) → MatchView`, `SendIntent(matchId, intent) → MatchView`; push `MatchUpdated(view, events)`;
- REST: `GET /api/info`, `/api/cards`, `/api/decks`; `GET /health`, `/alive` (dev).

**Niezmienniki:** do klienta trafia tylko `MatchView` z `Projection`; intencje jednego meczu są serializowane semaforem; błędy reguł → `HubException` z komunikatem.

**Czego tu NIE ma:** reguł gry (deleguje do Kernela). Na razie także: PvP z dwoma miejscami, kont, talii użytkownika (backlog E3/E6).

**Jak testować:** `dotnet test tests/Rejoltance.Server.Tests` (in‑memory serwer + prawdziwy klient SignalR).
Konfiguracja bazy: `ConnectionStrings:rejoltance` (AppHost ustawia `.data/rejoltance.db`).

**Właściciel:** epik E3 (do przydzielenia).
