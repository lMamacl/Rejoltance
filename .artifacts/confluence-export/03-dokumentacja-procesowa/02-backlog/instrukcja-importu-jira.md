<!-- CONFLUENCE 1:1 EXPORT | Source: docs/03-dokumentacja-procesowa/02-backlog/instrukcja-importu-jira.md @ 10829d3 (2026-11-02) -->
# Instrukcja importu Product Backlogu do systemu Jira PB

> **Źródło prawdy:** repozytorium (`docs/03-dokumentacja-procesowa/02-backlog/instrukcja-importu-jira.md`) · **Kategoria AltexSoft:** Process Documentation — Tooling Guide · **Etap SDD:** Dekompozycja zadań (`Tasks`)

Uczelniana instancja Jira (`https://devtools.wi.pb.edu.pl/jira`) działa w wersji **Jira Server / Data Center**. Projekt w systemie zakłada prowadzący zajęcia, natomiast import rejestru produktu wykonuje członek zespołu posiadający uprawnienia *Administrator* lub *Product Owner*.

---

## Krok 0: Próbny import 3 zgłoszeń testowych (zalecany przed głównym importem)

Zanim zaimportujesz pełny backlog, przetestuj konfigurację projektu na małym zestawie z katalogu [`test-import/`](test-import/README.md). Pozwoli to upewnić się, że:

1. Pole `Original Estimate = 14400` jest poprawnie interpretowane przez Jirę jako **4 godziny** (w sekundach). Jeśli Jira wyświetli inną wartość, w pliku `backlog.toml` zmień `estimate_format = "jira"` i wygeneruj pliki CSV ponownie.
2. Pole `Story Points` jest widoczne na ekranie zgłoszenia typu `Story`.

---

## Krok 1: Wygenerowanie aktualnych plików CSV

W głównym katalogu repozytorium uruchom:

```bash
python tools/backlog/gen_jira_csv.py
```

Skrypt przeprowadzi walidację pojemności sprintów oraz kryteriów `GIVEN / WHEN / THEN`, a następnie zapisze pliki `jira-01-epics.csv` oraz `jira-02-issues.csv` (kodowanie UTF-8, separator `,`). Pozycje posiadające już wpisany klucz (`jira = "REJ-..."`) są automatycznie pomijane, co chroni przed duplikatami przy kolejnych importach.

---

## Krok 2: Import Epików (`jira-01-epics.csv`) — OBOWIĄZKOWO PIERWSZY

W systemie Jira Server/DC powiązanie historyjek z epikami odbywa się po nazwie epiku (*Epic Name*), dlatego **epiki muszą istnieć w bazie przed importem historyjek**.

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

## Krok 3: Import Historyjek i Podzadań (`jira-02-issues.csv`)

Powtórz kreator importu dla pliku `docs/03-dokumentacja-procesowa/02-backlog/jira-02-issues.csv`, dodając następujące mapowania kolumn:

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

## Krok 4: Czynności po zakończeniu importu

1. Na tablicy Scrumowej w Jirze utwórz sprinty **Sprint 1 – Sprint 5** i przypisz do nich odpowiednie historyjki na podstawie etykiet `sprint-1` .. `sprint-5` (np. filtrem JQL `labels = sprint-1`).
2. Wpisz nadane przez Jirę klucze (`jira = "REJ-12"`) do pliku `backlog.toml` i zatwierdź zmianę w repozytorium.
3. Upewnij się, że w ustawieniach projektu zastosowano standardowe schematy pracowni (*Pracownia projektowa Workflow Scheme*: `Open → In Progress → Resolved → Closed`).
