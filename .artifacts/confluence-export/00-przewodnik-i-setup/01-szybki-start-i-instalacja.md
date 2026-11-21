<!-- CONFLUENCE 1:1 EXPORT | Source: docs/00-przewodnik-i-setup/01-szybki-start-i-instalacja.md -->
# 0.1 Szybki start i instalacja środowiska deweloperskiego

> **Źródło prawdy:** repozytorium (`docs/00-przewodnik-i-setup/01-szybki-start-i-instalacja.md`) · **Kategoria dokumentacji:** instrukcja konfiguracji środowiska · **Etap SDD:** Fundamenty

Ta instrukcja przygotuje środowisko projektu **RE:JOLTANCE** od zera. Po niej uruchomisz serwer gry i klienta w przeglądarce w kilka minut. Jeśli dopiero dołączasz do zespołu, zacznij od [`START.md`](../../START.md) — tam jest cały plan pierwszego dnia.

Cały projekt jest w TypeScript na Node.js 24 ([ADR-0015](../01-dokumentacja-systemowa/07-decyzje-adr/0015-backend-node-typescript.md)). Nie potrzebujesz .NET, Pythona ani Dockera.

---

## 1. Wymagane oprogramowanie (instalujesz raz)

| Narzędzie | Wersja | Instalacja na Windows (`winget`) | Do czego służy |
|---|---|---|---|
| **Node.js** | 24 LTS | `winget install OpenJS.NodeJS.LTS` | Serwer gry, klient, testy i wszystkie skrypty w `tools/`. |
| **Git** | najnowsza | `winget install Git.Git` | Kontrola wersji i praca na gałęziach zadaniowych. |
| **Edytor** | dowolny | np. `winget install Microsoft.VisualStudioCode` | VS Code podpowie rozszerzenia z `.vscode/extensions.json` (ESLint, Vitest, markdownlint). |
| **uv** *(opcjonalnie)* | najnowsza | `winget install astral-sh.uv` | Tylko dla serwera MCP, który łączy agentów AI z Jirą i Confluence PB. |

Na macOS i Linuxie zainstaluj Node.js 24 i Git z menedżera pakietów albo ze stron projektów.

---

## 2. Pobranie repozytorium i konfiguracja

Sklonuj repozytorium do **krótkiej ścieżki poza folderem OneDrive**, np. `C:\dev\Rejoltance` (OneDrive potrafi blokować pliki w `node_modules/`):

```powershell
git clone https://github.com/rejoltance/Rejoltance.git C:\dev\Rejoltance
cd C:\dev\Rejoltance
npm run setup
```

`npm run setup` działa tak samo na Windows, macOS i Linuxie:

1. sprawdza narzędzia (`npm run doctor`);
2. ustawia dla repozytorium `core.longpaths` i `pull.ff only`;
3. instaluje zależności wszystkich pakietów (`npm ci`);
4. tworzy lokalny plik `.env` z `.env.example` (git go ignoruje — wpisujesz tam swoje tokeny);
5. uruchamia testy.

---

## 3. Uruchamianie aplikacji

```powershell
npm run dev
```

Polecenie uruchamia razem dwa procesy (Ctrl+C zatrzymuje oba):

- **serwer gry** (`apps/server`, port z `.env`, domyślnie `3000`) — REST (`/health`, `/api/info`, `/api/cards`, `/api/decks`) i Socket.IO dla meczów; po zmianie kodu sam się restartuje;
- **klient** (`apps/web`, Vite) — otwórz adres, który poda Vite (zwykle `http://localhost:5173`). Vite przekazuje `/api` i `/socket.io` do serwera gry.

Sam serwer uruchomisz poleceniem `npm start`.

### Prototyp referencyjny w JS

Prototyp `prototype/game` jest kanonem zasad gry. Żeby w niego zagrać:

```powershell
npx serve prototype/game
```

---

## 4. Sprawdzenie zmian przed PR

```powershell
npm run verify   # lint (z granicami modułów), typecheck, testy, build klienta
npm run check    # OpenSpec, markdownlint, adaptery agentów, karty, backlog, drzewo Confluence
```

To te same kroki, które uruchamia CI na GitHubie.

---

## 5. Typowe problemy i rozwiązania

Najpierw uruchom diagnostykę — niczego nie zmienia w systemie:

```powershell
npm run doctor
```

| Objaw | Przyczyna | Rozwiązanie |
|---|---|---|
| `Node.js … is too old` albo błąd składni przy `node tools/…` | Starszy Node niż 24 (nie umie uruchamiać plików `.ts`). | Zainstaluj Node 24: `winget install OpenJS.NodeJS.LTS`. |
| `EADDRINUSE: address already in use :::3000` | Port serwera jest zajęty (np. przez wcześniej uruchomione `npm run dev`). | Zamknij poprzedni proces albo zmień `PORT` w `.env`. |
| Losowe błędy dostępu do plików w `node_modules/` | Repozytorium leży w folderze synchronizowanym przez **OneDrive**. | Przenieś klon poza OneDrive (np. do `C:\dev\Rejoltance`). |
| `npm ci` kończy się błędem o niezgodnym `package-lock.json` | Ktoś zmienił zależności bez aktualizacji lockfile. | Uruchom `npm install`, a zaktualizowany `package-lock.json` dodaj do commita. |
| `npm run docs:publish` zgłasza brak poświadczeń | W `.env` brakuje `CONFLUENCE_PERSONAL_TOKEN`. | Wygeneruj token w Confluence (awatar → Ustawienia → Osobiste tokeny dostępu) i wpisz go do `.env`. |
