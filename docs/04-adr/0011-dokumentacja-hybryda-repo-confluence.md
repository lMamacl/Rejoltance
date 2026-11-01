# ADR-0011: Dokumentacja hybrydowa — repo dla SDD, Confluence dla ludzi i procesu

- **Status:** accepted (decyzja zespołu, 2026-11; formalna akceptacja 2 osób)
- **Data:** 2026-11-01
- **Powiązane:** Zadanie 01 (CEZ), `docs/00-start/mapa-dokumentacji.md`, ADR-0003, ADR-0009

## Kontekst i problem

Prowadzący oczekuje struktury dokumentacji w **Confluence PB**, obejmującej analizę wymagań, stos technologiczny i architekturę, pod spec‑driven development (SDD). [V]
W SDD specyfikacja steruje pracą ludzi i agentów AI: musi być wersjonowana razem z kodem, przeglądana w PR i walidowana w CI (`openspec validate`). [V]
Confluence dobrze służy do współpracy, prezentacji i oceny, ale agent nie wykona procesu SDD na stronie wiki, a kopie ręczne się rozjeżdżają. [Z]

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Wszystko w Confluence | jedno miejsce, wygodne dla prowadzącego | specyfikacji nie da się walidować ani przeglądać w PR; agenci czytają nieaktualne kopie | rozjazd specyfikacji i kodu |
| Wszystko w repo | jedno źródło, wersjonowanie | Confluence pusty → nie spełnia wymagań przedmiotu (EU5/EU6) | ryzyko oceny |
| **Hybryda z jasnym podziałem** | SDD działa na repo; Confluence ma pełne drzewo, mapę i dokumenty ludzkie | trzeba pilnować publikacji kopii | proces publikacji + banner „źródło” |

## Decyzja

W kontekście SDD z agentami AI i wymagania uczelni, by dokumentacja żyła w Confluence, wybieramy **hybrydę**:
**repo** jest źródłem prawdy dla wszystkiego, co steruje implementacją (wymagania funkcjonalne i niefunkcjonalne, architektura, stos, API, ADR, strategia testów, standardy),
a **Confluence** jest źródłem prawdy dla dokumentacji ludzkiej i procesowej (badania z użytkownikami, protokoły odbioru, raporty sprintów, notatki ze spotkań, dokumentacja użytkownika)
oraz zawiera **pełne drzewo dokumentacji** z kopiami stron z repo — zamiast trzymania wszystkiego w jednym miejscu,
aby specyfikacje były wykonywalne i weryfikowalne, a prowadzący widział kompletną dokumentację, akceptując obowiązek publikacji kopii przy każdej zmianie na `develop`.

## Konsekwencje

### Pozytywne

- Każda strona w Confluence ma nagłówek „Źródło prawdy: repo / Confluence” — wiadomo, gdzie poprawiać.
- Agent AI czyta aktualne specyfikacje z repo; ludzie przeglądają je w Confluence.

### Negatywne / ryzyka

- Kopie w Confluence mogą się zestarzeć → w Definition of Done: „strona w Confluence zaktualizowana”; datę i commit źródła podajemy w nagłówku strony.
- Jeśli prowadzący wymaga edycji wyłącznie w Confluence — nowy ADR zastępujący ten.

### Do zrobienia

- [ ] Drzewo stron w Confluence wg `docs/00-start/mapa-dokumentacji.md`
- [ ] Publikacja kopii stron z repo (przez przeglądarkę; w przyszłości skrypt z tokenem PAT)
