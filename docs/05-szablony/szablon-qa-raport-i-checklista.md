# 5.9 Szablon QA: Raport z Testów i Lista Kontrolna Wydania (Test Report & Checklist)

> **Źródło prawdy:** Confluence PB · **Kategoria AltexSoft:** Product: System Documentation — Quality Assurance (Test Report & Test Checklists) · **Etap SDD:** Weryfikacja (`Verify`) · **Wymóg uczelniany:** EU6

---

## 1. Podsumowanie wykonania testów w Sprincie `N`

| Metryka jakościowa | Wynik w Sprincie `N` | Wartość docelowa (Brama jakości) | Status |
|---|---|---|---|
| **Testy jednostkowe C# (`Rejoltance.Kernel.Tests` + `Cards.Tests`)** | `<Przeszło / Razem>` | 100% zielone | `✅ / ❌` |
| **Testy integracyjne (`Rejoltance.Host.Tests`)** | `<Przeszło / Razem>` | 100% zielone | `✅ / ❌` |
| **Testy jednostkowe UI (`Vitest`)** | `<Przeszło / Razem>` | 100% zielone | `✅ / ❌` |
| **Testy E2E (`Playwright`)** | `<Przeszło / Razem>` | 100% zielone | `✅ / ❌` |
| **Pokrycie kodu w `Rejoltance.Kernel` (Line Coverage)** | `<X %>` | `≥ 90%` (`NFR-41`) | `✅ / ❌` |
| **Czas rozstrzygnięcia akcji w `Kernel` (p99)** | `<X ms>` | `≤ 5 ms` (`NFR-01`) | `✅ / ❌` |
| **Link do przebiegu GitHub Actions CI** | `<URL do zielonego przebiegu CI>` | Zielony status | `✅ / ❌` |

---

## 2. Lista kontrolna dymnych testów akceptacyjnych przed Sprint Review (Test Checklist)

- [ ] Aplikacja uruchamia się czysto jedną komendą `docker compose up --build` (`NFR-50`).
- [ ] Endpoint diagnostyczny `GET /health` zwraca status `200 OK` (`NFR-53`).
- [ ] Gracz może utworzyć pokój w lobby i dołączyć do niego z drugiej karty przeglądarki lub wybrać grę z botem AI.
- [ ] Faza wymiany kart startowych (mulligan) przebiega bez błędów dla obu graczy (`R-12`).
- [ ] Cztery kroki rundy (*Jednostki → Akcje → Walka → Koniec rundy*) zmieniają się we właściwej kolejności (`R-15`).
- [ ] Zerwanie połączenia WebSocket i odświeżenie karty przeglądarki przywraca aktualny widok stołu bez ujawnienia ukrytych kart przeciwnika (`R-66`, `NFR-30`).
- [ ] Po obniżeniu HP lidera do `0` wyświetla się ekran podsumowania meczu z poprawnym zwycięzcą (`R-64`).

---

## 3. Rejestr wykrytych defektów (Bug Report Log)

| ID błędu (Jira) | Krótki opis defektu i kroki reprodukcji | Dotknięta reguła (`R-nn`) | Priorytet (`P0–P3`) | Status przed wydaniem (`Naprawiony / Otwarty`) |
|---|---|---|---|---|
| `REJ-...` | | | | |

---

## 4. Decyzja jakościowa (QA Sign-Off)

- **Rekomendacja zespołu QA:** `<Akceptacja wydania na gałąź main / Wstrzymanie wydania do czasu naprawy błędów P0/P1>`
- **Podpis i data:** `<Imię i nazwisko, RRRR-MM-DD>`
