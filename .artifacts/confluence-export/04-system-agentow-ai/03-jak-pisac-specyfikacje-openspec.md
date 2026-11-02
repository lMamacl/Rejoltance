<!-- CONFLUENCE 1:1 EXPORT | Source: docs/04-system-agentow-ai/03-jak-pisac-specyfikacje-openspec.md @ a2bf2a4 (2026-11-02) -->
# 4.3 Przewodnik pisania specyfikacji w OpenSpec (Spec-Driven Development)

> **Źródło prawdy:** repozytorium (`docs/04-system-agentow-ai/03-jak-pisac-specyfikacje-openspec.md`) · **Kategoria dokumentacji:** Dokumentacja procesowa — standard specyfikacji SDD · **Etap SDD:** specyfikacja i planowanie

Ten przewodnik pokazuje krok po kroku, jak w praktyce pracujemy w podejściu **Spec-Driven Development (SDD)**, czyli „najpierw specyfikacja, potem kod”. Używamy do tego narzędzia **OpenSpec**.

---

## 1. Kiedy tworzymy specyfikację zmiany w OpenSpec?

SP (story points) to punktowa wycena wielkości historyjki.

| Rodzaj zadania | Czy potrzebna jest zmiana w `openspec/changes/`? | Co musi istnieć przed kodowaniem |
|---|---|---|
| **Historyjka (story) o rozmiarze ≥ 3 SP** | **Tak** | Zatwierdzona propozycja zmiany w `openspec/changes/rej-123-...` |
| **Każda zmiana lub implementacja reguły gry (`R-nn`)** | **Tak** | Scenariusze `GIVEN / WHEN / THEN` w delcie specyfikacji i lista testów `Rnn_...` |
| **Każda zmiana 5 kontraktów (`Rejoltance.Contracts`)** | **Tak, plus decyzja ADR** | Zmiana OpenSpec z plikiem `design.md` i ADR (Architecture Decision Record) zatwierdzony przez 2 osoby |
| **Drobna poprawka błędu, stylów CSS lub dokumentacji (< 3 SP)** | **Nie (ścieżka szybka)** | Krótki plan w 5 punktach, pokazany człowiekowi albo wpisany w opis PR (pull requesta) |

---

## 2. Struktura katalogu `openspec/`

```text
openspec/
├── config.yaml                          # Konfiguracja projektu i reguły walidacji dla agentów
├── specs/                               # ŻYWA SPECYFIKACJA SYSTEMU (Stan aktualny — 10 obszarów)
│   ├── match-setup/spec.md              # Reguły R-01..R-04 (przygotowanie meczu, mulligan)
│   ├── round-flow/spec.md               # Reguły R-10..R-15 (przebieg rundy, Blood, Fatigue)
│   ├── playing-cards/spec.md            # Reguły R-20..R-25 (zagrywanie kart, koszty, cele)
│   ├── combat/spec.md                   # Reguły R-30..R-35 (walka na 4 liniach, Flying)
│   ├── keywords/spec.md                 # Reguły R-40..R-48 (słowa kluczowe i statusy)
│   ├── death-and-removal/spec.md        # Reguły R-50..R-54 (śmierć, Sacrifice, Silence)
│   ├── card-effects/spec.md             # Reguły R-60..R-69 (interpreter efektów DSL)
│   ├── match-end/spec.md                # Reguły R-70..R-73 (warunki zwycięstwa, remis, poddanie)
│   ├── server-authority/spec.md         # Reguły R-80..R-84 (Fog of War, determinizm, Pending)
│   └── quality-attributes/spec.md       # Wymagania niefunkcjonalne NFR-01..NFR-70 (ISO 25010)
│
└── changes/                             # PROPOZYCJE ZMIAN W TOKU (SDD Workflow)
    ├── rej-45-choose-order/             # Przykład otwartej zmiany dla zadania REJ-45
    │   ├── proposal.md                  # 1. Dlaczego i co zmieniamy (zakres + poza zakresem)
    │   ├── specs/                       # 2. Delta wymagań (ADDED / MODIFIED / REMOVED)
    │   │   └── match-setup/spec.md
    │   ├── design.md                    # 3. Projekt techniczny zmiany (TDD — moduły, kontrakty)
    │   └── tasks.md                     # 4. Lista zadań implementacyjnych ≤ 4 h z nazwami testów
    └── archive/                         # Archiwum zrealizowanych i scalonych zmian
```

---

## 3. Cykl życia specyfikacji krok po kroku (przykład: zadanie `REJ-45`)

### Krok 1: Utwórz gałąź i wygeneruj propozycję (`/opsx:propose`)

Utwórz gałąź `feature/REJ-45-choose-order`. Potem wywołaj w swoim narzędziu AI polecenie:

- **Claude Code / Gemini CLI:** `/opsx:propose REJ-45 wybór kolejności po mulliganie i rozpoczęcie rundy 1 (R-04, R-10, R-11)`
- **Antigravity / GitHub Copilot:** `/opsx-propose REJ-45 wybór kolejności po mulliganie i rozpoczęcie rundy 1 (R-04, R-10, R-11)`
- **OpenAI Codex:** `$openspec-propose REJ-45 wybór kolejności po mulliganie i rozpoczęcie rundy 1 (R-04, R-10, R-11)`

Agent (korzystając z wiedzy ról `rj-spec-analyst` i `rj-architect`) utworzy katalog `openspec/changes/rej-45-choose-order/` ze wszystkimi plikami zmiany.

### Krok 2: Sprawdź treść i uruchom walidator

Przejrzyj wygenerowane pliki i sprawdź cztery rzeczy:

1. Czy w `proposal.md` jest klucz Jira (`REJ-45`) i wyraźna sekcja **Poza zakresem (Out of Scope)**?
2. Czy każde zmieniane lub dodawane wymaganie w `specs/<obszar>/spec.md` ma identyfikator `R-nn` i co najmniej jeden konkretny scenariusz `GIVEN / WHEN / THEN` z wartościami liczbowymi z prototypu?
3. Czy w `tasks.md` każde zadanie ma szacunek **≤ 4 h** i podaje dokładną nazwę testu xUnit/Vitest (np. `R04_different_order_choices_respect_wants_first_preference`)?
4. Uruchom walidator CLI:

   ```bash
   npx openspec validate rej-45-choose-order --strict
   ```

### Krok 3: Akceptacja człowieka (*human approval gate*)

Zapisz pliki propozycji w commicie na swojej gałęzi i pokaż je PO (Product Ownerowi) sprintu albo właścicielowi epiku. **Kod piszemy dopiero po akceptacji specyfikacji.** Dzięki temu nie piszemy kodu, który po code review trzeba by przepisać.

### Krok 4: Implementuj według `tasks.md` (`/opsx:apply`)

Wywołaj `/opsx:apply` albo realizuj kolejne punkty z `tasks.md` z pomocą właściwego agenta: `rj-rules-engineer` (reguły w `Rejoltance.Kernel`, jak w tym przykładzie), `rj-backend-engineer` (serwer) albo `rj-frontend-engineer` (klient web). W każdym punkcie najpierw piszesz test, potem implementację. Po skończeniu kroku oznaczasz zadanie w `tasks.md` jako `[x]`.

### Krok 5: Zarchiwizuj zmianę po scaleniu pull requesta (`/opsx:archive`)

Gdy pull request zostanie zatwierdzony i scalony, wywołaj `/opsx:archive`. OpenSpec przeniesie zmiany z delty do głównej specyfikacji w `openspec/specs/`, a katalog zmiany przeniesie do `openspec/changes/archive/`.

---

## 4. Jak formatować wymagania i scenariusze w OpenSpec

Walidator `openspec validate --all --strict` działa w każdym przebiegu CI (ciągłej integracji). Treść piszemy po polsku, ale słowa kluczowe struktury Markdown muszą zostać po angielsku:

```markdown
## MODIFIED Requirements

### Requirement: R-04 Wybór kolejności rozpoczęcia gry

Po zakończeniu mulliganu przez obu graczy system SHALL przyjąć od każdego gracza deklarację `wantsFirst` określającą, czy chce on rozpoczynać rundę 1 jako Gracz A.

#### Scenario: Gracze wybierają przeciwne preferencje

- **GIVEN** obaj gracze zakończyli fazę mulliganu
- **WHEN** gracz 0 wysyła `chooseOrder(wantsFirst: true)`, a gracz 1 wysyła `chooseOrder(wantsFirst: false)`
- **THEN** rundę 1 rozpoczyna gracz 0, a obaj gracze otrzymują `1/1 Blood`

#### Scenario: Gracze wybierają tę samą preferencję

- **GIVEN** obaj gracze zakończyli fazę mulliganu
- **WHEN** obaj gracze wysyłają `chooseOrder(wantsFirst: true)`
- **THEN** gracz rozpoczynający rundę 1 zostaje wylosowany deterministycznie za pomocą `SeededRng` meczu
```

### Najważniejsze reguły walidatora OpenSpec

1. Nagłówki mają dokładnie postać `### Requirement: <ID i tytuł>` oraz `#### Scenario: <Tytuł scenariusza>`.
2. Treść wymagania pod nagłówkiem `### Requirement:` zawiera słowo kluczowe **`SHALL`** albo **`MUST`** (wielkimi literami) i ma najwyżej 500 znaków. Szczegółowe przypadki opisuj w sekcjach `#### Scenario:`.
3. Każdy scenariusz zawiera punkty **`- **GIVEN** ...`**, **`- **WHEN** ...`** i **`- **THEN** ...`**.
