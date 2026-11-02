# 5.4 Szablon: Projekt Techniczny Funkcjonalności (Technical Design Document — TDD)

> **Źródło prawdy:** Repozytorium (`openspec/changes/<id-zmiany>/design.md`) · **Kategoria AltexSoft:** Product: System Documentation — Technical Design Document (TDD) · **Etap SDD:** Plan / Zadania (`Plan` / `Tasks`)

Zgodnie z klasyfikacją AltexSoft, **Technical Design Document (TDD)** stanowi niskopoziomowy pomost pomiędzy wysokopoziomową architekturą systemu (**SAD**) a rzeczywistym kodem źródłowym. W naszym procesie SDD dokument ten powstaje jako plik `design.md` wewnątrz katalogu zmiany `openspec/changes/<id-zmiany>/` dla każdego złożonego zadania (≥ 3 SP).

---

## Metadane projektu technicznego

| Pole | Wartość |
|---|---|
| **Zadanie Jira** | `REJ-123` |
| **Identyfikator zmiany OpenSpec** | `openspec/changes/rej-123-<krotki-opis>/` |
| **Powiązane reguły i wymagania** | `R-nn`, `NFR-nn` |
| **Dotknięte moduły** | `<np. Rejoltance.Kernel, Rejoltance.Contracts, src/web>` |
| **Autor projektu** | `<Imię i nazwisko>` |

---

## 1. Cel techniczny i granice zmiany (Goals & Non-Goals)

- **Cel implementacyjny:** `<Co dokładnie ma zostać zbudowane na poziomie komponentów kodu>`
- **Poza zakresem (Non-Goals):** `<Czego świadomie nie zmieniamy w ramach tego projektu>`

## 2. Projekt komponentów i struktur danych (Component & Data Structure Design)

- **Nowe lub modyfikowane klasy / rekordy / komponenty:**
  - `src/<Moduł>/<Plik>.cs`: `<Opis odpowiedzialności, sygnatury metod publicznych, niezmienniki>`
- **Wpływ na 5 zamrożonych kontraktów (`Rejoltance.Contracts` ↔ `src/web/src/contracts`):**
  - `<Brak zmian / Wymagana zmiana kontraktu opisana w ADR-NNNN>`

## 3. Algorytm i przepływ danych (Algorithms & Data Flow)

`<Opis krok po kroku algorytmu rozstrzygania reguły, diagram sekwencji lub pseudokod dla przypadków brzegowych>`

1. Warunek wstępny i walidacja intencji: `...`
2. Aktualizacja niemutowalnego stanu `MatchState`: `...`
3. Emitowane zdarzenia `DomainEvent[]` i wpływ na projekcję `Projection.ToView`: `...`

## 4. Obsługa błędów i zachowanie determinizmu (Error Handling & Determinism)

- **Sytuacje wyjątkowe (Fail Loud):** `<Jakie wyjątki są rzucane przy niepoprawnych danych lub nielegalnej akcji>`
- **Wpływ na `SeededRng`:** `<Czy algorytm pobiera liczby losowe z ziarna i w jakiej kolejności>`

## 5. Rozważane alternatywy implementacyjne

| Opcja implementacyjna | Zalety | Wady | Powód wyboru / odrzucenia |
|---|---|---|---|
| **Opcja 1 (Wybrana)** | | | |
| **Opcja 2 (Prostsza alternatywa)** | | | |

## 6. Plan weryfikacji i testów automatycznych

| Nazwa testu jednostkowego / integracyjnego | Projekt testowy | Scenariusz (`GIVEN / WHEN / THEN`) |
|---|---|---|
| `Rnn_<opis_zachowania>` | `Rejoltance.Kernel.Tests` | `GIVEN ... WHEN ... THEN ...` |
