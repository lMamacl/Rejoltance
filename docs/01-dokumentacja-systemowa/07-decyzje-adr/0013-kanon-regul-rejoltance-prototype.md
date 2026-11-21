# ADR-0013: Kanonem zasad jest prototyp rejoltance-prototype

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/07-decyzje-adr/0013-kanon-regul-rejoltance-prototype.md`) · **Kategoria dokumentacji:** Decyzja architektoniczna (ADR) · **Etap SDD:** Specyfikacja

- **Status:** proponowana
- **Data:** 2026-11-21
- **Autorzy:** Gabriel Ostaszewski (z pomocą agenta AI); prototyp: PanCoto
- **Akceptacja:** 2 osoby z zespołu w PR (wymóg konstytucji: zmiana art. I)
- **Powiązane:** [ADR-0005](0005-kanon-regul-prototyp-js.md) (zastępuje), [`04-rozbieznosci-prototypu.md`](../04-rozbieznosci-prototypu.md), `.agents/rules/00-konstytucja.md` (art. I), `tools/content/extract_cards.py`

## Kontekst i problem

ADR-0005 uznał za kanon zasad prototyp JS v11, czyli kopię repo `PanCoto/revibance` w katalogu `prototype/revibance`. W listopadzie 2026 zespół rozwijał grę w nowym repo [`PanCoto/rejoltance-prototype`](https://github.com/PanCoto/rejoltance-prototype). Od 4.11 do 20.11 powstały tam 133 commity, wersja gry to 0.0.4 (pre-alpha). [V]

Nowy prototyp ma inny zestaw kart: 130 kart kolekcjonerskich i 29 tokenów zamiast 69 i 9. Ma też 4 talie startowe zamiast 5. [V] Silnik jest przepisany (`game/engine.js`, ok. 3000 linii). Słownik DSL wzrósł o około 60 słów: 10 wyzwalaczy, 28 akcji, 9 celów, 9 słów kluczowych i 3 warunki. [V] Dochodzą: powtórki meczów (replay), tryb widza (spectate), tutorial, serwer matchmakingu (Cloudflare Workers) i narzędzia symulacji w `lab/`. [V]

Zespół gra już w nowy prototyp. Kanon v11 przestał więc opisywać grę, którą znamy i testujemy. Ten sam powód stał za ADR-0005.

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Zostawić v11 jako kanon | zero zmian w dokumentacji | kanon opisuje grę, w którą już nikt nie gra | rosnący rozjazd specyfikacji z grą |
| Nowy prototyp obok v11 | mało zmian teraz | dwa prototypy i niejasne, który jest wzorcem | decyzja tylko odłożona |
| **Nowy prototyp zamiast v11, jako git subtree w `prototype/`** | jeden wzorzec; historia i autorstwo PanCoto zostają; łatwo dociągać zmiany | repo rośnie o ok. 105 MB (audio); reguły R-nn i D-nn trzeba sprawdzić na nowo | jednorazowy przegląd specyfikacji |

## Decyzja

W kontekście gry rozwijanej w `PanCoto/rejoltance-prototype` wybieramy **zachowanie `prototype/game/engine.js` oraz dane `prototype/game/cards.js` i `decks.js` jako kanon zasad**. Zastępujemy w ten sposób prototyp v11, aby specyfikacja i Kernel goniły grę, w którą zespół naprawdę gra. Akceptujemy, że część reguł R-nn i pozycji D-nn spisanych dla v11 trzeba sprawdzić na nowym prototypie.

Szczegóły:

- `prototype/` to **git subtree** repo `PanCoto/rejoltance-prototype` (gałąź `main`) z pełną historią. Prototyp dalej rozwija się w tamtym repo. Kopię w Rejoltance odświeżamy poleceniem `git subtree pull --prefix=prototype https://github.com/PanCoto/rejoltance-prototype.git main`. Plików w `prototype/` nie edytujemy bezpośrednio.
- PR, który wnosi subtree, mergujemy **merge commitem**, nie squashem. Squash zgubiłby historię i metadane subtree, a kolejne `git subtree pull` kończyłyby się konfliktami.
- Kanonem są karty z `cards.js` i talie z `decks.js`. Karty „Legacy” (`cards-legacy.js`, `decks-legacy.js`) to tryb dodatkowy w grze i nie są kanonem.
- `tools/content/extract_cards.py` czyta dane przez Node (pliki to literały obiektów JS, a nie JSON). `Vocabulary.cs` zawiera wszystkie słowa DSL używane przez nowe karty. Kernel obsłuży je dopiero wtedy, gdy powstaną reguły R-nn i testy.
- Wyjątki z ADR-0005 dalej obowiązują: błąd prototypu trafia do `04-rozbieznosci-prototypu.md` i zespół rozstrzyga go, zanim stanie się regułą R-nn.

## Konsekwencje

### Pozytywne

- Jeden wzorzec gry zgodny z tym, w co gra zespół. GitHub Pages publikuje `prototype/game`.
- `cards.json` i `decks.json` odpowiadają aktualnym kartom, a CI wykrywa rozjazd (`extract_cards.py --check`).
- Historia i autorstwo prac nad prototypem zostają w repo.

### Negatywne / ryzyka

- Reguły R-nn (`openspec/specs/`, `02-specyfikacja-regul-gry.md`, `03-indeks-regul-r-nn.md`) i rozbieżności D-01…D-20 spisano dla v11. Do czasu przeglądu traktujemy je jako „do sprawdzenia na nowym prototypie”.
- Talie startowe mają nazwy z prototypu (`OG C.`, `OG P.`, `OG B.`, `OG. M`). Klient web i testy używają tych nazw.
- Repo rośnie o ok. 105 MB (głównie muzyka i efekty dźwiękowe).

### Do zrobienia

- [ ] Przegląd reguł R-nn i pozycji D-nn na nowym prototypie (zadanie w Jirze).
- [ ] Po akceptacji tego ADR: status ADR-0005 → `superseded by ADR-0013`, status tego ADR → `accepted`.
