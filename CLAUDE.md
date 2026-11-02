# CLAUDE.md

Zasady projektu są w jednym miejscu — nie powielaj ich tutaj.

@AGENTS.md
@.agents/rules/00-konstytucja.md
@.agents/rules/10-prawda-i-niepewnosc.md

Specyficzne dla Claude Code:

- Subagenci: `.claude/agents/rj-*.md`, skille: `.claude/skills/` (generowane z `.agents/` — edytuj źródło, potem `python tools/agents/sync_agents.py`).
- Pozostałe reguły (`.agents/rules/20…50`) czytaj, gdy zadanie ich dotyczy.
- Komendy OpenSpec: `/opsx:propose`, `/opsx:apply`, `/opsx:archive`, `/opsx:explore`.
