# ADR-0004: Silnik reguł pisany od nowa, czysty i deterministyczny

- **Status:** accepted (2026-10-27)
- **Data:** 2026-10-27
- **Powiązane:** ADR-0005, `src/Rejoltance.Kernel`, reguły R-83, R-84

## Kontekst i problem

Istnieją dwa stare silniki: C#/Godot `CardGame.Core` (9 258 LOC, 64 testy, repo `Bluzacy2/CardGame` — niedostępne lokalnie, audyt zbyt optymistyczny)
oraz prototyp JS (dziurawy: brak seeda, UI w silniku, cichy `return []`, hardcod kart, brak modelu „czekam na gracza”). [V]
Serwer autorytatywny, replay, bot i testy wymagają silnika, który jest czysty i powtarzalny.

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Refaktor starego C# Core („ścieżka B”) | 64 testy na start | reguły ≠ kanon JS; singletony; brak dostępu do repo; przenosi dziury | niepewny |
| Port 1:1 z JS | szybki start | przenosi wszystkie błędy z listy D‑nn | wysoki dług |
| **Nowy Kernel wg kontraktów** | determinizm, `PendingInteraction`, testy R‑nn od dnia 1 | trzeba napisać wszystko | ~ MVP 340 h wg analizy |

## Decyzja

W kontekście serwera autorytatywnego i potrzeby replayów, mierząc się z błędami obu starych silników, wybieramy **nowy Kernel w C#:
niemutowalny `MatchState`, `reduce(state, seat, intent) → (state, events)`, `SeededRng` (SplitMix64) w stanie, `PendingInteraction` zamiast blokowania**
zamiast refaktoru lub portu, aby każdy mecz był powtarzalny z seeda i listy intencji, akceptując koszt napisania reguł od zera
(stare 64 testy C# traktujemy jako listę przypadków brzegowych, nie kod).

## Konsekwencje

### Pozytywne

- Build blokuje `System.Random`, zegar i IO w Kernelu (`BannedSymbols.txt`); testy granic w CI.
- Replay = seed + intencje (`MatchSessionManager` już je zapisuje).

### Negatywne / ryzyka

- Największe ryzyko projektu: zakres reguł (55 wymagań). Mitygacja: linia cięcia w backlogu, wyrocznia JS (E5-S04).
