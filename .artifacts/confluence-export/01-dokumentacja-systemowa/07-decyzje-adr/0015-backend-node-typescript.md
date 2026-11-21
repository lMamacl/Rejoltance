<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/07-decyzje-adr/0015-backend-node-typescript.md -->
# ADR-0015: Backend w Node.js i TypeScript zamiast .NET

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/07-decyzje-adr/0015-backend-node-typescript.md`) · **Kategoria dokumentacji:** Decyzja architektoniczna (ADR) · **Etap SDD:** Plan

- **Status:** zaakceptowana
- **Data:** 2026-11-21
- **Autorzy:** Gabriel Ostaszewski (z pomocą agenta AI)
- **Akceptacja:** 6 z 6 osób zespołu, 2026-11-21 (zmienia art. II–VII konstytucji, więc wymagała co najmniej 2 osób)
- **Powiązane:** [ADR-0001](0001-stos-technologiczny.md) (zastępuje część backendową), [ADR-0004](0004-kernel-od-nowa-deterministyczny.md), [ADR-0006](0006-serwer-autorytatywny-fog-of-war.md), [ADR-0010](0010-kontrakt-csharp-ts-przez-probke.md) (zastępuje), [ADR-0013](0013-kanon-regul-rejoltance-prototype.md), `.agents/rules/00-konstytucja.md`

## Kontekst i problem

ADR-0001 wybrał .NET 10 (ASP.NET Core, SignalR, Aspire) na backend i React/TypeScript na klienta, licząc na znajomość C# w zespole. Po miesiącu: [V]

- **Kanon zasad gry jest w JavaScripcie** (ADR-0013). Silnik prototypu ma ok. 3,4 tys. linii i dalej się rozwija. W C# każdą regułę trzeba było przetłumaczyć, a porównanie z prototypem (wyrocznia) wymagało mostu między językami.
- **Kod C# był mały:** ok. 1,1 tys. linii w modułach i 640 linii testów, głównie szkielet i setup meczu. Zmiana była tania teraz, a z każdym sprintem drożałaby.
- **Dwa języki kosztowały na co dzień:** ręczne lustro kontraktów C# ↔ TS sprawdzane jedną próbką JSON (`Intent` i `DomainEvent` nie były sprawdzane wcale), trzy środowiska (dotnet, node, python), luka w Aspire, która zatrzymała CI, oraz Smart App Control w Windows, który blokował świeżo zbudowane DLL.
- Zespół zna C# z projektu w Godot, ale nie na poziomie serwera z SignalR i Aspire. [Z] Klient i tak jest w TypeScript.

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Zostać przy .NET | znany język, gotowy szkielet | tłumaczenie reguł z JS, lustro kontraktów, 3 środowiska | rośnie z każdą regułą |
| **Node.js 24 + TypeScript w całym repo (npm workspaces)** | jeden język, wspólne typy, silnik obok wyroczni, Node uruchamia `.ts` bez kompilacji | determinizm wymaga dyscypliny (pilnuje ESLint), nauka backendu w TS | jednorazowy port ok. 1,7 tys. linii |
| Silnik prototypu bez zmian na serwerze | najmniej pracy | brak testów, zależność od stanu globalnego, mieszanie UI z regułami | dług techniczny |

## Decyzja

W kontekście gry, której kanon zasad jest w JS, wybieramy **TypeScript na Node.js 24 w całym repozytorium** zamiast backendu .NET, aby silnik, serwer i klient dzieliły jeden język i jedne typy, akceptując jednorazowy port kodu i konieczność pilnowania determinizmu regułami lintera.

Układ (npm workspaces):

| Pakiet | Rola | Może importować |
|---|---|---|
| `packages/contracts` | 5 kontraktów, protokół Socket.IO, schemat zod dla `Intent` | — |
| `packages/content` | `data/cards.json`, `data/decks.json`, słownik DSL, walidator | — |
| `packages/engine` | czysty, deterministyczny silnik (RNG SplitMix64 na BigInt, projekcja *Fog of War*) | contracts, content |
| `apps/server` | Fastify (REST: `/health`, `/api/info`, `/api/cards`, `/api/decks`) + Socket.IO (`startSandbox`, `sendIntent`, `matchUpdated`) | contracts, content, engine |
| `apps/web` | React + Vite, transport Socket.IO | contracts |

- Granice i determinizm wymusza ESLint (`no-restricted-imports`, zakaz `Date`, `Math.random`, timerów i `node:*` w silniku) oraz test `tools/architecture.test.ts`.
- Serwer sprawdza każdą intencję schematem zod, zanim trafi do silnika.
- Port jest wierny: próbka `MatchView` wygenerowana przez nowy silnik jest identyczna z próbką z C# (ten sam RNG, ta sama projekcja). Wszystkie testy C# mają odpowiedniki w Vitest.
- Baza danych zostaje zgodnie z ADR-0007 (SQLite, potem PostgreSQL); szkielet C# zapisywał tylko pustą tabelę, więc w Node dodamy ją razem z pierwszą funkcją, która jej potrzebuje.

## Konsekwencje

### Pozytywne

- Jedno polecenie do uruchomienia (`npm run dev`) i jedno do sprawdzenia (`npm run verify`); znika .NET SDK i Aspire.
- Zmiana kontraktu to błąd kompilacji po obu stronach w tym samym PR.
- Testy różnicowe z prototypem mogą uruchamiać oba silniki w jednym procesie.

### Negatywne / ryzyka

- Zespół uczy się backendu w TS; brak Aspire i jego panelu telemetrii.
- Determinizm nie wynika już z typów .NET, tylko z reguł lintera i testu R-83.

### Do zrobienia

- [x] Port kontraktów, katalogu kart, silnika i serwera z testami; CI bez .NET.
- [x] Konstytucja v2.1 (art. II–VII), reguły i skille agentów.
- [ ] Dokumentacja systemowa pod nowy stos (SAD, stos technologiczny, mapa kodu, kontrakty i API, szybki start) — osobny PR.
- [ ] Skrypty w `tools/` przepisane na TypeScript, wspólne wejście `npm run …` — osobny PR.
