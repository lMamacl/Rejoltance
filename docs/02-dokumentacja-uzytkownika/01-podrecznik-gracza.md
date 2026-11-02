# 2.1 Podręcznik gracza i przewodnik szybkiego startu — RE:JOLTANCE

> **Źródło prawdy:** repozytorium (`docs/02-dokumentacja-uzytkownika/01-podrecznik-gracza.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — użytkownika (Podręcznik użytkownika końcowego) · **Etap SDD:** Wydanie · **Wymóg uczelniany:** EU5

Niniejszy podręcznik jest przeznaczony dla graczy oraz członków Rady Graczy Testowych. Pozwala w mniej niż 5 minut poznać zasady gry **RE:JOLTANCE**, rozpocząć pojedynek w przeglądarce i rozwiązać ewentualne problemy techniczne. Pełna specyfikacja wszystkich 55 reguł turniejowych znajduje się w dokumencie **[1.2 Specyfikacja funkcjonalna zasad gry](../01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md)**.

---

## 1. Szybki start w 60 sekund

1. **Otwórz grę w przeglądarce:** Wejdź na udostępniony adres serwera demonstracyjnego (lub lokalny adres zasobu `web` z panelu .NET Aspire). Nie musisz niczego pobierać ani instalować.
2. **Wybierz tryb rozgrywki:**
   - **Trening / Piaskownica (`Start Sandbox`):** Natychmiast uruchamia pojedynek testowy z wybranymi taliami startowymi.
   - **Gra z kolegą (Lobby 1v1):** Utwórz pokój, skopiuj wygenerowany kod pokoju lub link i wyślij go znajomemu na komunikatorze.
   - **Gra z Botem AI:** Wybierz jedną z 5 talii startowych i zmierz się z komputerowym przeciwnikiem.
3. **Wymień karty startowe (Mulligan):** Na początku meczu otrzymujesz **4 karty**. Kliknij karty, które chcesz wymienić na inne z talii, a następnie kliknij **Zatwierdź Mulligan**.
4. **Wybierz kolejność:** Zadeklaruj, czy wolisz rozpoczynać pierwszą rundę jako pierwszy gracz (Gracz A), czy jako drugi (Gracz B).

---

## 2. Zasady rozgrywki w pigułce

### 2.1 Cel gry i układ planszy

- Każdy z dwóch graczy steruje bohaterem posiadającym **20 punktów zdrowia (HP)** oraz talią złożoną z **30 kart**.
- Plansza składa się z **4 linii walki** (oznaczonych od `0` do `3` od lewej do prawej). W każdej linii znajduje się po jednym miejscu na jednostkę dla każdego gracza.
- **Warunek zwycięstwa:** Wygrywasz natychmiast, gdy sprowadzisz punkty zdrowia wrogiego bohatera do **0 lub mniej**.

### 2.2 Zasób Blood (Krew)

- Zagrywanie kart kosztuje punkty zasobu **Blood** (widoczne w czerwonym kółku na karcie).
- Na początku każdej rundy Twój zasób Blood odnawia się do wartości równej numerowi bieżącej rundy (maksymalnie do **10 Blood**). Niewykorzystany zasób z poprzedniej rundy nie przechodzi na kolejną.

### 2.3 Cztery kroki każdej rundy

W każdej rundzie jeden z graczy pełni rolę **Gracza A (rozpoczynającego)**, a drugi **Gracza B**. W kolejnej rundzie role te zamieniają się miejscami. Runda przebiega zawsze w czterech krokach:

| Krok rundy | Kto wykonuje ruch? | Jakie karty można zagrać? |
|---|---|---|
| **1. Krok Jednostek (`unitStep`)** | Gracz A | Wyłącznie karty **Jednostek (`Unit`)** na wolne linie po swojej stronie. |
| **2. Krok Mieszany (`mixedStep`)** | Gracz B | Zarówno karty **Jednostek (`Unit`)**, jak i karty **Akcji (`Spell`)**. |
| **3. Krok Akcji (`actionStep`)** | Gracz A | Wyłącznie karty **Akcji (`Spell`)** — odpowiedź taktyczna przed walką. |
| **4. Faza Walki (`combat`)** | Automatyczna | Jednostki walczą ze sobą po kolei na liniach **od lewej do prawej (`0 → 1 → 2 → 3`)**. |

### 2.4 Jak działa walka na linii?

1. Jeśli naprzeciw Twojej jednostki nie ma wrogiej jednostki (lub Twoja jednostka ma cechę **Flying**, a przeciwnik nie), uderzenie trafia **bezpośrednio w bohatera przeciwnika**.
2. Jeśli naprzeciw siebie stoją dwie jednostki o tym samym statusie latania, **uderzają się jednocześnie** wartością swojego ataku.

### 2.5 Najważniejsze słowa kluczowe na kartach

| Słowo kluczowe / Status | Co oznacza w trakcie gry? |
|---|---|
| **Flying** | Jednostka latająca przelatuje nad jednostką naziemną i uderza bezpośrednio w bohatera przeciwnika. |
| **Armored (n) / Armor2** | Zmniejsza obrażenia z każdego otrzymanego uderzenia o `n` (lub o `2` dla `Armor2`). |
| **Marked** | Jednostka naznaczona otrzymuje **podwójne obrażenia** (po uwzględnieniu pancerza). |
| **Stunned** | Jednostka ogłuszona pomija swoje najbliższe uderzenie, po czym status ogłuszenia znika. |
| **Burning / BurnSource** | Jednostka podpalona traci **1 HP na koniec każdej rundy**. Jednostka z `BurnSource` podpala każdy trafiony cel. |
| **SplashDamage (n)** | Podczas ataku zadaje `n` obrażeń wrogim jednostkom stojącym na sąsiednich liniach (z lewej i z prawej). |
| **Breakthrough** | Po uderzeniu we wrogą jednostkę zadaje dodatkowo pełną wartość swojego ataku bohaterowi przeciwnika. |
| **SoulGuard** | Chroni jednostkę przed śmiercią jeden raz (zostawia ją przy życiu z **1 HP**). Nie chroni przed poświęceniem (`Sacrifice`). |
| **Unkillable** | Gdy jednostka zginie na planszy, zamiast pozostać na stosie odrzuconych wraca do ręki właściciela. |

---

## 3. Sterowanie i skróty klawiszowe

| Czynność w grze | Obsługa myszą | Obsługa klawiaturą |
|---|---|---|
| Wybór karty z ręki | Kliknij kartę w wachlarzu ręki | Klawisze numeryczne `1` – `8` |
| Zagranie jednostki na linię | Kliknij podświetlony slot linii (`0–3`) | Strzałki lewo/prawo + `Enter` |
| Wskazanie celu akcji / umiejętności | Kliknij podświetloną jednostkę lub bohatera | Strzałki + `Enter` |
| Zakończenie bieżącego kroku | Kliknij przycisk **Zakończ krok** | `Spacja` lub `Enter` (gdy żadna karta nie jest wybrana) |
| Anulowanie wyboru karty | Prawy przycisk myszy | `Escape` |
| Podgląd dziennika rozgrywki | Kliknij przycisk **Log / Dziennik** | Klawisz `L` |

---

## 4. Najczęściej zadawane pytania (FAQ) i rozwiązywanie problemów

| Pytanie / Objaw problemu | Wyjaśnienie i sposób rozwiązania |
|---|---|
| **Dlaczego nie mogę zagrać wybranej karty z ręki?** | Sprawdź trzy warunki: (1) czy masz wystarczającą ilość zasobu *Blood*, (2) czy obecny krok rundy pozwala na ten typ karty (np. w *Kroku Akcji* nie można wystawiać jednostek), (3) czy dla karty akcji istnieje na planszy wymagany cel. Interfejs podświetla wyłącznie dozwolone zagrania. |
| **Dlaczego moja nowo dobrana karta od razu spłonęła?** | Ręka gracza mieści maksymalnie **8 kart** (`R-13`). Każda kolejna dobrana karta powyżej tego limitu jest automatycznie odrzucana na stos kart odrzuconych. |
| **Co się dzieje, gdy skończą mi się karty w talii?** | W grze nie tasuje się stosu odrzuconych z powrotem do talii. Każda próba dobrania karty z pustej talii zadaje bohaterowi narastające obrażenia **Fatigue** (`1`, potem `2`, potem `3` itd. — `R-14`). |
| **Przeglądarka straciła połączenie z serwerem w trakcie meczu** | Odśwież stronę lub poczekaj na automatyczne wznowienie połączenia SignalR. Serwer utrzymuje stan Twojego meczu przez **60 sekund** (`R-73`) i po powrocie odtworzy dokładny widok planszy. |
| **Gra wyświetla komunikat o obróceniu ekranu** | Interfejs planszy wymaga orientacji poziomej (minimum `1280×720`). Zmaksymalizuj okno przeglądarki na komputerze. |
