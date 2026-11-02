# 2.2 Instrukcja wdrożenia, konfiguracji i utrzymania systemu (Podręcznik administratora)

> **Źródło prawdy:** repozytorium (`docs/02-dokumentacja-uzytkownika/02-instrukcja-wdrozenia-i-utrzymania.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — użytkownika (Podręcznik administratora systemu) · **Etap SDD:** Wydanie · **Wymóg uczelniany:** EU5 / EU6

Niniejszy dokument jest przeznaczony dla administratora systemu oraz członka zespołu odpowiedzialnego za utrzymanie środowiska demonstracyjnego i produkcyjnego (Właściciel Epiku E6). Opisuje procedury instalacji, konfiguracji, monitorowania, tworzenia kopii zapasowych oraz protokoły bezpieczeństwa dla serwera **RE:JOLTANCE**.

Instrukcja konfiguracji środowiska lokalnego dla programistów znajduje się w dokumencie **[0.1 Szybki start i instalacja środowiska](../00-przewodnik-i-setup/01-szybki-start-i-instalacja.md)**.

---

## 1. Wymagania sprzętowe i programowe środowiska serwerowego

| Parametr | Wymagania minimalne (Środowisko Demo — do 50 równoległych meczów) | Wymagania zalecane |
|---|---|---|
| **Procesor (vCPU)** | 1 vCPU (x86_64 lub ARM64) | 2 vCPU |
| **Pamięć operacyjna (RAM)** | 512 MB RAM | 1 GB – 2 GB RAM |
| **Pamięć dyskowa** | 2 GB wolnego miejsca (obraz kontenera + baza danych + logi) | 10 GB SSD |
| **Środowisko uruchomieniowe** | Silnik kontenerowy Docker 24+ / Podman 5+ lub bezpośrednio środowisko ASP.NET Core Runtime 10.0 | Kontener OCI za serwerem pośredniczącym (Reverse Proxy) z obsługą WebSocket (WSS) i TLS 1.3 |
| **Baza danych** | SQLite 3 (wbudowana w plik `.data/rejoltance.db` dla pojedynczej instancji) | PostgreSQL 16+ (od Sprintu 4) |

---

## 2. Procedura instalacji i wdrożenia

### 2.1 Budowanie i publikacja zunifikowanego pakietu wdrożeniowego

W konfiguracji produkcyjnej projekt `Rejoltance.AppHost` wykorzystuje mechanizm `PublishWithContainerFiles`, dzięki któremu zbudowane pliki statyczne klienta React (`src/web/dist`) są automatycznie kopiowane do katalogu `wwwroot/` serwera `Rejoltance.Server`. Pojedynczy proces ASP.NET Core obsługuje zarówno ruch statyczny SPA, jak i punkty końcowe `/api/*` oraz hub WebSocket `/api/hubs/match`.

```bash
# 1. Zbudowanie klienta webowego
npm --prefix src/web ci
npm --prefix src/web run build

# 2. Publikacja serwera ASP.NET Core do katalogu ./publish
dotnet publish src/Rejoltance.Server/Rejoltance.Server.csproj -c Release -o ./publish

# 3. Skopiowanie zbudowanego frontendu do katalogu wwwroot serwera
cp -r src/web/dist/* ./publish/wwwroot/
```

### 2.2 Uruchomienie serwera produkcyjnego

```bash
cd ./publish
ASPNETCORE_ENVIRONMENT=Production \
ASPNETCORE_URLS="http://0.0.0.0:8080" \
ConnectionStrings__rejoltance="Data Source=/var/lib/rejoltance/rejoltance.db" \
dotnet Rejoltance.Server.dll
```

---

## 3. Referencja konfiguracji

Wszystkie parametry serwera są przekazywane przez zmienne środowiskowe (zgodnie z metodyką *12-Factor App*).

| Zmienna środowiskowa | Wartość domyślna (Dev) | Przeznaczenie |
|---|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Development` | Tryb pracy serwera (`Development`, `Staging`, `Production`). W trybie `Production` wyłączane są szczegółowe ślady stosu w komunikatach błędów. |
| `ASPNETCORE_URLS` | dynamiczny port Aspire | Adresy IP i porty, na których nasłuchuje serwer Kestrel (w kontenerze: `http://0.0.0.0:8080`). |
| `ConnectionStrings__rejoltance` | `Data Source=.data/rejoltance.db` | Ciąg połączeniowy do bazy danych SQLite lub PostgreSQL (EF Core). |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | endpoint panelu Aspire | Adres kolektora OpenTelemetry odbierającego logi, metryki i ślady wykonania. |

---

## 4. Monitorowanie i diagnostyka

System udostępnia wbudowane punkty kontrolne zdefiniowane w projekcie `Rejoltance.ServiceDefaults`:

1. **`GET /health` (Sonda gotowości):** Weryfikuje pełną gotowość serwera oraz połączenie z bazą danych. Zwraca kod `200 OK` (`Healthy`) lub `503 Service Unavailable`.
2. **`GET /alive` (Sonda żywotności):** Potwierdza, że proces serwera odpowiada na żądania HTTP (`200 OK`).
3. **`GET /api/info`:** Zwraca obiekt JSON z wersją wdrożenia oraz bieżącą liczbą aktywnych sesji meczowych w pamięci (`activeMatches`).
4. **Telemetria OpenTelemetry:** Serwer eksportuje metryki czasu obsługi żądań HTTP, liczbę aktywnych połączeń WebSocket SignalR oraz logi strukturalne zawierające identyfikatory `matchId` i `seed`.

---

## 5. Procedury utrzymania, kopii zapasowych i odtwarzania po awarii

### 5.1 Kopie zapasowe bazy danych

- **W wariancie SQLite (Sprinty 0–3):** Kopia zapasowa polega na zarchiwizowaniu pliku `.data/rejoltance.db` (przy użyciu polecenia `sqlite3 .data/rejoltance.db ".backup 'backup.db'"` gwarantującego spójność transakcyjną).
- **W wariancie PostgreSQL (od Sprintu 4):** Automatyczny zrzut bazy wykonywany raz na dobę poleceniem `pg_dump -Fc rejoltance > rejoltance_$(date +%F).dump`.

### 5.2 Protokoły bezpieczeństwa

1. **Szyfrowanie transportu:** W środowisku demonstracyjnym cały ruch HTTP oraz WebSocket (`wss://`) musi przechodzić przez warstwę TLS 1.2/1.3 (certyfikat Let's Encrypt na serwerze pośredniczącym).
2. **Zarządzanie sekretami:** Hasła do bazy danych, klucze podpisujące ciasteczka sesyjne oraz tokeny `BITBUCKET_TOKEN` / `CONFLUENCE_PERSONAL_TOKEN` nigdy nie są zapisywane w repozytorium Git — są wstrzykiwane wyłącznie z magazynu sekretów hostingu lub GitHub Actions Secrets (`NFR-42`).
3. **Ochrona przed przeciążeniem:** Serwer ogranicza liczbę intencji przesyłanych przez pojedyncze połączenie SignalR oraz liczbę prób logowania (`NFR-40`).

### 5.3 Rozwiązywanie awarii i odtwarzanie systemu

| Scenariusz awarii | Diagnoza | Procedura naprawcza |
|---|---|---|
| **Połączenia SignalR zrywają się po 30–60 s za serwerem Reverse Proxy (Nginx / Cloudflare)** | Domyślny timeout bezczynności połączenia WebSocket na proxy. | Ustaw nagłówki `Upgrade: websocket`, `Connection: Upgrade` oraz `proxy_read_timeout 3600s;` w konfiguracji Reverse Proxy. |
| **Nagły wzrost zużycia pamięci RAM na serwerze** | Niezamknięte sesje meczowe w `MatchSessionManager`. | Sprawdź wartość `activeMatches` pod adresem `/api/info`. W razie konieczności zrestartuj kontener serwera poza oknem sesji testowej z Radą Graczy. |
| **Uszkodzenie bazy danych lub utrata instancji** | Awaria dysku lub błędy migracji. | Odtwórz nowy kontener z ostatniego obrazu w GitHub Container Registry, przywróć ostatni plik kopii zapasowej bazy danych i zweryfikuj odpowiedź `GET /health`. |
