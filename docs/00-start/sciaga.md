# Ściąga

## Uruchamianie

| Chcę… | Komenda |
|---|---|
| przygotować repo po klonie | `powershell -ExecutionPolicy Bypass -File tools/setup.ps1` |
| sprawdzić, czemu nie działa | `powershell -File tools/doctor.ps1` |
| uruchomić grę (serwer + web) | `dotnet run --project src/Rejoltance.AppHost` albo `aspire run` |
| sam serwer | `dotnet run --project src/Rejoltance.Server` |
| sam klient (z działającym serwerem) | `cd src/web` → `SERVER_HTTP=http://localhost:5000 npm run dev` |
| zagrać w prototyp | `npx serve prototype/revibance` |

## Testy i kontrole

| Co | Komenda |
|---|---|
| szybkie testy .NET | `dotnet test Rejoltance.slnx --filter "Category!=Integration"` |
| jedna reguła | `dotnet test --filter "FullyQualifiedName~R14"` |
| cała aplikacja (wolny) | `dotnet test tests/Rejoltance.AppHost.Tests` |
| klient | `npm --prefix src/web test` · `run lint` · `run typecheck` · `run build` |
| format C# | `dotnet format Rejoltance.slnx` |
| specyfikacje + markdown | `npm run check` |
| adaptery agentów | `python tools/agents/sync_agents.py` (`--check`) |
| karty z prototypu | `python tools/content/extract_cards.py` (`--check`) |
| backlog → CSV | `python tools/backlog/gen_jira_csv.py` (`--check`) |
| nowa próbka kontraktu | `UPDATE_CONTRACT_SAMPLES=1 dotnet test tests/Rejoltance.Server.Tests` |

## Git

```bash
git switch develop && git pull
git switch -c feature/REJ-123-krotki-opis
git commit -m "REJ-123: add fatigue damage on empty deck"
git push -u origin feature/REJ-123-krotki-opis
```

## OpenSpec (story ≥ 3 SP)

| Krok | Claude / Gemini | Antigravity / Copilot | Codex |
|---|---|---|---|
| propozycja | `/opsx:propose REJ-123 …` | `/opsx-propose …` | `$openspec-propose …` |
| implementacja | `/opsx:apply` | `/opsx-apply` | `$openspec-apply-change` |
| archiwizacja | `/opsx:archive` | `/opsx-archive` | `$openspec-archive-change` |
| walidacja | `npx openspec validate --all --strict` | | |

## Gdzie co jest

| Szukam | Plik |
|---|---|
| zasad gry | `docs/02-rules/SPECYFIKACJA.md`, `RULES-INDEX.md`, `openspec/specs/` |
| mapy kodu | `docs/03-architecture/MAP.md` |
| zasad pracy (ludzie + AI) | `AGENTS.md`, `.agents/rules/00-konstytucja.md` |
| decyzji | `docs/04-adr/` |
| backlogu | `docs/05-backlog/backlog.toml`, `BACKLOG.md` |
| szablonów Scrum | `docs/06-scrum/` |
| otwartych pytań | `docs/00-start/pytania-otwarte.md` |

## Skille agentów (`/nazwa` w Claude i Antigravity)

`rj-start-feature` · `rj-add-rule-test` · `rj-add-card` · `rj-pr-ready` · `rj-write-adr` · `rj-daily-report` · `rj-sprint-report` · `rj-backlog-to-jira` · `rj-add-skill` · `rj-add-agent`

## Konwencje

- Gałąź `typ/REJ-123-opis` · commit i tytuł PR `REJ-123: …` · PR do `develop`.
- Docs po polsku, kod i commity po angielsku.
- Test reguły: `Rnn_opis_po_angielsku`. Task ≤ 4 h. Story ≥ 3 SP → OpenSpec.
- Kernel: bez `System.Random`, zegara, IO. Klient: tylko `MatchView` i `Intent`.
