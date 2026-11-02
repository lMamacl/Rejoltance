<!-- CONFLUENCE 1:1 EXPORT | Source: docs/00-przewodnik-i-setup/05-slownik-pojec.md @ a2bf2a4 (2026-11-02) -->
# 0.5 Słownik pojęć domenowych, technicznych i procesowych

> **Źródło prawdy:** repozytorium (`docs/00-przewodnik-i-setup/05-slownik-pojec.md`) · **Kategoria dokumentacji:** słownik pojęć systemowych i procesowych · **Etap SDD:** Fundamenty

Słownik ujednolica pojęcia, których używamy w **RE:JOLTANCE**: w wymaganiach produktu (PRD), w architekturze (SAD), w specyfikacjach OpenSpec i w kodzie. Skróty PRD, SAD i SDD (Spec-Driven Development, czyli „najpierw specyfikacja, potem kod”) wyjaśniamy w sekcji 2.

Nazwy mechanik, typów i kontraktów z kodu zapisujemy w oryginale, także w polskim tekście (np. `MatchView`, `Intent`, `Blood`, `SoulGuard`).

---

## 1. Pojęcia domenowe (mechanika gry)

| Pojęcie | Definicja | Powiązane reguły |
|---|---|---|
| **Lane battler** | Gatunek taktycznej gry karcianej. Jednostki stoją na przeciwległych torach (liniach). Walczą z jednostką naprzeciwko albo z bohaterem przeciwnika. | R-21, R-30 |
| **Linia (`Lane`)** | Jedna z czterech kolumn planszy, numerowanych od `0` do `3` od lewej. W każdej linii każdy z dwóch graczy ma dokładnie jedno miejsce (slot) na jednostkę. | R-21, R-30 |
| **Bohater (`Hero`)** | Postać reprezentująca gracza w meczu. Zaczyna z **20 punktami zdrowia (HP)**. Gdy HP spadnie do 0 lub niżej, gracz od razu przegrywa. | R-02, R-70 |
| **Blood (Krew)** | Podstawowy zasób, którym płacisz za karty. Na początku rundy *n* każdy gracz ma go `min(n, 10)`. Niewykorzystany zasób z poprzedniej rundy przepada. | R-10, R-23, R-65 |
| **Jednostka (`Unit`)** | Karta, którą kładziesz na wolny slot własnej linii. Ma koszt w Blood, atak (`Attack`) i zdrowie (`Health`). Może mieć podtyp plemienny, słowa kluczowe i zdolności wyzwalane. | R-20, R-21 |
| **Akcja / Czar (`Spell` / `Action`)** | Karta jednorazowa. Po opłaceniu kosztu od razu wykonuje efekt. Potem trafia na stos kart odrzuconych. Karta typu „prezent” trafia zamiast tego do ręki przeciwnika. | R-20, R-22 |
| **Token (`Token`)** | Karta tworzona w trakcie meczu przez efekty innych kart (identyfikatory `Id >= 900`). Tokenów nie ma w talii startowej. Po usunięciu z planszy znikają z gry. | R-01, R-47, R-64 |
| **Mulligan** | Wymiana kart przed pierwszą rundą. Ręka startowa ma 4 karty. Wybierasz dowolną ich liczbę i dobierasz tyle samo nowych z wierzchu talii. Wymienione karty wtasowujesz z powrotem do talii. | R-03 |
| **Gracz A / Gracz B** | Role w bieżącej rundzie. **Gracz A** zaczyna rundę, **Gracz B** to drugi gracz. Role zamieniają się co rundę. | R-04, R-11, R-12 |
| **Kroki rundy (`Steps`)** | Każda runda ma cztery kroki po kolei: (1) *krok jednostek Gracza A*, (2) *krok mieszany Gracza B* (jednostki i akcje), (3) *krok akcji Gracza A*, (4) *automatyczna walka* na liniach `0 → 3`. | R-12, R-30 |
| **Fatigue (Wyczerpanie)** | Obrażenia dla bohatera za każdą próbę dobrania karty z pustej talii. Rosną z każdą próbą: pierwsza zadaje 1, druga 2, trzecia 3 itd. Stosu odrzuconych nie tasujemy z powrotem do talii. | R-14 |
| **Słowo kluczowe (`Keyword`)** | Wrodzona lub nadana cecha, która zmienia zasady walki i przetrwania jednostki: `Flying`, `Armored(n)`, `Armor2`, `SplashDamage(n)`, `Breakthrough`, `BurnSource`, `SoulGuard`, `Unkillable`. | R-33, R-40..R-47 |
| **Status (`Status`)** | Czasowy stan jednostki. `Marked` podwaja obrażenia otrzymane po pancerzu. `Stunned` sprawia, że jednostka pomija najbliższe uderzenie. `Burning` zadaje 1 obrażenie na koniec rundy. | R-15, R-41..R-43, R-48 |
| **Sacrifice (Poświęcenie)** | Celowe zniszczenie własnej jednostki jako koszt albo efekt karty. Omija ochronę `SoulGuard`. Uruchamia wyzwalacze `OnSacrificed` i `OnOtherUnitSacrificed`. | R-46, R-51 |
| **Silence (Wyciszenie)** | Efekt, który zdejmuje z jednostki słowa kluczowe, statusy i modyfikatory statystyk. Wyłącza też jej zdolności specjalne. | R-52 |

---

## 2. Pojęcia architektoniczne, techniczne i procesowe

| Pojęcie | Definicja | Miejsce w projekcie |
|---|---|---|
| **SDD (Spec-Driven Development)** | Metoda pracy, w której formalna, wykonywalna specyfikacja wymagań i architektury powstaje przed kodem. Ta specyfikacja steruje pracą programistów i agentów AI. | `openspec/`, `docs/` |
| **OpenSpec** | Narzędzie CLI i format specyfikacji. Przechowuje aktualne wymagania (`openspec/specs/`) i propozycje zmian (`openspec/changes/`). | `openspec/config.yaml` |
| **PRD (Product Requirements Document)** | Dokument wymagań produktu. Opisuje cel biznesowy, persony, zakres funkcjonalny, historyjki użytkownika i kryteria akceptacji. | `docs/01-dokumentacja-systemowa/01-prd-wymagania-produktu.md` |
| **SAD (Software Architecture Document)** | Dokument architektury. Opisuje strukturę systemu (C4), komponenty, rozwiązania przekrojowe, model danych i wdrożenie. | `docs/01-dokumentacja-systemowa/05-sad-architektura-systemu.md` |
| **TDD (Technical Design Document)** | Szczegółowy projekt techniczny jednej funkcjonalności lub zmiany. Łączy architekturę z SAD z konkretnymi klasami i algorytmami. Uwaga: w opisie procesu skrót TDD oznacza też Test-Driven Development. | `openspec/changes/<id>/design.md`, `05-szablony/szablon-tdd.md` |
| **ADR (Architecture Decision Record)** | Krótki, wersjonowany zapis ważnej decyzji architektonicznej. Zawiera rozważone alternatywy, uzasadnienie (w formacie Y-statement) i konsekwencje. | `docs/01-dokumentacja-systemowa/07-decyzje-adr/` |
| **R‑nn / NFR‑nn** | Identyfikatory wymagań. `R-01..R-84` to wymagania funkcjonalne (reguły gry). `NFR-01..NFR-70` to wymagania niefunkcjonalne (NFR, Non-Functional Requirements) według normy ISO/IEC 25010. | `03-indeks-regul-r-nn.md`, `openspec/specs/` |
| **Kernel (`Rejoltance.Kernel`)** | Silnik reguł w C#. Jest czysty i deterministyczny: nie używa wejścia/wyjścia, zegara systemowego ani niedeterministycznej losowości. | `src/Rejoltance.Kernel/` |
| **`Intent`** | Kontrakt opisujący intencję gracza, np. zagranie karty, zakończenie kroku, wybór celu. Klient wysyła go do serwera, który rozstrzyga o wszystkim (serwer autorytatywny). | `src/Rejoltance.Contracts/Intents.cs` |
| **`MatchView`** | Widok stanu meczu, który serwer przygotowuje dla jednego miejsca przy stole (`Seat`). Ukrywa rękę przeciwnika i kolejność jego talii (*Fog of War*). | `src/Rejoltance.Contracts/MatchView.cs` |
| **`LegalAction`** | Dozwolony ruch w bieżącym stanie meczu, wyliczony przez Kernel. To jedyne źródło prawdy o legalności zagrań dla interfejsu, serwera i bota. | `src/Rejoltance.Contracts/` |
| **`PendingInteraction`** | Pytanie silnika do gracza, np. o karty do mulliganu albo o cel efektu. Dzięki niemu Kernel pozostaje czystą funkcją i nie blokuje wątków. | `src/Rejoltance.Contracts/` |
| **`DomainEvent`** | Zdarzenie domenowe emitowane przy zmianie stanu w Kernelu, np. dobranie karty albo zadanie obrażeń. Klient odtwarza na jego podstawie animacje. | `src/Rejoltance.Contracts/Events.cs` |
| **Rola agenta (`Agent Role`)** | Profil agenta AI w `.agents/agents/`. Określa zakres odpowiedzialności, dozwolone narzędzia i przypisane skille. | `.agents/agents/`, `docs/04-system-agentow-ai/` |
| **Skill (`Agent Skill`)** | Powtarzalna procedura w `.agents/skills/<nazwa>/SKILL.md`. Agent albo człowiek wykonuje ją krok po kroku przy danym typie zadania. | `.agents/skills/`, `docs/04-system-agentow-ai/` |
| **Fala (`Wave W0–W3`)** | Poziom priorytetu, którym wyznaczamy linię cięcia zakresu. `W0` to fundamenty. `W1` to MVP (Minimum Viable Product, najmniejsza grywalna wersja) na Semestr 1. `W2` to pełna gra na Semestr 2. `W3` to opcjonalne rozszerzenia. | `docs/03-dokumentacja-procesowa/02-backlog/` |
