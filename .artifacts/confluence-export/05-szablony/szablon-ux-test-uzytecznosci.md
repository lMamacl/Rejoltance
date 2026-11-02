<!-- CONFLUENCE 1:1 EXPORT | Source: docs/05-szablony/szablon-ux-test-uzytecznosci.md @ 10829d3 (2026-11-02) -->
# 5.6 Szablon UX: Raport z testów użyteczności (Usability Testing Report)

> **Źródło prawdy:** Confluence PB · **Kategoria AltexSoft:** Product: System Documentation — UX Design (Usability Testing Report) · **Etap SDD:** Weryfikacja (`Verify`) · **Wymogi uczelniane:** EU1, EU2 (`NFR-20`, `NFR-21`)

---

## 1. Metadane sesji badawczej

| Pole | Wartość |
|---|---|
| **Data przeprowadzenia testu** | `<RRRR-MM-DD>` |
| **Testowana wersja / Tag** | `sprint-N` (`develop @ <commit>`) |
| **Uczestnicy (Rada Graczy Testowych)** | `<Liczba uczestników, np. 3 osoby spoza zespołu deweloperskiego>` |
| **Moderator sesji** | `<Imię i nazwisko Product Ownera sprintu>` |
| **Weryfikowane wymagania jakościowe** | `NFR-20` (pierwszy mecz ≤ 15 min bez pomocy), `NFR-21` (czytelność legalnych ruchów) |

---

## 2. Zadania testowe i wyniki ilościowe

| Zadanie postawione przed graczem | Kryterium sukcesu | Uczestnik 1 | Uczestnik 2 | Uczestnik 3 | Wynik zbiorczy |
|---|---|---|---|---|---|
| **Z-1:** Uruchomienie meczu i wykonanie mulliganu | Bez podpowiedzi moderatora w ≤ 2 min | `<Czas / Status>` | `<Czas / Status>` | `<Czas / Status>` | `✅ / ⚠️` |
| **Z-2:** Rozegranie pełnej rundy (jednostki, akcje, walka) | Zrozumienie 4 kroków rundy i zasobu Blood | `<Czas / Status>` | `<Czas / Status>` | `<Czas / Status>` | `✅ / ⚠️` |
| **Z-3:** Ukończenie pełnego pojedynku z botem lub graczem | Czas całkowity ≤ 15 min (`NFR-20`) | `<Czas / Status>` | `<Czas / Status>` | `<Czas / Status>` | `✅ / ⚠️` |

---

## 3. Zidentyfikowane problemy użyteczności (Pain Points) i zrzuty ekranu

| ID | Obserwowane zachowanie gracza (Problem) | Miejsce w interfejsie (Ekran / Komponent) | Priorytet (`P0–P3`) | Proponowana poprawka (Zadanie Jira) |
|---|---|---|---|---|
| UX-01 | `<np. Gracz nie zauważył, że trwa krok akcji i próbował zagrać jednostkę>` | `<Plansza — pasek statusu fazy>` | `P1` | `REJ-...` |

---

## 4. Wnioski i decyzje do Product Backlogu

- **Co działało intuicyjnie i nie wymaga zmian:** `<Lista>`
- **Nowe lub zmodyfikowane historyjki dopisane do Backlogu przed kolejnym sprintem:** `<Lista kluczy Jira>`
