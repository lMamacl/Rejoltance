# round-flow Specification

## Purpose

Przebieg rundy: Blood, dobieranie, kolejność kroków i koniec rundy. Kanon: `engine.js` (`startRound`, `setStep`, `nextStep`, `draw`, `endRound`).

## Requirements

### Requirement: R-10 Początek rundy i Blood

Na początku rundy numer rundy SHALL wzrosnąć o 1, max Blood każdego gracza MUST wynosić `min(10, runda)`, a bieżące Blood MUST zostać odnowione do maksimum (niewydane Blood się nie kumuluje). Od rundy 2 każdy gracz SHALL dobrać 1 kartę.

#### Scenario: Runda 3

- **GIVEN** koniec rundy 2, gracz ma 1 niewydane Blood
- **WHEN** zaczyna się runda 3
- **THEN** gracz ma 3/3 Blood i jedną kartę więcej w ręce (o ile ręka nie była pełna)

#### Scenario: Limit Blood

- **GIVEN** runda 14
- **WHEN** runda się zaczyna
- **THEN** max Blood wynosi 10

### Requirement: R-11 Gracz rozpoczynający

Gracz rozpoczynający rundę 1 SHALL wynikać z R-04; w każdej kolejnej rundzie rola MUST przechodzić na drugiego gracza.

#### Scenario: Naprzemienność

- **GIVEN** gracz 1 rozpoczął rundę 1
- **WHEN** zaczyna się runda 2
- **THEN** rozpoczyna gracz 0, a w rundzie 3 znów gracz 1

### Requirement: R-12 Kroki rundy

Runda SHALL składać się z kroków: (1) jednostek — aktywny gracz A, tylko karty jednostek; (2) mieszany — aktywny gracz B, jednostki i akcje; (3) akcji — aktywny gracz A, tylko akcje; (4) walka — automatyczna. Aktywny gracz MAY zakończyć swój krok w dowolnym momencie; tylko aktywny gracz MAY zagrywać karty.

#### Scenario: Akcja w kroku jednostek

- **GIVEN** krok jednostek, aktywny gracz A
- **WHEN** gracz A próbuje zagrać kartę akcji
- **THEN** intencja jest odrzucona, a `LegalActions` nie zawiera tej karty

#### Scenario: Zakończenie kroku akcji

- **GIVEN** krok akcji
- **WHEN** gracz A kończy krok
- **THEN** rozpoczyna się walka (R-30)

### Requirement: R-13 Dobieranie i pełna ręka

Ręka MUST mieścić najwyżej 8 kart. Karta dobrana przy pełnej ręce SHALL trafić na stos odrzuconych bez wyzwalaczy dobrania. Udane dobranie SHALL uruchomić `OnFriendlyCardDrawn` u jednostek właściciela i `OnOpponentCardDrawn` u jednostek przeciwnika.

#### Scenario: Pełna ręka

- **GIVEN** gracz ma 8 kart w ręce
- **WHEN** dobiera kartę
- **THEN** ręka ma 8 kart, a dobrana karta leży na stosie odrzuconych

### Requirement: R-14 Pusta talia (fatigue)

Próba dobrania z pustej talii MUST zadać właścicielowi obrażenia równe licznikowi prób (1, 2, 3…), wspólnemu dla wszystkich źródeł dobierania. Stos odrzuconych MUST NOT być tasowany do talii.

#### Scenario: Trzy próby

- **GIVEN** pusta talia, 20 HP
- **WHEN** gracz trzy razy próbuje dobrać
- **THEN** traci kolejno 1, 2 i 3 HP (zostaje 14 HP)

### Requirement: R-15 Koniec rundy

Po walce każda jednostka ze statusem Burning SHALL stracić `max(0, 1 − pancerz)` HP (bez wyzwalaczy obrażeń, bez podwojenia przez Marked); następnie rozstrzygana jest śmierć i warunek zwycięstwa, po czym zaczyna się kolejna runda.

#### Scenario: Płonąca jednostka

- **GIVEN** jednostka 2/2 z Burning, bez pancerza
- **WHEN** runda się kończy
- **THEN** jednostka ma 1 HP i nie uruchomiono żadnego wyzwalacza obrażeń
