---
trigger: model_decision
description: "Granice pakietów (web -> contracts; server -> engine -> content -> contracts), czystość silnika i ochrona 5 zamrożonych kontraktów."
---

# 30. Architektura i ochrona kontraktów

> Pełny opis architektury: [`docs/01-dokumentacja-systemowa/05-sad-architektura-systemu.md`](../../docs/01-dokumentacja-systemowa/05-sad-architektura-systemu.md) oraz [ADR-0015](../../docs/01-dokumentacja-systemowa/07-decyzje-adr/0015-backend-node-typescript.md).

## 1. Kierunek zależności (npm workspaces)

```text
apps/web (React) ──(Socket.IO + REST, typy z contracts)──► apps/server (Fastify + Socket.IO)
     │                                                          │
     └──────────────► packages/contracts ◄── packages/content ◄── packages/engine
```

- **`packages/contracts`:** typy 5 kontraktów, protokół Socket.IO i schemat zod dla `Intent`. Nie importuje innych pakietów.
- **`packages/content`:** `data/cards.json`, `data/decks.json`, słownik DSL i walidator. Nie importuje silnika, serwera ani modułów `node:*`.
- **`packages/engine`:** czysty silnik: `createEngine(catalog)`, `reduce`, `legalActions`, `toView`. **Zakaz:** `Date`, `Math.random`, timerów, `fetch`, `crypto` i modułów `node:*`. Losowość tylko przez `rng.ts`.
- **`apps/server`:** REST (`/health`, `/api/*`), Socket.IO (`startSandbox`, `sendIntent`, `matchUpdated`), sesje meczów. Waliduje `Intent` schematem zod przed silnikiem.
- **`apps/web`:** renderuje wyłącznie `MatchView` i wysyła `Intent`. Importuje tylko `@rejoltance/contracts`.

Granice sprawdza ESLint (`no-restricted-imports`, `no-restricted-globals` w `eslint.config.js`) oraz test `tools/architecture.test.ts`.

## 2. Pięć zamrożonych kontraktów

1. `Intent` — intencja gracza (klient → serwer), schemat zod.
2. `LegalAction` — dozwolona akcja wyliczona przez silnik.
3. `PendingInteraction` — silnik czeka na wybór celu lub opcji.
4. `MatchView` — widok meczu dla jednego gracza (*Fog of War*, `R-80…R-82`).
5. `DomainEvent` — fakt wyemitowany przy rozstrzyganiu intencji (animacje, dziennik).

Zmiana tych typów wymaga: (1) nowego **ADR**, (2) zmiany w `packages/contracts` (serwer i klient dostają ją automatycznie, `tsc` pokaże miejsca do poprawy) oraz (3) odświeżenia próbki `UPDATE_CONTRACT_SAMPLES=1 npm test`.
