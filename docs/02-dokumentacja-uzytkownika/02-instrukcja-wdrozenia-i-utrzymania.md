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
| **Środowisko uruchomieniowe** | Docker 24+ lub Podman 5+ albo bezpośrednio Node.js 24 | Kontener OCI (Open Container Initiative) za serwerem pośredniczącym (reverse proxy) z obsługą WebSocket (WSS) i TLS 1.3 |
| **Baza danych** | SQLite 3 (jeden plik, jedna instancja) | PostgreSQL 16+ (od Sprintu 4) |

---

## 2. Instalacja i wdrożenie

### 2.1 Budowanie jednego pakietu wdrożeniowego

Serwer gry to aplikacja Node.js (`apps/server`), która uruchamia pliki TypeScript bezpośrednio, bez kompilacji. Klient (`apps/web`) budujemy do plików statycznych. Docelowo jeden proces serwera obsłuży pliki klienta, punkty `/api/*` i połączenia Socket.IO (zadanie `E6-S05`); do tego czasu pliki klienta może serwować reverse proxy.

```bash
npm ci                 # zależności całego repozytorium
npm run build          # klient: apps/web/dist
```

### 2.2 Uruchomienie serwera produkcyjnego

```bash
NODE_ENV=production PORT=8080 HOST=0.0.0.0 npm start
```

---

## 3. Konfiguracja

Wszystkie parametry serwera przekazujesz przez zmienne środowiskowe (zgodnie z zasadami *12-Factor App*).

| Zmienna środowiskowa | Wartość domyślna (Dev) | Do czego służy |
|---|---|---|
| `NODE_ENV` | — | `production` wyłącza tryb deweloperski bibliotek. |
| `PORT` | `3000` | Port serwera gry (w kontenerze np. `8080`). |
| `HOST` | `127.0.0.1` | Adres nasłuchu; w kontenerze `0.0.0.0`. |

Lokalnie wartości trzymamy w pliku `.env` (wzór: `.env.example`), który `npm run dev` i `npm start` wczytują same.

---

## 4. Monitorowanie i diagnostyka

Serwer udostępnia punkty kontrolne:

1. **`GET /health`:** potwierdza, że serwer działa (`200 OK`, `{ "status": "ok" }`).
2. **`GET /api/info`:** zwraca liczbę aktywnych meczów w pamięci (`activeMatches`).
3. **Logi:** Fastify zapisuje logi strukturalne (JSON) każdego żądania; metryki i ślady (OpenTelemetry) dodamy przy wdrożeniu demo (`E6-S05`).

---

## 5. Utrzymanie, kopie zapasowe i odtwarzanie po awarii

### 5.1 Kopie zapasowe bazy danych

- **SQLite (do Sprintu 3):** kopia zapasowa to zarchiwizowany plik bazy. Użyj polecenia `sqlite3 rejoltance.db ".backup 'backup.db'"`, które zachowuje spójność transakcyjną.
- **PostgreSQL (od Sprintu 4):** raz na dobę wykonuje się automatyczny zrzut bazy poleceniem `pg_dump -Fc rejoltance > rejoltance_$(date +%F).dump`.

### 5.2 Zasady bezpieczeństwa

1. **Szyfrowanie transportu:** w środowisku demonstracyjnym cały ruch HTTP i WebSocket (`wss://`) musi przechodzić przez TLS 1.2/1.3 (certyfikat Let's Encrypt na serwerze pośredniczącym).
2. **Sekrety:** hasła do bazy danych, klucze podpisujące ciasteczka sesji oraz tokeny `BITBUCKET_TOKEN` / `CONFLUENCE_PERSONAL_TOKEN` nigdy nie trafiają do repozytorium Git. Wstrzykujemy je tylko z magazynu sekretów hostingu albo z GitHub Actions Secrets (`NFR-42`, wymaganie niefunkcjonalne).
3. **Ochrona przed przeciążeniem:** serwer ogranicza liczbę intencji wysyłanych przez jedno połączenie Socket.IO oraz liczbę prób logowania (`NFR-40`).

### 5.3 Awarie i odtwarzanie systemu

| Scenariusz awarii | Diagnoza | Co zrobić |
|---|---|---|
| **Połączenia Socket.IO zrywają się po 30–60 s za reverse proxy (Nginx / Cloudflare)** | Proxy ma domyślny limit bezczynności (timeout) połączenia WebSocket. | W konfiguracji reverse proxy ustaw nagłówki `Upgrade: websocket`, `Connection: Upgrade` oraz `proxy_read_timeout 3600s;`. |
| **Nagły wzrost zużycia RAM na serwerze** | Niezamknięte sesje meczów w `MatchSessionManager`. | Sprawdź wartość `activeMatches` pod adresem `/api/info`. W razie potrzeby zrestartuj kontener serwera, ale nie w trakcie sesji testowej z Radą Graczy. |
| **Uszkodzona baza danych lub utracona instancja** | Awaria dysku albo błąd migracji. | Uruchom nowy kontener z ostatniego obrazu w GitHub Container Registry, przywróć ostatnią kopię zapasową bazy i sprawdź odpowiedź `GET /health`. |
