---
name: rj-add-agent
description: "Tworzy lub aktualizuje wyspecjalizowaną rolę agenta AI w .agents/agents/rj-<nazwa>.md wraz z kategorią tematyczną, narzędziami i wbudowanymi umiejętnościami oraz regeneruje adaptery IDE przez tools/agents/sync_agents.py."
---

# Umiejętność: Tworzenie i aktualizacja roli agenta AI (`rj-add-agent`)

## Kiedy używać tej procedury?

Uruchamiaj, gdy zespół potrzebuje nowej wyspecjalizowanej roli agentowej lub chce zmodyfikować uprawnienia i wbudowane skille istniejącego agenta w `.agents/agents/`.

---

## Kroki wykonawcze (Krok po kroku)

1. **Przeczytaj podręcznik architektury agentów:**
   - `docs/04-system-agentow-ai/01-architektura-i-konfiguracja-agentow.md`,
   - `docs/04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md`,
   - `docs/04-system-agentow-ai/04-warsztat-tworzenie-agentow-skilli-i-kart.md`.

2. **Utwórz plik `.agents/agents/rj-<nazwa-roli>.md` (maksymalnie 90 linii):**
   - Wypełnij nagłówek YAML: `name`, `description`, `category` (`A-Orkiestracja-i-SDD`, `B-Inzynieria-Domeny`, `C-Inzynieria-Aplikacji` lub `D-Jakosc-i-Dokumentacja`), `tools` (zasada najmniejszych uprawnień), `skills` (lista wbudowanych skilli z `.agents/skills/`), `mainAgent`, `subagent`, `model`, `commandExecutionPolicy`.
   - Opisz w języku polskim 5 sekcji: *1. Misja i zakres odpowiedzialności*, *2. Wbudowane skille operacyjne*, *3. Obowiązkowy kontekst wejściowy*, *4. Standardowy proces pracy*, *5. Granice i zakazy*.

3. **Zsynchronizuj adaptery narzędzi IDE i zweryfikuj konfigurację:**

   ```bash
   python tools/agents/sync_agents.py
   python tools/agents/sync_agents.py --check
   npm run lint:md
   ```

4. **Zaktualizuj katalog ról w dokumentacji:**
   - Dopisz nowego agenta do tabeli w `AGENTS.md`, `.agents/README.md` oraz `docs/04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md`.
