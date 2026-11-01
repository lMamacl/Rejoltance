# Kontrakty i API

**Stan:** 2026-11-01 · **Źródło prawdy:** kod (`src/Rejoltance.Contracts`, `src/Rejoltance.Server`) — ten dokument go opisuje [V]; pozycje planowane oznaczono [Z].
Zmiana kontraktu = ADR + zmiana C# i TS w jednym PR (konstytucja art. IV, ADR-0010).

## 1. Format danych

- JSON, nazwy pól **camelCase**, enumy jako **camelCase stringi** (np. `"phase": "mulligan"`).
- Typy polimorficzne (`Intent`, `DomainEvent`) mają pole **`type`** (np. `{"type": "mulligan", "cardInstanceIds": [1, 3]}`).
- Wzorcowa odpowiedź: [`src/web/src/contracts/match-view.sample.json`](../../src/web/src/contracts/match-view.sample.json) (generowana przez test C#).

## 2. REST

| Metoda | Ścieżka | Opis | Odpowiedź | Uwierzytelnienie |
|---|---|---|---|---|
| GET | `/api/info` | nazwa, wersja, liczba aktywnych meczów | `{ name, version, activeMatches }` | — |
| GET | `/api/cards` | katalog kart | `CardDefinition[]` (pola jak w `cards.json`) | — |
| GET | `/api/decks` | talie startowe | `{ name, cards: int[] }[]` | — |
| GET | `/health` | gotowość (tylko środowisko Development) | `Healthy` / 503 | — |
| GET | `/alive` | żywotność (tylko Development) | `Healthy` | — |
| POST | `/api/auth/register`, `/api/auth/login` | konta | [Z] E6-S02 | — |
| GET/POST | `/api/decks/mine` | talie gracza | [Z] E6-S04 | cookie |

## 3. SignalR — hub `/api/hubs/match`

### Metody wywoływane przez klienta

| Metoda | Parametry | Zwraca | Błędy |
|---|---|---|---|
| `StartSandbox` | `deckA: string`, `deckB: string`, `seed?: ulong` | `MatchView` (miejsce 0) | `HubException` przy nieznanej talii |
| `SendIntent` | `matchId: string`, `intent: Intent` | `MatchView` po ruchu | `HubException` z komunikatem: nielegalny ruch, cudzy mecz, reguła niezaimplementowana |
| `CreateRoom`, `JoinRoom(code)` | — | `MatchView` | [Z] E3-S01 |

### Zdarzenia wysyłane do klienta (`IMatchClient`)

| Zdarzenie | Dane | Kiedy |
|---|---|---|
| `MatchUpdated` | `view: MatchView`, `events: DomainEvent[]` | po każdym przyjętym ruchu (u każdego gracza jego projekcja) |

## 4. Kontrakty

### `Intent` (klient → serwer)

| `type` | Pola | Reguła |
|---|---|---|
| `mulligan` | `cardInstanceIds: int[]` | R-03 |
| `chooseOrder` | `wantsFirst: bool` | R-04 |
| `playCard` | `cardInstanceId: int`, `lane: int?`, `targets: TargetRef[]` | R-20…R-25 |
| `endStep` | — | R-12 |
| `answerPending` | `pendingId: string`, `targets: TargetRef[]` | R-84 |
| `surrender` | — | R-72 |

`TargetRef`: dokładnie jedno z pól `unitInstanceId`, `heroSeat`, `handCardInstanceId`, `choiceIndex`.

### `MatchView` (serwer → klient)

| Pole | Typ | Opis |
|---|---|---|
| `matchId`, `round`, `phase`, `yourSeat`, `activeSeat` | — | stan meczu; `phase`: `mulligan`, `chooseOrder`, `unitStep`, `mixedStep`, `actionStep`, `combat`, `finished` |
| `you` | `PlayerView` | HP, Blood, **ręka z kartami**, liczba kart w talii i na stosie, 4 linie |
| `opponent` | `OpponentView` | HP, Blood, **tylko liczba kart w ręce** i talii, 4 linie (R-80) |
| `legalActions` | `LegalAction[]` | jedyne źródło legalności dla UI i bota |
| `pending` | `PendingInteraction?` | pytanie do gracza (np. mulligan) |
| `result` | `MatchResult?` | zwycięzca i powód (`hp`, `surrender`, `draw`) |

### `DomainEvent` (serwer → klient, w `MatchUpdated`)

| `type` | Pola | Uwagi |
|---|---|---|
| `matchStarted` | `matchId` | |
| `cardDrawn` | `seat`, `instanceId`, `cardId` | u przeciwnika zanonimizowane (`0`, `0`) |
| `cardBurned` | `seat`, `cardId` | karta odrzucona przy pełnej ręce (jawna) |
| `fatigueDamage` | `seat`, `amount` | R-14 |
| `mulliganDone` | `seat`, `replaced` | |
| `matchFinished` | `winnerSeat?`, `reason` | |

Kolejne zdarzenia (atak, obrażenia, śmierć, status) dochodzą razem z regułami walki (E1-S03, E3-S03).

## 5. Wersjonowanie i zgodność

- Jeden klient na jedną wersję serwera (wdrażane razem) — bez wersjonowania API w URL.
- Zgodność C#↔TS pilnowana testami (NFR-11); dodanie pola opcjonalnego jest kompatybilne, zmiana nazwy lub typu wymaga ADR.
