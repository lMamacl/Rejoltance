# `.agents/` — Kanon Systemu Agentów AI (RE:JOLTANCE)

Katalog `.agents/` stanowi **jedyne źródło prawdy** dla konfiguracji wszystkich asystentów i agentów AI wspierających zespół w procesie **Spec-Driven Development (SDD)** (zgodnie z decyzją [`ADR-0009`](../docs/01-dokumentacja-systemowa/07-decyzje-adr/0009-kanon-agentow-i-adaptery.md)).

> **Kompletny podręcznik dla ludzi (architektura, matryca ról i wbudowanych skilli, instrukcja pisania specyfikacji oraz warsztat tworzenia własnych agentów i skilli):** [`docs/04-system-agentow-ai/README.md`](../docs/04-system-agentow-ai/README.md).

---

## Struktura katalogu `.agents/`

```text
.agents/
├── rules/                      ← 8 reguł strażniczych (Konstytucja 00 + reguły warstwowe 10..70, maks. 80 linii/plik)
│   ├── 00-konstytucja.md       ← Nadrzędne prawo projektu (10 artykułów)
│   ├── 10-prawda-i-niepewnosc.md ← Zakaz zgadywania, hierarchia źródeł prawdy, praca z D-nn
│   ├── 20-plan-i-zakres.md     ← Kiedy wymagana jest propozycja OpenSpec i plan przed kodem
│   ├── 30-architektura-i-kontrakty.md ← Granice 5 modułów i ochrona 5 zamrożonych kontraktów
│   ├── 40-kod-i-testy.md       ← Konwencje C#/TS, nazewnictwo testów Rnn_, zasada Fail Loud
│   ├── 50-git-i-jira.md        ← Nazewnictwo gałęzi, commitów, PR oraz reguła zadań ≤ 4 h
│   ├── 60-kontekst-i-tokeny.md ← Higiena okna kontekstowego modelu AI
│   └── 70-dokumentacja.md      ← Architektura dokumentacji 1:1 z Confluence (AltexSoft + SDD)
├── agents/                     ← 10 wyspecjalizowanych ról agentowych (maks. 90 linii/plik)
│   ├── rj-orchestrator.md      ← [Grupa A: SDD] Koordynator procesu SDD i delegowania zadań
│   ├── rj-spec-analyst.md      ← [Grupa A: SDD] Analityk wymagań PRD, reguł R-nn i OpenSpec
│   ├── rj-architect.md         ← [Grupa A: SDD] Strażnik SAD, granic warstw, kontraktów i ADR
│   ├── rj-rules-engineer.md    ← [Grupa B: Domena] Inżynier deterministycznego silnika Rejoltance.Kernel
│   ├── rj-card-author.md       ← [Grupa B: Domena] Twórca kart i efektów w Rejoltance.Content
│   ├── rj-backend-engineer.md  ← [Grupa C: Aplikacja] Inżynier serwera ASP.NET Core / SignalR
│   ├── rj-frontend-engineer.md ← [Grupa C: Aplikacja] Inżynier klienta React / TypeScript
│   ├── rj-qa-verifier.md       ← [Grupa D: Jakość i Docs] Niezależny audytor QA i testów R-nn
│   ├── rj-scrum-jira.md        ← [Grupa D: Jakość i Docs] Asystent Scruma, backlog.toml i Jiry
│   └── rj-docs-writer.md       ← [Grupa D: Jakość i Docs] Redaktor dokumentacji AltexSoft i Confluence 1:1
├── skills/                     ← 13 powtarzalnych procedur zespołowych rj-* + skille OpenSpec (maks. 90 linii/plik)
│   ├── rj-start-feature/       ← Rozpoczęcie pracy nad zadaniem Jira (gałąź + kontekst SDD)
│   ├── rj-spec-guardian/       ← Audyt spójności OpenSpec ↔ indeks R-nn ↔ rozbieżności D-nn
│   ├── rj-add-rule-test/       ← Dodawanie testu jednostkowego Rnn_ ze scenariuszem GIVEN/WHEN/THEN
│   ├── rj-add-card/            ← Przenoszenie lub dodawanie karty z prototypu JS do Rejoltance.Content + Kernel
│   ├── rj-oracle-diff/         ← Porównanie zachowania silnika C# z wyrocznią JS v11
│   ├── rj-pr-ready/            ← Pełna weryfikacja pionowego plastra przed otwarciem PR
│   ├── rj-write-adr/           ← Tworzenie rekordu decyzji architektonicznej ADR-NNNN
│   ├── rj-backlog-to-jira/     ← Walidacja i generowanie BACKLOG.md oraz plików CSV do Jiry
│   ├── rj-daily-report/        ← Tworzenie notatki Daily Scrum gotowej do wklejenia w Confluence
│   ├── rj-sprint-report/       ← Przygotowanie raportu Sprint Review & Retro (szacunki vs wykonanie)
│   ├── rj-sync-confluence/     ← Walidacja i eksport paczki dokumentacji 1:1 do Confluence PB
│   ├── rj-add-agent/           ← Tworzenie nowej roli agenta w .agents/agents/
│   ├── rj-add-skill/           ← Tworzenie nowego skilla w .agents/skills/
│   └── openspec-*/             ← Standardowe skille narzędzia OpenSpec CLI (/opsx:*)
└── workflows/                  ← Skróty przepływów dla Google Antigravity
```

---

## Synchronizacja adapterów narzędzi IDE

Po każdej edycji plików w `.agents/` uruchom skrypt synchronizujący:

```bash
python tools/agents/sync_agents.py
python tools/agents/sync_agents.py --check
```

Skrypt weryfikuje limity linii, poprawność nagłówków YAML, przypisanie wbudowanych skilli (`skills:`) do każdego agenta oraz aktualizuje adaptery w `.claude/agents/`, `.github/agents/`, `.gemini/settings.json` i `.codex/config.toml`.
