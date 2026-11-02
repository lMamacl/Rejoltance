<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/README.md @ 10829d3 (2026-11-02) -->
# 01. Dokumentacja produktowa — systemowa

Katalog `01-dokumentacja-systemowa/` zawiera kompletną dokumentację systemową projektu **RE:JOLTANCE** zgodnie z klasyfikacją przedstawioną w opracowaniu AltexSoft.

Znajdują się tutaj dwa najważniejsze dokumenty wymagane w procesie **Spec-Driven Development (SDD)**:

1. **[Wymagania produktu — PRD (`01-prd-wymagania-produktu.md`)](01-prd-wymagania-produktu.md)** — pełna dokumentacja analityczna odpowiadająca na pytanie **CO i DLACZEGO** budujemy (etap SDD: *Specyfikacja*).
2. **[Dokument architektury systemu — SAD (`05-sad-architektura-systemu.md`)](05-sad-architektura-systemu.md)** wraz ze **[Stosem technologicznym (`06-stos-technologiczny.md`)](06-stos-technologiczny.md)** — pełna dokumentacja architektoniczna odpowiadająca na pytanie **JAK i CZYM** budujemy rozwiązanie (etap SDD: *Planowanie*).

---

## Zawartość sekcji (Układ 1:1 z Confluence)

| Nr | Plik / Katalog | Typ dokumentacji (wg AltexSoft) | Etap SDD | Opis zawartości |
|---|---|---|---|---|
| **1.1** | [`01-prd-wymagania-produktu.md`](01-prd-wymagania-produktu.md) | **Dokument wymagań produktu (PRD)** | Specyfikacja | **Główny dokument analityczny:** cele biznesowe, dopasowanie strategiczne, role, persony, epiki E0–E6, kluczowe historyjki użytkownika z kryteriami `GIVEN/WHEN/THEN`, wymagania funkcjonalne i niefunkcjonalne (ISO 25010), założenia oraz elementy poza zakresem. |
| **1.2** | [`02-specyfikacja-regul-gry.md`](02-specyfikacja-regul-gry.md) | Wymagania systemowe i reguły domenowe | Specyfikacja | Kompletny, przystępny dla ludzi opis zasad rozgrywki RE:JOLTANCE (mechanika 4 linii, zasób Blood, fazy rundy, słowa kluczowe, walka, warunki zwycięstwa). |
| **1.3** | [`03-indeks-regul-r-nn.md`](03-indeks-regul-r-nn.md) | Macierz śledzenia wymagań | Specyfikacja / Weryfikacja | Macierz śledzenia łącząca 55 reguł funkcjonalnych (`R-01..R-84`) z prototypem JS, specyfikacjami `openspec/specs/`, zadaniami w rejestrze produktu oraz testami xUnit. |
| **1.4** | [`04-rozbieznosci-prototypu.md`](04-rozbieznosci-prototypu.md) | Notatka analityczna rozbieżności | Specyfikacja | Analiza 20 rozbieżności i błędów wykrytych w referencyjnym prototypie JS (`D-01..D-20`) wraz z rekomendacjami dla zespołu. |
| **1.5** | [`05-sad-architektura-systemu.md`](05-sad-architektura-systemu.md) | **Dokument architektury systemu (SAD)** | Planowanie | **Główny dokument architektury:** przegląd i tło, ograniczenia, architektura wysokopoziomowa (C4 poziom 1 i 2), szczegółowy projekt komponentów (C4 poziom 3, diagramy sekwencji, model danych), strategie techniczne (autorytet serwera, determinizm, ochrona informacji, bezpieczeństwo) oraz architektura wdrożenia. |
| **1.6** | [`06-stos-technologiczny.md`](06-stos-technologiczny.md) | **Stos technologiczny i roadmapa IT** | Planowanie | Szczegółowa specyfikacja stosu technologicznego (.NET 10, SignalR, React 19, TypeScript, Vite, Aspire, SQLite/PostgreSQL), uzasadnienie wyborów, odrzucone alternatywy oraz roadmapa technologiczna. |
| **1.7** | [`07-decyzje-adr/`](07-decyzje-adr/README.md) | Rejestr decyzji architektonicznych (ADR) | Planowanie | Rejestr kluczowych decyzji architektonicznych (`ADR-0001..ADR-0011`) zapisanych w ustrukturyzowanym formacie zdania decyzyjnego. |
| **1.8** | [`08-mapa-kodu-i-modulow.md`](08-mapa-kodu-i-modulow.md) | Przegląd dokumentacji kodu źródłowego | Realizacja | Przewodnik po strukturze kodu źródłowego, granicach zależności pomiędzy modułami, 5 zamrożonych kontraktach oraz instrukcja „gdzie dodać nową funkcjonalność”. |
| **1.9** | [`09-kontrakty-i-api.md`](09-kontrakty-i-api.md) | Dokumentacja interfejsów API | Planowanie / Realizacja | Specyfikacja punktów końcowych REST (`/api/*`), metod i zdarzeń huba WebSocket SignalR (`/api/hubs/match`) oraz schematów JSON. |
| **1.10** | [`10-ux-design-i-przeplywy.md`](10-ux-design-i-przeplywy.md) | Dokumentacja projektowa UX i przewodnik stylu | Planowanie | Mapa ekranów aplikacji, makieta planszy meczowej, diagram przepływu gracza oraz przewodnik stylu wizualnego z weryfikacją kontrastu WCAG 2.1 AA. |
| **1.11** | [`11-strategia-testow-qa.md`](11-strategia-testow-qa.md) | Strategia zapewnienia jakości i testów (QA) | Weryfikacja | Strategia zapewnienia jakości, piramida testów automatycznych, konwencje nazewnicze testów `Rnn_...` oraz kryteria wejścia i wyjścia (EU6). |
