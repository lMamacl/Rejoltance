# playing-cards Specification

## Purpose

Zagrywanie jednostek i akcji, koszt, efekty działające z ręki i wybór celów. Kanon: `engine.js` (`canPlay`, `play`, `cost`, `fireHand`, `picks`, `apicks`).

## Requirements

### Requirement: R-20 Warunki zagrania

Kartę MAY zagrać tylko aktywny gracz, jeśli typ karty jest dozwolony w bieżącym kroku (R-12) i jej koszt (R-23) nie przekracza jego Blood. Koszt SHALL zostać odjęty od Blood w chwili zagrania.

#### Scenario: Za mało Blood

- **GIVEN** gracz ma 2 Blood, karta kosztuje 3
- **WHEN** gracz próbuje ją zagrać
- **THEN** intencja jest odrzucona, a karta nie jest oznaczona jako grywalna w `LegalActions`

### Requirement: R-21 Zagranie jednostki

Jednostka MUST zostać postawiona na wolnym slocie własnej linii (0–3) i SHALL otrzymać bieżący globalny buff gracza. Następnie SHALL uruchomić się jej `OnPlayed`, a potem `OnPlayed` ze strefą `Board` innych przyjaznych jednostek (nasłuchujących).

#### Scenario: Zajęta linia

- **GIVEN** linia 2 gracza jest zajęta
- **WHEN** gracz zagrywa jednostkę na linię 2
- **THEN** intencja jest odrzucona

#### Scenario: Nasłuchujący sojusznik

- **GIVEN** na planszy jest jednostka reagująca na zagranie innej jednostki (OnPlayed, Zone Board)
- **WHEN** gracz zagrywa nową jednostkę
- **THEN** najpierw rozstrzyga się efekt nowej jednostki, potem efekt nasłuchującego sojusznika

### Requirement: R-22 Zagranie akcji

Akcję MAY zagrać tylko, gdy dla każdego wymaganego rodzaju celu istnieje co najmniej jeden kandydat. Po rozstrzygnięciu akcja SHALL trafić na stos odrzuconych właściciela, a z `GiveToOpponent` — do ręki przeciwnika (przy jego pełnej ręce na stos odrzuconych właściciela). Następnie SHALL uruchomić się `OnFriendlyActionPlayed` na planszy i w ręce gracza.

#### Scenario: Brak celu

- **GIVEN** akcja wymaga wrogiej jednostki, a przeciwnik nie ma jednostek
- **WHEN** gracz próbuje ją zagrać
- **THEN** intencja jest odrzucona

#### Scenario: Prezent dla przeciwnika

- **GIVEN** akcja z `GiveToOpponent`, przeciwnik ma 5 kart w ręce
- **WHEN** akcja się rozstrzygnie
- **THEN** karta trafia do ręki przeciwnika

### Requirement: R-23 Koszt karty

Koszt SHALL wynosić: koszt bazowy − (dla akcji) liczba własnych niewyciszonych Tea Maid (46) + (dla akcji) 6 × liczba niewyciszonych Wyvern (60) przeciwnika − obniżki zgromadzone na karcie w ręce. Koszt MUST być ≥ 0. Modyfikatory pasywne MUST docelowo wynikać z danych karty (`Passive`), nie z identyfikatorów w kodzie (ADR-0005, D-11).

#### Scenario: Tea Maid

- **GIVEN** gracz ma 2 Tea Maid, akcja kosztuje 3
- **WHEN** liczony jest koszt
- **THEN** koszt wynosi 1

#### Scenario: Wyvern przeciwnika

- **GIVEN** przeciwnik ma Wyvern, akcja kosztuje 1
- **WHEN** liczony jest koszt
- **THEN** koszt wynosi 7

### Requirement: R-24 Efekty działające z ręki

Efekty ze strefą `Hand` SHALL działać tylko, gdy karta jest w ręce: `BuffStats` z `Amount` zmienia obniżkę kosztu, z `BuffAtk` zwiększa bonus ataku; `SummonUnit` przywołuje kartę za darmo na pole zmarłej przyjaznej jednostki, jeśli jest wolne. Karta, która wróci do ręki z planszy, MUST być nową kartą bez wcześniejszych modyfikacji.

#### Scenario: Przywołanie z ręki

- **GIVEN** karta z `SummonUnit` (Hand) w ręce, ginie przyjazna jednostka na linii 1
- **WHEN** rozstrzyga się śmierć
- **THEN** karta pojawia się na linii 1 bez płacenia kosztu i uruchamia swoje `OnPlayed`

### Requirement: R-25 Wybór celów

Karta MUST deklarować wymagane wybory (wroga jednostka, przyjazna jednostka, dowolna jednostka, wroga jednostka lub bohater, jednostka do poświęcenia, wiele jednostek do poświęcenia, karta z talii, opcja). Serwer MUST sprawdzić, że każdy wskazany cel należy do dozwolonego zbioru, zanim zmieni stan.

#### Scenario: Poświęcenie cudzej jednostki

- **GIVEN** karta wymaga poświęcenia przyjaznej jednostki
- **WHEN** gracz wskazuje jednostkę przeciwnika
- **THEN** intencja jest odrzucona, a Blood i ręka są bez zmian

#### Scenario: Nieprawidłowa opcja

- **GIVEN** karta z wyborem 2 opcji
- **WHEN** gracz wskazuje opcję 5
- **THEN** intencja jest odrzucona przed zapłaceniem kosztu
