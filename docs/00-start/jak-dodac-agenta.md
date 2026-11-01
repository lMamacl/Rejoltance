# Jak dodać rolę agenta

**Rola** (agent, subagent) to osobna odpowiedzialność z własną misją i **uprawnieniami** — np. recenzent tylko czyta, inżynier może edytować.
Jeśli potrzebujesz procedury, a nie nowej odpowiedzialności — zrób skill ([`jak-dodac-skill.md`](jak-dodac-skill.md)). Agent zrobi to skillem `rj-add-agent`.

## Obecne role (4 grupy)

| Grupa | Role | Co mogą |
|---|---|---|
| Organizacja | `rj-orchestrator`, `rj-scrum-assistant` | czytać, uruchamiać komendy, delegować; nie piszą kodu produkcyjnego |
| Specjalizacja | `rj-architect`, `rj-researcher`, `rj-rules-expert` | czytać, szukać w sieci, pisać dokumenty (design, ADR, research) |
| Realizacja | `rj-backend-engineer`, `rj-frontend-engineer`, `rj-docs-writer` | edytować kod/dokumenty w zakresie zadania |
| Weryfikacja | `rj-reviewer`, `rj-security-reviewer`, `rj-test-verifier` | tylko czytać i uruchamiać testy |

Przepływ: orchestrator → (architect / rules-expert) → akceptacja człowieka → engineer → test-verifier + reviewer → PR.

## Kroki

1. Plik `.agents/agents/rj-<rola>.md` (format Antigravity — źródło dla wszystkich narzędzi):

   ```markdown
   ---
   name: rj-ui-tester
   description: "Weryfikacja: uruchamia testy E2E Playwright i opisuje różnice wizualne. Nie modyfikuje kodu."
   tools:
     - view_file
     - grep_search
     - run_command
   mainAgent: false
   subagent: true
   model: inherit
   commandExecutionPolicy: sandbox
   ---

   # Misja
   ## Procedura
   ## Nie wolno
   ## Wyjście
   ```

2. Wybierz **najmniejszy** zestaw narzędzi. Skrypt przetłumaczy je dla Claude Code:

   | Antigravity | Claude Code |
   |---|---|
   | `view_file` | Read |
   | `list_dir`, `find_by_name` | Glob |
   | `grep_search` | Grep |
   | `run_command` | Bash |
   | `write_to_file`, `replace_file_content`, `multi_replace_file_content` | Write / Edit |
   | `search_web` / `read_url_content` | WebSearch / WebFetch |
   | `invoke_subagent` | Task |

   Brak narzędzi `write_*`/`replace_*` = rola tylko do odczytu.
3. Jeśli orkiestrator ma ją wołać — dopisz `./rj-ui-tester.md` w `agents:` pliku `rj-orchestrator.md`.
4. `python tools/agents/sync_agents.py` → `.claude/agents/rj-ui-tester.md`, `.github/agents/rj-ui-tester.agent.md`.
5. `python tools/agents/sync_agents.py --check`, dopisz rolę w `AGENTS.md` (sekcja 5), PR.

## Jak wywołać rolę

- **Claude Code:** „Użyj subagenta rj-reviewer do recenzji tej gałęzi”.
- **Antigravity:** wybór agenta w panelu agentów (role z `.agents/agents`).
- **Copilot (VS Code):** wybór custom agenta w czacie (`.github/agents`).
- **Codex / Gemini / czat:** „Działaj jako rola opisana w `.agents/agents/rj-reviewer.md`”.
