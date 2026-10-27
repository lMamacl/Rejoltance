# .agents — źródło zasad dla agentów AI

Jeden kanon dla wszystkich narzędzi. Antigravity i Codex czytają ten folder natywnie; dla Claude Code, Copilota i Gemini
`python tools/agents/sync_agents.py` generuje kopie (`.claude/`, `.github/agents|skills|instructions`, `.gemini/skills`).

| Folder | Co | Format |
|---|---|---|
| `rules/` | konstytucja i reguły | frontmatter `trigger` (`always_on` / `model_decision`), `description` |
| `agents/` | role agentów (organizacja, specjalizacje, realizacja, weryfikacja) | custom agent Antigravity (`name`, `description`, `tools`, …) |
| `skills/` | procedury krok po kroku (`rj-*` nasze, `openspec-*` z OpenSpec) | `SKILL.md` z `name` (= folder) i `description` |
| `workflows/` | komendy `/…` w Antigravity (`rj-*` generowane, `opsx-*` z OpenSpec) | markdown z `description` |

Dodawanie: skille `rj-add-skill`, `rj-add-agent`. Po każdej zmianie: `python tools/agents/sync_agents.py` i commit wygenerowanych plików.
