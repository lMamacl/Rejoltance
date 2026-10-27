# death-and-removal Specification

## Purpose

Śmierć, poświęcenie, wyciszenie i powrót do ręki. Kanon: `engine.js` (`resolve`, `killUnit`, `sacrifice`, akcje `Silence`, `ReturnToHand`).

## Requirements

### Requirement: R-50 Rozstrzygnięcie śmierci

Po każdym efekcie i po fazach walki jednostki z HP ≤ 0 SHALL zostać rozstrzygnięte (z uwzględnieniem SoulGuard i Unkillable), powtarzając rozstrzyganie, dopóki pojawiają się nowe ofiary. Kolejność wyzwalaczy MUST być: `OnDeath` ginącej jednostki → `OnFriendlyUnitDied` pozostałych jednostek właściciela → efekty kart w ręce właściciela. Karta ginącej jednostki SHALL trafić na stos odrzuconych (tokeny znikają).

#### Scenario: Kolejność wyzwalaczy

- **GIVEN** ginie jednostka z `OnDeath`, a sojusznik ma `OnFriendlyUnitDied`
- **WHEN** rozstrzyga się śmierć
- **THEN** najpierw wykonuje się `OnDeath`, potem efekt sojusznika

### Requirement: R-51 Sacrifice

Poświęcenie SHALL najpierw uruchomić `OnSacrificed` poświęcanej jednostki; jeśli nadal jest na planszy, MUST zostać zniszczona (z efektami pośmiertnymi, z pominięciem SoulGuard); na końcu SHALL uruchomić się `OnOtherUnitSacrificed` u pozostałych jednostek i kart w ręce właściciela. Poświęcenie liczy się jako śmierć dla wyzwalaczy.

#### Scenario: Poświęcenie z SoulGuard

- **GIVEN** przyjazna jednostka z SoulGuard
- **WHEN** zostaje poświęcona
- **THEN** ginie mimo SoulGuard

### Requirement: R-52 Silence

Silence SHALL usunąć wszystkie słowa kluczowe i statusy (w tym Marked, Burning, Stunned, Unkillable), przywrócić atak i max HP do wartości z karty (HP = min(bieżące, bazowe)) i trwale wyłączyć wszystkie zdolności jednostki, w tym efekty pośmiertne i pasywne. Silence MUST NOT cofać efektów już nałożonych na gracza ani efektów działających z ręki.

#### Scenario: Wyciszona jednostka ginie

- **GIVEN** wyciszona jednostka z `OnDeath`
- **WHEN** ginie
- **THEN** jej efekt pośmiertny się nie wykonuje

### Requirement: R-53 Powrót do ręki

Jednostka zawrócona do ręki SHALL wrócić jako nowa karta, bez modyfikacji (zachowując tylko Unkillable). Tokeny MUST zniknąć. Prototyp przy pełnej ręce usuwa kartę z gry — do decyzji zespołu (D-04).

#### Scenario: Zawrócenie zbuffowanej jednostki

- **GIVEN** jednostka z bazowym 2/2 zbuffowana do 4/4
- **WHEN** wraca do ręki i zostaje ponownie zagrana
- **THEN** ma 2/2

### Requirement: R-54 Limit reakcji łańcuchowych

Rozstrzyganie śmierci i reakcji MUST mieć jawny limit iteracji; jego przekroczenie MUST zakończyć się błędem z diagnostyką (karty w pętli), zamiast cichego przerwania jak w prototypie (`resolve`: limit 30).

#### Scenario: Nieskończona pętla

- **GIVEN** dwie karty, które wzajemnie się przywołują przy śmierci
- **WHEN** jedna z nich ginie
- **THEN** kernel zgłasza błąd przekroczenia limitu z listą kart, a nie zawiesza się
