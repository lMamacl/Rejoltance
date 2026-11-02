# AGENTS.md — Punkt Wejścia dla Ludzi i Agentów AI (RE:JOLTANCE)

Ten plik jest odczytywany automatycznie przez wszystkie wspierane narzędzia AI (**Claude Code**, **GitHub Copilot**, **Cursor**, **Google Antigravity**, **Gemini CLI**, **OpenAI Codex**) oraz stanowi szybką mapę orientacyjną dla członków zespołu.

> **Pełny podręcznik inżynierii agentowej dla ludzi:** [`docs/04-system-agentow-ai/README.md`](docs/04-system-agentow-ai/README.md).
> **Konstytucja projektu (nadrzędne prawo):** [`.agents/rules/00-konstytucja.md`](.agents/rules/00-konstytucja.md).

---

## 1. Czym jest ten projekt i jak jest zbudowany?

**RE:JOLTANCE** to sieciowa taktyczna gra karciana (*lane battler*: 4 linie walki, zasób Blood, talie po 30 kart), budowana przez 6-osobowy zespół w procesie **Spec-Driven Development (SDD)**.

| Warstwa | Katalog | Kluczowe niezmienniki architektoniczne |
|---|---|---|
| **Kontrakty (DTO)** | `src/Rejoltance.Contracts` ↔ `src/web/src/contracts` | 5 zamrożonych typów (`Intent`, `LegalAction`, `PendingInteraction`, `MatchView`, `DomainEvent`). Zmiana wymaga **ADR** i aktualizacji testów próbek JSON (`ContractSampleTests`). |
| **Katalog kart** | `src/Rejoltance.Content` | Dane 69 kart w `cards.json` generowane z `prototype/revibance/cards.js` (`tools/content/extract_cards.py`). Brak logiki gry. |
| **Silnik reguł (Kernel)** | `src/Rejoltance.Kernel` | Czysty C# (`.NET 10`), zero I/O, zero zegara systemowego, zero `System.Random`. Wyłącznie deterministyczny `SeededRng`. |
| **Serwer autorytatywny** | `src/Rejoltance.Server` | ASP.NET Core + SignalR (`/api/hubs/match`). Waliduje intencje przez `Kernel.LegalActions` i rozsyła spersonalizowany `MatchView` (*Fog of War* — `R-80…R-82`). |
| **Klient webowy** | `src/web` | React 19 + TypeScript 5 + Vite. Renderuje wyłącznie `MatchView` i wysyła `Intent`. Nie liczy obrażeń ani reguł gry. |
| **Specyfikacje SDD** | `openspec/specs/` | Żywe specyfikacje 55 reguł domenowych `R-nn` oraz 18 wymagań jakościowych `NFR-nn`. |
| **Dokumentacja 1:1 Confluence** | `docs/` | Zorganizowana wg taksonomii AltexSoft i cyklu SDD (`00-przewodnik-i-setup` .. `05-szablony`). |

---

## 2. Kolejność lektury przed rozpoczęciem zadania

1. **Konstytucja i reguły strażnicze:** [`.agents/rules/00-konstytucja.md`](.agents/rules/00-konstytucja.md) oraz właściwa reguła tematyczna z `.agents/rules/10..70-*.md`.
2. **Wymagania i architektura (AltexSoft Core):** [`PRD`](docs/01-dokumentacja-systemowa/01-prd-wymagania-produktu.md), [`SAD`](docs/01-dokumentacja-systemowa/05-sad-architektura-systemu.md) oraz [`Mapa kodu`](docs/01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md).
3. **Specyfikacja domeny zadania:** `openspec/specs/<domena>/spec.md` oraz [`Indeks reguł R-nn`](docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md).
4. **Kod docelowego modułu i jego `README.md`:** `src/<moduł>/README.md`.

> **Zasada ochrony okna kontekstowego:** Nie wczytuj naraz całego pliku `prototype/revibance/engine.js` (~3500 linii) ani pełnego `cards.json`. Wyszukuj konkretne funkcje przez `grep` lub korzystaj z wyekstrahowanych reguł w `openspec/specs/`.

---

## 3. Przepływ pracy Spec-Driven Development (SDD)

1. **Zadanie w Jirze i gałąź:** każde zadanie ma klucz `REJ-123` i gałąź `feature/REJ-123-krotki-opis` (albo `fix/`, `docs/`, `chore/`, `spike/`) od `develop` (skill: `rj-start-feature`).
2. **Specyfikacja przed kodem:**
   - Zadanie `≥ 3 SP`, nowa reguła `R-nn` lub zmiana kontraktu → propozycja zmiany w `openspec/changes/rej-123-opis/` (`/opsx:propose`) i akceptacja człowieka przed implementacją.
   - Zadanie `< 3 SP` z istniejącą specyfikacją → sprawdzenie scenariuszy `GIVEN/WHEN/THEN` w `openspec/specs/`.
3. **Test przed lub równolegle z kodem:** każda reguła `R-nn` posiada test nazwany `Rnn_<zachowanie>` (skill: `rj-add-rule-test`).
4. **Weryfikacja przed commitem:**

```bash
dotnet build -warnaserror
dotnet test
npm run check
python tools/agents/sync_agents.py --check
python tools/backlog/gen_jira_csv.py --check
```

---

## 4. Katalog 10 agentów AI i ich wbudowanych umiejętności

Kanon konfiguracji znajduje się w `.agents/` i jest synchronizowany skryptem `python tools/agents/sync_agents.py` do `.claude/`, `.github/` i `.gemini/` (Codex i Antigravity czytają `.agents/` bezpośrednio).

| Grupa tematyczna | Agent (`.agents/agents/`) | Rola | Wbudowane skille (`.agents/skills/`) |
|---|---|---|---|
| **A. Orkiestracja i SDD** | `rj-orchestrator` | Główny koordynator SDD: dobiera agentów, pilnuje bramek specyfikacji | `rj-start-feature`, `rj-spec-guardian`, `rj-pr-ready`, `rj-add-agent`, `rj-add-skill` |
| **A. Orkiestracja i SDD** | `rj-spec-analyst` | Analityk wymagań PRD, reguł `R-nn` i specyfikacji OpenSpec | `rj-spec-guardian`, `rj-start-feature`, `rj-oracle-diff` |
| **A. Orkiestracja i SDD** | `rj-architect` | Strażnik SAD, granic warstw, 5 kontraktów i decyzji ADR | `rj-write-adr`, `rj-spec-guardian`, `rj-pr-ready` |
| **B. Inżynieria Domeny** | `rj-rules-engineer` | Inżynier czystego silnika `Rejoltance.Kernel` (C#, determinizm) | `rj-add-rule-test`, `rj-oracle-diff`, `rj-pr-ready` |
| **B. Inżynieria Domeny** | `rj-card-author` | Twórca kart i efektów DSL w `Rejoltance.Content` | `rj-add-card`, `rj-add-rule-test`, `rj-oracle-diff` |
| **C. Inżynieria Aplikacji** | `rj-backend-engineer` | Inżynier `Rejoltance.Server` (SignalR, autoryzacja, Fog of War, baza) | `rj-pr-ready`, `rj-add-rule-test`, `rj-start-feature` |
| **C. Inżynieria Aplikacji** | `rj-frontend-engineer` | Inżynier klienta `src/web` (React/TS, widok stołu, animacje) | `rj-pr-ready`, `rj-start-feature` |
| **D. Jakość i Dokumentacja** | `rj-qa-verifier` | Niezależny audytor QA, testów `R-nn`, wyroczni i NFR | `rj-pr-ready`, `rj-oracle-diff`, `rj-add-rule-test`, `rj-spec-guardian` |
| **D. Jakość i Dokumentacja** | `rj-scrum-jira` | Asystent procesu Scrum, Product Backlogu (`backlog.toml`) i Jiry | `rj-backlog-to-jira`, `rj-daily-report`, `rj-sprint-report`, `rj-start-feature`, `rj-sync-confluence` |
| **D. Jakość i Dokumentacja** | `rj-docs-writer` | Redaktor dokumentacji technicznej (AltexSoft + Confluence 1:1) | `rj-sync-confluence`, `rj-write-adr`, `rj-spec-guardian` |

---

## 5. Granice autonomii agenta AI

- **Zawsze pytaj człowieka przed:** zmianą 5 zamrożonych kontraktów, modyfikacją reguły ze statusem `❓` w [`04-rozbieznosci-prototypu.md`](docs/01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md), dodaniem nowej zależności NuGet/npm, usunięciem testu lub operacją `git push` / `git reset`.
- **Nigdy (konstytucja, art. X):** nie merguj PR, nie pushuj do `main` ani `develop`, nie twórz tagów i wydań, nie czytaj ani nie przesyłaj sekretów (tokeny, hasła, `.env`). Merge robi człowiek.
- **Nigdy nie zgaduj po cichu:** jeśli wymaganie jest niejednoznaczne, wskaż brak i zaproponuj warianty wraz z ich konsekwencjami.
