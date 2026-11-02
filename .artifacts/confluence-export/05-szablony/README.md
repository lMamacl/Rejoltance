<!-- CONFLUENCE 1:1 EXPORT | Source: docs/05-szablony/README.md @ 7e9a336 (2026-11-02) -->
# 05. Biblioteka szablonów dokumentacji technicznej

Katalog `05-szablony/` zawiera kompletny zestaw gotowych szablonów dla wszystkich typów dokumentacji wyróżnionych w klasyfikacji AltexSoft oraz wykorzystywanych w procesie **Spec-Driven Development (SDD)**.

Podczas gdy **PRD** ([`01-prd-wymagania-produktu.md`](../01-dokumentacja-systemowa/01-prd-wymagania-produktu.md)) oraz **SAD** ([`05-sad-architektura-systemu.md`](../01-dokumentacja-systemowa/05-sad-architektura-systemu.md)) zostały w pełni opracowane dla projektu **RE:JOLTANCE** w sekcji `01-dokumentacja-systemowa/`, poniższe szablony stanowią ustandaryzowane wzorce do tworzenia kolejnych stron w **Confluence PB** oraz nowych dokumentów w kolejnych sprintach.

---

## Katalog szablonów (Układ 1:1 z Confluence)

| Nr | Plik szablonu | Kategoria i typ dokumentacji | Etap SDD | Kiedy używać tego szablonu? |
|---|---|---|---|---|
| **5.1** | [`naglowek-strony-confluence.md`](naglowek-strony-confluence.md) | Standard metadanych strony | Wszystkie etapy | Na początku każdej strony w przestrzeni Confluence PB (wstawiany automatycznie przez `sync_confluence.py`). |
| **5.2** | [`szablon-prd.md`](szablon-prd.md) | Dokumentacja systemowa — **Wymagania produktu (PRD)** | Specyfikacja | Przy definiowaniu wymagań produktu lub nowego dużego modułu funkcjonalnego. |
| **5.3** | [`szablon-sad.md`](szablon-sad.md) | Dokumentacja systemowa — **Architektura systemu (SAD)** | Planowanie | Przy opisie architektury systemu (struktura AltexSoft + arc42 + model C4). |
| **5.4** | [`szablon-tdd.md`](szablon-tdd.md) | Dokumentacja systemowa — **Szczegółowy projekt techniczny (TDD)** | Planowanie / Zadania | Przy niskopoziomowym projektowaniu technicznym złożonej funkcji (także jako wzorzec dla `openspec/changes/<id>/design.md`). |
| **5.5** | [`szablon-ux-persona-scenariusz.md`](szablon-ux-persona-scenariusz.md) | Dokumentacja systemowa — **UX: Persony, scenariusze i mapa historyjek** | Specyfikacja | Podczas wywiadów z użytkownikami końcowymi (Radą Graczy) i mapowania podróży gracza. |
| **5.6** | [`szablon-ux-test-uzytecznosci.md`](szablon-ux-test-uzytecznosci.md) | Dokumentacja systemowa — **UX: Raport z testów użyteczności** | Weryfikacja | Po sesjach testów użyteczności z Radą Graczy na koniec sprintu (`NFR-20`). |
| **5.7** | [`szablon-karta-modulu.md`](szablon-karta-modulu.md) | Dokumentacja systemowa — **Karta modułu kodu źródłowego** | Realizacja | Do dokumentowania własnego modułu kodu (`src/<moduł>/README.md` oraz strona w Confluence na zaliczenie **EU5**). |
| **5.8** | [`szablon-qa-plan-testow.md`](szablon-qa-plan-testow.md) | Dokumentacja systemowa — **QA: Plan testów i specyfikacja przypadków testowych** | Weryfikacja | Na początku sprintu do zaplanowania zakresu testów i przypadków testowych (**EU6**). |
| **5.9** | [`szablon-qa-raport-i-checklista.md`](szablon-qa-raport-i-checklista.md) | Dokumentacja systemowa — **QA: Raport z testów i lista kontrolna** | Weryfikacja | Na koniec sprintu przed przeglądem sprintu do udokumentowania wyników testów z CI i pokrycia wymagań (**EU6**). |
| **5.10** | [`szablon-podrecznik-gracza.md`](szablon-podrecznik-gracza.md) | Dokumentacja użytkownika — **Podręcznik użytkownika końcowego** | Wydanie | Do rozbudowy instrukcji użytkownika końcowego, szybkiego startu i sekcji najczęściej zadawanych pytań. |
| **5.11** | [`szablon-instrukcja-wdrozenia-admin.md`](szablon-instrukcja-wdrozenia-admin.md) | Dokumentacja użytkownika — **Podręcznik administratora systemu** | Wydanie | Do dokumentowania procedur instalacji, konfiguracji, bezpieczeństwa i kopii zapasowych. |
| **5.12** | [`szablon-informacja-o-wydaniu.md`](szablon-informacja-o-wydaniu.md) | Dokumentacja procesowa — **Informacja o wydaniu i lista kontrolna** | Wydanie | Przy publikacji każdego kolejnego wydania `sprint-N` na gałęzi `main`. |

> **Pozostałe szablony procesowe w repozytorium:**
>
> - Szablon decyzji architektonicznej (**ADR**): [`01-dokumentacja-systemowa/07-decyzje-adr/0000-szablon.md`](../01-dokumentacja-systemowa/07-decyzje-adr/0000-szablon.md)
> - Szablony ceremonii Scrum (**Daily Scrum**, **Przegląd sprintu i retrospektywa**): [`03-dokumentacja-procesowa/03-scrum-i-spotkania/`](../03-dokumentacja-procesowa/03-scrum-i-spotkania/README.md)
