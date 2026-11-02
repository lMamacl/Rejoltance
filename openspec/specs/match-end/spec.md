# match-end Specification

## Purpose

Warunki zakończenia meczu. Kanon: `engine.js` (`chk`), UI (poddanie, rozłączenie).

## Requirements

### Requirement: R-70 Zwycięstwo

Gracz, którego bohater ma HP ≤ 0, MUST przegrać. Warunek SHALL być sprawdzany po każdych obrażeniach bohatera i po każdym rozstrzygnięciu śmierci; mecz MUST zakończyć się natychmiast, także w trakcie walki, i żadne dalsze intencje nie są przyjmowane. Mecz nie ma limitu rund.

#### Scenario: Śmierć od fatigue

- **GIVEN** gracz ma 1 HP i pustą talię
- **WHEN** próbuje dobrać kartę
- **THEN** przegrywa, a mecz ma status `finished`

### Requirement: R-71 Jednoczesna śmierć bohaterów

Jeśli obaj bohaterowie mają HP ≤ 0 w tym samym sprawdzeniu, wynik SHALL być remisem (decyzja tymczasowa; prototyp ogłasza zwycięstwo zależne od kolejności sprawdzania — D-01).

#### Scenario: Obaj na zero

- **GIVEN** obaj bohaterowie spadają do 0 HP w tym samym efekcie
- **WHEN** sprawdzany jest warunek zwycięstwa
- **THEN** mecz kończy się remisem

### Requirement: R-72 Poddanie się

Gracz MAY poddać się w dowolnym momencie meczu; mecz MUST natychmiast zakończyć się wygraną przeciwnika.

#### Scenario: Poddanie w trakcie mulliganu

- **GIVEN** faza `mulligan`
- **WHEN** gracz 0 się poddaje
- **THEN** wygrywa gracz 1 z powodem `surrender`

### Requirement: R-73 Rozłączenie

Gracz, który rozłączy się i nie wróci w ciągu 60 sekund, SHALL przegrać przez walkower; w tym czasie mecz MUST być wstrzymany, a po powrocie gracz MUST otrzymać aktualny `MatchView`.

#### Scenario: Powrót w czasie

- **GIVEN** gracz traci połączenie w swoim kroku
- **WHEN** wraca po 20 sekundach
- **THEN** dostaje bieżący widok meczu i kontynuuje grę
