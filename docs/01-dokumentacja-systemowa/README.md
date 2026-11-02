# 01. Dokumentacja produktowa — systemowa

W katalogu `01-dokumentacja-systemowa/` jest dokumentacja systemowa projektu RE:JOLTANCE. Podział dokumentów opiera się na klasyfikacji z opracowania AltexSoft.

Pracujemy w podejściu Spec-Driven Development (SDD, czyli „najpierw specyfikacja, potem kod”). Dla SDD najważniejsze są tu dwa dokumenty:

1. [Wymagania produktu — PRD (`01-prd-wymagania-produktu.md`)](01-prd-wymagania-produktu.md). PRD (Product Requirements Document) odpowiada na pytanie **co i dlaczego** budujemy. Etap SDD: *Specyfikacja*.
2. [Dokument architektury systemu — SAD (`05-sad-architektura-systemu.md`)](05-sad-architektura-systemu.md) razem ze [Stosem technologicznym (`06-stos-technologiczny.md`)](06-stos-technologiczny.md). SAD (Software Architecture Document) odpowiada na pytanie **jak i czym** budujemy. Etap SDD: *Planowanie*.

---

## Zawartość sekcji (układ 1:1 z Confluence)

| Nr | Plik / katalog | Typ dokumentacji (wg AltexSoft) | Etap SDD | Co zawiera |
|---|---|---|---|---|
| **1.1** | [`01-prd-wymagania-produktu.md`](01-prd-wymagania-produktu.md) | Dokument wymagań produktu (PRD) | Specyfikacja | Cele, role, persony, epiki E0–E6, historyjki z kryteriami `GIVEN/WHEN/THEN`, wymagania funkcjonalne i niefunkcjonalne (ISO 25010), elementy poza zakresem. |
| **1.2** | [`02-specyfikacja-regul-gry.md`](02-specyfikacja-regul-gry.md) | Wymagania systemowe i reguły domenowe | Specyfikacja | Zasady gry opisane zwykłym językiem: 4 linie, zasób Blood, fazy rundy, słowa kluczowe, walka, warunki zwycięstwa. |
| **1.3** | [`03-indeks-regul-r-nn.md`](03-indeks-regul-r-nn.md) | Macierz śledzenia wymagań | Specyfikacja / Weryfikacja | Łączy 55 reguł (`R-01..R-84`) z prototypem JS, specyfikacjami `openspec/specs/`, zadaniami z backlogu i testami xUnit. |
| **1.4** | [`04-rozbieznosci-prototypu.md`](04-rozbieznosci-prototypu.md) | Notatka analityczna rozbieżności | Specyfikacja | 20 rozbieżności i błędów prototypu JS (`D-01..D-20`) z propozycjami rozwiązań. |
| **1.5** | [`05-sad-architektura-systemu.md`](05-sad-architektura-systemu.md) | Dokument architektury systemu (SAD) | Planowanie | Tło i ograniczenia, model C4 (poziomy 1–3), diagramy sekwencji, model danych, strategie techniczne, wdrożenie. |
| **1.6** | [`06-stos-technologiczny.md`](06-stos-technologiczny.md) | Stos technologiczny i roadmapa IT | Planowanie | Technologie i wersje (.NET 10, SignalR, React 19, TypeScript, Vite, Aspire, SQLite/PostgreSQL), uzasadnienie wyborów, odrzucone alternatywy, roadmapa. |
| **1.7** | [`07-decyzje-adr/`](07-decyzje-adr/README.md) | Rejestr decyzji architektonicznych (ADR) | Planowanie | Decyzje architektoniczne `ADR-0001..ADR-0011` zapisane według stałego szablonu. |
| **1.8** | [`08-mapa-kodu-i-modulow.md`](08-mapa-kodu-i-modulow.md) | Przegląd dokumentacji kodu źródłowego | Realizacja | Struktura kodu, granice zależności między modułami, 5 zamrożonych kontraktów, „gdzie dodać nową funkcję”. |
| **1.9** | [`09-kontrakty-i-api.md`](09-kontrakty-i-api.md) | Dokumentacja interfejsów API | Planowanie / Realizacja | Endpointy REST (`/api/*`), metody i zdarzenia huba SignalR (`/api/hubs/match`), schematy JSON. |
| **1.10** | [`10-ux-design-i-przeplywy.md`](10-ux-design-i-przeplywy.md) | Dokumentacja projektowa UX i przewodnik stylu | Planowanie | Mapa ekranów, makieta planszy, przepływ gracza, przewodnik stylu z kontrastem WCAG 2.1 AA. |
| **1.11** | [`11-strategia-testow-qa.md`](11-strategia-testow-qa.md) | Strategia zapewnienia jakości i testów (QA) | Weryfikacja | Piramida testów, nazwy testów `Rnn_...`, kryteria wejścia i wyjścia (EU6). |

Skróty użyte w tabeli: ADR (Architecture Decision Record) to zapis jednej decyzji architektonicznej. C4 to model opisu architektury w czterech poziomach szczegółowości. QA (Quality Assurance) to zapewnienie jakości.
