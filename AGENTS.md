# AGENTS.md — Punkt Wejścia dla Ludzi i Agentów AI (RE:JOLTANCE)

Ten plik jest odczytywany automatycznie przez narzędzia AI, z których korzysta zespół (**Claude Code** przez `CLAUDE.md`, **Codex**, **Cursor**, **Antigravity**) oraz stanowi szybką mapę orientacyjną dla członków zespołu.

> **Pełny podręcznik inżynierii agentowej dla ludzi:** [`docs/04-system-agentow-ai/README.md`](docs/04-system-agentow-ai/README.md).
> **Konstytucja projektu (nadrzędne prawo):** [`.agents/rules/00-konstytucja.md`](.agents/rules/00-konstytucja.md).

---

## 1. Czym jest ten projekt i jak jest zbudowany?

**RE:JOLTANCE** to sieciowa taktyczna gra karciana (*lane battler*: 4 linie walki, zasób Blood, talie po 30 kart), budowana przez 6-osobowy zespół w procesie **Spec-Driven Development (SDD)**.

| Warstwa | Katalog | Kluczowe niezmienniki architektoniczne |
|---|---|---|
| **Kontrakty** | `packages/contracts` | 5 zamrożonych typów (`Intent`, `LegalAction`, `PendingInteraction`, `MatchView`, `DomainEvent`) i protokół Socket.IO, wspólne dla serwera i klienta. `Intent` ma schemat zod. Zmiana wymaga **ADR** i odświeżenia próbki `samples/match-view.sample.json`. |
| **Katalog kart** | `packages/content` | Dane 130 kart i 29 tokenów w `data/cards.json` generowane z `prototype/game/cards.js` (`tools/content/extract_cards.py`), słownik DSL i walidator. Brak logiki gry. |
| **Silnik reguł** | `packages/engine` | Czysty TypeScript: zero I/O, zegara i `Math.random()` (pilnuje ESLint). Losowość tylko przez deterministyczny RNG (`rng.ts`). |
| **Serwer autorytatywny** | `apps/server` | Node.js 24 + Fastify (REST) + Socket.IO. Sprawdza intencje schematem zod i `engine.legalActions`, rozsyła `MatchView` każdemu graczowi osobno (*Fog of War* — `R-80…R-82`). |
| **Klient webowy** | `apps/web` | React 19 + TypeScript + Vite. Renderuje wyłącznie `MatchView` i wysyła `Intent`. Importuje tylko `@rejoltance/contracts`. |
| **Specyfikacje SDD** | `openspec/specs/` | Żywe specyfikacje 55 reguł domenowych `R-nn` oraz 18 wymagań jakościowych `NFR-nn`. |
| **Dokumentacja 1:1 Confluence** | `docs/` | Zorganizowana wg taksonomii AltexSoft i cyklu SDD (`00-przewodnik-i-setup` .. `05-szablony`). |

---

## 2. Kolejność lektury przed rozpoczęciem zadania

1. **Konstytucja i reguły strażnicze:** [`.agents/rules/00-konstytucja.md`](.agents/rules/00-konstytucja.md) oraz właściwa reguła tematyczna z `.agents/rules/10..70-*.md`.
2. **Wymagania i architektura (AltexSoft Core):** [`PRD`](docs/01-dokumentacja-systemowa/01-prd-wymagania-produktu.md), [`SAD`](docs/01-dokumentacja-systemowa/05-sad-architektura-systemu.md) oraz [`Mapa kodu`](docs/01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md).
3. **Specyfikacja domeny zadania:** `openspec/specs/<domena>/spec.md` oraz [`Indeks reguł R-nn`](docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md).
4. **Kod docelowego modułu i jego `README.md`:** `packages/<pakiet>/README.md` albo `apps/<aplikacja>/README.md`.

> **Zasada ochrony okna kontekstowego:** Nie wczytuj naraz całego pliku `prototype/game/engine.js` (~3000 linii) ani pełnego `cards.json`. Wyszukuj konkretne funkcje przez `grep` lub korzystaj z wyekstrahowanych reguł w `openspec/specs/`.

---

## 3. Przepływ pracy Spec-Driven Development (SDD)

1. **Zadanie w Jirze i gałąź:** każde zadanie ma klucz `REJ-123` i gałąź `feature/REJ-123-krotki-opis` (albo `fix/`, `docs/`, `chore/`, `spike/`) od `develop` (skill: `rj-start-feature`).
2. **Specyfikacja przed kodem:**
   - Zadanie `≥ 3 SP`, nowa reguła `R-nn` lub zmiana kontraktu → propozycja zmiany w `openspec/changes/rej-123-opis/` (`/opsx:propose`) i akceptacja człowieka przed implementacją.
   - Zadanie `< 3 SP` z istniejącą specyfikacją → sprawdzenie scenariuszy `GIVEN/WHEN/THEN` w `openspec/specs/`.
3. **Test przed lub równolegle z kodem:** każda reguła `R-nn` posiada test nazwany `Rnn_<zachowanie>` (skill: `rj-add-rule-test`).
4. **Weryfikacja przed commitem:**

```bash
npm run verify     # lint (z granicami modułów), typecheck, testy, build
npm run check      # OpenSpec + markdownlint
python tools/agents/sync_agents.py --check
python tools/backlog/gen_jira_csv.py --check
```

---

## 4. Agenci AI i skille

Korzystamy z **Claude Code** oraz narzędzi, które czytają ten plik i `.agents/` bezpośrednio (**Codex**, **Cursor**, **Antigravity**) — ADR-0014.
Źródłem jest `.agents/`; adaptery dla Claude Code generuje `python tools/agents/sync_agents.py`.

- **Rola:** `rj-qa-verifier` — niezależny recenzent (tylko odczyt), uruchamia testy i raportuje niezgodności.
- **Skille zespołu:** `rj-start-feature`, `rj-spec-guardian`, `rj-add-rule-test`, `rj-add-card`, `rj-oracle-diff`, `rj-pr-ready`, `rj-write-adr`, `rj-backlog-to-jira`, `rj-sync-confluence` (opis: [`.agents/README.md`](.agents/README.md)).
- **OpenSpec:** `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, `/opsx:archive` (i pozostałe skille `openspec-*`).

---

## 5. Granice autonomii agenta AI

- **Zawsze pytaj człowieka przed:** zmianą 5 zamrożonych kontraktów, modyfikacją reguły ze statusem `❓` w [`04-rozbieznosci-prototypu.md`](docs/01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md), dodaniem nowej zależności npm, usunięciem testu lub operacją `git push` / `git reset`.
- **Nigdy (konstytucja, art. X):** nie merguj PR, nie pushuj do `main` ani `develop`, nie twórz tagów i wydań, nie czytaj ani nie przesyłaj sekretów (tokeny, hasła, `.env`). Merge robi człowiek.
- **Nigdy nie zgaduj po cichu:** jeśli wymaganie jest niejednoznaczne, wskaż brak i zaproponuj warianty wraz z ich konsekwencjami.
