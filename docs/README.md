# Dokumentacja projektu RE:JOLTANCE

Witaj w dokumentacji projektu **RE:JOLTANCE**. To sieciowa, taktyczna gra karciana. Tworzymy ją na przedmiocie *Projekt zespołowy* na Wydziale Informatyki Politechniki Białostockiej (PB).

> **Repozytorium projektu:** [github.com/lMamacl/Rejoltance](https://github.com/lMamacl/Rejoltance) · to źródło prawdy dla kodu, specyfikacji i dokumentacji · bieżąca wersja jest na gałęzi `develop`

Katalog `docs/` opiera się na dwóch założeniach:

1. **Klasyfikacja dokumentacji technicznej według AltexSoft.** Dzielimy dokumenty na trzy grupy:
   - *dokumentacja produktowa — systemowa*: wymagania produktu (PRD, Product Requirements Document), architektura systemu (SAD, Software Architecture Document), stos technologiczny, decyzje architektoniczne (ADR, Architecture Decision Record), kontrakty API, projekt UX i strategia testów QA;
   - *dokumentacja produktowa — użytkownika*: podręcznik gracza oraz instrukcja wdrożenia i administracji;
   - *dokumentacja procesowa*: Dokument Inicjujący Projekt (DIP), rejestr produktu w Jirze, ceremonie Scrum, spotkania i badania.
2. **Spec-Driven Development (SDD) i praca z agentami AI.** W SDD najpierw piszemy specyfikację, a dopiero potem kod. Każdy dokument ma określone źródło prawdy i etap SDD. Opisuje też, jak ludzie i agenci AI dzielą się pracą.

Katalogi w `docs/` odpowiadają 1:1 stronom w przestrzeni projektu w **Confluence PB**. Dzięki temu skrypt `python tools/confluence/sync_confluence.py` przenosi dokumentację z repozytorium do Confluence automatycznie.

---

## Katalogi `docs/` i sekcje w Confluence

| Katalog w repozytorium | Sekcja w Confluence | Kategoria | Zawartość |
|---|---|---|---|
| [`00-przewodnik-i-setup/`](00-przewodnik-i-setup/README.md) | 00. Przewodnik i konfiguracja środowiska | Standardy i wprowadzenie | Pierwsze uruchomienie, architektura dokumentacji SDD, cykl pracy (Jira → OpenSpec → kod → PR), ściąga komend, słownik pojęć, otwarte decyzje, plan wdrożenia i migracji. |
| [`01-dokumentacja-systemowa/`](01-dokumentacja-systemowa/README.md) | 01. Dokumentacja produktowa — systemowa | Dokumentacja systemowa produktu | PRD, specyfikacja reguł gry i indeks `R‑nn`, SAD, stos technologiczny, decyzje ADR, mapa kodu, kontrakty API/SignalR, projekt UX, strategia testów QA. |
| [`02-dokumentacja-uzytkownika/`](02-dokumentacja-uzytkownika/README.md) | 02. Dokumentacja produktowa — użytkownika | Dokumentacja użytkownika i administratora | Dla gracza: *Podręcznik gracza*, szybki start, FAQ. Dla administratora: *Instrukcja wdrożenia, konfiguracji i utrzymania*. |
| [`03-dokumentacja-procesowa/`](03-dokumentacja-procesowa/README.md) | 03. Dokumentacja procesowa i Scrum | Dokumentacja procesowa | DIP, rejestr produktu (*backlog* w TOML i eksport CSV do Jiry), ceremonie Scrum, agendy spotkań, notatki badawcze. |
| [`04-system-agentow-ai/`](04-system-agentow-ai/README.md) | 04. System agentów AI i SDD | Podręcznik pracy z agentami | Konfiguracja środowiska AI, działanie katalogu `.agents/`, umiejętności (skille) poszczególnych ról, budowanie własnych agentów, skilli i specyfikacji OpenSpec. |
| [`05-szablony/`](05-szablony/README.md) | 05. Biblioteka szablonów dokumentacji | Szablony | Szablony wszystkich typów dokumentacji: PRD, SAD, projekt techniczny (TDD, Technical Design Document), persony UX, raporty użyteczności, karty modułów, plany i raporty testów QA, informacje o wydaniu, podręcznik gracza, instrukcja wdrożenia. |
| [`99-archiwum-zrodel/`](99-archiwum-zrodel/README.md) | *(poza głównym drzewem — archiwum)* | Materiały historyczne | Pierwsze notatki, audyty i pliki referencyjne z początku projektu. Tylko do odczytu. |

---

## Od czego zacząć czytanie?

### Wdrażasz nową strukturę w repozytorium i Confluence

1. Przeczytaj [Plan wdrożenia i migracji: Co zmienić i co podmienić względem dotychczasowego podejścia](00-przewodnik-i-setup/07-plan-wdrozenia-i-migracji.md).
2. Zobacz [Architekturę dokumentacji SDD i mapowanie na Confluence](00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md).

### Dołączasz do zespołu deweloperskiego

1. Przeczytaj [Szybki start i instalację środowiska](00-przewodnik-i-setup/01-szybki-start-i-instalacja.md). Uruchom projekt lokalnie jednym poleceniem.
2. Poznaj [Wymagania produktu (PRD)](01-dokumentacja-systemowa/01-prd-wymagania-produktu.md) i [Specyfikację reguł gry](01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md).
3. Zobacz [Mapę kodu i modułów](01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md) i [Dokument architektury systemu (SAD)](01-dokumentacja-systemowa/05-sad-architektura-systemu.md).
4. Przeczytaj [Proces pracy, Git i Scrum](00-przewodnik-i-setup/03-proces-pracy-i-git-scrum.md) oraz [Podręcznik systemu agentów AI](04-system-agentow-ai/README.md).

### Prowadzisz zajęcia i sprawdzasz Zadanie 01 oraz efekty EU1–EU6

1. [Architektura dokumentacji SDD i mapowanie na Confluence](00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md). Opisuje strukturę dokumentacji pod SDD, porównanie wariantów i synchronizację `repozytorium → Confluence`.
2. [Wymagania produktu — PRD](01-dokumentacja-systemowa/01-prd-wymagania-produktu.md). Zawiera wymagania funkcjonalne i niefunkcjonalne.
3. [Architektura systemu — SAD](01-dokumentacja-systemowa/05-sad-architektura-systemu.md) i [Stos technologiczny](01-dokumentacja-systemowa/06-stos-technologiczny.md). Opisują architekturę i technologie.
4. [Biblioteka szablonów dokumentacji](05-szablony/README.md). Zawiera wzorce pozostałych typów dokumentacji z klasyfikacji AltexSoft.
