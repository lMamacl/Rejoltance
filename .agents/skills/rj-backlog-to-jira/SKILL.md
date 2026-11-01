---
name: rj-backlog-to-jira
description: Edits the single-source backlog (docs/05-backlog/backlog.toml) and regenerates the Jira Server/DC CSV import files (epics first, then stories and sub-tasks) plus the BACKLOG.md summary. Use when stories or tasks are added, split, moved between sprints or re-estimated.
---

# Backlog → CSV do Jiry

Źródło prawdy: `docs/05-backlog/backlog.toml`. CSV i `BACKLOG.md` są generowane — nie edytuj ich ręcznie.

## Kroki

1. Edytuj TOML (`[[epic]]` → `[[epic.story]]` → `[[epic.story.task]]`):
   - story: `title`, `as_a` / `i_want` / `so_that`, `acceptance` (każde kryterium z GIVEN, WHEN i THEN), `sp` (1, 2, 3, 5, 8, 13), `sprint`, `wave` (W0–W3), `rules` (R‑nn z `openspec/specs`);
   - taski: `title`, `h` ≤ 4 — **albo** `estimate_h` na story (S3+ do refinementu), nie oba.
2. `python tools/backlog/gen_jira_csv.py` → `jira-01-epics.csv`, `jira-02-issues.csv`, `BACKLOG.md`.
3. Przeczytaj ostrzeżenia o pojemności sprintów (6 os. × 5 h/tydz.; bufor 10%). Przekroczenie pojemności = błąd — przenieś story albo podziel ją.
4. Zmiana reguł w story → sprawdź kolumnę *Story* w `docs/02-rules/RULES-INDEX.md` (generator wykrywa niespójność).
5. Import (robi człowiek z uprawnieniami): `docs/00-start/jira-import.md` — **najpierw epiki, potem reszta**.
6. Po imporcie wpisz nadane klucze (`jira = "REJ-123"`) przy zaimportowanych pozycjach — kolejne generowanie je pominie.

## Nie wolno

Importować do Jiry samodzielnie; zmieniać priorytetów ani sprintów bez PO.
