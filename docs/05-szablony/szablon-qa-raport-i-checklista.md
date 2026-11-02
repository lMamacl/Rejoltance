# 5.9 Szablon QA: Raport z Testów i Lista Kontrolna Wydania (Test Report & Checklist)

> **Źródło prawdy:** Confluence PB · **Kategoria AltexSoft:** Product: System Documentation — Quality Assurance (Test Report & Test Checklists) · **Etap SDD:** Weryfikacja (`Verify`) · **Wymóg uczelniany:** EU6

Wypełnij raport na koniec sprintu, przed Sprint Review. Zastąp pola w nawiasach `<...>`. QA to quality assurance (zapewnienie jakości), SDD — spec-driven development (praca sterowana specyfikacją), EU — efekt uczenia się, CI — ciągła integracja, E2E — test end-to-end całej aplikacji.

---

## 1. Podsumowanie testów w Sprincie `N`

| Metryka jakości | Wynik w Sprincie `N` | Wartość docelowa (bramka jakości) | Status |
|---|---|---|---|
| **Testy jednostkowe C# (`Rejoltance.Kernel.Tests` + planowany `Rejoltance.Cards.Tests`)** | `<Przeszło / Razem>` | 100% zielone | `✅ / ❌` |
| **Testy integracyjne (`Rejoltance.Server.Tests`)** | `<Przeszło / Razem>` | 100% zielone | `✅ / ❌` |
| **Testy jednostkowe UI (`Vitest`)** | `<Przeszło / Razem>` | 100% zielone | `✅ / ❌` |
| **Testy E2E (`Playwright`)** | `<Przeszło / Razem>` | 100% zielone | `✅ / ❌` |
| **Pokrycie kodu w `Rejoltance.Kernel` (line coverage)** | `<X %>` | `≥ 90%` (`NFR-41`) | `✅ / ❌` |
| **Czas rozstrzygnięcia akcji w `Kernel` (p99)** | `<X ms>` | `≤ 5 ms` (`NFR-01`) | `✅ / ❌` |
| **Link do przebiegu GitHub Actions CI** | `<URL do zielonego przebiegu CI>` | Zielony status | `✅ / ❌` |

---

## 2. Lista kontrolna testów dymnych (smoke tests) przed Sprint Review (Test Checklist)

- [ ] Aplikacja uruchamia się bez błędów jedną komendą `docker compose up --build` (`NFR-50`).
- [ ] Endpoint diagnostyczny `GET /health` zwraca status `200 OK` (`NFR-53`).
- [ ] Gracz może utworzyć pokój w lobby i dołączyć do niego z drugiej karty przeglądarki albo wybrać grę z botem AI.
- [ ] Wymiana kart startowych (mulligan) przebiega bez błędów dla obu graczy (`R-12`).
- [ ] Cztery kroki rundy (*Jednostki → Akcje → Walka → Koniec rundy*) zmieniają się we właściwej kolejności (`R-15`).
- [ ] Po zerwaniu połączenia WebSocket i odświeżeniu karty przeglądarki gracz widzi aktualny stół, a ukryte karty przeciwnika pozostają ukryte (`R-66`, `NFR-30`).
- [ ] Gdy HP lidera spadnie do `0`, pojawia się ekran podsumowania meczu z poprawnym zwycięzcą (`R-64`).

---

## 3. Rejestr wykrytych defektów (Bug Report Log)

| ID błędu (Jira) | Krótki opis defektu i kroki reprodukcji | Dotknięta reguła (`R-nn`) | Priorytet (`P0–P3`) | Status przed wydaniem (`Naprawiony / Otwarty`) |
|---|---|---|---|---|
| `REJ-...` | | | | |

---

## 4. Decyzja jakościowa (QA Sign-Off)

- **Rekomendacja zespołu QA:** `<Akceptacja wydania na gałąź main / Wstrzymanie wydania do czasu naprawy błędów P0/P1>`
- **Podpis i data:** `<Imię i nazwisko, RRRR-MM-DD>`
