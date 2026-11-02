<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md @ 10829d3 (2026-11-02) -->
# 1.8 Mapa kodu źródłowego i modułów

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — systemowa (Dokumentacja kodu źródłowego) · **Etap SDD:** Realizacja

Dokument stanowi praktyczny przewodnik nawigacyjny po kodzie źródłowym projektu **RE:JOLTANCE** dla członków zespołu oraz agentów AI. Przed rozpoczęciem modyfikacji dowolnego modułu przeczytaj niniejszą mapę oraz plik `README.md` znajdujący się bezpośrednio w katalogu danego modułu (`src/<moduł>/README.md`).

---

## 1. Architektura warstwowa i kierunek zależności

```text
┌──────────────────────────────────────────────────────────────────────┐
│ src/web (React + TypeScript + Vite)                                  │  ← Warstwa Prezentacji
│ Renderuje MatchView, podświetla legalActions, wysyła Intent          │    (Nie zna reguł gry!)
└───────────────▲──────────────────────────────────┬───────────────────┘
                │ MatchView + DomainEvent[]        │ Intent (WebSocket)
┌───────────────┴──────────────────────────────────▼───────────────────┐
│ Rejoltance.Server (ASP.NET Core + SignalR)                           │  ← Warstwa Transportu i Sesji
│ MatchHub (/api/hubs/match), REST (/api/*), MatchSessionManager,      │
│ RejoltanceDb (SQLite → PostgreSQL)                                   │
├──────────────────────────────────────────────────────────────────────┤
│ Rejoltance.Kernel (Czysty silnik reguł C#)                           │  ← Warstwa Domenowa
│ MatchEngine.Reduce / LegalActions, Projection.ToView (Fog of War),   │    (Deterministyczna, bez IO)
│ SeededRng, MatchState                                                │
├──────────────────────────────────────────────────────────────────────┤
│ Rejoltance.Content (Katalog kart i słownik DSL)                      │  ← Warstwa Danych Domenowych
│ CardCatalog (cards.json, decks.json), Vocabulary, ContentValidator   │
├──────────────────────────────────────────────────────────────────────┤
│ Rejoltance.Contracts (5 zamrożonych kontraktów DTO)                  │  ← Warstwa Kontraktów
│ Intent, LegalAction, PendingInteraction, MatchView, DomainEvent      │    (Zero logiki biznesowej)
└──────────────────────────────────────────────────────────────────────┘
  Orkiestracja: Rejoltance.AppHost (.NET Aspire) + Rejoltance.ServiceDefaults (OpenTelemetry, Health)
```

> **Żelazna reguła zależności:** Zależności między projektami prowadzą wyłącznie **z góry na dół**. Projekt położony niżej nigdy nie może odwoływać się do projektu położonego wyżej. Zasada ta jest automatycznie sprawdzana przy każdym uruchomieniu `dotnet test` przez zestaw testów `tests/Rejoltance.Architecture.Tests/BoundaryTests.cs`.

---

## 2. Katalog modułów w `src/` oraz `tests/`

| Ścieżka w repozytorium | Rola modułu | Główne pliki i klasy | Właściciel (EU5/EU6) |
|---|---|---|---|
| [`src/Rejoltance.Contracts/`](../../src/Rejoltance.Contracts/README.md) | Definicje 5 kontraktów komunikacyjnych (DTO) wymienianych między serwerem, klientem i botem. | `Intents.cs`, `MatchView.cs`, `Events.cs` | Wspólny (Backend + Frontend) |
| [`src/Rejoltance.Content/`](../../src/Rejoltance.Content/README.md) | Wbudowany katalog 78 kart i 5 talii startowych oraz walidator słownika DSL. | `CardCatalog.cs`, `CardDefinition.cs`, `Vocabulary.cs`, `ContentValidator.cs`, `Data/cards.json` | Właściciel Epiku E2 |
| [`src/Rejoltance.Kernel/`](../../src/Rejoltance.Kernel/README.md) | Czysty, deterministyczny silnik reguł gry, projekcja *Fog of War* oraz generator losowy oparty na ziarnie. | `MatchEngine.cs`, `MatchState.cs`, `Projection.cs`, `SeededRng.cs`, `BannedSymbols.txt` | Właściciel Epiku E1 |
| [`src/Rejoltance.Server/`](../../src/Rejoltance.Server/README.md) | Autorytatywny serwer HTTP/SignalR, menedżer aktywnych sesji meczowych w pamięci oraz baza EF Core. | `Program.cs`, `Matches/MatchHub.cs`, `Matches/MatchSessionManager.cs`, `Data/RejoltanceDb.cs` | Właściciele Epików E3 i E6 |
| [`src/Rejoltance.AppHost/`](../../src/Rejoltance.AppHost/README.md) | Projekt orkiestratora .NET Aspire uruchamiający serwer i klienta webowego jednym poleceniem. | `AppHost.cs` | Właściciel Epiku E6 |
| [`src/Rejoltance.ServiceDefaults/`](../../src/Rejoltance.ServiceDefaults/README.md) | Wspólna konfiguracja OpenTelemetry, logowania i punktów kontrolnych `/health` oraz `/alive`. | `Extensions.cs` | Właściciel Epiku E6 |
| [`src/web/`](../../src/web/README.md) | Aplikacja kliencka React + TypeScript + Vite + Zustand. | `src/contracts/index.ts`, `src/net/matchTransport.ts`, `src/state/matchStore.ts`, `src/components/` | Właściciel Epiku E4 |
| [`tests/`](../../tests/README.md) | Zestawy testów jednostkowych, architektonicznych, serwerowych i integracyjnych xUnit. | `Rejoltance.Kernel.Tests`, `Rejoltance.Architecture.Tests`, `Rejoltance.Server.Tests`, `Rejoltance.AppHost.Tests` | Cały zespół (EU6) |

---

## 3. Przewodnik praktyczny: „Gdzie dodać nową funkcjonalność?”

| Co chcesz zrealizować? | Które pliki należy zmodyfikować? | Poziom ryzyka | Zalecany skill agenta AI |
|---|---|---|---|
| **Dodać nową kartę lub zmienić statystyki istniejącej karty** (przy użyciu istniejących słów DSL) | 1. Zmodyfikuj `prototype/revibance/cards.js`<br/>2. Uruchom `python tools/content/extract_cards.py`<br/>3. Uruchom testy `ContentTests` | Niski | [`rj-add-card`](../04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md) |
| **Dodać nowe słowo kluczowe, wyzwalacz lub akcję do języka DSL kart** | 1. Dopisz regułę `R-nn` w `openspec/specs/`<br/>2. Dodaj słowo do `src/Rejoltance.Content/Vocabulary.cs`<br/>3. Zaimplementuj obsługę w `Rejoltance.Kernel`<br/>4. Napisz test `Rnn_...` w `Rejoltance.Kernel.Tests` | Średni | [`rj-add-rule-test`](../04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md) |
| **Zaimplementować lub zmienić regułę mechaniki gry (`R-nn`)** | 1. Napisz test jednostkowy `Rnn_...` w `tests/Rejoltance.Kernel.Tests/`<br/>2. Zaimplementuj logikę w `src/Rejoltance.Kernel/MatchEngine.cs` (lub wydzielonej klasie pomocniczej w Kernelu)<br/>3. Zaktualizuj status w `03-indeks-regul-r-nn.md` | Średni | [`rj-add-rule-test`](../04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md) |
| **Zmodyfikować strukturę widoku `MatchView`, intencji `Intent` lub zdarzenia `DomainEvent`** | 1. Utwórz decyzję ADR (`07-decyzje-adr/`)<br/>2. Zmień rekord w `src/Rejoltance.Contracts/` oraz `Projection.cs`<br/>3. Zaktualizuj typ w `src/web/src/contracts/index.ts`<br/>4. Odśwież próbkę `UPDATE_CONTRACT_SAMPLES=1 dotnet test` — **wszystko w jednym PR!** | **Wysoki** *(zmiana zamrożonego kontraktu)* | [`rj-write-adr`](../04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md) |
| **Dodać nową metodę w hubie SignalR lub endpoint REST** | 1. Rozszerz `src/Rejoltance.Server/Matches/MatchHub.cs` lub `Program.cs`<br/>2. Dodaj test integracyjny w `tests/Rejoltance.Server.Tests/`<br/>3. Zaktualizuj dokumentację `09-kontrakty-i-api.md` | Średni | — |
| **Dodać lub rozbudować komponent interfejsu użytkownika** | 1. Napisz test komponentu w `src/web/src/**/*.test.tsx` (na sztucznym transporcie)<br/>2. Zaimplementuj komponent w `src/web/src/components/` | Niski | — |
| **Dodać nową tabelę w bazie danych** | 1. Rozszerz `src/Rejoltance.Server/Data/RejoltanceDb.cs`<br/>2. Zweryfikuj działanie na SQLite (oraz PostgreSQL od Sprintu 4)<br/>3. Zaktualizuj diagram ERD w `05-sad-architektura-systemu.md` | Średni | — |

---

## 4. Aktualny stan implementacji modułów (Stan po Sprincie 0)

| Obszar funkcjonalny | Status implementacji w kodzie | Pokrycie testami automatycznymi |
|---|---|---|
| **Start meczu, tasowanie z seeda, dobieranie, mulligan, obrażenia Fatigue, limit ręki (8 kart), poddanie się, projekcja Fog of War** | **Zaimplementowane w `Rejoltance.Kernel`** | Zweryfikowane testami jednostkowymi (`R-01`, `R-02`, `R-03`, `R-10`, `R-13`, `R-14`, `R-68`, `R-70`, `R-72`, `R-80`, `R-83`, `R-84`). |
| **Walidacja katalogu 78 kart i 5 talii startowych względem słownika DSL** | **Zaimplementowane w `Rejoltance.Content`** | Zweryfikowane w `ContentTests.cs`. |
| **Tryb piaskownicy w przeglądarce przez SignalR (`StartSandbox`, `SendIntent`)** | **Zaimplementowane w `Server` i `src/web`** | Zweryfikowane w `ServerTests.cs`, `AppHostSmokeTests.cs` oraz testach Vitest. |
| **Kroki rundy (`unitStep`, `mixedStep`, `actionStep`), zagrywanie jednostek, walka na 4 liniach, efekty kart DSL** | **Zaplanowane w backlogu (`E1`, `E2`)** — obecnie rzucają czytelny wyjątek `NotImplementedException`. | Specyfikacje `GIVEN/WHEN/THEN` gotowe w `openspec/specs/`. |
| **Pokoje 1v1 PvP, bot AI, konta użytkowników, Deckbuilder** | **Zaplanowane w backlogu (`E3`, `E5`, `E6`)** | — |
