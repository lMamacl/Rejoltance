<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/11-strategia-testow-qa.md -->
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
2. **Nie osłabiamy testów.** Gdy test nie przechodzi, nie usuwamy asercji, nie wyłączamy testu (`it.skip`) i nie zmieniamy oczekiwanego wyniku. Wyjątek: zespół formalnie zdecydował o zmianie specyfikacji.
3. **Bramka CI (*zero broken builds*).** CI (Continuous Integration) to automatyczne budowanie i testowanie kodu. Nie scalamy Pull Requesta do `develop` ani `main`, jeśli którykolwiek etap GitHub Actions (`Lint, typecheck, tests, build`, `Specs, docs, agents, content`, `naming`) skończył się błędem.
4. **Najpierw odtwórz błąd, potem go napraw.** Dla każdego błędu z sesji testowych lub z *Sprint Review* najpierw piszemy test jednostkowy lub integracyjny, który go odtwarza. Dopiero potem piszemy poprawkę.

---

## 2. Piramida testów projektu RE:JOLTANCE

```text
                       ▲  Mniej testów, dłuższy czas wykonania, pełna integracja
      Testy Użyteczności │  Sesje z Radą Graczy (NFR-20, NFR-21) — raporty w Confluence
          Testy E2E      │  Playwright: Chromium, Firefox, WebKit (od Sprintu 1 — E6-S01)
    Testy Integracyjne   │  apps/server/test: REST (inject) + prawdziwe połączenie Socket.IO
     Testy Kontraktu     │  Złoty plik match-view.sample.json (silnik zapisuje ↔ klient używa)
   Granice modułów       │  ESLint (no-restricted-imports) + tools/architecture.test.ts
  Testy Jednostkowe UI   │  Vitest + Testing Library (apps/web): komponenty i store Zustand
 Testy Jednostkowe Reguł │  packages/engine/test, packages/content/test: R-nn, determinizm, Fog of War
                       ▼  Najwięcej testów, czas wykonania < 2 s, pełna izolacja
```

### Poziomy testów i narzędzia

| Poziom testów | Lokalizacja | Narzędzia | Co sprawdza | Kiedy uruchamiamy | Stan |
|---|---|---|---|---|---|
| **1. Jednostkowe reguł i danych** | `packages/engine/test`, `packages/content/test` | Vitest | Reguły `R-nn`, determinizm RNG, projekcję `toView` (*Fog of War*, R-80…R-82), walidację 159 kart i 4 talii. | Przy każdej zmianie kodu i w każdym PR (`< 2 s`) | **Aktywne** |
| **2. Granice modułów** | `eslint.config.js`, `tools/architecture.test.ts` | ESLint + Vitest | Jednokierunkowe zależności między pakietami, determinizm silnika (zakaz `Math.random`, `Date`, `node:*`), brak zależności zewnętrznych w silniku (`NFR-50`). | W każdym PR | **Aktywne** |
| **3. Integracyjne serwera i kontraktu** | `apps/server/test`, `packages/engine/test/projection.test.ts` | Vitest + `socket.io-client` | Endpointy REST, mecz przez prawdziwe połączenie Socket.IO, odrzucanie niepoprawnych intencji (zod), zgodność projekcji z próbką `match-view.sample.json` (`NFR-11`). | W każdym PR (`~1 s`) | **Aktywne** |
| **4. Jednostkowe i komponentowe UI** | `apps/web/src/**/*.test.ts(x)` | Vitest + React Testing Library + jsdom | Renderowanie `MatchView`, obsługę intencji w magazynie Zustand na sztucznym transporcie. | W każdym PR (`~2 s`) | **Aktywne** |
| **5. Narzędzia repozytorium** | `tools/tools.test.ts` | Vitest | Generowanie CSV do Jiry i konwersję Markdown → XHTML dla Confluence. | W każdym PR | **Aktywne** |
| **6. Walidacja specyfikacji i dokumentacji** | Katalog główny (`npm run check`) | `openspec validate --strict`, `markdownlint-cli2`, generatory `…:check` | Strukturę wymagań i scenariuszy `GIVEN/WHEN/THEN`, spójność adapterów agentów AI, kart JSON, plików CSV backlogu i drzewa Confluence. | W każdym PR | **Aktywne** |
| **7. Testy różnicowe z wyrocznią JS** | *(planowane)* | Vitest + `prototype/game/engine.js` w tym samym procesie | Porównuje przejścia stanów w prototypie i w silniku dla tych samych danych wejściowych. | `E5-S02` | Zaplanowane |
| **8. Masowe symulacje stabilności** | *(planowane)* | Symulator bot-vs-bot | 300 pełnych partii bot-vs-bot; szuka zakleszczeń i naruszeń niezmienników (`NFR-51`). | `E5-S04` | Zaplanowane |
| **9. Testy przeglądarkowe E2E** | `tests/e2e` *(planowane)* | Playwright (Chromium, Firefox, WebKit) | Cały przepływ użytkownika: utworzenie meczu, mulligan, zagranie karty, koniec pojedynku (`NFR-10`). | `E6-S01` | Zaplanowane |
| **10. Testy użyteczności (UAT)** | Sesje z Radą Graczy | Scenariusze testowe + obserwacja | Łatwość nauki (`NFR-20` ≤ 15 min) i czytelność podpowiedzi interfejsu (`NFR-21`). | Na *Sprint Review* S3 i S5 | Szablon gotowy |

---

## 3. Standardy pisania testów w projekcie

### 3.1 Nazwy testów i struktura `GIVEN / WHEN / THEN`

Każdy test reguły w `packages/engine/test/` odpowiada scenariuszowi w `openspec/specs/` i wierszowi w indeksie [`03-indeks-regul-r-nn.md`](03-indeks-regul-r-nn.md). Testy katalogu kart są w `packages/content/test/`. Przykład (Vitest):

```ts
it('R14_drawing_from_empty_deck_deals_growing_fatigue_damage', () => {
  // GIVEN: gracz 0 ma pustą talię i 20 HP
  let { state } = start();
  state = withPlayer(state, 0, { ...playerOf(state, 0), deck: [] });

  // WHEN: gracz 0 dwukrotnie próbuje dobrać kartę
  state = draw(state, 0, []);
  state = draw(state, 0, []);

  // THEN: pierwsza próba zadaje 1 obrażenie, a druga 2 (20 → 17 HP)
  expect(playerOf(state, 0).hp).toBe(17);
});
```

### 3.2 Izolacja i szybkość wykonania

- Testy silnika (`packages/engine/test`) nie korzystają z systemu plików, sieci ani bazy danych. Stan początkowy budujemy funkcją `start(seed)` z `test/helpers.ts`, a zmiany robimy kopiami (`{ ...stan }`), bo stan jest niemutowalny.
- Wszystkie testy (silnik, serwer, klient, narzędzia) uruchamia jedno `npm test` i trwa to kilka sekund; pojedynczą regułę uruchomisz przez `npx vitest run -t R14_`.

---

## 4. Kryteria wejścia i wyjścia testowania

| Etap | Kryteria wejścia (*entry criteria*) | Kryteria wyjścia (*exit criteria* / Definition of Done) |
|---|---|---|
| **Implementacja zadania (story / sub-task)** | 1. Są kryteria akceptacji `GIVEN/WHEN/THEN`.<br/>2. Dla zadań ≥ 3 SP (story points) jest zatwierdzona propozycja zmiany w `openspec/changes/` z listą testów w `tasks.md`. | 1. Testy jednostkowe/integracyjne dla wszystkich dotkniętych reguł `R-nn` / `NFR-nn` są napisane i przechodzą.<br/>2. Kolumny `Test` i `Status` w `03-indeks-regul-r-nn.md` są aktualne. |
| **Scalenie Pull Requesta do `develop`** | 1. Kod jest zsynchronizowany z bieżącym `develop`.<br/>2. Opis PR zawiera listę komend testowych uruchomionych lokalnie. | 1. Wszystkie 3 zadania GitHub Actions CI są zielone.<br/>2. Co najmniej jedna osoba z zespołu zatwierdziła kod (*Approve*). |
| **Zamknięcie sprintu (Sprint Review)** | 1. Zaplanowane zadania są scalone do `develop`, istnieje PR `develop → main`.<br/>2. Jest plan testów sprintu wg szablonu `szablon-qa-plan-testow.md`. | 1. 0 otwartych błędów krytycznych (`P0`) i poważnych (`P1`).<br/>2. W Confluence jest raport z testów sprintu (`szablon-qa-raport-i-checklista.md`) oparty na wynikach testów z CI. |
