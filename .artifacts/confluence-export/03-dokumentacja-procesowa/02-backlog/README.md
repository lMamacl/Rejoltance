<!-- CONFLUENCE 1:1 EXPORT | Source: docs/03-dokumentacja-procesowa/02-backlog/README.md @ a2bf2a4 (2026-11-02) -->
# 3.2 Rejestr produktu i eksport do Jiry PB

> **Źródło prawdy:** repozytorium (`docs/03-dokumentacja-procesowa/02-backlog/backlog.toml`) · **Kategoria dokumentacji:** Dokumentacja procesowa — rejestr produktu i sprintów · **Etap SDD:** dekompozycja zadań · **Wymogi uczelniane:** EU1, EU3, EU4

Ten katalog zawiera rejestr produktu (*product backlog*): 7 epików (`E0–E6`), 47 historyjek użytkownika z kryteriami akceptacji `GIVEN / WHEN / THEN` i podzadania o szacunku ≤ 4 godzin.

## Pliki w katalogu

| Plik | Co zawiera | Czy edytować ręcznie? |
|---|---|---|
| [`backlog.toml`](backlog.toml) | **Źródło prawdy rejestru produktu:** sprinty, epiki, historyjki, kryteria akceptacji, szacunki w SP (story points) i godzinach oraz powiązane reguły `R-nn`. | **Tak** (ręcznie albo skillem `rj-backlog-to-jira`) |
| [`BACKLOG.md`](BACKLOG.md) | Czytelne podsumowanie: pojemność sprintów, wykorzystanie godzin zespołu i historyjki w każdym epiku. | **Nie** (generuje go `gen_jira_csv.py`) |
| [`jira-01-epics.csv`](jira-01-epics.csv) | Epiki do zaimportowania w Jirze PB w pierwszym kroku. | **Nie** (generuje go `gen_jira_csv.py`) |
| [`jira-02-issues.csv`](jira-02-issues.csv) | Historyjki i podzadania do zaimportowania w drugim kroku. | **Nie** (generuje go `gen_jira_csv.py`) |
| [`instrukcja-importu-jira.md`](instrukcja-importu-jira.md) | Instrukcja krok po kroku: jak zaimportować pliki CSV do uczelnianej Jiry PB. | Instrukcja |
| [`test-import/`](test-import/README.md) | 3 próbne zgłoszenia. Sprawdzisz na nich mapowanie pól w Jirze przed głównym importem. | Pliki testowe |

Po każdej zmianie w `backlog.toml` uruchom:

```bash
python tools/backlog/gen_jira_csv.py
```
