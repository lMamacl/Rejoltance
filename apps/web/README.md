# apps/web — klient gry (React + TypeScript + Vite)

**Po co:** renderuje `MatchView` i wysyła `Intent`. Nie zna reguł gry.

**Struktura:**

- `src/net/` — jedyny kontakt z serwerem (`MatchTransport`, Socket.IO);
- `src/state/` — store Zustand (`createMatchStore(transport)`; w testach sztuczny transport);
- `src/components/` — komponenty widoku.

**Niezmienniki:**

- typy kontraktów importujesz tylko z `@rejoltance/contracts`; ESLint blokuje import silnika i katalogu kart (ADR-0015);
- legalność ruchu bierzesz z `view.legalActions` i `view.pending`, nie liczysz jej w kliencie;
- zero `innerHTML`.

**Komendy (z katalogu głównego repo):** `npm run dev` (serwer gry + ten klient), `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.

**Referencja wizualna:** `prototype/game` (wachlarz ręki, glosariusz, animacje).
