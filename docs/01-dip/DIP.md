# Dokument Inicjujący Projekt (DIP) — RE:JOLTANCE

> Wymóg zaliczenia (semestr 1): DIP nie jest oceniany liczbowo, ale jego brak = ocena niedostateczna.
> **Każdy student jest autorem jednego epiku (EU1)** — sekcja 4. Wersja do oceny: kopia w Confluence PB.
> Pola `⟨…⟩` uzupełnia zespół na spotkaniu startowym (pytania otwarte #1, #2, #9).

## Metadane

| Pole | Wartość |
|---|---|
| Nazwa projektu | RE:JOLTANCE — sieciowa taktyczna gra karciana z autorytatywnym serwerem i klientem webowym |
| Klucz projektu w Jira | `REJ` ⟨do potwierdzenia — #1⟩ |
| Wersja dokumentu | v0.9 (projekt do zatwierdzenia) |
| Data zatwierdzenia | ⟨RRRR-MM-DD⟩ |
| Prowadzący / Scrum Master | ⟨tytuł, imię i nazwisko⟩ |
| Repozytorium | <https://github.com/lMamacl/Rejoltance> (mirror: Bitbucket PB — ADR-0002) |
| Skład zespołu | 1. ⟨imię⟩ — E1 · 2. ⟨imię⟩ — E2 · 3. ⟨imię⟩ — E3 · 4. ⟨imię⟩ — E4 · 5. ⟨imię⟩ — E5 · 6. ⟨imię⟩ — E6 |

## 1. Wstęp, kontekst i cele

### 1.1 Problem

RE:JOLTANCE to autorska gra karciana zespołu (lane battler: 4 linie, zasób Blood, talie po 30 kart). Istnieją dwie wersje:
desktopowa (Godot/C#) — wymagająca instalacji i bez gry sieciowej — oraz prototyp przeglądarkowy w JS, w którym gra P2P jest podatna na oszustwa
(podgląd ręki przeciwnika, nielegalne cele, XSS), a silnik nie ma determinizmu ani testów (`docs/08-research/faza-0-analiza.md`).
Gracz nie może więc bezpiecznie zagrać z kolegą online ani zaufać, że zasady działają poprawnie.

### 1.2 Cel i wartość

Celem dwusemestralnego projektu jest gra webowa, w którą:

- można zagrać z drugą osobą przez link lub z botem, bez instalacji (przeglądarka, także na laptopach w sali);
- serwer jest jedynym sędzią — ręka przeciwnika i kolejność talii są niewidoczne, każdy ruch jest walidowany;
- zasady są spisane jako 55 testowalnych reguł R‑nn i pokryte testami automatycznymi (EU6);
- każdy mecz da się odtworzyć z seeda i listy ruchów (powtórki, analiza balansu).

### 1.3 Ograniczenia i założenia

- Stos: .NET 10 + ASP.NET Core + SignalR, React + TypeScript + Vite, Aspire, SQLite → PostgreSQL (ADR-0001, ADR-0007).
- Narzędzia uczelni: Jira, Confluence, Bitbucket PB; kod i CI na GitHubie (ADR-0002).
- Czas: 6 osób × ok. 5 h tygodniowo; Sprint 0 (1 tydzień) + 5 sprintów dwutygodniowych w semestrze 1.
- Kanon zasad: prototyp JS v11 (ADR-0005); sporne miejsca w `docs/02-rules/ROZBIEZNOSCI.md`.
- Praca wspierana agentami AI wg konstytucji projektu (`.agents/rules/00-konstytucja.md`) — decyzje i odpowiedzialność po stronie ludzi.

## 2. Użytkownik końcowy i pętla walidacji (EU1, EU2)

### 2.1 Persony

| Persona | Kto | Bolączki | Oczekiwane korzyści |
|---|---|---|---|
| **Gracz okazjonalny** | student WI PB, gra w przerwie między zajęciami | instalacja gier, brak przeciwnika „od ręki” | link → gra w 5 s; bot, gdy nikt nie ma czasu |
| **Gracz zaawansowany** | członek koła naukowego / fan gier karcianych | niejasne zasady, oszustwa online | czytelne reguły, uczciwy serwer, własne talie |
| **Projektant gry** | autorzy gry (Bluzacy, PanCoto) | brak danych o balansie | symulacje bot‑vs‑bot, statystyki kart (semestr 2) |

Reprezentanci: rada graczy testowych — 3 osoby spoza zespołu ⟨imiona⟩ (story E0-S03).

### 2.2 Plan współpracy

1. **Inicjacja (S0):** rozmowa z radą graczy na prototypie — co jest niejasne, co przeszkadza (wejście do E0-S04).
2. **Każdy sprint:** Sprint Review z co najmniej 2 graczami testowymi; zadania demonstrowane przez autorów.
3. **Ślad:** protokół odbioru w Confluence (szablon `docs/06-scrum/szablon-review-retro.md`) + zgłoszenia w Jirze z feedbacku.
4. **Koniec semestru:** mini‑turniej na Sprint Review S5 (gra online + bot).

## 3. Wizja architektoniczna

Modularny monolit z granicami wymuszanymi testami architektury (`tests/Rejoltance.Architecture.Tests`). Szczegóły: `docs/03-architecture/MAP.md`.

```text
src/web (React/TS)  ── Intent ──►  Rejoltance.Server (SignalR, sesje, API, baza)
        ▲                                  │
        └──── MatchView + DomainEvent ─────┤
                                           ▼
                             Rejoltance.Kernel (reguły, deterministyczny)
                                           ▼
                             Rejoltance.Content (karty jako dane) → Rejoltance.Contracts (5 kontraktów)
```

- **Kontrakty zamrożone:** `Intent`, `LegalAction`, `PendingInteraction`, `MatchView`, `DomainEvent`; zmiana = ADR (konstytucja, art. IV).
- **Izolacja:** każdy epik ma własny moduł/katalog i właściciela (CODEOWNERS); własność ≠ wyłączność.
- **Trwałość:** tylko konta, talie i zakończone mecze; mecze w toku w pamięci serwera.

## 4. Epiki (EU1)

> Pełne historyjki, kryteria i szacunki: `docs/05-backlog/backlog.toml` → `BACKLOG.md`. Poniżej po 3 kluczowe historyjki epiku w semestrze 1.

### Epik 1: Silnik reguł (Kernel)

- **Autor (EU1):** ⟨student 1⟩ · **Klucz Jira:** ⟨REJ-…⟩ · **Moduł:** `src/Rejoltance.Kernel`
- **Zakres:** runda i kroki, zagrywanie jednostek, walka 4 linii, słowa kluczowe, ochrony przed śmiercią, koniec meczu (R-0x…R-5x, R-7x).
- **Historyjki:**
  - `E1-S01` Jako gracz chcę po mulliganie zdecydować, czy zaczynam, i rozpocząć rundę 1, aby mecz przeszedł do gry.
    *GIVEN* obaj zrobili mulligan *WHEN* gracz 0 wybiera „pierwszy”, a gracz 1 „drugi” *THEN* rundę 1 zaczyna gracz 0, obaj mają 1/1 Blood.
  - `E1-S03` Jako gracz chcę, żeby po kroku akcji linie rozstrzygnęły się same, aby jednostki walczyły, a mecz mógł się zakończyć.
    *GIVEN* jednostki 3/2 i 2/3 naprzeciw *WHEN* linia się rozstrzyga *THEN* obie giną.
  - `E1-S04` Jako gracz chcę, żeby Armored, Marked, Stunned, Burning, SplashDamage i Breakthrough działały, aby karty miały tożsamość.
    *GIVEN* jednostka z Armored(1) i Marked *WHEN* dostaje trafienie za 3 *THEN* traci 4 HP.

### Epik 2: Interpreter efektów kart (DSL)

- **Autor (EU1):** ⟨student 2⟩ · **Klucz Jira:** ⟨REJ-…⟩ · **Moduł:** `src/Rejoltance.Content` + handlery efektów
- **Zakres:** rejestr akcji, wyzwalacze, warunki, wybór i walidacja celów, koszt, talia MVP 12 kart (R-2x, R-6x).
- **Historyjki:**
  - `E2-S01` Jako twórca kart chcę, żeby efekt był wykonywany z danych przez rejestr handlerów, aby nowa karta nie wymagała zmiany silnika.
    *GIVEN* akcja bez handlera *WHEN* efekt się uruchamia *THEN* rzucany jest wyjątek z nazwą akcji.
  - `E2-S02` Jako gracz online chcę, żeby serwer przyjmował tylko legalne cele, aby nikt nie poświęcił mojej jednostki.
    *GIVEN* karta wymagająca poświęcenia przyjaznej jednostki *WHEN* wskazuję jednostkę wroga *THEN* intencja jest odrzucona.
  - `E2-S05` Jako gracz testowy chcę zagrać pełny mecz talią 12 różnych kart, aby ocenić grę na Sprint Review.
    *GIVEN* talia MVP *WHEN* rozgrywam mecz z botem *THEN* każda z 12 kart działa zgodnie z opisem.

### Epik 3: Serwer i sieć czasu rzeczywistego

- **Autor (EU1):** ⟨student 3⟩ · **Klucz Jira:** ⟨REJ-…⟩ · **Moduł:** `src/Rejoltance.Server`
- **Zakres:** pokoje PvP, SignalR, autoryzacja miejsca, zdarzenia per gracz, limit czasu tury, ochrona hubu (R-7x, R-8x).
- **Historyjki:**
  - `E3-S01` Jako gracz chcę utworzyć pokój i wysłać koledze kod, aby zagrać w dwóch przeglądarkach.
    *GIVEN* pełny pokój *WHEN* trzecia osoba wpisze kod *THEN* dostaje komunikat „pokój pełny”.
  - `E3-S02` Jako gracz online chcę, żeby nikt nie mógł grać za mnie, aby mecz był uczciwy.
    *GIVEN* gracz 1 *WHEN* wysyła intencję w kroku gracza 0 *THEN* intencja jest odrzucona.
  - `E3-S04` Jako gracz chcę, żeby przeciwnik nie mógł grać w nieskończoność, aby mecz miał tempo.
    *GIVEN* aktywny gracz nic nie robi 90 s *WHEN* czas minie *THEN* krok jest automatycznie zakończony.

### Epik 4: Klient web

- **Autor (EU1):** ⟨student 4⟩ · **Klucz Jira:** ⟨REJ-…⟩ · **Moduł:** `src/web`
- **Zakres:** plansza i ręka, zagrywanie z podświetleniem legalnych ruchów, prompty, lobby, animacje i dźwięk.
- **Historyjki:**
  - `E4-S01` Jako gracz chcę widzieć planszę, rękę, HP i Blood jak w prototypie, aby rozumieć stan gry.
    *GIVEN* ręka przeciwnika *WHEN* patrzę na jego stronę *THEN* widzę tylko rewersy w liczbie `handCount`.
  - `E4-S02` Jako gracz chcę kliknąć lub przeciągnąć kartę na podświetloną linię, aby grać intuicyjnie.
    *GIVEN* karta grywalna *WHEN* ją zaznaczę *THEN* podświetlają się tylko linie z `legalActions`.
  - `E4-S05` Jako gracz chcę widzieć ataki, obrażenia i śmierć jednostek, aby gra była czytelna.
    *GIVEN* zdarzenia walki *WHEN* przychodzi `MatchUpdated` *THEN* odtwarzam je po kolei z dźwiękami.

### Epik 5: Bot AI i symulator

- **Autor (EU1):** ⟨student 5⟩ · **Klucz Jira:** ⟨REJ-…⟩ · **Moduł:** `tools/oracle`, `src/Rejoltance.Sim` (powstanie)
- **Zakres:** wyrocznia z prototypu, testy różnicowe, bot na `LegalActions`, symulator headless, tryb gry z botem.
- **Historyjki:**
  - `E5-S01` Jako inżynier reguł chcę uruchomić silnik prototypu w Node z seedem, aby mieć wzorcowe wyniki.
    *GIVEN* ten sam seed *WHEN* uruchamiam dwa razy *THEN* wyniki są identyczne.
  - `E5-S03` Jako gracz chcę zagrać z botem wykonującym legalne ruchy, aby testować grę bez drugiego człowieka.
    *GIVEN* mecz z botem *WHEN* bot jest aktywny *THEN* wykonuje tylko ruchy z `LegalActions`.
  - `E5-S04` Jako projektant balansu chcę rozegrać 300 partii bez UI, aby wykryć zawieszenia i sprawdzić determinizm.
    *GIVEN* seedy 1..300 *WHEN* uruchamiam symulator *THEN* wszystkie partie się kończą, a powtórka daje ten sam wynik.

### Epik 6: Platforma — konta, dane, wdrożenie, jakość

- **Autor (EU1):** ⟨student 6⟩ · **Klucz Jira:** ⟨REJ-…⟩ · **Moduł:** CI/CD, `tests/`, baza, konta
- **Zakres:** CI i testy E2E, konta graczy, PostgreSQL, wdrożenie demo, dokumentacja w Confluence (EU5/EU6).
- **Historyjki:**
  - `E6-S01` Jako zespół chcę zielone CI z testem E2E, aby każdy PR był automatycznie sprawdzony.
    *GIVEN* uruchomiony AppHost *WHEN* Playwright otwiera klienta *THEN* startuje sandbox i wykonuje mulligan.
  - `E6-S02` Jako gracz chcę założyć konto i się zalogować, aby mieć swoje talie i historię.
    *GIVEN* 5 błędnych logowań w minutę *WHEN* próbuję szósty raz *THEN* dostaję odmowę.
  - `E6-S05` Jako gracz testowy chcę wejść na adres i zagrać bez instalacji, aby testować grę między zajęciami.
    *GIVEN* obraz kontenera z CI *WHEN* wdrażam na hosting *THEN* gra działa pod adresem HTTPS.

Epik wspólny **E0 Fundamenty i proces** (narzędzia, DIP, ceremonie, rada graczy) nie ma jednego autora — odpowiada PO danego sprintu.

## 5. Harmonogram semestru 1 (EU4)

| Sprint | Termin | Cel | Pojemność [h] | Zaplanowane [h] |
|---|---|---|---|---|
| S0 | 27.10–2.11 | repo, Jira, DIP, rozstrzygnięcie reguł spornych | 30 | 27 |
| S1 | 3.11–16.11 | dwie przeglądarki w jednym pokoju: mulligan, kolejność, start rundy | 60 | 54 |
| S2 | 17.11–30.11 | zagrywanie jednostek w krokach; serwer odrzuca nielegalne ruchy | 60 | 57 |
| S3 | 1.12–14.12 | walka 4 linii do końca meczu; prosty bot | 60 | 49 |
| S4 | 15.12–11.01 | słowa kluczowe, lobby, PostgreSQL (przerwa świąteczna) | 60 | 50 |
| S5 | 12.01–25.01 | MVP: 12 kart online i z botem, wdrożenie, dokumentacja | 60 | 54 |

Szczegóły i linia cięcia: `docs/05-backlog/BACKLOG.md`.

## 6. Organizacja zespołu (EU2, EU3, EU4)

### 6.1 Rotacja roli Product Ownera

Każdy student jest PO w co najmniej jednym sprincie. Sprintów jest 6 (S0–S5) na 6 osób ⟨do potwierdzenia z prowadzącym, czy S0 się liczy — #2⟩.

| Sprint | PO | Akcent |
|---|---|---|
| S0 | ⟨student⟩ | DIP, konfiguracja narzędzi, rada graczy |
| S1 | ⟨student⟩ | pierwszy planning z podziałem na taski ≤ 4 h, Burndown |
| S2 | ⟨student⟩ | pilnowanie pojemności (sprint najbardziej obciążony) |
| S3 | ⟨student⟩ | integracja walki, Review z graczami |
| S4 | ⟨student⟩ | planowanie wokół przerwy świątecznej |
| S5 | ⟨student⟩ | stabilizacja, dokumentacja, demo i turniej |

### 6.2 RACI

| Aktywność | PO sprintu | Autor epiku | Zespół | Prowadzący |
|---|:---:|:---:|:---:|:---:|
| Założenia epiku (EU1) | C | **A/R** | C | I |
| Planning i podział zadań (EU3) | **A/R** | C | C | I |
| Estymacja w Jira (EU4) | A | **R** | R | I |
| Burndown (EU4) | **A/R** | I | I | I |
| Daily i raporty | **A/R** | R | R | I |
| Implementacja (EU2) | I | **A/R** | R | I |
| Dokumentacja modułu w Confluence (EU6) | C | **A/R** | R | I |
| Sprint Review (EU5) | **A/R** | R | R | I |
| Arbitraż sporów o estymację | R | R | I | **A** |
| Akceptacja ADR / zmiany kontraktu | C | R | **A** (2 osoby) | I |

## 7. Rejestr ryzyk (EU4)

| ID | Ryzyko | P‑stwo | Wpływ | Mitygacja | Właściciel |
|---|---|---|---|---|---|
| R-1 | Zakres reguł większy niż pojemność (MVP ≈ 291 h w semestrze 1) | wysokie | wysoki | linia cięcia W0–W3; talia MVP 12 kart; cięcie od dołu | PO sprintu |
| R-2 | Bus factor 1 w Kernelu (ścieżka krytyczna E1) | wysokie | wysoki | sub‑taski E1 dla 2 osób; review każdego PR; testy R‑nn i wyrocznia | autor E1 |
| R-3 | Rozjazd kontraktów C#↔TS | średnie | wysoki | ADR-0010: próbka JSON sprawdzana w obu językach; PR z recenzentem z drugiej strony | autor E3/E4 |
| R-4 | Błędne reguły przepisane z prototypu | średnie | średni | `ROZBIEZNOSCI.md` + decyzje E0-S04; testy różnicowe z wyrocznią (E5-S02) | autor E1/E5 |
| R-5 | Utrata kontaktu z graczami testowymi | średnie | krytyczny | 3 osoby + zastępstwo; termin Review potwierdzany 3 dni wcześniej | PO sprintu |
| R-6 | Problemy środowiska Windows (Smart App Control, OneDrive, długie ścieżki) | średnie | średni | `tools/doctor.ps1`, `jak-zaczac.md`, CI jako dowód działania | autor E6 |
| R-7 | Agent AI wprowadza błąd lub zmyśla | średnie | średni | konstytucja (art. X), recenzja człowieka, testy obowiązkowe, etykiety [V]/[Z] | wszyscy |
| R-8 | Nierówne zaangażowanie | średnie | średni | jawne raporty daily, Log Work, zadania dla każdego w każdym sprincie | PO sprintu |

## 8. Umowa zespołowa

### 8.1 Definition of Ready

Zadanie wchodzi do sprintu, gdy: ma kryteria GIVEN/WHEN/THEN · task ≤ 4 h · wykonawca potwierdził szacunek na planningu ·
zależności są gotowe lub zamockowane (fake transport, próbka kontraktu) · story ≥ 3 SP ma zaakceptowaną zmianę OpenSpec.

### 8.2 Definition of Done

Zadanie przechodzi do *Resolved*, gdy: kod na gałęzi `typ/REJ-123-opis` · CI zielone (build bez ostrzeżeń, testy, lint) ·
testy dla logiki (reguły: test `Rnn_…`) · PR zaakceptowany przez ≥ 1 inną osobę · dokumentacja modułu zaktualizowana (repo + Confluence) ·
czas zalogowany w Jirze · zmiana pokazana na środowisku dev i sprawdzona z kryteriami akceptacji.
