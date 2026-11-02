# 0.1 Szybki start i instalacja środowiska deweloperskiego

> **Źródło prawdy:** repozytorium (`docs/00-przewodnik-i-setup/01-szybki-start-i-instalacja.md`) · **Kategoria dokumentacji:** instrukcja konfiguracji środowiska · **Etap SDD:** Fundamenty

Ta instrukcja pomoże ci przygotować środowisko deweloperskie projektu **RE:JOLTANCE** od zera. Po niej uruchomisz serwer gry i klienta webowego w mniej niż 5 minut.

SDD (Spec-Driven Development) to nasz sposób pracy: najpierw specyfikacja, potem kod.

---

## 1. Wymagane oprogramowanie (instalujesz raz)

W Sprintach 0–3 **nie potrzebujesz Dockera**. Serwer ASP.NET Core, klient Vite/React i lokalna baza SQLite działają bezpośrednio w systemie.

| Narzędzie | Wersja | Instalacja na Windows (`winget`) | Do czego służy |
|---|---|---|---|
| **.NET SDK** | 10.0 LTS | `winget install Microsoft.DotNet.SDK.10` | Budowanie i uruchamianie backendu (`Kernel`, `Content`, `Contracts`, `Server`), testów xUnit i orkiestratora Aspire (`AppHost`). |
| **Node.js** | 24 LTS (min. 22.13) | `winget install OpenJS.NodeJS.LTS` | Klient webowy (`src/web`), narzędzie `openspec` i linter dokumentacji `markdownlint-cli2`. |
| **Git** | najnowsza | `winget install Git.Git` | Kontrola wersji i praca na gałęziach zadaniowych. |
| **Python** | 3.11 – 3.13 | `winget install Python.Python.3.13` | Skrypty w `tools/`: synchronizacja agentów, ekstrakcja kart, generator CSV do Jiry, eksport do Confluence. |
| **uv** *(opcjonalnie)* | najnowsza | `winget install astral-sh.uv` | Uruchamianie serwera MCP (Model Context Protocol) `mcp-atlassian`. Łączy agentów AI z Jirą i Confluence PB (Politechniki Białostockiej). |
| **Docker Desktop / Podman** *(od Sprintu 4)* | najnowsza | `winget install Docker.DockerDesktop` | Lokalny kontener z bazą PostgreSQL od Sprintu 4 (zgodnie z ADR-0007, czyli zapisem decyzji architektonicznej nr 7). |

---

## 2. Pobranie repozytorium i automatyczna konfiguracja

Sklonuj repozytorium do **krótkiej ścieżki poza folderem OneDrive**, np. `C:\dev\Rejoltance`. Są dwa powody:

- OneDrive potrafi blokować pliki w katalogach `bin/`, `obj/` i `node_modules/`.
- Ścieżki dłuższe niż 260 znaków powodują na Windows błędy procesów pomocniczych.

### Windows (PowerShell)

```powershell
git clone https://github.com/lMamacl/Rejoltance.git C:\dev\Rejoltance
cd C:\dev\Rejoltance
powershell -ExecutionPolicy Bypass -File tools/setup.ps1 -TrustDevCert
```

### macOS i Linux (Bash)

```bash
git clone https://github.com/lMamacl/Rejoltance.git ~/dev/Rejoltance
cd ~/dev/Rejoltance
bash tools/setup.sh
```

### Co robi skrypt `setup`?

1. Uruchamia diagnostykę (`tools/doctor.ps1`). Sprawdza wersje narzędzi i ustawienia systemu.
2. Z flagą `-TrustDevCert` instaluje lokalny certyfikat deweloperski HTTPS dla .NET. Raz klikasz „Tak” w oknie systemowym Windows.
3. Pobiera pakiety NuGet i instaluje zależności npm w katalogu głównym oraz w `src/web`.
4. Buduje całą solucję `Rejoltance.slnx` i uruchamia szybkie testy jednostkowe i architektoniczne.

---

## 3. Uruchamianie aplikacji

### Wariant A (zalecany): .NET Aspire, jedno polecenie

W głównym katalogu repozytorium uruchom:

```powershell
dotnet run --project src/Rejoltance.AppHost
```

*(Jeśli masz Aspire CLI, możesz użyć krótszego polecenia `aspire run`).*

Po starcie terminal pokaże link do **panelu .NET Aspire Dashboard**. W panelu zobaczysz dwa zasoby:

- **`server`** (`Rejoltance.Server`) — serwer ASP.NET Core z hubem SignalR (`/api/hubs/match`) i punktami końcowymi REST (`/api/info`, `/api/cards`, `/api/decks`, `/health`). Lokalna baza SQLite tworzy się sama w pliku `.data/rejoltance.db`.
- **`web`** (`src/web`) — serwer deweloperski Vite z aplikacją React + TypeScript. Proxy przekierowuje ruch `/api/*` do backendu. Kliknij adres zasobu **`web`**, żeby otworzyć grę w przeglądarce.

### Wariant B (awaryjny): serwer i klient w dwóch terminalach

Jeśli zasady bezpieczeństwa Windows blokują Aspire, uruchom oba procesy osobno:

1. **Terminal 1 (backend C#):**

   ```powershell
   dotnet run --project src/Rejoltance.Server
   ```

   Odczytaj z logów adres HTTP serwera. Domyślnie to `http://localhost:5000` albo port z `launchSettings.json`.

2. **Terminal 2 (frontend React + Vite):**

   ```powershell
   cd src/web
   $env:SERVER_HTTP="http://localhost:5000"
   npm run dev
   ```

### Prototyp referencyjny w JS

Prototyp `prototype/revibance` jest kanonem zasad gry. Żeby w niego zagrać, uruchom:

```powershell
npx serve prototype/revibance
```

---

## 4. Typowe problemy i rozwiązania

Gdy coś nie działa, najpierw uruchom skrypt diagnostyczny. Niczego on nie zmienia w systemie:

```powershell
powershell -ExecutionPolicy Bypass -File tools/doctor.ps1
```

| Objaw | Przyczyna | Rozwiązanie |
|---|---|---|
| `Could not load file or assembly ... (0x800711C7)` albo komunikat *„Zasady kontroli aplikacji zablokowały ten plik”* | **Smart App Control** w Windows 11 blokuje lokalnie zbudowane pliki DLL uruchamiane przez Aspire. | Użyj **Wariantu B** (dwa terminale). Możesz też wyłączyć Smart App Control w *Ustawienia → Zabezpieczenia Windows → Kontrola aplikacji i przeglądarki*. Uwaga: w Windows 11 nie włączysz tej funkcji z powrotem bez reinstalacji systemu. |
| `An error occurred trying to start process ... dcp.exe` | Ścieżka do repozytorium przekracza limit 260 znaków na Windows. | Przenieś repozytorium do krótkiej ścieżki (np. `C:\dev\Rejoltance`). Włącz długie ścieżki: `git config --system core.longpaths true`. |
| Proces zawiesza się na komunikacie *„Ufanie certyfikatom…”* | Lokalny certyfikat HTTPS nie został zatwierdzony. | Uruchom `dotnet dev-certs https --trust` i zaakceptuj okno systemowe. |
| Losowe błędy dostępu do plików w `bin/` i `obj/` albo wolna kompilacja | Repozytorium leży w folderze synchronizowanym przez **OneDrive**. | Przenieś klon poza OneDrive (np. do `C:\dev\Rejoltance`). |
| Błąd kompilacji pakietów C++ przy instalacji narzędzi Python (`uv`) | Używasz rozwojowej wersji Python 3.15. Brakuje dla niej gotowych pakietów binarnych (`wheels`). | Zainstaluj stabilny Python 3.13 (`winget install Python.Python.3.13`) i wymuś go: `uv tool install --python 3.13 ...`. |
