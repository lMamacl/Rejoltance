# 0.7 Plan wdrożenia i migracji: Co zmienić i co podmienić względem dotychczasowego podejścia

> **Źródło prawdy:** repozytorium (`docs/00-przewodnik-i-setup/07-plan-wdrozenia-i-migracji.md`) · **Kategoria dokumentacji:** dokumentacja procesowa — plan zmian i wdrożenia · **Etap SDD:** Fundamenty i organizacja projektu

Ten dokument opisuje, jak przenosimy **RE:JOLTANCE** ze starego układu na gałęzi `develop` do nowego standardu. Nowy standard ma trzy filary:

- klasyfikację dokumentacji technicznej **AltexSoft**,
- proces **Spec-Driven Development (SDD)**, czyli „najpierw specyfikacja, potem kod”,
- układ **1:1 z przestrzenią Confluence PB** (Politechniki Białostockiej).

Skróty: PRD (Product Requirements Document) to wymagania produktu. SAD (Software Architecture Document) to architektura systemu. ADR (Architecture Decision Record) to zapis decyzji architektonicznej. TDD (Technical Design Document) to projekt techniczny zmiany. DIP to Dokument Inicjujący Projekt. DoR i DoD to definicje gotowości i ukończenia zadania (Definition of Ready / Definition of Done).

---

## 1. Co zmieniamy i dlaczego?

| Obszar | Było (gałąź `develop`) | Jest (po zmianie) | Co zyskujemy |
|---|---|---|---|
| **Struktura `docs/`** | **11 rozproszonych katalogów** (`00-start`, `01-dip`, `02-rules`, `03-architecture`, `04-adr`, `05-backlog`, `06-scrum`, `07-meetings`, `08-research`, `09-jakosc`, `10-szablony` + `99-sources`). Pliki systemowe mieszały się z procesowymi i instrukcjami startowymi. | **6 sekcji głównych 1:1 z Confluence PB** (`00-przewodnik-i-setup`, `01-dokumentacja-systemowa`, `02-dokumentacja-uzytkownika`, `03-dokumentacja-procesowa`, `04-system-agentow-ai`, `05-szablony` + `99-archiwum-zrodel`). | Strony przenosimy **1:1 z repozytorium do Confluence**. Nie trzeba zgadywać, gdzie umieścić dokument. |
| **PRD, SAD i stos** | `PRD` był tylko pustym szablonem (`10-szablony/prd.md`). `SAD.md`, `STOS.md`, `API.md`, `UX.md` i `STRATEGIA-TESTOW.md` były krótkimi szkicami w punktach. | **Pełne dokumenty główne** w `01-dokumentacja-systemowa/`: **PRD** (`01-prd-wymagania-produktu.md`), **SAD** z diagramami C4 i ERD (`05-sad-architektura-systemu.md`), **stos i roadmapa IT** (`06-stos-technologiczny.md`). Pozostałe typy dokumentacji mają też szablony w `05-szablony/`. | Spełniamy wymagania zadania: nacisk na SAD i wymagania produktu oraz szablony pozostałych typów z AltexSoft. |
| **Dokumentacja użytkownika i wdrożenia** | Brak dokumentacji dla gracza i administratora. Były tylko puste szablony w `10-szablony/`. | Nowa sekcja **`02-dokumentacja-uzytkownika/`**: **Podręcznik gracza** (`01-podrecznik-gracza.md`) i **Instrukcja wdrożenia i utrzymania systemu** (`02-instrukcja-wdrozenia-i-utrzymania.md`). | Pokrywamy gałąź *Dokumentacja użytkownika* z AltexSoft i wymogi **EU5/EU6**. |
| **System agentów AI (`.agents/`)** | **11 niepogrupowanych ról** o nakładających się kompetencjach (`rj-reviewer`, `rj-security-reviewer`, `rj-test-verifier`, `rj-researcher`). Nagłówki YAML nie wskazywały umiejętności (*skilli*) agentów. Instrukcje `jak-dodac-agenta.md` / `jak-dodac-skill.md` były krótkie i rozrzucone. | **10 ról w 4 grupach** (A: Orkiestracja i SDD, B: Domena, C: Aplikacja, D: Jakość i Dokumentacja). Każdy agent ma listę `skills:`, którą automatycznie sprawdza `sync_agents.py`. Podręcznik dla ludzi jest w **`docs/04-system-agentow-ai/`**. | Każdy w zespole wie, jak skonfigurować środowisko i który agent za co odpowiada. Wie też, jak samemu budować agentów, skille i specyfikacje. |
| **Język i styl** | Styl telegraficzny, równoważniki zdań, sztuczne znaczniki `[V]`/`[Z]`, mieszanie angielskich i polskich nagłówków. | **Naturalny język polski** w tytułach, nagłówkach, tabelach, opisach reguł i definicjach agentów i skilli. W kodzie zostają **standardowe angielskie nazwy** (`Rejoltance.Kernel`, `MatchView`, `Intent`, `SeededRng`). | Tekst łatwo czytają zespół i prowadzący. Kod C# i TypeScript zachowuje precyzję. |

---

## 2. Mapa migracji plików w `docs/`

### 2.1 Sekcja `00-przewodnik-i-setup/` (zastępuje `docs/00-start/`)

| Stary plik na `develop` | Nowy plik | Co zrobiliśmy |
|---|---|---|
| `docs/00-start/README.md` | `docs/00-przewodnik-i-setup/README.md` | **Podmiana:** nowy spis treści sekcji. |
| `docs/00-start/jak-zaczac.md` | `docs/00-przewodnik-i-setup/01-szybki-start-i-instalacja.md` | **Podmiana:** konfiguracja środowiska, uruchomienie Aspire, rozwiązywanie problemów na Windows/macOS/Linux. |
| `docs/00-start/mapa-dokumentacji.md` | `docs/00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md` | **Podmiana:** architektura dokumentacji SDD, porównanie wariantów AltexSoft 1:1 i SDD 1:1, drzewo Confluence. |
| `docs/00-start/jak-pracujemy.md` | `docs/00-przewodnik-i-setup/03-proces-pracy-i-git-scrum.md` | **Podmiana:** cykl pracy od zadania w Jirze przez OpenSpec do Pull Requesta, mirror Bitbucket, kryteria DoR/DoD. |
| `docs/00-start/sciaga.md` | `docs/00-przewodnik-i-setup/04-sciaga-komend.md` | **Podmiana:** uporządkowana ściąga komend `.NET`, `npm`, `openspec`, `python` i `git`. |
| `docs/00-start/slownik.md` | `docs/00-przewodnik-i-setup/05-slownik-pojec.md` | **Podmiana:** rozszerzony słownik pojęć gry, architektury i SDD. |
| `docs/00-start/pytania-otwarte.md` + `zalozenia-i-niepewnosci.md` | `docs/00-przewodnik-i-setup/06-decyzje-otwarte-i-zalozenia.md` | **Połączenie i podmiana:** dwa częściowo powtarzające się pliki tworzą teraz jeden rejestr pytań otwartych (`#1–#10`) i założeń. |
| *(brak odpowiednika)* | `docs/00-przewodnik-i-setup/07-plan-wdrozenia-i-migracji.md` | **Nowy plik:** ten plan wdrożenia i podmiany plików. |

---

### 2.2 Sekcja `01-dokumentacja-systemowa/` (zastępuje `02-rules/`, `03-architecture/`, `04-adr/`, `09-jakosc/`)

| Stary plik na `develop` | Nowy plik | Co zrobiliśmy |
|---|---|---|
| `docs/02-rules/README.md` + `03-architecture/README.md` + `09-jakosc/README.md` | `docs/01-dokumentacja-systemowa/README.md` | **Połączenie i podmiana:** jeden wspólny indeks dokumentacji systemowej. |
| *(brak — był tylko pusty szablon `10-szablony/prd.md`)* | `docs/01-dokumentacja-systemowa/01-prd-wymagania-produktu.md` | **Nowy dokument główny:** **Dokument Wymagań Produktu (PRD)** napisany od podstaw dla RE:JOLTANCE. |
| `docs/02-rules/SPECYFIKACJA.md` | `docs/01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md` | **Przeniesienie (`git mv`) i aktualizacja:** polski nagłówek metadanych, poprawione odnośniki. |
| `docs/02-rules/RULES-INDEX.md` | `docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md` | **Przeniesienie (`git mv`) i aktualizacja:** macierz śledzenia 55 reguł `R-nn` powiązana z `gen_jira_csv.py`. |
| `docs/02-rules/ROZBIEZNOSCI.md` | `docs/01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md` | **Przeniesienie (`git mv`) i aktualizacja:** rejestr 20 rozbieżności prototypu JS (`D-01..D-20`). |
| `docs/03-architecture/SAD.md` | `docs/01-dokumentacja-systemowa/05-sad-architektura-systemu.md` | **Podmiana (napisany od nowa):** **SAD** z diagramami C4 poziomu 1–3, diagramami sekwencji, modelem danych ERD i koncepcjami przekrojowymi. |
| `docs/03-architecture/STOS.md` | `docs/01-dokumentacja-systemowa/06-stos-technologiczny.md` | **Podmiana (rozbudowany):** stos technologiczny, tabela odrzuconych alternatyw, roadmapa technologiczna (Sprinty 0–5 i Semestr 2). |
| `docs/04-adr/*` (`README.md`, `0000`..`0011`) | `docs/01-dokumentacja-systemowa/07-decyzje-adr/*` | **Przeniesienie (`git mv`) i aktualizacja:** polskie tytuły, nowy rejestr ADR, rozbudowany `0011-dokumentacja-hybryda-repo-confluence.md`. |
| `docs/03-architecture/MAP.md` | `docs/01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md` | **Podmiana:** mapa 5 modułów, granice warstw, przewodnik „gdzie dodać kod”. |
| `docs/03-architecture/API.md` | `docs/01-dokumentacja-systemowa/09-kontrakty-i-api.md` | **Podmiana:** specyfikacja 5 zamrożonych kontraktów JSON, endpointów REST i metod SignalR. |
| `docs/03-architecture/UX.md` | `docs/01-dokumentacja-systemowa/10-ux-design-i-przeplywy.md` | **Podmiana:** mapa ekranów, makieta stołu 2×2, przepływ użytkownika 1v1, przewodnik stylu i kontrast WCAG 2.1 AA. |
| `docs/09-jakosc/STRATEGIA-TESTOW.md` | `docs/01-dokumentacja-systemowa/11-strategia-testow-qa.md` | **Podmiana:** strategia jakości i testów automatycznych (piramida testów, wyrocznia JS, bramki CI, pokrycie NFR — wymagań niefunkcjonalnych). |

---

### 2.3 Sekcja `02-dokumentacja-uzytkownika/` (nowa — brak odpowiednika na `develop`)

| Stary plik na `develop` | Nowy plik | Co zrobiliśmy |
|---|---|---|
| *(brak)* | `docs/02-dokumentacja-uzytkownika/README.md` | **Nowy plik:** indeks dokumentacji użytkownika i administratora. |
| *(brak — był tylko pusty szablon)* | `docs/02-dokumentacja-uzytkownika/01-podrecznik-gracza.md` | **Nowy dokument:** podręcznik gracza (szybki start w 60 s, zasady rundy i walki, słowa kluczowe, sterowanie, FAQ, rozwiązywanie problemów). |
| *(brak — był tylko pusty szablon)* | `docs/02-dokumentacja-uzytkownika/02-instrukcja-wdrozenia-i-utrzymania.md` | **Nowy dokument:** instrukcja dla administratora (wdrożenie, zmienne konfiguracyjne, monitorowanie `/health`, kopie zapasowe SQLite/PostgreSQL, odtwarzanie po awarii). |

---

### 2.4 Sekcja `03-dokumentacja-procesowa/` (zastępuje `01-dip/`, `05-backlog/`, `06-scrum/`, `07-meetings/`, `08-research/`)

| Stary plik na `develop` | Nowy plik | Co zrobiliśmy |
|---|---|---|
| `docs/01-dip/README.md` | `docs/03-dokumentacja-procesowa/README.md` | **Podmiana:** wspólny indeks dokumentacji procesowej. |
| `docs/01-dip/DIP.md` | `docs/03-dokumentacja-procesowa/01-dip-dokument-inicjujacy.md` | **Przeniesienie (`git mv`) i poprawa linków:** Dokument Inicjujący Projekt (wymóg zaliczenia Semestru 1). |
| `docs/05-backlog/*` (`backlog.toml`, `BACKLOG.md`, `jira-*.csv`, `test-import/`) | `docs/03-dokumentacja-procesowa/02-backlog/*` | **Przeniesienie (`git mv`) i aktualizacja:** wszystkie pliki backlogu i eksportu CSV w jednym podkatalogu. |
| `docs/00-start/jira-import.md` | `docs/03-dokumentacja-procesowa/02-backlog/instrukcja-importu-jira.md` | **Przeniesienie i przepisanie:** instrukcja dwuetapowego importu CSV do Jiry PB leży teraz obok plików CSV. |
| `docs/06-scrum/*` + `docs/07-meetings/*` | `docs/03-dokumentacja-procesowa/03-scrum-i-spotkania/*` | **Połączenie i uporządkowanie:** agenda spotkania startowego i szablony raportów *Daily Scrum* oraz *Sprint Review & Retro* w jednym miejscu. |
| `docs/08-research/*` | `docs/03-dokumentacja-procesowa/04-badania-i-analizy/*` | **Przeniesienie (`git mv`) i aktualizacja:** raport z analizy zastanego kodu (Faza 0) i porównanie narzędzi SDD (Faza 1). |

---

### 2.5 Sekcja `04-system-agentow-ai/` (zastępuje rozproszone pliki w `00-start/`)

| Stary plik na `develop` | Nowy plik | Co zrobiliśmy |
|---|---|---|
| *(brak)* | `docs/04-system-agentow-ai/README.md` | **Nowy plik:** punkt wejścia do podręcznika pracy z agentami i SDD dla ludzi. |
| `docs/00-start/jira-confluence-mcp.md` + `.agents/README.md` | `docs/04-system-agentow-ai/01-architektura-i-konfiguracja-agentow.md` | **Połączenie i rozbudowa:** architektura `.agents/`, generowanie adapterów dla 5 środowisk IDE, reguły strażnicze, konfiguracja serwera MCP (Model Context Protocol). |
| *(brak — wcześniej tylko krótka lista w `.agents/README.md`)* | `docs/04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md` | **Nowy dokument:** opis 10 ról w 4 grupach, katalog wszystkich skilli (`rj-*` i `openspec-*`), macierz przypisania skilli do agentów. |
| `docs/00-start/jak-pisac-spec.md` | `docs/04-system-agentow-ai/03-jak-pisac-specyfikacje-openspec.md` | **Podmiana (rozbudowany):** cykl życia zmiany w OpenSpec (`/opsx:propose → apply → archive`) i pisanie scenariuszy `GIVEN / WHEN / THEN`. |
| `docs/00-start/jak-dodac-agenta.md` + `jak-dodac-skill.md` + `jak-dodac-adr.md` + `jak-dodac-karte.md` | `docs/04-system-agentow-ai/04-warsztat-tworzenie-agentow-skilli-i-kart.md` | **Połączenie w jeden podręcznik:** 5 praktycznych warsztatów krok po kroku. |

---

### 2.6 Sekcja `05-szablony/` (zastępuje `docs/10-szablony/`)

| Stary plik na `develop` | Nowy plik | Co zrobiliśmy |
|---|---|---|
| `docs/10-szablony/README.md` | `docs/05-szablony/README.md` | **Podmiana:** katalog 12 szablonów przypisanych do klasyfikacji AltexSoft i etapów SDD. |
| `docs/10-szablony/naglowek-strony.md` | `docs/05-szablony/naglowek-strony-confluence.md` | **Podmiana:** jeden wzorzec polskiego nagłówka metadanych dla stron w Confluence PB. |
| `docs/10-szablony/prd.md` | `docs/05-szablony/szablon-prd.md` | **Podmiana:** polski szablon PRD. |
| `docs/10-szablony/sad.md` | `docs/05-szablony/szablon-sad.md` | **Podmiana:** polski szablon SAD. |
| *(brak)* | `docs/05-szablony/szablon-tdd.md` | **Nowy szablon:** projekt techniczny funkcjonalności (TDD według AltexSoft, wzorzec dla `openspec/changes/<id>/design.md`). |
| `docs/10-szablony/persona-scenariusz.md` | `docs/05-szablony/szablon-ux-persona-scenariusz.md` | **Podmiana:** szablon persony, scenariusza użytkownika i mapy historyjek (EU1). |
| `docs/10-szablony/test-uzytecznosci.md` | `docs/05-szablony/szablon-ux-test-uzytecznosci.md` | **Podmiana:** szablon raportu z testów użyteczności z Radą Graczy (EU1/EU2). |
| `docs/10-szablony/strona-modulu.md` | `docs/05-szablony/szablon-karta-modulu.md` | **Podmiana:** szablon karty modułu (indywidualne zaliczenie efektu **EU5**). |
| `docs/10-szablony/plan-testow.md` | `docs/05-szablony/szablon-qa-plan-testow.md` | **Podmiana:** szablon planu testów sprintu i przypadków testowych (**EU6**). |
| `docs/10-szablony/raport-testow.md` | `docs/05-szablony/szablon-qa-raport-i-checklista.md` | **Podmiana:** szablon raportu z testów i listy kontrolnej wydania (**EU6**). |
| `docs/10-szablony/podrecznik-gracza.md` | `docs/05-szablony/szablon-podrecznik-gracza.md` | **Podmiana:** szablon podręcznika użytkownika końcowego. |
| `docs/10-szablony/instrukcja-wdrozenia.md` | `docs/05-szablony/szablon-instrukcja-wdrozenia-admin.md` | **Podmiana:** szablon instrukcji wdrożenia i utrzymania dla administratora. |
| `docs/10-szablony/informacja-o-wydaniu.md` | `docs/05-szablony/szablon-informacja-o-wydaniu.md` | **Podmiana:** szablon informacji o wydaniu `sprint-N` i listy kontrolnej wydania (**EU3**). |

---

## 3. Zmiany w systemie agentów AI (`.agents/`) i skryptach (`tools/`)

### 3.1 Reguły strażnicze w `.agents/rules/` (6 starych → 8 nowych)

| Stary plik na `develop` | Nowy plik w `.agents/rules/` | Zmiana |
|---|---|---|
| `00-konstytucja.md` | `00-konstytucja.md` | Przepisana prostym językiem polskim. Po przeglądzie ma 11 artykułów: wróciły zakazy dla agentów AI i artykuł o języku (ADR-0012, status: proponowana). |
| `10-prawda-i-niepewnosc.md` | `10-prawda-i-niepewnosc.md` | Usunięte znaczniki `[V]`/`[Z]`. Jasna kolejność źródeł prawdy i obsługa rozbieżności `D-nn`. |
| `20-plan-i-zakres.md` | `20-plan-i-zakres.md` | Jasne kryteria, kiedy potrzebna jest propozycja zmiany w OpenSpec. Lista operacji wymagających zgody człowieka. |
| `30-granice-architektury.md` | `30-architektura-i-kontrakty.md` | Połączone granice 5 modułów z ochroną 5 zamrożonych kontraktów komunikacyjnych. |
| `40-jakosc-kodu.md` | `40-kod-i-testy.md` | Standardy kodu C#/TS, zasada *głośnego zgłaszania błędów* (`R-60`), wzorzec testów `Rnn_`. |
| `50-git-i-jira.md` | `50-git-i-jira.md` | Nowa ścieżka do `docs/03-dokumentacja-procesowa/02-backlog/backlog.toml`. |
| *(brak)* | `60-kontekst-i-tokeny.md` | **Nowa reguła:** higiena okna kontekstowego modelu AI (nie wczytujemy w całości `engine.js` i `cards.json`). |
| *(brak)* | `70-dokumentacja.md` | **Nowa reguła:** zasady utrzymania drzewa `docs/` w układzie 1:1 z Confluence PB. |

### 3.2 Role agentów w `.agents/agents/` (10 ról w 4 grupach, z jawną listą `skills:`)

Kolumna „Stary plik” podaje dawne nazwy ról. Aktualne nazwy są w kolumnie „Nowy plik”.

| Stary plik na `develop` | Nowy plik w `.agents/agents/` | Grupa i zakres zmiany |
|---|---|---|
| `rj-orchestrator.md` | `rj-orchestrator.md` | **Grupa A (Orkiestracja i SDD):** skille `rj-start-feature`, `rj-spec-guardian`, `rj-pr-ready`, `rj-add-agent`, `rj-add-skill`. |
| `rj-rules-expert.md` + `rj-researcher.md` | `rj-spec-analyst.md` | **Grupa A (Orkiestracja i SDD):** analityk wymagań PRD, reguł `R-nn` i specyfikacji OpenSpec (`rj-spec-guardian`, `rj-start-feature`, `rj-oracle-diff`). |
| `rj-architect.md` | `rj-architect.md` | **Grupa A (Orkiestracja i SDD):** architekt SAD, granic warstw, kontraktów i decyzji ADR (`rj-write-adr`, `rj-spec-guardian`, `rj-pr-ready`). |
| *(wcześniej połączone z backendem)* | `rj-rules-engineer.md` | **Grupa B (Inżynieria domeny):** osobny inżynier czystego silnika `Rejoltance.Kernel` i testów `Rnn_` (`rj-add-rule-test`, `rj-oracle-diff`, `rj-pr-ready`). |
| *(wcześniej brak osobnej roli)* | `rj-card-author.md` | **Grupa B (Inżynieria domeny):** osobny twórca kart i interpretera efektów DSL w `Rejoltance.Content` (`rj-add-card`, `rj-add-rule-test`, `rj-oracle-diff`). |
| `rj-backend-engineer.md` | `rj-backend-engineer.md` | **Grupa C (Inżynieria aplikacji):** `Rejoltance.Server`, SignalR, autoryzacja, projekcja widoku gracza (`R-66`), baza EF Core. |
| `rj-frontend-engineer.md` | `rj-frontend-engineer.md` | **Grupa C (Inżynieria aplikacji):** klient `src/web` (React 19 + TypeScript 5 + Vite). |
| `rj-test-verifier.md` + `rj-reviewer.md` + `rj-security-reviewer.md` | `rj-qa-verifier.md` | **Grupa D (Jakość i dokumentacja):** jeden niezależny audytor jakości, testów, wyroczni JS i bezpieczeństwa. Tylko odczyt, bez prawa edycji kodu. |
| `rj-scrum-assistant.md` | `rj-scrum-jira.md` | **Grupa D (Jakość i dokumentacja):** asystent Scruma, pliku `backlog.toml`, eksportu CSV do Jiry i ceremonii sprintu. |
| `rj-docs-writer.md` | `rj-docs-writer.md` | **Grupa D (Jakość i dokumentacja):** redaktor dokumentacji według AltexSoft i synchronizacji 1:1 z Confluence PB (`rj-sync-confluence`, `rj-write-adr`, `rj-spec-guardian`). |

### 3.3 Skille w `.agents/skills/` i skrypty w `tools/`

- **Zaktualizowaliśmy 10 istniejących skilli `rj-*/SKILL.md`:** polskie opisy `description:`, polskie tytuły i nowe ścieżki do `docs/`.
- **Dodaliśmy 3 nowe skille SDD/Confluence:**
  - `.agents/skills/rj-spec-guardian/SKILL.md` — sprawdza spójność w obie strony: `openspec/specs/` ↔ `03-indeks-regul-r-nn.md` ↔ `04-rozbieznosci-prototypu.md` ↔ `backlog.toml`.
  - `.agents/skills/rj-oracle-diff/SKILL.md` — porównuje rozstrzyganie reguł w `Rejoltance.Kernel` z wyrocznią `prototype/revibance/engine.js`.
  - `.agents/skills/rj-sync-confluence/SKILL.md` — waliduje drzewo `docs/` i eksportuje paczkę 1:1 do Confluence PB.
- **Zaktualizowaliśmy skrypty w `tools/`:**
  - `tools/agents/sync_agents.py` — sprawdza pole `skills:` w każdym agencie (czy każdy przypisany skill istnieje w `.agents/skills/`) i obsługuje grupy narzędzi.
  - `tools/backlog/gen_jira_csv.py` — nowe ścieżki: `docs/03-dokumentacja-procesowa/02-backlog/` i `docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md`.
  - `tools/confluence/sync_confluence.py` *(nowy skrypt)* — w trybie `--check` (w CI) sprawdza obecność 6 sekcji 1:1 z Confluence, wymaganych dokumentów głównych AltexSoft i poprawność wewnętrznych linków Markdown. W trybie `--export` tworzy paczkę do publikacji w `.artifacts/confluence-export/`.

---

## 4. Wdrożenie krok po kroku (dla zespołu)

### Krok 1: Zmiany w repozytorium Git (gałąź `develop`)

Zmiany opisane wyżej są już przygotowane i sprawdzone w bieżącym drzewie roboczym. Żeby zatwierdzić je na `develop` albo otworzyć Pull Request, wykonaj:

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

### Krok 2: Aktualizacja środowisk lokalnych u 6 osób z zespołu

Gdy Pull Request trafi do `develop`, każda osoba wykonuje na swoim komputerze:

```powershell
git checkout develop
git pull --ff-only
npm ci
python tools/agents/sync_agents.py --check
```

Po tym lokalne narzędzia IDE (Claude Code, GitHub Copilot w VS Code / Riderze, Cursor, Antigravity, Gemini CLI) wczytają nowe reguły z `.agents/rules/`, 10 ról z `.agents/agents/` i 13 skilli z `.agents/skills/`.

### Krok 3: Przeniesienie dokumentacji do Confluence PB

1. Wygeneruj paczkę eksportową ze znacznikami wersji i manifestem stron:

   ```bash
   python3 tools/confluence/sync_confluence.py --export
   ```

2. W przestrzeni projektu w **Confluence PB** utwórz na najwyższym poziomie **6 stron nadrzędnych**. Odpowiadają one katalogom w `docs/`:
   - `00. Przewodnik i Setup Środowiska`
   - `01. Dokumentacja Systemowa (PRD i SAD)`
   - `02. Dokumentacja Użytkownika i Wdrożenia`
   - `03. Dokumentacja Procesowa i Zarządcza`
   - `04. System Agentów AI i SDD`
   - `05. Biblioteka Szablonów Dokumentacji`
3. Pod każdą stroną nadrzędną utwórz strony potomne według pliku `.artifacts/confluence-export/manifest.json`. Wklej do nich treść odpowiednich plików z `.artifacts/confluence-export/`. Edytor Confluence sam sformatuje nagłówki, tabele i bloki `mermaid`.

### Krok 4: Import Product Backlogu do Jiry PB

1. Zaloguj się do uczelnianej **Jiry PB**. Postępuj według instrukcji [`docs/03-dokumentacja-procesowa/02-backlog/instrukcja-importu-jira.md`](../03-dokumentacja-procesowa/02-backlog/instrukcja-importu-jira.md):
   - **Etap 1:** zaimportuj `docs/03-dokumentacja-procesowa/02-backlog/jira-01-epics.csv` (7 epików `E0–E6`).
   - **Etap 2:** zaimportuj `docs/03-dokumentacja-procesowa/02-backlog/jira-02-issues.csv` (56 historyjek i 58 podzadań ≤ 4 h).
2. Przypisz właścicieli epików `E1–E6` ustalonych na spotkaniu startowym.
