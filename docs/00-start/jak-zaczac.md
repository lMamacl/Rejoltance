# Jak zacząć

## 1. Zainstaluj (raz)

| Narzędzie | Windows (`winget`) | Po co |
|---|---|---|
| .NET SDK 10 | `winget install Microsoft.DotNet.SDK.10` | backend, AppHost |
| Node.js 24 LTS | `winget install OpenJS.NodeJS.LTS` | klient web, OpenSpec |
| Git | `winget install Git.Git` | repo |
| Python 3.13 | `winget install Python.Python.3.13` | skrypty w `tools/` |
| uv (opcjonalnie) | `winget install astral-sh.uv` | integracja z Jirą/Confluence (MCP) |
| Docker / Podman (od Sprintu 3) | `winget install Docker.DockerDesktop` | PostgreSQL w kontenerze |

Aspire CLI jest **opcjonalne** — AppHost uruchamia się też przez `dotnet run`.

## 2. Sklonuj i przygotuj

```powershell
git clone https://github.com/lMamacl/Rejoltance.git C:\dev\Rejoltance
cd C:\dev\Rejoltance
powershell -ExecutionPolicy Bypass -File tools/setup.ps1 -TrustDevCert
```

`setup.ps1` sprawdza narzędzia (`tools/doctor.ps1`), instaluje zależności, buduje i uruchamia szybkie testy.
`-TrustDevCert` = jednorazowe zaufanie certyfikatowi HTTPS (potwierdzasz okno Windows).

## 3. Uruchom

```powershell
dotnet run --project src/Rejoltance.AppHost     # albo: aspire run
```

W panelu Aspire: zasób **server** (API + hub), **web** (klient gry). Baza SQLite powstaje w `.data/rejoltance.db`.

Bez Aspire (np. przy problemach): dwa terminale — `dotnet run --project src/Rejoltance.Server` oraz w `src/web`:
`$env:SERVER_HTTP="http://localhost:5000"; npm run dev` (adres z logu serwera).

## Problemy

| Objaw | Przyczyna | Rozwiązanie |
|---|---|---|
| `Could not load file or assembly ... (0x800711C7)` / „Zasady kontroli aplikacji zablokowały ten plik” | **Smart App Control** (Windows 11) blokuje świeżo zbudowane DLL | uruchom serwer i web osobno (wyżej) lub wyłącz Smart App Control (Ustawienia → Zabezpieczenia Windows → Kontrola aplikacji i przeglądarki). Uwaga: ponowne włączenie wymaga reinstalacji Windows — decyzja właściciela komputera |
| `An error occurred trying to start process ...dcp.exe` | ścieżka > 260 znaków | klonuj do krótkiej ścieżki (`C:\dev\Rejoltance`), `git config --system core.longpaths true` |
| zawieszenie na „Ufanie certyfikatom…” | certyfikat dev nie jest zaufany | `dotnet dev-certs https --trust` |
| dziwne blokady plików, wolny build | repo w OneDrive | przenieś klon poza OneDrive |
| instalacja narzędzi Pythona wymaga kompilatora C++ | Python 3.15 bez gotowych pakietów | używaj Pythona 3.13 (`uv tool install --python 3.13 …`) |

Wciąż nie działa? `powershell -File tools/doctor.ps1` i wklej wynik na kanał zespołu.
