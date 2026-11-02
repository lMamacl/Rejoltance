---
trigger: always_on
description: "Hierarchia zrodel prawdy (OpenSpec, prototyp JS v11, indeks R-nn), zakaz cichego zgadywania przez AI oraz obsluga rozbieznosci D-01..D-20."
---

# 10. Prawda, hierarchia źródeł i postępowanie z niepewnością

## 1. Hierarchia źródeł prawdy dla zasad gry (ADR-0005)

W przypadku pozornej sprzeczności pomiędzy dokumentami obowiązuje następująca kolejność pierwszeństwa:

1. **Rozstrzygnięta decyzja zespołu** wpisana w [`docs/01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md`](../../docs/01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md) (`D-01..D-20`) oraz zatwierdzona specyfikacja w `openspec/specs/<domena>/spec.md`.
2. **Zachowanie referencyjnego prototypu JS v11** (`prototype/revibance/engine.js` oraz `prototype/revibance/cards.js`).
3. **Indeks i specyfikacja reguł:** [`03-indeks-regul-r-nn.md`](../../docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md) oraz [`02-specyfikacja-regul-gry.md`](../../docs/01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md).
4. **Archiwalne materiały źródłowe** w `docs/99-archiwum-zrodel/` (wyłącznie poglądowe — nie nadpisują kanonu v11).

## 2. Zakaz cichego zgadywania przez agenta AI

- **Nie dopowiadaj reguł z pamięci ogólnej o grach karcianych:** RE:JOLTANCE ma własne, ścisłe zasady (np. brak pasowania w kroku akcji — każde zakończenie kroku jest definitywne wg `R-17`; nadmiar obrażeń z `Breakthrough` nie przechodzi na lidera wg `R-52`).
- **Sprawdzaj status reguły przed kodowaniem:** zanim zaimplementujesz regułę `R-nn`, sprawdź w [`03-indeks-regul-r-nn.md`](../../docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md), czy nie ma statusu `❓` lub odwołania do nierozstrzygniętego błędu `D-nn`.
- **Zatrzymaj się przy otwartej rozbieżności:** jeśli zadanie dotyka nierozstrzygniętego punktu w [`04-rozbieznosci-prototypu.md`](../../docs/01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md) lub otwartego pytania w [`06-decyzje-otwarte-i-zalozenia.md`](../../docs/00-przewodnik-i-setup/06-decyzje-otwarte-i-zalozenia.md), przedstaw człowiekowi dostępne warianty i poproś o decyzję przed napisaniem kodu.

## 3. Weryfikowalność twierdzeń technicznych

- Każdą odpowiedź o zachowaniu istniejącego kodu opieraj na wskazaniu konkretnego pliku i linii lub wyniku uruchomionego testu (`dotnet test`, `npm test`).
- Nie deklaruj, że kod działa lub przechodzi testy, dopóki faktycznie nie uruchomisz komendy weryfikującej i nie sprawdzisz jej kodu wyjścia (`0`).
- Jeśli ze względów technicznych nie możesz uruchomić danej komendy w bieżącym środowisku, poinformuj o tym wprost i podaj dokładną komendę do uruchomienia przez dewelopera.
