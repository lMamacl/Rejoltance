<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/10-ux-design-i-przeplywy.md @ a2bf2a4 (2026-11-02) -->
# 1.10 Projekt UX, mapa ekranów, przepływy i przewodnik stylu

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/10-ux-design-i-przeplywy.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — systemowa (projekt UX i przewodnik stylu) · **Etap SDD:** Planowanie

Ten dokument opisuje UX (User Experience, czyli doświadczenie użytkownika) klienta webowego RE:JOLTANCE (`src/web`). Znajdziesz tu:

- architekturę informacji i mapę ekranów,
- szkielet układu planszy (*wireframe*),
- najważniejsze przepływy użytkownika (*user flows*),
- przewodnik stylu wizualnego (*UI style guide*).

Wzorem interakcji, grafiki i dźwięku jest działający prototyp w katalogu [`prototype/revibance/`](../../prototype/README.md). SDD (Spec-Driven Development) to nasz sposób pracy: najpierw specyfikacja, potem kod.

Szablony do opisu badań z użytkownikami są w katalogu [`05-szablony/`](../05-szablony/README.md):

- [`szablon-ux-persona-scenariusz.md`](../05-szablony/szablon-ux-persona-scenariusz.md) — persony, scenariusze i mapa historyjek użytkownika,
- [`szablon-ux-test-uzytecznosci.md`](../05-szablony/szablon-ux-test-uzytecznosci.md) — raport z sesji testów użyteczności z Radą Graczy.

---

## 1. Architektura informacji i mapa ekranów

```mermaid
flowchart TD
  Start(["Wejście przez link w przeglądarce"]) --> Menu["Ekran 1: Menu Główne"]
  Menu --> Auth["Ekran 2: Logowanie / Rejestracja / Tryb Gościa"]
  Menu --> Lobby["Ekran 3: Lobby PvP (Utwórz pokój / Dołącz kodem)"]
  Menu --> BotSetup["Ekran 4: Konfiguracja meczu z Botem AI (Wybór talii)"]
  Menu --> Deckbuilder["Ekran 5: Kreator Talii (Deckbuilder 30 kart)"]
  Menu --> Settings["Modal: Ustawienia dźwięku, czcionki i dostępności"]

  Lobby --> Board["Ekran 6: Plansza Meczowa (4 linie)"]
  BotSetup --> Board

  Board --> Overlays["Nakładki interakcji (PendingInteraction):<br/>Mulligan · Wybór kolejności · Wybór celu · Podgląd stosów"]
  Overlays --> Board
  Board --> Log["Panel boczny: Dziennik zdarzeń meczu (Combat Log)"]
  Board --> Zoom["Podgląd karty + Glosariusz słów kluczowych"]
  Board --> EndScreen["Ekran 7: Podsumowanie meczu (Wynik · Rewanż · Powrót do menu)"]
  EndScreen --> Menu
```

### Ekrany i powiązane zadania w backlogu

| Ekran / widok | Odpowiednik w prototypie (`index.html`) | Stan w kliencie React (`src/web`) | Zadanie (Jira / backlog) |
|---|---|---|---|
| **Menu główne** | `#menu` | W backlogu (na razie gra startuje od razu w piaskownicy) | `E4-S07` |
| **Logowanie i rejestracja** | *(brak w prototypie)* | W backlogu | `E6-S02`, `E6-S09` |
| **Lobby 1v1 (kod pokoju, link)** | `#lobby` | W backlogu | `E3-S01`, `E4-S07` |
| **Wybór talii i mecz z botem** | `#botmenu` | W backlogu | `E5-S05` |
| **Plansza meczowa (4 linie, HP, Blood, ręka)** | `#game` | Szkielet zaimplementowany w `src/web` | `E4-S01`, `E4-S02` |
| **Nakładki wyboru (`PendingInteraction`)** | `#mul` | Mulligan zaimplementowany, reszta w backlogu | `E4-S03` |
| **Powiększenie karty i glosariusz słów kluczowych** | `#zoom` | W backlogu | `E4-S04` |
| **Dziennik rozgrywki (Log zdarzeń)** | `#hist` | W backlogu | `E4-S05` |
| **Koniec meczu i potwierdzenie poddania** | `#ov`, `#modal` | Poddanie i wynik zaimplementowane | `E4-S06` |
| **Kreator talii (*Deckbuilder*)** | `#bld` | W backlogu (Fala W2 — Semestr 2) | `E6-S04` |

---

## 2. Makieta układu ekranu rozgrywki

Ekran rozgrywki ma proporcje panoramiczne `16:9`. Bazowa rozdzielczość to `1920×1080`. Widok skaluje się do okna przeglądarki od `1280×720`:

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [Poddaj mecz]    Faza: Krok Jednostek (Twój ruch)     [Dziennik] [⚙]    Runda 3  │
│ Ostatnie zdarzenia: [Dobrano kartę] [Zagrano: Iron Hound -> Linia 1]             │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PRZECIWNIK   ❤ 17/20 HP   💧 Blood: ●●○ (2/3)   Ręka: 4 karty   Talia: 22  Stos: 3│
│                                                                                  │
│     ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│     │   Linia 0    │   │   Linia 1    │   │   Linia 2    │   │   Linia 3    │    │
│     │  [Wroga J.]  │   │   (pusto)    │   │  [Wroga J.]  │   │   (pusto)    │    │
│     └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘    │
│                            ─── TOR WALKI 4 LINII ───                             │
│     ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│     │   Linia 0    │   │   Linia 1    │   │   Linia 2    │   │   Linia 3    │    │
│     │  [Twoja J.]  │   │  [Twoja J.]  │   │   (pusto)    │   │   (pusto)    │    │
│     └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘    │
│                                                                                  │
│ TY (Miejsce 0) ❤ 20/20 HP  💧 Blood: ●●● (3/3)  Talia: 21  Stos: 2  [Zakończ krok]│
│             ╭─────────╮ ╭─────────╮ ╭─────────╮ ╭─────────╮ ╭─────────╮          │
│             │ Karta 1 │ │ Karta 2 │ │ Karta 3 │ │ Karta 4 │ │ Karta 5 │          │
│             ╰─────────╯ ╰─────────╯ ╰─────────╯ ╰─────────╯ ╰─────────╯          │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Zasady interakcji i ergonomii (`NFR-21`, `NFR-22`)

1. **Podświetlamy tylko legalne ruchy (`legalActions`).** Gdy wybierzesz kartę z ręki, interfejs podświetla tylko te sloty i cele, które są w tablicy `view.legalActions` od serwera. Gdy spróbujesz zagrać za drogą kartę, zobaczysz czytelny komunikat po polsku (np. *„Niewystarczająca ilość Blood”*).
2. **Obsługa myszą i klawiaturą:**
   - Klawisze `1–8` wybierają kartę z ręki.
   - Strzałki lub `1–4` wskazują linię albo cel.
   - `Enter` lub `Spacja` zatwierdza wybór albo kończy bieżący krok (`endStep`).
   - `Escape` lub prawy przycisk myszy anuluje zaznaczenie karty.

---

## 3. Przepływ użytkownika: rozpoczęcie pojedynku 1v1 przez link

```mermaid
sequenceDiagram
  autonumber
  actor A as Gracz A (Twórca pokoju)
  actor B as Gracz B (Zaproszony kolega)
  participant UI as Klient Webowy (src/web)
  participant S as Serwer (MatchHub)

  A->>UI: Wybiera „Graj z kolegą” i talię startową
  UI->>S: CreateRoom(deckName)
  S-->>UI: Zwraca kod pokoju i link zapraszający
  A->>B: Przesyła link na komunikatorze (np. Discord / Teams)
  B->>UI: Otwiera link w przeglądarce i wybiera talię
  UI->>S: JoinRoom(roomCode, deckName)
  S-->>UI: MatchUpdated (faza: mulligan, pending: wybierz karty do wymiany)
  A->>UI: Zatwierdza mulligan
  B->>UI: Zatwierdza mulligan
  S-->>UI: MatchUpdated (faza: chooseOrder)
  A->>UI: Wybiera preferencję kolejności
  B->>UI: Wybiera preferencję kolejności
  S-->>UI: MatchUpdated (Runda 1, faza: unitStep, Blood: 1/1)
```

---

## 4. Przewodnik stylu wizualnego

Gra ma mroczną, kontrastową stylistykę *dark tactical pixel-art*. Przenosimy ją wprost z prototypu `prototype/revibance/style.css`.

### 4.1 Paleta barw i kontrast WCAG 2.1 AA (`NFR-22`)

WCAG (Web Content Accessibility Guidelines) to standard dostępności stron. Poziom AA wymaga kontrastu tekstu co najmniej 4.5:1. NFR to wymaganie niefunkcjonalne (Non-Functional Requirement).

| Token CSS | Wartość HEX | Gdzie używamy | Kontrast względem tła `#050505` | Status WCAG 2.1 |
|---|---|---|---|---|
| `--bg` | `#050505` | Główne tło planszy i ekranów. | — | Tło bazowe |
| `--ln` | `#2a2a2a` | Obramowania slotów linii, kart i kontenerów. | `1.4 : 1` | Element dekoracyjny |
| `--tx` | `#8d8d8d` | Tekst pomocniczy, etykiety statystyk i opisów. | **`6.1 : 1`** | **Spełnia AA** (wymagane ≥ 4.5:1) |
| `--hi` | `#cfcfcf` | Tekst główny, nazwy kart, wartości HP i nagłówki. | **`13.1 : 1`** | **Spełnia AAA** (wymagane ≥ 7.0:1) |
| `--red` | `#c4161c` | Akcent dla zasobu *Blood*, obrażeń i zagrożenia. | `3.4 : 1` | Dozwolony dla dużych napisów (≥ 24 px) i ikon z etykietą |
| `--dim` | `#3a3a3a` | Tło nieaktywnych przycisków i niedostępnych akcji. | `1.8 : 1` | Tylko dla elementów wyłączonych (`disabled`) |

### 4.2 Typografia, grafika i udźwiękowienie

- **Czcionki (`prototype/revibance/fonts/`).** Mamy dwa style do wyboru w ustawieniach dostępności. Styl pikselowy: *Pixelify Sans*, *Silkscreen*, *DotGothic16*, *Jersey 15*. Czytelny styl klasyczny: *Cinzel* dla nagłówków i *Alegreya Sans* dla opisów kart.
- **Grafiki kart (`prototype/revibance/img/`).** Ilustracje kart w formacie WebP (`1.webp` .. `69.webp`, tokeny `900.webp` .. `908.webp`), rewers karty `back.webp` i ramka awersu `CardFront.png`.
- **Bezpieczeństwo wizualne (`NFR-70`).** Animacje uderzeń i podpaleń nie mają błysków częstszych niż 3 Hz. Gra skraca je automatycznie, gdy system ustawia `@media (prefers-reduced-motion: reduce)`.
