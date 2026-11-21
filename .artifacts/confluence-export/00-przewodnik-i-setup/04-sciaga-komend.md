<!-- CONFLUENCE 1:1 EXPORT | Source: docs/00-przewodnik-i-setup/04-sciaga-komend.md -->
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
| Prototyp referencyjny JS w przeglądarce | `npx serve prototype/game` |

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
| Synchronizacja agentów, reguł i skilli z `.agents/` do adapterów IDE | `npm run agents` | `npm run agents:check` |
| Ekstrakcja kart i talii z prototypu JS do `cards.json` i `decks.json` | `npm run cards` | `npm run cards:check` |
| Pliki importu CSV do Jiry i podsumowanie `BACKLOG.md` z `backlog.toml` | `npm run backlog` | `npm run backlog:check` |
| Walidacja i eksport drzewa `docs/` do Confluence | `npm run docs:check` | `npm run docs:check` |

---

## 4. Praca ze specyfikacjami OpenSpec

Ta sama komenda ma inną składnię w różnych narzędziach AI:

| Etap SDD | Claude Code | Antigravity | Codex |
|---|---|---|---|
| **1. Eksploracja problemu** | `/opsx:explore` | `/opsx-explore` | `$openspec-explore` |
| **2. Propozycja zmiany w specyfikacji** | `/opsx:propose REJ-123 opis` | `/opsx-propose REJ-123 opis` | `$openspec-propose REJ-123 opis` |
| **3. Aktualizacja specyfikacji w toku** | `/opsx:update` | `/opsx-update` | `$openspec-update-change` |
| **4. Implementacja według `tasks.md`** | `/opsx:apply` | `/opsx-apply` | `$openspec-apply-change` |
| **5. Synchronizacja specyfikacji** | `/opsx:sync` | `/opsx-sync` | `$openspec-sync-specs` |
| **6. Archiwizacja po merge PR** | `/opsx:archive` | `/opsx-archive` | `$openspec-archive-change` |

---

## 5. Skille zespołu (`.agents/skills/`)

Skill to opisana krok po kroku procedura, którą wykonuje agent albo człowiek. Niezależną recenzję zmian robi rola `rj-qa-verifier`.

| Skill (`/nazwa`) | Do czego służy |
|---|---|
| `rj-start-feature` | Start pracy nad zadaniem z Jiry: gałąź i ewentualna zmiana OpenSpec. |
| `rj-spec-guardian` | Spójność OpenSpec, indeksu R-nn, rozbieżności D-nn i backlogu. |
| `rj-add-rule-test` | Przeniesienie reguły gry z prototypu na wymaganie `R-nn` i test. |
| `rj-add-card` | Zmiana kart: dociągnięcie prototypu i ponowne wygenerowanie katalogu JSON. |
| `rj-oracle-diff` | Porównanie silnika z prototypem JS. |
| `rj-write-adr` | Nowy zapis decyzji architektonicznej (ADR, Architecture Decision Record) według szablonu. |
| `rj-pr-ready` | Sprawdzenie buildu, testów, specyfikacji i opisu przed Pull Requestem (PR). |
| `rj-sync-confluence` | Walidacja struktury `docs/` i paczka stron do Confluence PB (Politechniki Białostockiej). |
| `rj-backlog-to-jira` | Aktualizacja `backlog.toml` i pliki CSV do importu w Jirze. |
