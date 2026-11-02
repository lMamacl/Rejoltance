# `tools/` — Skrypty Automatyzacji i Strażnicy Jakości

Skrypty w tym katalogu automatyzują konfigurację środowiska, synchronizację agentów AI, ekstrakcję kart z prototypu, generowanie plików CSV do Jiry oraz walidację i eksport dokumentacji 1:1 do Confluence PB.

Wszystkie skrypty Pythona korzystają wyłącznie z biblioteki standardowej **Python 3.11+** (zero zewnętrznych zależności `pip`).

| Skrypt | Przeznaczenie i tryby uruchomienia |
|---|---|
| `setup.ps1` / `setup.sh` | Jednorazowe przygotowanie środowiska po sklonowaniu repozytorium (instalacja zależności, build, testy). |
| `doctor.ps1` | Diagnostyka stacji roboczej Windows/macOS/Linux (wersje SDK, długie ścieżki Git, OneDrive, Smart App Control, certyfikaty HTTPS). |
| `agents/sync_agents.py` | Walidacja kanonu `.agents/` (`rules/`, `agents/`, `skills/`, w tym ról i przypisanych wbudowanych skilli) oraz generowanie adapterów dla Claude Code, GitHub Copilot, Gemini i Antigravity (`--check` w CI). |
| `content/extract_cards.py` | Ekstrakcja definicji kart i talii startowych z `prototype/revibance/cards.js` do `src/Rejoltance.Content/Data/*.json` (`--check` w CI). |
| `backlog/gen_jira_csv.py` | Walidacja `docs/03-dokumentacja-procesowa/02-backlog/backlog.toml` oraz dwukierunkowej spójności z `03-indeks-regul-r-nn.md`; generowanie `BACKLOG.md` i plików CSV do importu w Jirze PB (`--check` w CI). |
| `confluence/sync_confluence.py` | Walidacja architektury dokumentacji `docs/` w układzie 1:1 z Confluence PB (AltexSoft + SDD, linki wewnętrzne, nagłówki metadanych) oraz publikacja/eksport (`--check` / `--export` / `--publish`). Przy `--include PATH_OR_GLOB` można ograniczyć eksport lub publikację do wybranych stron; nadrzędne pliki `README.md` są dołączane automatycznie. |
