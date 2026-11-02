<!-- CONFLUENCE 1:1 EXPORT | Source: docs/README.md @ 10829d3 (2026-11-02) -->
# Dokumentacja projektu RE:JOLTANCE

Witaj w centralnym repozytorium dokumentacji projektu **RE:JOLTANCE** (sieciowej, taktycznej gry karcianej realizowanej w ramach przedmiotu *Projekt zespołowy* na Wydziale Informatyki Politechniki Białostockiej).

Struktura katalogu `docs/` została zaprojektowana w oparciu o dwa filary:

1. **Klasyfikację dokumentacji technicznej (wg AltexSoft)** — wyraźny podział na *Dokumentację produktową — systemową* (wymagania produktu PRD, architektura systemu SAD, stos technologiczny, decyzje ADR, kontrakty API, projekt UX, strategia testów QA), *Dokumentację produktową — użytkownika* (podręcznik gracza, instrukcja wdrożenia i administracji) oraz *Dokumentację procesową* (Dokument Inicjujący Projekt DIP, rejestr produktu w Jirze, ceremonie Scrum, spotkania, badania).
2. **Metodykę Spec-Driven Development (SDD) oraz inżynierię agentową** — każdy dokument ma jednoznacznie określone źródło prawdy, etap w cyklu życia SDD oraz zasady współdziałania ludzi i agentów AI.

Układ katalogów w `docs/` odpowiada **w relacji 1:1** strukturze przestrzeni projektowej w systemie **Confluence PB**, co pozwala na bezstratne i zautomatyzowane przenoszenie dokumentacji z repozytorium do Confluence przy użyciu skryptu `python tools/confluence/sync_confluence.py`.

---

## Architektura katalogu `docs/` (Układ 1:1 z Confluence)

| Katalog w repozytorium | Sekcja nadrzędna w Confluence | Kategoria dokumentacji | Zawartość i przeznaczenie |
|---|---|---|---|
| [`00-przewodnik-i-setup/`](00-przewodnik-i-setup/README.md) | **00. Przewodnik i konfiguracja środowiska** | Standardy i wprowadzenie | Instrukcja pierwszego uruchomienia, projekt architektury dokumentacji SDD, cykl pracy (Jira → OpenSpec → Kod → PR), ściąga komend, słownik pojęć, otwarte decyzje oraz **plan wdrożenia i migracji zmian**. |
| [`01-dokumentacja-systemowa/`](01-dokumentacja-systemowa/README.md) | **01. Dokumentacja produktowa — systemowa** | Dokumentacja systemowa produktu | **PRD (Wymagania produktu)**, szczegółowa specyfikacja reguł gry i indeks `R‑nn`, **SAD (Architektura systemu)**, **Stos technologiczny**, decyzje ADR, mapa kodu, kontrakty API/SignalR, projekt UX oraz strategia testów QA. |
| [`02-dokumentacja-uzytkownika/`](02-dokumentacja-uzytkownika/README.md) | **02. Dokumentacja produktowa — użytkownika** | Dokumentacja użytkownika i administratora | Dokumentacja dla gracza końcowego (*Podręcznik gracza*, szybki start, najczęściej zadawane pytania) oraz dokumentacja dla administratora systemu (*Instrukcja wdrożenia, konfiguracji i utrzymania*). |
| [`03-dokumentacja-procesowa/`](03-dokumentacja-procesowa/README.md) | **03. Dokumentacja procesowa i Scrum** | Dokumentacja procesowa | Dokument Inicjujący Projekt (DIP), rejestr produktu (*backlog* w TOML + eksport CSV do Jiry), ceremonie Scrum, agendy spotkań oraz notatki badawcze. |
| [`04-system-agentow-ai/`](04-system-agentow-ai/README.md) | **04. System agentów AI i SDD** | Podręcznik inżynierii agentowej | Kompletny podręcznik dla ludzi: jak skonfigurować środowisko AI, jak działa katalog `.agents/`, jakie wbudowane umiejętności mają poszczególne role agentów oraz jak samodzielnie budować agentów, umiejętności i specyfikacje OpenSpec. |
| [`05-szablony/`](05-szablony/README.md) | **05. Biblioteka szablonów dokumentacji** | Szablony dokumentacji | Gotowe szablony wszystkich typów dokumentacji technicznej (PRD, SAD, projekt techniczny TDD, persony UX, raporty użyteczności, karty modułów, plany i raporty testów QA, informacje o wydaniu, podręcznik gracza, instrukcja wdrożenia). |
| [`99-archiwum-zrodel/`](99-archiwum-zrodel/README.md) | *(Poza drzewem głównym — archiwum)* | Materiały historyczne | Pierwotne notatki, audyty i pliki referencyjne z początkowej fazy projektu (tylko do odczytu). |

---

## Od czego zacząć czytanie?

### Jeśli wdrażasz nową strukturę w repozytorium i Confluence

1. Przeczytaj **[Plan wdrożenia i migracji: Co zmienić i co podmienić względem dotychczasowego podejścia](00-przewodnik-i-setup/07-plan-wdrozenia-i-migracji.md)**.
2. Zobacz **[Architekturę dokumentacji SDD i mapowanie na Confluence](00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md)**.

### Jeśli jesteś nowym członkiem zespołu deweloperskiego

1. Przeczytaj **[Szybki start i instalację środowiska](00-przewodnik-i-setup/01-szybki-start-i-instalacja.md)** i uruchom projekt lokalnie jednym poleceniem.
2. Zapoznaj się z **[Wymaganiami produktu (PRD)](01-dokumentacja-systemowa/01-prd-wymagania-produktu.md)** oraz **[Specyfikacją reguł gry](01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md)**.
3. Zobacz **[Mapę kodu i modułów](01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md)** oraz **[Dokument architektury systemu (SAD)](01-dokumentacja-systemowa/05-sad-architektura-systemu.md)**.
4. Przeczytaj **[Proces pracy, Git i Scrum](00-przewodnik-i-setup/03-proces-pracy-i-git-scrum.md)** oraz **[Podręcznik systemu agentów AI](04-system-agentow-ai/README.md)**.

### Jeśli jesteś prowadzącym zajęcia (weryfikacja Zadania 01 i efektów EU1–EU6)

1. **[Architektura dokumentacji SDD i mapowanie na Confluence](00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md)** — pełny projekt struktury dokumentacji pod Spec-Driven Development wraz z analizą porównawczą wariantów i mechanizmem synchronizacji `repozytorium → Confluence`.
2. **[Wymagania produktu — PRD](01-dokumentacja-systemowa/01-prd-wymagania-produktu.md)** — kompletna dokumentacja analityczna wymagań funkcjonalnych i niefunkcjonalnych.
3. **[Architektura systemu — SAD](01-dokumentacja-systemowa/05-sad-architektura-systemu.md)** oraz **[Stos technologiczny](01-dokumentacja-systemowa/06-stos-technologiczny.md)** — kompletna dokumentacja architektoniczna i technologiczna.
4. **[Biblioteka szablonów dokumentacji](05-szablony/README.md)** — wzorce dla pozostałych typów dokumentacji wyróżnionych w klasyfikacji AltexSoft.
