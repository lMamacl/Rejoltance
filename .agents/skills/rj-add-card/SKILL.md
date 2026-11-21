---
name: rj-add-card
description: "Aktualizuje katalog kart z prototypu JS (packages/content/data/cards.json), sprawdza słownik DSL i obsługę efektów w silniku oraz dodaje testy scenariuszy kart."
---

# Umiejętność: Przenoszenie i dodawanie karty (`rj-add-card`)

## Kiedy używać tej procedury?

Uruchamiaj przy przenoszeniu karty z prototypu JS do silnika (np. kart z talii MVP w Epiku E2) lub przy dodawaniu nowej karty do katalogu.

---

## Kroki wykonawcze (Krok po kroku)

1. **Sprawdź definicję karty w prototypie i w `cards.json`:**
   - Wyszukaj kartę po identyfikatorze `id` w `prototype/game/cards.js` oraz `packages/content/data/cards.json` (`grep -n '"Id": <N>,' packages/content/data/cards.json`).
   - Dane kart zmieniamy w repo `PanCoto/rejoltance-prototype`, a nie w kopii `prototype/` (git subtree, ADR-0013). Po `git subtree pull --prefix=prototype https://github.com/PanCoto/rejoltance-prototype.git main` wygeneruj ponownie katalog kart:

     ```bash
     python tools/content/extract_cards.py
     python tools/content/extract_cards.py --check
     ```

2. **Zweryfikuj słownik efektów DSL karty:**
   - Wypisz wszystkie elementy używane przez kartę: `keywords`, `triggers`, `conditions`, `targets` oraz `actions`.
   - Sprawdź w `packages/content/src/vocabulary.ts` i w `packages/engine`, czy każdy z tych elementów jest obsługiwany. Pamiętaj o zasadzie *Fail Loud* (`R-68`): nieznane słowo odrzuca walidator, a nieobsługiwana akcja musi rzucić błąd, a nie zostać zignorowana.

3. **Zaimplementuj brakujące handlery efektów (jeśli wymagane):**
   - Nowe handlery dodawaj jako czyste, deterministyczne funkcje korzystające z RNG z `packages/engine/src/rng.ts` i emitujące odpowiednie `DomainEvent`.

4. **Dodaj test scenariusza karty w `packages/engine/test`:**
   - Napisz test sprawdzający: koszt Blood, legalne cele (`legalActions` / `PendingInteraction`), główny efekt karty oraz przypadek brzegowy (np. brak legalnego celu → `noop` wg `R-62`).
   - Uruchom `npm test` i upewnij się, że wszystkie testy przechodzą.
