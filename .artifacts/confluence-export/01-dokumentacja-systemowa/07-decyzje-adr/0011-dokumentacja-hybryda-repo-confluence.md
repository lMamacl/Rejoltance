<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/07-decyzje-adr/0011-dokumentacja-hybryda-repo-confluence.md @ a2bf2a4 (2026-11-02) -->
# ADR-0011: Dokumentacja hybrydowa — repo dla SDD, Confluence dla ludzi i procesu

- **Status:** zatwierdzona (decyzja zespołu, 2026-11; formalna akceptacja 2 osób)
- **Data:** 2026-11-01
- **Powiązane:** Zadanie 01 (CEZ), `docs/00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md`, ADR-0003, ADR-0009

## Kontekst i problem

Prowadzący oczekuje struktury dokumentacji w **Confluence PB**. Ma ona obejmować analizę wymagań, stos technologiczny i architekturę
i wspierać spec‑driven development (SDD, pracę sterowaną specyfikacją). [V]
W SDD specyfikacja steruje pracą ludzi i agentów AI. Musi więc być wersjonowana razem z kodem, przeglądana w PR (pull requeście)
i walidowana w CI, czyli ciągłej integracji (`openspec validate`). [V]
Confluence dobrze służy do współpracy, prezentacji i oceny. Agent nie wykona jednak procesu SDD na stronie wiki, a ręczne kopie się rozjeżdżają. [Z]

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Wszystko w Confluence | jedno miejsce, wygodne dla prowadzącego | specyfikacji nie da się walidować ani przeglądać w PR; agenci czytają nieaktualne kopie | rozjazd specyfikacji i kodu |
| Wszystko w repo | jedno źródło, wersjonowanie | Confluence pusty → nie spełnia wymagań przedmiotu (EU5/EU6) | ryzyko oceny |
| **Hybryda z jasnym podziałem** | SDD działa na repo; Confluence ma pełne drzewo, mapę i dokumenty dla ludzi | trzeba pilnować publikacji kopii | proces publikacji + banner „źródło” |

## Decyzja

W kontekście SDD z agentami AI i wymagania uczelni, by dokumentacja żyła w Confluence, wybieramy **hybrydę**:
**repo** jest źródłem prawdy dla wszystkiego, co steruje implementacją (wymagania funkcjonalne i niefunkcjonalne, architektura, stos, API, ADR, strategia testów, standardy),
a **Confluence** jest źródłem prawdy dla dokumentacji ludzkiej i procesowej (badania z użytkownikami, protokoły odbioru, raporty sprintów, notatki ze spotkań, dokumentacja użytkownika)
oraz zawiera **pełne drzewo dokumentacji** z kopiami stron z repo — zamiast trzymania wszystkiego w jednym miejscu,
aby specyfikacje były wykonywalne i weryfikowalne, a prowadzący widział kompletną dokumentację, akceptując obowiązek publikacji kopii przy każdej zmianie na `develop`.

## Konsekwencje

### Pozytywne

- Każda strona w Confluence ma nagłówek „Źródło prawdy: repo / Confluence”, więc wiadomo, gdzie poprawiać.
- Agent AI czyta aktualne specyfikacje z repo, a ludzie przeglądają je w Confluence.

### Negatywne / ryzyka

- Kopie w Confluence mogą się zestarzeć. Dlatego w Definition of Done jest punkt „strona w Confluence zaktualizowana”, a datę i commit źródła podajemy w nagłówku strony.
- Jeśli prowadzący wymaga edycji wyłącznie w Confluence, piszemy nowy ADR, który zastąpi ten.

### Do zrobienia

- [x] Drzewo stron w Confluence i układ 1:1 w `docs/` wg `docs/00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md`
- [x] Skrypt synchronizacji i walidacji `tools/confluence/sync_confluence.py` + skill `rj-sync-confluence`
