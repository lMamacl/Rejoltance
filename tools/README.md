# `tools/` — skrypty repozytorium

Wszystkie skrypty są w TypeScript i uruchamia je bezpośrednio Node.js 24 (bez kompilacji). Wywołujesz je przez `npm run …` z katalogu głównego. Polecenia `dev`, `start` i `docs:publish` same wczytują plik `.env`.

| Polecenie | Skrypt | Co robi |
|---|---|---|
| `npm run setup` | `setup.ts` | Jednorazowo po sklonowaniu: sprawdza narzędzia, instaluje zależności, tworzy `.env`, uruchamia testy. |
| `npm run doctor` | `doctor.ts` | Diagnostyka komputera (Node, git, OneDrive, `.env`). Niczego nie zmienia. |
| `npm run dev` | `dev.ts` | Serwer gry i klient Vite razem; Ctrl+C zatrzymuje oba. |
| `npm run agents` / `agents:check` | `agents/sync-agents.ts` | Walidacja `.agents/` i generowanie adapterów Claude Code oraz komend Antigravity. |
| `npm run cards` / `cards:check` | `content/extract-cards.ts` | Karty i talie z `prototype/game/cards.js` i `decks.js` do `packages/content/data/*.json`. |
| `npm run backlog` / `backlog:check` | `backlog/gen-jira-csv.ts` | Walidacja `backlog.toml` i jego spójności z indeksem R-nn; generuje `BACKLOG.md` i pliki CSV do Jiry. |
| `npm run docs:check` | `confluence/sync-confluence.ts` | Struktura `docs/` 1:1 z Confluence, wymagane dokumenty, linki wewnętrzne. |
| `npm run docs:export` | `confluence/sync-confluence.ts` | Paczka `.artifacts/confluence-export/` (Markdown + XHTML + `manifest.json`). Nagłówek pliku nie zawiera hasha commita, więc zmieniają się tylko strony o zmienionej treści. |
| `npm run docs:publish -- …` | `confluence/sync-confluence.ts` | Publikacja przez REST API. Token z `CONFLUENCE_PERSONAL_TOKEN` w `.env`. |
| — | `architecture.test.ts`, `tools.test.ts` | Testy: granice modułów i narzędzia (uruchamia je `npm test`). |

`npm run check` uruchamia wszystkie kontrole `…:check` razem z OpenSpec i markdownlint — tak samo jak CI.

## Publikacja w Confluence

```powershell
npm run docs:publish -- --dry-run --changed-since develop          # podgląd: strony zmienione od develop
npm run docs:publish -- --changed-since develop --only-existing     # aktualizacja tylko istniejących stron
npm run docs:publish -- --include docs/01-dokumentacja-systemowa/06-stos-technologiczny.md
```

- `--include <ścieżka lub glob>` (można powtarzać) i `--changed-since <ref git>` wybierają strony; strony nadrzędne (`README.md`) dochodzą automatycznie.
- `--only-existing` nie zakłada nowych stron — pomija te, których jeszcze nie ma w Confluence.
- `docs/README.md` nadpisuje stronę główną przestrzeni.
