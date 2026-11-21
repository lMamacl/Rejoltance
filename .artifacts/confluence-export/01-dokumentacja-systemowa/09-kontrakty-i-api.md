<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/09-kontrakty-i-api.md -->
# 1.9 Dokumentacja kontraktów komunikacyjnych i API (REST + Socket.IO)

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/09-kontrakty-i-api.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — systemowa (dokumentacja API) · **Etap SDD:** Planowanie i realizacja · **Powiązane decyzje:** [ADR-0006](07-decyzje-adr/0006-serwer-autorytatywny-fog-of-war.md), [ADR-0015](07-decyzje-adr/0015-backend-node-typescript.md)

Ten dokument opisuje API (Application Programming Interface) serwera `apps/server`. Znajdziesz tu:

- endpointy HTTP REST,
- zdarzenia Socket.IO, przez które toczy się mecz (WebSocket),
- strukturę 5 zamrożonych kontraktów JSON z pakietu `packages/contracts`.

Skróty z metadanych: SDD (Spec-Driven Development) to praca „najpierw specyfikacja, potem kod”. ADR (Architecture Decision Record) to zapis jednej decyzji architektonicznej.

---

## 1. Zasady serializacji i kontrola zgodności

1. **Format danych.** Wszystkie komunikaty REST i Socket.IO są w formacie **JSON**.
2. **Nazwy pól i wartości.** Nazwy właściwości i wartości wyliczeniowe zapisujemy w **camelCase** (np. `"phase": "mulligan"`, `"reason": "surrender"`).
3. **Typy z polem `type` (`Intent` i `DomainEvent`).** Rodzaj obiektu wskazuje pole **`type`** (np. `{"type": "mulligan", "cardInstanceIds": [1, 3]}`).
4. **Jedno źródło typów.** Kontrakty są zdefiniowane raz w `packages/contracts` i importują je serwer, silnik i klient, więc rozjazd to błąd `tsc`. `Intent` ma schemat zod: serwer odrzuca każdą wiadomość, która mu nie odpowiada, zanim trafi do silnika. Wzorcowy widok meczu jest w [`packages/contracts/samples/match-view.sample.json`](../../packages/contracts/samples/match-view.sample.json); test silnika sprawdza, że projekcja daje dokładnie tę próbkę (Konstytucja, art. IV).

---

## 2. Endpointy HTTP REST

| Metoda HTTP | Ścieżka | Do czego służy | Odpowiedź (200 OK) | Stan |
|---|---|---|---|---|
| `GET` | `/health` | Sprawdza, czy serwer działa. | `{ "status": "ok" }` | Zaimplementowane |
| `GET` | `/api/info` | Nazwa serwera i liczba trwających meczów w pamięci. | `{ "name": "Rejoltance", "activeMatches": 0 }` | Zaimplementowane |
| `GET` | `/api/cards` | Publiczne dane kart (130 kolekcjonerskich + 29 tokenów), bez opisu efektów DSL. | `CardInfo[]`: `id`, `name`, `type`, `cost`, `attack`, `health`, `description`, `keywords` | Zaimplementowane |
| `GET` | `/api/decks` | Lista 4 gotowych talii startowych. | `{ "name": string, "cards": number[] }[]` | Zaimplementowane |
| `POST` | `/api/auth/register`<br/>`/api/auth/login` | Rejestracja i logowanie graczy. Ustawia ciasteczko sesyjne `HttpOnly`. | Profil zalogowanego użytkownika | Planowane w Sprincie 2 (`E6-S02`) |
| `GET` / `POST` | `/api/decks/mine` | Odczyt i zapis własnych talii z kreatora *Deckbuilder*. | Lista talii użytkownika | Planowane w Semestrze 2 (`E6-S04`) |

---

## 3. Zdarzenia Socket.IO

Typy zdarzeń są w `packages/contracts/src/protocol.ts`. Każde żądanie klienta dostaje odpowiedź przez potwierdzenie (*acknowledgement*): `{ "ok": true, "value": … }` albo `{ "ok": false, "error": "czytelny komunikat" }`. Przy błędzie stan meczu się nie zmienia.

### 3.1 Klient → serwer

| Zdarzenie | Dane | Odpowiedź | Kiedy błąd | Stan |
|---|---|---|---|---|
| **`startSandbox`** | `{ deckA: string, deckB: string, seed?: number }` | `MatchView` (projekcja dla miejsca `0`) | Talii startowej nie ma w katalogu. | Zaimplementowane |
| **`sendIntent`** | `{ matchId: string, intent: Intent }` | `MatchView` po wykonaniu ruchu | Intencja nie pasuje do schematu, mecz jest nieznany, gracz nie ma prawa do miejsca, ruch jest nielegalny albo reguła nie jest zaimplementowana. | Zaimplementowane |
| **`createRoom`** | `{ deckName: string }` | `{ roomCode: string, matchId: string }` | Talia jest nieprawidłowa albo przekroczono limit pokojów. | Planowane (`E3-S01`) |
| **`joinRoom`** | `{ roomCode: string, deckName: string }` | `MatchView` (projekcja dla miejsca `1`) | Kod pokoju nie istnieje albo pokój jest pełny. | Planowane (`E3-S01`) |

### 3.2 Serwer → klient

| Zdarzenie | Dane | Kiedy |
|---|---|---|
| **`matchUpdated`** | `{ view: MatchView, events: DomainEvent[] }` | Po każdym poprawnie przetworzonym ruchu. Każdy gracz dostaje tylko swoją projekcję i przefiltrowaną listę zdarzeń, w której karty przeciwnika są ukryte. |

---

## 4. Pięć zamrożonych kontraktów (`packages/contracts`)

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
