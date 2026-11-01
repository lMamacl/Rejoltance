# Rozbieżności i znane błędy prototypu — do decyzji zespołu

Kanon zasad = prototyp JS v11 (ADR-0005). Poniższe miejsca to albo **różnica** między prototypem a starą specyfikacją
(`docs/99-sources/pomoce-dydaktyczne/RE_JOLTANCE.md`), albo **błąd** prototypu. Każdy wiersz zamyka zespół (story E0-S04):
wpisuje decyzję, a `rj-rules-expert` aktualizuje regułę R‑nn w `openspec/specs` i test.

Typ: **R** — różnica w zasadach (obie wersje są sensowne), **B** — błąd prototypu, **I** — sprawa implementacyjna.

| # | Typ | Temat | Prototyp JS (`engine.js`) | Stara specyfikacja | Propozycja | Reguła | Decyzja |
|---|---|---|---|---|---|---|---|
| D-01 | B | Jednoczesna śmierć bohaterów | wynik zależy od kolejności sprawdzania: w `chk` przy remisie wygrywa gracz 1; w walce wygrywa ten, kto uderzył pierwszy (gracz 0) | brak | **remis** (w szkielecie już tak) | R-71 | ? |
| D-02 | R | Mulligan | dowolna liczba; zamienniki z góry, odrzucone wracają, talia tasowana | odrzucone na dno, bez tasowania | zostawić JS (zaimplementowane) | R-03 | ? |
| D-03 | R | Breakthrough | po trafieniu jednostki bohater dostaje **pełny** atak (komentarz w kodzie mówi „nadwyżka”) | brak słowa kluczowego | do decyzji: pełny vs nadwyżka | R-45 | ? |
| D-04 | B | Powrót do ręki przy pełnej ręce | karta znika z gry | — | jak przy Unkillable: na stos odrzuconych | R-53 | ? |
| D-05 | B | Walidacja celów | brak: gość może wskazać jednostkę wroga do poświęcenia; zły indeks wyboru rzuca wyjątek po zapłaceniu kosztu | — | serwer zawsze waliduje przed zmianą stanu | R-25, R-82 | błąd |
| D-06 | B | Brak wybranego celu | `TargetEnemyUnit` bez wyboru → przeciwnik naprzeciw lub **losowy** wróg | — | `PendingInteraction` albo błąd | R-84 | błąd |
| D-07 | R | Naziemny atakujący vs latający obrońca | uderzenie idzie w **bohatera** (liczy się tylko „ten sam status Flying”) | uderzenie trafia jednostkę („Flying nie chroni przed naziemnymi”) | do decyzji — duży wpływ na balans | R-33 | ? |
| D-08 | R | Pancerz a Burning | Armored redukuje obrażenia od Burning | Armored **nie** redukuje Burning | do decyzji | R-15, R-40 | ? |
| D-09 | R | BurnSource a efekty | Burning nakładany przy każdych obrażeniach od jednostki (także efektami) | tylko przy bezpośrednich uderzeniach | do decyzji | R-43 | ? |
| D-10 | R | Kolejność efektów przed walką | zawsze gracz 0, potem 1 | gracz A (rozpoczynający), potem B | specyfikacja (A, potem B) — sprawiedliwsze | R-31 | ? |
| D-11 | I | Efekty pasywne | Tea Maid (46), Wyvern (60), Survivalist (14) zakodowane po id; `Passive` z danych ignorowany | — | opisać w DSL (ADR + E2-S07) | R-23, R-67 | do zrobienia |
| D-12 | B | Obniżki kosztu po powrocie | readme twierdzi, że zostają; kod je kasuje | „przepadają” | zgodnie z kodem i specyfikacją: przepadają | R-24, R-53 | zgodne |
| D-13 | B | Wyciek informacji | numery `uid` nadawane przed tasowaniem → gość zna rękę i kolejność talii hosta | — | id przy wyjściu z talii (zrobione w Kernelu) | R-81 | naprawione |
| D-14 | B | XSS | `innerHTML` z danymi od hosta | — | React bez `dangerouslySetInnerHTML` | — | naprawione (architektura) |
| D-15 | R | Tokeny‑czary | czary‑tokeny trafiają na stos odrzuconych (mogą wrócić przez `DrawFromDiscard`), tokeny‑jednostki znikają | brak | do decyzji: czy tokeny‑czary też znikają | R-22 | ? |
| D-16 | B | Parametr słowa kluczowego = 0 | `kwp` traktuje 0 jak 1 | — | 0 oznacza 0 | R-40, R-44 | ? |
| D-17 | B | Pętla reakcji | `resolve` przerywa po 30 iteracjach po cichu | — | błąd z diagnostyką | R-54 | błąd |
| D-18 | R | Mulligan w starym C# | — | (C#: maks. 3 karty) | zostawić JS (dowolna liczba) | R-03 | ? |
| D-19 | B | Opis karty Regifter | readme: „tylko ty dobierasz 2” | dane: poświęcona → ty 2, wróg 1 | dane są kanonem; poprawić opis | — | ? |
| D-20 | I | Bot widzi efekty z ręki przeciwnika | projekcja bota zawiera prawdziwą rękę przeciwnika | — | bot gra tylko na `MatchView` (fog of war) | R-80 | do zrobienia (E5) |
