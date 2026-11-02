# 5.2 Szablon: Dokument Wymagań Produktu (Product Requirements Document — PRD)

> **Źródło prawdy:** `<Repozytorium / Confluence>` · **Kategoria AltexSoft:** Product: System Documentation — Product Requirements Document (PRD) · **Etap SDD:** Specyfikacja (`Specify`)
> *Wypełniony dokument dla projektu RE:JOLTANCE znajduje się w: [`01-dokumentacja-systemowa/01-prd-wymagania-produktu.md`](../01-dokumentacja-systemowa/01-prd-wymagania-produktu.md).*

Wypełnij sekcje i zastąp pola w nawiasach `<...>`. SDD to spec-driven development (praca sterowana specyfikacją), KPI — kluczowy wskaźnik efektywności, NFR — wymaganie niefunkcjonalne.

---

## 1. Role i odpowiedzialności

| Rola w projekcie | Osoba / zespół | Zakres odpowiedzialności |
|---|---|---|
| Product Owner | `<Imię i nazwisko>` | Ustala priorytety wymagań, akceptuje przyrosty |
| Właściciele epików / analitycy | `<Lista osób>` | Specyfikują wymagania w przypisanych obszarach |
| Reprezentanci użytkowników końcowych | `<Lista osób>` | Sprawdzają użyteczność i odbierają przyrosty na Sprint Review |

## 2. Cele zespołu i cele biznesowe (Team Goals and Business Objectives)

- **Problem do rozwiązania:** `<Krótki opis problemu użytkowników>`
- **Główny cel produktu:** `<Jednozdaniowa definicja docelowego rozwiązania>`
- **Mierzalne wskaźniki sukcesu (KPI):** `<np. czas rozegrania pierwszego meczu ≤ 15 min, 0 błędów krytycznych>`

## 3. Tło i dopasowanie strategiczne (Background and Strategic Fit)

`<Dlaczego produkt powstaje teraz, na jakich wcześniejszych prototypach lub analizach bazuje i jak wpisuje się w długofalową wizję i roadmapę strategiczną>`

## 4. Założenia projektowe (Assumptions)

| ID | Treść założenia (biznesowego lub technicznego) | Jak je sprawdzimy | Skutek, jeśli założenie okaże się błędne |
|---|---|---|---|
| A-01 | | | |

## 5. Persony, historyjki użytkownika i kryteria akceptacji (User Stories & Acceptance Criteria)

| ID Story | Jako... (persona) | Chcę... (działanie) | Aby... (korzyść) | Kryteria akceptacji (`GIVEN / WHEN / THEN`) | Priorytet / fala |
|---|---|---|---|---|---|
| `E1-S01` | | | | `GIVEN ... WHEN ... THEN ...` | `W1` |

## 6. Wymagania funkcjonalne i niefunkcjonalne (System & Quality Requirements)

| Kategoria wymagań | Odnośnik do szczegółowej specyfikacji OpenSpec | Liczba wymagań | Status |
|---|---|---|---|
| Wymagania funkcjonalne (reguły domenowe `R-nn`) | `openspec/specs/*` | | |
| Wymagania niefunkcjonalne (ISO/IEC 25010 `NFR-nn`) | `openspec/specs/quality-attributes/spec.md` | | |

## 7. Interakcja użytkownika i projekt interfejsu (User Interaction and Design)

`<Odnośniki do mapy ekranów, makiet wireframe, przewodnika stylu UI oraz interaktywnego prototypu>`

## 8. Pytania otwarte (Open Questions)

| ID | Pytanie do rozstrzygnięcia | Kto decyduje | Termin | Decyzja |
|---|---|---|---|---|
| Q-01 | | | | |

## 9. Poza zakresem projektu (Out of Scope / Not Doing)

- `<Funkcjonalność 1 wyłączona z zakresu wraz z krótkim uzasadnieniem>`
- `<Funkcjonalność 2 wyłączona z zakresu>`
