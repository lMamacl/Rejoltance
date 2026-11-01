# 03-architecture — architektura i stos (SDD: plan)

| Plik | Co | Strona w Confluence |
|---|---|---|
| [`MAP.md`](MAP.md) | krótka mapa kodu dla programistów: warstwy, 5 kontraktów, „gdzie co dodać”. **Zacznij tutaj.** | 4.4 / 3.1 |
| [`SAD.md`](SAD.md) | dokument architektury: cele jakościowe, kontekst i kontenery (C4), przebiegi, wdrożenie, koncepcje przekrojowe, model danych, ryzyka | 3.1 |
| [`STOS.md`](STOS.md) | stos technologiczny z wersjami, uzasadnieniem i roadmapą technologiczną | 3.2 |
| [`API.md`](API.md) | REST, hub SignalR, kontrakty (`Intent`, `MatchView`, `DomainEvent`) | 3.4 |
| [`UX.md`](UX.md) | mapa ekranów, wireframe planszy, przepływy, przewodnik stylu | 3.5 |

Granice modułów są wymuszane testami: `tests/Rejoltance.Architecture.Tests`. Decyzje i ich uzasadnienia: [`../04-adr`](../04-adr/README.md).
Wymagania jakościowe: `openspec/specs/quality-attributes/spec.md`.
