# card-effects Specification

## Purpose

Interpreter efektów kart (DSL): wyzwalacz → strefa → warunek → akcje. Dane: `src/Rejoltance.Content/Data/cards.json`, słownik: `Vocabulary.cs`, kanon zachowania: `engine.js` (`fire`, `cond`, `tg`, `act`).

## Requirements

### Requirement: R-60 Struktura efektu

Efekt karty SHALL wykonać się, gdy zajdzie jego wyzwalacz, karta jest w odpowiedniej strefie (`Board` domyślnie, `Hand`) i spełniony jest warunek. Efekt z wyborem (`Choice`) MUST wykonać dokładnie jedną akcję wskazaną przez gracza; pozostałe efekty wykonują wszystkie akcje po kolei. Wyciszona jednostka MUST NOT wykonywać efektów.

#### Scenario: Wybór opcji

- **GIVEN** czar z dwiema opcjami („dobierz 2 z talii” / „dobierz 2 ze stosu odrzuconych”)
- **WHEN** gracz wybiera opcję 2
- **THEN** wykonuje się tylko dobranie ze stosu odrzuconych

### Requirement: R-61 Obrażenia i leczenie z efektów

`DealDamage` SHALL zadawać obrażenia efektem (z pancerzem i Marked, bez wyzwalaczy `OnDamaged*`/`OnKill`); `AmountFrom: SacrificedAttack` MUST brać atak ostatnio poświęconej jednostki, ograniczony `Min`/`Max`. `LoseHealth` SHALL odejmować HP z pominięciem pancerza i Marked. `Heal` MUST NOT przekraczać 20 HP bohatera ani max HP jednostki; `HealToFull` przywraca max HP jednostki.

#### Scenario: Leczenie bohatera

- **GIVEN** bohater ma 18 HP
- **WHEN** efekt leczy go o 5
- **THEN** ma 20 HP

### Requirement: R-62 Modyfikacje statystyk

`BuffStats` (na planszy) SHALL zmieniać atak i HP oraz max HP celów, z atakiem nie mniejszym niż 0. `ModifyGlobalBuff` SHALL zmienić stały bonus gracza, stosowany do obecnych i przyszłych jednostek. `AbsorbStats` SHALL dodać źródłu atak i HP poświęconej jednostki.

#### Scenario: Ujemny buff ataku

- **GIVEN** jednostka z atakiem 1
- **WHEN** otrzymuje −3 ataku
- **THEN** ma atak 0

### Requirement: R-63 Karty i strefy

`DrawCard` SHALL dobierać według R-13/R-14. `DrawFromDiscard` SHALL brać karty od najnowszej, bez wyzwalaczy dobrania, do limitu ręki. `TutorCard` SHALL przenieść wybraną kartę z talii (domyślnie najdroższą) do ręki, a potem przetasować talię. `AddCardToHand` dodaje kartę, jeśli ręka nie jest pełna. `ShuffleDeck` tasuje talię. `GiveToOpponent` — R-22. Każde losowanie MUST używać RNG meczu.

#### Scenario: Tutor bez wyboru

- **GIVEN** talia z kartami o kosztach 1, 4 i 2, gracz nie wskazał karty
- **WHEN** wykonuje się `TutorCard`
- **THEN** do ręki trafia karta za 4

### Requirement: R-64 Plansza

`MakeAUnit` SHALL stawiać token: z `AdjacentLanes` — na wszystkich wolnych sąsiednich liniach; bez niego — na pierwszej wolnej linii, preferując linie bez wroga naprzeciw. `MoveRight` przesuwa jednostkę o linię w prawo, jeśli slot jest wolny. `DestroyUnit` ustawia HP na 0 (SoulGuard/Unkillable działają). `ReturnToHand` — R-53.

#### Scenario: Ruch w prawo na zajęty slot

- **GIVEN** jednostka w linii 1, linia 2 zajęta
- **WHEN** wykonuje się `MoveRight`
- **THEN** jednostka zostaje w linii 1

### Requirement: R-65 Zasób

`AddResource` SHALL dodać Blood, ale bieżące Blood MUST NOT przekroczyć 10.

#### Scenario: Limit Blood z efektu

- **GIVEN** gracz ma 9 Blood
- **WHEN** otrzymuje +2 Blood
- **THEN** ma 10 Blood

### Requirement: R-66 Warunki i wyzwalacze własne

Warunki `And`, `Or`, `Not`, `IsSelf`, `IsSubtype`, `IsStatus`, `IsEnemy`, `IsFriendly`, `HasSubtypeOnBoard` SHALL być oceniane względem kontekstu zdarzenia. Wyzwalacze `OnKill`, `OnDamagedEnemyUnit`, `OnDamagedEnemyHero` bez warunku MUST reagować tylko na działania samej jednostki.

#### Scenario: Warunek podtypu

- **GIVEN** efekt z warunkiem `IsSubtype: Machine` na `OnFriendlyUnitDied`
- **WHEN** ginie przyjazna jednostka typu Animal
- **THEN** efekt się nie wykonuje

### Requirement: R-67 Efekty pasywne

Efekty `Passive` (Tea Maid — tańsze własne akcje, Wyvern — droższe akcje przeciwnika, Survivalist — SoulGuard dla sojuszników) SHALL działać, dopóki jednostka jest na planszy i nie jest wyciszona, i MUST być zdefiniowane w danych karty, a nie przez identyfikatory w kodzie.

#### Scenario: Wyciszony Wyvern

- **GIVEN** przeciwnik ma Wyvern, który zostaje wyciszony
- **WHEN** gracz liczy koszt akcji
- **THEN** koszt nie jest podwyższony

### Requirement: R-68 Fail loud

Katalog kart MUST zostać odrzucony przy ładowaniu, jeśli zawiera nieznany typ karty, wyzwalacz, akcję, cel, słowo kluczowe, warunek lub strefę. Wykonanie niezaimplementowanej akcji MUST zakończyć się błędem z nazwą akcji — nigdy cichym pominięciem ani losowym celem.

#### Scenario: Nieznana akcja

- **GIVEN** karta z akcją `Teleport`
- **WHEN** katalog jest ładowany
- **THEN** ładowanie kończy się błędem wskazującym kartę i akcję

### Requirement: R-69 Transform

`Transform` SHALL zamienić jednostkę w inną kartę w tym samym slocie: nowe statystyki i słowa kluczowe z karty docelowej plus globalny buff gracza, bez efektów zagrania i śmierci. Z `Partner` przemiana MUST nastąpić tylko wtedy, gdy partner jest na planszy po tej samej stronie — obie jednostki zmieniają się razem.

#### Scenario: Bliźniaki

- **GIVEN** na planszy są karty 61 i 62 tego samego gracza
- **WHEN** wykonuje się `Transform` z `Partner`
- **THEN** jednostki stają się kartami 907 i 908 w swoich slotach
