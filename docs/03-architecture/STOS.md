# Stos technologiczny i roadmapa technologiczna

**Stan:** 2026-11-01 · wersje z `global.json`, `Directory.Packages.props`, `package-lock.json` [V] · **Źródło prawdy:** repo.
Zmiana technologii = ADR; aktualizacje wersji — Dependabot (co tydzień) + PR z zielonym CI.

## 1. Technologie

| Warstwa | Technologia | Wersja | Do czego | Decyzja |
|---|---|---|---|---|
| Język, runtime | C#, .NET SDK | 10.0 (LTS, `rollForward: latestFeature`) | serwer, Kernel, testy | ADR-0001 |
| Serwer | ASP.NET Core + SignalR | 10.0 | REST, WebSocket, hosting klienta | ADR-0001, ADR-0006 |
| Dane | Entity Framework Core + SQLite | 10.0.14 | konta, talie, historia meczów | ADR-0007 |
| Dane (od S4) | PostgreSQL (kontener Aspire) | 16+ [Z] | demo / produkcja | ADR-0007 |
| Orkiestracja | Aspire (AppHost SDK, `Aspire.Hosting.JavaScript`) | 13.6.4 | jedno polecenie uruchamia całość, panel | ADR-0001 |
| Telemetria | OpenTelemetry (.NET) | 1.17.0 | logi, metryki, ślady | ServiceDefaults |
| Klient | React | 19.3 | UI | ADR-0001 |
| | TypeScript | 5.9 | typy, kontrakt | ADR-0010 |
| | Vite | 8.3 | dev server, build | — |
| | Zustand | 5.0 | stan klienta | — |
| | `@microsoft/signalr` | 10.0 | połączenie z hubem | — |
| Testy .NET | xUnit | 2.9.3 | testy jednostkowe i integracyjne | — |
| | NetArchTest.Rules | 1.3.2 | testy granic modułów | NFR-50 |
| | Microsoft.AspNetCore.Mvc.Testing, SignalR.Client | 10.0.14 | serwer w pamięci + prawdziwy klient hubu | — |
| | Aspire.Hosting.Testing | 13.6.4 | smoke test całej aplikacji | NFR-60 |
| Testy web | Vitest, Testing Library, jsdom | 4.1 / 16.3 / 27.4 | komponenty, store, kontrakt | — |
| Testy E2E | Playwright | [Z] od E6-S01 | scenariusze w przeglądarkach | NFR-10 |
| Jakość kodu | Roslyn analyzers (`latest-recommended`), BannedApiAnalyzers 5.6, `dotnet format`, ESLint 10 | — | standardy, determinizm Kernela | NFR-52 |
| Specyfikacje | OpenSpec | 1.15.0 | SDD, walidacja w CI | ADR-0003 |
| Dokumentacja | Markdown + markdownlint-cli2 0.20, Mermaid | — | docs-as-code | ADR-0011 |
| Narzędzia | Python 3.11+ (biblioteka standardowa) | — | sync agentów, karty, backlog → Jira | — |
| CI/CD | GitHub Actions, Dependabot | — | build, testy, mirror, Pages | ADR-0002 |
| Agenci AI | Claude Code, Antigravity, Codex, GitHub Copilot, Gemini | — | wsparcie SDD wg konstytucji | ADR-0009 |
| Proces | Jira DC, Confluence 8.4.5, Bitbucket 8.14.4 (PB) | — | Scrum, dokumentacja, mirror kodu | ADR-0002, ADR-0011 |

Wymagania na laptopie: .NET SDK 10, Node.js ≥ 22.13 (zalecany 24 LTS), Git, Python 3.11+ (zalecany 3.13); opcjonalnie uv, Aspire CLI; Docker/Podman od S4.

## 2. Uzasadnienie i odrzucone alternatywy

| Obszar | Wybór | Odrzucone | Dlaczego |
|---|---|---|---|
| Backend | .NET 10 | TypeScript full‑stack | znajomość C# w zespole; SignalR i EF Core gotowe (ADR-0001) |
| Transport | SignalR | surowe WebSockety, PeerJS (P2P) | reconnect, grupy, typowanie; P2P pozwalał oszukiwać (ADR-0006) |
| Frontend | React + TS + Vite | vanilla JS (prototyp), Blazor | komponenty i ekosystem animacji; typy dla kontraktu |
| Baza | SQLite → PostgreSQL | PostgreSQL od dnia 1 | brak Dockera na start (ADR-0007) |
| SDD | OpenSpec | Spec Kit, BMAD | czysta instalacja w 5 narzędziach AI, walidacja w CI (ADR-0003) |
| Kontrakt C#↔TS | próbka JSON | generator OpenAPI/NSwag | SignalR poza OpenAPI; prostota (ADR-0010) |

## 3. Roadmapa technologiczna

| Kiedy | Zmiana | Story | Wpływ |
|---|---|---|---|
| S1 | Playwright E2E w CI | E6-S01 | NFR-10 |
| S2 | ASP.NET Core Identity (konta, cookie HttpOnly), rate limiting | E6-S02, E3-S06 | NFR-40, NFR-41 |
| S3 | moduł `Rejoltance.Sim` (boty, symulator) | E5-S03, E5-S04 | NFR-51 |
| S4 | PostgreSQL w AppHost + migracje EF na obu dostawcach | E6-S03 | ADR-0007 |
| S5 | obraz kontenera + hosting demo z HTTPS | E6-S05 | NFR-61, NFR-30 |
| semestr 2 | rewizja ADR-0010 (generator typów?), replay, ewentualnie Redis dla wielu instancji | E6-S07 | — |

## 4. Zasady wersji

- Pakiety NuGet tylko w `Directory.Packages.props`; npm z `package-lock.json` (`npm ci`).
- Wersje LTS, gdy są dostępne; podbicie wersji głównej = PR z opisem zmian i zielonym CI.
- Dependabot grupuje aktualizacje Aspire i Microsoft; krytyczne podatności — naprawa w ≤ 7 dni (NFR-42).
