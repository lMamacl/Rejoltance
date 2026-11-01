# 5.2 Plan testów — Sprint N

> Źródło prawdy: Confluence. Zasady ogólne: 5.1 Strategia testów.

| Pole | Treść |
|---|---|
| Cel testów w sprincie | <np. potwierdzić R‑30…R‑35 i NFR‑02 przed Review> |
| Zakres (story / wymagania) | REJ‑…, R‑nn, NFR‑nn |
| Poza zakresem | |
| Środowisko | lokalne (`aspire run`), CI (GitHub Actions, ubuntu), demo <adres> |
| Dane testowe | seedy meczów, talie startowe |
| Role | autor testów, recenzent, PO (odbiór) |
| Harmonogram | <kiedy pisane, kiedy uruchamiane> |
| Ryzyka | |

## Przypadki testowe

| ID | Wymaganie | Scenariusz (GIVEN/WHEN/THEN) | Poziom | Automatyczny? | Test / plik |
|---|---|---|---|---|---|
| TC-N-01 | R‑33 | GIVEN … WHEN … THEN … | jednostkowy | tak | `CombatRulesTests.R33_…` |

## Kryteria wejścia i wyjścia

- **Wejście:** story ma kryteria akceptacji; zmiana OpenSpec zaakceptowana; środowisko działa.
- **Wyjście:** wszystkie przypadki automatyczne zielone w CI; brak błędów P0/P1; raport 5.3 opublikowany.
