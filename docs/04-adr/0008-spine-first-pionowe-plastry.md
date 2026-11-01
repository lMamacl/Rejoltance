# ADR-0008: Najpierw kręgosłup (spine), potem pionowe plastry

- **Status:** proposed (do akceptacji na spotkaniu startowym)
- **Data:** 2026-10-27
- **Powiązane:** konstytucja art. VII, backlog (fale W0–W3)

## Kontekst i problem

Sześć osób, sześć modułów. Praca warstwami („każdy robi swoją warstwę do tygodnia 8”) kończy się integracją, która nie działa,
bo kontrakty były zgadywane. `REJOLTANCE-ANALIZA.md`, część 6. [V]

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Warstwami | każdy niezależny | integracja na końcu | wysokie |
| **Spine + pionowe plastry** | błędy kontraktu wychodzą w tygodniu 1; każdy sprint ma demo | wymaga koordynacji | średnie |

## Decyzja

W kontekście 6 osób pracujących równolegle, wybieramy **kręgosłup end‑to‑end (kontrakty → Kernel → projekcja → hub → klient; jest od Sprintu 0)
i potem plastry pionowe — każda story kończy się czymś widocznym w przeglądarce** zamiast pracy warstwami, aby wykrywać błędy kontraktów, gdy są tanie,
akceptując, że UI na początku będzie surowe, a bez fake transportu i próbek kontraktu frontend czekałby na backend.

## Konsekwencje

### Pozytywne

- Sprint Review zawsze ma demo (wymóg EU4/EU5).
- Frontend pracuje na `match-view.sample.json` i fake transporcie, bez czekania na serwer.

### Negatywne / ryzyka

- Nikt nie może pracować > 3 dni w jednej warstwie bez integracji (art. VII) — pilnuje PO sprintu.
