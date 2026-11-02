<!-- CONFLUENCE 1:1 EXPORT | Source: docs/00-przewodnik-i-setup/06-decyzje-otwarte-i-zalozenia.md @ a2bf2a4 (2026-11-02) -->
# 0.6 Decyzje otwarte do zespołu oraz założenia projektowe

> **Źródło prawdy:** repozytorium (`docs/00-przewodnik-i-setup/06-decyzje-otwarte-i-zalozenia.md`) · **Kategoria dokumentacji:** założenia produktowe i procesowe oraz pytania otwarte · **Etap SDD:** Specyfikacja i planowanie

Ten dokument zbiera w jednym miejscu dwie rzeczy:

- otwarte pytania, o których musi zdecydować zespół albo prowadzący zajęcia (`#1–#10`),
- przyjęte założenia projektowe, które sprawdzamy w kolejnych sprintach.

SDD (Spec-Driven Development) to nasza metoda pracy: najpierw specyfikacja, potem kod. PB oznacza Politechnikę Białostocką, a ADR (Architecture Decision Record) to zapis decyzji architektonicznej.

---

## 1. Pytania otwarte (`#1–#10`)

Gdy zespół podejmie decyzję na spotkaniu, wpisz ją w kolumnie „Podjęta decyzja”. Potem zaktualizuj pliki wskazane w wierszu.

| ID | Obszar | Pytanie | Kto decyduje | Pliki do aktualizacji po decyzji | Podjęta decyzja |
|---|---|---|---|---|---|
| **#1** | Proces / Jira | Jaki będzie ostateczny klucz projektu w uczelnianej Jirze? Obecnie używamy tymczasowo `REJ`. Kiedy projekt zostanie założony? | Prowadzący zajęcia | `backlog.toml` (`project_key`), `.github/workflows/pr-conventions.yml`, `.agents/rules/50-git-i-jira.md`, `01-dip-dokument-inicjujacy.md` | *Do potwierdzenia na zajęciach* |
| **#2** | Proces / Scrum | Jak wygląda harmonogram rotacji roli Product Ownera w sprintach? Czy Sprint 0 liczy się do ocenianych sprintów PO? | Zespół + prowadzący | `01-dip-dokument-inicjujacy.md` §6.1, `01-prd-wymagania-produktu.md` §2 | *Do ustalenia na spotkaniu startowym* |
| **#3** | Proces / Jira | Jak mapujemy uczelniany przepływ pracy (`Open → In Progress → Resolved → Closed`) na kolumny tablicy Scrum? | Product Owner S1 | `03-proces-pracy-i-git-scrum.md`, `01-dip-dokument-inicjujacy.md` §8 | *Do ustalenia przy konfiguracji tablicy* |
| **#4** | Proces / Git | Czy prowadzący akceptuje Code Review na GitHubie? Zadania w Jirze miałyby linki do PR, a kod kopiowałby się automatycznie (mirror) do Bitbucket PB. | Prowadzący zajęcia | `0002-github-i-mirror-bitbucket.md`, konfiguracja sekretów `BITBUCKET_TOKEN` | *Do potwierdzenia z prowadzącym* |
| **#5** | Produkt / MVP | Które 12 kart wchodzi do zawężonej talii MVP (Minimum Viable Product) na pierwszy kamień milowy w Semestrze 1? | Zespół + Rada Graczy | Zadanie `E2-S05`, `01-prd-wymagania-produktu.md` §4 | *Do wyboru w Sprincie 0* |
| **#6** | Produkt / reguły | Jak rozstrzygamy 20 znalezionych rozbieżności prototypu JS (`D-01..D-20`)? Chodzi m.in. o remis bohaterów, Flying a jednostki naziemne i Breakthrough. | Zespół + autorzy gry | `04-rozbieznosci-prototypu.md`, `openspec/specs/*`, testy w `Rejoltance.Kernel.Tests` | *Zadanie `E0-S04` w Sprincie 0* |
| **#7** | Produkt / EU1 | Kto wchodzi w skład 3-osobowej Rady Graczy Testowych? To przedstawiciele użytkowników spoza zespołu. | Product Owner S0 | `01-dip-dokument-inicjujacy.md` §2.1, `01-prd-wymagania-produktu.md` §3, zadanie `E0-S03` | *Do wpisania w Sprincie 0* |
| **#8** | Techniczne | Gdzie hostujemy publiczną wersję demonstracyjną na Sprint Review? Opcje: Azure for Students, Railway, serwer wydziałowy. | Właściciel epiku E6 | `05-sad-architektura-systemu.md` §7, zadanie `E6-S05` | *Do wyboru przed Sprintem 3* |
| **#9** | Organizacja | Kto jest właścicielem którego epiku (`E1–E6`)? Od tego zależy indywidualne zaliczenie efektu EU1 oraz dokumentacja EU5/EU6. | Zespół (6 osób) | `01-dip-dokument-inicjujacy.md`, `01-prd-wymagania-produktu.md`, `backlog.toml`, `.github/CODEOWNERS` | *Do przydzielenia na spotkaniu startowym* |
| **#10** | Techniczne | Czy każdy w zespole zainstaluje Docker Desktop albo Podman przed Sprintem 4 (przejście na PostgreSQL)? | Zespół | `0007-sqlite-potem-postgresql.md`, zadanie `E6-S03` | *Do sprawdzenia przed Sprintem 4* |

---

## 2. Założenia projektowe i techniczne

Przyjęliśmy te założenia przy projektowaniu architektury i planowaniu backlogu. Dzięki nim możemy pracować bez czekania na odpowiedzi. Sprawdzamy je w trakcie projektu.

### A. Założenia procesowe i organizacyjne

| Kod | Założenie | Jak sprawdzamy | Plan awaryjny (gdy założenie okaże się błędne) |
|---|---|---|---|
| **Z-01** | Klucz projektu w Jirze PB to `REJ`. | Prowadzący zakłada projekt (#1). | Jednorazowo zmieniamy `project_key` w `backlog.toml` i generujemy pliki CSV od nowa skryptem `gen_jira_csv.py`. |
| **Z-02** | Każda osoba ma średnio **5 godzin tygodniowo** na projekt. Razem to 30 h/tydz. na 6-osobowy zespół, z 10% buforem. | Mierzymy rzeczywisty czas pracy (*Log Work*) i prędkość zespołu (*Velocity*) na koniec Sprintu 1. | Przesuwamy linię cięcia między falami `W1` i `W2` na *Sprint Planningu* S2. |
| **Z-03** | Przerwa świąteczno-noworoczna w Sprincie 4 (15.12–11.01) daje tyle pracy, co zwykły dwutygodniowy sprint. | Planujemy dostępność zespołu na początku Sprintu 4. | Zmniejszamy liczbę zadań w Sprincie 4 o 20–30%. |
| **Z-04** | Serwery uczelniane (`devtools.wi.pb.edu.pl`) działają z sieci domowych bez VPN. | Pierwsze logowanie zespołu do Jiry i Confluence PB. | Dopisujemy instrukcję konfiguracji uczelnianego VPN do `01-szybki-start-i-instalacja.md`. |

### B. Założenia narzędziowe i techniczne

| Kod | Założenie | Jak sprawdzamy | Plan awaryjny (gdy założenie okaże się błędne) |
|---|---|---|---|
| **Z-10** | Przy imporcie CSV do Jira Server/DC pole `Original Estimate` przyjmuje wartości w sekundach (np. `14400` = 4h). | Próbny import plików z katalogu `02-backlog/test-import/`. | Zmieniamy parametr `estimate_format = "jira"` w `backlog.toml` i generujemy pliki CSV od nowa. |
| **Z-11** | Uczelniane Jira i Confluence PB pozwalają tworzyć *Personal Access Tokens (PAT)*. Potrzebujemy ich do integracji MCP (Model Context Protocol) i skryptu `sync_confluence.py`. | Pierwsza osoba konfiguruje dostęp według `01-architektura-i-konfiguracja-agentow.md`. | Używamy lokalnego eksportu (`.artifacts/confluence-export/`) i wklejamy strony Markdown w edytorze Confluence. |
| **Z-12** | *Smart App Control* w Windows 11 blokuje lokalne biblioteki DLL tylko na części komputerów zespołu. | Każdy uruchamia `tools/doctor.ps1` (zadanie `E0-S01`). | Uruchamiamy serwer i klienta w dwóch terminalach (Wariant B w instrukcji startowej). Testy integracyjne opieramy na GitHub Actions CI. |

### C. Założenia produktowe i domenowe

| Kod | Założenie | Jak sprawdzamy | Plan awaryjny (gdy założenie okaże się błędne) |
|---|---|---|---|
| **Z-20** | Kanonem reguł gry jest prototyp JavaScript `prototype/revibance` (v11 z 27.10.2026). Wyjątkiem są opisane błędy implementacji (`D-01..D-20`). | Warsztat z autorami gry w Sprincie 0 (`E0-S04`). | Aktualizujemy specyfikację w `openspec/specs/` i indeks `03-indeks-regul-r-nn.md`. |
| **Z-21** | Grafiki (`img/*.webp`), dźwięki (`sfx/*.wav`, `audio/music.mp3`) i czcionki z prototypu możemy legalnie trzymać w repozytorium. | Potwierdzili to autorzy prototypu z zespołu (27.10.2026). | — |

---

## 3. Decyzje zamknięte

| Obszar | Rozstrzygnięcie | Data i źródło |
|---|---|---|
| Stos technologiczny | Backend C# .NET 10 (ASP.NET Core + SignalR), frontend React 19 + TypeScript + Vite, orkiestracja .NET Aspire 13. | 2026-10-27 · [ADR-0001](../01-dokumentacja-systemowa/07-decyzje-adr/0001-stos-technologiczny.md) |
| Architektura silnika | Silnik reguł (`Rejoltance.Kernel`) piszemy od nowa jako czysty, deterministyczny reduktor stanu. Prototyp JS jest kanonem reguł. | 2026-10-27 · [ADR-0004](../01-dokumentacja-systemowa/07-decyzje-adr/0004-kernel-od-nowa-deterministyczny.md), [ADR-0005](../01-dokumentacja-systemowa/07-decyzje-adr/0005-kanon-regul-prototyp-js.md) |
| Framework SDD | Wybraliśmy **OpenSpec** i konstytucję projektu w `.agents/rules/00-konstytucja.md`. | 2026-10-27 · [ADR-0003](../01-dokumentacja-systemowa/07-decyzje-adr/0003-openspec-i-konstytucja.md) |
| Architektura dokumentacji | Układ 1:1 między `docs/` w repozytorium a przestrzenią Confluence PB, oparty na klasyfikacji AltexSoft i procesie SDD. | 2026-11-02 · [ADR-0011](../01-dokumentacja-systemowa/07-decyzje-adr/0011-dokumentacja-hybryda-repo-confluence.md) |
