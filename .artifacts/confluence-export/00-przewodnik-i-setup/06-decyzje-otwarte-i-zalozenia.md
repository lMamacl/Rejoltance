<!-- CONFLUENCE 1:1 EXPORT | Source: docs/00-przewodnik-i-setup/06-decyzje-otwarte-i-zalozenia.md @ 7e9a336 (2026-11-02) -->
# 0.6 Decyzje otwarte do zespołu oraz założenia projektowe

> **Źródło prawdy:** repozytorium (`docs/00-przewodnik-i-setup/06-decyzje-otwarte-i-zalozenia.md`) · **Kategoria dokumentacji:** Założenia produktowe i procesowe oraz pytania otwarte · **Etap SDD:** Specyfikacja i planowanie

Dokument gromadzi w jednym miejscu wszystkie otwarte pytania wymagające decyzji zespołu lub prowadzącego zajęcia (`#1–#10`) oraz rejestr przyjętych założeń projektowych, które podlegają weryfikacji w kolejnych sprintach.

---

## 1. Pytania otwarte do rozstrzygnięcia (`#1–#10`)

Po podjęciu decyzji na spotkaniu zespołu należy wpisać ustalenie w kolumnie „Podjęta decyzja” oraz zaktualizować wskazane pliki powiązane.

| ID | Obszar | Pytanie wymagające rozstrzygnięcia | Osoba decyzyjna | Pliki do aktualizacji po decyzji | Podjęta decyzja |
|---|---|---|---|---|---|
| **#1** | Proces / Jira | Jaki będzie ostateczny klucz projektu w uczelnianej Jirze (obecnie przyjęto placeholder `REJ`) i kiedy projekt zostanie założony? | Prowadzący zajęcia | `backlog.toml` (`project_key`), `.github/workflows/pr-conventions.yml`, `.agents/rules/50-git-i-jira.md`, `01-dip-dokument-inicjujacy.md` | *Do potwierdzenia na zajęciach* |
| **#2** | Proces / Scrum | Jaki jest harmonogram rotacji roli Product Ownera w poszczególnych sprintach i czy Sprint 0 wlicza się do puli ocenianych sprintów PO? | Zespół + Prowadzący | `01-dip-dokument-inicjujacy.md` §6.1, `01-prd-wymagania-produktu.md` §2 | *Do ustalenia na spotkaniu startowym* |
| **#3** | Proces / Jira | Jak dokładnie mapujemy uczelniany przepływ pracy (`Open → In Progress → Resolved → Closed`) na kolumny tablicy Scrumowej? | Product Owner S1 | `03-proces-pracy-i-git-scrum.md`, `01-dip-dokument-inicjujacy.md` §8 | *Do ustalenia przy konfiguracji tablicy* |
| **#4** | Proces / Git | Czy prowadzący akceptuje prowadzenie Code Review na GitHubie (z linkami w zadaniach Jira i automatycznym mirrorem kodu do Bitbucket PB)? | Prowadzący zajęcia | `0002-github-i-mirror-bitbucket.md`, konfiguracja sekretów `BITBUCKET_TOKEN` | *Do potwierdzenia z prowadzącym* |
| **#5** | Produkt / MVP | Które dokładnie 12 kart wchodzi w skład zawężonej talii MVP na pierwszy kamień milowy w Semestrze 1? | Zespół + Rada Graczy | Zadanie `E2-S05`, `01-prd-wymagania-produktu.md` §4 | *Do wyboru w Sprincie 0* |
| **#6** | Produkt / Reguły | Jak rozstrzygamy 20 zidentyfikowanych rozbieżności prototypu JS (`D-01..D-20`, m.in. remis bohaterów, Flying vs jednostki naziemne, Breakthrough)? | Zespół + Autorzy gry | `04-rozbieznosci-prototypu.md`, `openspec/specs/*`, testy w `Rejoltance.Kernel.Tests` | *Zadanie `E0-S04` w Sprincie 0* |
| **#7** | Produkt / EU1 | Kto personalnie wchodzi w skład 3-osobowej Rady Graczy Testowych (reprezentantów użytkownika końcowego spoza zespołu)? | Product Owner S0 | `01-dip-dokument-inicjujacy.md` §2.1, `01-prd-wymagania-produktu.md` §3, zadanie `E0-S03` | *Do wpisania w Sprincie 0* |
| **#8** | Techniczne | Gdzie hostujemy publiczną instancję demonstracyjną na potrzeby Sprint Review (Azure for Students, Railway, serwer wydziałowy)? | Właściciel Epiku E6 | `05-sad-architektura-systemu.md` §7, zadanie `E6-S05` | *Do wyboru przed Sprintem 3* |
| **#9** | Organizacja | Który student jest właścicielem którego epiku (`E1–E6`) w ramach indywidualnego zaliczenia efektu EU1 oraz dokumentacji EU5/EU6? | Zespół (6 osób) | `01-dip-dokument-inicjujacy.md`, `01-prd-wymagania-produktu.md`, `backlog.toml`, `.github/CODEOWNERS` | *Do przydzielenia na spotkaniu startowym* |
| **#10** | Techniczne | Czy wszyscy członkowie zespołu mogą zainstalować Docker Desktop lub Podman przed rozpoczęciem Sprintu 4 (migracja na PostgreSQL)? | Zespół | `0007-sqlite-potem-postgresql.md`, zadanie `E6-S03` | *Do weryfikacji przed Sprintem 4* |

---

## 2. Rejestr założeń projektowych i technicznych

Założenia przyjęte na etapie projektowania architektury i planowania backlogu, które umożliwiają pracę bez przestojów i podlegają walidacji w toku projektu.

### A. Założenia procesowe i organizacyjne

| Kod | Przyjęte założenie | Sposób weryfikacji | Plan awaryjny (jeśli założenie okaże się błędne) |
|---|---|---|---|
| **Z-01** | Klucz projektu w Jirze PB to `REJ`. | Założenie projektu przez prowadzącego (#1). | Jednorazowa zmiana `project_key` w `backlog.toml` i regeneracja plików CSV skryptem `gen_jira_csv.py`. |
| **Z-02** | Efektywna dostępność czasowa każdego studenta wynosi średnio **5 godzin tygodniowo** (łącznie 30 h/tydz. na 6-osobowy zespół, z 10% buforem bezpieczeństwa). | Pomiar rzeczywistego czasu pracy (*Log Work*) i prędkości zespołu (*Velocity*) na koniec Sprintu 1. | Korekta linii cięcia między falami `W1` i `W2` podczas *Sprint Planningu* S2. |
| **Z-03** | Przerwa świąteczno-noworoczna w Sprincie 4 (15.12–11.01) odpowiada realnemu nakładowi pracy standardowego dwutygodniowego sprintu. | Planowanie dostępności zespołu na początku Sprintu 4. | Zmniejszenie puli zadań w Sprincie 4 o 20–30%. |
| **Z-04** | Serwery uczelniane (`devtools.wi.pb.edu.pl`) są dostępne z sieci domowych bez konieczności zestawiania tunelu VPN. | Pierwsze logowanie członków zespołu do Jiry i Confluence PB. | Dopisanie instrukcji konfiguracji uczelnianego VPN do dokumentu `01-szybki-start-i-instalacja.md`. |

### B. Założenia narzędziowe i techniczne

| Kod | Przyjęte założenie | Sposób weryfikacji | Plan awaryjny (jeśli założenie okaże się błędne) |
|---|---|---|---|
| **Z-10** | Pole `Original Estimate` podczas importu CSV do Jiry Server/DC przyjmuje wartości wyrażone w sekundach (np. `14400` = 4h). | Próbny import plików z katalogu `02-backlog/test-import/`. | Zmiana parametru `estimate_format = "jira"` w `backlog.toml` i ponowne wygenerowanie plików CSV. |
| **Z-11** | W uczelnianych instancjach Jira i Confluence PB włączona jest możliwość generowania *Personal Access Tokens (PAT)* do integracji MCP oraz skryptu `sync_confluence.py`. | Konfiguracja przez pierwszą osobę według instrukcji w `01-architektura-i-konfiguracja-agentow.md`. | Korzystanie z eksportu lokalnego (`.artifacts/confluence-export/`) i wklejanie stron Markdown w edytorze Confluence. |
| **Z-12** | Zabezpieczenie *Smart App Control* w Windows 11 blokuje lokalne biblioteki DLL tylko na części komputerów studenckich. | Uruchomienie skryptu `tools/doctor.ps1` przez wszystkich członków zespołu (zadanie `E0-S01`). | Uruchamianie serwera i klienta w dwóch osobnych terminalach (Wariant B w instrukcji startowej) oraz oparcie weryfikacji integracyjnej o GitHub Actions CI. |

### C. Założenia produktowe i domenowe

| Kod | Przyjęte założenie | Sposób weryfikacji | Plan awaryjny (jeśli założenie okaże się błędne) |
|---|---|---|---|
| **Z-20** | Kanonicznym źródłem reguł gry jest prototyp JavaScript `prototype/revibance` (wersja v11 z dnia 27.10.2026), z wyłączeniem udokumentowanych błędów implementacyjnych (`D-01..D-20`). | Warsztat weryfikacyjny z autorami gry w Sprincie 0 (`E0-S04`). | Aktualizacja specyfikacji w `openspec/specs/` oraz indeksu `03-indeks-regul-r-nn.md`. |
| **Z-21** | Wszystkie zasoby graficzne (`img/*.webp`), dźwiękowe (`sfx/*.wav`, `audio/music.mp3`) oraz czcionki z prototypu mogą być legalnie przechowywane w repozytorium projektu. | Potwierdzone przez autorów prototypu w zespole (27.10.2026). | — |

---

## 3. Decyzje zamknięte i zweryfikowane

| Obszar | Rozstrzygnięcie | Data i źródło decyzji |
|---|---|---|
| Stos technologiczny | Backend C# .NET 10 (ASP.NET Core + SignalR), frontend React 19 + TypeScript + Vite, orkiestracja .NET Aspire 13. | 2026-10-27 · [ADR-0001](../01-dokumentacja-systemowa/07-decyzje-adr/0001-stos-technologiczny.md) |
| Architektura silnika | Silnik reguł (`Rejoltance.Kernel`) pisany od nowa jako czysty, deterministyczny reduktor stanu; prototyp JS stanowi kanon reguł. | 2026-10-27 · [ADR-0004](../01-dokumentacja-systemowa/07-decyzje-adr/0004-kernel-od-nowa-deterministyczny.md), [ADR-0005](../01-dokumentacja-systemowa/07-decyzje-adr/0005-kanon-regul-prototyp-js.md) |
| Framework SDD | Wybrano narzędzie **OpenSpec** wraz z konstytucją projektu w `.agents/rules/00-konstytucja.md`. | 2026-10-27 · [ADR-0003](../01-dokumentacja-systemowa/07-decyzje-adr/0003-openspec-i-konstytucja.md) |
| Architektura dokumentacji | Układ 1:1 między repozytorium `docs/` a przestrzenią Confluence PB oparty na klasyfikacji AltexSoft i procesie SDD. | 2026-11-02 · [ADR-0011](../01-dokumentacja-systemowa/07-decyzje-adr/0011-dokumentacja-hybryda-repo-confluence.md) |
