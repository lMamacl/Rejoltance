# Rejoltance.AppHost — orkiestracja (Aspire)

**Po co:** jedno polecenie uruchamia serwer + klienta web: `dotnet run --project src/Rejoltance.AppHost` lub `aspire run` (z katalogu głównego).

**Zasoby:** `server` (Rejoltance.Server, health `/health`), `web` (Vite, proxy `/api` → server). SQLite w `.data/` (git‑ignored).
W publikacji frontend trafia do `wwwroot` serwera (`PublishWithContainerFiles`).

**Niezmienniki:** działa bez Dockera. PostgreSQL dojdzie jako kontener (`AddPostgres`) od Sprintu 3 — ADR-0007.

**Czego tu NIE ma:** logiki aplikacji.

**Jak testować:** `dotnet test tests/Rejoltance.AppHost.Tests` (wolny, `Category=Integration`, uruchamiany w CI).

**Właściciel:** epik E6 (do przydzielenia).
