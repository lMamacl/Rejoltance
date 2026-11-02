<!-- CONFLUENCE 1:1 EXPORT | Source: docs/00-przewodnik-i-setup/04-sciaga-komend.md @ a2bf2a4 (2026-11-02) -->
# 0.4 Ściąga komend deweloperskich, testowych i SDD

> **Źródło prawdy:** repozytorium (`docs/00-przewodnik-i-setup/04-sciaga-komend.md`) · **Kategoria dokumentacji:** ściąga deweloperska · **Etap SDD:** Realizacja i weryfikacja

Tu zebraliśmy najważniejsze polecenia z codziennej pracy nad **RE:JOLTANCE**. Uruchamiaj je z głównego katalogu repozytorium, chyba że w wierszu podano inaczej.

SDD (Spec-Driven Development) to nasza metoda pracy: najpierw specyfikacja, potem kod. CI (Continuous Integration) to automatyczne sprawdzanie zmian na GitHubie.

---

## 1. Konfiguracja i uruchamianie aplikacji

| Cel | Polecenie |
|---|---|
| Pierwsze przygotowanie repozytorium po sklonowaniu (Windows) | `powershell -ExecutionPolicy Bypass -File tools/setup.ps1 -TrustDevCert` |
| Pierwsze przygotowanie repozytorium po sklonowaniu (macOS / Linux) | `bash tools/setup.sh` |
| Diagnostyka środowiska (nic nie zmienia w systemie) | `powershell -ExecutionPolicy Bypass -File tools/doctor.ps1` |
| Cała aplikacja (serwer + klient web + panel Aspire) | `dotnet run --project src/Rejoltance.AppHost` *(albo `aspire run`)* |
| Sam serwer gry (ASP.NET Core + SignalR) | `dotnet run --project src/Rejoltance.Server` |
| Sam klient webowy (w katalogu `src/web`) | `SERVER_HTTP=http://localhost:5000 npm run dev` |
| Prototyp referencyjny JS w przeglądarce | `npx serve prototype/revibance` |

---

## 2. Budowanie, testy i kontrole jakości (CI lokalnie)

| Cel | Polecenie |
|---|---|
| Kompilacja całej solucji .NET | `dotnet build Rejoltance.slnx` |
| Szybkie testy jednostkowe, architektoniczne i serwerowe (bez AppHost) | `dotnet test Rejoltance.slnx --filter "Category!=Integration"` |
| Test jednej reguły gry (np. `R-14`) | `dotnet test Rejoltance.slnx --filter "FullyQualifiedName~R14"` |
| Test dymny (smoke test) całej aplikacji z Aspire AppHost | `dotnet test tests/Rejoltance.AppHost.Tests` |
| Sprawdzenie formatowania kodu C# | `dotnet format Rejoltance.slnx --verify-no-changes` |
| Testy jednostkowe klienta React/TypeScript | `npm --prefix src/web test` |
| Kontrola typów TypeScript, ESLint i build produkcyjny klienta | `npm --prefix src/web run typecheck && npm --prefix src/web run lint && npm --prefix src/web run build` |
| Walidacja specyfikacji OpenSpec i lintera Markdown | `npm run check` |
| Odświeżenie próbki kontraktu JSON po zmianie DTO (`MatchView`) | `UPDATE_CONTRACT_SAMPLES=1 dotnet test tests/Rejoltance.Server.Tests` |

---

## 3. Skrypty narzędziowe (`tools/`)

Każdy skrypt ma dwa tryby. Bez flagi generuje pliki. Z flagą `--check` tylko sprawdza, czy pliki są aktualne. Tego trybu używa CI.

| Cel | Generowanie plików | Sprawdzenie w CI (`--check`) |
|---|---|---|
| Synchronizacja agentów, reguł i skilli z `.agents/` do adapterów IDE | `python tools/agents/sync_agents.py` | `python tools/agents/sync_agents.py --check` |
| Ekstrakcja kart i talii z prototypu JS do `cards.json` i `decks.json` | `python tools/content/extract_cards.py` | `python tools/content/extract_cards.py --check` |
| Pliki importu CSV do Jiry i podsumowanie `BACKLOG.md` z `backlog.toml` | `python tools/backlog/gen_jira_csv.py` | `python tools/backlog/gen_jira_csv.py --check` |
| Walidacja i eksport drzewa `docs/` do Confluence | `python tools/confluence/sync_confluence.py` | `python tools/confluence/sync_confluence.py --check` |

---

## 4. Praca ze specyfikacjami OpenSpec

Ta sama komenda ma inną składnię w różnych narzędziach AI:

| Etap SDD | Claude Code / Gemini CLI | Antigravity / GitHub Copilot | OpenAI Codex |
|---|---|---|---|
| **1. Eksploracja problemu** | `/opsx:explore` | `/opsx-explore` | `$openspec-explore` |
| **2. Propozycja zmiany w specyfikacji** | `/opsx:propose REJ-123 opis` | `/opsx-propose REJ-123 opis` | `$openspec-propose REJ-123 opis` |
| **3. Aktualizacja specyfikacji w toku** | `/opsx:update` | `/opsx-update` | `$openspec-update-change` |
| **4. Implementacja według `tasks.md`** | `/opsx:apply` | `/opsx-apply` | `$openspec-apply-change` |
| **5. Synchronizacja specyfikacji** | `/opsx:sync` | `/opsx-sync` | `$openspec-sync-specs` |
| **6. Archiwizacja po merge PR** | `/opsx:archive` | `/opsx-archive` | `$openspec-archive-change` |

---

## 5. Skille zespołu (`.agents/skills/`)

Skill to opisana krok po kroku procedura, którą wykonuje agent albo człowiek. Kolumna „Agenci” pokazuje role, które mają dany skill w swojej konfiguracji (`.agents/agents/`).

| Skill (`/nazwa`) | Do czego służy | Agenci |
|---|---|---|
| `rj-start-feature` | Start pracy nad zadaniem z Jiry: gałąź i nowa zmiana OpenSpec. | `rj-orchestrator` |
| `rj-add-rule-test` | Przeniesienie reguły gry z prototypu na wymaganie `R-nn` i test xUnit. | `rj-rules-engineer`, `rj-backend-engineer`, `rj-qa-verifier` |
| `rj-add-card` | Dodanie lub zmiana karty w prototypie i ponowne wygenerowanie katalogu JSON. | `rj-card-author` |
| `rj-write-adr` | Nowy zapis decyzji architektonicznej (ADR, Architecture Decision Record) według szablonu. | `rj-architect`, `rj-docs-writer` |
| `rj-pr-ready` | Sprawdzenie buildu, testów, specyfikacji i opisu przed Pull Requestem (PR). | `rj-orchestrator`, `rj-qa-verifier` |
| `rj-sync-confluence` | Walidacja struktury `docs/` i paczka stron do Confluence PB (Politechniki Białostockiej). | `rj-docs-writer`, `rj-scrum-jira` |
| `rj-backlog-to-jira` | Aktualizacja `backlog.toml` i pliki CSV do importu w Jirze. | `rj-scrum-jira` |
| `rj-daily-report` | Notatka ze spotkania Daily Scrum. | `rj-scrum-jira` |
| `rj-sprint-report` | Raport z Sprint Review, Retrospektywy i analiza estymat. | `rj-scrum-jira` |
| `rj-add-skill` | Nowy skill w `.agents/skills/` i synchronizacja adapterów. | `rj-orchestrator` |
| `rj-add-agent` | Nowa rola agenta w `.agents/agents/` i synchronizacja adapterów. | `rj-orchestrator` |
