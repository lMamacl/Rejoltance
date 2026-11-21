# Pierwszy dzień w projekcie RE:JOLTANCE

Ten plik prowadzi cię od zera do pierwszego pull requesta. Zajmie to około dwóch godzin. Nie musisz czytać reszty dokumentacji, żeby zacząć — linki prowadzą dalej tylko wtedy, gdy będziesz potrzebować szczegółów.

> Pliki `AGENTS.md`, `CLAUDE.md` i katalogi `.agents/`, `.claude/` są dla narzędzi AI. Pierwszego dnia możesz je pominąć.

---

## 1. Uruchom grę (15 min)

1. Zainstaluj **Node.js 24** i **Git** (`winget install OpenJS.NodeJS.LTS`, `winget install Git.Git`).
2. Sklonuj repozytorium poza OneDrive i przygotuj środowisko:

   ```powershell
   git clone https://github.com/rejoltance/Rejoltance.git C:\dev\Rejoltance
   cd C:\dev\Rejoltance
   npm run setup
   ```

3. Uruchom serwer i klienta: `npm run dev`, a potem otwórz adres, który poda Vite (zwykle `http://localhost:5173`).

Coś nie działa? `npm run doctor` i tabela problemów w [szybkim starcie](docs/00-przewodnik-i-setup/01-szybki-start-i-instalacja.md#5-typowe-problemy-i-rozwiązania).

## 2. Zagraj w prototyp (30 min)

Zasady gry określa prototyp JS w `prototype/game` — to on jest wzorcem dla naszego kodu ([ADR-0013](docs/01-dokumentacja-systemowa/07-decyzje-adr/0013-kanon-regul-rejoltance-prototype.md)).

- Uruchom go lokalnie: `npx serve prototype/game` albo otwórz wersję na GitHub Pages: <https://rejoltance.github.io/Rejoltance/>.
- Rozegraj jeden mecz z botem. Zasady w skrócie: [specyfikacja reguł gry](docs/01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md).

## 3. Zrozum, jak zbudowany jest kod (30 min)

Wszystko jest w TypeScript. Pięć pakietów, zależności idą tylko w jedną stronę:

```text
apps/web  ──► packages/contracts ◄── packages/content ◄── packages/engine ◄── apps/server
(klient)      (typy wymieniane                  (karty)            (reguły gry)        (serwer)
               przez serwer i klienta)
```

- **Klient nie zna reguł gry.** Wyświetla `MatchView` od serwera i wysyła `Intent` (np. „zagraj kartę”).
- **Serwer jest jedynym sędzią.** Sprawdza intencję i oddaje każdemu graczowi tylko to, co może zobaczyć.
- **Silnik jest deterministyczny.** To samo ziarno i te same ruchy zawsze dają ten sam wynik (bez `Math.random`, bez zegara).

Szczegóły i tabela „gdzie dodać nową funkcję”: [mapa kodu](docs/01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md).

## 4. Poznaj zasady pracy (15 min)

1. **Gałąź od `develop`:** `feature/REJ-123-krotki-opis` (albo `fix/`, `docs/`, `chore/`, `spike/`). Dopóki Jira nie działa, używamy klucza `REJ-0`.
2. **Commity po angielsku:** `REJ-123: add fatigue damage`. Dokumentacja po polsku.
3. **Najpierw specyfikacja, potem kod:** reguła gry ma numer `R-nn` i scenariusze w `openspec/specs/`; każda zaimplementowana reguła ma test `Rnn_…`.
4. **Przed PR:** `npm run verify` i `npm run check` muszą być zielone.
5. **PR do `develop`**, recenzja innej osoby, merge robi człowiek („Squash and merge”). Nikt nie pushuje bezpośrednio do `develop` ani `main`.

Cały proces: [proces pracy, Git i Scrum](docs/00-przewodnik-i-setup/03-proces-pracy-i-git-scrum.md). Nadrzędne zasady: [konstytucja](.agents/rules/00-konstytucja.md) (krótka, 11 artykułów).

## 5. Weź pierwsze zadanie

Dopóki Jira nie działa, zadania są w [`BACKLOG.md`](docs/03-dokumentacja-procesowa/02-backlog/BACKLOG.md) — wybierz coś z bieżącego sprintu i uzgodnij to z Product Ownerem.

| Chcesz pracować nad… | Zacznij od | Pomocny skill agenta AI |
|---|---|---|
| regułami gry | reguła ze statusem ⏳ w [indeksie R-nn](docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md) → test w `packages/engine/test` | `rj-add-rule-test` |
| kartami i efektami | `packages/content`, słownik DSL w `src/vocabulary.ts` | `rj-add-card` |
| serwerem i siecią | `apps/server` (pokoje PvP — epik E3) | — |
| interfejsem | `apps/web/src/components` (plansza, ręka — epik E4) | — |
| dokumentacją i Scrumem | `docs/`, `backlog.toml`, szablony w `docs/05-szablony` | `rj-sync-confluence`, `rj-backlog-to-jira` |

Zanim zaczniesz kod przy regule gry, sprawdź, czy nie dotyczy jej otwarta rozbieżność z prototypem (`D-nn`) w [rozbieżnościach](docs/01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md).

## 6. Gdy utkniesz

- Pojęcia (MatchView, Intent, R-nn, ADR…): [słownik](docs/00-przewodnik-i-setup/05-slownik-pojec.md).
- Wszystkie polecenia w jednym miejscu: [ściąga](docs/00-przewodnik-i-setup/04-sciaga-komend.md).
- Agent AI (Claude Code, Codex, Cursor, Antigravity) zna zasady projektu z `AGENTS.md` — możesz go zapytać, od czego zacząć zadanie.
- Pytaj zespół: lepiej zapytać po 20 minutach niż utknąć na dwa dni.
