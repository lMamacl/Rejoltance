# 3.2 Rejestr produktu i eksport do Jiry PB

> **Źródło prawdy:** repozytorium (`docs/03-dokumentacja-procesowa/02-backlog/backlog.toml`) · **Kategoria dokumentacji:** Dokumentacja procesowa — Rejestr produktu i sprintów · **Etap SDD:** Dekompozycja zadań · **Wymogi uczelniane:** EU1, EU3, EU4

Katalog zawiera kompletny rejestr produktu podzielony na 7 epików (`E0–E6`), 47 historyjek użytkownika z kryteriami akceptacji `GIVEN / WHEN / THEN` oraz podzadania o pracochłonności ≤ 4 godzin.

## Pliki w katalogu

| Plik | Rola | Czy edytować ręcznie? |
|---|---|---|
| [`backlog.toml`](backlog.toml) | **Źródło prawdy rejestru produktu:** definicja sprintów, epików, historyjek, kryteriów akceptacji, szacunków SP/godzin i powiązanych reguł `R-nn`. | **Tak** (ręcznie lub z użyciem umiejętności `rj-backlog-to-jira`) |
| [`BACKLOG.md`](BACKLOG.md) | Czytelne podsumowanie pojemności sprintów, wykorzystania godzin zespołu oraz lista historyjek dla każdego epiku. | **Nie** (generowany przez `gen_jira_csv.py`) |
| [`jira-01-epics.csv`](jira-01-epics.csv) | Plik CSV z epikami do zaimportowania w Jirze PB w pierwszym kroku. | **Nie** (generowany przez `gen_jira_csv.py`) |
| [`jira-02-issues.csv`](jira-02-issues.csv) | Plik CSV z historyjkami oraz podzadaniami do zaimportowania w drugim kroku. | **Nie** (generowany przez `gen_jira_csv.py`) |
| [`instrukcja-importu-jira.md`](instrukcja-importu-jira.md) | Szczegółowa instrukcja krok po kroku importu plików CSV do uczelnianego systemu Jira PB. | Dokument instruktażowy |
| [`test-import/`](test-import/README.md) | Zestaw 3 próbnych zgłoszeń do przetestowania mapowania pól w Jirze przed głównym importem. | Pliki testowe |

Po każdej zmianie w `backlog.toml` uruchom:

```bash
python tools/backlog/gen_jira_csv.py
```
