# tools — narzędzia repozytorium

| Skrypt | Co robi |
|---|---|
| `setup.ps1` / `setup.sh` | jednorazowe przygotowanie po klonie (zależności, build, testy) |
| `doctor.ps1` | diagnostyka maszyny (wersje, długie ścieżki, OneDrive, Smart App Control, certyfikat) — nic nie zmienia |
| `agents/sync_agents.py` | generuje adaptery agentów z `.agents/` (`--check` w CI) |
| `content/extract_cards.py` | `prototype/revibance/cards.js` → `src/Rejoltance.Content/Data/*.json` (`--check` w CI) |
| `backlog/gen_jira_csv.py` | `docs/05-backlog/backlog.toml` → CSV do Jiry + `BACKLOG.md` (`--check` w CI) |

Skrypty Pythona używają tylko biblioteki standardowej (Python 3.11+).
