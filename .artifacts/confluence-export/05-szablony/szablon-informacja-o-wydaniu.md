<!-- CONFLUENCE 1:1 EXPORT | Source: docs/05-szablony/szablon-informacja-o-wydaniu.md @ 7e9a336 (2026-11-02) -->
# 5.12 Szablon: Informacja o Wydaniu i Lista Kontrolna Wydania (Release Notes)

> **Źródło prawdy:** Confluence PB / GitHub Releases · **Kategoria AltexSoft:** Process Documentation — Release Plan, Notes & Release Checklist · **Etap SDD:** Wydanie (`Release`) · **Wymóg uczelniany:** EU3

---

## 1. Metadane wydania

| Pole | Wartość |
|---|---|
| **Wersja / Tag Git** | `sprint-N` (gałąź `main` @ `<commit>`) |
| **Data wydania** | `<RRRR-MM-DD>` |
| **Cel Sprintu `N`** | `<Jednozdaniowy cel sprintu z Sprint Planning>` |
| **Zespół odpowiedzialny za wydanie** | `<Scrum Master i PO sprintu>` |

---

## 2. Co nowego w tym wydaniu? (Nowe funkcjonalności i reguły)

- **`REJ-...` — `<Tytuł ukończonej historyjki>`:** `<Opis wartości dostarczonej użytkownikowi oraz zaimplementowanych reguł R-nn>`
- **`REJ-...` — `<Tytuł ukończonej historyjki>`:** `<Opis>`

## 3. Naprawione błędy i usprawnienia jakościowe

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

- [ ] Wszystkie testy automatyczne (xUnit, Vitest, Playwright) oraz walidatory (`npm run check`) przechodzą na zielono w CI.
- [ ] Wykonano połączenie gałęzi `develop` do `main` przez zatwierdzony Pull Request i nadano tag `sprint-N`.
- [ ] Zarchiwizowano ukończone propozycje zmian w `openspec/changes/archive/`.
- [ ] Zaktualizowano dokumentację w repozytorium i zsynchronizowano strony w Confluence PB (`sync_confluence.py`).
