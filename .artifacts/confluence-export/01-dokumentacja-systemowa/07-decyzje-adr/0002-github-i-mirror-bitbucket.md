<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/07-decyzje-adr/0002-github-i-mirror-bitbucket.md @ a2bf2a4 (2026-11-02) -->
# ADR-0002: GitHub jako główne repozytorium, mirror do Bitbucket PB

- **Status:** zatwierdzona (2026-10-27)
- **Data:** 2026-10-27
- **Powiązane:** `.github/workflows/mirror-bitbucket.yml`, pytanie otwarte #4

## Kontekst i problem

Instrukcja pracowni wymaga przeglądów kodu (code review) w Bitbucket PB (Politechniki Białostockiej, wersja DC — Data Center — 8.14.4) i raportowania przez Jira i Bitbucket. [V]
Zespół chce używać GitHub Actions, GitHub Pages dla prototypu i narzędzi AI (Copilot, agenci). Te narzędzia najlepiej działają z GitHubem. [V]
Bitbucket DC nie ma Pipelines, więc CI (ciągłą integrację) trzeba by stawiać osobno. [Z]

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| **GitHub główny + mirror** | Actions, Pages, Copilot, Dependabot; kod jest też w Bitbucket | review odbywa się na GitHubie | prowadzący może wymagać review w Bitbucket (#4) |
| Bitbucket główny | pełna zgodność z instrukcją | brak CI w DC, słabsza integracja z AI | CI trzeba zbudować samodzielnie |
| Tylko GitHub | najprościej | ryzyko formalne przy ocenie | — |

## Decyzja

W kontekście wymogów uczelni i potrzeby CI oraz narzędzi AI, wybieramy **GitHub jako miejsce pracy (PR, czyli pull requesty, review, CI) i automatyczny mirror
gałęzi `main`, `develop` oraz tagów `sprint-*` do Bitbucket PB** zamiast pracy w Bitbucket, aby mieć działające CI od pierwszego dnia,
akceptując, że review trzeba udokumentować linkiem do PR w zgłoszeniu Jira (do potwierdzenia z prowadzącym).

## Konsekwencje

### Pozytywne

- CI, Pages, Dependabot oraz szablony PR i issue działają bez dodatkowej infrastruktury.

### Negatywne / ryzyka

- Sekret `BITBUCKET_TOKEN` musi ustawić administrator repozytorium. Bez niego mirror jest pomijany (nie psuje CI).
- Jeśli prowadzący wymaga review w Bitbucket, wracamy do tego ADR i piszemy nowy ADR, który go zastąpi.

### Do zrobienia

- [ ] E0-S01: konfiguracja sekretów i ochrony gałęzi
- [ ] Zapytać prowadzącego o akceptację review na GitHubie (#4)
