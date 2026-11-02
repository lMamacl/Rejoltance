<!-- CONFLUENCE 1:1 EXPORT | Source: docs/05-szablony/README.md @ a2bf2a4 (2026-11-02) -->
# 05. Biblioteka szablonów dokumentacji technicznej

Katalog `05-szablony/` zawiera gotowe szablony dla typów dokumentacji z klasyfikacji AltexSoft i z procesu SDD (spec-driven development, czyli pracy sterowanej specyfikacją).

Dwa główne dokumenty mamy już opracowane dla RE:JOLTANCE w sekcji `01-dokumentacja-systemowa/`: PRD (Product Requirements Document, wymagania produktu — [`01-prd-wymagania-produktu.md`](../01-dokumentacja-systemowa/01-prd-wymagania-produktu.md)) i SAD (Software Architecture Document, architektura systemu — [`05-sad-architektura-systemu.md`](../01-dokumentacja-systemowa/05-sad-architektura-systemu.md)). Szablony poniżej służą do tworzenia kolejnych stron w Confluence PB i nowych dokumentów w następnych sprintach.

---

## Katalog szablonów (układ 1:1 z Confluence)

Skróty w tabeli: TDD — Technical Design Document (projekt techniczny), UX — user experience (doświadczenie użytkownika), QA — quality assurance (zapewnienie jakości), CI — ciągła integracja, EU — efekt uczenia się.

| Nr | Plik szablonu | Kategoria i typ dokumentacji | Etap SDD | Kiedy go użyć? |
|---|---|---|---|---|
| **5.1** | [`naglowek-strony-confluence.md`](naglowek-strony-confluence.md) | Standard metadanych strony | Wszystkie etapy | Na początku każdej strony w przestrzeni Confluence PB (`sync_confluence.py` wstawia go automatycznie). |
| **5.2** | [`szablon-prd.md`](szablon-prd.md) | Dokumentacja systemowa — wymagania produktu (PRD) | Specyfikacja | Gdy definiujesz wymagania produktu albo nowego dużego modułu. |
| **5.3** | [`szablon-sad.md`](szablon-sad.md) | Dokumentacja systemowa — architektura systemu (SAD) | Planowanie | Gdy opisujesz architekturę systemu (struktura AltexSoft + arc42 + model C4). |
| **5.4** | [`szablon-tdd.md`](szablon-tdd.md) | Dokumentacja systemowa — szczegółowy projekt techniczny (TDD) | Planowanie / Zadania | Gdy projektujesz szczegóły techniczne złożonej funkcji (także jako wzór dla `openspec/changes/<id>/design.md`). |
| **5.5** | [`szablon-ux-persona-scenariusz.md`](szablon-ux-persona-scenariusz.md) | Dokumentacja systemowa — UX: persony, scenariusze i mapa historyjek | Specyfikacja | Podczas wywiadów z użytkownikami (Radą Graczy) i mapowania podróży gracza. |
| **5.6** | [`szablon-ux-test-uzytecznosci.md`](szablon-ux-test-uzytecznosci.md) | Dokumentacja systemowa — UX: raport z testów użyteczności | Weryfikacja | Po sesjach testów użyteczności z Radą Graczy na koniec sprintu (`NFR-20`). |
| **5.7** | [`szablon-karta-modulu.md`](szablon-karta-modulu.md) | Dokumentacja systemowa — karta modułu kodu źródłowego | Realizacja | Gdy dokumentujesz własny moduł kodu (`src/<moduł>/README.md` i strona w Confluence na zaliczenie EU5). |
| **5.8** | [`szablon-qa-plan-testow.md`](szablon-qa-plan-testow.md) | Dokumentacja systemowa — QA: plan testów i specyfikacja przypadków testowych | Weryfikacja | Na początku sprintu, gdy planujesz zakres i przypadki testowe (EU6). |
| **5.9** | [`szablon-qa-raport-i-checklista.md`](szablon-qa-raport-i-checklista.md) | Dokumentacja systemowa — QA: raport z testów i lista kontrolna | Weryfikacja | Na koniec sprintu, przed przeglądem sprintu, gdy dokumentujesz wyniki testów z CI i pokrycie wymagań (EU6). |
| **5.10** | [`szablon-podrecznik-gracza.md`](szablon-podrecznik-gracza.md) | Dokumentacja użytkownika — podręcznik użytkownika końcowego | Wydanie | Gdy rozbudowujesz instrukcję dla gracza, szybki start albo sekcję najczęstszych pytań. |
| **5.11** | [`szablon-instrukcja-wdrozenia-admin.md`](szablon-instrukcja-wdrozenia-admin.md) | Dokumentacja użytkownika — podręcznik administratora systemu | Wydanie | Gdy opisujesz instalację, konfigurację, bezpieczeństwo i kopie zapasowe. |
| **5.12** | [`szablon-informacja-o-wydaniu.md`](szablon-informacja-o-wydaniu.md) | Dokumentacja procesowa — informacja o wydaniu i lista kontrolna | Wydanie | Przy publikacji każdego wydania `sprint-N` na gałęzi `main`. |

> **Pozostałe szablony procesowe w repozytorium:**
>
> - Szablon decyzji architektonicznej (ADR, Architecture Decision Record): [`01-dokumentacja-systemowa/07-decyzje-adr/0000-szablon.md`](../01-dokumentacja-systemowa/07-decyzje-adr/0000-szablon.md)
> - Szablony ceremonii Scrum (Daily Scrum, przegląd sprintu i retrospektywa): [`03-dokumentacja-procesowa/03-scrum-i-spotkania/`](../03-dokumentacja-procesowa/03-scrum-i-spotkania/README.md)
