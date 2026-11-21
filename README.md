# RE:JOLTANCE

Sieciowa, taktyczna gra karciana w przeglądarce: dwóch graczy, cztery linie walki, talie po 30 kart. Projekt zespołowy (6 osób, 2 semestry) na Wydziale Informatyki Politechniki Białostockiej. Całość w TypeScript na Node.js 24.

**Nowa osoba w zespole? Zacznij od [`START.md`](START.md)** — plan pierwszego dnia, od instalacji do pierwszego PR.

## Uruchomienie

Wymagania: **Node.js 24** i **Git**.

```powershell
npm run setup    # jednorazowo: narzędzia, zależności, plik .env, testy
npm run dev      # gra lokalnie: serwer + klient w przeglądarce
npm run verify   # przed PR: lint, typecheck, testy, build
npm run check    # przed PR: specyfikacje, dokumentacja, generatory
```

## Gdzie co jest

| Katalog | Co zawiera |
|---|---|
| [`apps/web`](apps/web/README.md) | klient React — wyświetla stan meczu i wysyła ruchy gracza |
| [`apps/server`](apps/server/README.md) | serwer gry — jedyny sędzia meczu (Fastify + Socket.IO) |
| [`packages/engine`](packages/engine/README.md) | reguły gry: czysty, deterministyczny silnik |
| [`packages/content`](packages/content/README.md) | karty i talie (generowane z prototypu) |
| [`packages/contracts`](packages/contracts/README.md) | typy wymieniane przez serwer i klienta |
| [`prototype/`](prototype/README.md) | prototyp gry w JS — wzorzec zasad (git subtree) |
| [`openspec/`](openspec) | specyfikacje reguł `R-nn` i wymagań jakościowych `NFR-nn` |
| [`docs/`](docs/README.md) | dokumentacja projektu (układ 1:1 z Confluence PB) |
| [`tools/`](tools/README.md) | skrypty `npm run …` (setup, generatory, publikacja w Confluence) |
| `AGENTS.md`, `.agents/` | zasady i skille dla narzędzi AI (Claude Code, Codex, Cursor, Antigravity) |

## Najczęściej potrzebne

- [Mapa kodu i „gdzie dodać nową funkcję”](docs/01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md)
- [Proces pracy: gałęzie, PR, Scrum](docs/00-przewodnik-i-setup/03-proces-pracy-i-git-scrum.md)
- [Ściąga poleceń](docs/00-przewodnik-i-setup/04-sciaga-komend.md)
- [Konstytucja projektu](.agents/rules/00-konstytucja.md) i [decyzje architektoniczne (ADR)](docs/01-dokumentacja-systemowa/07-decyzje-adr/README.md)
