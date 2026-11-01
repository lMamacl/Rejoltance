# Jak dodać lub zmienić kartę

Karty to **dane**. Źródłem jest prototyp (`prototype/revibance/cards.js`, kanon — ADR-0005), z którego generujemy `src/Rejoltance.Content/Data/cards.json`.
Agent zrobi to skillem `rj-add-card`.

## Przypadek 1: zmiana statystyk lub nowa karta z istniejących efektów

1. Otwórz `prototype/revibance/cards.js` i znajdź tablicę `CARDS=[…]`.
2. Dodaj / zmień obiekt (nowa karta kolekcjonerska: kolejne wolne `Id` < 900; token: ≥ 900):

   ```json
   {"Id":70,"Name":"Ember Fox","Type":"Unit","Subtypes":["Animal"],"Cost":2,"Attack":2,"Health":2,
    "Keywords":["BurnSource"],"Description":"Burns what it hits.","Effects":[]}
   ```

3. Wygeneruj dane: `python tools/content/extract_cards.py`.
4. Testy: `dotnet test tests/Rejoltance.Kernel.Tests --filter ContentTests` — walidator odrzuci nieznane słowa i nielegalne talie.
5. Sprawdź licznik w `ContentTests.Catalog_contains_all_prototype_cards` (69 kart + 9 tokenów) — dodanie karty wymaga jego aktualizacji.
6. Opis (`Description`) musi zgadzać się z efektem — recenzent porówna.
7. PR z kluczem Jira; w opisie: dlaczego (balans, nowa mechanika).

## Przypadek 2: karta potrzebuje nowego słowa DSL

Jeśli używasz akcji, wyzwalacza, celu, słowa kluczowego lub warunku, którego nie ma w `src/Rejoltance.Content/Vocabulary.cs`, to **nie jest już „tylko karta”**:

1. Opisz regułę (nowe wymaganie R-nn) — zmiana OpenSpec (`jak-pisac-spec.md`).
2. Dopisz słowo do `Vocabulary`, handler w Kernelu i test `Rnn_…` — w jednym PR (konstytucja art. VI).
3. Dopiero potem karta.

## Talie startowe

Tablica `DECKS=[…]` w tym samym pliku. Reguły (R-01): 30 kart, maks. 3 kopie, bez tokenów. Test `R01_starter_decks_are_legal` to sprawdza.

## Nie rób

- Nie edytuj `cards.json` ręcznie — CI (`extract_cards.py --check`) to wykryje.
- Nie wpisuj w kodzie numerów kart (`if (card.Id == 46)`) — tak prototyp zepsuł Tea Maid i Wyverna (D-11).
