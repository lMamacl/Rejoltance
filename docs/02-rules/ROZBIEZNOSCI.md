# Rozbieżności i znane błędy prototypu (do decyzji zespołu)

Kanon = prototyp JS v11 (ADR-0005), **ale** poniższe zachowania wyglądają na błędy lub różnią się od starej specyfikacji
(`docs/99-sources/pomoce-dydaktyczne/RE_JOLTANCE.md`). Każdy wiersz czeka na decyzję zespołu (pytanie otwarte #6).
Pełna tabela powstaje w Fazie 3.

| # | Temat | Prototyp JS | Stara specyfikacja | Propozycja | Decyzja |
|---|---|---|---|---|---|
| D-01 | Remis (obaj bohaterowie ≤ 0 HP) | wygrywa gracz 1 (`chk`) | brak | remis — w szkielecie zapisany jako `draw` | ? |
| D-02 | Mulligan | dowolna liczba, odrzucone tasowane do talii | na dno talii, bez tasowania | zostawić JS (zaimplementowane, R‑02) | ? |
| D-03 | Breakthrough | pełny atak w bohatera mimo blokady | brak słowa kluczowego | do decyzji: pełny czy nadwyżka | ? |
| D-04 | Powrót do ręki przy pełnej ręce | karta znika | — | jak przy śmierci: na stos odrzuconych | ? |
| D-05 | Walidacja celów od gościa | brak (można poświęcić jednostkę wroga) | — | **błąd** — serwer zawsze waliduje | błąd |
| D-06 | Losowy cel, gdy nie wybrano | losowy wróg | — | **błąd** — fail loud / PendingInteraction | błąd |
