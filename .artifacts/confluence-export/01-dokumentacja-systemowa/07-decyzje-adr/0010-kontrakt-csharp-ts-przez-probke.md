<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/07-decyzje-adr/0010-kontrakt-csharp-ts-przez-probke.md @ a2bf2a4 (2026-11-02) -->
# ADR-0010: Zgodność kontraktu C# ↔ TypeScript przez wspólną próbkę JSON

- **Status:** proponowana (do akceptacji; rewizja po Sprincie 2)
- **Data:** 2026-10-27
- **Powiązane:** ADR-0001, `src/Rejoltance.Contracts`, `src/web/src/contracts`, `ContractSampleTests`

## Kontekst i problem

Przy dwóch językach kontrakt, czyli format danych między serwerem a klientem, może się rozjechać.
`REJOLTANCE-ANALIZA.md` uważa generator typów (OpenAPI/NSwag → TS) za obowiązkowy (~12 h). [V]
Główny kanał komunikacji to SignalR, a nie REST. OpenAPI go nie opisuje. [V]

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Generator OpenAPI → TS | typy z jednego źródła | nie obejmuje SignalR; dodatkowy toolchain | ~12 h + utrzymanie |
| Ręczne typy bez kontroli | zero kosztu | rozjazd w 3. tygodniu | wysokie |
| **Próbka JSON jako „złoty plik”** | obejmuje format SignalR; prosta; sprawdzana testem | typy TS pisane ręcznie | niskie |

## Decyzja

W kontekście kontraktu przesyłanego głównie przez SignalR, wybieramy **próbkę `match-view.sample.json` generowaną przez test C# (`ContractSampleTests`)
i sprawdzaną kompilatorem TypeScript (`contracts.test.ts`)** zamiast generatora OpenAPI, aby rozjazd C#↔TS psuł build po obu stronach,
akceptując ręczne utrzymanie typów TS (zmiana w jednym PR, czyli pull requeście, art. IV konstytucji). Celowe zepsucie nazwy pola zostało wykryte przez `tsc`. [V]

## Konsekwencje

### Pozytywne

- Zero dodatkowych narzędzi; działa dla REST i SignalR.

### Negatywne / ryzyka

- Próbka pokrywa tylko pola obecne w przykładowym stanie (np. pusta plansza). Wraz z rozwojem dokładamy kolejne próbki (`match-view.combat.sample.json`).
- Rewizja po S2 (Sprincie 2): jeśli kontraktów przybędzie, rozważymy generator (np. TypeGen/NTypewriter).
