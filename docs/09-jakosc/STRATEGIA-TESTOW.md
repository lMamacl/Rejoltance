# Strategia testów

**Wersja:** 1.0 · 2026-11-01 · **Źródło prawdy:** repo · Wymóg EU6 (semestr 2: testy automatyczne z udokumentowanymi wynikami i pokryciem).
Plany i raporty z poszczególnych sprintów — Confluence 5.2 / 5.3 (szablony w [`docs/10-szablony/`](../10-szablony/README.md)).

## 1. Cele

1. Każde wymaganie (R‑nn, NFR‑nn) ma test, którego nazwa zaczyna się od numeru wymagania — śledzalność bez dodatkowych tabel.
2. Testy są specyfikacją: test nie jest osłabiany, żeby „przeszło” (konstytucja art. V).
3. Nic nie trafia do `develop` bez zielonego CI.
4. Testy ręczne tylko tam, gdzie automatyzacja nie ma sensu (użyteczność z graczami, NFR-20).

## 2. Poziomy testów

```text
                  ▲ mniej, wolniej, drożej
   Użyteczność     │  sesje z radą graczy (ręczne)                       5.4
   E2E             │  Playwright: 2 przeglądarki, pełny przebieg          [Z] E6-S01
   Smoke aplikacji │  Aspire.Hosting.Testing: cały AppHost, /health, web  tests/Rejoltance.AppHost.Tests
   Integracyjne    │  serwer w pamięci + prawdziwy klient SignalR         tests/Rejoltance.Server.Tests
   Kontrakt        │  próbka MatchView: C# zapisuje, TypeScript sprawdza  ContractSampleTests + contracts.test.ts
   Architektura    │  granice modułów, brak mutowalnego stanu statycznego tests/Rejoltance.Architecture.Tests
   Jednostkowe     │  reguły R‑nn, determinizm, projekcja, katalog kart    tests/Rejoltance.Kernel.Tests
   Klient          │  komponenty i store na fake transporcie (Vitest)     src/web/src/**/*.test.ts(x)
                  ▼ więcej, szybciej, taniej
```

| Poziom | Co sprawdza | Narzędzie | Kiedy | Stan |
|---|---|---|---|---|
| Jednostkowe (Kernel) | reguły gry, determinizm, fog of war, karty | xUnit | każdy PR | [V] 25 testów |
| Architektura | zależności modułów, kontrakty bez logiki | NetArchTest + refleksja | każdy PR | [V] 11 |
| Integracyjne (serwer) | REST, hub, autoryzacja, próbka kontraktu | Mvc.Testing + SignalR.Client | każdy PR | [V] 7 |
| Klient | renderowanie widoku, store, kontrakt TS | Vitest + Testing Library | każdy PR | [V] 5 |
| Smoke aplikacji | AppHost startuje, serwer zdrowy, web proxy działa | Aspire.Hosting.Testing | każdy PR (CI) | [V] 2 |
| Różnicowe | Kernel vs prototyp JS (wyrocznia) | fixtury z Node | od S2 | [Z] E5-S02 |
| Symulacja | 300 partii bot vs bot: brak zawieszeń, determinizm | symulator | od S4 | [Z] E5-S04 |
| E2E | przebiegi gracza w Chromium, Firefox, WebKit | Playwright | każdy PR do `develop` | [Z] E6-S01 |
| Wydajność | NFR-01 (p95 ≤ 200 ms przy 50 meczach) | symulator + telemetria | przed Review S4, S5 | [Z] |
| Użyteczność | NFR-20, NFR-21 | sesje z radą graczy | Review S3, S5 | [Z] |

## 3. Konwencje

- **Nazwy:** `R14_drawing_from_empty_deck_deals_growing_fatigue_damage`, `NFR50_…` — numer wymagania + zdanie po angielsku.
- **Struktura testu:** GIVEN / WHEN / THEN (jak scenariusz w specyfikacji), jedna reguła na test.
- **Dane:** stan budowany z `TestMatches` + `with { … }`; losowość zawsze z seeda.
- **Integracyjne:** tag `[Trait("Category", "Integration")]` dla wolnych testów; szybkie: `dotnet test --filter "Category!=Integration"`.
- **Błąd znaleziony ręcznie** → najpierw test, który go odtwarza, potem poprawka.

## 4. Kryteria wejścia i wyjścia

| Kryterium | Treść |
|---|---|
| Wejście do implementacji | story ma kryteria GIVEN/WHEN/THEN; dla ≥ 3 SP zaakceptowana zmiana OpenSpec z listą testów w `tasks.md` |
| Wyjście z PR | CI zielone (wszystkie poziomy automatyczne), nowe testy dla nowych wymagań, brak pominiętych testów bez zgłoszenia |
| Wyjście ze sprintu | raport 5.3: wyniki, pokrycie wymagań, błędy P0/P1 = 0 |

## 5. Pokrycie i raportowanie

- **Pokrycie wymagań:** `docs/02-rules/RULES-INDEX.md` (kolumna Test) + lista NFR; raport sprintu wylicza wymagania bez testu.
- **Pokrycie kodu:** coverlet (`dotnet test --collect:"XPlat Code Coverage"`), cel Kernel ≥ 80% linii (NFR-51) [Z — raport w CI do dodania].
- **Wyniki:** artefakt `dotnet-test-results` (TRX) z CI → raport 5.3 w Confluence.

## 6. Środowiska

| Środowisko | Do czego |
|---|---|
| lokalne | szybkie testy, debugowanie (uwaga: Smart App Control na Windows — patrz `jak-zaczac.md`) |
| CI (GitHub Actions, ubuntu) | źródło prawdy o wynikach |
| demo | testy użyteczności, wydajności, E2E na wdrożonej wersji |

## 7. Ryzyka

| Ryzyko | Działanie |
|---|---|
| testy integracyjne niestabilne (czas startu) | jeden start AppHosta na klasę testów, limity czasu, logi w CI |
| brak testów dla reguł spornych (D‑nn) | test powstaje dopiero po decyzji zespołu |
| zależność od Windows w testach lokalnych | CI na Linuksie jest rozstrzygające |
