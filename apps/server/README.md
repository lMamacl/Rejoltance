# apps/server — serwer gry

**Po co:** jedyny sędzia meczu (konstytucja, art. V). Node.js 24, Fastify i Socket.IO; pliki `.ts` uruchamia bezpośrednio Node.

- **REST:** `GET /health`, `/api/info`, `/api/cards` (publiczne dane kart), `/api/decks` (talie startowe);
- **Socket.IO:** `startSandbox`, `sendIntent` (odpowiedź przez potwierdzenie `{ ok, value | error }`) i `matchUpdated` (widok + zdarzenia);
- `src/app.ts` — `buildServer()` bez nasłuchu, wygodne w testach; `src/main.ts` — start na `PORT` (domyślnie 3000);
- `src/sessions.ts` — mecze w pamięci; tryb sandbox: twórca gra miejscem 0 (PvP to backlog E3).

Każda intencja przechodzi przez schemat zod z `@rejoltance/contracts`, zanim trafi do silnika. Uruchomienie: `npm run dev` (z klientem) albo `npm start`. Testy: `apps/server/test` (REST przez `inject`, mecz przez prawdziwe połączenie Socket.IO).
