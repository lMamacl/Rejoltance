---
name: rj-add-rule-test
description: "Przekształca regułę gry R-nn w deterministyczny test jednostkowy xUnit o nazwie Rnn_<zachowanie> w Rejoltance.Kernel.Tests lub Rejoltance.Cards.Tests i aktualizuje 03-indeks-regul-r-nn.md."
---

# Umiejętność: Dodawanie testu reguły gry `R-nn` (`rj-add-rule-test`)

## Kiedy używać tej procedury?

Uruchamiaj podczas implementacji lub weryfikacji każdej reguły domenowej `R-nn` w `Rejoltance.Kernel` lub `Rejoltance.Content`.

---

## Kroki wykonawcze (Krok po kroku)

1. **Odczytaj specyfikację reguły `R-nn`:**
   - Znajdź wiersz `R-nn` w `docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md`.
   - Przeczytaj pełny opis w `docs/01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md` oraz scenariusze `GIVEN / WHEN / THEN` we właściwym pliku `openspec/specs/<domena>/spec.md`.
   - W razie potrzeby sprawdź odpowiedni fragment w `prototype/revibance/engine.js` (używając `grep`, bez wczytywania całego pliku).

2. **Napisz deterministyczny test jednostkowy xUnit:**
   - Umieść test w `tests/Rejoltance.Kernel.Tests` (mechanika rdzenia) lub, gdy powstanie, w planowanym `tests/Rejoltance.Cards.Tests` (efekty kart).
   - Nazwij metodę testową dokładnie według konwencji `Rnn_<opis_zachowania>`, np.:

     ```csharp
     [Fact]
     public void R43_Mutual_strike_kills_both_units_when_damage_meets_hp()
     {
         // GIVEN: konkretny stan początkowy i jawne ziarno SeededRng(42)
         // WHEN:  wywołanie Kernel.Apply(...)
         // THEN:  asercje na nowym stanie MatchState oraz na DomainEvent[]
     }
     ```

3. **Uruchom test i upewnij się, że przechodzi z właściwego powodu:**

   ```bash
   dotnet test --filter "FullyQualifiedName~R43_"
   ```

4. **Zaktualizuj macierz śledzenia reguł:**
   - W pliku `docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md` wpisz nazwę testu w kolumnie *Test* i zmień status reguły na `✅` (gdy cała reguła jest zaimplementowana i przetestowana).
   - Uruchom `python tools/backlog/gen_jira_csv.py --check` oraz `npm run check`.
