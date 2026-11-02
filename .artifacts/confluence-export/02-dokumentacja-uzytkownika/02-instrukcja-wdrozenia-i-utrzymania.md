<!-- CONFLUENCE 1:1 EXPORT | Source: docs/02-dokumentacja-uzytkownika/02-instrukcja-wdrozenia-i-utrzymania.md @ a2bf2a4 (2026-11-02) -->
# 2.2 Instrukcja wdrożenia, konfiguracji i utrzymania systemu (Podręcznik administratora)

> **Źródło prawdy:** repozytorium (`docs/02-dokumentacja-uzytkownika/02-instrukcja-wdrozenia-i-utrzymania.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — użytkownika (podręcznik administratora systemu) · **Etap SDD:** Wydanie · **Wymóg uczelniany:** EU5 / EU6 (efekty uczenia się)

Ten dokument jest dla administratora systemu i osoby z zespołu, która utrzymuje środowisko demonstracyjne i produkcyjne (właściciel epiku E6). Opisuje, jak zainstalować, skonfigurować i monitorować serwer RE:JOLTANCE, jak robić kopie zapasowe i jakich zasad bezpieczeństwa przestrzegać.

Jeśli chcesz przygotować środowisko lokalne do programowania, zajrzyj do dokumentu [0.1 Szybki start i instalacja środowiska](../00-przewodnik-i-setup/01-szybki-start-i-instalacja.md).

---

## 1. Wymagania sprzętowe i programowe serwera

| Parametr | Minimum (środowisko demo, do 50 równoległych meczów) | Zalecane |
|---|---|---|
| **Procesor (vCPU, wirtualny rdzeń)** | 1 vCPU (x86_64 lub ARM64) | 2 vCPU |
| **Pamięć operacyjna (RAM)** | 512 MB RAM | 1 GB – 2 GB RAM |
| **Dysk** | 2 GB wolnego miejsca (obraz kontenera, baza danych, logi) | 10 GB SSD |
| **Środowisko uruchomieniowe** | Docker 24+ lub Podman 5+ albo bezpośrednio ASP.NET Core Runtime 10.0 | Kontener OCI (Open Container Initiative) za serwerem pośredniczącym (reverse proxy) z obsługą WebSocket (WSS) i TLS 1.3 |
| **Baza danych** | SQLite 3 (plik `.data/rejoltance.db`, jedna instancja) | PostgreSQL 16+ (od Sprintu 4) |

---

## 2. Instalacja i wdrożenie

### 2.1 Budowanie jednego pakietu wdrożeniowego

W konfiguracji produkcyjnej projekt `Rejoltance.AppHost` używa mechanizmu `PublishWithContainerFiles`. Dzięki niemu zbudowane pliki statyczne klienta React (`src/web/dist`) trafiają automatycznie do katalogu `wwwroot/` serwera `Rejoltance.Server`. Jeden proces ASP.NET Core obsługuje więc pliki statyczne SPA (single-page application), punkty końcowe `/api/*` i hub WebSocket `/api/hubs/match`.

Pakiet możesz też zbudować ręcznie:

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

## 3. Konfiguracja

Wszystkie parametry serwera przekazujesz przez zmienne środowiskowe (zgodnie z zasadami *12-Factor App*).

| Zmienna środowiskowa | Wartość domyślna (Dev) | Do czego służy |
|---|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Development` | Tryb pracy serwera (`Development`, `Staging`, `Production`). W trybie `Production` serwer nie pokazuje szczegółowych śladów stosu w komunikatach błędów. |
| `ASPNETCORE_URLS` | dynamiczny port Aspire | Adresy IP i porty, na których nasłuchuje serwer Kestrel (w kontenerze: `http://0.0.0.0:8080`). |
| `ConnectionStrings__rejoltance` | `Data Source=.data/rejoltance.db` | Ciąg połączenia (connection string) z bazą SQLite lub PostgreSQL (EF Core). |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | endpoint panelu Aspire | Adres kolektora OpenTelemetry, który odbiera logi, metryki i ślady wykonania. |

---

## 4. Monitorowanie i diagnostyka

Projekt `Rejoltance.ServiceDefaults` dodaje do serwera wbudowane punkty kontrolne:

1. **`GET /health` (sonda gotowości, *readiness*):** sprawdza, czy serwer jest gotowy i ma połączenie z bazą danych. Zwraca `200 OK` (`Healthy`) albo `503 Service Unavailable`.
2. **`GET /alive` (sonda żywotności, *liveness*):** potwierdza, że proces serwera odpowiada na żądania HTTP (`200 OK`).
3. **`GET /api/info`:** zwraca obiekt JSON z wersją wdrożenia i liczbą aktywnych meczów w pamięci (`activeMatches`).
4. **Telemetria OpenTelemetry:** serwer eksportuje czas obsługi żądań HTTP, liczbę aktywnych połączeń WebSocket SignalR i logi strukturalne z identyfikatorami `matchId` i `seed`.

---

## 5. Utrzymanie, kopie zapasowe i odtwarzanie po awarii

### 5.1 Kopie zapasowe bazy danych

- **SQLite (Sprinty 0–3):** kopia zapasowa to zarchiwizowany plik `.data/rejoltance.db`. Użyj polecenia `sqlite3 .data/rejoltance.db ".backup 'backup.db'"`, które zachowuje spójność transakcyjną.
- **PostgreSQL (od Sprintu 4):** raz na dobę wykonuje się automatyczny zrzut bazy poleceniem `pg_dump -Fc rejoltance > rejoltance_$(date +%F).dump`.

### 5.2 Zasady bezpieczeństwa

1. **Szyfrowanie transportu:** w środowisku demonstracyjnym cały ruch HTTP i WebSocket (`wss://`) musi przechodzić przez TLS 1.2/1.3 (certyfikat Let's Encrypt na serwerze pośredniczącym).
2. **Sekrety:** hasła do bazy danych, klucze podpisujące ciasteczka sesji oraz tokeny `BITBUCKET_TOKEN` / `CONFLUENCE_PERSONAL_TOKEN` nigdy nie trafiają do repozytorium Git. Wstrzykujemy je tylko z magazynu sekretów hostingu albo z GitHub Actions Secrets (`NFR-42`, wymaganie niefunkcjonalne).
3. **Ochrona przed przeciążeniem:** serwer ogranicza liczbę intencji wysyłanych przez jedno połączenie SignalR oraz liczbę prób logowania (`NFR-40`).

### 5.3 Awarie i odtwarzanie systemu

| Scenariusz awarii | Diagnoza | Co zrobić |
|---|---|---|
| **Połączenia SignalR zrywają się po 30–60 s za reverse proxy (Nginx / Cloudflare)** | Proxy ma domyślny limit bezczynności (timeout) połączenia WebSocket. | W konfiguracji reverse proxy ustaw nagłówki `Upgrade: websocket`, `Connection: Upgrade` oraz `proxy_read_timeout 3600s;`. |
| **Nagły wzrost zużycia RAM na serwerze** | Niezamknięte sesje meczów w `MatchSessionManager`. | Sprawdź wartość `activeMatches` pod adresem `/api/info`. W razie potrzeby zrestartuj kontener serwera, ale nie w trakcie sesji testowej z Radą Graczy. |
| **Uszkodzona baza danych lub utracona instancja** | Awaria dysku albo błąd migracji. | Uruchom nowy kontener z ostatniego obrazu w GitHub Container Registry, przywróć ostatnią kopię zapasową bazy i sprawdź odpowiedź `GET /health`. |
