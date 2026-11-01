# Jak dodać skill dla agentów AI

**Skill** to procedura krok po kroku, którą agent ładuje, gdy zadanie pasuje do opisu (np. „dodaj kartę” → `rj-add-card`).
Jeden plik działa we wszystkich narzędziach zespołu: Claude Code, Antigravity, Codex, Copilot, Gemini (ADR-0009). Agent zrobi to skillem `rj-add-skill`.

## Jak to jest zbudowane

```text
.agents/skills/rj-moj-skill/SKILL.md     ← ŹRÓDŁO (edytujesz tylko to)
        │  python tools/agents/sync_agents.py
        ├─► .claude/skills/rj-moj-skill/SKILL.md      Claude Code
        ├─► .github/skills/rj-moj-skill/SKILL.md      GitHub Copilot
        ├─► .gemini/skills/rj-moj-skill/SKILL.md      Gemini CLI
        └─► .agents/workflows/rj-moj-skill.md         komenda /rj-moj-skill w Antigravity
```

Antigravity i Codex czytają `.agents/skills` bezpośrednio. Kopie mają znacznik `GENERATED` — nie edytuj ich.

## Kroki

1. Nazwa: `rj-<czasownik>-<obiekt>`, małe litery i myślniki, np. `rj-review-ui`.
2. Utwórz `.agents/skills/rj-review-ui/SKILL.md`:

   ```markdown
   ---
   name: rj-review-ui
   description: Reviews a React component against the UI rules (renders MatchView only, no innerHTML, legal moves from legalActions). Use before a PR that changes src/web/src/components.
   ---

   # Recenzja komponentu UI

   ## Wejście
   Ścieżka komponentu, klucz Jira.

   ## Kroki
   1. ...
   2. `npm --prefix src/web test` — zapisz wynik.

   ## Wyjście
   Lista uwag P0–P3 i werdykt.

   ## Nie wolno
   Poprawiać kodu bez zgody autora.
   ```

   - `name` = nazwa folderu (walidator to sprawdza).
   - `description` po angielsku, ≤ 1024 znaki: **co** robi i **kiedy** użyć — po tym agent decyduje, czy go załadować.
   - Kroki z dokładnymi komendami i ścieżkami; dodatkowe pliki (szablony) w tym samym folderze.
3. `python tools/agents/sync_agents.py` — generuje kopie.
4. `python tools/agents/sync_agents.py --check` — waliduje (to samo robi CI).
5. Dopisz skill do tabeli w `AGENTS.md` (sekcja 6) i do `sciaga.md`.
6. Commit źródła **i** wygenerowanych kopii, PR.

## Dobre praktyki

- Jeden skill = jedna procedura. Długie wyjaśnienia → link do dokumentu w `docs/`.
- Pisz kroki tak, żeby człowiek też mógł je wykonać.
- Każdy skill kończy się listą „Nie wolno” — granice są ważniejsze niż kroki.
