<!-- CONFLUENCE 1:1 EXPORT | Source: docs/03-dokumentacja-procesowa/03-scrum-i-spotkania/spotkanie-startowe-agenda.md @ 10829d3 (2026-11-02) -->
# Spotkanie startowe zespołu — agenda (Kick-off Sprintu 0)

> **Źródło prawdy:** Repozytorium (`docs/03-dokumentacja-procesowa/03-scrum-i-spotkania/spotkanie-startowe-agenda.md`) · **Kategoria AltexSoft:** Process Documentation — Meeting Notes · **Etap SDD:** Fundamenty (`Constitution`)

**Czas:** 90 min · **Data:** `<RRRR-MM-DD>` · **Prowadzi:** `<PO Sprintu 0>` · **Notuje:** `<osoba>` · **Forma:** `<sala / Teams / Discord>`

**Cel:** po spotkaniu każdy członek zespołu wie, jak działa gra, jak zbudowane jest repozytorium i dokumentacja SDD, jak pracujemy z Jirą, Confluence i agentami AI — oraz wspólnie zamykamy decyzje otwarte blokujące Sprint 1.

---

## Przed spotkaniem (15 min przygotowania indywidualnego)

1. Zagraj jedną partię z botem w prototypie (`npx serve prototype/revibance` albo przez GitHub Pages).
2. Przeczytaj [`README.md`](../../../README.md), [`01-prd-wymagania-produktu.md`](../../01-dokumentacja-systemowa/01-prd-wymagania-produktu.md) oraz [`02-specyfikacja-regul-gry.md`](../../01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md) §1–6.
3. Uruchom skrypt `tools/setup.ps1` — ewentualne problemy zanotuj wraz z wynikiem `tools/doctor.ps1`.

---

## Plan spotkania (90 min)

| Czas | Blok tematyczny | Prowadzi | Materiał źródłowy | Oczekiwany wynik |
|---|---|---|---|---|
| 0:00–0:05 | Powitanie, cel spotkania i wyznaczenie protokolanta | PO S0 | niniejsza agenda | ustalony protokolant |
| 0:05–0:20 | **Gra:** omówienie zasad na prototypie (runda, 4 kroki, walka 4 linii, słowa kluczowe) | autorzy gry | prototyp, [`02-specyfikacja-regul-gry.md`](../../01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md) | wszyscy rozumieją przebieg rundy |
| 0:20–0:30 | **Wymogi uczelniane:** EU1–EU7, rotacja PO, DIP i właściciele epików, Burndown, Log Work | PO S0 | [`01-dip-dokument-inicjujacy.md`](../01-dip-dokument-inicjujacy.md) | lista indywidualnych obowiązków |
| 0:30–0:45 | **Architektura i repozytorium:** warstwy, 5 kontraktów, serwer autorytatywny, pokaz `dotnet run --project src/Rejoltance.AppHost` | architekt | [`05-sad-architektura-systemu.md`](../../01-dokumentacja-systemowa/05-sad-architektura-systemu.md), [`08-mapa-kodu-i-modulow.md`](../../01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md) | zrozumienie granic modułów |
| 0:45–1:00 | **Proces SDD i agenci AI:** Jira → gałąź → OpenSpec → test → PR → review; katalog ról i skilli | lider SDD | [`03-proces-pracy-i-git-scrum.md`](../../00-przewodnik-i-setup/03-proces-pracy-i-git-scrum.md), [`04-system-agentow-ai/`](../../04-system-agentow-ai/README.md) | każdy wie, jak zacząć zadanie |
| 1:00–1:20 | **Zamknięcie decyzji otwartych** (tabela poniżej) | wszyscy | [`06-decyzje-otwarte-i-zalozenia.md`](../../00-przewodnik-i-setup/06-decyzje-otwarte-i-zalozenia.md), [`04-rozbieznosci-prototypu.md`](../../01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md) | wypełniona tabela decyzji |
| 1:20–1:30 | **Podział epików i zadań Sprintu 0:** właściciele E1–E6, harmonogram PO, zadania S0 | PO S0 | [`02-backlog/BACKLOG.md`](../02-backlog/BACKLOG.md) | przypisani właściciele i terminy |

---

## Decyzje do zamknięcia na spotkaniu (1:00–1:20)

| # | Temat decyzji | Opcje / Propozycja | Podjęta decyzja | Kto aktualizuje dokumentację |
|---|---|---|---|---|
| **#9** | Właściciele epików E1–E6 | Przypisanie 6 osób do 6 epików (kto bierze ścieżkę krytyczną E1 Kernel?) | | PO S0: `01-dip-dokument-inicjujacy.md`, `backlog.toml`, `CODEOWNERS` |
| **#2** | Harmonogram PO w sprintach S0–S5 | 6 sprintów na 6 osób; potwierdzenie z prowadzącym statusu S0 | | PO S0: `01-dip-dokument-inicjujacy.md` §6.1 |
| **#1** | Klucz projektu w Jirze PB | `REJ` lub klucz nadany przez prowadzącego | | Właściciel E6 |
| **#6** | Rozbieżności reguł (`D-01`, `D-03`, `D-07`, `D-10`) | Głosowanie nad rekomendacjami w [`04-rozbieznosci-prototypu.md`](../../01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md) | | Właściciel E1: `openspec/specs/*` |
| **#5** | Skład talii MVP (12 kart) | Wybór 12 kart reprezentujących wszystkie mechaniki Fali W1 | | Właściciel E2 |
| **#7** | Skład Rady Graczy Testowych | 3 osoby spoza zespołu + 1 osoba rezerwowa | | PO S0 |
| **#4** | Miejsce prowadzenia Code Review | GitHub Pull Requests + automatyczny mirror do Bitbucket PB | | PO S0 |
| **ADR** | Formalna akceptacja `ADR-0008` i `ADR-0010` | Przegląd i zatwierdzenie przez 2 osoby | | Autorzy ADR |

---

## Zadania na Sprint 0 (do końca pierwszego tygodnia)

| Zadanie | Odpowiedzialny | Klucz Story |
|---|---|---|
| Uruchomienie środowiska (`tools/setup.ps1`) na każdym laptopie | Wszyscy | `E0-S01` |
| Konfiguracja ochrony gałęzi, sekretów mirrora Bitbucket i GitHub Pages | Administrator repozytorium | `E0-S01` |
| Testowy import CSV do Jiry PB → pełny import backlogu | PO Sprintu 0 | `E0-S01` |
| Uzupełnienie autorskich sekcji epików E1–E6 w `01-dip-dokument-inicjujacy.md` | Właściciele epików E1–E6 | `E0-S02` |
| Rekrutacja 3-osobowej Rady Graczy Testowych i wywiady wstępne | PO Sprintu 0 | `E0-S03` |
| Zamknięcie wszystkich rozbieżności `D-01..D-20` z prototypem | Właściciel E1 | `E0-S04` |
