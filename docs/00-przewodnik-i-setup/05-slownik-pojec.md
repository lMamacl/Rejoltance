# 0.5 Słownik pojęć domenowych, technicznych i procesowych

> **Źródło prawdy:** repozytorium (`docs/00-przewodnik-i-setup/05-slownik-pojec.md`) · **Kategoria dokumentacji:** Słownik pojęć systemowych i procesowych · **Etap SDD:** Fundamenty

Niniejszy słownik definiuje ujednoliconą terminologię używaną w dokumentacji analitycznej (PRD), architektonicznej (SAD), specyfikacjach OpenSpec oraz kodzie źródłowym projektu **RE:JOLTANCE**. W dokumentacji polskojęzycznej nazwy własne mechanik, typów i kontraktów z kodu zapisujemy w oryginale (np. `MatchView`, `Intent`, `Blood`, `SoulGuard`).

---

## 1. Pojęcia domenowe (Mechanika gry RE:JOLTANCE)

| Pojęcie | Definicja domenowa | Powiązane reguły |
|---|---|---|
| **Lane battler** | Gatunek taktycznej gry karcianej, w której jednostki rozmieszczane są na przeciwległych torach (liniach) i ścierają się bezpośrednio z jednostką stojącą naprzeciwko lub z bohaterem przeciwnika. | R-21, R-30 |
| **Linia (`Lane`)** | Jedna z czterech kolumn planszy (indeksowanych od `0` do `3` od lewej do prawej). W każdej linii znajduje się dokładnie jedno miejsce (slot) na jednostkę dla każdego z dwóch graczy. | R-21, R-30 |
| **Bohater (`Hero`)** | Reprezentacja gracza w meczu. Każdy bohater rozpoczyna pojedynek z pulą **20 punktów zdrowia (HP)**. Spadek HP bohatera do 0 lub poniżej oznacza natychmiastową porażkę. | R-02, R-70 |
| **Blood (Krew)** | Podstawowy zasób służący do opłacania kosztu zagrywanych kart. Na początku rundy *n* zasób każdego gracza jest odnawiany do wartości `min(n, 10)`. Niewykorzystany zasób z poprzedniej rundy przepada. | R-10, R-23, R-65 |
| **Jednostka (`Unit`)** | Karta umieszczana na wolnym slocie własnej linii. Posiada koszt w Blood, siłę ataku (`Attack`), punkty zdrowia (`Health`), opcjonalny podtyp plemienny, słowa kluczowe oraz zdolności wyzwalane. | R-20, R-21 |
| **Akcja / Czar (`Spell` / `Action`)** | Karta jednorazowego użytku, która po opłaceniu kosztu wykonuje natychmiastowy efekt i trafia na stos kart odrzuconych (lub do ręki przeciwnika w przypadku kart typu „prezent”). | R-20, R-22 |
| **Token (`Token`)** | Karta generowana dynamicznie w trakcie meczu przez efekty innych kart (identyfikatory `Id >= 900`). Tokeny nie mogą wchodzić w skład początkowej talii gracza, a po usunięciu z planszy znikają z gry. | R-01, R-47, R-64 |
| **Mulligan** | Faza początkowej wymiany kart przed pierwszą rundą. Każdy gracz może wskazać dowolną liczbę kart z 4-kartowej ręki startowej, dobrać tyle samo nowych kart z wierzchu talii, a wymienione karty wtasować z powrotem do talii. | R-03 |
| **Gracz A / Gracz B** | Oznaczenie ról w bieżącej rundzie: **Gracz A** to gracz rozpoczynający daną rundę, natomiast **Gracz B** to drugi gracz. Role te zmieniają się naprzemiennie z każdą kolejną rundą. | R-04, R-11, R-12 |
| **Kroki rundy (`Steps`)** | Cztery sekwencyjne fazy każdej rundy: (1) *Krok jednostek Gracza A*, (2) *Krok mieszany Gracza B* (jednostki i akcje), (3) *Krok akcji Gracza A*, (4) *Automatyczna faza walki* na liniach `0 → 3`. | R-12, R-30 |
| **Fatigue (Wyczerpanie)** | Narastające obrażenia zadawane bohaterowi przy każdej próbie dobrania karty z pustej talii (pierwsza próba zadaje 1 obrażenie, druga 2, trzecia 3 itd.). Stos odrzuconych nie jest tasowany z powrotem do talii. | R-14 |
| **Słowo kluczowe (`Keyword`)** | Wrodzona lub nadana właściwość modyfikująca zasady walki i przetrwania jednostki: `Flying`, `Armored(n)`, `Armor2`, `SplashDamage(n)`, `Breakthrough`, `BurnSource`, `SoulGuard`, `Unkillable`. | R-33, R-40..R-47 |
| **Status (`Status`)** | Stan czasowy nakładany na jednostkę w trakcie gry: `Marked` (podwaja otrzymywane obrażenia po pancerzu), `Stunned` (jednostka pomija swoje najbliższe uderzenie), `Burning` (1 obrażenie na koniec rundy). | R-15, R-41..R-43, R-48 |
| **Sacrifice (Poświęcenie)** | Celowe zniszczenie własnej jednostki jako koszt lub efekt karty. Omija ochronę `SoulGuard` i uruchamia wyzwalacze `OnSacrificed` oraz `OnOtherUnitSacrificed`. | R-46, R-51 |
| **Silence (Wyciszenie)** | Efekt usuwający z jednostki wszystkie słowa kluczowe, nałożone statusy, modyfikatory statystyk oraz wyłączający jej zdolności specjalne. | R-52 |

---

## 2. Pojęcia architektoniczne, techniczne i procesowe (SDD)

| Pojęcie | Definicja inżynierska | Miejsce w projekcie |
|---|---|---|
| **SDD (Spec-Driven Development)** | Metodyka wytwarzania oprogramowania, w której formalna, wykonywalna specyfikacja wymagań i architektury powstaje przed kodem i steruje pracą programistów oraz agentów AI. | `openspec/`, `docs/` |
| **OpenSpec** | Narzędzie CLI i standard specyfikacji używany w projekcie do zarządzania żywymi wymaganiami (`openspec/specs/`) oraz propozycjami zmian (`openspec/changes/`). | `openspec/config.yaml` |
| **PRD (Product Requirements Document)** | Dokument wymagań produktu definiujący cel biznesowy, persony użytkowników, zakres funkcjonalny, historyjki użytkownika i kryteria akceptacji. | `docs/01-dokumentacja-systemowa/01-prd-wymagania-produktu.md` |
| **SAD (Software Architecture Document)** | Dokument architektury oprogramowania opisujący strukturę wysokopoziomową (C4), komponenty, strategie przekrojowe, model danych i architekturę wdrożenia. | `docs/01-dokumentacja-systemowa/05-sad-architektura-systemu.md` |
| **TDD (Technical Design Document)** | Niskopoziomowy projekt techniczny pojedynczej funkcjonalności lub zmiany, łączący architekturę SAD z konkretnymi klasami i algorytmami w kodzie. | `openspec/changes/<id>/design.md`, `05-szablony/szablon-tdd.md` |
| **ADR (Architecture Decision Record)** | Krótki, wersjonowany dokument rejestrujący istotną decyzję architektoniczną wraz z rozważanymi alternatywami, uzasadnieniem (w formacie Y-statement) i konsekwencjami. | `docs/01-dokumentacja-systemowa/07-decyzje-adr/` |
| **R‑nn / NFR‑nn** | Unikalne identyfikatory wymagań funkcjonalnych reguł gry (`R-01..R-84`) oraz wymagań niefunkcjonalnych wg normy ISO/IEC 25010 (`NFR-01..NFR-70`). | `03-indeks-regul-r-nn.md`, `openspec/specs/` |
| **Kernel (`Rejoltance.Kernel`)** | Czysty, deterministyczny moduł silnika reguł w C# pozbawiony operacji wejścia/wyjścia, zegara systemowego i niedeterministycznej losowości. | `src/Rejoltance.Kernel/` |
| **`Intent`** | Kontrakt reprezentujący intencję gracza (np. zagranie karty, zakończenie kroku, wybór celu) wysyłaną z klienta do autorytatywnego serwera. | `src/Rejoltance.Contracts/Intents.cs` |
| **`MatchView`** | Projekcja stanu meczu przygotowana przez serwer dla konkretnego miejsca przy stole (`Seat`), ukrywająca zawartość ręki i kolejność talii przeciwnika (*Fog of War*). | `src/Rejoltance.Contracts/MatchView.cs` |
| **`LegalAction`** | Wyliczony przez Kernel dozwolony ruch w bieżącym stanie meczu. Stanowi jedyne źródło prawdy o legalności zagrań dla interfejsu użytkownika, serwera i bota. | `src/Rejoltance.Contracts/` |
| **`PendingInteraction`** | Struktura opisująca pytanie silnika do gracza (np. wybór kart do mulliganu lub wskazanie celu efektu), dzięki której Kernel pozostaje czystą funkcją bez blokowania wątków. | `src/Rejoltance.Contracts/` |
| **`DomainEvent`** | Zdarzenie domenowe wyemitowane podczas przejścia stanu w Kernelu (np. dobranie karty, zadanie obrażeń), wykorzystywane przez klienta do odtwarzania animacji. | `src/Rejoltance.Contracts/Events.cs` |
| **Rola Agenta (`Agent Role`)** | Wyspecjalizowany profil agenta AI w `.agents/agents/` posiadający ściśle określony zakres odpowiedzialności, zestaw dozwolonych narzędzi oraz przypisane skille. | `.agents/agents/`, `docs/04-system-agentow-ai/` |
| **Skill (`Agent Skill`)** | Powtarzalna instrukcja proceduralna w `.agents/skills/<nazwa>/SKILL.md`, którą agent (lub człowiek) wykonuje krok po kroku przy realizacji określonego typu zadania. | `.agents/skills/`, `docs/04-system-agentow-ai/` |
| **Fala (`Wave W0–W3`)** | Poziom priorytetyzacji zakresu projektu używany do wyznaczenia linii cięcia: `W0` (fundamenty), `W1` (MVP na Semestr 1), `W2` (pełna gra na Semestr 2), `W3` (rozszerzenia opcjonalne). | `docs/03-dokumentacja-procesowa/02-backlog/` |
