# quality-attributes Specification

## Purpose

Wymagania niefunkcjonalne (NFR‑nn) według modelu jakości ISO/IEC 25010:2023. Numeracja w grupach odpowiada charakterystykom:
NFR‑0x wydajność, NFR‑1x kompatybilność, NFR‑2x zdolność interakcji (użyteczność), NFR‑3x niezawodność, NFR‑4x bezpieczeństwo,
NFR‑5x utrzymywalność, NFR‑6x elastyczność (przenaszalność), NFR‑7x bezpieczeństwo użytkownika (safety).
Przydatność funkcjonalna jest opisana wymaganiami R‑nn w pozostałych specyfikacjach. Progi są dobrane do projektu studenckiego
(demo na jednej instancji, 6 osób) i mogą zostać zaostrzone decyzją zespołu (ADR). Testy mają w nazwie numer, np. `NFR01_…`.

## Requirements

### Requirement: NFR-01 Czas odpowiedzi na ruch

Serwer MUST przetworzyć intencję i wysłać zaktualizowany widok w czasie p95 ≤ 200 ms (mierzone od odebrania intencji do wysłania `MatchUpdated`) przy 50 równoległych meczach na instancji demo.

#### Scenario: Ruch pod obciążeniem

- **GIVEN** 50 równoległych meczów botów na instancji demo
- **WHEN** w każdym meczu wykonywane są kolejne intencje przez 5 minut
- **THEN** 95. percentyl czasu obsługi intencji w telemetrii wynosi ≤ 200 ms

### Requirement: NFR-02 Lekki klient

Początkowe pobranie klienta web MUST mieć ≤ 500 kB JavaScriptu po kompresji gzip, a pierwszy ekran SHALL być interaktywny w ≤ 3 s na łączu 10 Mb/s.

#### Scenario: Budżet rozmiaru w CI

- **GIVEN** build produkcyjny klienta
- **WHEN** CI liczy rozmiar plików `dist/assets/*.js` po gzip
- **THEN** suma nie przekracza 500 kB, inaczej build jest czerwony

### Requirement: NFR-10 Przeglądarki

Klient MUST działać w dwóch ostatnich stabilnych wersjach Chrome, Edge, Firefox i Safari na komputerach (rozdzielczość od 1280×720). Telefony są poza zakresem MVP.

#### Scenario: Smoke test w przeglądarkach

- **GIVEN** wydanie sprintu
- **WHEN** test E2E uruchamia mecz w Chromium, Firefox i WebKit
- **THEN** we wszystkich trzech mecz startuje, a mulligan i zagranie jednostki działają

### Requirement: NFR-11 Zgodny kontrakt klient–serwer

Format `MatchView` i intencji MUST być identyczny po stronie C# i TypeScript; rozjazd SHALL zatrzymywać build po obu stronach (ADR-0010).

#### Scenario: Zmiana pola tylko po stronie serwera

- **GIVEN** nowe pole w `MatchView` w C#, bez zmiany typów TS
- **WHEN** uruchamiane są testy kontraktu w CI
- **THEN** `ContractSampleTests` albo `tsc` kończy się błędem

### Requirement: NFR-20 Łatwość nauki

Nowy gracz MUST być w stanie rozegrać pierwszy mecz z botem do końca bez pomocy zespołu w ≤ 15 minut, korzystając tylko z interfejsu i podręcznika gracza.

#### Scenario: Test z radą graczy

- **GIVEN** 3 osoby z rady graczy, które nie znają gry
- **WHEN** każda dostaje zadanie „zagraj mecz z botem”
- **THEN** co najmniej 2 z 3 kończą mecz w ≤ 15 minut bez pytania zespołu

### Requirement: NFR-21 Czytelność legalnych ruchów

Interfejs MUST wyróżniać tylko ruchy z `legalActions` i nie pozwalać wysłać innych; odrzucony przez serwer ruch SHALL wyświetlić zrozumiały komunikat po polsku.

#### Scenario: Za mało Blood

- **GIVEN** karta droższa niż dostępne Blood
- **WHEN** gracz próbuje ją przeciągnąć
- **THEN** karta nie daje się upuścić, a podpowiedź mówi „Za mało Blood”

### Requirement: NFR-22 Dostępność

Kluczowe akcje (wybór i zagranie karty, koniec kroku, odpowiedź na pytanie gry) MUST być dostępne z klawiatury, a tekst SHALL spełniać kontrast WCAG 2.1 AA.

#### Scenario: Gra bez myszy

- **GIVEN** mecz w kroku jednostek
- **WHEN** gracz używa tylko klawiatury
- **THEN** może wybrać kartę, linię i zakończyć krok

### Requirement: NFR-30 Dostępność demo

Instancja demo MUST być dostępna w ≥ 99% czasu w tygodniu przed każdym Sprint Review i w trakcie sesji z radą graczy.

#### Scenario: Monitoring przed Review

- **GIVEN** tydzień przed Sprint Review
- **WHEN** monitor sprawdza `/health` co minutę
- **THEN** odsetek odpowiedzi `Healthy` wynosi ≥ 99%

### Requirement: NFR-31 Izolacja meczów

Błąd w jednym meczu (wyjątek w Kernelu, utrata połączenia) MUST NOT przerywać innych meczów ani zatrzymywać serwera; błąd SHALL być zalogowany z identyfikatorem meczu i seedem.

#### Scenario: Wyjątek w meczu A

- **GIVEN** dwa równoległe mecze A i B
- **WHEN** w meczu A Kernel rzuca nieoczekiwany wyjątek
- **THEN** mecz B toczy się dalej, a log zawiera identyfikator i seed meczu A

### Requirement: NFR-40 Ochrona kont

Hasła MUST być przechowywane wyłącznie jako skrót (ASP.NET Core Identity), sesja SHALL używać ciasteczka HttpOnly, Secure, SameSite, a demo MUST działać tylko przez HTTPS.

#### Scenario: Podgląd bazy

- **GIVEN** dostęp do bazy danych demo
- **WHEN** administrator przegląda tabelę użytkowników
- **THEN** nie widzi żadnego hasła w postaci jawnej

### Requirement: NFR-41 Ochrona przed nadużyciem

Logowanie i hub SignalR MUST mieć limity żądań (np. 5 nieudanych logowań na minutę, 20 intencji na sekundę na połączenie); przekroczenie SHALL być odrzucane i logowane.

#### Scenario: Zalew intencjami

- **GIVEN** klient wysyłający 100 intencji na sekundę
- **WHEN** serwer je przetwarza
- **THEN** intencje ponad limit są odrzucane, a inne mecze nie zwalniają

### Requirement: NFR-42 Bezpieczny kod i zależności

Klient MUST NOT renderować danych przez `innerHTML` ani `dangerouslySetInnerHTML`; sekrety MUST NOT trafiać do repo; zależności z krytyczną podatnością SHALL być aktualizowane w ≤ 7 dni od alertu.

#### Scenario: Nazwa gracza z kodem HTML

- **GIVEN** gracz o nazwie `<img src=x onerror=alert(1)>`
- **WHEN** przeciwnik widzi jego nazwę
- **THEN** nazwa wyświetla się jako tekst, a skrypt się nie wykonuje

### Requirement: NFR-50 Granice modułów

Zależności MUST iść tylko w kierunku Server → Kernel → Content → Contracts; Kernel MUST NOT zależeć od ASP.NET, EF Core ani sieci. Naruszenie SHALL zatrzymać CI.

#### Scenario: Import ASP.NET w Kernelu

- **GIVEN** klasa w Kernelu używająca typu z `Microsoft.AspNetCore`
- **WHEN** CI uruchamia testy architektury
- **THEN** test `Module_does_not_depend_on` kończy się błędem

### Requirement: NFR-51 Testowalność reguł

Każda reguła R‑nn o statusie „zaimplementowana” MUST mieć test o nazwie zaczynającej się od jej numeru, a pokrycie linii kodu Kernela SHALL wynosić ≥ 80%.

#### Scenario: Raport pokrycia

- **GIVEN** koniec sprintu
- **WHEN** generowany jest raport testów
- **THEN** lista reguł bez testu jest pusta, a pokrycie Kernela ≥ 80%

### Requirement: NFR-52 Czysty build

Build MUST przechodzić bez ostrzeżeń (CI traktuje ostrzeżenia jak błędy), a kod SHALL być sformatowany wg `.editorconfig` (`dotnet format --verify-no-changes`, ESLint).

#### Scenario: Ostrzeżenie kompilatora

- **GIVEN** PR wprowadzający ostrzeżenie kompilatora
- **WHEN** uruchamia się CI
- **THEN** job .NET jest czerwony

### Requirement: NFR-60 Jedno polecenie do uruchomienia

Środowisko deweloperskie MUST uruchamiać się na Windows, macOS i Linux jednym poleceniem (`dotnet run --project src/Rejoltance.AppHost`) bez Dockera do czasu wprowadzenia PostgreSQL (ADR-0007).

#### Scenario: Czysty klon

- **GIVEN** czysty klon i zainstalowane .NET 10 oraz Node 24
- **WHEN** uruchamiam `tools/setup` i AppHost
- **THEN** serwer odpowiada `Healthy`, a klient się ładuje (test `AppHostSmokeTests`)

### Requirement: NFR-61 Wdrożenie jako kontener

Aplikacja MUST być wdrażana jako jeden obraz kontenera (serwer + zbudowany klient w `wwwroot`), konfigurowany wyłącznie zmiennymi środowiskowymi.

#### Scenario: Nowe środowisko

- **GIVEN** obraz z CI i zmienne środowiskowe z instrukcji wdrożenia
- **WHEN** administrator uruchamia kontener na nowym serwerze
- **THEN** gra działa bez modyfikacji obrazu

### Requirement: NFR-70 Bezpieczne animacje

Animacje i efekty MUST NOT zawierać błysków częstszych niż 3 na sekundę (WCAG 2.1, kryterium 2.3.1), a gracz SHALL móc ograniczyć animacje (`prefers-reduced-motion` lub ustawienie w grze).

#### Scenario: Ograniczony ruch

- **GIVEN** system z włączonym `prefers-reduced-motion`
- **WHEN** rozgrywa się walka
- **THEN** wyniki są pokazane bez animacji lotu i błysków
