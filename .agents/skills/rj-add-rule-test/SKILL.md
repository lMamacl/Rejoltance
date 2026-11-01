---
name: rj-add-rule-test
description: Turns a game rule into an executable test - finds the behaviour in the JS prototype, assigns or reuses an R-nn id, writes an xUnit test named Rnn_..., and updates RULES-INDEX. Use for any kernel rule work.
---

# Reguła gry → test R‑nn

## Kroki

1. Znajdź zachowanie w `prototype/revibance/engine.js` (zapisz funkcję i linię).
2. Sprawdź `docs/02-rules/RULES-INDEX.md`: reguła ma już numer? Jeśli nie — weź kolejny wolny `R-nn` i dopisz wiersz (opis, źródło, test, status).
3. Czy to znany błąd prototypu? → `docs/02-rules/ROZBIEZNOSCI.md`. Wtedy test pisze się dopiero po decyzji zespołu.
4. Test w `tests/Rejoltance.Kernel.Tests/` (plik tematyczny, np. `CombatRulesTests.cs`):

   ```csharp
   [Fact]
   public void R12_flying_unit_hits_hero_when_defender_cannot_fly()
   {
       // GIVEN stan zbudowany z TestMatches + `with { … }`
       // WHEN engine.Reduce(...)
       // THEN asercje na stan i zdarzenia (DomainEvent)
   }
   ```

5. Test ma być czerwony przed implementacją z właściwego powodu (`NotImplementedException` lub zła wartość).
6. `dotnet test tests/Rejoltance.Kernel.Tests --filter "FullyQualifiedName~R12"`.

## Wyjście

Numer reguły, ścieżka testu, wynik uruchomienia, wiersz w `RULES-INDEX.md`.
