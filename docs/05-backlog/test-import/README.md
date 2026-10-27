# Testowy import CSV do Jiry PB

Cel: przed importem całego backlogu sprawdzić na 3 zgłoszeniach, jak Jira PB (Server/Data Center) mapuje pola.
Zgłoszenia mają prefiks `[TEST]` i etykietę `test-import`. **Po teście usuń je.**

## Kroki (robi osoba z uprawnieniami do projektu)

1. Jira → ⚙ (lub menu *Issues*) → **Import issues from CSV** (System → External System Import → CSV).
2. Plik **`jira-test-01-epic.csv`** → projekt zespołu → kodowanie UTF-8, separator `,`.
   Mapowanie: `Issue Id` → Issue Id, `Issue Type` → Issue Type, `Summary` → Summary,
   `Epic Name` → Epic Name, `Description` → Description, `Labels` → Labels.
3. Po imporcie epiku: plik **`jira-test-02-story-subtask.csv`**.
   Dodatkowo: `Parent Id` → Parent Id, `Epic Link` → Epic Link, `Story Points` → Story Points,
   `Original Estimate` → Original Estimate.
4. Sprawdź i zapisz wynik w tabeli poniżej (lub napisz mi, co wyszło).

## Co sprawdzamy

| # | Pytanie | Wynik |
|---|---|---|
| 1 | Czy Story jest podpięta pod epik (Epic Link = nazwa epiku)? | |
| 2 | Czy Sub-task ma rodzica (Parent Id → Issue Id historyjki)? | |
| 3 | Czy `Original Estimate = 14400` daje **4h** (sekundy)? Jeśli wyszło 14400h/4d — format jest inny | |
| 4 | Czy pole Story Points jest dostępne na ekranie (schemat „Pracownia projektowa”)? | |
| 5 | Czy wieloliniowy opis z kryteriami Given/When/Then zachował podział wierszy? | |
| 6 | Jaki jest klucz projektu (np. `REJ`)? | |

Zapisz też, jeśli kreator importu pokazał ostrzeżenia — dopasuję generator `tools/backlog/gen_jira_csv.py`.
