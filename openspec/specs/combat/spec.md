# combat Specification

## Purpose

Faza walki: kolejność linii, efekty przed i po walce, uderzenia, kolejka wyzwalaczy. Kanon: `engine.js` (`lane`, `strike`, `dmg`, `splash`, `thru`).

## Requirements

### Requirement: R-30 Kolejność walki

Walka SHALL rozstrzygać linie od 0 do 3. W każdej linii kolejność MUST być: efekty przed walką → rozstrzygnięcie śmierci → uderzenia obu stron → kolejka wyzwalaczy z obrażeń → rozstrzygnięcie śmierci → efekty po walce (`OnPostCombatLine`) ocalałych jednostek → rozstrzygnięcie śmierci. Gracze nie podejmują decyzji poza wyborem celu efektów przed walką.

#### Scenario: Pusta linia

- **GIVEN** w linii 1 nie ma żadnej jednostki
- **WHEN** walka dochodzi do linii 1
- **THEN** linia jest pomijana bez zdarzeń

### Requirement: R-31 Efekty przed walką

Efekty `OnPreCombatLine` SHALL uruchamiać się raz na linię na rundę, najpierw dla jednostki gracza 0, potem gracza 1 (prototyp; specyfikacja z 2025 mówi „gracz A, potem B” — D-10). Gdy efekt wymaga wrogiego celu, właściciel MUST wybrać go przez `PendingInteraction`; brak odpowiedzi w limicie czasu SHALL dać pierwszy legalny cel.

#### Scenario: Wybór celu przed walką

- **GIVEN** jednostka z efektem przed walką „nałóż Marked na wrogą jednostkę”, przeciwnik ma 2 jednostki
- **WHEN** walka dochodzi do jej linii
- **THEN** kernel zgłasza `PendingInteraction` z dwiema opcjami i czeka na odpowiedź właściciela

### Requirement: R-32 Uderzenia jednoczesne

Obie jednostki w linii MUST uderzyć z atakiem ustalonym przed jakimikolwiek obrażeniami w tej linii; jednostka z atakiem 0 nie uderza. Obie jednostki MAY zginąć w tym samym starciu.

#### Scenario: Wzajemne zabicie

- **GIVEN** jednostki 3/2 i 2/3 naprzeciw siebie
- **WHEN** linia się rozstrzyga
- **THEN** obie giną

### Requirement: R-33 Cel uderzenia i Flying

Jeśli naprzeciw stoi jednostka o takim samym statusie Flying (obie latają albo obie nie), uderzenie MUST trafić tę jednostkę; w przeciwnym razie — oraz gdy linia przeciwnika jest pusta — uderzenie MUST trafić wrogiego bohatera (prototyp; różnica ze starą specyfikacją dla naziemnego atakującego vs latającego obrońcy — D-07).

#### Scenario: Latający przeciw naziemnemu

- **GIVEN** atakujący z Flying, obrońca bez Flying
- **WHEN** linia się rozstrzyga
- **THEN** atakujący trafia bohatera, obrońca (naziemny) również trafia bohatera

#### Scenario: Obaj latają

- **GIVEN** obie jednostki mają Flying
- **WHEN** linia się rozstrzyga
- **THEN** jednostki trafiają siebie nawzajem

### Requirement: R-34 Wyzwalacze z obrażeń

Wyzwalacze `OnDamagedEnemyUnit`, `OnDamagedEnemyHero` i `OnKill` SHALL uruchamiać się tylko przy bezpośrednich trafieniach jednostki (walka, Bonus Attack, SplashDamage, Breakthrough), a w walce MUST być odkładane do kolejki i wykonywane po obu uderzeniach, przed rozstrzygnięciem śmierci. Bez warunku reagują tylko na trafienia samej jednostki. `OnKill` MUST NOT uruchamiać się dla celu z Unkillable lub SoulGuard.

#### Scenario: Wyzwalacz ginącej jednostki

- **GIVEN** jednostka z `OnDamagedEnemyUnit`, która zginie w tym starciu
- **WHEN** zada obrażenia wrogiej jednostce
- **THEN** jej wyzwalacz i tak się wykona, po obu uderzeniach

### Requirement: R-35 Bonus Attack

Bonus Attack SHALL być natychmiastowym, jednostronnym uderzeniem jednostki w jej linii według R-33, z Breakthrough i SplashDamage; obrońca nie oddaje. Nie zastępuje uderzenia w walce.

#### Scenario: Bonus przy pustej linii

- **GIVEN** jednostka 4/4 bez przeciwnika w linii
- **WHEN** otrzymuje Bonus Attack
- **THEN** wrogi bohater traci 4 HP
