<!-- CONFLUENCE 1:1 EXPORT | Source: docs/00-przewodnik-i-setup/04-sciaga-komend.md @ 10829d3 (2026-11-02) -->
# 0.4 Ściąga komend deweloperskich, testowych i SDD

> **Źródło prawdy:** repozytorium (`docs/00-przewodnik-i-setup/04-sciaga-komend.md`) · **Kategoria dokumentacji:** Ściąga deweloperska · **Etap SDD:** Realizacja i weryfikacja

Zestawienie najważniejszych poleceń używanych w codziennej pracy nad projektem **RE:JOLTANCE**. Wszystkie komendy należy uruchamiać z głównego katalogu repozytorium (o ile nie zaznaczono inaczej).

---

## 1. Konfiguracja i uruchamianie aplikacji

| Cel | Polecenie |
|---|---|
| Pierwsze przygotowanie repozytorium po sklonowaniu (Windows) | `powershell -ExecutionPolicy Bypass -File tools/setup.ps1 -TrustDevCert` |
| Pierwsze przygotowanie repozytorium po sklonowaniu (macOS / Linux) | `bash tools/setup.sh` |
| Diagnostyka środowiska (bez wprowadzania zmian w systemie) | `powershell -ExecutionPolicy Bypass -File tools/doctor.ps1` |
| Uruchomienie całej aplikacji (serwer + klient web + panel Aspire) | `dotnet run --project src/Rejoltance.AppHost` *(lub `aspire run`)* |
| Uruchomienie samego serwera gry (ASP.NET Core + SignalR) | `dotnet run --project src/Rejoltance.Server` |
| Uruchomienie samego klienta webowego (w katalogu `src/web`) | `SERVER_HTTP=http://localhost:5000 npm run dev` |
| Uruchomienie referencyjnego prototypu JS w przeglądarce | `npx serve prototype/revibance` |

---

## 2. Budowanie, testy i kontrole jakości (CI lokalnie)

| Cel | Polecenie |
|---|---|
| Kompilacja całej solucji .NET | `dotnet build Rejoltance.slnx` |
| Szybkie testy jednostkowe, architektoniczne i serwerowe (bez AppHost) | `dotnet test Rejoltance.slnx --filter "Category!=Integration"` |
| Uruchomienie testu konkretnej reguły gry (np. `R-14`) | `dotnet test Rejoltance.slnx --filter "FullyQualifiedName~R14"` |
| Pełny test dymny (smoke test) całej aplikacji z Aspire AppHost | `dotnet test tests/Rejoltance.AppHost.Tests` |
| Sprawdzenie formatowania kodu C# | `dotnet format Rejoltance.slnx --verify-no-changes` |
| Testy jednostkowe klienta React/TypeScript | `npm --prefix src/web test` |
| Kontrola typów TypeScript, linter ESLint i build produkcyjny klienta | `npm --prefix src/web run typecheck && npm --prefix src/web run lint && npm --prefix src/web run build` |
| **Walidacja wszystkich specyfikacji OpenSpec oraz lintera Markdown** | `npm run check` |
| Odświeżenie próbki kontraktu JSON po zmianie DTO (`MatchView`) | `UPDATE_CONTRACT_SAMPLES=1 dotnet test tests/Rejoltance.Server.Tests` |

---

## 3. Skrypty narzędziowe i automatyzacja (`tools/`)

| Cel | Polecenie regenerujące pliki | Polecenie sprawdzające w CI (`--check`) |
|---|---|---|
| Synchronizacja definicji agentów, reguł i skilli z `.agents/` do adapterów IDE | `python tools/agents/sync_agents.py` | `python tools/agents/sync_agents.py --check` |
| Ekstrakcja kart i talii z prototypu JS do `cards.json` i `decks.json` | `python tools/content/extract_cards.py` | `python tools/content/extract_cards.py --check` |
| Generowanie plików importu CSV do Jiry oraz podsumowania `BACKLOG.md` z `backlog.toml` | `python tools/backlog/gen_jira_csv.py` | `python tools/backlog/gen_jira_csv.py --check` |
| Walidacja i eksport drzewa dokumentacji `docs/` do formatu Confluence | `python tools/confluence/sync_confluence.py` | `python tools/confluence/sync_confluence.py --check` |

---

## 4. Praca ze specyfikacjami OpenSpec (Spec-Driven Development)

| Etap SDD | Claude Code / Gemini CLI | Antigravity / GitHub Copilot | OpenAI Codex |
|---|---|---|---|
| **1. Eksploracja problemu** | `/opsx:explore` | `/opsx-explore` | `$openspec-explore` |
| **2. Propozycja specyfikacji zmiany** | `/opsx:propose REJ-123 opis` | `/opsx-propose REJ-123 opis` | `$openspec-propose REJ-123 opis` |
| **3. Aktualizacja specyfikacji w toku** | `/opsx:update` | `/opsx-update` | `$openspec-update-change` |
| **4. Implementacja wg `tasks.md`** | `/opsx:apply` | `/opsx-apply` | `$openspec-apply-change` |
| **5. Synchronizacja specyfikacji** | `/opsx:sync` | `/opsx-sync` | `$openspec-sync-specs` |
| **6. Archiwizacja po merge PR** | `/opsx:archive` | `/opsx-archive` | `$openspec-archive-change` |

---

## 5. Szybka mapa skilli zespołowych (`.agents/skills/`)

| Skill (`/nazwa`) | Przeznaczenie | Główny agent korzystający ze skilla |
|---|---|---|
| `rj-start-feature` | Rozpoczęcie pracy nad zadaniem Jira (gałąź + inicjacja zmiany OpenSpec) | `rj-orchestrator` |
| `rj-add-rule-test` | Przełożenie reguły gry z prototypu na wymaganie `R-nn` i test xUnit | `rj-rules-expert`, `rj-backend-engineer`, `rj-test-verifier` |
| `rj-add-card` | Dodanie lub modyfikacja karty w prototypie i regeneracja katalogu JSON | `rj-rules-expert`, `rj-backend-engineer` |
| `rj-write-adr` | Utworzenie nowego dokumentu decyzji architektonicznej (ADR) wg szablonu | `rj-architect`, `rj-docs-writer` |
| `rj-pr-ready` | Kompleksowa weryfikacja buildu, testów, specyfikacji i opisu przed PR | `rj-orchestrator`, `rj-reviewer`, `rj-test-verifier` |
| `rj-sync-confluence` | Walidacja struktury `docs/` i wygenerowanie paczki stron do Confluence PB | `rj-docs-writer` |
| `rj-backlog-to-jira` | Aktualizacja `backlog.toml` i wygenerowanie plików CSV do importu w Jirze | `rj-scrum-assistant` |
| `rj-daily-report` | Przygotowanie ustrukturyzowanej notatki ze spotkania Daily Scrum | `rj-scrum-assistant` |
| `rj-sprint-report` | Przygotowanie raportu Sprint Review, Retrospektywy i analizy estymat | `rj-scrum-assistant` |
| `rj-add-skill` | Utworzenie nowego skilla w `.agents/skills/` i synchronizacja adapterów | `rj-docs-writer` |
| `rj-add-agent` | Utworzenie nowej roli agenta w `.agents/agents/` i synchronizacja adapterów | `rj-docs-writer` |
