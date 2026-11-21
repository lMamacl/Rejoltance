# `.agents/` — zasady i skille dla agentów AI

Ten katalog to jedno źródło konfiguracji agentów AI w projekcie (ADR-0009, odchudzone w ADR-0014).
Opis dla ludzi: [`docs/04-system-agentow-ai/README.md`](../docs/04-system-agentow-ai/README.md).

Korzystamy z **Claude Code** oraz narzędzi, które czytają `AGENTS.md` i `.agents/` bezpośrednio (**Codex**, **Cursor**, **Antigravity**).

```text
.agents/
├── rules/        ← konstytucja (00) i reguły tematyczne (10..70)
├── agents/       ← jedna rola: rj-qa-verifier (niezależny recenzent, tylko odczyt)
├── skills/       ← procedury zespołu rj-* oraz skille OpenSpec (openspec-*)
└── workflows/    ← komendy ukośnikowe dla Antigravity (generowane)
```

## Skille zespołu

| Skill | Kiedy |
|---|---|
| `rj-start-feature` | początek pracy nad zadaniem: gałąź, kontekst, ewentualna zmiana OpenSpec |
| `rj-spec-guardian` | sprawdzenie spójności OpenSpec ↔ indeks R-nn ↔ rozbieżności D-nn ↔ backlog |
| `rj-add-rule-test` | test reguły `Rnn_<zachowanie>` ze scenariusza GIVEN/WHEN/THEN |
| `rj-add-card` | zmiana kart: dociągnięcie prototypu i regeneracja katalogu |
| `rj-oracle-diff` | porównanie silnika z prototypem JS (`prototype/game`) |
| `rj-pr-ready` | lista kontrolna przed otwarciem PR |
| `rj-write-adr` | nowa decyzja architektoniczna (ADR) |
| `rj-backlog-to-jira` | zmiany w `backlog.toml` i pliki CSV do Jiry |
| `rj-sync-confluence` | walidacja `docs/` i eksport stron do Confluence |

## Adaptery

Po każdej zmianie w `.agents/` uruchom:

```bash
npm run agents
npm run agents:check
```

Skrypt sprawdza nagłówki YAML i generuje adaptery dla Claude Code (`.claude/agents/`, `.claude/skills/`) oraz komendy Antigravity (`.agents/workflows/`). Wygenerowanych plików nie edytuj ręcznie.
