# src/web — klient gry (React + TypeScript + Vite)

**Po co:** renderuje `MatchView`, wysyła `Intent`. Nie zna reguł gry.

**Struktura:**

- `src/contracts/` — typy TS (mirror C#) + `match-view.sample.json` (generowany przez testy C#) + test kontraktu;
- `src/net/` — jedyny kontakt z serwerem (`MatchTransport`, SignalR);
- `src/state/` — store Zustand (`createMatchStore(transport)` — w testach fake transport);
- `src/components/` — komponenty widoku.

**Niezmienniki:** legalność ruchu z `view.legalActions`/`view.pending`; zero `innerHTML`; kontrakt zmieniany razem z C#.

**Komendy:** `npm run dev` (zwykle uruchamia go Aspire), `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.
Bez Aspire: `SERVER_HTTP=http://localhost:5000 npm run dev`.

**Referencja wizualna:** `prototype/revibance` (wachlarz ręki, glosariusz, animacje).

**Właściciel:** epik E4 (do przydzielenia).
