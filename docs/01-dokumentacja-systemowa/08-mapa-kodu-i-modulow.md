# 1.8 Mapa kodu źródłowego i modułów

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — systemowa (dokumentacja kodu źródłowego) · **Etap SDD:** Realizacja

Ta mapa pomaga ci poruszać się po kodzie RE:JOLTANCE. Jest dla członków zespołu i dla agentów AI. Zanim zmienisz jakiś moduł, przeczytaj tę mapę i plik `README.md` w katalogu modułu (`packages/<pakiet>/README.md` albo `apps/<aplikacja>/README.md`).

SDD (Spec-Driven Development) to nasz sposób pracy: najpierw specyfikacja, potem kod. Ta strona należy do etapu *Realizacja*.

---

## 1. Architektura i kierunek zależności

Całe repozytorium to jeden projekt npm (*workspaces*) w TypeScript na Node.js 24 ([ADR-0015](07-decyzje-adr/0015-backend-node-typescript.md)).

```text
┌──────────────────────────────────────────────────────────────────────┐
│ apps/web (React + TypeScript + Vite)                                 │  ← Prezentacja
│ Renderuje MatchView, podświetla legalActions, wysyła Intent          │    (nie zna reguł gry)
└───────────────▲──────────────────────────────────┬───────────────────┘
                │ MatchView + DomainEvent[]        │ Intent (Socket.IO)
┌───────────────┴──────────────────────────────────▼───────────────────┐
│ apps/server (Node.js: Fastify + Socket.IO)                           │  ← Transport i sesje
│ REST (/health, /api/*), zdarzenia startSandbox / sendIntent,         │
│ MatchSessionManager, walidacja Intent schematem zod                  │
├──────────────────────────────────────────────────────────────────────┤
│ packages/engine (czysty silnik reguł)                                │  ← Domena
│ createEngine: newMatch / reduce / legalActions, toView (Fog of War), │    (deterministyczna, bez I/O)
│ rng.ts (SplitMix64), state.ts                                        │
├──────────────────────────────────────────────────────────────────────┤
│ packages/content (katalog kart i słownik DSL)                        │  ← Dane domenowe
│ data/cards.json, data/decks.json, vocabulary.ts, validator.ts        │
├──────────────────────────────────────────────────────────────────────┤
│ packages/contracts (5 zamrożonych kontraktów)                        │  ← Kontrakty
│ Intent (zod), LegalAction, PendingInteraction, MatchView,            │    (bez logiki gry)
│ DomainEvent, protokół Socket.IO                                      │
└──────────────────────────────────────────────────────────────────────┘
```

> **Reguła zależności:** importy prowadzą tylko **z góry na dół**, a klient web importuje wyłącznie `packages/contracts`. Pilnuje tego ESLint (`eslint.config.js`) i test `tools/architecture.test.ts` przy każdym `npm run verify`.

---

## 2. Katalog modułów

| Ścieżka w repozytorium | Rola modułu | Główne pliki | Właściciel (EU5/EU6) |
|---|---|---|---|
| [`packages/contracts/`](../../packages/contracts/README.md) | 5 kontraktów wymienianych przez serwer, klienta i bota oraz protokół Socket.IO. | `src/intents.ts`, `src/view.ts`, `src/events.ts`, `src/protocol.ts`, `samples/match-view.sample.json` | Wspólny (backend + frontend) |
| [`packages/content/`](../../packages/content/README.md) | Katalog 130 kart, 29 tokenów i 4 talii startowych, walidator słownika DSL (języka opisu efektów kart). | `data/cards.json`, `src/vocabulary.ts`, `src/validator.ts`, `src/catalog.ts` | Właściciel epiku E2 |
| [`packages/engine/`](../../packages/engine/README.md) | Czysty, deterministyczny silnik reguł gry, projekcja *Fog of War* (R-80…R-82), generator losowy z ziarnem. | `src/engine.ts`, `src/state.ts`, `src/projection.ts`, `src/rng.ts` | Właściciel epiku E1 |
| [`apps/server/`](../../apps/server/README.md) | Autorytatywny serwer: REST i Socket.IO, mecze w pamięci. | `src/app.ts`, `src/sessions.ts`, `src/main.ts` | Właściciele epików E3 i E6 |
| [`apps/web/`](../../apps/web/README.md) | Klient React + TypeScript + Vite + Zustand. | `src/net/matchConnection.ts`, `src/state/matchStore.ts`, `src/components/` | Właściciel epiku E4 |
| `tools/` | Skrypty repozytorium: `npm run dev`, `setup`, `doctor`, test granic modułów, generatory w Pythonie. | `dev.ts`, `setup.ts`, `doctor.ts`, `architecture.test.ts` | Cały zespół |

Testy leżą przy kodzie: `packages/*/test`, `apps/server/test`, `apps/web/src/**/*.test.tsx`. Uruchamia je jedno `npm test`.

---

## 3. Przewodnik praktyczny: „Gdzie dodać nową funkcję?”

| Co chcesz zrobić? | Które pliki zmienić? | Ryzyko | Zalecany skill agenta AI |
|---|---|---|---|
| **Dodać nową kartę lub zmienić statystyki istniejącej** (z istniejących słów DSL) | 1. Zmień `game/cards.js` w repo `PanCoto/rejoltance-prototype` (źródło prototypu)<br/>2. Dociągnij zmiany: `git subtree pull --prefix=prototype https://github.com/PanCoto/rejoltance-prototype.git main`<br/>3. Uruchom `python tools/content/extract_cards.py`<br/>4. Uruchom `npm test` | Niski | [`rj-add-card`](../04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md) |
| **Dodać do DSL nowe słowo kluczowe, wyzwalacz lub akcję** | 1. Dopisz regułę `R-nn` w `openspec/specs/`<br/>2. Dodaj słowo do `packages/content/src/vocabulary.ts`<br/>3. Zaimplementuj obsługę w `packages/engine`<br/>4. Napisz test `Rnn_...` w `packages/engine/test` | Średni | [`rj-add-rule-test`](../04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md) |
| **Zaimplementować lub zmienić regułę mechaniki gry (`R-nn`)** | 1. Napisz test `Rnn_...` w `packages/engine/test/`<br/>2. Zaimplementuj logikę w `packages/engine/src/engine.ts` (albo w osobnym pliku w silniku)<br/>3. Zaktualizuj status w `03-indeks-regul-r-nn.md` | Średni | [`rj-add-rule-test`](../04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md) |
| **Zmienić strukturę `MatchView`, `Intent` lub `DomainEvent`** | 1. Zapisz decyzję w ADR (`07-decyzje-adr/`)<br/>2. Zmień typ albo schemat w `packages/contracts/src/`<br/>3. Popraw miejsca, które wskaże `npm run typecheck` (silnik, serwer, klient)<br/>4. Odśwież próbkę: `UPDATE_CONTRACT_SAMPLES=1 npm test` — **wszystko w jednym PR!** | **Wysoki** *(zmiana zamrożonego kontraktu)* | [`rj-write-adr`](../04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md) |
| **Dodać zdarzenie Socket.IO lub endpoint REST** | 1. Dopisz typ zdarzenia w `packages/contracts/src/protocol.ts`<br/>2. Obsłuż je w `apps/server/src/app.ts`<br/>3. Dodaj test w `apps/server/test/`<br/>4. Zaktualizuj `09-kontrakty-i-api.md` | Średni | — |
| **Dodać lub rozbudować komponent UI** | 1. Napisz test komponentu w `apps/web/src/**/*.test.tsx` (na sztucznym transporcie)<br/>2. Zaimplementuj komponent w `apps/web/src/components/` | Niski | — |
| **Dodać trwałe dane (baza)** | 1. Zaplanuj tabelę zgodnie z ADR-0007 (SQLite, potem PostgreSQL)<br/>2. Dodaj warstwę danych w `apps/server/src/`<br/>3. Zaktualizuj diagram ERD w `05-sad-architektura-systemu.md` | Średni | — |

---

## 4. Aktualny stan implementacji

| Obszar | Stan w kodzie | Testy automatyczne |
|---|---|---|
| **Start meczu, tasowanie z ziarna, dobieranie, mulligan, obrażenia Fatigue, limit ręki (8 kart), poddanie się, projekcja Fog of War** | **Zaimplementowane w `packages/engine`** | Testy `R-01`, `R-02`, `R-03`, `R-10`, `R-13`, `R-14`, `R-68`, `R-70`, `R-72`, `R-80`, `R-83`, `R-84`. |
| **Walidacja katalogu 159 kart i 4 talii startowych względem słownika DSL** | **Zaimplementowane w `packages/content`** | `packages/content/test`. |
| **Tryb piaskownicy w przeglądarce przez Socket.IO (`startSandbox`, `sendIntent`)** | **Zaimplementowane w `apps/server` i `apps/web`** | `apps/server/test` (prawdziwe połączenie Socket.IO) i testy Vitest klienta. |
| **Kroki rundy (`unitStep`, `mixedStep`, `actionStep`), zagrywanie jednostek, walka na 4 liniach, efekty kart DSL** | **Zaplanowane w backlogu (`E1`, `E2`).** Na razie rzucają czytelny błąd `NotImplementedError`. | Specyfikacje `GIVEN/WHEN/THEN` w `openspec/specs/`. |
| **Pokoje 1v1 PvP, bot AI, konta użytkowników, Deckbuilder** | **Zaplanowane w backlogu (`E3`, `E5`, `E6`)** | — |
