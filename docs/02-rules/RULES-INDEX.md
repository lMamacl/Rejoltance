# RULES-INDEX — reguły gry R‑nn

Każda reguła: numer, opis, źródło w prototypie (kanon, ADR-0005), test, status.
Testy nazywają się od numeru (`R04_…`) — `dotnet test --filter "FullyQualifiedName~R04"`.

> Stan: Sprint 0. Pełna lista reguł (fazy, walka, słowa kluczowe, efekty) powstaje w Fazie 3 / E1.
> Numeracja poniżej jest wstępna i może zostać przenumerowana przy pełnym spisie.

| ID | Reguła | Źródło (`prototype/revibance/engine.js`) | Test | Status |
|---|---|---|---|---|
| R-01 | Start: 20 HP, każdy dobiera 4 karty przed mulliganem | `newGame` | `SetupRulesTests.R01_*` | ✅ |
| R-02 | Mulligan: wymiana dowolnej liczby kart; zamienniki dobrane, odrzucone wracają do talii, talia tasowana | `mulligan` | `SetupRulesTests.R02_*` | ✅ |
| R-03 | Max Blood = numer rundy, maks. 10; odnawiane co rundę | `startRound` | `SetupRulesTests.R03_*` | ✅ (tylko formuła) |
| R-04 | Pusta talia: obrażenia 1, 2, 3…; bez tasowania odrzuconych | `draw` | `SetupRulesTests.R04_*` | ✅ |
| R-05 | Ręka maks. 8; nadmiarowa karta idzie na stos odrzuconych | `draw` | `SetupRulesTests.R05_*` | ✅ |
| R-06 | Fog of war: przeciwnik widzi tylko liczbę kart w ręce/talii | (prototyp łamał — wyciek przez `uid`) | `ProjectionTests.R06_*` | ✅ |
