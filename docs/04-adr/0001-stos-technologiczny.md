# ADR-0001: Stos — .NET 10 + React/TypeScript + Aspire

- **Status:** accepted (decyzja zespołu, 2026-10-27; formalna akceptacja 2 osób na spotkaniu startowym)
- **Data:** 2026-10-27
- **Powiązane:** ADR-0007, ADR-0010, `docs/08-research/faza-1-porownanie.md`

## Kontekst i problem

Gra ma działać w przeglądarce, z autorytatywnym serwerem i botem. Zespół zna C# (wcześniejszy projekt w Godot), część osób — JS.
`REJOLTANCE-ANALIZA.md` rekomendowała jeden język (TypeScript), opisując wariant .NET + Aspire jako uczciwą alternatywę. [V]
.NET 8 kończy wsparcie 2026-11-10; .NET 10 to LTS. [V]

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| TS full‑stack (Node) | jeden język, wspólne typy | zespół słabiej zna TS na backendzie; mniej materiału do inżynierek w C# | nauka backendu TS |
| **.NET 10 + React/TS + Aspire** | znajomość C#, silne typowanie, SignalR, EF Core, orkiestracja i telemetria z Aspire | dwa toolchainy; kontrakt C#↔TS trzeba pilnować | ADR-0010 (kontrola kontraktu) |
| .NET + Blazor | jeden język | słabsza referencja UI, mniejsza społeczność do animacji kart | przepisanie UI prototypu |

## Decyzja

W kontekście gry webowej robionej przez 6 osób znających głównie C#, mierząc się z ryzykiem rozjazdu kontraktów między językami,
wybieramy **.NET 10 (ASP.NET Core + SignalR) z klientem React + TypeScript + Vite i orkiestracją Aspire 13** zamiast TS full‑stack,
aby wykorzystać znajomość C# i gotowe mechanizmy (SignalR, EF Core, telemetria), akceptując dwa toolchainy i obowiązkową kontrolę kontraktu (ADR-0010).

## Konsekwencje

### Pozytywne

- `dotnet run --project src/Rejoltance.AppHost` stawia serwer + klienta bez Dockera (zweryfikowane testem `AppHostSmokeTests`).
- Telemetria i health checks z `ServiceDefaults` za darmo.

### Negatywne / ryzyka

- Każdy laptop potrzebuje .NET 10 SDK i Node 24 (`tools/doctor.ps1`).
- Windows: Smart App Control, długie ścieżki, OneDrive — opisane w `docs/00-start/jak-zaczac.md`.

### Do zrobienia

- [x] szkielet solucji (Faza 2)
- [ ] E6-S01: CI zielone na GitHubie
