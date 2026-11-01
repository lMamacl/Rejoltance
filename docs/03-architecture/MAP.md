# MAP — mapa projektu

Pierwszy plik do przeczytania (dla ludzi i dla czatu AI). Kolejność: **MAP → README modułu → AGENTS.md**.

## Warstwy i kierunek zależności

```text
┌──────────────────────────────────────────────────────────────────────┐
│ src/web (React + TS)      renderuje MatchView, wysyła Intent         │  nie zna reguł
└───────────────▲──────────────────────────────────┬───────────────────┘
                │ MatchView + DomainEvent          │ Intent
┌───────────────┴──────────────────────────────────▼───────────────────┐
│ Rejoltance.Server         SignalR /api/hubs/match, REST /api/*,      │
│                           MatchSessionManager (sesje w pamięci),     │
│                           RejoltanceDb (SQLite → PostgreSQL)         │
├──────────────────────────────────────────────────────────────────────┤
│ Rejoltance.Kernel         MatchEngine.Reduce / LegalActions,         │  czysty,
│                           Projection.ToView (fog of war), SeededRng  │  deterministyczny
├──────────────────────────────────────────────────────────────────────┤
│ Rejoltance.Content        karty jako dane (cards.json) + walidacja   │
├──────────────────────────────────────────────────────────────────────┤
│ Rejoltance.Contracts      5 kontraktów — zero logiki                 │
└──────────────────────────────────────────────────────────────────────┘
  Rejoltance.AppHost (Aspire) uruchamia Server + web; ServiceDefaults = telemetria, health.
```

Strzałki idą tylko w dół. Pilnuje tego `tests/Rejoltance.Architecture.Tests` (czerwony build przy złamaniu).

## Pięć kontraktów (`src/Rejoltance.Contracts`, mirror TS: `src/web/src/contracts`)

| Kontrakt | Kto tworzy | Kto używa | Uwagi |
|---|---|---|---|
| `Intent` | klient, bot | Server → Kernel | jedyne wejście do gry; JSON z polem `type` |
| `LegalAction` | `MatchEngine.LegalActions` | UI (podświetlanie), Server (walidacja), bot | jedno źródło legalności |
| `PendingInteraction` | Kernel | UI, bot | silnik pyta zamiast czekać (mulligan, cel) |
| `MatchView` | `Projection.ToView` | klient | ręka przeciwnika = tylko liczba |
| `DomainEvent` | Kernel | Projection → klient | animacje z faktów, nie z porównywania stanów |

## Gdzie co dodać

| Chcę… | Gdzie | Ryzyko | Skill |
|---|---|---|---|
| dodać / zmienić kartę | `prototype/revibance/cards.js` → `tools/content/extract_cards.py` | niskie | `rj-add-card` |
| dodać słowo DSL (akcja, trigger) | `Content/Vocabulary.cs` + handler w Kernelu + test | średnie | `rj-add-rule-test` |
| zaimplementować regułę | `Kernel/MatchEngine.cs` (+ nowe pliki w Kernelu) + test `Rnn_…` | średnie | `rj-add-rule-test` |
| dodać pole do widoku | `Contracts` + `Projection.cs` + `src/web/src/contracts` (jeden PR) | **wysokie** (kontrakt) | `rj-write-adr` |
| dodać metodę huba / endpoint | `Server/Matches/MatchHub.cs`, `Server/Program.cs` | średnie | — |
| dodać ekran / komponent | `src/web/src/components/` | niskie | — |
| dodać tabelę w bazie | `Server/Data/RejoltanceDb.cs` + migracja EF | średnie | — |
| zmienić proces / zasady | `docs/04-adr/` (+ `.agents/rules/`) | wysokie | `rj-write-adr` |

## Przepływ jednego ruchu

```text
klik w UI → store.send(Intent) → SignalR SendIntent(matchId, intent)
  → MatchSessionManager (semafor per mecz) → MatchEngine.Reduce(state, seat, intent)
  → (nowy MatchState, DomainEvent[]) → Projection.ToView(state, seat) → klient renderuje MatchView
```

## Stan szkieletu (Sprint 0)

| Element | Stan |
|---|---|
| Start meczu, dobieranie, mulligan, fatigue, pełna ręka, poddanie, fog of war | [V] zaimplementowane + testy (R-02, R-03, R-13, R-14, R-70, R-72, R-80, R-83) |
| Fazy rundy, zagrywanie kart, walka, efekty kart | **nie** — `NotImplementedException` (backlog E1/E2) |
| Sandbox w przeglądarce przez SignalR | [V] start meczu + mulligan |
| PvP (dwa miejsca), bot, konta, talie | backlog E3/E5/E6 |
