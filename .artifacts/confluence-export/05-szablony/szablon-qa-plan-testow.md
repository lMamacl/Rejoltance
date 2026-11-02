<!-- CONFLUENCE 1:1 EXPORT | Source: docs/05-szablony/szablon-qa-plan-testow.md @ 10829d3 (2026-11-02) -->
# 5.8 Szablon QA: Plan Testów i Specyfikacja Przypadków Testowych

> **Źródło prawdy:** Confluence PB / Repozytorium · **Kategoria AltexSoft:** Product: System Documentation — Quality Assurance (Test Plan & Test Case Specifications) · **Etap SDD:** Weryfikacja (`Verify`) · **Wymóg uczelniany:** EU6

---

## 1. Metadane Planu Testów Sprintu

| Pole | Wartość |
|---|---|
| **Sprint / Wydanie** | `Sprint N` (`sprint-N`) |
| **Lider QA w sprincie** | `<Imię i nazwisko>` |
| **Zakres historyjek objętych planem** | `<Lista kluczy Jira: REJ-...>` |
| **Zakres reguł domenowych i NFR** | `<Lista R-nn oraz NFR-nn>` |
| **Środowisko testowe** | `<Lokalne dev / GitHub Actions CI / Serwer demo Docker Compose>` |

---

## 2. Zakres testowania w sprincie

- **Funkcjonalności objęte testami (In Scope):** `<Lista nowych i zmodyfikowanych funkcji w sprincie>`
- **Funkcjonalności wyłączone z testowania w tym sprincie (Out of Scope):** `<Lista wraz z uzasadnieniem>`
- **Kryteria wejścia (Entry Criteria):** kod przechodzi budowanie i statyczną analizę typów (`dotnet build -warnaserror`, `npm run typecheck`).
- **Kryteria wyjścia (Exit Criteria / Definition of Done):** 100% testów automatycznych przechodzi na zielono w CI, 0 otwartych defektów o priorytecie `P0` i `P1`, wykonana lista kontrolna E2E.

---

## 3. Specyfikacja Przypadków Testowych (Test Case Specifications)

| ID Testu | Tytuł przypadku testowego | Powiązane wymaganie (`R-nn` / `NFR-nn` / `REJ-...`) | Poziom testu (`Unit / Integration / E2E`) | Warunki wstępne (`GIVEN`) | Kroki testowe (`WHEN`) | Oczekiwany rezultat (`THEN`) | Automatyzacja (Plik testu) |
|---|---|---|---|---|---|---|---|
| `TC-01` | | | `Unit (xUnit)` | | | | `tests/...` |
| `TC-02` | | | `Integration` | | | | `tests/...` |
| `TC-03` | | | `E2E (Playwright)` | | | | `tests/e2e/...` |
