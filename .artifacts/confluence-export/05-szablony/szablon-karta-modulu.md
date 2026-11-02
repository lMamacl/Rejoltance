<!-- CONFLUENCE 1:1 EXPORT | Source: docs/05-szablony/szablon-karta-modulu.md @ 10829d3 (2026-11-02) -->
# 5.7 Szablon: Karta Modułu Inżynierskiego (Source Code Documentation)

> **Źródło prawdy:** Repozytorium (`src/<moduł>/README.md`) + Confluence PB · **Kategoria AltexSoft:** Product: System Documentation — Source Code Documentation · **Etap SDD:** Realizacja (`Implement`) · **Wymóg uczelniany:** EU5 (indywidualna ocena każdego studenta)

---

## Metadane modułu

| Pole | Wartość |
|---|---|
| **Nazwa modułu / pakietu** | `<np. Rejoltance.Kernel / src/web/src/components/Board>` |
| **Właściciel modułu (Autor)** | `<Imię i nazwisko studenta>` |
| **Epik nadrzędny** | `<E1–E8>` |
| **Ścieżka w repozytorium** | `src/<ścieżka>` |
| **Realizowane wymagania i reguły** | `<np. R-15, R-28..R-39, NFR-01>` |
| **Powiązane decyzje ADR** | `<np. ADR-0002, ADR-0004>` |

---

## 1. Cel i odpowiedzialność modułu

- **Za co odpowiada ten moduł:** `<Zwięzły opis jednoznacznej odpowiedzialności komponentu>`
- **Czego ten moduł świadomie NIE robi (granice architektoniczne):** `<np. Nie komunikuje się z bazą danych ani z siecią>`

## 2. Publiczny interfejs (Public API)

| Klasa / Funkcja / Komponent | Sygnatura wejścia / wyjścia | Opis działania i niezmienników |
|---|---|---|
| `<Nazwa>` | `<Parametry → Typ zwracany>` | `<Opis>` |

## 3. Zależności i kierunek przepływu danych

- **Moduły, od których zależy ten komponent (Imports):** `<Lista>`
- **Moduły korzystające z tego komponentu (Consumers):** `<Lista>`

```mermaid
flowchart LR
  Caller["<Moduł wywołujący>"] --> This["<Opisywany moduł>"]
  This --> Contracts["Rejoltance.Contracts"]
```

## 4. Kluczowe decyzje implementacyjne i przypadki brzegowe

`<Dlaczego wybrane algorytmy lub struktury danych zostały zaimplementowane w ten sposób? Jak obsługiwane są sytuacje brzegowe (np. przepełnienie kolejki, remis HP, zerowe ziarno RNG)?>`

## 5. Pokrycie testami i komendy weryfikacji

| Projekt testowy / Plik testu | Weryfikowane scenariusze (`R-nn`) | Komenda uruchomienia |
|---|---|---|
| `tests/<Projekt>/<PlikTestu>` | `<Lista reguł i przypadków brzegowych>` | `dotnet test --filter ...` / `npm test` |
