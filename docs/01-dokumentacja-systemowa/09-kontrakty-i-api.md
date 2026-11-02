# 1.9 Dokumentacja kontraktów komunikacyjnych i API (REST + SignalR)

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/09-kontrakty-i-api.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — systemowa (Dokumentacja API) · **Etap SDD:** Planowanie i realizacja · **Powiązane decyzje:** [ADR-0006](07-decyzje-adr/0006-serwer-autorytatywny-fog-of-war.md), [ADR-0010](07-decyzje-adr/0010-kontrakt-csharp-ts-przez-probke.md)

Dokument definiuje specyfikację interfejsów programistycznych serwera `Rejoltance.Server`: punkty końcowe HTTP REST, metody i zdarzenia huba WebSocket SignalR (`/api/hubs/match`) oraz strukturę 5 zamrożonych kontraktów JSON (`src/Rejoltance.Contracts` ↔ `src/web/src/contracts`).

---

## 1. Konwencje serializacji danych i kontrola zgodności

1. **Format wymiany danych:** Wszystkie komunikaty REST oraz SignalR są serializowane do formatu **JSON**.
2. **Nazewnictwo pól i wyliczeń:** Wszystkie nazwy właściwości oraz wartości typów wyliczeniowych (`enum`) są przesyłane w notacji **camelCase** (np. `"phase": "mulligan"`, `"reason": "surrender"`).
3. **Polimorfizm typów (`Intent` oraz `DomainEvent`):** Rekordy polimorficzne posiadają dyskryminator w polu **`type`** (np. `{"type": "mulligan", "cardInstanceIds": [1, 3]}`).
4. **Automatyczna weryfikacja kontraktu:** Wzorcowy przykład zserializowanego widoku meczu znajduje się w pliku [`src/web/src/contracts/match-view.sample.json`](../../src/web/src/contracts/match-view.sample.json). Plik ten jest generowany przez test C# `ContractSampleTests` i walidowany przez kompilator TypeScript w teście `contracts.test.ts`. Jakakolwiek zmiana kontraktu wymaga jednoczesnej aktualizacji C# i TypeScript w jednym Pull Requeście (Konstytucja, Art. IV).

---

## 2. Punkty końcowe HTTP REST (`/api/*`)

| Metoda HTTP | Ścieżka URL | Przeznaczenie | Struktura odpowiedzi (200 OK) | Status implementacji |
|---|---|---|---|---|
| `GET` | `/api/info` | Metadane serwera, wersja aplikacji oraz liczba aktywnych sesji meczowych w pamięci. | `{ "name": "Rejoltance.Server", "version": "...", "activeMatches": 0 }` | Zaimplementowane |
| `GET` | `/api/cards` | Pełny katalog definicji kart (69 kart kolekcjonerskich + 9 tokenów). | `CardDefinition[]` (zgodnie ze schematem `cards.json`) | Zaimplementowane |
| `GET` | `/api/decks` | Lista 5 predefiniowanych talii startowych. | `{ "name": string, "cards": number[] }[]` | Zaimplementowane |
| `GET` | `/health` | Kontrola gotowości usługi (*Readiness Probe* — aktywna w środowisku deweloperskim i kontenerowym). | Tekst `Healthy` (kod `200`) lub `503 Service Unavailable` | Zaimplementowane |
| `GET` | `/alive` | Kontrola żywotności procesu (*Liveness Probe*). | Tekst `Healthy` (kod `200`) | Zaimplementowane |
| `POST` | `/api/auth/register`<br/>`/api/auth/login` | Rejestracja i uwierzytelnianie kont graczy (ustawia ciasteczko sesyjne `HttpOnly`). | Informacja o profilu zalogowanego użytkownika | Planowane w Sprincie 2 (`E6-S02`) |
| `GET` / `POST` | `/api/decks/mine` | Pobieranie i zapisywanie własnych talii gracza z kreatora *Deckbuilder*. | Lista talii użytkownika | Planowane w Semestrze 2 (`E6-S04`) |

---

## 3. Hub WebSocket SignalR (`/api/hubs/match`)

### 3.1 Metody wywoływane przez klienta na serwerze (`Client → Server`)

| Nazwa metody | Parametry wejściowe | Wartość zwracana | Obsługa błędów (`HubException`) | Status |
|---|---|---|---|---|
| **`StartSandbox`** | `deckA: string`, `deckB: string`, `seed?: ulong` | `MatchView` (projekcja dla miejsca `0`) | Rzuca `HubException`, jeśli wskazana nazwa talii startowej nie istnieje w katalogu. | Zaimplementowane |
| **`SendIntent`** | `matchId: string`, `intent: Intent` | `MatchView` (zaktualizowana projekcja po wykonaniu ruchu) | Rzuca `HubException` z czytelnym komunikatem w przypadku: nieznanego meczu, braku uprawnień do miejsca przy stole, nielegalnego ruchu lub niezaimplementowanej reguły. Stan meczu pozostaje nienaruszony. | Zaimplementowane |
| **`CreateRoom`** | `deckName: string` | `{ roomCode: string, matchId: string }` | Rzuca `HubException` przy nieprawidłowej talii lub przekroczeniu limitu pokojów. | Planowane (`E3-S01`) |
| **`JoinRoom`** | `roomCode: string`, `deckName: string` | `MatchView` (projekcja dla miejsca `1`) | Rzuca `HubException`, gdy kod pokoju nie istnieje lub pokój jest już pełny. | Planowane (`E3-S01`) |

### 3.2 Zdarzenia rozsyłane przez serwer do klientów (`Server → Client`)

| Nazwa zdarzenia | Parametry ładunku (Payload) | Kiedy jest emitowane? |
|---|---|---|
| **`MatchUpdated`** | `view: MatchView`, `events: DomainEvent[]` | Po każdym poprawnie zredukowanym ruchu w meczu. Każdy uczestnik meczu otrzymuje wyłącznie swoją indywidualną projekcję `MatchView` oraz przefiltrowaną listę zdarzeń `DomainEvent[]` (z ukrytymi kartami przeciwnika). |

---

## 4. Specyfikacja 5 zamrożonych kontraktów (`Rejoltance.Contracts`)

### 4.1 Kontrakt 1: `Intent` (Intencja gracza wysyłana do serwera)

| Wartość pola `type` | Dodatkowe pola obiektu JSON | Opis zachowania | Powiązane reguły |
|---|---|---|---|
| `"mulligan"` | `cardInstanceIds: number[]` | Wymiana wskazanych kart z ręki startowej (pusta tablica `[]` oznacza zatrzymanie wszystkich 4 kart). | `R-03` |
| `"chooseOrder"` | `wantsFirst: boolean` | Deklaracja preferencji rozpoczęcia rundy 1 jako pierwszy gracz (`true`) lub drugi (`false`). | `R-04` |
| `"playCard"` | `cardInstanceId: number`, `lane: number \| null`, `targets: TargetRef[]` | Zagranie karty z ręki na wskazaną linię (`0..3` dla jednostek, `null` dla akcji) ze wskazanymi celami. | `R-20..R-25` |
| `"endStep"` | *(brak dodatkowych pól)* | Zakończenie bieżącego kroku rundy przez aktywnego gracza. | `R-12` |
| `"answerPending"` | `pendingId: string`, `targets: TargetRef[]` | Odpowiedź gracza na oczekujące pytanie silnika (`PendingInteraction`). | `R-84` |
| `"surrender"` | *(brak dodatkowych pól)* | Natychmiastowe poddanie meczu przez gracza wysyłającego intencję. | `R-72` |

Struktura referencji celu **`TargetRef`** zawiera dokładnie jedno niepuste pole spośród: `unitInstanceId`, `heroSeat`, `handCardInstanceId` lub `choiceIndex`.

### 4.2 Kontrakt 2: `MatchView` (Projekcja stanu meczu dla gracza)

| Pole w `MatchView` | Typ danych | Opis i gwarancje bezpieczeństwa (*Fog of War*) |
|---|---|---|
| `matchId` | `string` | Unikalny identyfikator sesji meczowej. |
| `round` | `number` | Numer bieżącej rundy (`0` podczas fazy mulliganu i wyboru kolejności, `≥ 1` w trakcie rozgrywki). |
| `phase` | `MatchPhase` | Aktualna faza: `"mulligan"`, `"chooseOrder"`, `"unitStep"`, `"mixedStep"`, `"actionStep"`, `"combat"`, `"finished"`. |
| `yourSeat` | `number` (`0` lub `1`) | Numer miejsca przy stole przypisany do gracza odbierającego ten widok. |
| `activeSeat` | `number \| null` | Numer miejsca gracza, do którego należy teraz ruch (`null`, gdy obaj gracze mogą działać równolegle w fazie mulliganu lub gdy mecz się zakończył). |
| `you` | `PlayerView` | Pełny stan gracza: `hp`, `blood`, `maxBlood`, **`hand: CardInHandView[]` (pełna lista kart w ręce)**, `deckCount`, `discardCount`, `lanes: (UnitOnBoardView \| null)[]`. |
| `opponent` | `OpponentView` | Przefiltrowany stan przeciwnika: `hp`, `blood`, `maxBlood`, **`handCount: number` (wyłącznie liczba kart w ręce — R-80)**, `deckCount`, `discardCount`, `lanes: (UnitOnBoardView \| null)[]`. |
| `legalActions` | `LegalAction[]` | Kompletna lista dozwolonych akcji w bieżącym stanie dla gracza `yourSeat`. |
| `pending` | `PendingInteraction \| null` | Oczekujące pytanie silnika skierowane do gracza `yourSeat` (np. prośba o wykonanie mulliganu). |
| `result` | `MatchResult \| null` | Wynik zakończonego meczu: `winnerSeat: number \| null` oraz `reason: "hp" \| "surrender" \| "draw" \| "disconnect"`. |

### 4.3 Kontrakt 3: `DomainEvent` (Fakty domenowe do animacji)

| Wartość pola `type` | Pola obiektu JSON | Opis zdarzenia i zasady anonimizacji |
|---|---|---|
| `"matchStarted"` | `matchId: string` | Rozpoczęcie nowego meczu i rozdanie rąk startowych. |
| `"cardDrawn"` | `seat: number`, `instanceId: number`, `cardId: number` | Dobranie karty z talii. W projekcji wysyłanej do przeciwnika pola `instanceId` oraz `cardId` mają wartość `0` (`R-80`). |
| `"cardBurned"` | `seat: number`, `cardId: number` | Spalenie dobranej karty z powodu osiągnięcia maksymalnego limitu 8 kart w ręce (`R-13`). Karta spalona trafia na jawny stos odrzuconych, więc `cardId` jest widoczne dla obu graczy. |
| `"fatigueDamage"` | `seat: number`, `amount: number` | Obrażenia zadane bohaterowi z powodu próby dobrania karty z pustej talii (`R-14`). |
| `"mulliganDone"` | `seat: number`, `replaced: number` | Zakończenie wymiany startowej przez gracza na miejscu `seat` wraz z liczbą wymienionych kart. |
| `"matchFinished"` | `winnerSeat: number \| null`, `reason: string` | Zakończenie pojedynku ze wskazaniem zwycięzcy (lub `null` w przypadku remisu). |
