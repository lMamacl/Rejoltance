# 1.11 Strategia zapewnienia jakości i testów automatycznych (QA)

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/11-strategia-testow-qa.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — systemowa (zapewnienie jakości i strategia testów) · **Etap SDD:** Weryfikacja · **Wymóg uczelniany:** EU6

Ten dokument opisuje strategię QA (Quality Assurance, czyli zapewnienia jakości) w projekcie RE:JOLTANCE. Znajdziesz tu:

- poziomy testów w piramidzie testowej i narzędzia,
- zasady łączenia wymagań z testami,
- kryteria wejścia i wyjścia dla Pull Requestów i sprintów.

SDD (Spec-Driven Development) to nasz sposób pracy: najpierw specyfikacja, potem kod. Testy należą do ostatniego etapu tego cyklu, czyli *Weryfikacji*.

Gotowe szablony do użycia w każdym sprincie są w katalogu [`05-szablony/`](../05-szablony/README.md):

- [`szablon-qa-plan-testow.md`](../05-szablony/szablon-qa-plan-testow.md) — plan testów sprintu i specyfikacja przypadków testowych,
- [`szablon-qa-raport-i-checklista.md`](../05-szablony/szablon-qa-raport-i-checklista.md) — raport z wykonania testów i lista kontrolna przed wydaniem.

---

## 1. Podstawowe zasady jakości w SDD

1. **Test to wykonywalna specyfikacja (Konstytucja, Art. VI).** Każda reguła gry (`R-01..R-84`) ma test automatyczny. Ma go też każde wymaganie niefunkcjonalne (NFR, Non-Functional Requirement; `NFR-01..NFR-70`), które da się sprawdzić automatycznie. Nazwa testu zaczyna się od numeru wymagania (np. `R14_drawing_from_empty_deck_deals_growing_fatigue_damage`).
2. **Nie osłabiamy testów.** Gdy test nie przechodzi, nie usuwamy asercji, nie wyłączamy testu atrybutem `[Fact(Skip = ...)]` i nie zmieniamy oczekiwanego wyniku. Wyjątek: zespół formalnie zdecydował o zmianie specyfikacji.
3. **Bramka CI (*zero broken builds*).** CI (Continuous Integration) to automatyczne budowanie i testowanie kodu. Nie scalamy Pull Requesta do `develop` ani `main`, jeśli którykolwiek etap GitHub Actions (`dotnet`, `web`, `repo`) skończył się błędem.
4. **Najpierw odtwórz błąd, potem go napraw.** Dla każdego błędu z sesji testowych lub z *Sprint Review* najpierw piszemy test jednostkowy lub integracyjny, który go odtwarza. Dopiero potem piszemy poprawkę.

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

### Poziomy testów i narzędzia

| Poziom testów | Projekt / lokalizacja | Narzędzia | Co sprawdza | Kiedy uruchamiamy | Stan (Sprint 0) |
|---|---|---|---|---|---|
| **1. Jednostkowe reguł i danych** | `tests/Rejoltance.Kernel.Tests` | xUnit | Reguły `R-nn`, determinizm `SeededRng`, projekcję `Projection.ToView` (*Fog of War*, R-80…R-82), walidację 78 kart i 5 talii w `CardCatalog`. | Przy każdej zmianie kodu i w każdym PR (`< 2 s`) | **Aktywne (25 testów)** |
| **2. Granice architektoniczne** | `tests/Rejoltance.Architecture.Tests` | xUnit + `NetArchTest.Rules` | Jednokierunkowe zależności między modułami, brak logiki w `Rejoltance.Contracts`, brak mutowalnych pól statycznych (`NFR-50`). | W każdym PR (`< 1 s`) | **Aktywne (11 testów)** |
| **3. Integracyjne serwera i kontraktu** | `tests/Rejoltance.Server.Tests` | `WebApplicationFactory` + `SignalR.Client` | Endpointy REST, hub SignalR, autoryzację miejsc przy stole, generowanie i walidację próbki `match-view.sample.json` (`NFR-11`). | W każdym PR (`~15 s`) | **Aktywne (7 testów)** |
| **4. Jednostkowe i komponentowe UI** | `src/web/src/**/*.test.ts(x)` | Vitest + React Testing Library + jsdom | Renderowanie `MatchView`, obsługę intencji w magazynie `Zustand` na sztucznym transporcie, zgodność typów TS z próbką JSON. | W każdym PR (`~2 s`) | **Aktywne (5 testów)** |
| **5. Smoke test całej aplikacji** | `tests/Rejoltance.AppHost.Tests` | `Aspire.Hosting.Testing` (`Category=Integration`) | Start całego orkiestratora Aspire (`server` + `web`), punkt `/health` i proxy Vite (`NFR-60`). | W każdym przebiegu CI na GitHubie (`~1–2 min`) | **Aktywne (2 testy)** |
| **6. Walidacja specyfikacji i dokumentacji** | Katalog główny (`npm run check`) | `openspec validate --strict`, `markdownlint-cli2`, skrypty `--check` | Strukturę wymagań i scenariuszy `GIVEN/WHEN/THEN`, spójność adapterów agentów AI, kart JSON i plików CSV backlogu. | W każdym PR (`~3 s`) | **Aktywne (10 specyfikacji + wszystkie pliki MD)** |
| **7. Testy różnicowe z wyrocznią JS** | `src/Rejoltance.Sim` *(planowane)* | Node.js (`engine.js`) + xUnit | Porównuje przejścia stanów w prototypie JS i w Kernelu C# dla tych samych danych wejściowych. | Od Sprintu 2 (`E5-S02`) | Zaplanowane |
| **8. Masowe symulacje stabilności** | `src/Rejoltance.Sim` *(planowane)* | Symulator bot-vs-bot | 300 pełnych partii bot-vs-bot. Szuka zakleszczeń, przekroczeń limitu reakcji i naruszeń niezmienników (`NFR-51`). | Od Sprintu 4 (`E5-S04`) | Zaplanowane |
| **9. Testy przeglądarkowe E2E** | `tests/e2e` *(planowane)* | Playwright (Chromium, Firefox, WebKit) | Cały przepływ użytkownika w prawdziwych przeglądarkach: utworzenie meczu, mulligan, zagranie karty, koniec pojedynku (`NFR-10`). | Od Sprintu 1 (`E6-S01`) | Zaplanowane |
| **10. Testy użyteczności (UAT)** | Sesje z Radą Graczy | Scenariusze testowe + obserwacja | Łatwość nauki (`NFR-20` ≤ 15 min) i czytelność podpowiedzi interfejsu (`NFR-21`). | Na *Sprint Review* S3 i S5 | Szablon gotowy |

---

## 3. Standardy pisania testów w projekcie

### 3.1 Nazwy testów i struktura `GIVEN / WHEN / THEN`

Każdy test reguły w `tests/Rejoltance.Kernel.Tests/` odpowiada scenariuszowi w `openspec/specs/` i wierszowi w indeksie [`03-indeks-regul-r-nn.md`](03-indeks-regul-r-nn.md). Testy kart trafią do osobnego projektu `tests/Rejoltance.Cards.Tests`. Ten projekt jest planowany i jeszcze nie istnieje. Przykład:

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

- Testy w `Rejoltance.Kernel.Tests` nie korzystają z systemu plików, sieci ani bazy danych. Stan początkowy budujemy fabryką `TestMatches` i niemutowalnymi wyrażeniami `with { ... }`.
- Wolne testy, które uruchamiają całe środowisko Aspire, oznaczamy atrybutem `[Trait("Category", "Integration")]`. Dzięki temu na co dzień uruchamiasz `dotnet test Rejoltance.slnx --filter "Category!=Integration"` i masz wynik w kilka sekund.

---

## 4. Kryteria wejścia i wyjścia testowania

| Etap | Kryteria wejścia (*entry criteria*) | Kryteria wyjścia (*exit criteria* / Definition of Done) |
|---|---|---|
| **Implementacja zadania (story / sub-task)** | 1. Są kryteria akceptacji `GIVEN/WHEN/THEN`.<br/>2. Dla zadań ≥ 3 SP (story points) jest zatwierdzona propozycja zmiany w `openspec/changes/` z listą testów w `tasks.md`. | 1. Testy jednostkowe/integracyjne dla wszystkich dotkniętych reguł `R-nn` / `NFR-nn` są napisane i przechodzą.<br/>2. Kolumny `Test` i `Status` w `03-indeks-regul-r-nn.md` są aktualne. |
| **Scalenie Pull Requesta do `develop`** | 1. Kod jest zsynchronizowany z bieżącym `develop`.<br/>2. Opis PR zawiera listę komend testowych uruchomionych lokalnie. | 1. Wszystkie 3 zadania GitHub Actions CI (`dotnet`, `web`, `repo`) są zielone.<br/>2. Co najmniej jedna osoba z zespołu zatwierdziła kod (*Approve*). |
| **Zamknięcie sprintu (Sprint Review)** | 1. Zaplanowane zadania są scalone do `develop`, istnieje PR `develop → main`.<br/>2. Jest plan testów sprintu wg szablonu `szablon-qa-plan-testow.md`. | 1. 0 otwartych błędów krytycznych (`P0`) i poważnych (`P1`).<br/>2. W Confluence jest raport z testów sprintu (`szablon-qa-raport-i-checklista.md`) oparty na artefakcie `dotnet-test-results` (TRX) z CI. |
