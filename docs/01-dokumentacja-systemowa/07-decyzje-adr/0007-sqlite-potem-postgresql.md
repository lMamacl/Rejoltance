# ADR-0007: SQLite na start, PostgreSQL od Sprintu 4

- **Status:** zatwierdzona (2026-10-27)
- **Data:** 2026-10-27
- **Powiązane:** `RejoltanceDb.cs`, `AppHost.cs`, E6-S04, pytanie otwarte #10

## Kontekst i problem

Do Sprintu 2 baza danych jest prawie niepotrzebna, bo mecze żyją w pamięci. PostgreSQL w Aspire wymaga Dockera lub Podmana na każdym laptopie. [V]

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| PostgreSQL od razu | zgodność z produkcją | Docker u 6 osób od pierwszego dnia | blokada startu |
| **SQLite → PostgreSQL** | zero instalacji; EF Core ukrywa różnice | dwóch dostawców do przetestowania | migracje trzeba sprawdzić na obu |
| Bez bazy | najprościej | przesuwa problem | — |

## Decyzja

W kontekście startu bez Dockera, wybieramy **EF Core z SQLite (plik `.data/rejoltance.db`) do Sprintu 3 i PostgreSQL jako kontener Aspire
od Sprintu 4** zamiast PostgreSQL od razu, aby nikt nie był zablokowany instalacją, akceptując konieczność testów migracji na obu dostawcach.

## Konsekwencje

### Pozytywne

- `dotnet run --project src/Rejoltance.AppHost` działa bez Dockera (zweryfikowane).

### Negatywne / ryzyka

- Do S4 (Sprintu 4) każdy musi mieć Docker lub Podman albo korzystać lokalnie z SQLite (#10).
- Unikamy funkcji specyficznych dla jednego silnika bazy (np. typów JSON), jeśli nie przetestowaliśmy ich na obu.
