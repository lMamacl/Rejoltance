# Testowy import CSV do Jiry PB

Cel: zanim zaimportujemy cały backlog, sprawdzamy na 3 zgłoszeniach, jak Jira PB (Server/Data Center) mapuje pola.
Zgłoszenia mają prefiks `[TEST]` i etykietę `test-import`. **Po teście je usuń.**

## Kroki (wykonuje osoba z uprawnieniami do projektu)

1. Jira → ⚙ (albo menu *Issues*) → **Import issues from CSV** (System → External System Import → CSV).
2. Wybierz plik **`jira-test-01-epic.csv`** → projekt zespołu → kodowanie UTF-8, separator `,`.
   Mapowanie: `Issue Id` → Issue Id, `Issue Type` → Issue Type, `Summary` → Summary,
   `Epic Name` → Epic Name, `Description` → Description, `Labels` → Labels.
3. Po imporcie epiku zaimportuj plik **`jira-test-02-story-subtask.csv`**.
   Dodatkowo zmapuj: `Parent Id` → Parent Id, `Epic Link` → Epic Link, `Story Points` → Story Points,
   `Original Estimate` → Original Estimate.
4. Sprawdź wynik i zapisz go w tabeli poniżej (albo przekaż zespołowi, co wyszło).

## Co sprawdzamy

| # | Pytanie | Wynik |
|---|---|---|
| 1 | Czy Story jest podpięta pod epik (Epic Link = nazwa epiku)? | |
| 2 | Czy Sub-task ma rodzica (Parent Id → Issue Id historyjki)? | |
| 3 | Czy `Original Estimate = 14400` daje **4h** (wartość w sekundach)? Jeśli wyszło 14400h albo 4d, format jest inny | |
| 4 | Czy pole Story Points jest dostępne na ekranie (schemat „Pracownia projektowa”)? | |
| 5 | Czy wielowierszowy opis z kryteriami Given/When/Then zachował podział wierszy? | |
| 6 | Jaki jest klucz projektu (np. `REJ`)? | |

Zapisz też ostrzeżenia, jeśli kreator importu je pokazał. Na ich podstawie dopasujemy generator `tools/backlog/gen_jira_csv.py`.
