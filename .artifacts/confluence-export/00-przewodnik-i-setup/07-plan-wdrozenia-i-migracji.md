<!-- CONFLUENCE 1:1 EXPORT | Source: docs/00-przewodnik-i-setup/07-plan-wdrozenia-i-migracji.md @ 7e9a336 (2026-11-02) -->
# 0.7 Plan wdrożenia i migracji: Co zmienić i co podmienić względem dotychczasowego podejścia

> **Źródło prawdy:** repozytorium (`docs/00-przewodnik-i-setup/07-plan-wdrozenia-i-migracji.md`) · **Kategoria dokumentacji:** Dokumentacja procesowa — Plan transformacji i wdrożenia · **Etap SDD:** Fundamenty i organizacja projektu

Niniejszy dokument stanowi kompletną instrukcję migracji projektu **RE:JOLTANCE** z dotychczasowego stanu na gałęzi `develop` do nowego, ujednoliconego standardu opartego na klasyfikacji dokumentacji technicznej **AltexSoft**, procesie **Spec-Driven Development (SDD)** oraz mapowaniu **1:1 z przestrzenią Confluence PB**.

---

## 1. Co zmieniamy względem dotychczasowego podejścia i dlaczego?

| Obszar | Dotychczasowe podejście na gałęzi `develop` (Przed zmianą) | Nowe podejście po refaktoryzacji (Docelowe) | Korzyść dla zespołu i prowadzącego |
|---|---|---|---|
| **Struktura katalogu `docs/`** | **11 rozproszonych katalogów** (`00-start`, `01-dip`, `02-rules`, `03-architecture`, `04-adr`, `05-backlog`, `06-scrum`, `07-meetings`, `08-research`, `09-jakosc`, `10-szablony` + `99-sources`), w których pliki systemowe mieszały się z procesowymi i instrukcjami startowymi. | **6 spójnych sekcji głównych 1:1 z Confluence PB** (`00-przewodnik-i-setup`, `01-dokumentacja-systemowa`, `02-dokumentacja-uzytkownika`, `03-dokumentacja-procesowa`, `04-system-agentow-ai`, `05-szablony` + `99-archiwum-zrodel`). | Bezpośrednie przenoszenie stron **1:1 z repozytorium do Confluence** bez zgadywania, gdzie umieścić dany dokument. |
| **Główne dokumenty: PRD, SAD i Stos** | Dokument `PRD` istniał wyłącznie jako pusty szablon (`10-szablony/prd.md`), a `SAD.md`, `STOS.md`, `API.md`, `UX.md` i `STRATEGIA-TESTOW.md` były skrótowymi szkicami pisanymi hasłami. | **Pełne, merytoryczne dokumenty rdzeniowe** w `01-dokumentacja-systemowa/`: kompletny **PRD** (`01-prd-wymagania-produktu.md`), kompletny **SAD** z diagramami C4 i ERD (`05-sad-architektura-systemu.md`), pełny **Stos i Roadmapa IT** (`06-stos-technologiczny.md`), a pozostałe typy dokumentacji dostarczone również jako gotowe szablony w `05-szablony/`. | Spełnienie wymagań zadania projektowego (fokus na SAD i wymaganiach produktu + szablony dla pozostałych typów z artykułu AltexSoft). |
| **Dokumentacja użytkownika i wdrożenia** | Całkowity brak sekcji dokumentacji użytkownika końcowego i administratora (istniały tylko puste szablony w `10-szablony/`). | Utworzona sekcja **`02-dokumentacja-uzytkownika/`** zawierająca pełny **Podręcznik gracza** (`01-podrecznik-gracza.md`) oraz **Instrukcję wdrożenia i utrzymania systemu** (`02-instrukcja-wdrozenia-i-utrzymania.md`). | Pełne pokrycie gałęzi *Dokumentacja użytkownika* wg klasyfikacji AltexSoft oraz wymogów **EU5/EU6**. |
| **System agentów AI (`.agents/`)** | **11 niepogrupowanych ról** o nakładających się kompetencjach (`rj-reviewer`, `rj-security-reviewer`, `rj-test-verifier`, `rj-researcher`), brak jawnego przypisania umiejętności (*skilli*) do agentów w nagłówkach YAML oraz rozrzucone, skrótowe pliki `jak-dodac-agenta.md` / `jak-dodac-skill.md`. | **10 ról w 4 grupach tematycznych** (A: Orkiestracja i SDD, B: Domena, C: Aplikacja, D: Jakość i Dokumentacja), **jawna lista `skills:` przypisana do każdego agenta** i walidowana automatycznie przez `sync_agents.py`, oraz kompletny podręcznik dla ludzi w **`docs/04-system-agentow-ai/`**. | Każdy członek zespołu od razu rozumie, jak skonfigurować środowisko, który agent za co odpowiada i jak samodzielnie budować agentów, umiejętności oraz specyfikacje. |
| **Język i styl dokumentacji** | Styl telegraficzny, urywane równoważniki zdań, sztuczne znaczniki `[V]`/`[Z]` oraz mieszanie angielskich i polskich nagłówków. | **Czysty, naturalny język polski** we wszystkich tytułach, nagłówkach, tabelach, opisach reguł i definicjach agentów/umiejętności — przy zachowaniu **standardowych angielskich nazw w kodzie** (`Rejoltance.Kernel`, `MatchView`, `Intent`, `SeededRng`). | Wysoka czytelność dla ludzi (zespołu i prowadzącego) przy zachowaniu pełnej precyzji inżynierskiej w kodzie C# i TypeScript. |

---

## 2. Co dokładnie podmienić w katalogu `docs/` (Mapa migracji plików 1:1)

### 2.1 Sekcja `00-przewodnik-i-setup/` (zastępuje dawny katalog `docs/00-start/`)

| Stary plik na gałęzi `develop` | Nowy plik w docelowej strukturze | Co zostało zrobione (Akcja migracyjna) |
|---|---|---|
| `docs/00-start/README.md` | `docs/00-przewodnik-i-setup/README.md` | **Podmienić:** nowy spis treści sekcji wprowadzającej. |
| `docs/00-start/jak-zaczac.md` | `docs/00-przewodnik-i-setup/01-szybki-start-i-instalacja.md` | **Podmienić:** pełna instrukcja konfiguracji środowiska, uruchomienia Aspire i diagnostyki problemów na Windows/macOS/Linux. |
| `docs/00-start/mapa-dokumentacji.md` | `docs/00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md` | **Podmienić:** architektura dokumentacji SDD, porównanie wariantów AltexSoft 1:1 vs SDD 1:1 oraz mapa drzewa Confluence. |
| `docs/00-start/jak-pracujemy.md` | `docs/00-przewodnik-i-setup/03-proces-pracy-i-git-scrum.md` | **Podmienić:** opis pełnego cyklu pracy od zadania w Jirze przez OpenSpec do Pull Requesta, mirrora Bitbucket oraz kryteriów DoR/DoD. |
| `docs/00-start/sciaga.md` | `docs/00-przewodnik-i-setup/04-sciaga-komend.md` | **Podmienić:** uporządkowana ściąga wszystkich komend `.NET`, `npm`, `openspec`, `python` i `git`. |
| `docs/00-start/slownik.md` | `docs/00-przewodnik-i-setup/05-slownik-pojec.md` | **Podmienić:** rozszerzony słownik pojęć domenowych gry oraz pojęć architektonicznych i SDD. |
| `docs/00-start/pytania-otwarte.md` + `zalozenia-i-niepewnosci.md` | `docs/00-przewodnik-i-setup/06-decyzje-otwarte-i-zalozenia.md` | **Połączyć i podmienić:** dwa częściowo duplikujące się pliki połączono w jeden spójny rejestr decyzji otwartych (`#1–#10`) i założeń projektowych. |
| *(brak odpowiednika)* | `docs/00-przewodnik-i-setup/07-plan-wdrozenia-i-migracji.md` | **Dodać nowy plik:** niniejszy plan wdrożenia i podmiany plików względem dotychczasowego `develop`. |

---

### 2.2 Sekcja `01-dokumentacja-systemowa/` (zastępuje `02-rules/`, `03-architecture/`, `04-adr/`, `09-jakosc/`)

| Stary plik na gałęzi `develop` | Nowy plik w docelowej strukturze | Co zostało zrobione (Akcja migracyjna) |
|---|---|---|
| `docs/02-rules/README.md` + `03-architecture/README.md` + `09-jakosc/README.md` | `docs/01-dokumentacja-systemowa/README.md` | **Połączyć i podmienić:** jeden wspólny indeks dokumentacji systemowej. |
| *(brak — istniał tylko pusty szablon w `10-szablony/prd.md`)* | `docs/01-dokumentacja-systemowa/01-prd-wymagania-produktu.md` | **Dodać nowy dokument rdzeniowy:** kompletny **Dokument Wymagań Produktu (PRD)** napisany od podstaw dla RE:JOLTANCE. |
| `docs/02-rules/SPECYFIKACJA.md` | `docs/01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md` | **Przenieść (`git mv`) i zaktualizować:** dodano polski nagłówek metadanych i zaktualizowano wszystkie odnośniki. |
| `docs/02-rules/RULES-INDEX.md` | `docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md` | **Przenieść (`git mv`) i zaktualizować:** macierz śledzenia 55 reguł `R-nn` powiązana z `gen_jira_csv.py`. |
| `docs/02-rules/ROZBIEZNOSCI.md` | `docs/01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md` | **Przenieść (`git mv`) i zaktualizować:** rejestr 20 rozbieżności prototypu JS (`D-01..D-20`). |
| `docs/03-architecture/SAD.md` | `docs/01-dokumentacja-systemowa/05-sad-architektura-systemu.md` | **Podmienić (napisany od nowa):** pełny **Dokument Architektury Oprogramowania (SAD)** z diagramami C4 Poziom 1–3, diagramami sekwencji, modelem danych ERD i koncepcjami przekrojowymi. |
| `docs/03-architecture/STOS.md` | `docs/01-dokumentacja-systemowa/06-stos-technologiczny.md` | **Podmienić (rozbudowany):** pełna specyfikacja stosu technologicznego, tabela odrzuconych alternatyw i roadmapa technologiczna (Sprinty 0–5 i Semestr 2). |
| `docs/04-adr/*` (`README.md`, `0000`..`0011`) | `docs/01-dokumentacja-systemowa/07-decyzje-adr/*` | **Przenieść (`git mv`) i zaktualizować:** polskie tytuły, zaktualizowany rejestr ADR oraz rozbudowany `0011-dokumentacja-hybryda-repo-confluence.md`. |
| `docs/03-architecture/MAP.md` | `docs/01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md` | **Podmienić:** przejrzysta mapa 5 modułów, granic warstw i przewodnik „gdzie dodać kod”. |
| `docs/03-architecture/API.md` | `docs/01-dokumentacja-systemowa/09-kontrakty-i-api.md` | **Podmienić:** pełna specyfikacja 5 zamrożonych kontraktów JSON, endpointów REST i metod SignalR. |
| `docs/03-architecture/UX.md` | `docs/01-dokumentacja-systemowa/10-ux-design-i-przeplywy.md` | **Podmienić:** mapa ekranów, makieta stołu 2×2, przepływ użytkownika 1v1 oraz przewodnik stylu wizualnego i kontrastu WCAG 2.1 AA. |
| `docs/09-jakosc/STRATEGIA-TESTOW.md` | `docs/01-dokumentacja-systemowa/11-strategia-testow-qa.md` | **Podmienić:** pełna strategia zapewnienia jakości i testów automatycznych (piramida testów, wyrocznia JS, bramki CI, pokrycie NFR). |

---

### 2.3 Sekcja `02-dokumentacja-uzytkownika/` (Nowa sekcja — brak odpowiednika na `develop`)

| Stary plik na gałęzi `develop` | Nowy plik w docelowej strukturze | Co zostało zrobione (Akcja migracyjna) |
|---|---|---|
| *(brak)* | `docs/02-dokumentacja-uzytkownika/README.md` | **Dodać nowy plik:** indeks dokumentacji użytkownika i administratora. |
| *(brak — istniał tylko pusty szablon)* | `docs/02-dokumentacja-uzytkownika/01-podrecznik-gracza.md` | **Dodać nowy dokument:** kompletny podręcznik gracza (szybki start w 60 s, zasady rundy i walki, słowa kluczowe, sterowanie, FAQ i rozwiązywanie problemów). |
| *(brak — istniał tylko pusty szablon)* | `docs/02-dokumentacja-uzytkownika/02-instrukcja-wdrozenia-i-utrzymania.md` | **Dodać nowy dokument:** instrukcja dla administratora systemu (wdrożenie, zmienne konfiguracyjne, monitorowanie `/health`, kopie zapasowe SQLite/PostgreSQL, odtwarzanie po awarii). |

---

### 2.4 Sekcja `03-dokumentacja-procesowa/` (zastępuje `01-dip/`, `05-backlog/`, `06-scrum/`, `07-meetings/`, `08-research/`)

| Stary plik na gałęzi `develop` | Nowy plik w docelowej strukturze | Co zostało zrobione (Akcja migracyjna) |
|---|---|---|
| `docs/01-dip/README.md` | `docs/03-dokumentacja-procesowa/README.md` | **Podmienić:** wspólny indeks całej dokumentacji procesowej i zarządczej. |
| `docs/01-dip/DIP.md` | `docs/03-dokumentacja-procesowa/01-dip-dokument-inicjujacy.md` | **Przenieść (`git mv`) i zaktualizować linki:** Dokument Inicjujący Projekt (wymóg zaliczenia Semestru 1). |
| `docs/05-backlog/*` (`backlog.toml`, `BACKLOG.md`, `jira-*.csv`, `test-import/`) | `docs/03-dokumentacja-procesowa/02-backlog/*` | **Przenieść (`git mv`) i zaktualizować:** wszystkie pliki backlogu i eksportu CSV w jednym podkatalogu. |
| `docs/00-start/jira-import.md` | `docs/03-dokumentacja-procesowa/02-backlog/instrukcja-importu-jira.md` | **Przenieść i przepisać:** instrukcja dwuetapowego importu CSV do Jiry PB umieszczona bezpośrednio obok plików CSV. |
| `docs/06-scrum/*` + `docs/07-meetings/*` | `docs/03-dokumentacja-procesowa/03-scrum-i-spotkania/*` | **Połączyć i uporządkować:** agenda spotkania startowego oraz szablony raportów *Daily Scrum* i *Sprint Review & Retro* w jednym miejscu. |
| `docs/08-research/*` | `docs/03-dokumentacja-procesowa/04-badania-i-analizy/*` | **Przenieść (`git mv`) i zaktualizować:** raport analizy zastanego kodu (Faza 0) oraz porównanie narzędzi SDD (Faza 1). |

---

### 2.5 Sekcja `04-system-agentow-ai/` (zastępuje rozproszone pliki w `00-start/`)

| Stary plik na gałęzi `develop` | Nowy plik w docelowej strukturze | Co zostało zrobione (Akcja migracyjna) |
|---|---|---|
| *(brak)* | `docs/04-system-agentow-ai/README.md` | **Dodać nowy plik:** punkt wejścia do podręcznika inżynierii agentowej i SDD dla ludzi. |
| `docs/00-start/jira-confluence-mcp.md` + `.agents/README.md` | `docs/04-system-agentow-ai/01-architektura-i-konfiguracja-agentow.md` | **Połączyć i rozbudować:** pełne wyjaśnienie architektury `.agents/`, generowania adapterów dla 5 środowisk IDE, mechanizmu reguł strażniczych oraz konfiguracji serwera MCP. |
| *(brak — wcześniej tylko krótka lista w `.agents/README.md`)* | `docs/04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md` | **Dodać nowy dokument:** szczegółowy opis 10 ról w 4 grupach tematycznych, katalog wszystkich umiejętności (`rj-*` i `openspec-*`) oraz macierz przypisania wbudowanych umiejętności do każdego agenta. |
| `docs/00-start/jak-pisac-spec.md` | `docs/04-system-agentow-ai/03-jak-pisac-specyfikacje-openspec.md` | **Podmienić (rozbudowany):** przewodnik po cyklu życia zmiany w OpenSpec (`/opsx:propose → apply → archive`) i pisaniu scenariuszy `GIVEN / WHEN / THEN`. |
| `docs/00-start/jak-dodac-agenta.md` + `jak-dodac-skill.md` + `jak-dodac-adr.md` + `jak-dodac-karte.md` | `docs/04-system-agentow-ai/04-warsztat-tworzenie-agentow-skilli-i-kart.md` | **Połączyć i przepisać w jeden spójny podręcznik:** 5 praktycznych warsztatów krok po kroku dla członków zespołu. |

---

### 2.6 Sekcja `05-szablony/` (zastępuje dawny katalog `docs/10-szablony/`)

| Stary plik na gałęzi `develop` | Nowy plik w docelowej strukturze | Co zostało zrobione (Akcja migracyjna) |
|---|---|---|
| `docs/10-szablony/README.md` | `docs/05-szablony/README.md` | **Podmienić:** katalog 12 szablonów z mapowaniem na klasyfikację AltexSoft i etapy SDD. |
| `docs/10-szablony/naglowek-strony.md` | `docs/05-szablony/naglowek-strony-confluence.md` | **Podmienić:** ujednolicony wzorzec polskiego nagłówka metadanych dla stron w Confluence PB. |
| `docs/10-szablony/prd.md` | `docs/05-szablony/szablon-prd.md` | **Podmienić:** polski szablon Dokumentu Wymagań Produktu (PRD). |
| `docs/10-szablony/sad.md` | `docs/05-szablony/szablon-sad.md` | **Podmienić:** polski szablon Dokumentu Architektury Oprogramowania (SAD). |
| *(brak)* | `docs/05-szablony/szablon-tdd.md` | **Dodać nowy szablon:** szablon Projektu Technicznego Funkcjonalności (TDD wg AltexSoft / wzorzec dla `openspec/changes/<id>/design.md`). |
| `docs/10-szablony/persona-scenariusz.md` | `docs/05-szablony/szablon-ux-persona-scenariusz.md` | **Podmienić:** szablon persony, scenariusza użytkownika i mapy historyjek (EU1). |
| `docs/10-szablony/test-uzytecznosci.md` | `docs/05-szablony/szablon-ux-test-uzytecznosci.md` | **Podmienić:** szablon raportu z testów użyteczności z Radą Graczy (EU1/EU2). |
| `docs/10-szablony/strona-modulu.md` | `docs/05-szablony/szablon-karta-modulu.md` | **Podmienić:** szablon karty modułu inżynierskiego (indywidualne zaliczenie efektu **EU5**). |
| `docs/10-szablony/plan-testow.md` | `docs/05-szablony/szablon-qa-plan-testow.md` | **Podmienić:** szablon planu testów sprintu i specyfikacji przypadków testowych (**EU6**). |
| `docs/10-szablony/raport-testow.md` | `docs/05-szablony/szablon-qa-raport-i-checklista.md` | **Podmienić:** szablon raportu z wykonania testów i listy kontrolnej wydania (**EU6**). |
| `docs/10-szablony/podrecznik-gracza.md` | `docs/05-szablony/szablon-podrecznik-gracza.md` | **Podmienić:** szablon podręcznika użytkownika końcowego. |
| `docs/10-szablony/instrukcja-wdrozenia.md` | `docs/05-szablony/szablon-instrukcja-wdrozenia-admin.md` | **Podmienić:** szablon instrukcji wdrożenia i utrzymania dla administratora systemu. |
| `docs/10-szablony/informacja-o-wydaniu.md` | `docs/05-szablony/szablon-informacja-o-wydaniu.md` | **Podmienić:** szablon informacji o wydaniu `sprint-N` i listy kontrolnej wydania (**EU3**). |

---

## 3. Co dokładnie podmienić w systemie agentów AI (`.agents/`) i skryptach (`tools/`)

### 3.1 Reguły strażnicze w `.agents/rules/` (6 starych → 8 ujednoliconych)

| Stary plik na `develop` | Nowy plik w `.agents/rules/` | Zmiana |
|---|---|---|
| `00-konstytucja.md` | `00-konstytucja.md` | Przepisana w czystym języku polskim (10 artykułów). |
| `10-prawda-i-niepewnosc.md` | `10-prawda-i-niepewnosc.md` | Usunięto sztuczny szum `[V]`/`[Z]`; zdefiniowano przejrzystą hierarchię źródeł prawdy i obsługę rozbieżności `D-nn`. |
| `20-plan-i-zakres.md` | `20-plan-i-zakres.md` | Jasne kryteria, kiedy wymagana jest propozycja zmiany w OpenSpec oraz lista operacji wymagających zgody człowieka. |
| `30-granice-architektury.md` | `30-architektura-i-kontrakty.md` | Połączono granice 5 modułów z ochroną 5 zamrożonych kontraktów komunikacyjnych. |
| `40-jakosc-kodu.md` | `40-kod-i-testy.md` | Standardy kodu C#/TS, zasada *głośnego zgłaszania błędów* (`R-60`) i wzorzec testów `Rnn_`. |
| `50-git-i-jira.md` | `50-git-i-jira.md` | Zaktualizowano ścieżkę do `docs/03-dokumentacja-procesowa/02-backlog/backlog.toml`. |
| *(brak)* | `60-kontekst-i-tokeny.md` | **Nowa reguła:** higiena okna kontekstowego modelu AI (zakaz wczytywania w całości `engine.js` i `cards.json`). |
| *(brak)* | `70-dokumentacja.md` | **Nowa reguła:** zasady utrzymania drzewa `docs/` w układzie 1:1 z Confluence PB. |

### 3.2 Role agentów w `.agents/agents/` (Reorganizacja do 10 ról w 4 grupach z jawnymi `skills:`)

| Stary plik na `develop` | Nowy plik w `.agents/agents/` | Grupa tematyczna i zakres zmiany |
|---|---|---|
| `rj-orchestrator.md` | `rj-orchestrator.md` | **Grupa A (Orkiestracja i SDD):** przypisano wbudowane umiejętności `rj-start-feature`, `rj-spec-guardian`, `rj-pr-ready`, `rj-add-agent`, `rj-add-skill`. |
| `rj-rules-expert.md` + `rj-researcher.md` | `rj-spec-analyst.md` | **Grupa A (Orkiestracja i SDD):** analityk wymagań PRD, reguł `R-nn` i specyfikacji OpenSpec (`rj-spec-guardian`, `rj-start-feature`, `rj-oracle-diff`). |
| `rj-architect.md` | `rj-architect.md` | **Grupa A (Orkiestracja i SDD):** architekt systemu SAD, granic warstw, kontraktów i decyzji ADR (`rj-write-adr`, `rj-spec-guardian`, `rj-pr-ready`). |
| *(wcześniej połączone z backendem)* | `rj-rules-engineer.md` | **Grupa B (Inżynieria Domeny):** dedykowany inżynier czystego silnika `Rejoltance.Kernel` i testów `Rnn_` (`rj-add-rule-test`, `rj-oracle-diff`, `rj-pr-ready`). |
| *(wcześniej brak osobnej roli)* | `rj-card-author.md` | **Grupa B (Inżynieria Domeny):** dedykowany twórca kart i interpretera efektów DSL w `Rejoltance.Content` (`rj-add-card`, `rj-add-rule-test`, `rj-oracle-diff`). |
| `rj-backend-engineer.md` | `rj-backend-engineer.md` | **Grupa C (Inżynieria Aplikacji):** skupiony na `Rejoltance.Server`, SignalR, autoryzacji, projekcji widoku gracza (`R-66`) i bazie EF Core. |
| `rj-frontend-engineer.md` | `rj-frontend-engineer.md` | **Grupa C (Inżynieria Aplikacji):** inżynier klienta `src/web` (React 19 + TypeScript 5 + Vite). |
| `rj-test-verifier.md` + `rj-reviewer.md` + `rj-security-reviewer.md` | `rj-qa-verifier.md` | **Grupa D (Jakość i Dokumentacja):** jeden spójny, niezależny audytor jakości QA, testów, wyroczni JS i bezpieczeństwa (wyłącznie do odczytu, bez prawa edycji kodu). |
| `rj-scrum-assistant.md` | `rj-scrum-jira.md` | **Grupa D (Jakość i Dokumentacja):** asystent Scruma, pliku `backlog.toml`, eksportu CSV do Jiry i ceremonii sprintu. |
| `rj-docs-writer.md` | `rj-docs-writer.md` | **Grupa D (Jakość i Dokumentacja):** redaktor dokumentacji technicznej wg AltexSoft i synchronizacji 1:1 z Confluence PB (`rj-sync-confluence`, `rj-write-adr`, `rj-spec-guardian`). |

### 3.3 Umiejętności w `.agents/skills/` oraz skrypty w `tools/`

- **Zaktualizowano wszystkie 10 istniejących umiejętności `rj-*/SKILL.md`** (polskie opisy `description:`, polskie tytuły i nowe ścieżki do `docs/`).
- **Dodano 3 nowe umiejętności SDD/Confluence:**
  - `.agents/skills/rj-spec-guardian/SKILL.md` — audyt dwukierunkowej spójności `openspec/specs/` ↔ `03-indeks-regul-r-nn.md` ↔ `04-rozbieznosci-prototypu.md` ↔ `backlog.toml`.
  - `.agents/skills/rj-oracle-diff/SKILL.md` — porównywanie rozstrzygania reguł w `Rejoltance.Kernel` z wyrocznią `prototype/revibance/engine.js`.
  - `.agents/skills/rj-sync-confluence/SKILL.md` — walidacja drzewa dokumentacji `docs/` i eksport paczki 1:1 do Confluence PB.
- **Zaktualizowano i rozbudowano skrypty w `tools/`:**
  - `tools/agents/sync_agents.py` — dodano walidację pola `skills:` w każdym agencie (sprawdza, czy każda przypisana umiejętność istnieje w `.agents/skills/`) oraz obsługę grup narzędziowych.
  - `tools/backlog/gen_jira_csv.py` — przepięto ścieżki na `docs/03-dokumentacja-procesowa/02-backlog/` oraz `docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md`.
  - `tools/confluence/sync_confluence.py` *(nowy skrypt)* — sprawdza obecność wszystkich 6 sekcji 1:1 z Confluence, wymaganych dokumentów rdzeniowych AltexSoft oraz poprawność wszystkich wewnętrznych linków Markdown (`--check` w CI), a w trybie `--export` generuje gotową paczkę publikacyjną w `.artifacts/confluence-export/`.

---

## 4. Instrukcja wdrożenia zmian krok po kroku (Dla zespołu)

### Krok 1: Wdrożenie zmian w repozytorium Git (Gałąź `develop`)

Wszystkie opisane powyżej zmiany zostały już przygotowane, przetestowane i zweryfikowane w bieżącym drzewie roboczym repozytorium. Aby zatwierdzić je na gałęzi `develop` (lub otworzyć Pull Request):

```bash
# 1. Uruchom pełny zestaw strażników jakości przed commitem
python3 tools/agents/sync_agents.py --check
python3 tools/backlog/gen_jira_csv.py --check
python3 tools/content/extract_cards.py --check
python3 tools/confluence/sync_confluence.py --check
npm run check

# 2. Utwórz gałąź zadaniową (lub zatwierdź bezpośrednio na gałęzi roboczej)
git checkout -b docs/REJ-001-architektura-dokumentacji-sdd-i-agentow
git add -A
git commit -m "docs(REJ-001): przebudowa dokumentacji 1:1 pod Confluence (AltexSoft + SDD) i systemu agentow AI"
git push -u origin docs/REJ-001-architektura-dokumentacji-sdd-i-agentow
```

### Krok 2: Aktualizacja środowisk lokalnych u 6 członków zespołu

Po scaleniu Pull Requesta do gałęzi `develop` każdy członek zespołu wykonuje na swoim komputerze:

```powershell
git checkout develop
git pull --ff-only
npm ci
python tools/agents/sync_agents.py --check
```

Dzięki temu wszystkie lokalne narzędzia IDE (Claude Code, GitHub Copilot w VS Code / Riderze, Cursor, Antigravity, Gemini CLI) automatycznie wczytają nowe reguły z `.agents/rules/`, 10 ról z `.agents/agents/` oraz 13 umiejętności z `.agents/skills/`.

### Krok 3: Przeniesienie dokumentacji 1:1 do przestrzeni Confluence PB

1. Wygeneruj paczkę eksportową ze znacznikami wersji i manifestem stron:

   ```bash
   python3 tools/confluence/sync_confluence.py --export
   ```

2. W przestrzeni projektowej **Confluence PB** utwórz na najwyższym poziomie **6 stron nadrzędnych** odpowiadających katalogom w `docs/`:
   - `00. Przewodnik i Setup Środowiska`
   - `01. Dokumentacja Systemowa (PRD i SAD)`
   - `02. Dokumentacja Użytkownika i Wdrożenia`
   - `03. Dokumentacja Procesowa i Zarządcza`
   - `04. System Agentów AI i SDD`
   - `05. Biblioteka Szablonów Dokumentacji`
3. Pod każdą z 6 stron nadrzędnych utwórz strony potomne zgodnie z plikiem `.artifacts/confluence-export/manifest.json`, wklejając zawartość odpowiednich plików z `.artifacts/confluence-export/` (edytor Confluence automatycznie sformatuje nagłówki, tabele i bloki kodu `mermaid`).

### Krok 4: Import zaktualizowanego Product Backlogu do Jiry PB

1. Zaloguj się do uczelnianej instancji **Jira PB** i postępuj zgodnie z instrukcją [`docs/03-dokumentacja-procesowa/02-backlog/instrukcja-importu-jira.md`](../03-dokumentacja-procesowa/02-backlog/instrukcja-importu-jira.md):
   - **Etap 1:** Zaimportuj plik `docs/03-dokumentacja-procesowa/02-backlog/jira-01-epics.csv` (7 epików `E0–E6`).
   - **Etap 2:** Zaimportuj plik `docs/03-dokumentacja-procesowa/02-backlog/jira-02-issues.csv` (56 historyjek i 58 podzadań ≤ 4 h).
2. Przypisz właścicieli epików `E1–E6` ustalonych na spotkaniu startowym.
