# match-setup Specification

## Purpose

Przygotowanie meczu: legalne talie, stan początkowy, mulligan i wybór kolejności. Kanon: `prototype/revibance/engine.js` (`newGame`, `mulligan`, `decideStart`) — ADR-0005.

## Requirements

### Requirement: R-01 Legalna talia

Talia gracza MUST zawierać dokładnie 30 kart, co najwyżej 3 kopie tej samej karty i żadnego tokenu (id ≥ 900). Serwer SHALL odrzucić mecz z nielegalną talią przed jego utworzeniem.

#### Scenario: Talia z czwartą kopią

- **GIVEN** talia z 4 kopiami karty 1
- **WHEN** gracz próbuje rozpocząć mecz
- **THEN** mecz nie powstaje, a błąd wskazuje kartę 1 i limit 3 kopii

#### Scenario: Token w talii

- **GIVEN** talia zawierająca kartę 900
- **WHEN** talia jest walidowana
- **THEN** walidacja zgłasza, że token nie może być w talii

### Requirement: R-02 Stan początkowy

Na starcie każdy gracz SHALL mieć 20 HP, 0 Blood, przetasowaną talię i 4 karty w ręce. Dobieranie startowe MUST NOT uruchamiać wyzwalaczy dobrania.

#### Scenario: Nowy mecz

- **GIVEN** dwie legalne talie i seed
- **WHEN** mecz zostaje utworzony
- **THEN** każdy gracz ma 20 HP, 4 karty w ręce, 26 w talii, a faza to `mulligan`

### Requirement: R-03 Mulligan

Każdy gracz SHALL raz wskazać dowolną liczbę kart z ręki do wymiany. Kolejność (prototyp v11): najpierw dobiera tyle samo kart z góry talii, potem odrzucone karty wracają do talii i talia jest tasowana. Mulligan MUST odbyć się przez `PendingInteraction`, a karta spoza ręki MUST zostać odrzucona jako nielegalna.

#### Scenario: Wymiana dwóch kart

- **GIVEN** gracz ma 4 karty w ręce i 26 w talii
- **WHEN** wymienia 2 karty
- **THEN** ma 4 karty w ręce (bez wymienionych), 26 w talii, a jego mulligan jest zakończony

#### Scenario: Drugi mulligan

- **GIVEN** gracz już wykonał mulligan
- **WHEN** wysyła kolejny mulligan
- **THEN** intencja jest odrzucona, stan bez zmian

#### Scenario: Obaj gracze gotowi

- **GIVEN** obaj gracze wykonali mulligan
- **WHEN** stan jest przetworzony
- **THEN** faza zmienia się na `chooseOrder`

### Requirement: R-04 Wybór kolejności

Po mulliganie każdy gracz SHALL zadeklarować, czy chce zaczynać. Różne deklaracje MUST zostać uszanowane; identyczne — gracz rozpoczynający jest losowany z RNG meczu.

#### Scenario: Różne wybory

- **GIVEN** gracz 0 chce być pierwszy, gracz 1 drugi
- **WHEN** obie odpowiedzi dotrą
- **THEN** gracz 0 rozpoczyna rundę 1

#### Scenario: Te same wybory

- **GIVEN** obaj chcą być pierwsi
- **WHEN** obie odpowiedzi dotrą
- **THEN** rozpoczynający jest wybrany losowo z seeda meczu (powtarzalnie dla tego samego seeda)
