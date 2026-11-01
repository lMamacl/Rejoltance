# Rejoltance.Kernel — silnik reguł

**Po co:** jedyne miejsce, gdzie żyją zasady gry. `reduce(state, seat, intent) → (state, events)`.

**Publiczne API:** `MatchEngine.NewMatch`, `MatchEngine.Reduce`, `MatchEngine.LegalActions`, `Projection.ToView`, `Projection.ToViewerEvents`, `SeededRng`, `MatchState`, `GameRules`.

**Niezmienniki:**

- deterministyczny: ten sam seed + te same intencje = ten sam stan (test `DeterminismTests`);
- bez IO, zegara, `System.Random`, ASP.NET, EF (build + `BoundaryTests`);
- stan niemutowalny (`record` + `with`); nieznane/niezaimplementowane → wyjątek;
- instancje kart dostają `InstanceId` dopiero przy wyjściu z talii (brak wycieku kolejności talii).

**Czego tu NIE ma:** sieci, sesji, bazy, logiki UI, bota (będzie w osobnym module `Sim`).

**Jak testować:** `dotnet test tests/Rejoltance.Kernel.Tests` · nazwy testów reguł: `Rnn_…` ([RULES-INDEX](../../docs/02-rules/RULES-INDEX.md)).

**Właściciel:** epik E1 (do przydzielenia).
