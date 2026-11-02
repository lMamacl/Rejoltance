# RE:JOLTANCE

**Sieciowa taktyczna gra karciana (*lane battler*) z autorytatywnym serwerem .NET 10, klientem React/TypeScript i procesem Spec-Driven Development (SDD).**

Projekt zespołowy (6 osób, 2 semestry) realizowany na Wydziale Informatyki Politechniki Białostockiej.

---

## Szybki start (3 komendy)

Wymagania wstępne: **.NET 10 SDK**, **Node.js 24 LTS**, **Python 3.11+**, **Git**.

```powershell
# 1. Jednorazowa konfiguracja środowiska (instalacja zależności, OpenSpec, adapterów agentów AI)
pwsh tools/setup.ps1

# 2. Uruchomienie pełnego systemu (serwer gry ASP.NET Core + klient webowy Vite przez .NET Aspire)
dotnet run --project src/Rejoltance.AppHost

# 3. Uruchomienie wszystkich testów, walidacji specyfikacji OpenSpec i strażników jakości
dotnet test
npm run check
```

> Szczegółowa instrukcja instalacji i rozwiązywania problemów (Windows Smart App Control, OneDrive, długie ścieżki): [`docs/00-przewodnik-i-setup/01-szybki-start-i-instalacja.md`](docs/00-przewodnik-i-setup/01-szybki-start-i-instalacja.md).

---

## Architektura Dokumentacji Technicznej (1:1 z Confluence PB — AltexSoft + SDD)

Cała dokumentacja projektu w katalogu [`docs/`](docs/README.md) została zaprojektowana według klasyfikacji **AltexSoft** (*Technical Documentation in Software Development: Types, Best Practices, and Tools*) oraz powiązana z etapami cyklu życia **Spec-Driven Development (SDD)**. Układ katalogów **odpowiada 1:1 drzewu stron w przestrzeni Confluence PB**:

| Katalog w `docs/` (1:1 ze stroną nadrzędną w Confluence) | Kategoria wg AltexSoft | Najważniejsze dokumenty w sekcji |
|---|---|---|
| **[`00-przewodnik-i-setup/`](docs/00-przewodnik-i-setup/README.md)** | *Standardy i konfiguracja* | [Szybki start](docs/00-przewodnik-i-setup/01-szybki-start-i-instalacja.md) · [Architektura dokumentacji SDD](docs/00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md) · [Proces Git/Jira/Scrum](docs/00-przewodnik-i-setup/03-proces-pracy-i-git-scrum.md) · [Ściąga komend](docs/00-przewodnik-i-setup/04-sciaga-komend.md) · [Słownik](docs/00-przewodnik-i-setup/05-slownik-pojec.md) · [Decyzje otwarte](docs/00-przewodnik-i-setup/06-decyzje-otwarte-i-zalozenia.md) · **[Plan wdrożenia i migracji](docs/00-przewodnik-i-setup/07-plan-wdrozenia-i-migracji.md)** |
| **[`01-dokumentacja-systemowa/`](docs/01-dokumentacja-systemowa/README.md)** | *Dokumentacja produktowa — systemowa* | **[PRD — Wymagania produktu](docs/01-dokumentacja-systemowa/01-prd-wymagania-produktu.md)** · [Specyfikacja reguł gry](docs/01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md) · [Indeks R-nn](docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md) · **[SAD — Architektura systemu](docs/01-dokumentacja-systemowa/05-sad-architektura-systemu.md)** · **[Stos technologiczny i roadmapa IT](docs/01-dokumentacja-systemowa/06-stos-technologiczny.md)** · [Decyzje ADR 0001–0011](docs/01-dokumentacja-systemowa/07-decyzje-adr/README.md) · [Mapa kodu](docs/01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md) · [Kontrakty i API](docs/01-dokumentacja-systemowa/09-kontrakty-i-api.md) · [Projekt UX](docs/01-dokumentacja-systemowa/10-ux-design-i-przeplywy.md) · [Strategia testów QA](docs/01-dokumentacja-systemowa/11-strategia-testow-qa.md) |
| **[`02-dokumentacja-uzytkownika/`](docs/02-dokumentacja-uzytkownika/README.md)** | *Dokumentacja produktowa — użytkownika* | [Podręcznik gracza](docs/02-dokumentacja-uzytkownika/01-podrecznik-gracza.md) · [Instrukcja wdrożenia i utrzymania (dla administratora)](docs/02-dokumentacja-uzytkownika/02-instrukcja-wdrozenia-i-utrzymania.md) |
| **[`03-dokumentacja-procesowa/`](docs/03-dokumentacja-procesowa/README.md)** | *Dokumentacja procesowa* | [Dokument Inicjujący Projekt (DIP)](docs/03-dokumentacja-procesowa/01-dip-dokument-inicjujacy.md) · [Rejestr produktu i pliki CSV do Jiry](docs/03-dokumentacja-procesowa/02-backlog/BACKLOG.md) · [Scrum i spotkania](docs/03-dokumentacja-procesowa/03-scrum-i-spotkania/README.md) · [Badania i analizy](docs/03-dokumentacja-procesowa/04-badania-i-analizy/README.md) |
| **[`04-system-agentow-ai/`](docs/04-system-agentow-ai/README.md)** | *Podręcznik inżynierii agentowej i SDD* | [Architektura i konfiguracja agentów](docs/04-system-agentow-ai/01-architektura-i-konfiguracja-agentow.md) · [Katalog 10 ról i wbudowanych umiejętności](docs/04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md) · [Jak pisać specyfikacje OpenSpec](docs/04-system-agentow-ai/03-jak-pisac-specyfikacje-openspec.md) · [Warsztat dla ludzi: budowa agentów, umiejętności i kart](docs/04-system-agentow-ai/04-warsztat-tworzenie-agentow-skilli-i-kart.md) |
| **[`05-szablony/`](docs/05-szablony/README.md)** | *Biblioteka szablonów dokumentacji* | Szablony: [PRD](docs/05-szablony/szablon-prd.md), [SAD](docs/05-szablony/szablon-sad.md), [Projekt techniczny TDD](docs/05-szablony/szablon-tdd.md), [Persona UX](docs/05-szablony/szablon-ux-persona-scenariusz.md), [Test użyteczności UX](docs/05-szablony/szablon-ux-test-uzytecznosci.md), [Karta modułu (EU5)](docs/05-szablony/szablon-karta-modulu.md), [Plan i raport testów QA (EU6)](docs/05-szablony/szablon-qa-plan-testow.md), [Informacja o wydaniu](docs/05-szablony/szablon-informacja-o-wydaniu.md) |

---

## Struktura repozytorium

```text
Rejoltance/
├── docs/                       ← Dokumentacja techniczna i procesowa (układ 1:1 z Confluence PB)
├── openspec/                   ← Spec-Driven Development: żywe specyfikacje (specs/) i propozycje zmian (changes/)
├── .agents/                    ← Kanon systemu agentów AI (rules/, agents/, skills/) + adaptery IDE
├── src/
│   ├── Rejoltance.Contracts/   ← 5 zamrożonych kontraktów DTO (Intent, LegalAction, PendingInteraction, MatchView, DomainEvent)
│   ├── Rejoltance.Content/     ← Katalog 69 kart z cards.json i walidator schematu
│   ├── Rejoltance.Kernel/      ← Czysty, deterministyczny silnik reguł gry w C# (zero I/O, SeededRng)
│   ├── Rejoltance.Server/      ← Autorytatywny serwer ASP.NET Core + SignalR (/hubs/match) + projekcja Fog of War
│   ├── Rejoltance.AppHost/     ← Orkiestrator deweloperski .NET Aspire
│   └── web/                    ← Klient przeglądarkowy React 19 + TypeScript 5 + Vite
├── tests/                      ← Testy jednostkowe, integracyjne, kontraktowe, architektoniczne i E2E (Playwright)
├── prototype/revibance/        ← Referencyjny prototyp JS v11 (wyrocznia zachowania reguł gry)
└── tools/                      ← Skrypty automatyzacji: agents/, backlog/, content/, confluence/
```

---

## Najważniejsze strażniki jakości (CI / Lokalnie)

| Komenda | Co weryfikuje? |
|---|---|
| `dotnet build -warnaserror` | Kompilacja wszystkich projektów C# z zerową tolerancją ostrzeżeń |
| `dotnet test` | Testy reguł (`Rnn_`), architektury, kontraktów JSON i integracji serwera |
| `npm run check` | Walidacja `openspec validate --all --strict` oraz linter dokumentacji `markdownlint-cli2` |
| `python tools/agents/sync_agents.py --check` | Spójność definicji 10 agentów, 10 skilli, 8 reguł i adapterów narzędzi AI |
| `python tools/backlog/gen_jira_csv.py --check` | Dwukierunkowa spójność `backlog.toml`, `BACKLOG.md`, plików CSV Jiry i `03-indeks-regul-r-nn.md` |
| `python tools/content/extract_cards.py --check` | Zgodność katalogu `cards.json` z referencyjnym prototypem JS v11 |
| `python tools/confluence/sync_confluence.py --check` | Gotowość drzewa `docs/` do eksportu 1:1 do przestrzeni Confluence PB |
