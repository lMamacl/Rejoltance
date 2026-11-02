<!-- CONFLUENCE 1:1 EXPORT | Source: docs/05-szablony/naglowek-strony-confluence.md @ a2bf2a4 (2026-11-02) -->
# 5.1 Standard nagłówka metadanych strony w Confluence

Każda strona w przestrzeni projektu w Confluence PB zaczyna się od takiego samego bloku informacyjnego (makro informacyjne albo cytat na górze strony). Z tego bloku czytelnik dowiaduje się:

- gdzie jest źródło prawdy dokumentu, czyli miejsce, w którym go poprawiamy,
- kto za dokument odpowiada,
- do którego etapu SDD (spec-driven development, pracy sterowanej specyfikacją) i do jakiej kategorii dokumentacji należy strona.

---

## Wzór nagłówka dla stron synchronizowanych z repozytorium Git

```markdown
> **Źródło prawdy:** Repozytorium Git — `<ścieżka w docs/>` (gałąź `develop` @ `<commit>`, `<RRRR-MM-DD>`)
> **Kategoria dokumentacji:** `<Dokumentacja produktowa — systemowa | Dokumentacja produktowa — użytkownika | Dokumentacja procesowa>` — `<Typ dokumentu>`
> **Etap SDD:** `<Fundamenty | Specyfikacja | Planowanie | Zadania | Realizacja | Weryfikacja | Wydanie>`
> **Właściciel dokumentu:** `<Imię i nazwisko / Epik>` · **Status:** `<Szkic | Do przeglądu | Zatwierdzony>` · **Jira:** `<REJ-...>`
```

## Wzór nagłówka dla stron edytowanych bezpośrednio w Confluence (np. protokoły spotkań, raporty sprintu)

```markdown
> **Źródło prawdy:** Confluence PB (edytuj bezpośrednio na tej stronie)
> **Kategoria dokumentacji:** `<Typ dokumentu>` · **Etap SDD:** `<Weryfikacja | Wydanie | Scrum>`
> **Właściciel dokumentu:** `<Imię i nazwisko>` · **Data aktualizacji:** `<RRRR-MM-DD>` · **Jira:** `<REJ-...>`
```

---

## Etykiety stron w Confluence PB

Żeby łatwo filtrować strony na wiki, każda strona ma co najmniej dwie etykiety:

1. **Etykietę źródła prawdy:** `zrodlo-repo` albo `zrodlo-confluence`.
2. **Etykietę etapu SDD:** `sdd-fundamenty`, `sdd-specyfikacja`, `sdd-plan`, `sdd-zadania`, `sdd-realizacja`, `sdd-weryfikacja`, `sdd-wydanie` lub `scrum`.
