# 5.8 Szablon QA: Plan Testów i Specyfikacja Przypadków Testowych

> **Źródło prawdy:** Confluence PB / Repozytorium · **Kategoria AltexSoft:** Product: System Documentation — Quality Assurance (Test Plan & Test Case Specifications) · **Etap SDD:** Weryfikacja (`Verify`) · **Wymóg uczelniany:** EU6

Wypełnij plan na początku sprintu i zastąp pola w nawiasach `<...>`. QA to quality assurance (zapewnienie jakości), SDD — spec-driven development (praca sterowana specyfikacją), EU — efekt uczenia się, NFR — wymaganie niefunkcjonalne, CI — ciągła integracja, E2E — test end-to-end całej aplikacji.

---

## 1. Metadane planu testów sprintu

| Pole | Wartość |
|---|---|
| **Sprint / wydanie** | `Sprint N` (`sprint-N`) |
| **Lider QA w sprincie** | `<Imię i nazwisko>` |
| **Historyjki objęte planem** | `<Lista kluczy Jira: REJ-...>` |
| **Reguły domenowe i NFR objęte planem** | `<Lista R-nn oraz NFR-nn>` |
| **Środowisko testowe** | `<Lokalne dev / GitHub Actions CI / Serwer demo Docker Compose>` |

---

## 2. Zakres testów w sprincie

- **Co testujemy (In Scope):** `<Lista nowych i zmodyfikowanych funkcji w sprincie>`
- **Czego nie testujemy w tym sprincie (Out of Scope):** `<Lista wraz z uzasadnieniem>`
- **Kryteria wejścia (Entry Criteria):** kod się buduje i przechodzi statyczną analizę typów (`dotnet build -warnaserror`, `npm run typecheck`).
- **Kryteria wyjścia (Exit Criteria / Definition of Done):** 100% testów automatycznych przechodzi w CI, 0 otwartych defektów o priorytecie `P0` i `P1`, lista kontrolna E2E jest wykonana.

---

## 3. Specyfikacja przypadków testowych (Test Case Specifications)

| ID testu | Tytuł przypadku testowego | Powiązane wymaganie (`R-nn` / `NFR-nn` / `REJ-...`) | Poziom testu (`Unit / Integration / E2E`) | Warunki wstępne (`GIVEN`) | Kroki testowe (`WHEN`) | Oczekiwany wynik (`THEN`) | Automatyzacja (plik testu) |
|---|---|---|---|---|---|---|---|
| `TC-01` | | | `Unit (xUnit)` | | | | `tests/...` |
| `TC-02` | | | `Integration` | | | | `tests/...` |
| `TC-03` | | | `E2E (Playwright)` | | | | `tests/e2e/...` |
