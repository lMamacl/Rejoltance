---
name: rj-add-skill
description: "Tworzy nową umiejętność wykonawczą w .agents/skills/rj-<nazwa>/SKILL.md z poprawnym nagłówkiem YAML i instrukcją krok po kroku oraz regeneruje adaptery IDE przez tools/agents/sync_agents.py."
---

# Umiejętność: Tworzenie nowej umiejętności wykonawczej (`rj-add-skill`)

## Kiedy używać tej procedury?

Uruchamiaj, gdy powtarzalna procedura inżynierska lub procesowa powinna stać się ustandaryzowaną instrukcją krok po kroku dostępną dla ludzi i agentów AI.

---

## Kroki wykonawcze (Krok po kroku)

1. **Sprawdź istniejące skille w `.agents/skills/`:**
   - Upewnij się, że nowy skill nie duplikuje istniejącej procedury (katalog w `docs/04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md`).

2. **Utwórz plik `.agents/skills/rj-<nazwa-skilla>/SKILL.md` (maksymalnie 90 linii):**
   - Wypełnij nagłówek YAML:
     - `name: rj-<nazwa-skilla>` (musi być identyczne z nazwą katalogu),
     - `description: "<zwięzły opis w czystym ASCII, maks. 1024 znaki, wyjaśniający co robi skill i kiedy go użyć>"`.
   - Opisz w języku polskim: *Kiedy używać tej procedury?* oraz *Kroki wykonawcze (Krok po kroku)* wraz z dokładnymi komendami weryfikującymi.

3. **Przypisz skill do odpowiednich agentów:**
   - Dopisz `rj-<nazwa-skilla>` do listy `skills:` w nagłówkach właściwych agentów w `.agents/agents/rj-*.md`.

4. **Wygeneruj adaptery dla Claude Code, Copilot, Gemini i Antigravity:**

   ```bash
   python tools/agents/sync_agents.py
   python tools/agents/sync_agents.py --check
   npm run lint:md
   ```
