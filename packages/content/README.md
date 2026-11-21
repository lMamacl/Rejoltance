# packages/content — katalog kart

**Po co:** karty jako dane (konstytucja, art. III). 130 kart kolekcjonerskich, 29 tokenów i 4 talie startowe.

- `data/cards.json`, `data/decks.json` — **generowane** z `prototype/game/cards.js` i `decks.js`: `npm run cards` (CI sprawdza `--check`);
- `src/vocabulary.ts` — wszystkie słowa DSL (wyzwalacze, akcje, cele, słowa kluczowe, warunki, strefy);
- `src/validator.ts` — `validateCard`, `validateDeck` (R-01: 30 kart, maks. 3 kopie, bez tokenów);
- `src/catalog.ts` — `loadCatalog()` wczytuje dane i odrzuca karty z nieznanymi słowami (fail loud, R-68).

**Zasady:** bez logiki gry i bez I/O. Kart nie edytujemy tutaj, tylko w repo prototypu (ADR-0013). Testy: `packages/content/test`.
