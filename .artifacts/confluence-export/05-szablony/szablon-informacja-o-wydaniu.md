<!-- CONFLUENCE 1:1 EXPORT | Source: docs/05-szablony/szablon-informacja-o-wydaniu.md @ a2bf2a4 (2026-11-02) -->
# 5.12 Szablon: Informacja o Wydaniu i Lista Kontrolna Wydania (Release Notes)

> **Źródło prawdy:** Confluence PB / GitHub Releases · **Kategoria AltexSoft:** Process Documentation — Release Plan, Notes & Release Checklist · **Etap SDD:** Wydanie (`Release`) · **Wymóg uczelniany:** EU3

Skopiuj ten szablon przy każdym wydaniu i zastąp pola w nawiasach `<...>`. SDD to spec-driven development (praca sterowana specyfikacją), EU — efekt uczenia się, PO — Product Owner, CI — ciągła integracja.

---

## 1. Metadane wydania

| Pole | Wartość |
|---|---|
| **Wersja / tag Git** | `sprint-N` (gałąź `main` @ `<commit>`) |
| **Data wydania** | `<RRRR-MM-DD>` |
| **Cel Sprintu `N`** | `<Jednozdaniowy cel sprintu ze Sprint Planning>` |
| **Zespół odpowiedzialny za wydanie** | `<Scrum Master i PO sprintu>` |

---

## 2. Co nowego w tym wydaniu? (nowe funkcje i reguły)

- **`REJ-...` — `<Tytuł ukończonej historyjki>`:** `<Opis wartości dostarczonej użytkownikowi oraz zaimplementowanych reguł R-nn>`
- **`REJ-...` — `<Tytuł ukończonej historyjki>`:** `<Opis>`

## 3. Naprawione błędy i usprawnienia jakości

- **`REJ-...`:** `<Opis naprawionego defektu lub usprawnienia wydajności/UX>`

## 4. Znane ograniczenia tej wersji (Known Issues)

- `<Opis ograniczenia wraz z numerem zadania zaplanowanego na kolejny sprint>`

## 5. Jak uruchomić i przetestować to wydanie?

```bash
git checkout sprint-N
docker compose up --build
# Aplikacja dostępna pod adresem: http://localhost:5000
```

## 6. Lista kontrolna wydania (Release Checklist)

- [ ] Wszystkie testy automatyczne (xUnit, Vitest, Playwright) i walidatory (`npm run check`) przechodzą w CI.
- [ ] Gałąź `develop` scalono do `main` przez zatwierdzony pull request i nadano tag `sprint-N`.
- [ ] Ukończone propozycje zmian są zarchiwizowane w `openspec/changes/archive/`.
- [ ] Dokumentacja w repozytorium jest aktualna, a strony w Confluence PB są zsynchronizowane (`sync_confluence.py`).
