# 4.3 Przewodnik pisania specyfikacji w OpenSpec (Spec-Driven Development)

> **Źródło prawdy:** repozytorium (`docs/04-system-agentow-ai/03-jak-pisac-specyfikacje-openspec.md`) · **Kategoria dokumentacji:** Dokumentacja procesowa — Standard specyfikacji SDD · **Etap SDD:** Specyfikacja i planowanie

Niniejszy przewodnik wyjaśnia krok po kroku, jak w praktyce stosujemy podejście **Spec-Driven Development (SDD)** przy użyciu narzędzia **OpenSpec**.

---

## 1. Kiedy tworzymy specyfikację zmiany w OpenSpec?

| Rodzaj zadania | Czy wymagana jest zmiana w `openspec/changes/`? | Wymagany artefakt przed kodowaniem |
|---|---|---|
| **Historyjka (Story) o rozmiarze ≥ 3 SP** | **TAK (obowiązkowo)** | Zatwierdzona propozycja zmiany w `openspec/changes/rej-123-...` |
| **Każda zmiana lub implementacja reguły gry (`R-nn`)** | **TAK (obowiązkowo)** | Scenariusze `GIVEN / WHEN / THEN` w delcie specyfikacji + lista testów `Rnn_...` |
| **Każda modyfikacja 5 kontraktów (`Rejoltance.Contracts`)** | **TAK (obowiązkowo + decyzja ADR)** | Zmiana OpenSpec z plikiem `design.md` oraz dokument ADR zatwierdzony przez 2 osoby |
| **Drobna poprawka błędu, stylów CSS lub dokumentacji (< 3 SP)** | **NIE (ścieżka szybka)** | Krótki, 5-punktowy plan działania przedstawiony człowiekowi lub wpisany w opis PR |

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

## 3. Cykl życia specyfikacji krok po kroku (Przykład: Zadanie `REJ-45`)

### Krok 1: Utworzenie gałęzi i wygenerowanie propozycji (`/opsx:propose`)

Po utworzeniu gałęzi `feature/REJ-45-choose-order` wywołaj w swoim narzędziu AI polecenie:

- **Claude Code / Gemini CLI:** `/opsx:propose REJ-45 wybór kolejności po mulliganie i rozpoczęcie rundy 1 (R-04, R-10, R-11)`
- **Antigravity / GitHub Copilot:** `/opsx-propose REJ-45 wybór kolejności po mulliganie i rozpoczęcie rundy 1 (R-04, R-10, R-11)`
- **OpenAI Codex:** `$openspec-propose REJ-45 wybór kolejności po mulliganie i rozpoczęcie rundy 1 (R-04, R-10, R-11)`

Agent (korzystając z wiedzy ról `rj-rules-expert` oraz `rj-architect`) utworzy katalog `openspec/changes/rej-45-choose-order/` wraz z kompletem plików.

### Krok 2: Weryfikacja merytoryczna i walidacja techniczna

Przejrzyj wygenerowane pliki pod kątem czterech kryteriów:

1. Czy w `proposal.md` znajduje się klucz Jira (`REJ-45`) oraz wyraźna sekcja **Poza zakresem (Out of Scope)**?
2. Czy każde zmieniane lub dodawane wymaganie w `specs/<obszar>/spec.md` posiada identyfikator `R-nn` oraz co najmniej jeden konkretny scenariusz `GIVEN / WHEN / THEN` oparty na wartościach liczbowych z prototypu?
3. Czy w `tasks.md` każde zadanie ma pracochłonność **≤ 4 h** i wskazuje dokładną nazwę testu xUnit/Vitest (np. `R04_different_order_choices_respect_wants_first_preference`)?
4. Uruchom walidator CLI:

   ```bash
   npx openspec validate rej-45-choose-order --strict
   ```

### Krok 3: Bramka akceptacji człowieka (Human Approval Gate)

Zatwierdź pliki propozycji na swojej gałęzi i pokaż je Product Ownerowi sprintu lub właścicielowi epiku. **Kodowanie rozpoczynamy dopiero po uzyskaniu akceptacji specyfikacji.** Zapobiega to pisaniu kodu, który trzeba byłoby przepisywać po Code Review.

### Krok 4: Implementacja według `tasks.md` (`/opsx:apply`)

Wywołaj `/opsx:apply` (lub realizuj kolejne punkty z `tasks.md` z pomocą `rj-backend-engineer` / `rj-frontend-engineer`). Dla każdego punktu najpierw powstaje test, a następnie implementacja. Po ukończeniu każdego kroku zadanie w `tasks.md` jest oznaczane jako `[x]`.

### Krok 5: Archiwizacja po scaleniu Pull Requesta (`/opsx:archive`)

Po zatwierdzeniu i scaleniu Pull Requesta wywołaj `/opsx:archive`. Narzędzie OpenSpec automatycznie włączy zmiany z delty do głównej specyfikacji w `openspec/specs/` i przeniesie katalog zmiany do `openspec/changes/archive/`.

---

## 4. Standard formatowania wymagań i scenariuszy w OpenSpec

Walidator `openspec validate --all --strict` (uruchamiany w każdym przebiegu CI) wymaga zachowania angielskich słów kluczowych struktury Markdown przy polskojęzycznej treści merytorycznej:

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

1. Nagłówki muszą mieć dokładną postać `### Requirement: <ID i tytuł>` oraz `#### Scenario: <Tytuł scenariusza>`.
2. Treść wymagania pod nagłówkiem `### Requirement:` musi zawierać słowo kluczowe **`SHALL`** lub **`MUST`** (pisane wielkimi literami) i nie powinna przekraczać 500 znaków (szczegółowe przypadki umieszczaj w sekcjach `#### Scenario:`).
3. Każdy scenariusz musi zawierać punkty **`- **GIVEN** ...`**, **`- **WHEN** ...`** oraz **`- **THEN** ...`**.
