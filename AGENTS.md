# AGENTS.md — zasady pracy w repozytorium Rejoltance

Ten plik czytają wszyscy agenci AI (Claude Code, Antigravity, Codex, GitHub Copilot, Gemini) i ludzie.
Jedno źródło prawdy: zasady są tutaj i w `.agents/`. Pliki w `.claude/`, `.github/agents|skills|instructions`, `.gemini/skills`
są **generowane** (`python tools/agents/sync_agents.py`) — nie edytuj ich ręcznie.

## 1. Zanim cokolwiek zrobisz

1. Przeczytaj **konstytucję**: [`.agents/rules/00-konstytucja.md`](.agents/rules/00-konstytucja.md) — ma pierwszeństwo przed wszystkim.
2. Mapa projektu: [`docs/03-architecture/MAP.md`](docs/03-architecture/MAP.md) — moduły, granice, „gdzie co dodać”.
3. README modułu, w którym pracujesz (`src/<moduł>/README.md`).
4. Klucz Jira zadania (`REJ-123`). Bez niego nie zaczynaj zmian w kodzie.

## 2. Projekt w 6 zdaniach

- RE:JOLTANCE to dwuosobowa gra karciana typu *lane battler*: 4 linie, zasób Blood, talie 30 kart, 20 HP.
- Kanon zasad: prototyp JS `prototype/revibance` (v11), spisany jako reguły R‑nn w `docs/02-rules/`.
- Backend: C# .NET 10 — `Rejoltance.Kernel` (czyste, deterministyczne reguły), `Rejoltance.Server` (ASP.NET Core + SignalR).
- Frontend: React + TypeScript + Vite w `src/web` — renderuje `MatchView`, wysyła `Intent`.
- Uruchomienie: `aspire run` (lub `dotnet run --project src/Rejoltance.AppHost`) — serwer + web + SQLite, bez Dockera.
- Praca: Scrum w Jirze PB, gałęzie `typ/REJ-123-opis`, PR do `develop`, spec‑driven development w OpenSpec.

## 3. Najważniejsze zakazy (pełna lista w konstytucji)

| Nie wolno | Dlaczego |
|---|---|
| `System.Random`, `DateTime.Now`, IO w `Rejoltance.Kernel` | determinizm i replay (build zablokuje) |
| wysyłać `MatchState` do klienta / liczyć legalności w UI | fog of war, jedno źródło legalności |
| cichy fallback (`return []`, losowy cel, pusty `catch`) | błędy mają być widoczne |
| zmieniać kontrakt C# bez TS w tym samym PR | rozjazd klient–serwer |
| edytować `cards.json` ręcznie | źródłem jest `prototype/revibance/cards.js` |
| push do `main`/`develop`, merge, czytanie `.env`/tokenów | decyduje człowiek, sekrety nie dla agentów |
| osłabiać lub usuwać testy | test to specyfikacja |

## 4. Przepływ pracy (spec‑driven)

```text
Jira REJ-123 ─► rj-start-feature ─► (≥3 SP) /opsx:propose ─► akceptacja człowieka ─► /opsx:apply
            ─► testy R-nn + kod ─► rj-pr-ready ─► PR do develop ─► recenzja człowieka ─► /opsx:archive
```

Komendy OpenSpec: Claude/Gemini `/opsx:propose|apply|archive|explore`, Antigravity/Copilot `/opsx-propose…`, Codex `$openspec-propose…`.

## 5. Role agentów (`.agents/agents/`)

| Grupa | Rola | Do czego |
|---|---|---|
| Organizacja | `rj-orchestrator` | prowadzi zadanie od Jiry do PR, deleguje, pilnuje bramek |
| Organizacja | `rj-scrum-assistant` | backlog → CSV, daily, review/retro, estymaty vs czas |
| Specjalizacja | `rj-architect` | projekt zmiany, kontrakty, ADR |
| Specjalizacja | `rj-researcher` | jedno pytanie techniczne, źródła z datą |
| Specjalizacja | `rj-rules-expert` | prototyp JS → reguły R‑nn ze scenariuszami |
| Realizacja | `rj-backend-engineer` | C#: Kernel, Content, Server |
| Realizacja | `rj-frontend-engineer` | React/TS w `src/web` |
| Realizacja | `rj-docs-writer` | dokumentacja PL, Confluence |
| Weryfikacja | `rj-reviewer` | recenzja P0–P3, werdykt (tylko odczyt) |
| Weryfikacja | `rj-security-reviewer` | oszustwa, fog of war, auth, sekrety (tylko odczyt) |
| Weryfikacja | `rj-test-verifier` | uruchamia testy, pokrycie R‑nn |

## 6. Skille zespołu (`.agents/skills/`)

| Skill | Kiedy |
|---|---|
| `rj-start-feature` | początek każdego zadania |
| `rj-add-card` | nowa/zmieniona karta |
| `rj-add-rule-test` | reguła gry → test `Rnn_…` |
| `rj-write-adr` | decyzja trudna do odwrócenia |
| `rj-pr-ready` | przed PR |
| `rj-daily-report` · `rj-sprint-report` | ceremonie Scrum |
| `rj-backlog-to-jira` | zmiany w backlogu |
| `rj-add-skill` · `rj-add-agent` | rozbudowa tego systemu |

Reguły (`.agents/rules/`): `00-konstytucja` (zawsze), `10-prawda-i-niepewnosc` (zawsze), `20-plan-i-zakres`,
`30-granice-architektury`, `40-jakosc-kodu`, `50-git-i-jira`.

## 7. Komendy

```bash
dotnet build Rejoltance.slnx
dotnet test Rejoltance.slnx --filter "Category!=Integration"   # szybkie testy
npm --prefix src/web test                                       # testy klienta
npm run check                                                   # OpenSpec + markdownlint
python tools/agents/sync_agents.py --check                      # spójność adapterów agentów
python tools/content/extract_cards.py --check                   # karty zgodne z prototypem
```

## 8. Raport po pracy

Co zmieniłeś (ścieżki) · jakie komendy uruchomiłeś i z jakim wynikiem · czego nie sprawdziłeś · jakie decyzje czekają na człowieka.
Twierdzenia oznaczaj [V] / [Z] / [?].
