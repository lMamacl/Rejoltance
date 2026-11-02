<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/07-decyzje-adr/0001-stos-technologiczny.md @ a2bf2a4 (2026-11-02) -->
# ADR-0001: Stos — .NET 10 + React/TypeScript + Aspire

- **Status:** zatwierdzona (decyzja zespołu, 2026-10-27; formalna akceptacja 2 osób na spotkaniu startowym)
- **Data:** 2026-10-27
- **Powiązane:** ADR-0007, ADR-0010, [`03-dokumentacja-procesowa/04-badania-i-analizy/faza-1-porownanie.md`](../../03-dokumentacja-procesowa/04-badania-i-analizy/faza-1-porownanie.md)

## Kontekst i problem

Gra ma działać w przeglądarce. Potrzebuje autorytatywnego serwera (to serwer decyduje o stanie gry) i bota.
Zespół zna C# z wcześniejszego projektu w Godot. Część osób zna też JavaScript (JS).
Analiza `REJOLTANCE-ANALIZA.md` zalecała jeden język (TypeScript, TS). Wariant .NET + Aspire opisała jako uczciwą alternatywę. [V]
.NET 8 traci wsparcie 2026-11-10. .NET 10 to wersja LTS (Long-Term Support, z wydłużonym wsparciem). [V]

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| TS full‑stack (Node) | jeden język, wspólne typy | zespół słabiej zna TS na backendzie; mniej materiału do prac inżynierskich w C# | nauka backendu w TS |
| **.NET 10 + React/TS + Aspire** | znajomość C#, silne typowanie, SignalR, EF Core, orkiestracja i telemetria z Aspire | dwa toolchainy; kontrakt C#↔TS trzeba pilnować | ADR-0010 (kontrola kontraktu) |
| .NET + Blazor | jeden język | słabsza referencja UI, mniejsza społeczność do animacji kart | przepisanie UI prototypu |

## Decyzja

W kontekście gry webowej robionej przez 6 osób znających głównie C#, mierząc się z ryzykiem rozjazdu kontraktów między językami,
wybieramy **.NET 10 (ASP.NET Core + SignalR) z klientem React + TypeScript + Vite i orkiestracją Aspire 13** zamiast TS full‑stack,
aby wykorzystać znajomość C# i gotowe mechanizmy (SignalR, EF Core, telemetria), akceptując dwa toolchainy i obowiązkową kontrolę kontraktu (ADR-0010).

## Konsekwencje

### Pozytywne

- `dotnet run --project src/Rejoltance.AppHost` uruchamia serwer i klienta bez Dockera (zweryfikowane testem `AppHostSmokeTests`).
- Telemetrię i health checks (sprawdzanie stanu usługi) dostajemy za darmo z `ServiceDefaults`.

### Negatywne / ryzyka

- Każdy laptop potrzebuje .NET 10 SDK i Node 24 (sprawdza to `tools/doctor.ps1`).
- Na Windows przeszkadzają Smart App Control, długie ścieżki i OneDrive. Opisujemy to w [`00-przewodnik-i-setup/01-szybki-start-i-instalacja.md`](../../00-przewodnik-i-setup/01-szybki-start-i-instalacja.md).

### Do zrobienia

- [x] szkielet solucji (Faza 2)
- [ ] E6-S01: CI (ciągła integracja) zielone na GitHubie
