<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/11-strategia-testow-qa.md @ 10829d3 (2026-11-02) -->
# 1.11 Strategia zapewnienia jakości i testów automatycznych (QA)

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/11-strategia-testow-qa.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — systemowa (Zapewnienie jakości i strategia testów) · **Etap SDD:** Weryfikacja · **Wymóg uczelniany:** EU6

Dokument definiuje kompleksową strategię zapewnienia jakości dla projektu **RE:JOLTANCE**. Określa poziomy testów w piramidzie testowej, narzędzia weryfikacji, zasady śledzenia powiązań między wymaganiami a testami oraz kryteria wejścia i wyjścia dla Pull Requestów i sprintów.

Gotowe szablony operacyjne dla poszczególnych sprintów znajdują się w katalogu [`05-szablony/`](../05-szablony/README.md):

- [`szablon-qa-plan-testow.md`](../05-szablony/szablon-qa-plan-testow.md) — plan testów sprintu i specyfikacja przypadków testowych,
- [`szablon-qa-raport-i-checklista.md`](../05-szablony/szablon-qa-raport-i-checklista.md) — raport z wykonania testów i lista kontrolna przed wydaniem.

---

## 1. Fundamentalne zasady jakości w podejściu SDD

1. **Test jako wykonywalna specyfikacja (Konstytucja, Art. V):** Każde wymaganie funkcjonalne reguł gry (`R-01..R-84`) oraz weryfikowalne automatycznie wymaganie niefunkcjonalne (`NFR-01..NFR-70`) musi posiadać test automatyczny, którego nazwa zaczyna się bezpośrednio od identyfikatora wymagania (np. `R14_drawing_from_empty_deck_deals_growing_fatigue_damage`).
2. **Zakaz osłabiania testów:** W przypadku niepowodzenia testu zabrania się usuwania asercji, wyłączania testu atrybutem `[Fact(Skip = ...)]` lub modyfikowania oczekiwanego wyniku bez formalnej decyzji zespołu o zmianie specyfikacji.
3. **Bramka CI (Zero Broken Builds):** Żaden Pull Request nie może zostać scalony do gałęzi `develop` ani `main`, jeśli którykolwiek z automatycznych etapów potoku GitHub Actions (`dotnet`, `web`, `repo`) zakończył się błędem.
4. **Reprodukcja błędów przed naprawą:** Każdy błąd zgłoszony podczas sesji testowych lub na *Sprint Review* wymaga najpierw napisania testu jednostkowego lub integracyjnego odtwarzającego defekt, a dopiero w kolejnym kroku implementacji poprawki.

---

## 2. Piramida testów projektu RE:JOLTANCE

```text
                       ▲  Mniej testów, dłuższy czas wykonania, pełna integracja
      Testy Użyteczności │  Sesje z Radą Graczy (NFR-20, NFR-21) — raporty w Confluence
          Testy E2E      │  Playwright: Chromium, Firefox, WebKit (od Sprintu 1 — E6-S01)
     Smoke Test AppHost  │  Aspire.Hosting.Testing: start całego środowiska i /health
    Testy Integracyjne   │  Rejoltance.Server.Tests: serwer in-memory + klient SignalR
     Testy Kontraktu     │  Złoty plik match-view.sample.json (C# zapisuje ↔ TS waliduje)
   Testy Architektury    │  Rejoltance.Architecture.Tests: granice modułów i czystość DTO
  Testy Jednostkowe UI   │  Vitest + Testing Library (src/web): komponenty i store Zustand
 Testy Jednostkowe Reguł │  Rejoltance.Kernel.Tests: reguły R-nn, determinizm, Fog of War
                       ▼  Najwięcej testów, czas wykonania < 2 s, pełna izolacja
```

### Zestawienie poziomów testowania i narzędzi

| Poziom testów | Projekt / Lokalizacja | Narzędzia | Co dokładnie weryfikuje? | Częstotliwość uruchamiania | Stan obecny (Sprint 0) |
|---|---|---|---|---|---|
| **1. Jednostkowe reguł i danych** | `tests/Rejoltance.Kernel.Tests` | xUnit | Reguły `R-nn`, determinizm `SeededRng`, projekcja `Projection.ToView` (*Fog of War*), walidacja 78 kart i 5 talii w `CardCatalog`. | Przy każdej zmianie kodu i w każdym PR (`< 2 s`) | **Aktywne (25 testów)** |
| **2. Granice architektoniczne** | `tests/Rejoltance.Architecture.Tests` | xUnit + `NetArchTest.Rules` | Jednokierunkowe zależności między modułami, brak logiki w `Rejoltance.Contracts`, brak mutowalnych pól statycznych (`NFR-50`). | W każdym PR (`< 1 s`) | **Aktywne (11 testów)** |
| **3. Integracyjne serwera i kontraktu** | `tests/Rejoltance.Server.Tests` | `WebApplicationFactory` + `SignalR.Client` | Punkty końcowe REST, hub SignalR, autoryzacja miejsc przy stole oraz generowanie i walidacja próbki `match-view.sample.json` (`NFR-11`). | W każdym PR (`~15 s`) | **Aktywne (7 testów)** |
| **4. Jednostkowe i komponentowe UI** | `src/web/src/**/*.test.ts(x)` | Vitest + React Testing Library + jsdom | Renderowanie widoku `MatchView`, obsługa intencji w magazynie `Zustand` na sztucznym transporcie oraz zgodność typów TS z próbką JSON. | W każdym PR (`~2 s`) | **Aktywne (5 testów)** |
| **5. Smoke test całej aplikacji** | `tests/Rejoltance.AppHost.Tests` | `Aspire.Hosting.Testing` (`Category=Integration`) | Uruchomienie pełnego orkiestratora Aspire (`server` + `web`), weryfikacja punktu `/health` oraz działania proxy Vite (`NFR-60`). | W każdym przebiegu CI na GitHubie (`~1–2 min`) | **Aktywne (2 testy)** |
| **6. Walidacja specyfikacji i dokumentacji** | Katalog główny (`npm run check`) | `openspec validate --strict`, `markdownlint-cli2`, skrypty `--check` | Poprawność strukturalna wymagań i scenariuszy `GIVEN/WHEN/THEN`, spójność adapterów agentów AI, kart JSON oraz plików CSV backlogu. | W każdym PR (`~3 s`) | **Aktywne (10 specyfikacji + wszystkie pliki MD)** |
| **7. Testy różnicowe z wyrocznią JS** | `src/Rejoltance.Sim` *(planowane)* | Node.js (`engine.js`) + xUnit | Porównanie wyników przejść stanów pomiędzy referencyjnym prototypem JS a nowym Kernelem C# na tych samych danych wejściowych. | Od Sprintu 2 (`E5-S02`) | Zaplanowane |
| **8. Masowe symulacje stabilności** | `src/Rejoltance.Sim` *(planowane)* | Symulator bot-vs-bot | Rozegranie 300 pełnych partii między botami w celu wykrycia zakleszczeń, przekroczenia limitu reakcji lub naruszenia niezmienników (`NFR-51`). | Od Sprintu 4 (`E5-S04`) | Zaplanowane |
| **9. Testy przeglądarkowe E2E** | `tests/e2e` *(planowane)* | Playwright (Chromium, Firefox, WebKit) | Pełny przepływ użytkownika w prawdziwych przeglądarkach: utworzenie meczu, mulligan, zagranie karty i zakończenie pojedynku (`NFR-10`). | Od Sprintu 1 (`E6-S01`) | Zaplanowane |
| **10. Testy użyteczności (UAT)** | Sesje z Radą Graczy | Scenariusze testowe + obserwacja | Weryfikacja łatwości nauki (`NFR-20` ≤ 15 min) i czytelności podpowiedzi interfejsu (`NFR-21`). | Na *Sprint Review* S3 i S5 | Szablon gotowy |

---

## 3. Standardy pisania testów w projekcie

### 3.1 Konwencja nazewnicza i struktura `GIVEN / WHEN / THEN`

Każdy test reguły domenowej w `tests/Rejoltance.Kernel.Tests/` jest bezpośrednio powiązany ze scenariuszem w `openspec/specs/` oraz indeksem [`03-indeks-regul-r-nn.md`](03-indeks-regul-r-nn.md):

```csharp
[Fact]
public void R14_drawing_from_empty_deck_deals_growing_fatigue_damage()
{
    // GIVEN: Gracz 0 ma pustą talię i 20 HP
    var state = TestMatches.CreateEmptyDeckState(seat: 0);

    // WHEN: Gracz 0 dwukrotnie próbuje dobrać kartę
    var (afterFirst, _) = MatchEngine.DrawCard(state, seat: 0);
    var (afterSecond, _) = MatchEngine.DrawCard(afterFirst, seat: 0);

    // THEN: Pierwsza próba zadaje 1 obrażenie (19 HP), a druga 2 obrażenia (17 HP)
    Assert.Equal(19, afterFirst.Players[0].Hp);
    Assert.Equal(17, afterSecond.Players[0].Hp);
}
```

### 3.2 Izolacja i szybkość wykonania

- Testy w `Rejoltance.Kernel.Tests` nie mogą dotykać systemu plików, sieci ani bazy danych. Stan początkowy budujemy za pomocą fabryki `TestMatches` oraz wyrażeń niemutowalnych `with { ... }`.
- Wolne testy wymagające uruchomienia całego środowiska Aspire oznaczamy atrybutem `[Trait("Category", "Integration")]`, dzięki czemu podczas codziennego kodowania polecenie `dotnet test Rejoltance.slnx --filter "Category!=Integration"` wykonuje się w kilka sekund.

---

## 4. Kryteria wejścia i wyjścia testowania

| Etap procesu | Kryteria wejścia (Entry Criteria) | Kryteria wyjścia (Exit Criteria / Definition of Done) |
|---|---|---|
| **Implementacja zadania (Story / Sub-task)** | 1. Zdefiniowane kryteria akceptacji `GIVEN/WHEN/THEN`.<br/>2. Dla zadań ≥ 3 SP zatwierdzona propozycja zmiany w `openspec/changes/` z listą testów w `tasks.md`. | 1. Napisane i przechodzące testy jednostkowe/integracyjne dla wszystkich dotkniętych reguł `R-nn` / `NFR-nn`.<br/>2. Zaktualizowana kolumna `Test` i `Status` w `03-indeks-regul-r-nn.md`. |
| **Scalenie Pull Requesta do `develop`** | 1. Kod zsynchronizowany z bieżącą gałęzią `develop`.<br/>2. Wypełniony opis PR z listą uruchomionych lokalnie komend testowych. | 1. Zielony status wszystkich 3 zadań w GitHub Actions CI (`dotnet`, `web`, `repo`).<br/>2. Pozytywna recenzja kodu (*Approve*) od co najmniej jednego członka zespołu. |
| **Zamknięcie Sprintu (Sprint Review)** | 1. Scalenie zaplanowanych zadań do `develop` i utworzenie PR `develop → main`.<br/>2. Przygotowany plan testów sprintu wg szablonu `szablon-qa-plan-testow.md`. | 1. 0 otwartych błędów krytycznych (`P0`) i poważnych (`P1`).<br/>2. Opublikowany w Confluence raport z testów sprintu (`szablon-qa-raport-i-checklista.md`) na bazie artefaktu `dotnet-test-results` (TRX) z CI. |
