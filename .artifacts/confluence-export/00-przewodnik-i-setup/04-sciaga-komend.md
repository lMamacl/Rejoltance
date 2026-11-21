<!-- CONFLUENCE 1:1 EXPORT | Source: docs/00-przewodnik-i-setup/04-sciaga-komend.md -->
# 0.4 Ściąga komend deweloperskich, testowych i SDD

> **Źródło prawdy:** repozytorium (`docs/00-przewodnik-i-setup/04-sciaga-komend.md`) · **Kategoria dokumentacji:** ściąga deweloperska · **Etap SDD:** Realizacja i weryfikacja

Tu zebraliśmy najważniejsze polecenia z codziennej pracy nad **RE:JOLTANCE**. Uruchamiaj je z głównego katalogu repozytorium, chyba że w wierszu podano inaczej.

SDD (Spec-Driven Development) to nasza metoda pracy: najpierw specyfikacja, potem kod. CI (Continuous Integration) to automatyczne sprawdzanie zmian na GitHubie.

---

## 1. Konfiguracja i uruchamianie aplikacji

| Cel | Polecenie |
|---|---|
| Pierwsze przygotowanie repozytorium po sklonowaniu (każdy system) | `npm run setup` |
| Diagnostyka środowiska (nic nie zmienia w systemie) | `npm run doctor` |
| Gra lokalnie: serwer + klient, restart po zmianie kodu | `npm run dev` |
| Sam serwer gry (Fastify + Socket.IO) | `npm start` |
| Prototyp referencyjny JS w przeglądarce | `npx serve prototype/game` |

---

## 2. Testy i kontrole jakości (CI lokalnie)

| Cel | Polecenie |
|---|---|
| Wszystko, co sprawdza CI dla kodu: lint, typecheck, testy, build | `npm run verify` |
| Wszystkie testy (silnik, katalog kart, serwer, klient, narzędzia) | `npm test` |
| Testy w trybie obserwowania zmian | `npm run test:watch` |
| Test jednej reguły gry (np. `R-14`) | `npx vitest run -t R14_` |
| ESLint z granicami modułów i determinizmem silnika | `npm run lint` |
| Kontrola typów (całe repo) | `npm run typecheck` |
| Odświeżenie próbki kontraktu po zmianie `MatchView` | `UPDATE_CONTRACT_SAMPLES=1 npm test` |
| OpenSpec, markdownlint i wszystkie generatory w trybie `--check` | `npm run check` |

---

## 3. Skrypty narzędziowe (`tools/`)

Każdy generator ma dwa tryby: `npm run <nazwa>` zapisuje pliki, a `npm run <nazwa>:check` tylko sprawdza, czy są aktualne (tak robi CI). Opis wszystkich skryptów: [`tools/README.md`](../../tools/README.md).

| Cel | Generowanie plików | Sprawdzenie |
|---|---|---|
| Adaptery agentów z `.agents/` (Claude Code, Antigravity) | `npm run agents` | `npm run agents:check` |
| Karty i talie z prototypu JS do `packages/content/data` | `npm run cards` | `npm run cards:check` |
| Pliki CSV do Jiry i `BACKLOG.md` z `backlog.toml` | `npm run backlog` | `npm run backlog:check` |
| Paczka stron do Confluence (`.artifacts/confluence-export`) | `npm run docs:export` | `npm run docs:check` |
| Publikacja w Confluence (token z `.env`) | `npm run docs:publish -- --changed-since develop --only-existing` | `npm run docs:publish -- --dry-run …` |

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
