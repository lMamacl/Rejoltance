<!-- CONFLUENCE 1:1 EXPORT | Source: docs/03-dokumentacja-procesowa/02-backlog/instrukcja-importu-jira.md @ a2bf2a4 (2026-11-02) -->
# Instrukcja importu Product Backlogu do systemu Jira PB

> **Źródło prawdy:** repozytorium (`docs/03-dokumentacja-procesowa/02-backlog/instrukcja-importu-jira.md`) · **Kategoria AltexSoft:** Process Documentation — Tooling Guide · **Etap SDD:** dekompozycja zadań (`Tasks`)

Uczelniana Jira (`https://devtools.wi.pb.edu.pl/jira`) działa w wersji **Jira Server / Data Center** (DC). Projekt w Jirze zakłada prowadzący zajęcia. Rejestr produktu (*backlog*) importuje osoba z zespołu, która ma uprawnienia *Administrator* albo *Product Owner*.

---

## Krok 0: Próbny import 3 zgłoszeń testowych (zalecany przed głównym importem)

Zanim zaimportujesz cały backlog, sprawdź konfigurację projektu na małym zestawie z katalogu [`test-import/`](test-import/README.md). Upewnisz się w ten sposób, że:

1. Jira odczytuje pole `Original Estimate = 14400` jako **4 godziny** (wartość jest w sekundach). Jeśli Jira pokaże inną wartość, zmień w pliku `backlog.toml` ustawienie na `estimate_format = "jira"` i wygeneruj pliki CSV ponownie.
2. Pole `Story Points` jest widoczne na ekranie zgłoszenia typu `Story`.

---

## Krok 1: Wygeneruj aktualne pliki CSV

W głównym katalogu repozytorium uruchom:

```bash
python tools/backlog/gen_jira_csv.py
```

Skrypt sprawdzi pojemność sprintów i kryteria `GIVEN / WHEN / THEN`, a potem zapisze pliki `jira-01-epics.csv` i `jira-02-issues.csv` (kodowanie UTF-8, separator `,`). Pozycje, które mają już wpisany klucz (`jira = "REJ-..."`), skrypt pomija. Dzięki temu kolejne importy nie tworzą duplikatów.

---

## Krok 2: Zaimportuj epiki (`jira-01-epics.csv`) — zawsze jako pierwsze

Jira Server/DC łączy historyjki z epikami po nazwie epiku (*Epic Name*). Dlatego **epiki muszą istnieć w Jirze, zanim zaimportujesz historyjki**.

1. W Jirze przejdź do: **Issues → Import issues from CSV** (lub **⚙ System → External System Import → CSV**).
2. Wybierz plik `docs/03-dokumentacja-procesowa/02-backlog/jira-01-epics.csv` (kodowanie **UTF-8**, separator `,`).
3. Wskaż docelowy projekt zespołu i skonfiguruj mapowanie kolumn:

| Kolumna w pliku CSV | Pole docelowe w Jirze |
|---|---|
| `Issue Id` | `Issue Id` |
| `Issue Type` | `Issue Type` (`Epic`) |
| `Summary` | `Summary` |
| `Epic Name` | `Epic Name` |
| `Description` | `Description` |
| `Labels` | `Labels` |
| `Component/s` | `Component/s` *(zaznacz tworzenie nowych wartości)* |

---

## Krok 3: Zaimportuj historyjki i podzadania (`jira-02-issues.csv`)

Uruchom kreator importu jeszcze raz, dla pliku `docs/03-dokumentacja-procesowa/02-backlog/jira-02-issues.csv`. Dodaj te mapowania kolumn:

| Kolumna w pliku CSV | Pole docelowe w Jirze | Uwagi |
|---|---|---|
| `Issue Id` | `Issue Id` | Identyfikator wewnętrzny łączący Story z Sub-taskami |
| `Parent Id` | `Parent Id` | Przypisuje `Sub-task` do nadrzędnej `Story` |
| `Issue Type` | `Issue Type` | `Story` lub `Sub-task` |
| `Summary` | `Summary` | Tytuł zadania |
| `Epic Link` | `Epic Link` | Musi odpowiadać polu `Epic Name` z Kroku 2 |
| `Description` | `Description` | Treść User Story i kryteria `GIVEN/WHEN/THEN` |
| `Story Points` | `Story Points` | Wycena punktowa w skali Fibonacciego |
| `Original Estimate` | `Original Estimate` | Szacowany czas pracy |
| `Priority` | `Priority` | Priorytet fali (`W0`..`W3`) |
| `Labels` (×3) | `Labels` | Etykiety projektu, fali i numeru sprintu (`sprint-1`..`sprint-5`) |
| `Component/s` | `Component/s` | Moduł architektoniczny |

---

## Krok 4: Po imporcie

1. Na tablicy Scrum w Jirze utwórz sprinty **Sprint 1 – Sprint 5** i przypisz do nich historyjki według etykiet `sprint-1` .. `sprint-5` (np. filtrem JQL `labels = sprint-1`).
2. Wpisz klucze nadane przez Jirę (`jira = "REJ-12"`) do pliku `backlog.toml` i zapisz zmianę w repozytorium (commit).
3. Sprawdź, czy projekt używa standardowego schematu pracowni (*Pracownia projektowa Workflow Scheme*: `Open → In Progress → Resolved → Closed`).
