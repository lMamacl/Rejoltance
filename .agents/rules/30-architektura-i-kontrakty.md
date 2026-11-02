---
trigger: model_decision
description: "Granice 5 modulow architektonicznych (Web -> Server -> Kernel -> Content -> Contracts), czystosc Rejoltance.Kernel i ochrona 5 zamrozonych kontraktow."
---

# 30. Architektura warstwowa i ochrona kontraktów

> Pełny opis architektury: [`docs/01-dokumentacja-systemowa/05-sad-architektura-systemu.md`](../../docs/01-dokumentacja-systemowa/05-sad-architektura-systemu.md) oraz [`08-mapa-kodu-i-modulow.md`](../../docs/01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md).

## 1. Kierunek zależności pomiędzy modułami

```text
src/web (React/TS) ──(HTTP / SignalR JSON)──► Rejoltance.Server
                                                    │
                                                    ▼
                                            Rejoltance.Kernel
                                                    │
                                                    ▼
                                            Rejoltance.Content
                                                    │
                                                    ▼
                                           Rejoltance.Contracts
```

- **`Rejoltance.Contracts`:** zero zależności wewnętrznych. Zawiera wyłącznie niemutowalne rekordy DTO i wyliczenia.
- **`Rejoltance.Content`:** zależy wyłącznie od `Contracts`. Wczytuje `cards.json` i waliduje schemat kart.
- **`Rejoltance.Kernel`:** zależy wyłącznie od `Contracts` i `Content`. **Zakaz** używania `System.IO`, `System.Net.Http`, `Microsoft.AspNetCore.*`, `Microsoft.EntityFrameworkCore.*`, `DateTime.Now`, `DateTime.UtcNow`, `Guid.NewGuid()` oraz `System.Random`.
- **`Rejoltance.Server`:** hostuje `MatchHub`, sesje meczowe, bazę EF Core i wywołuje `Kernel.Apply` oraz `Projection.ToView`.
- **`src/web`:** klient przeglądarkowy — renderuje wyłącznie `MatchView` i wysyła `Intent`. Nie duplikuje logiki reguł gry.

Granice te są automatycznie weryfikowane przez `tests/Rejoltance.Architecture.Tests/LayerDependencyTests.cs`.

## 2. Pięć zamrożonych kontraktów komunikacyjnych

1. `Intent` — intencja akcji gracza wysyłana z klienta do serwera.
2. `LegalAction` — dozwolona akcja wyliczona przez silnik dla aktywnego gracza.
3. `PendingInteraction` — oczekiwanie silnika na wybór celu lub opcji przez gracza.
4. `MatchView` — przefiltrowany widok stanu meczu dla konkretnego gracza (*Fog of War* — `R-66`).
5. `DomainEvent` — fakt domenowy wyemitowany podczas rozstrzygania intencji (podstawa animacji UI i dziennika).

Każda zmiana tych typów wymaga: (1) nowego **ADR**, (2) symetrycznej aktualizacji C# i TypeScriptu oraz (3) aktualizacji próbek w `tests/Rejoltance.Contracts.Tests/ContractSampleTests.cs`.
