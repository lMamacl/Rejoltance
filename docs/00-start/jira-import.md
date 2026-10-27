# Import backlogu do Jiry PB

Jira PB to **Server/Data Center** (`https://devtools.wi.pb.edu.pl/jira`). Projekt zakłada prowadzący; import robi osoba z rolą Administrator lub Product Owner w projekcie.

## 0. Najpierw próba (raz)

Zaimportuj 3 zgłoszenia z [`docs/05-backlog/test-import/`](../05-backlog/test-import/README.md) i wypełnij tabelę wyników.
Najważniejsze: czy `Original Estimate = 14400` daje **4h**. Jeśli nie — w `backlog.toml` ustaw `estimate_format = "jira"` (format `4h`) i wygeneruj pliki ponownie.

## 1. Przygotuj pliki

```bash
python tools/backlog/gen_jira_csv.py
```

Powstają `docs/05-backlog/jira-01-epics.csv` i `jira-02-issues.csv` (UTF‑8, separator `,`). Pozycje z wpisanym kluczem (`jira = "REJ-…"`) są pomijane.

## 2. Import epików

Jira → ⚙ **System** → **External System Import** → **CSV** (albo *Issues → Import issues from CSV*).

1. Plik `jira-01-epics.csv`, kodowanie **UTF-8**, separator `,`.
2. Projekt docelowy: projekt zespołu.
3. Mapowanie kolumn:

| Kolumna CSV | Pole Jiry |
|---|---|
| Issue Id | Issue Id |
| Issue Type | Issue Type (`Epic`) |
| Summary | Summary |
| Epic Name | Epic Name |
| Description | Description |
| Labels | Labels |
| Component/s | Component/s (pozwól utworzyć nowe wartości) |

## 3. Import story i sub‑tasków

Plik `jira-02-issues.csv`. Dodatkowe mapowania:

| Kolumna CSV | Pole Jiry |
|---|---|
| Parent Id | Parent Id (sub‑task → story z tego samego pliku) |
| Epic Link | Epic Link (wartość = *Epic Name*, np. `E1 Silnik reguł (Kernel)`) |
| Story Points | Story Points |
| Original Estimate | Original Estimate |
| Priority | Priority |
| Labels (×3) | Labels (`w1`, `sprint-2`, `rejoltance`) |

Epiki muszą już istnieć (krok 2) — inaczej *Epic Link* się nie połączy (Server/DC łączy po nazwie epiku).

## 4. Po imporcie

1. Utwórz sprinty S1–S5 na tablicy i przeciągnij story według etykiet `sprint-N` (filtr JQL: `labels = sprint-1`).
2. Wpisz nadane klucze do `backlog.toml` (`jira = "REJ-12"` przy epiku/story/tasku) i zacommituj — kolejny eksport nie zdubluje zgłoszeń.
3. Ustaw w projekcie schematy „Pracownia projektowa” (workflow `Open → In Progress → Resolved → Closed`) — instrukcja pracowni.

## Problemy

| Objaw | Rozwiązanie |
|---|---|
| polskie znaki jako `Ä…` | wybierz kodowanie UTF‑8 w kreatorze |
| story bez epiku | zaimportuj najpierw epiki; sprawdź, czy *Epic Link* = dokładna nazwa epiku |
| brak pola Story Points na ekranie | poproś prowadzącego o dodanie pola do schematu ekranów projektu |
| estymaty 1000× za duże | zmień `estimate_format` (krok 0) |
