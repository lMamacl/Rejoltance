# Założenia i niepewności

Wszystko, czego **nie** zweryfikowano, w jednym miejscu. Legenda: **[Z]** założenie przyjęte do pracy, **[?]** niewiadoma do sprawdzenia.
Gdy coś się wyjaśni — przenieś wiersz do „Rozstrzygnięte” z datą i źródłem.

## Proces i uczelnia

| # | Treść | Typ | Jak sprawdzić / kto | Skutek, jeśli błędne |
|---|---|---|---|---|
| Z-01 | Klucz projektu w Jirze to `REJ` | [Z] | prowadzący zakłada projekt (#1) | zmiana `project_key` w `backlog.toml`, regexy w `pr-conventions.yml` i `.agents/rules/50-git-i-jira.md` |
| Z-02 | Review na GitHubie z linkiem w Jirze jest akceptowane zamiast review w Bitbucket | [?] | pytanie do prowadzącego (#4) | nowy ADR zastępujący ADR-0002 |
| Z-03 | Sprint 0 liczy się jako sprint z rolą PO (6 sprintów na 6 osób) | [?] | prowadzący (#2) | jedna osoba bez sprintu PO w semestrze 1 |
| Z-04 | Pojemność 5 h tygodniowo na osobę | [Z] | pierwsza retrospektywa (velocity S1) | przeplanowanie linii cięcia |
| Z-05 | Przerwa świąteczna = ok. 2 tygodnie pracy w S4 | [Z] | planning S4 | mniej story w S4 |
| Z-06 | Jira PB nie wymaga VPN (strony logowania dostępne publicznie) | [Z] | pierwsze logowanie z domu | instrukcja VPN w `jak-zaczac.md` |
| Z-07 | Workflow pracowni `Open → In Progress → Resolved → Closed` mapuje się na kolumny tablicy | [?] | konfiguracja tablicy (#3) | inne statusy w DoD |

## Narzędzia

| # | Treść | Typ | Jak sprawdzić / kto | Skutek, jeśli błędne |
|---|---|---|---|---|
| Z-10 | `Original Estimate` w imporcie CSV Jiry DC jest w sekundach | [?] | testowy import (`docs/05-backlog/test-import`) | `estimate_format = "jira"` |
| Z-11 | Pole Story Points jest na ekranach schematu „Pracownia projektowa” | [?] | testowy import | prośba do prowadzącego o pole |
| Z-12 | `mcp-atlassian` działa z Jirą/Confluence PB przez Personal Access Token (Jira ≥ 8.14) i trybem `READ_ONLY_MODE` | [?] | jedna osoba konfiguruje wg `jira-confluence-mcp.md` | integracja agentów z Jirą tylko ręczna |
| Z-13 | AppHost sam instaluje zależności npm przy pierwszym starcie | [?] | czysty klon na innym laptopie | `setup.ps1` i tak robi `npm ci` — bez wpływu |
| Z-14 | Workflowy GitHub Actions działają bez poprawek | [?] | pierwszy push (E6-S01) | poprawki w E6-S01 |
| Z-15 | Smart App Control blokuje build tylko na części laptopów | [?] | `tools/doctor.ps1` u każdego (E0-S01) | uruchamianie serwera i web osobno, CI jako dowód |
| Z-16 | Format agentów Copilot (`.agent.md`) z samym `name`/`description` jest wystarczający | [Z] | test w VS Code | dodanie `tools:` w generatorze |
| Z-17 | Gemini CLI czyta `.gemini/skills` (tak instaluje je OpenSpec) i `GEMINI.md` | [Z] | test u osoby z Gemini | dopisanie `context.fileName` w `.gemini/settings.json` |

## Produkt i reguły

| # | Treść | Typ | Jak sprawdzić / kto | Skutek, jeśli błędne |
|---|---|---|---|---|
| Z-20 | Kanonem jest prototyp v11 z repo `PanCoto/revibance` w stanie z 27.10.2026 | [Z] | autorzy gry | aktualizacja `prototype/` i `cards.json` |
| Z-21 | 20 rozbieżności D‑nn zostanie rozstrzygniętych w S0 | [Z] | E0-S04 | reguły sporne blokują story E1 w S3–S4 |
| Z-22 | Talia MVP 12 kart wystarczy do oceny semestru 1 | [?] | rada graczy, prowadzący (#5) | więcej story E2 w S5 kosztem innych |
| Z-23 | Hosting demo dostępny bezpłatnie (Azure for Students / inny) | [?] | właściciel E6 (#8) | demo tylko lokalnie |
| Z-24 | Grafiki, dźwięki i fonty prototypu można publikować (autorem jest zespół) | [Z] | potwierdzone przez zespół 2026-10-27 | — |
| Z-25 | Estymaty story od S3 (`estimate_h`) są zgrubne | [Z] | refinement przed każdym sprintem | przesunięcia w linii cięcia |

## Rozstrzygnięte

| # | Treść | Rozstrzygnięcie | Data / źródło |
|---|---|---|---|
| — | Backend w C#, frontend React/TS | decyzja zespołu | 2026-10-27, ADR-0001 |
| — | Kernel od nowa, kanon = prototyp JS | decyzja zespołu | 2026-10-27, ADR-0004/0005 |
| — | OpenSpec zamiast Spec Kit | testy porównawcze | 2026-10-27, ADR-0003 |
| — | `dotnet run --project src/Rejoltance.AppHost` uruchamia serwer i web bez Dockera | `AppHostSmokeTests` zielone lokalnie | 2026-10-27 |
