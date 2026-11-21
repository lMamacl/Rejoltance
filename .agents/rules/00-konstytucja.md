---
trigger: always_on
description: "Konstytucja projektu RE:JOLTANCE (11 artykułów): specyfikacja przed kodem, deterministyczny silnik, zamrożone kontrakty, serwer autorytatywny, granice agentów AI i zasady języka."
---

# 00. Konstytucja Projektu RE:JOLTANCE

Wersja 2.1 · przyjęta 2026-11-21 przez cały zespół (ADR-0015: art. II–VII opisują stos Node.js/TypeScript) · wersja 2.0 z 2026-11-02 (ADR-0012).

To nadrzędne zasady pracy dla zespołu i wszystkich agentów AI. Gdy prompt, skill albo specyfikacja jest z nimi sprzeczna, wygrywa konstytucja. Agent zatrzymuje się wtedy i zgłasza konflikt człowiekowi. Zmiana artykułu wymaga zatwierdzonego **ADR** i akceptacji 2 osób z zespołu.

## Artykuł I — Specyfikacja przed kodem (Spec-Driven Development)

Zachowanie gry lub systemu najpierw zapisujemy w `openspec/specs/` (albo jako propozycję w `openspec/changes/`) ze scenariuszami `GIVEN / WHEN / THEN`. Każde wymaganie ma numer reguły `R-nn` lub `NFR-nn`. Dopiero potem powstaje kod produkcyjny. Kanonem zasad gry jest prototyp JS `prototype/game` (repo `PanCoto/rejoltance-prototype`, ADR-0013).

## Artykuł II — Czysty i deterministyczny silnik reguł (`packages/engine`)

`packages/engine` to czysty TypeScript, zależny tylko od `@rejoltance/contracts` i `@rejoltance/content`. Nie używa plików, zegara (`Date`), sieci, bazy danych, timerów ani `Math.random()` — pilnuje tego ESLint. Ten sam stan początkowy, ziarno RNG i lista intencji zawsze dają ten sam stan końcowy i te same zdarzenia `DomainEvent[]` (R-83).

## Artykuł III — Karty jako dane (`packages/content`)

Definicje kart są w `packages/content/data/cards.json`. Plik generuje `tools/content/extract-cards.ts` z prototypu, a sprawdza go walidator (`validateCard`). Nowa karta zbudowana z istniejących akcji efektów nie wymaga zmian w pętli silnika.

## Artykuł IV — Zamrożone kontrakty komunikacyjne (`packages/contracts`)

Serwer i klient rozmawiają przez 5 typów: `Intent`, `LegalAction`, `PendingInteraction`, `MatchView`, `DomainEvent`. Są zdefiniowane raz, w `packages/contracts`, i importują je obie strony; serwer sprawdza każdą intencję schematem zod. Zmiana któregokolwiek z nich wymaga nowego **ADR** (`docs/01-dokumentacja-systemowa/07-decyzje-adr/`) i trafia w jednym PR razem z odświeżeniem próbki `packages/contracts/samples/match-view.sample.json` (`UPDATE_CONTRACT_SAMPLES=1 npm test`).

## Artykuł V — Autorytatywny serwer i ochrona ukrytych informacji

Serwer (`apps/server`) jest jedynym sędzią meczu. Odrzuca każdą intencję spoza `engine.legalActions(state, seat)`. Każdy gracz dostaje tylko swoją projekcję `toView(…, seat)`: bez kart na ręce przeciwnika, kolejności talii i ziarna RNG (R-80…R-82).

## Artykuł VI — Jedna reguła `R-nn` = co najmniej jeden test automatyczny

Każda zaimplementowana reguła `R-nn` ma test o nazwie zaczynającej się od `Rnn_<opis_zachowania>` w `packages/engine/test` (testy kart i katalogu: `packages/content/test`). Kod bez testu nie spełnia *Definition of Done*. Nie wolno osłabiać ani usuwać testu tylko po to, żeby build przeszedł.

## Artykuł VII — Granice modułów wymuszane w CI

ESLint (`eslint.config.js`) i test `tools/architecture.test.ts` blokują niedozwolone importy między pakietami: `web → contracts`, `server → engine → content → contracts`. W każdym Pull Requeście muszą przejść: `npm run verify` (lint, typecheck, testy, build), `npm run check` i `npm run agents:check`.

## Artykuł VIII — Małe, śledzone przyrosty

Każda zmiana ma zadanie w Jirze (`REJ-123`). Powstaje na krótkiej gałęzi od `develop` (`typ/REJ-123-opis`), z commitami `REJ-123: …`. Zadanie dzielimy na podzadania o szacunku `≤ 4 h` (wymóg uczelniany EU4).

## Artykuł IX — Zakaz cichego zgadywania przez AI

Gdy wymaganie jest niejednoznaczne albo dotyczy otwartej pozycji w `docs/01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md`, agent AI nie zgaduje. Wskazuje niepewność i prosi człowieka o decyzję.

## Artykuł X — Człowiek decyduje i odpowiada

Każdy commit i Pull Request ma ludzkiego autora oraz recenzenta. Obaj rozumieją zmianę i odpowiadają za nią na przeglądzie sprintu.

Agent AI:

1. **nie** merguje PR, **nie** pushuje do `main` ani `develop`, **nie** tworzy tagów ani wydań;
2. **nie** czyta, nie zapisuje i nie przesyła sekretów (tokeny, hasła, `.env`);
3. **nie** zmienia konstytucji, zaakceptowanych ADR ani kontraktów bez wyraźnej zgody człowieka;
4. przed zmianą wielu plików przedstawia plan i czeka na akceptację;
5. raportuje uczciwie: co zrobił, jakie testy uruchomił i z jakim wynikiem, czego nie sprawdził.

## Artykuł XI — Język

Dokumentacja, specyfikacje i komunikacja zespołu są po polsku, z polskimi znakami. Kod, identyfikatory, komentarze w kodzie, commity i tytuły PR są po angielsku.
