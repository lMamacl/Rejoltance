---
trigger: model_decision
description: "Standardy kodu C# (.NET 10) i TypeScript (strict), zasada głośnej porażki (fail loud), nazwy testów Rnn_ i obowiązkowe sprawdzenie przed końcem zadania."
---

# 40. Standardy kodu, determinizm i testy automatyczne

> Pełna strategia jakości: [`docs/01-dokumentacja-systemowa/11-strategia-testow-qa.md`](../../docs/01-dokumentacja-systemowa/11-strategia-testow-qa.md).

## 1. Konwencje języka C# (`.NET 10`) i TypeScript (`strict`)

- **Język identyfikatorów w kodzie:** angielski (`PascalCase` dla typów i metod w C#, `camelCase` dla pól JSON i kodu TS). Komentarze wyjaśniające zawiłości domenowe pisz po polsku z odwołaniem do numeru reguły (np. `// R-42: rozstrzyganie linii 0..3`).
- **Niemutowalność i bezpieczeństwo typów:** w `Contracts` i `Kernel` używaj niemutowalnych typów `record` / `readonly record struct`. Włączone są `<Nullable>enable</Nullable>`, `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>` oraz `strict: true` w `tsconfig.json` (zakaz typu `any`).
- **Zasada Fail Loud:** nie połykaj wyjątków pustym blokiem `catch {}` i nie maskuj brakujących danych domyślnym `null`. Nieznany kod efektu karty w `Content`/`Kernel` musi natychmiast rzucić czytelny wyjątek z identyfikatorem karty i nazwą akcji (`R-60`).

## 2. Konwencja nazewnictwa i struktury testów reguł (`R-nn`)

Każda reguła z [`03-indeks-regul-r-nn.md`](../../docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md) musi posiadać test jednostkowy nazwany według wzorca:

```csharp
[Fact]
public void R43_Mutual_strike_kills_both_units_when_damage_meets_hp()
{
    // GIVEN (stan początkowy meczu / linii i ustalone ziarno SeededRng)
    // WHEN  (wykonanie Kernel.Apply lub kroku walki)
    // THEN  (asercje na nowym MatchState oraz wyemitowanych DomainEvent[])
}
```

- Po dodaniu testu zaktualizuj kolumnę *Test* oraz status reguły (`📋 → ✅`) w [`docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md`](../../docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md).
- Testy w `Rejoltance.Kernel.Tests` nie mogą używać opóźnień czasowych (`Task.Delay` / `Thread.Sleep`) ani zewnętrznych zasobów.

## 3. Obowiązkowa weryfikacja przed zakończeniem pracy

Przed zgłoszeniem gotowości zadania zawsze uruchom i potwierdź zielony wynik:

- `dotnet build -warnaserror` oraz `dotnet test` (gdy zmieniano kod C#),
- `npm --prefix src/web run typecheck && npm --prefix src/web test && npm --prefix src/web run build` (gdy zmieniano kod `src/web`),
- `npm run check` (gdy zmieniano `openspec/` lub pliki `.md`).
