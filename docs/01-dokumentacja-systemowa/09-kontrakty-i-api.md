# 1.9 Dokumentacja kontraktów komunikacyjnych i API (REST + SignalR)

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/09-kontrakty-i-api.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — systemowa (dokumentacja API) · **Etap SDD:** Planowanie i realizacja · **Powiązane decyzje:** [ADR-0006](07-decyzje-adr/0006-serwer-autorytatywny-fog-of-war.md), [ADR-0010](07-decyzje-adr/0010-kontrakt-csharp-ts-przez-probke.md)

Ten dokument opisuje API (Application Programming Interface) serwera `Rejoltance.Server`. Znajdziesz tu:

- endpointy HTTP REST,
- metody i zdarzenia huba SignalR (`/api/hubs/match`), który działa przez WebSocket,
- strukturę 5 zamrożonych kontraktów JSON (`src/Rejoltance.Contracts` ↔ `src/web/src/contracts`).

Skróty z metadanych: SDD (Spec-Driven Development) to praca „najpierw specyfikacja, potem kod”. ADR (Architecture Decision Record) to zapis jednej decyzji architektonicznej.

---

## 1. Zasady serializacji i kontrola zgodności

1. **Format danych.** Wszystkie komunikaty REST i SignalR są w formacie **JSON**.
2. **Nazwy pól i wartości enum.** Nazwy właściwości i wartości typów wyliczeniowych (`enum`) zapisujemy w **camelCase** (np. `"phase": "mulligan"`, `"reason": "surrender"`).
3. **Typy polimorficzne (`Intent` i `DomainEvent`).** Rodzaj rekordu wskazuje pole **`type`** (np. `{"type": "mulligan", "cardInstanceIds": [1, 3]}`).
4. **Automatyczna kontrola kontraktu.** Wzorcowy przykład widoku meczu jest w pliku [`src/web/src/contracts/match-view.sample.json`](../../src/web/src/contracts/match-view.sample.json). Generuje go test C# `ContractSampleTests`. Kompilator TypeScript sprawdza go w teście `contracts.test.ts`. Każda zmiana kontraktu wymaga zmiany C# i TypeScript w jednym Pull Requeście (Konstytucja, Art. IV).

---

## 2. Endpointy HTTP REST (`/api/*`)

| Metoda HTTP | Ścieżka | Do czego służy | Odpowiedź (200 OK) | Stan |
|---|---|---|---|---|
| `GET` | `/api/info` | Metadane serwera, wersja aplikacji i liczba trwających meczów w pamięci. | `{ "name": "Rejoltance.Server", "version": "...", "activeMatches": 0 }` | Zaimplementowane |
| `GET` | `/api/cards` | Pełny katalog kart (69 kolekcjonerskich + 9 tokenów). | `CardDefinition[]` (schemat jak w `cards.json`) | Zaimplementowane |
| `GET` | `/api/decks` | Lista 5 gotowych talii startowych. | `{ "name": string, "cards": number[] }[]` | Zaimplementowane |
| `GET` | `/health` | Sprawdza gotowość usługi (*readiness probe*). Działa w środowisku deweloperskim i w kontenerze. | Tekst `Healthy` (kod `200`) lub `503 Service Unavailable` | Zaimplementowane |
| `GET` | `/alive` | Sprawdza, czy proces żyje (*liveness probe*). | Tekst `Healthy` (kod `200`) | Zaimplementowane |
| `POST` | `/api/auth/register`<br/>`/api/auth/login` | Rejestracja i logowanie graczy. Ustawia ciasteczko sesyjne `HttpOnly`. | Profil zalogowanego użytkownika | Planowane w Sprincie 2 (`E6-S02`) |
| `GET` / `POST` | `/api/decks/mine` | Odczyt i zapis własnych talii z kreatora *Deckbuilder*. | Lista talii użytkownika | Planowane w Semestrze 2 (`E6-S04`) |

---

## 3. Hub SignalR (`/api/hubs/match`)

### 3.1 Metody, które klient wywołuje na serwerze (`Client → Server`)

| Metoda | Parametry | Zwraca | Błędy (`HubException`) | Stan |
|---|---|---|---|---|
| **`StartSandbox`** | `deckA: string`, `deckB: string`, `seed?: ulong` | `MatchView` (projekcja dla miejsca `0`) | Gdy podanej talii startowej nie ma w katalogu. | Zaimplementowane |
| **`SendIntent`** | `matchId: string`, `intent: Intent` | `MatchView` (projekcja po wykonaniu ruchu) | Gdy mecz jest nieznany, gracz nie ma prawa do miejsca przy stole, ruch jest nielegalny albo reguła nie jest zaimplementowana. Komunikat jest czytelny, a stan meczu się nie zmienia. | Zaimplementowane |
| **`CreateRoom`** | `deckName: string` | `{ roomCode: string, matchId: string }` | Gdy talia jest nieprawidłowa albo przekroczono limit pokojów. | Planowane (`E3-S01`) |
| **`JoinRoom`** | `roomCode: string`, `deckName: string` | `MatchView` (projekcja dla miejsca `1`) | Gdy kod pokoju nie istnieje albo pokój jest pełny. | Planowane (`E3-S01`) |

### 3.2 Zdarzenia, które serwer wysyła do klientów (`Server → Client`)

| Zdarzenie | Dane (*payload*) | Kiedy |
|---|---|---|
| **`MatchUpdated`** | `view: MatchView`, `events: DomainEvent[]` | Po każdym poprawnie przetworzonym ruchu. Każdy gracz dostaje tylko swoją projekcję `MatchView` i przefiltrowaną listę `DomainEvent[]`, w której karty przeciwnika są ukryte. |

---

## 4. Pięć zamrożonych kontraktów (`Rejoltance.Contracts`)

Fog of war to zasada, że gracz nie widzi ukrytych informacji przeciwnika: kart w ręce, kolejności talii ani ziarna losowości. Opisują ją reguły R-80…R-82.

### 4.1 Kontrakt 1: `Intent` (intencja gracza wysyłana do serwera)

| Wartość `type` | Dodatkowe pola JSON | Co robi | Reguły |
|---|---|---|---|
| `"mulligan"` | `cardInstanceIds: number[]` | Wymienia wskazane karty z ręki startowej. Pusta tablica `[]` oznacza zatrzymanie wszystkich 4 kart. | `R-03` |
| `"chooseOrder"` | `wantsFirst: boolean` | Deklaruje, czy gracz chce zacząć rundę 1 jako pierwszy (`true`), czy jako drugi (`false`). | `R-04` |
| `"playCard"` | `cardInstanceId: number`, `lane: number \| null`, `targets: TargetRef[]` | Zagrywa kartę z ręki na linię (`0..3` dla jednostek, `null` dla akcji) ze wskazanymi celami. | `R-20..R-25` |
| `"endStep"` | *(brak)* | Aktywny gracz kończy bieżący krok rundy. | `R-12` |
| `"answerPending"` | `pendingId: string`, `targets: TargetRef[]` | Odpowiada na pytanie silnika (`PendingInteraction`). | `R-84` |
| `"surrender"` | *(brak)* | Gracz od razu poddaje mecz. | `R-72` |

Referencja celu **`TargetRef`** ma dokładnie jedno niepuste pole spośród: `unitInstanceId`, `heroSeat`, `handCardInstanceId` lub `choiceIndex`.

### 4.2 Kontrakt 2: `MatchView` (widok meczu dla jednego gracza)

| Pole | Typ | Opis i gwarancje *Fog of War* |
|---|---|---|
| `matchId` | `string` | Unikalny identyfikator meczu. |
| `round` | `number` | Numer bieżącej rundy: `0` w fazie mulliganu i wyboru kolejności, `≥ 1` w trakcie gry. |
| `phase` | `MatchPhase` | Bieżąca faza: `"mulligan"`, `"chooseOrder"`, `"unitStep"`, `"mixedStep"`, `"actionStep"`, `"combat"`, `"finished"`. |
| `yourSeat` | `number` (`0` lub `1`) | Miejsce przy stole gracza, który dostaje ten widok. |
| `activeSeat` | `number \| null` | Miejsce gracza, który ma teraz ruch. `null`, gdy obaj działają równolegle (mulligan) albo mecz się skończył. |
| `you` | `PlayerView` | Pełny stan gracza: `hp`, `blood`, `maxBlood`, **`hand: CardInHandView[]` (wszystkie karty w ręce)**, `deckCount`, `discardCount`, `lanes: (UnitOnBoardView \| null)[]`. |
| `opponent` | `OpponentView` | Przefiltrowany stan przeciwnika: `hp`, `blood`, `maxBlood`, **`handCount: number` (tylko liczba kart w ręce — R-80)**, `deckCount`, `discardCount`, `lanes: (UnitOnBoardView \| null)[]`. |
| `legalActions` | `LegalAction[]` | Wszystkie akcje dozwolone teraz dla gracza `yourSeat`. |
| `pending` | `PendingInteraction \| null` | Pytanie silnika do gracza `yourSeat` (np. prośba o mulligan). |
| `result` | `MatchResult \| null` | Wynik zakończonego meczu: `winnerSeat: number \| null` i `reason: "hp" \| "surrender" \| "draw" \| "disconnect"`. |

### 4.3 Kontrakt 3: `DomainEvent` (fakty z gry dla animacji)

| Wartość `type` | Pola JSON | Opis i zasady anonimizacji |
|---|---|---|
| `"matchStarted"` | `matchId: string` | Mecz się rozpoczął, ręce startowe są rozdane. |
| `"cardDrawn"` | `seat: number`, `instanceId: number`, `cardId: number` | Gracz dobrał kartę z talii. W widoku przeciwnika `instanceId` i `cardId` mają wartość `0` (`R-80`). |
| `"cardBurned"` | `seat: number`, `cardId: number` | Dobrana karta spłonęła, bo ręka miała już 8 kart (`R-13`). Spalona karta trafia na jawny stos odrzuconych, więc obaj gracze widzą `cardId`. |
| `"fatigueDamage"` | `seat: number`, `amount: number` | Bohater dostał obrażenia, bo gracz próbował dobrać kartę z pustej talii (`R-14`). |
| `"mulliganDone"` | `seat: number`, `replaced: number` | Gracz na miejscu `seat` zakończył wymianę i podał liczbę wymienionych kart. |
| `"matchFinished"` | `winnerSeat: number \| null`, `reason: string` | Mecz się zakończył. Pole wskazuje zwycięzcę albo `null` przy remisie. |
