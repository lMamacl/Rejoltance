# 4.4 Warsztat inżynierski: skille, dokumentacja, ADR i karty

> **Źródło prawdy:** repozytorium (`docs/04-system-agentow-ai/04-warsztat-tworzenie-agentow-skilli-i-kart.md`) · **Kategoria dokumentacji:** Dokumentacja procesowa — podręcznik warsztatowy zespołu i AI · **Etap SDD:** cały cykl SDD

To praktyczny warsztat dla każdej osoby w zespole. Pokazuje krok po kroku, jak dodać skill dla agentów, jak pisać dokumentację i przenosić ją do Confluence, jak zapisać decyzję architektoniczną (ADR, Architecture Decision Record) i jak dodać nową kartę do gry.

---

## Warsztat 1: Jak dodać albo zmienić skill?

Skill to procedura krok po kroku w pliku `.agents/skills/rj-<nazwa>/SKILL.md`. Dodaj go wtedy, gdy ta sama czynność powtarza się w zespole co najmniej kilka razy i ma jasny wynik. Nowych ról agentów nie tworzymy: jedyną rolą jest recenzent `rj-qa-verifier` ([ADR-0014](../01-dokumentacja-systemowa/07-decyzje-adr/0014-odchudzenie-systemu-agentow.md)).

1. Skopiuj istniejący skill, np. `.agents/skills/rj-pr-ready/`, pod nową nazwą `rj-<nazwa>` (małe litery i myślniki).
2. W nagłówku YAML ustaw `name` (taki sam jak nazwa katalogu) i krótki `description`: kiedy użyć skilla i co powstaje.
3. Opisz kroki, sposób weryfikacji i czego nie wolno. Odwołuj się tylko do plików i poleceń, które istnieją w repozytorium.
4. Wygeneruj adaptery i sprawdź konfigurację:

   ```bash
   npm run agents
   npm run agents:check
   ```

   Skrypt skopiuje skill do `.claude/skills/` i doda komendę `/rj-<nazwa>` dla Antigravity w `.agents/workflows/`.

---

## Warsztat 2: Jak tworzyć dokumentację i przenosić ją do Confluence PB?

1. **Wybierz sekcję w `docs/`** zgodnie z układem 1:1 z Confluence (`00-przewodnik-i-setup`, `01-dokumentacja-systemowa`, `02-dokumentacja-uzytkownika`, `03-dokumentacja-procesowa`, `04-system-agentow-ai`, `05-szablony`).
2. **Użyj szablonu** z katalogu [`docs/05-szablony/`](../05-szablony/README.md), np. `szablon-karta-modulu.md`, gdy opisujesz swój moduł na zaliczenie efektu **EU5**, albo `szablon-qa-raport-i-checklista.md` na zaliczenie **EU6**.
3. **Dodaj blok metadanych** pod tytułem dokumentu:

   ```markdown
   > **Źródło prawdy:** repozytorium (`docs/...`) · **Kategoria AltexSoft:** ... · **Etap SDD:** ...
   ```

4. **Sprawdź formatowanie i strukturę dokumentacji:**

   ```bash
   npm run check
   npm run docs:check
   ```

   Bez flag skrypt tylko sprawdza drzewo `docs/` i linki (tak samo jak `--check`). Paczkę stron gotowych do wklejenia wygenerujesz flagą `--export`. Znajdziesz ją w katalogu `.artifacts/confluence-export/`.

5. **Opublikuj strony przez REST API (opcjonalnie).** Token PAT (Personal Access Token) z Confluence PB ustaw w zmiennej środowiskowej `CONFLUENCE_PERSONAL_TOKEN` albo w lokalnym pliku `.env` (git go ignoruje). Skrypt sam odczyta zmienną:

   ```bash
   npm run docs:publish -- --dry-run
   npm run docs:publish -- --url https://devtools.wi.pb.edu.pl/confluence
   ```

   Nie podawaj tokenu ani hasła w parametrach `--token` czy `--password`. Komenda z tokenem trafia do historii terminala i logów, a stamtąd łatwo do innych osób.

---

## Warsztat 3: Jak napisać i zatwierdzić decyzję architektoniczną (ADR)?

Decyzję ADR piszemy zawsze, gdy wybieramy technologię, zmieniamy jeden z 5 zamrożonych kontraktów albo ustalamy regułę procesu, o którą ktoś może zapytać za miesiąc. Możesz użyć skilla `/rj-write-adr`.

1. Sprawdź najwyższy numer w `docs/01-dokumentacja-systemowa/07-decyzje-adr/` i utwórz nowy plik `NNNN-krotki-tytul.md` na bazie wzorca [`0000-szablon.md`](../01-dokumentacja-systemowa/07-decyzje-adr/0000-szablon.md).
2. Ustaw początkowy status na `proposed`.
3. Opisz **kontekst i problem**, porównaj w tabeli co najmniej **2–3 opcje** (zalety, wady, koszt/ryzyko) i zapisz decyzję jako zdanie **Y-statement**:
   > *„W kontekście **X**, mierząc się z **Y**, wybieramy **Z** zamiast **A**, aby osiągnąć **B**, akceptując **C**.”*
4. Dopisz nowy dokument do tabeli w `07-decyzje-adr/README.md` i otwórz pull request. Gdy 2 osoby z zespołu zaakceptują decyzję, zmień status na `accepted`.

---

## Warsztat 4: Jak dodać lub zmodyfikować kartę w grze?

Karty w **RE:JOLTANCE** to same dane. Generujemy je z kanonicznego prototypu JS (`prototype/game/cards.js`) do pliku `src/Rejoltance.Content/Data/cards.json`. Możesz użyć skilla `/rj-add-card`.

### Wariant A: karta używa istniejących słów kluczowych, wyzwalaczy i akcji DSL

DSL to nasz język opisu efektów kart.

1. Dodaj albo zmień wpis w tablicy `CARDS` w pliku `game/cards.js` repozytorium `PanCoto/rejoltance-prototype`. Katalog `prototype/` w Rejoltance to jego kopia (git subtree, ADR-0013), więc nie edytuj go bezpośrednio. Zmiany dociągasz poleceniem `git subtree pull --prefix=prototype https://github.com/PanCoto/rejoltance-prototype.git main`. Przykładowy wpis:

   ```javascript
   {
     "Id": 131,
     "Name": "Ember Hound",
     "Type": "Unit",
     "Subtypes": ["Animal"],
     "Cost": 2,
     "Attack": 2,
     "Health": 2,
     "Keywords": ["BurnSource"],
     "Description": "Applies Burning to units it damages.",
     "Effects": []
   }
   ```

2. Uruchom skrypt ekstrakcji danych:

   ```bash
   npm run cards
   ```

3. Uruchom testy walidatora katalogu kart. Na razie są w `Rejoltance.Kernel.Tests`, bo projekt `Rejoltance.Cards.Tests` jest dopiero planowany:

   ```bash
   dotnet test tests/Rejoltance.Kernel.Tests --filter ContentTests
   ```

   Jeśli dodajesz kartę ponad obecne 130 kart kolekcjonerskich i 29 tokenów, zmień oczekiwaną liczbę kart w teście `Catalog_contains_all_prototype_cards`.

### Wariant B: karta wymaga nowego słowa kluczowego, wyzwalacza albo akcji w DSL

Gdy karta wprowadza mechanikę, której nie ma w klasie `src/Rejoltance.Content/Vocabulary.cs`:

1. Najpierw napisz specyfikację reguły `R-nn` w `openspec/specs/` ([przewodnik OpenSpec](03-jak-pisac-specyfikacje-openspec.md)).
2. Dodaj nowe słowo do `Vocabulary.cs`, zaimplementuj jego obsługę w `Rejoltance.Kernel` i napisz test jednostkowy `Rnn_...`.
3. Dopiero na końcu dodaj kartę i wygeneruj `cards.json`.
