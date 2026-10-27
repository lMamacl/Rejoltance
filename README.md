# RE:JOLTANCE

Webowa, dwuosobowa gra karciana typu *lane battler* (4 linie, zasób Blood, talie po 30 kart) — projekt zespołowy, Politechnika Białostocka.
Backend **C# .NET 10** (ASP.NET Core + SignalR), frontend **React + TypeScript + Vite**, orkiestracja **Aspire**, Scrum w **Jirze PB**.

## Start w 5 minut

Wymagane: [.NET SDK 10](https://dot.net), [Node.js 24 LTS](https://nodejs.org), Git, Python 3.11+. Docker **nie** jest potrzebny.

```powershell
git clone https://github.com/lMamacl/Rejoltance.git C:\dev\Rejoltance   # krótka ścieżka, poza OneDrive
cd C:\dev\Rejoltance
powershell -ExecutionPolicy Bypass -File tools/setup.ps1 -TrustDevCert
dotnet run --project src/Rejoltance.AppHost                             # albo: aspire run
```

Otworzy się panel Aspire — kliknij zasób **web**, żeby zobaczyć klienta gry. Problemy: [`docs/00-start/jak-zaczac.md`](docs/00-start/jak-zaczac.md#problemy).
macOS/Linux: `bash tools/setup.sh`.

## Co gdzie jest

| Folder | Strefa | Zawartość |
|---|---|---|
| [`docs/`](docs/README.md) | projektowa (PL) | onboarding, DIP, reguły gry, architektura, ADR, backlog, Scrum, spotkania, badania |
| [`openspec/`](openspec/config.yaml) | specyfikacje | żywe specyfikacje (`specs/`) i zmiany (`changes/`) — spec‑driven development |
| [`src/`](src/) | kod (EN) | `Rejoltance.*` (C#) i `web/` (React/TS) — każdy z README |
| [`tests/`](tests/README.md) | kod | testy xUnit: reguły R‑nn, granice architektury, serwer, smoke AppHost |
| [`prototype/`](prototype/README.md) | referencja | prototyp JS — **kanon zasad gry** |
| [`tools/`](tools/README.md) | narzędzia | setup/doctor, synchronizacja agentów, ekstrakcja kart, backlog → Jira |
| [`.agents/`](.agents/README.md) | AI | konstytucja, reguły, role agentów, skille (źródło dla wszystkich narzędzi AI) |

## Jak pracujemy

- Zadanie z Jiry `REJ-123` → gałąź `feature/REJ-123-opis` z `develop` → PR do `develop` → recenzja → merge.
- Story ≥ 3 SP: najpierw zmiana OpenSpec (`/opsx:propose`), potem kod.
- Zasady dla ludzi i agentów AI: [`AGENTS.md`](AGENTS.md) i [konstytucja](.agents/rules/00-konstytucja.md).

```bash
dotnet test Rejoltance.slnx --filter "Category!=Integration"   # testy backendu
npm --prefix src/web test                                       # testy klienta
npm run check                                                   # specyfikacje + markdown
```
