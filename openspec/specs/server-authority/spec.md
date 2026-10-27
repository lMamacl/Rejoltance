# server-authority Specification

## Purpose

Uczciwość gry online: serwer jako jedyny autorytet, fog of war, determinizm. Wynika z błędów prototypu P2P (`net.js`) i z konstytucji (art. II–III, VI).

## Requirements

### Requirement: R-80 Fog of war

Klient MUST otrzymywać wyłącznie `MatchView` swojego miejsca: własną rękę z kartami, a o przeciwniku tylko liczbę kart w ręce i talii oraz publiczne informacje (plansza, HP, Blood, stos odrzuconych). Zdarzenia o ukrytych kartach przeciwnika (np. dobranie) MUST być zanonimizowane.

#### Scenario: Widok przeciwnika

- **GIVEN** przeciwnik ma 4 karty w ręce
- **WHEN** serwer wysyła widok graczowi 0
- **THEN** widok zawiera `handCount: 4` i nie zawiera identyfikatorów ani numerów kart przeciwnika

### Requirement: R-81 Identyfikatory bez wycieku

Identyfikatory instancji kart MUST NOT ujawniać kolejności talii ani pozwalać wyliczyć kart przeciwnika — instancja otrzymuje identyfikator dopiero przy opuszczeniu talii.

#### Scenario: Talia bez identyfikatorów

- **GIVEN** nowy mecz
- **WHEN** gracz analizuje numery instancji swojej ręki
- **THEN** nie da się z nich wyznaczyć kolejności talii przeciwnika

### Requirement: R-82 Walidacja intencji

Serwer MUST przyjmować od klienta tylko intencje (`Intent`), MUST sprawdzić, że nadawca jest graczem w tym meczu i ma prawo do ruchu, i MUST odrzucić nielegalną intencję w całości, bez częściowej zmiany stanu. Intencje jednego meczu MUST być przetwarzane po kolei.

#### Scenario: Ruch w cudzym meczu

- **GIVEN** połączenie nienależące do meczu M
- **WHEN** wysyła intencję do meczu M
- **THEN** intencja jest odrzucona z komunikatem, stan M bez zmian

### Requirement: R-83 Determinizm i replay

Kernel MUST być deterministyczny: ten sam seed i ta sama uporządkowana lista intencji SHALL dać identyczny stan i zdarzenia. Kernel MUST NOT używać zegara, `System.Random`, sieci ani plików.

#### Scenario: Powtórka meczu

- **GIVEN** zapisany seed i lista intencji meczu
- **WHEN** mecz jest odtwarzany
- **THEN** stan końcowy jest identyczny z oryginałem

### Requirement: R-84 Pytania zamiast zgadywania

Gdy reguła wymaga decyzji gracza (mulligan, kolejność, cel efektu przed walką, opcja), kernel MUST zgłosić `PendingInteraction` i czekać na `AnswerPendingIntent`, zamiast wybierać losowo lub blokować wątek.

#### Scenario: Oczekujący mulligan

- **GIVEN** nowy mecz
- **WHEN** gracz pobiera widok
- **THEN** widok zawiera `pending` typu `mulligan` dla jego miejsca
