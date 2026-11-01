# RULES-INDEX — reguły gry R‑nn

Każda reguła ma: numer, wymaganie ze scenariuszami w `openspec/specs/<obszar>/spec.md`, źródło w prototypie (kanon, ADR-0005),
test o nazwie zaczynającej się od numeru (`R14_…`) i story w backlogu. Test jednej reguły: `dotnet test --filter "FullyQualifiedName~R14"`.

Numeracja ma luki celowo: nowa reguła dostaje wolny numer w swoim obszarze (np. R-16), istniejących nie przenumerowujemy.

Legenda statusu: ✅ zaimplementowane i przetestowane · 🟡 częściowo · ⏳ w backlogu · ❓ czeka na decyzję (`ROZBIEZNOSCI.md`).

## R-0x Przygotowanie meczu — `openspec/specs/match-setup`

| ID | Reguła | Źródło `engine.js` | Test | Story | Status |
|---|---|---|---|---|---|
| R-01 | Legalna talia: 30 kart, ≤ 3 kopie, bez tokenów | `ui.js` deck builder | `ContentTests.R01_*` | E6-S04 | ✅ walidacja |
| R-02 | Stan początkowy: 20 HP, 4 karty, bez wyzwalaczy | `newGame` | `SetupRulesTests.R02_*` | — | ✅ |
| R-03 | Mulligan: dowolna liczba, zamienniki z góry, odrzucone wracają, tasowanie | `mulligan` | `SetupRulesTests.R03_*` | — | ✅ ❓ D-02 |
| R-04 | Wybór kolejności; remis wyboru → losowanie z seeda | `decideStart` | — | E1-S01 | ⏳ |

## R-1x Przebieg rundy — `openspec/specs/round-flow`

| ID | Reguła | Źródło | Test | Story | Status |
|---|---|---|---|---|---|
| R-10 | Max Blood = min(10, runda), odnawiane; dobranie od rundy 2 | `startRound` | `SetupRulesTests.R10_*` | E1-S01 | 🟡 formuła |
| R-11 | Rozpoczynający naprzemiennie | `startRound` | — | E1-S01 | ⏳ |
| R-12 | Kroki: jednostki (A) → mieszany (B) → akcje (A) → walka | `setStep`, `nextStep` | — | E1-S02 | ⏳ |
| R-13 | Ręka ≤ 8; nadmiar na stos odrzuconych; wyzwalacze dobrania | `draw` | `SetupRulesTests.R13_*` | E2-S04 | 🟡 bez wyzwalaczy |
| R-14 | Pusta talia: fatigue 1, 2, 3…; bez tasowania odrzuconych | `draw` | `SetupRulesTests.R14_*` | — | ✅ |
| R-15 | Koniec rundy: Burning `max(0, 1 − pancerz)`, śmierć, zwycięstwo | `endRound` | — | E1-S04 | ⏳ ❓ D-08 |

## R-2x Zagrywanie kart — `openspec/specs/playing-cards`

| ID | Reguła | Źródło | Test | Story | Status |
|---|---|---|---|---|---|
| R-20 | Tylko aktywny gracz, typ wg kroku, koszt ≤ Blood | `canPlay` | — | E1-S02 | ⏳ |
| R-21 | Jednostka na wolny slot; buff globalny; `OnPlayed` własne → nasłuchujące | `play`, `place` | — | E1-S02 | ⏳ |
| R-22 | Akcja: cele dostępne; potem odrzucone / ręka przeciwnika; `OnFriendlyActionPlayed` | `play` | — | E2-S02 | ⏳ |
| R-23 | Koszt: baza − Tea Maid + 6×Wyvern − obniżki, ≥ 0 | `cost` | — | E2-S06 | ⏳ ❓ D-11 |
| R-24 | Efekty z ręki: obniżka, bonus ataku, przywołanie z ręki | `fireHand` | — | E2-S06 | ⏳ |
| R-25 | Wybór celów + walidacja na serwerze | `picks`, `apicks`, `req` | — | E2-S02 | ⏳ ❓ D-05 |

## R-3x Walka — `openspec/specs/combat`

| ID | Reguła | Źródło | Test | Story | Status |
|---|---|---|---|---|---|
| R-30 | Linie 0→3; przed walką → uderzenia → kolejka → śmierć → po walce | `lane` | — | E1-S03 | ⏳ |
| R-31 | Przed walką: gracz 0, potem 1; cel przez `PendingInteraction` | `lane`, `preTargets` | — | E1-S08 | ⏳ ❓ D-10 |
| R-32 | Uderzenia jednoczesne; atak 0 nie uderza | `lane` | — | E1-S03 | ⏳ |
| R-33 | Ten sam status Flying → jednostka, inaczej bohater | `lane`, `strike` | — | E1-S03 | ⏳ ❓ D-07 |
| R-34 | Wyzwalacze z obrażeń w kolejce; tylko trafienia bezpośrednie | `dmg`, `later` | — | E1-S07 | ⏳ |
| R-35 | Bonus Attack: jednostronne uderzenie | `strike` | — | E1-S07 | ⏳ |

## R-4x Słowa kluczowe — `openspec/specs/keywords`

| ID | Reguła | Źródło | Test | Story | Status |
|---|---|---|---|---|---|
| R-40 | Armored(n) / Armor2: −n na trafienie, przed Marked | `dmg` | — | E1-S04 | ⏳ |
| R-41 | Marked: ×2 po pancerzu, nie dla Burning | `dmg` | — | E1-S04 | ⏳ |
| R-42 | Stunned: pomija najbliższe uderzenie, znika | `lane`, `strike` | — | E1-S04 | ⏳ |
| R-43 | Burning / BurnSource | `dmg`, `endRound` | — | E1-S04 | ⏳ ❓ D-09 |
| R-44 | SplashDamage(n): sąsiednie linie, nie przy Stunned | `splash` | — | E1-S04 | ⏳ |
| R-45 | Breakthrough: pełny atak w bohatera po trafieniu jednostki | `thru` | — | E1-S04 | ⏳ ❓ D-03 |
| R-46 | SoulGuard: raz, 1 HP; nie chroni przed Sacrifice; aura Survivalist | `resolve`, `aura` | — | E1-S05 | ⏳ |
| R-47 | Unkillable: efekty pośmiertne → ręka; pełna → odrzucone; token znika | `killUnit` | — | E1-S05 | ⏳ |
| R-48 | `ApplyStatus` → `OnStatusApplied` u pozostałych jednostek | `status` | — | E2-S03 | ⏳ |

## R-5x Śmierć i usuwanie — `openspec/specs/death-and-removal`

| ID | Reguła | Źródło | Test | Story | Status |
|---|---|---|---|---|---|
| R-50 | Rozstrzygnięcie śmierci, kolejność wyzwalaczy | `resolve`, `killUnit` | — | E1-S03 | ⏳ |
| R-51 | Sacrifice: `OnSacrificed` → zniszczenie → `OnOtherUnitSacrificed` | `sacrifice` | — | E1-S05 | ⏳ |
| R-52 | Silence: czyści słowa, statusy, modyfikacje, wyłącza zdolności | `act` Silence | — | E1-S06 | ⏳ |
| R-53 | Powrót do ręki jako nowa karta | `act` ReturnToHand | — | E1-S06 | ⏳ ❓ D-04 |
| R-54 | Jawny limit reakcji łańcuchowych, błąd z diagnostyką | `resolve` (30) | — | E1-S05 | ⏳ |

## R-6x Efekty kart (DSL) — `openspec/specs/card-effects`

| ID | Reguła | Źródło | Test | Story | Status |
|---|---|---|---|---|---|
| R-60 | Wyzwalacz → strefa → warunek → akcje; `Choice` = jedna akcja | `fire` | — | E2-S01 | ⏳ |
| R-61 | DealDamage / LoseHealth / Heal / HealToFull | `act` | — | E2-S03 | ⏳ |
| R-62 | BuffStats / ModifyGlobalBuff / AbsorbStats | `act` | — | E2-S03 | ⏳ |
| R-63 | DrawCard / DrawFromDiscard / TutorCard / AddCardToHand / ShuffleDeck | `act` | — | E2-S04 | ⏳ |
| R-64 | MakeAUnit / MoveRight / DestroyUnit / ReturnToHand | `act` | — | E2-S08 | ⏳ |
| R-65 | AddResource ≤ 10 | `act` | — | E2-S04 | ⏳ |
| R-66 | Warunki; wyzwalacze własne bez warunku | `cond`, `fire` | — | E2-S01 | ⏳ |
| R-67 | Pasywne (Tea Maid, Wyvern, Survivalist) w danych | `cost`, `aura` | — | E2-S07 | ⏳ ❓ D-11 |
| R-68 | Fail loud: nieznane słowo DSL / niezaimplementowana akcja | `tg` (`return []`) | `ContentTests.R68_*`, `SetupRulesTests.R68_*` | E2-S01 | 🟡 ładowanie |
| R-69 | Transform (z Partner) | `transformUnit` | — | E2-S08 | ⏳ |

## R-7x Koniec meczu — `openspec/specs/match-end`

| ID | Reguła | Źródło | Test | Story | Status |
|---|---|---|---|---|---|
| R-70 | HP ≤ 0 → przegrana, natychmiast, bez limitu rund | `chk` | `SetupRulesTests.R70_*` | E1-S03 | 🟡 fatigue |
| R-71 | Jednoczesna śmierć bohaterów = remis | `chk` | — | E1-S03 | 🟡 ❓ D-01 |
| R-72 | Poddanie się | UI | `SetupRulesTests.R72_*` | — | ✅ |
| R-73 | Rozłączenie: 60 s na powrót, potem walkower | `net.js` (brak) | — | E3-S05 | ⏳ |

## R-8x Autorytet serwera — `openspec/specs/server-authority`

| ID | Reguła | Źródło | Test | Story | Status |
|---|---|---|---|---|---|
| R-80 | Fog of war: ręka i talia przeciwnika tylko jako liczby | (prototyp łamie) | `ProjectionTests.R80_*` | — | ✅ |
| R-81 | Identyfikatory instancji nie zdradzają kolejności talii | (prototyp łamie) | — (konstrukcja `Draw`) | E3-S02 | 🟡 |
| R-82 | Walidacja intencji i miejsca; sekwencyjnie per mecz | — | `ServerTests` (częściowo) | E3-S02 | 🟡 |
| R-83 | Determinizm: seed + intencje = ten sam stan | (prototyp: `Math.random`) | `DeterminismTests.R83_*` | E5-S02 | ✅ |
| R-84 | Decyzje przez `PendingInteraction`, bez losowania | (prototyp: `botPick`) | `ProjectionTests.R84_*` | E1-S08 | 🟡 mulligan |
