# ADR-0007: SQLite na start, PostgreSQL od Sprintu 4

- **Status:** accepted (2026-10-27)
- **Data:** 2026-10-27
- **Powiązane:** `RejoltanceDb.cs`, `AppHost.cs`, E6-S04, pytanie otwarte #10

## Kontekst i problem

Do Sprintu 2 baza jest prawie niepotrzebna (mecze żyją w pamięci). PostgreSQL w Aspire wymaga Dockera/Podmana na każdym laptopie. [V]

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| PostgreSQL od razu | zgodność z produkcją | Docker u 6 osób od dnia 1 | blokada startu |
| **SQLite → PostgreSQL** | zero instalacji; EF Core ukrywa różnice | dwa dostawcy do przetestowania | migracje trzeba sprawdzić na obu |
| Bez bazy | najprościej | przesuwa problem | — |

## Decyzja

W kontekście startu bez Dockera, wybieramy **EF Core z SQLite (plik `.data/rejoltance.db`) do Sprintu 3 i PostgreSQL jako kontener Aspire
od Sprintu 4** zamiast PostgreSQL od razu, aby nikt nie był zablokowany instalacją, akceptując konieczność testów migracji na obu dostawcach.

## Konsekwencje

### Pozytywne

- `dotnet run --project src/Rejoltance.AppHost` działa bez Dockera (zweryfikowane).

### Negatywne / ryzyka

- Do S4 każdy musi mieć Docker/Podman albo korzystać z SQLite lokalnie (#10).
- Unikać funkcji specyficznych dla jednego silnika (np. typy JSON) bez testu na obu.
