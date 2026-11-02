<!-- CONFLUENCE 1:1 EXPORT | Source: docs/02-dokumentacja-uzytkownika/01-podrecznik-gracza.md @ a2bf2a4 (2026-11-02) -->
# 2.1 Podręcznik gracza i przewodnik szybkiego startu — RE:JOLTANCE

> **Źródło prawdy:** repozytorium (`docs/02-dokumentacja-uzytkownika/01-podrecznik-gracza.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — użytkownika (podręcznik użytkownika końcowego) · **Etap SDD:** Wydanie · **Wymóg uczelniany:** EU5 (efekt uczenia się)

Ten podręcznik jest dla graczy i członków Rady Graczy Testowych. W mniej niż 5 minut poznasz zasady gry RE:JOLTANCE, zaczniesz pojedynek w przeglądarce i poradzisz sobie z typowymi problemami. Wszystkie 55 reguł turniejowych opisuje dokument [1.2 Specyfikacja funkcjonalna zasad gry](../01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md).

---

## 1. Szybki start w 60 sekund

1. **Otwórz grę w przeglądarce.** Wejdź na adres serwera demonstracyjnego, który dostaniesz od zespołu. Jeśli grasz lokalnie, użyj adresu zasobu `web` z panelu .NET Aspire. Nie musisz niczego pobierać ani instalować.
2. **Wybierz tryb gry:**
   - **Trening, czyli piaskownica (`Start Sandbox`):** od razu uruchamia pojedynek testowy z wybranymi taliami startowymi.
   - **Gra ze znajomym (lobby 1v1):** utwórz pokój, skopiuj kod pokoju albo link i wyślij go znajomemu.
   - **Gra z botem AI:** wybierz jedną z 5 talii startowych i zagraj z komputerem.
3. **Wymień karty startowe (mulligan).** Na początku meczu dostajesz 4 karty. Kliknij te, które chcesz wymienić na inne z talii. Potem kliknij **Zatwierdź Mulligan**.
4. **Wybierz kolejność.** Zdecyduj, czy chcesz zacząć pierwszą rundę jako pierwszy gracz (Gracz A), czy jako drugi (Gracz B).

---

## 2. Zasady gry w pigułce

### 2.1 Cel gry i plansza

- Każdy z dwóch graczy ma bohatera z **20 punktami zdrowia** (HP, od ang. *health points*) i talię **30 kart**.
- Plansza ma **4 linie walki**, ponumerowane od `0` do `3` od lewej do prawej. W każdej linii każdy gracz ma jedno miejsce na jednostkę.
- **Jak wygrać:** wygrywasz od razu, gdy zdrowie bohatera przeciwnika spadnie do **0 lub mniej**.

### 2.2 Zasób Blood (krew)

- Zagranie karty kosztuje punkty **Blood**. Koszt widzisz w czerwonym kółku na karcie.
- Na początku każdej rundy twój Blood odnawia się do wartości równej numerowi rundy (najwyżej **10 Blood**). Niewydany Blood nie przechodzi na następną rundę.

### 2.3 Cztery kroki rundy

W każdej rundzie jeden gracz jest Graczem A (zaczyna), a drugi Graczem B. W następnej rundzie role się zamieniają. Każda runda ma zawsze cztery kroki:

| Krok rundy | Kto gra? | Co możesz zagrać? |
|---|---|---|
| **1. Krok jednostek (`unitStep`)** | Gracz A | Tylko karty jednostek (`Unit`), na wolne linie po swojej stronie. |
| **2. Krok mieszany (`mixedStep`)** | Gracz B | Karty jednostek (`Unit`) i karty akcji (`Spell`). |
| **3. Krok akcji (`actionStep`)** | Gracz A | Tylko karty akcji (`Spell`). To taktyczna odpowiedź przed walką. |
| **4. Faza walki (`combat`)** | Gra sama | Jednostki walczą po kolei na liniach od lewej do prawej (`0 → 1 → 2 → 3`). |

### 2.4 Jak działa walka na linii?

1. Jeśli naprzeciw twojej jednostki nie ma wrogiej jednostki, twoja jednostka uderza **prosto w bohatera przeciwnika**. Tak samo jest, gdy twoja jednostka ma cechę **Flying**, a jednostka przeciwnika jej nie ma.
2. Jeśli naprzeciw siebie stoją dwie jednostki o tym samym statusie latania, **uderzają się jednocześnie** wartością swojego ataku.

### 2.5 Najważniejsze słowa kluczowe na kartach

| Słowo kluczowe / status | Co robi w grze? |
|---|---|
| **Flying** | Jednostka latająca przelatuje nad jednostką naziemną i uderza prosto w bohatera przeciwnika. |
| **Armored (n) / Armor2** | Zmniejsza obrażenia z każdego otrzymanego uderzenia o `n` (przy `Armor2` o `2`). |
| **Marked** | Naznaczona jednostka dostaje **podwójne obrażenia** (liczone po odjęciu pancerza). |
| **Stunned** | Ogłuszona jednostka pomija swoje najbliższe uderzenie. Potem ogłuszenie znika. |
| **Burning / BurnSource** | Podpalona jednostka traci **1 HP na koniec każdej rundy**. Jednostka z `BurnSource` podpala każdy cel, który trafi. |
| **SplashDamage (n)** | Podczas ataku zadaje `n` obrażeń wrogim jednostkom na sąsiednich liniach (z lewej i z prawej). |
| **Breakthrough** | Po uderzeniu we wrogą jednostkę zadaje dodatkowo bohaterowi przeciwnika obrażenia równe pełnej wartości swojego ataku. |
| **SoulGuard** | Raz chroni jednostkę przed śmiercią i zostawia ją przy życiu z **1 HP**. Nie chroni przed poświęceniem (`Sacrifice`). |
| **Unkillable** | Gdy jednostka zginie na planszy, wraca do ręki właściciela zamiast zostać na stosie kart odrzuconych. |

---

## 3. Sterowanie i skróty klawiszowe

| Co chcesz zrobić | Mysz | Klawiatura |
|---|---|---|
| Wybrać kartę z ręki | Kliknij kartę w wachlarzu ręki | Klawisze cyfr `1` – `8` |
| Zagrać jednostkę na linię | Kliknij podświetlone miejsce na linii (`0–3`) | Strzałki w lewo/prawo + `Enter` |
| Wskazać cel akcji lub umiejętności | Kliknij podświetloną jednostkę albo bohatera | Strzałki + `Enter` |
| Zakończyć bieżący krok | Kliknij przycisk **Zakończ krok** | `Spacja` lub `Enter` (gdy nie masz wybranej karty) |
| Anulować wybór karty | Prawy przycisk myszy | `Escape` |
| Otworzyć dziennik gry | Kliknij przycisk **Log / Dziennik** | Klawisz `L` |

---

## 4. Najczęściej zadawane pytania (FAQ) i rozwiązywanie problemów

| Pytanie lub problem | Wyjaśnienie i rozwiązanie |
|---|---|
| **Dlaczego nie mogę zagrać karty z ręki?** | Sprawdź trzy rzeczy: (1) czy masz dość *Blood*, (2) czy w tym kroku rundy wolno zagrać ten typ karty (np. w kroku akcji nie wystawisz jednostki), (3) czy karta akcji ma na planszy wymagany cel. Gra podświetla tylko dozwolone zagrania. |
| **Dlaczego nowo dobrana karta od razu spłonęła?** | W ręce mieścisz najwyżej **8 kart** (reguła `R-13`). Każda karta dobrana ponad ten limit od razu trafia na stos kart odrzuconych. |
| **Co się dzieje, gdy skończą mi się karty w talii?** | Stos kart odrzuconych nie wraca do talii. Każda próba dobrania karty z pustej talii zadaje twojemu bohaterowi rosnące obrażenia **Fatigue** (zmęczenie): `1`, potem `2`, potem `3` itd. (reguła `R-14`). |
| **Gra straciła połączenie z serwerem w trakcie meczu** | Odśwież stronę albo poczekaj, aż gra sama wznowi połączenie (SignalR). Serwer trzyma twój mecz przez **60 sekund** (reguła `R-73`). Po powrocie zobaczysz dokładnie tę samą planszę. |
| **Gra prosi o obrócenie ekranu** | Plansza wymaga orientacji poziomej i okna o rozmiarze co najmniej `1280×720`. Na komputerze zmaksymalizuj okno przeglądarki. |
