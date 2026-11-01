# Spotkanie startowe zespołu — agenda

**Czas:** 90 min · **Data:** ⟨RRRR-MM-DD⟩ · **Prowadzi:** ⟨PO Sprintu 0⟩ · **Notuje:** ⟨osoba⟩ · **Forma:** ⟨sala / Teams / Discord⟩

**Cel:** po spotkaniu każdy wie, jak działa gra, jak zbudowane jest repo, jak pracujemy z Jirą i agentami AI — i zamknęliśmy decyzje blokujące Sprint 1.

## Przed spotkaniem (15 min, każdy)

1. Zagraj jedną partię z botem w prototypie (`npx serve prototype/revibance` albo link z GitHub Pages).
2. Przeczytaj [`README.md`](../../README.md) i [`docs/02-rules/SPECYFIKACJA.md`](../02-rules/SPECYFIKACJA.md) §1–6.
3. Spróbuj `tools/setup.ps1` — problemy zgłoś na spotkaniu (wynik `tools/doctor.ps1`).

## Plan

| Czas | Blok | Kto | Materiał | Wynik |
|---|---|---|---|---|
| 0:00–0:05 | Cel spotkania, kto notuje | PO S0 | ta agenda | — |
| 0:05–0:20 | **Gra:** zasady na prototypie (runda, kroki, walka 4 linii, słowa kluczowe) | autorzy gry | prototyp, `SPECYFIKACJA.md` | wszyscy rozumieją przebieg rundy |
| 0:20–0:30 | **Uczelnia:** EU1–EU7, rola PO w sprincie, DIP i „każdy autor epiku”, Burndown, Log Work | PO S0 | `docs/99-sources/.../wymagania uczelniane.md`, `DIP.md` | lista obowiązków każdego |
| 0:30–0:45 | **Architektura i repo:** warstwy, 5 kontraktów, serwer autorytatywny; pokaz: `dotnet run --project src/Rejoltance.AppHost` + sandbox meczu | ⟨osoba⟩ | `MAP.md`, ADR 0001–0010 | rozumiemy granice modułów |
| 0:45–1:00 | **Jak pracujemy:** Jira → gałąź → OpenSpec → test → PR → review; agenci AI i konstytucja | ⟨osoba⟩ | `jak-pracujemy.md`, `AGENTS.md`, `sciaga.md` | każdy wie, jak zacząć zadanie |
| 1:00–1:20 | **Decyzje** (niżej) | wszyscy | `pytania-otwarte.md`, `ROZBIEZNOSCI.md` | tabela decyzji wypełniona |
| 1:20–1:30 | **Podział i następne kroki:** epiki E1–E6, PO sprintów, zadania S0 | PO S0 | `BACKLOG.md` | właściciele i terminy |

## Decyzje do zamknięcia (1:00–1:20)

Najpierw te, które blokują Sprint 1. Każda decyzja: krótka prezentacja opcji → głosowanie → zapis.

| # | Decyzja | Opcje / propozycja | Decyzja | Kto aktualizuje pliki |
|---|---|---|---|---|
| #9 | Właściciele epików E1–E6 | kto bierze Kernel (ścieżka krytyczna, najwięcej pracy)? | | PO S0: `DIP.md`, `backlog.toml`, `CODEOWNERS` |
| #2 | PO w każdym sprincie | S0–S5 = 6 sprintów na 6 osób; potwierdzić z prowadzącym | | PO S0: `DIP.md` §6.1 |
| #1 | Klucz projektu w Jirze | `REJ` lub nadany przez prowadzącego | | właściciel E6 |
| #6 | Rozbieżności reguł — najważniejsze: D-07 (Flying vs naziemni), D-01 (remis), D-03 (Breakthrough), D-10 (kolejność przed walką) | patrz `ROZBIEZNOSCI.md` (propozycje w tabeli) | | właściciel E1: `openspec/specs`, testy |
| #5 | Talia MVP — 12 kart | lista kart do wyboru na prototypie (proponuje właściciel E2) | | właściciel E2 |
| #7 | Rada graczy testowych | 3 osoby spoza zespołu + zastępstwo | | PO S0 |
| #4 | Review na GitHubie zamiast Bitbucket | pytamy prowadzącego na najbliższych zajęciach | | PO S0 |
| #8, #10 | Hosting demo, Docker przed S4 | można odłożyć do S2 | | właściciel E6 |
| ADR | Akceptacja ADR-0008 (spine‑first) i ADR-0010 (kontrakt przez próbkę) | 2 osoby akceptują lub zgłaszają uwagi | | autor ADR |

## Zadania na Sprint 0 (do 2 listopada)

| Zadanie | Kto | Story |
|---|---|---|
| Każdy uruchamia środowisko (`setup.ps1`), zgłasza problemy | wszyscy | E0-S01 |
| Merge PR `REJ-0` do `develop`, ochrona gałęzi, sekrety mirrora, GitHub Pages | ⟨admin repo⟩ | E0-S01 |
| Testowy import CSV do Jiry → import backlogu | ⟨PO S0⟩ | E0-S01 |
| Każdy pisze swój epik w `DIP.md` | autorzy epików | E0-S02 |
| Rekrutacja rady graczy | ⟨osoba⟩ | E0-S03 |
| Rozstrzygnięcie pozostałych D‑nn | ⟨właściciel E1⟩ | E0-S04 |

## Po spotkaniu

- Notatka → `docs/07-meetings/RRRR-MM-DD-spotkanie-startowe.md` + Confluence (szablon jak daily).
- Decyzje → odpowiednie pliki (kolumna „Kto aktualizuje”), osobne PR `docs/REJ-…`.
