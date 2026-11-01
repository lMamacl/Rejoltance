# ADR-0009: Jeden kanon zasad agentów w `.agents/`, generowane adaptery

- **Status:** accepted (2026-10-27, akceptacja Fazy 2)
- **Data:** 2026-10-27
- **Powiązane:** `AGENTS.md`, `.agents/`, `tools/agents/sync_agents.py`

## Kontekst i problem

Każde narzędzie AI czyta zasady z innego miejsca: Antigravity i Codex — `.agents/`, Claude Code — `.claude/`, Copilot — `.github/`, Gemini — `.gemini/`. [V]
Ręczne kopie się rozjeżdżają; symlinki są zawodne na Windows i w OneDrive (Vaultie też ich nie używa). [V]

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Osobne pliki per narzędzie | pełna kontrola | 5× utrzymanie, rozjazdy | wysokie |
| Symlinki | jedna kopia | Windows/OneDrive | zawodne |
| **Kanon + generator + check w CI** | jedna kopia do edycji, CI pilnuje spójności | trzeba uruchomić skrypt | niskie |

## Decyzja

W kontekście pięciu narzędzi AI, wybieramy **kanon w `AGENTS.md` i `.agents/{rules,agents,skills}` oraz skrypt `sync_agents.py`, który generuje
adaptery z markerem GENERATED i w CI odrzuca rozjazd (`--check`)** zamiast osobnych plików lub symlinków, aby zmiana zasady była jedną zmianą,
akceptując konieczność uruchomienia skryptu po edycji `.agents/`.

## Konsekwencje

### Pozytywne

- 10 ról, 10 skilli `rj-*` i 6 reguł działa w Claude, Antigravity, Codex, Copilot, Gemini; DeepSeek/ChatGPT w czacie — przez `AGENTS.md`.

### Negatywne / ryzyka

- Mapowanie narzędzi Antigravity → Claude (np. `view_file` → `Read`) trzeba aktualizować przy zmianach w narzędziach.
- Format agentów Copilot (`.agent.md`) zawiera tylko nazwę i opis; uprawnienia są w treści [Z].
