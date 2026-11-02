<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/07-decyzje-adr/0004-kernel-od-nowa-deterministyczny.md @ a2bf2a4 (2026-11-02) -->
# ADR-0004: Silnik reguł pisany od nowa, czysty i deterministyczny

- **Status:** zatwierdzona (2026-10-27)
- **Data:** 2026-10-27
- **Powiązane:** ADR-0005, `src/Rejoltance.Kernel`, reguły R-83, R-84

## Kontekst i problem

Mamy dwa stare silniki. Pierwszy to `CardGame.Core` w C#/Godot (9 258 LOC, czyli linii kodu, 64 testy, repo `Bluzacy2/CardGame`).
Nie mamy go lokalnie, a jego audyt był zbyt optymistyczny. Drugi to prototyp JS, który ma luki: brak seeda, UI w silniku, cichy `return []`,
karty wpisane na sztywno w kod, brak modelu „czekam na gracza”. [V]
Serwer autorytatywny, replay, bot i testy wymagają silnika, który jest czysty i powtarzalny.

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Refaktor starego C# Core („ścieżka B”) | 64 testy na start | reguły ≠ kanon JS; singletony; brak dostępu do repo; przenosi dziury | niepewny |
| Port 1:1 z JS | szybki start | przenosi wszystkie błędy z listy D‑nn | wysoki dług |
| **Nowy Kernel wg kontraktów** | determinizm, `PendingInteraction`, testy R‑nn od pierwszego dnia | trzeba napisać wszystko | ~ MVP 340 h wg analizy |

## Decyzja

W kontekście serwera autorytatywnego i potrzeby replayów, mierząc się z błędami obu starych silników, wybieramy **nowy Kernel w C#:
niemutowalny `MatchState`, `reduce(state, seat, intent) → (state, events)`, `SeededRng` (SplitMix64) w stanie, `PendingInteraction` zamiast blokowania**
zamiast refaktoru lub portu, aby każdy mecz był powtarzalny z seeda i listy intencji, akceptując koszt napisania reguł od zera
(stare 64 testy C# traktujemy jako listę przypadków brzegowych, nie jako kod).

## Konsekwencje

### Pozytywne

- Build blokuje w Kernelu `System.Random`, zegar i IO, czyli operacje wejścia-wyjścia (`BannedSymbols.txt`). Testy granic działają w CI (ciągłej integracji).
- Replay to seed i lista intencji (`MatchSessionManager` już je zapisuje).

### Negatywne / ryzyka

- Największe ryzyko projektu to zakres reguł (55 wymagań). Mitygacja: linia cięcia w backlogu i wyrocznia JS (E5-S04).
