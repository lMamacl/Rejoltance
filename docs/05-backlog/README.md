# 05-backlog — backlog i import do Jiry

| Plik | Co | Edytować? |
|---|---|---|
| [`backlog.toml`](backlog.toml) | **źródło prawdy**: epiki → story (Jako/chcę/aby, GIVEN/WHEN/THEN, SP, reguły R‑nn) → taski ≤ 4 h | tak |
| [`BACKLOG.md`](BACKLOG.md) | podsumowanie: pojemność sprintów, story per epik | nie (generowany) |
| `jira-01-epics.csv`, `jira-02-issues.csv` | pliki importu do Jiry PB (Server/DC) | nie (generowane) |
| [`test-import/`](test-import/README.md) | 3 zgłoszenia na próbę mapowania pól | — |

```bash
python tools/backlog/gen_jira_csv.py          # po każdej zmianie backlog.toml
python tools/backlog/gen_jira_csv.py --check  # walidacja (CI)
```

Import: [`docs/00-start/jira-import.md`](../00-start/jira-import.md). Jira śledzi pracę (statusy, czas, Burndown); wiedza zostaje w repo.

## Pojemność i linia cięcia

Pojemność: **6 osób × 5 h/tydz.** = 60 h na sprint 2‑tygodniowy (S0: 30 h), bufor 10% na niespodzianki.
Szczegóły per sprint: [`BACKLOG.md`](BACKLOG.md).

| Fala | Znaczenie | Gdzie |
|---|---|---|
| **W0** | fundament: narzędzia, DIP, ceremonie Scrum, CI | S0–S5 |
| **W1** | MVP: grywalny mecz online i z botem, 12 kart, walka i słowa kluczowe, konta, wdrożenie | S1–S5 (semestr 1) |
| **W2** | pełna gra: wszystkie 69 karty, efekty z ręki, pasywne w DSL, deckbuilder, reconnect, replay, mocny bot | S6 (semestr 2) |
| **W3** | dodatki: obserwator, ranking i panel admina, raport balansu | S7 — jeśli starczy czasu |

**Semestr 1:** 41 story, 139 SP, 291 h (~97% pojemności przed buforem). **Semestr 2 (poniżej linii cięcia):** 15 story, 61 SP, 138 h.
Ostrzeżenie generatora: S2 ma 57 h przy limicie z buforem 54 h (pojemność 60 h) — PO S2 decyduje na planningu, co ewentualnie przesunąć.

## Zasady planowania (z kickoff‑kit i wymagań uczelni)

- Task ≤ 4 h (zasada pracowni); niepewność → spike ≤ 2 h przed planowaniem.
- Story ≥ 3 SP → zmiana OpenSpec przed kodem (`/opsx:propose`).
- **Każdy członek zespołu ma zadania w każdym sprincie** — każdy sprint jest oceniany osobno. Każdy epik ma pracę w S1–S5.
- Story epiku E1 w S3–S4 są największe (ścieżka krytyczna): PO przydziela ich sub‑taski dwóm osobom (np. testy R‑nn — właściciel E5).
- Story od S3 mają tylko szacunek (`estimate_h`) — rozbicie na taski robi zespół na refinemencie przed sprintem (świadoma decyzja).
- Niezrealizowane zadanie wraca do backlogu z adnotacją; zmiana sprintu = edycja `backlog.toml` + ponowny eksport tylko nowych pozycji.
