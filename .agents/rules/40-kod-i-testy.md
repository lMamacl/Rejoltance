---
trigger: model_decision
description: "Standardy kodu TypeScript (strict, Node 24), zasada głośnej porażki (fail loud), nazwy testów Rnn_ i obowiązkowe sprawdzenie przed końcem zadania."
---

# 40. Standardy kodu, determinizm i testy

> Pełna strategia jakości: [`docs/01-dokumentacja-systemowa/11-strategia-testow-qa.md`](../../docs/01-dokumentacja-systemowa/11-strategia-testow-qa.md).

## 1. TypeScript

- **Identyfikatory po angielsku**, `camelCase` dla zmiennych i pól, `PascalCase` dla typów. Komentarze o regułach gry odwołują się do numeru reguły (np. `// R-42: rozstrzyganie linii 0..3`).
- **`strict: true`**, zero `any`. Node uruchamia pliki `.ts` bez kompilacji, więc dozwolona jest tylko składnia usuwalna (`erasableSyntaxOnly`: bez `enum` i `namespace`), a importy względne mają rozszerzenie `.ts`.
- **Niemutowalny stan:** silnik zwraca nowy stan zamiast zmieniać stary (`readonly`, kopie przez `{ ...obiekt }`).
- **Fail loud:** bez pustych `catch {}` i bez cichych wartości domyślnych. Nieznane słowo DSL odrzuca walidator, a niezaimplementowana reguła rzuca `NotImplementedError` z nazwą intencji (`R-68`).

## 2. Testy reguł (`R-nn`)

Testy piszemy w Vitest. Każda reguła z [`03-indeks-regul-r-nn.md`](../../docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md) ma test, którego nazwa zaczyna się od numeru reguły:

```ts
it('R43_mutual_strike_kills_both_units_when_damage_meets_hp', () => {
  // GIVEN stan meczu i ustalone ziarno RNG
  // WHEN  engine.reduce(state, seat, intent)
  // THEN  asercje na nowym stanie i na zdarzeniach DomainEvent[]
});
```

- Testy silnika: `packages/engine/test`, testy katalogu kart: `packages/content/test`, serwera: `apps/server/test`, klienta: `apps/web/src/**/*.test.tsx`.
- Po dodaniu testu zaktualizuj status reguły (`📋 → ✅`) w indeksie R-nn.
- Testy silnika nie używają opóźnień, sieci ani plików.

## 3. Weryfikacja przed zakończeniem pracy

Przed zgłoszeniem gotowości uruchom i potwierdź zielony wynik:

- `npm run verify` — lint (z granicami modułów), typecheck, wszystkie testy, build klienta;
- `npm run check` — gdy zmieniano `openspec/` lub pliki `.md`.
