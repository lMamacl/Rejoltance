# 0.1 Szybki start i instalacja środowiska deweloperskiego

> **Źródło prawdy:** repozytorium (`docs/00-przewodnik-i-setup/01-szybki-start-i-instalacja.md`) · **Kategoria dokumentacji:** Instrukcja konfiguracji środowiska · **Etap SDD:** Fundamenty

Niniejsza instrukcja pozwala skonfigurować kompletne środowisko deweloperskie projektu **RE:JOLTANCE** od zera i uruchomić działający serwer gry wraz z klientem webowym w mniej niż 5 minut.

---

## 1. Wymagane oprogramowanie (instalacja jednorazowa)

Do codziennej pracy w Sprintach 0–3 **nie jest wymagany Docker**. Wszystkie komponenty (serwer ASP.NET Core, klient Vite/React oraz lokalna baza SQLite) uruchamiają się natywnie.

| Narzędzie | Wersja | Polecenie instalacji na Windows (`winget`) | Przeznaczenie w projekcie |
|---|---|---|---|
| **.NET SDK** | 10.0 LTS | `winget install Microsoft.DotNet.SDK.10` | Kompilacja i uruchamianie backendu (`Kernel`, `Content`, `Contracts`, `Server`), testów xUnit oraz orkiestratora Aspire (`AppHost`). |
| **Node.js** | 24 LTS (min. 22.13) | `winget install OpenJS.NodeJS.LTS` | Klient webowy (`src/web`), narzędzie `openspec` oraz linter dokumentacji `markdownlint-cli2`. |
| **Git** | najnowsza | `winget install Git.Git` | Kontrola wersji i praca na gałęziach zadaniowych. |
| **Python** | 3.11 – 3.13 | `winget install Python.Python.3.13` | Skrypty automatyzujące w katalogu `tools/` (synchronizacja agentów, ekstrakcja kart, generator CSV do Jiry, eksporter Confluence). |
| **uv** *(opcjonalnie)* | najnowsza | `winget install astral-sh.uv` | Uruchamianie serwera MCP (`mcp-atlassian`) do integracji agentów AI z Jirą i Confluence PB. |
| **Docker Desktop / Podman** *(od Sprintu 4)* | najnowsza | `winget install Docker.DockerDesktop` | Uruchamianie kontenera bazy danych PostgreSQL w środowisku lokalnym od Sprintu 4 (zgodnie z ADR-0007). |

---

## 2. Pobranie repozytorium i automatyczna konfiguracja

Zalecamy sklonowanie repozytorium do **krótkiej ścieżki dyskowej poza folderem synchronizowanym przez OneDrive** (np. `C:\dev\Rejoltance`). Synchronizacja OneDrive potrafi blokować pliki w katalogach `bin/`, `obj/` oraz `node_modules/`, a ścieżki przekraczające 260 znaków mogą powodować błędy procesów pomocniczych na systemie Windows.

### System Windows (PowerShell)

```powershell
git clone https://github.com/lMamacl/Rejoltance.git C:\dev\Rejoltance
cd C:\dev\Rejoltance
powershell -ExecutionPolicy Bypass -File tools/setup.ps1 -TrustDevCert
```

### Systemy macOS oraz Linux (Bash)

```bash
git clone https://github.com/lMamacl/Rejoltance.git ~/dev/Rejoltance
cd ~/dev/Rejoltance
bash tools/setup.sh
```

### Co wykonuje skrypt `setup`?

1. Uruchamia diagnostykę środowiska (`tools/doctor.ps1`), sprawdzając wersje narzędzi oraz ustawienia systemu.
2. Przy podaniu flagi `-TrustDevCert` instaluje i zatwierdza lokalny certyfikat deweloperski HTTPS dla platformy .NET (wymaga jednorazowego kliknięcia „Tak” w oknie systemowym Windows).
3. Pobiera pakiety NuGet oraz instaluje zależności npm w katalogu głównym i w `src/web`.
4. Kompiluje całą solucję `Rejoltance.slnx` i wykonuje szybkie testy jednostkowe oraz architektoniczne.

---

## 3. Uruchamianie aplikacji

### Wariant A (rekomendowany): Orkiestracja .NET Aspire jednym poleceniem

Z głównego katalogu repozytorium uruchom:

```powershell
dotnet run --project src/Rejoltance.AppHost
```

*(Jeśli masz zainstalowane narzędzie Aspire CLI, możesz użyć krótszego polecenia `aspire run`).*

Po starcie w terminalu pojawi się link do **panelu .NET Aspire Dashboard**. W panelu zobaczysz dwa uruchomione zasoby:

- **`server`** (`Rejoltance.Server`) — serwer ASP.NET Core z hubem SignalR (`/api/hubs/match`) oraz punktami końcowymi REST (`/api/info`, `/api/cards`, `/api/decks`, `/health`). Lokalna baza SQLite tworzy się automatycznie w pliku `.data/rejoltance.db`.
- **`web`** (`src/web`) — serwer deweloperski Vite z aplikacją React + TypeScript, skonfigurowany z automatycznym proxy kierującym ruch `/api/*` do serwera backendowego. Kliknij adres URL zasobu **`web`**, aby otworzyć grę w przeglądarce.

### Wariant B (awaryjny): Uruchomienie serwera i klienta w dwóch osobnych terminalach

Jeśli na Twoim komputerze polityki bezpieczeństwa systemu Windows blokują orkiestrator Aspire, możesz uruchomić oba procesy niezależnie:

1. **Terminal 1 (Backend C#):**

   ```powershell
   dotnet run --project src/Rejoltance.Server
   ```

   Odczytaj z logów startowych adres HTTP serwera (domyślnie `http://localhost:5000` lub port wskazany w `launchSettings.json`).

2. **Terminal 2 (Frontend React + Vite):**

   ```powershell
   cd src/web
   $env:SERVER_HTTP="http://localhost:5000"
   npm run dev
   ```

### Uruchomienie referencyjnego prototypu JS

Aby zagrać w oryginalny prototyp referencyjny (`prototype/revibance`), który stanowi kanon zasad gry:

```powershell
npx serve prototype/revibance
```

---

## 4. Rozwiązywanie typowych problemów

W razie jakichkolwiek problemów pierwszym krokiem jest uruchomienie bezinwazyjnego skryptu diagnostycznego:

```powershell
powershell -ExecutionPolicy Bypass -File tools/doctor.ps1
```

| Objaw błędu | Przyczyna | Rozwiązanie |
|---|---|---|
| `Could not load file or assembly ... (0x800711C7)` lub komunikat *„Zasady kontroli aplikacji zablokowały ten plik”* | Funkcja **Smart App Control** w systemie Windows 11 blokuje lokalnie kompilowane pliki DLL podczas uruchamiania przez Aspire. | Używaj **Wariantu B** (uruchamianie serwera i klienta w dwóch terminalach) albo wyłącz funkcję Smart App Control w *Ustawienia → Zabezpieczenia Windows → Kontrola aplikacji i przeglądarki* (uwaga: wyłączenie tej funkcji w Windows 11 jest nieodwracalne bez reinstalacji systemu). |
| `An error occurred trying to start process ... dcp.exe` | Ścieżka do repozytorium przekracza limit 260 znaków na Windows. | Przenieś repozytorium do krótkiej ścieżki (np. `C:\dev\Rejoltance`) i włącz obsługę długich ścieżek: `git config --system core.longpaths true`. |
| Proces zawiesza się na komunikacie *„Ufanie certyfikatom…”* | Lokalny certyfikat deweloperski HTTPS nie został zatwierdzony. | Uruchom w terminalu `dotnet dev-certs https --trust` i zaakceptuj okno dialogowe systemu. |
| Losowe błędy dostępu do plików w `bin/`, `obj/` lub wolna kompilacja | Repozytorium znajduje się wewnątrz katalogu synchronizowanego przez **OneDrive**. | Przenieś klon repozytorium poza katalog OneDrive (np. do `C:\dev\Rejoltance`). |
| Błąd kompilacji pakietów C++ podczas instalacji narzędzi Python (`uv`) | Użycie rozwojowej wersji Python 3.15, dla której brakuje gotowych pakietów binarnych (`wheels`). | Zainstaluj stabilną wersję Python 3.13 (`winget install Python.Python.3.13`) i wymuś jej użycie (`uv tool install --python 3.13 ...`). |
