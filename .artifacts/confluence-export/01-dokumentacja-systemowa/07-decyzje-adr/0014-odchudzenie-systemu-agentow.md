<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/07-decyzje-adr/0014-odchudzenie-systemu-agentow.md -->
# ADR-0014: Odchudzenie systemu agentów AI

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/07-decyzje-adr/0014-odchudzenie-systemu-agentow.md`) · **Kategoria dokumentacji:** Decyzja architektoniczna (ADR) · **Etap SDD:** Fundamenty

- **Status:** zaakceptowana
- **Data:** 2026-11-21
- **Autorzy:** Gabriel Ostaszewski (z pomocą agenta AI)
- **Akceptacja:** cały zespół (6 osób), 2026-11-21, po przeczytaniu analizy repozytorium
- **Powiązane:** [ADR-0009](0009-kanon-agentow-i-adaptery.md) (zmienia zakres), `AGENTS.md`, `.agents/`, `tools/agents/sync_agents.py`

## Kontekst i problem

ADR-0009 wprowadził jedno źródło zasad w `.agents/` i generowane adaptery dla pięciu narzędzi. Po miesiącu konfiguracja agentów liczyła około 160 plików i 14 tys. linii. Własnej treści było w niej ok. 1,3 tys. linii, a resztę stanowiły kopie dla Claude Code, Copilota, Gemini i Antigravity. [V]

Zespół korzysta z Claude Code oraz z narzędzi czytających `AGENTS.md` i `.agents/` bezpośrednio (Codex, Cursor, Antigravity). Z Copilota i Gemini CLI nikt nie korzysta. [V] Dziesięć ról agentów nie dawało nowych możliwości, bo każda była listą plików do przeczytania. W praktyce pracę wykonuje główny agent prowadzony konstytucją i skillami. [Z] Część plików wskazywała nieistniejące ścieżki, przez co agenci zgadywali. [V]

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Zostawić bez zmian | zero pracy | szum, martwe ścieżki, utrzymanie 4 kopii | rośnie z każdą zmianą |
| **Zostawić tylko używane narzędzia, jedną rolę i skille oparte na skryptach** | mniej plików, łatwiej utrzymać prawdę | przy nowym narzędziu trzeba dopisać adapter | niski |
| Usunąć `.agents/` i zostawić sam `AGENTS.md` | najprościej | tracimy skille i sprawdzanie w CI | utrata powtarzalnych procedur |

## Decyzja

W kontekście nadmiaru plików agentów wybieramy **adaptery tylko dla Claude Code, jedną rolę `rj-qa-verifier` i 9 skilli zespołu** zamiast pełnego zestawu dla pięciu narzędzi, aby zasady były krótkie i prawdziwe, akceptując, że nowe narzędzie wymaga dopisania adaptera.

- Usunięte adaptery: `.gemini/`, `GEMINI.md`, `.github/agents/`, `.github/instructions/`, `.github/skills/`, `.github/prompts/`, `.github/copilot-instructions.md`, `.vscode/mcp.json`.
- Usunięte role: wszystkie poza `rj-qa-verifier` (9 ról).
- Usunięte skille: `rj-add-agent`, `rj-add-skill`, `rj-daily-report`, `rj-sprint-report`. Raporty ze spotkań piszemy z szablonów w `03-scrum-i-spotkania`.
- Usunięta reguła `60-kontekst-i-tokeny.md`. Najważniejsza wskazówka (nie wczytywać całych dużych plików) jest w `AGENTS.md`.
- `sync_agents.py` generuje tylko `.claude/agents/`, `.claude/skills/` i komendy Antigravity w `.agents/workflows/`.

## Konsekwencje

### Pozytywne

- Ponad 100 plików mniej i jeden spójny opis w `AGENTS.md` oraz `.agents/README.md`.
- Mniej miejsc, w których zasady mogą się rozjechać z kodem.

### Negatywne / ryzyka

- Osoba używająca Copilota albo Gemini nie dostanie gotowych adapterów. Może skorzystać z `AGENTS.md` albo poprosić o dopisanie adaptera.

### Do zrobienia

- [ ] Po zmianie backendu (osobny ADR) przepisać reguły i skille tak, żeby wskazywały nowe ścieżki i polecenia.
