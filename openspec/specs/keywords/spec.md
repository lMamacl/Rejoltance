# keywords Specification

## Purpose

Słowa kluczowe i statusy jednostek. Kanon: `engine.js` (`dmg`, `status`, `resolve`, `aura`, `killUnit`, `endRound`), słownik: `src/Rejoltance.Content/Vocabulary.cs`.

## Requirements

### Requirement: R-40 Armored

Jednostka z Armored(n) (domyślnie n = 1; Armor2 = 2) SHALL redukować każde pojedyncze trafienie o n, do minimum 0. Redukcja MUST być liczona przed podwojeniem przez Marked. Prototyp redukuje też obrażenia od Burning (D-08).

#### Scenario: Pancerz 2

- **GIVEN** jednostka z Armored(2)
- **WHEN** otrzymuje trafienie za 3
- **THEN** traci 1 HP

### Requirement: R-41 Marked

Jednostka z Marked SHALL otrzymywać podwojone obrażenia z trafień i efektów (po redukcji pancerza), ale MUST NOT dotyczyć to Burning. Status jest trwały do śmierci lub Silence.

#### Scenario: Marked i pancerz

- **GIVEN** jednostka z Armored(1) i Marked
- **WHEN** otrzymuje trafienie za 3
- **THEN** traci 4 HP

### Requirement: R-42 Stunned

Jednostka ze Stunned SHALL pominąć najbliższe uderzenie (w walce lub Bonus Attack); status MUST zniknąć po pominięciu. Stunned nie blokuje efektów przed walką ani SplashDamage innych jednostek.

#### Scenario: Ogłuszony atakujący

- **GIVEN** jednostka ze Stunned w walce
- **WHEN** linia się rozstrzyga
- **THEN** nie uderza, nie zadaje SplashDamage, a po walce nie ma już Stunned

### Requirement: R-43 Burning i BurnSource

Burning SHALL zadawać obrażenia na koniec rundy według R-15 i trwać do śmierci lub Silence. Jednostka z BurnSource SHALL nakładać Burning na każdą wrogą jednostkę, której zada obrażenia (prototyp: także efektami tej jednostki — D-09); takie nałożenie MUST NOT uruchamiać `OnStatusApplied`.

#### Scenario: Podpalenie w walce

- **GIVEN** jednostka z BurnSource trafia wrogą jednostkę
- **WHEN** obrażenia zostaną zadane
- **THEN** wroga jednostka ma status Burning

### Requirement: R-44 SplashDamage

Jednostka z SplashDamage(n) (domyślnie 1) SHALL po swoim uderzeniu zadać n obrażeń wrogim jednostkom w liniach sąsiednich (i−1, i+1), także gdy główne uderzenie trafiło bohatera. Splash MUST NOT trafiać bohatera ani nastąpić, gdy jednostka była Stunned.

#### Scenario: Splash z linii 0

- **GIVEN** jednostka z SplashDamage(1) w linii 0, wrogie jednostki w liniach 1 i 3
- **WHEN** uderza
- **THEN** tylko jednostka w linii 1 traci 1 HP

### Requirement: R-45 Breakthrough

Jednostka z Breakthrough SHALL po trafieniu wrogiej jednostki zadać dodatkowo wrogiemu bohaterowi obrażenia równe swojemu atakowi (prototyp: pełny atak, nie nadwyżka — D-03).

#### Scenario: Przebicie

- **GIVEN** jednostka 5/5 z Breakthrough naprzeciw jednostki 2/2
- **WHEN** uderza
- **THEN** wroga jednostka ginie, a wrogi bohater traci 5 HP

### Requirement: R-46 SoulGuard

Gdy jednostka z SoulGuard miałaby zginąć z obrażeń lub efektu niszczącego, SHALL zamiast tego stracić SoulGuard i mieć 1 HP. SoulGuard MUST NOT chronić przed Sacrifice. SoulGuard nadany przez aurę (Survivalist, id 14) MUST zniknąć, gdy źródło opuści planszę, i MUST NOT wrócić po zużyciu.

#### Scenario: Zniszczenie z SoulGuard

- **GIVEN** jednostka z SoulGuard
- **WHEN** zostaje zniszczona efektem
- **THEN** zostaje na planszy z 1 HP i bez SoulGuard

### Requirement: R-47 Unkillable

Jednostka z Unkillable, która zginie, SHALL uruchomić efekty pośmiertne, a następnie wrócić do ręki właściciela jako nowa karta, zachowując Unkillable; przy pełnej ręce MUST trafić na stos odrzuconych, a token MUST zniknąć. Gdy jednostka ma SoulGuard i Unkillable, SoulGuard zużywa się pierwszy.

#### Scenario: Powrót do ręki

- **GIVEN** jednostka z Unkillable, ręka właściciela ma 3 karty
- **WHEN** ginie
- **THEN** jej efekty pośmiertne się wykonują, a ręka ma 4 karty, w tym tę kartę z Unkillable

### Requirement: R-48 Nakładanie statusów

Nałożenie statusu (Marked, Stunned, Burning i innych) przez akcję `ApplyStatus` SHALL uruchomić `OnStatusApplied` u wszystkich pozostałych jednostek na planszy — także przy ponownym nałożeniu istniejącego statusu.

#### Scenario: Reakcja na Marked

- **GIVEN** na planszy jednostka reagująca na nałożenie Marked na wroga
- **WHEN** wroga jednostka otrzymuje Marked
- **THEN** wyzwalacz reagującej jednostki się wykonuje
