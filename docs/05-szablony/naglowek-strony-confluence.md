# 5.1 Standard nagłówka metadanych strony w Confluence

Każda strona w przestrzeni projektowej **Confluence PB** zaczyna się od ujednoliconego bloku informacyjnego (makro informacyjne lub blok cytatu na górze strony). Blok ten jednoznacznie wskazuje czytelnikowi, gdzie znajduje się źródło prawdy dokumentu, kto za niego odpowiada oraz do którego etapu procesu **Spec-Driven Development (SDD)** i kategorii dokumentacji należy dana strona.

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

## Standardowe etykiety stron w Confluence PB

W celu łatwego filtrowania stron na wiki każda strona powinna posiadać co najmniej dwie etykiety:

1. **Etykietę źródła prawdy:** `zrodlo-repo` albo `zrodlo-confluence`.
2. **Etykietę etapu SDD:** `sdd-fundamenty`, `sdd-specyfikacja`, `sdd-plan`, `sdd-zadania`, `sdd-realizacja`, `sdd-weryfikacja`, `sdd-wydanie` lub `scrum`.
