<!-- CONFLUENCE 1:1 EXPORT | Source: docs/05-szablony/szablon-ux-persona-scenariusz.md @ a2bf2a4 (2026-11-02) -->
# 5.5 Szablon UX: Persony, scenariusze użytkownika i mapa historyjek

> **Źródło prawdy:** Confluence PB / Repozytorium · **Kategoria AltexSoft:** Product: System Documentation — UX Design (User Personas, User Scenarios, Scenario/Story Maps) · **Etap SDD:** Specyfikacja (`Specify`) · **Wymóg uczelniany:** EU1

Wypełnij szablon po wywiadzie z graczem i zastąp pola w nawiasach `<...>`. UX to user experience (doświadczenie użytkownika), SDD — spec-driven development (praca sterowana specyfikacją), EU — efekt uczenia się, MVP — minimalna wersja produktu.

---

## 1. Karta persony użytkownika (`<Nazwa Persony, np. Gracz Okazjonalny>`)

| Cecha persony | Opis na podstawie wywiadu z użytkownikiem końcowym |
|---|---|
| **Profil i rola** | `<Kim jest użytkownik, np. student 2. roku informatyki, doświadczenie w grach karcianych>` |
| **Kontekst użycia** | `<W jakich warunkach korzysta z aplikacji: urządzenie, miejsce, dostępny czas (np. 15 min przerwy)>` |
| **Główne cele i motywacje** | `<Co chce osiągnąć podczas sesji z produktem>` |
| **Bolączki i frustracje (Pain Points)** | `<Co przeszkadza mu w obecnych rozwiązaniach lub prototypie>` |
| **Wzorce zachowań** | `<W jaki sposób podejmuje decyzje w interfejsie>` |
| **Dosłowny cytat z wywiadu** | *„`<Cytat zanotowany podczas rozmowy z reprezentantem Rady Graczy>`”* |
| **Źródło i data wywiadu** | `<Imię reprezentanta Rady Graczy, data spotkania>` |

---

## 2. Scenariusz użytkownika (`<Tytuł scenariusza, np. Rozegranie szybkiego meczu z kolegą>`)

- **Powiązana persona:** `<Nazwa persony>`
- **Cel scenariusza:** `<Konkretny rezultat końcowy z perspektywy użytkownika>`
- **Warunek początkowy:** `<Stan przed rozpoczęciem interakcji>`

| Krok | Co robi gracz? | Co pokazuje aplikacja? | Ekran UX (`10-ux-design`) | Powiązane wymaganie (`R-nn` / `REJ-...`) |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Scenariusze alternatywne i obsługa błędów:** `<Co dzieje się, gdy użytkownik popełni błąd lub utraci połączenie sieciowe?>`

---

## 3. Mapa historyjek użytkownika (User Story Map)

| Etap podróży użytkownika →<br/>Poziom wydania (fala) ↓ | 1. Wejście i lobby | 2. Przygotowanie meczu (mulligan) | 3. Rozgrywka (runda i walka) | 4. Koniec meczu i podsumowanie |
|---|---|---|---|---|
| **Fala W0 / W1 — MVP (Semestr 1)** | `<Story REJ-...>` | `<Story REJ-...>` | `<Story REJ-...>` | `<Story REJ-...>` |
| **Fala W2 — Pełna gra (Semestr 2)** | `<Story REJ-...>` | `<Story REJ-...>` | `<Story REJ-...>` | `<Story REJ-...>` |
| **Fala W3 — Rozszerzenia** | `<Story REJ-...>` | `<Story REJ-...>` | `<Story REJ-...>` | `<Story REJ-...>` |
