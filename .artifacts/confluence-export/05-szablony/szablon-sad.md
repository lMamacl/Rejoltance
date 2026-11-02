<!-- CONFLUENCE 1:1 EXPORT | Source: docs/05-szablony/szablon-sad.md @ 10829d3 (2026-11-02) -->
# 5.3 Szablon: Dokument Architektury Oprogramowania (Software Architecture Document — SAD)

> **Źródło prawdy:** `<Repozytorium>` · **Kategoria AltexSoft:** Product: System Documentation — Software Architecture Document (SAD) · **Etap SDD:** Plan (`Plan`)
> *Wypełniony dokument dla projektu RE:JOLTANCE znajduje się w: [`01-dokumentacja-systemowa/05-sad-architektura-systemu.md`](../01-dokumentacja-systemowa/05-sad-architektura-systemu.md).*

---

## 1. Przegląd, tło i cele architektoniczne (Overview and Background)

- **Cel systemu i kontekst problemu:** `<Krótki opis problemu architektonicznego>`
- **Kluczowe cele jakościowe (Top 3–5 wg ISO/IEC 25010):**

| Priorytet | Cel jakościowy | Powiązane wymagania (`NFR-nn`) | Założenie architektoniczne realizujące cel |
|---|---|---|---|
| 1 | | | |

## 2. Podsumowanie wymagań i ograniczenia

- **Główne wymagania funkcjonalne determinujące architekturę:** `<Lista>`
- **Ograniczenia techniczne, organizacyjne i licencyjne:** `<Tabela ograniczeń i ich skutków>`

## 3. Architektura wysokopoziomowa (High-Level Architecture — C4 Poziom 1 i 2)

- **Diagram Kontekstu Systemu (C4 Level 1):** `<Diagram Mermaid pokazujący użytkowników i systemy zewnętrzne>`
- **Diagram Kontenerów (C4 Level 2):** `<Diagram Mermaid pokazujący aplikację kliencką, serwer, bazę danych i protokoły komunikacji>`

## 4. Szczegółowy projekt systemu (Detailed System Design — C4 Poziom 3)

- **Podział na moduły i reguły zależności:** `<Tabela modułów, ich odpowiedzialności i dozwolonych kierunków zależności>`
- **Kontrakty komunikacyjne i specyfikacja API:** `<Opis głównych DTO i odnośnik do dokumentacji API>`
- **Widok wykonania (Runtime View):** `<Diagramy sekwencji dla najważniejszych przebiegów>`
- **Architektura danych (Data Architecture):** `<Diagram ERD i zasady trwałości danych>`

## 5. Strategie techniczne i koncepcje przekrojowe (Technical Strategies and Solutions)

| Zagadnienie przekrojowe (Bezpieczeństwo, Współbieżność, Determinizm, Obsługa błędów, Telemetria) | Zastosowane rozwiązanie techniczne |
|---|---|
| | |

## 6. Infrastruktura i architektura wdrożenia

- **Środowiska uruchomieniowe (Lokalne, CI, Demo/Produkcja):** `<Tabela i diagram wdrożenia>`
- **Wymagania sieciowe i sprzętowe:** `<Specyfikacja>`

## 7. Decyzje architektoniczne (ADR) oraz ryzyka i dług techniczny

- **Odnośnik do rejestru ADR:** [`07-decyzje-adr/`](../01-dokumentacja-systemowa/07-decyzje-adr/README.md)
- **Tabela ryzyk architektonicznych i długu technicznego:** `<Ryzyko → Skutek → Plan mitygacji>`
