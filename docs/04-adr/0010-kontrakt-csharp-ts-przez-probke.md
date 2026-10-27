# ADR-0010: Zgodność kontraktu C# ↔ TypeScript przez wspólną próbkę JSON

- **Status:** proposed (do akceptacji; rewizja po Sprincie 2)
- **Data:** 2026-10-27
- **Powiązane:** ADR-0001, `src/Rejoltance.Contracts`, `src/web/src/contracts`, `ContractSampleTests`

## Kontekst i problem

Przy dwóch językach kontrakt może się rozjechać. `REJOLTANCE-ANALIZA.md` uważa generator typów (OpenAPI/NSwag → TS) za obowiązkowy (~12 h). [V]
Główny kanał to SignalR (nie REST), którego OpenAPI nie opisuje. [V]

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Generator OpenAPI → TS | typy z jednego źródła | nie obejmuje SignalR; dodatkowy toolchain | ~12 h + utrzymanie |
| Ręczne typy bez kontroli | zero kosztu | rozjazd w 3. tygodniu | wysokie |
| **Próbka JSON jako „złoty plik”** | obejmuje format SignalR; prosty; sprawdzony testem | typy TS pisane ręcznie | niskie |

## Decyzja

W kontekście kontraktu przesyłanego głównie przez SignalR, wybieramy **próbkę `match-view.sample.json` generowaną przez test C# (`ContractSampleTests`)
i sprawdzaną kompilatorem TypeScript (`contracts.test.ts`)** zamiast generatora OpenAPI, aby rozjazd C#↔TS psuł build po obu stronach,
akceptując ręczne utrzymanie typów TS (zmiana w jednym PR, art. IV konstytucji). Celowe zepsucie nazwy pola zostało wykryte przez `tsc`. [V]

## Konsekwencje

### Pozytywne

- Zero dodatkowych narzędzi; działa dla REST i SignalR.

### Negatywne / ryzyka

- Próbka pokrywa tylko pola obecne w przykładowym stanie (np. pusta plansza) — dokładać próbki (`match-view.combat.sample.json`) wraz z rozwojem.
- Rewizja po S2: jeśli kontraktów przybędzie, rozważyć generator (np. TypeGen/NTypewriter).
