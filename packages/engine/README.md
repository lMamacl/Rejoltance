# packages/engine — silnik reguł

**Po co:** czysty, deterministyczny silnik gry (konstytucja, art. II): `reduce(stan, miejsce, intencja) → (nowy stan, zdarzenia)`.

- `src/engine.ts` — `createEngine(catalog)`: `newMatch`, `reduce`, `legalActions`; dziś setup meczu, mulligan, wybór kolejności i start rundy, dobieranie, zmęczenie, poddanie (R-02, R-03, R-04, R-10, R-11, R-13, R-14, R-70, R-72);
- `src/rng.ts` — RNG SplitMix64 na BigInt; jedyne źródło losowości;
- `src/state.ts` — niemutowalny stan meczu i stałe reguł (`GameRules`);
- `src/projection.ts` — `toView` i `toViewerEvents`: widok dla jednego gracza bez ukrytych informacji (R-80…R-82).

**Zasady:** zero `Date`, `Math.random`, timerów, `fetch` i modułów `node:*` (pilnuje ESLint). Niezaimplementowane reguły rzucają `NotImplementedError`. Testy `Rnn_…` w `packages/engine/test` (`npm test`).
