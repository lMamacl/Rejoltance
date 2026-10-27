# 

| RE:JOLTANCE  |
| ----- |
| przewodnik po zasadach \- |
| opracowane przez: Bluzacy, PanCoto |

> ## **Wprowadzenie ogólne**

RE:Joltance jest dwuosobową cyfrową grą turową wywodzącą się z podtypu gier karcianych określanych jako gry walki w liniach (z ang. lane battler). Każdy z graczy dowodzi własną talią kart, dąży do zredukowania punktów zdrowia przeciwnika do zera i broni własnych punktów zdrowia przed symetrycznymi zapędami drugiej strony. Rozgrywka toczy się na planszy podzielonej na cztery linie. Każda linia ma dwa sloty — po jednym na stronę — więc w każdej chwili na planszy może znajdować się maksymalnie osiem jednostek, po cztery z każdej strony. Linie są ponumerowane od 0 do 3\. Jednostki stojące naprzeciwko siebie w tej samej linii wchodzą ze sobą w bezpośrednią interakcję w fazie walki.

Głównym zasobem wykorzystywanym do zagrywania kart jest Blood. Blood jest automatycznie uzupełniana do pełna na początku każdej rundy. Maksymalna wartość Blood jest równa numerowi bieżącej rundy, ale nie przekracza 10 — czyli w rundzie 1 każdy z graczy dysponuje 1 punktem Blood, w rundzie 2 dwoma, i tak dalej, aż do rundy 10 i każdej kolejnej, w której obowiązuje limit 10\. Blood jest odnawiana, a nie kumulowana: jeśli gracz zakończył rundę z 3 punktami Blood, w nowej rundzie i tak otrzyma pełny przydział wynikający z numeru rundy.

Każdy gracz rozpoczyna rozgrywkę z 20 punktami zdrowia (PZ). Punkty zdrowia nie regenerują się samoistnie — jedyne sposoby ich odzyskania to efekty kart leczących. Spadek PZ do zera lub poniżej oznacza natychmiastową przegraną. Przed rozpoczęciem gry każdy z graczy wybiera własną talię. Talia musi spełniać dwa warunki: zawierać dokładnie 30 kart oraz nie zawierać więcej niż 3 kopie tej samej karty. Tokeny nie wchodzą w skład talii i nie podlegają tym ograniczeniom — są przywoływane w trakcie rozgrywki przez efekty innych kart.

> ## **Początek gry**

Po wybraniu talii obaj gracze dobierają po 4 losowe karty ze swoich talii. Następnie każdy z graczy ma możliwość wykonania mulliganu — wskazania dowolnej liczby kart ze swojej ręki, które chce wymienić. Po zatwierdzeniu decyzji przez obu graczy wskazane karty są umieszczane na dnie talii, bez ponownego tasowania talii. Gracz dobiera z góry talii dokładnie tyle nowych kart, ile odrzucił. Odrzucone karty pozostają na dnie talii i nie wracają do puli losowania do końca gry, chyba że zostaną dobrane w normalnym trybie.

Po mulliganie ustalana jest kolejność rozpoczynania. Każdy z graczy jest pytany, czy chce rozpocząć grę jako pierwszy, czy jako drugi. Jeśli gracze wybiorą różne opcje, ich decyzje są honorowane: ten, kto wybrał rozpoczęcie jako pierwszy, rozpoczyna pierwszą rundę, a ten, kto wybrał bycie drugim, gra w niej jako drugi. Jeśli obaj gracze wybiorą tę samą opcję, system losowo wyznacza, kto rozpocznie jako pierwszy. W ten sposób ustalany jest gracz rozpoczynający pierwszą rundę. W kolejnych rundach przywilej rozpoczynania przechodzi naprzemiennie między graczami.

> ## **Przebieg rundy**

Każda runda składa się z czterech faz wykonywanych sekwencyjnie. W każdej rundzie wyznaczony jest gracz rozpoczynający (zwany dalej graczem A) oraz gracz drugi (zwany dalej graczem B). W pierwszej rundzie role te wynikają z wyboru dokonanego po mulliganie, a w kolejnych rundach zamieniają się miejscami.

> ### **Faza jednostek**

W fazie jednostek aktywny jest gracz A. Może on zagrywać wyłącznie karty typu jednostka — karty akcji są niedostępne. Gracz A może zakończyć tę fazę w dowolnym momencie, nawet jeśli nie zagrał żadnej karty. Zakończenie fazy jednostek przenosi rozgrywkę do fazy mieszanej.

> ### **Faza mieszana**

W fazie mieszanej aktywny jest gracz B. Może on zagrywać zarówno karty typu jednostka, jak i karty typu akcja, w dowolnej kombinacji. Podobnie jak gracz A w poprzedniej fazie, gracz B może zakończyć tę fazę w dowolnym momencie.

> ### **Faza akcji**

W fazie akcji ponownie aktywny jest gracz A. Tym razem może zagrywać wyłącznie karty typu akcja — jednostki są niedostępne. Gracz A może zakończyć tę fazę w dowolnym momencie, co automatycznie uruchamia fazę walki.

> ### **Faza walki**

Faza walki jest rozstrzygana automatycznie i sekwencyjnie, linia po linii, od linii 0 do linii 3\. Gracz nie podejmuje w niej żadnych decyzji poza tymi, które wynikają z wcześniej zadeklarowanych efektów „przed walką”. Po rozstrzygnięciu wszystkich czterech linii następuje koniec rundy. Faza walki jest jedyną fazą, w której gracz nie ma bezpośredniego wpływu na przebieg zdarzeń. Wszystkie decyzje strategiczne podejmowane są w trzech wcześniejszych fazach — faza walki jest wyłącznie egzekucją wcześniejszych wyborów.

> ## **Faza walki — szczegóły**

Dla każdej linii walka przebiega według ustalonej kolejności etapów.

> ### **Efekty „przed walką”**

Niektóre jednostki posiadają zdolności wyzwalane przed walką w swojej linii. Zdolności te uruchamiają się, zanim dojdzie do jakichkolwiek uderzeń, i mogą zmienić układ sił w linii — nałożyć status, zadać obrażenia, zmodyfikować statystyki. Jednostka z taką zdolnością wskazuje cel (jednostkę wroga), a następnie efekt zostaje rozstrzygnięty. Kolejność jest deterministyczna: najpierw efekt gracza A, potem gracza B. Efekty przed walką uruchamiają się tylko raz na linię na rundę — nie powtarzają się przy żadnym z późniejszych uderzeń w tej samej linii.

> ### **Uderzenia**

Po rozstrzygnięciu efektów przed walką obie jednostki w linii uderzają. Uderzenie jest jednoczesne — obie strony zadają obrażenia na podstawie statystyk Ataku sprzed jakichkolwiek obrażeń w tej linii. Oznacza to, że nawet jeśli jednostka A zabije jednostkę B, B i tak uderzy z pełną siłą, bo jej atak został zadeklarowany przed rozstrzygnięciem. Obie jednostki mogą zginąć jednocześnie. Jeśli w danej linii po jednej ze stron nie ma jednostki, obecna jednostka atakuje bohatera przeciwnej strony, zadając mu obrażenia równe swojemu Atakowi.

> ### **Flying**

Jednostki posiadające słowo kluczowe Flying zachowują się inaczej w zależności od tego, kto stoi naprzeciwko. Jeśli atakujący ma Flying, a obrońca nie ma Flying — atak trafia bohatera, a nie jednostkę. Jednostka bez Flying nie jest w stanie zablokować ataku latającej jednostki. Jeśli obaj mają Flying albo obaj nie mają — atak trafia jednostkę w tej samej linii. Jeśli obrońca ma Flying, a atakujący nie — atak trafia jednostkę. Flying nie chroni przed atakami jednostek naziemnych; jedynie pozwala samej jednostce omijać nie-latających przeciwników. Flying ma więc znaczenie wyłącznie ofensywne — pozwala atakującemu wybrać, czy uderzyć w jednostkę, czy w bohatera, w zależności od tego, czy obrońca również lata.

> ### **SplashDamage**

Jednostki z tym słowem kluczowym po swoim uderzeniu zadają dodatkowe obrażenia jednostkom wroga w liniach sąsiednich — czyli w linii o numerze o jeden mniejszym i o jeden większym. SplashDamage nie trafia bohatera i nie obejmuje linii, w której doszło do uderzenia. Wartość obrażeń zależy od karty — domyślnie 1, ale niektóre karty mają ją podwyższoną. SplashDamage jest zadawany niezależnie od tego, czy jednostka atakująca przeżyła uderzenie — jeśli tylko zdążyła uderzyć, SplashDamage się rozlicza. SplashDamage nie jest natomiast zadawany, jeśli jednostka była Stunned i w ogóle nie doszło do uderzenia.

> ### **Rozstrzygnięcie śmierci**

Dopiero po obu uderzeniach i SplashDamage następuje rozstrzygnięcie śmierci. Jednostki z HP równym zero lub mniejszym umierają, z uwzględnieniem dwóch mechanik ochronnych — SoulGuard i Unkillable. Śmierć jest rozstrzygana po kolei dla wszystkich jednostek, które spadły do zera lub poniżej, i może uruchomić efekty pośmiertne.

> ### **Wyzwalacze z obrażeń**

Niektóre zdolności jednostek uruchamiają się, gdy jednostka zada obrażenia innej jednostce lub bohaterowi. Wyzwalacze te są odkładane do kolejki i rozstrzygane po obu uderzeniach, przed rozstrzygnięciem śmierci. Oznacza to, że jeśli jednostka A zadała obrażenia jednostce B i zginęła w tym samym starciu, jej wyzwalacz z obrażeń i tak się uruchomi — ale dopiero po tym, jak obie strony zakończą uderzenia.

> ## **Koniec rundy i początek nowej rundy**

Po rozstrzygnięciu fazy walki następuje koniec rundy. W tej chwili rozliczane są efekty trwałe działające na koniec rundy — w szczególności Burning: każda jednostka z tym statusem traci 1 punkt zdrowia. Obrażenia od Burning nie są trafieniem i nie uruchamiają wyzwalaczy z obrażeń. Po rozliczeniu wszystkich efektów końca rundy następuje sprawdzenie warunku zwycięstwa.

Następnie rozpoczyna się nowa runda. Numer rundy wzrasta o jeden. Ustalany jest nowy gracz rozpoczynający — role gracza A i gracza B zamieniają się miejscami. Obaj gracze otrzymują pełny przydział Blood wynikający z nowego numeru rundy (maksymalnie 10). Obaj gracze dobierają po jednej karcie z talii. W rundzie 1 dobieranie nie następuje — karty startowe zostały dobrane przed pierwszą rundą.

Jeżeli talia jest pusta w momencie, gdy gracz miałby dobrać kartę, zamiast dobierania otrzymuje on obrażenia. Pierwsza taka sytuacja zadaje 1 obrażenie, druga 2 obrażenia, trzecia 3 obrażenia i tak dalej. Licznik rośnie niezależnie od tego, z jakiego powodu gracz miałby dobrać kartę. Jeśli ręka gracza jest pełna (8 kart), dobierana karta trafia do stosu odrzuconych zamiast do ręki. Nie dotyczy to sytuacji, w której talia jest pusta — wtedy następuje obrażenie, a nie odłożenie karty. Ręka gracza może pomieścić maksymalnie 8 kart. Nadmiarowe karty zawsze trafiają do stosu odrzuconych — dotyczy to zarówno dobierania na początku rundy, jak i wszelkich efektów dobierających w trakcie gry.

## **Słowa kluczowe — pełne definicje**

> ### **Flying**

Opisane szczegółowo w części o fazie walki. Jednostka z Flying atakuje bohatera, jeśli obrońca w linii nie ma Flying; w przeciwnym razie atak trafia jednostkę. Flying nie chroni przed atakami naziemnymi.

> ### **Armored (n)**

Jednostka z Armored redukuje każde pojedyncze trafienie o wartość n. Domyślnie n wynosi 1, ale niektóre karty mają je podwyższone. Redukcja dotyczy każdego trafienia osobno — nie sumuje się w ramach jednej tury ani jednego starcia. Obrażenia po redukcji nie mogą spaść poniżej zera. Kolejność rozliczania obrażeń jest następująca: najpierw odejmowana jest wartość Armored, a dopiero potem stosowane jest podwojenie od Marked. Armored nie redukuje obrażeń od Burning, ponieważ Burning nie jest trafieniem.

> ### **SoulGuard**

SoulGuard to jednorazowa ochrona przed śmiercią. Gdy jednostka z SoulGuard miałaby zginąć — niezależnie od tego, czy od obrażeń, czy od efektu niszczącego — zamiast śmierci traci SoulGuard i ustawia swoje HP na 1\. Ochrona zużywa się przy pierwszej takiej sytuacji i nie odnawia się samoistnie. SoulGuard nie chroni przed Sacrifice. Sacrifice nie jest śmiercią od obrażeń, a osobną mechaniką. Jeśli SoulGuard została nadana przez efekt innej jednostki, znika w momencie, gdy źródło tego efektu opuszcza planszę. SoulGuard wynikająca z własnego słowa kluczowego jednostki nie znika w ten sposób.

> ### **Unkillable**

Jednostka z Unkillable nie może zginąć. Gdy jej HP spadnie do zera lub poniżej, uruchamiają się jej efekty pośmiertne (tak jak przy normalnej śmierci), a następnie jednostka wraca do ręki właściciela jako nowa karta, zachowując słowo kluczowe Unkillable. Jeśli ręka właściciela jest pełna (8 kart), karta trafia do stosu odrzuconych. Tokeny z Unkillable po prostu znikają — nie wracają do ręki. Sacrifice nadal usuwa jednostkę z planszy, ale jeśli jest Unkillable, wróci do ręki po rozliczeniu efektów Sacrifice. Jeśli jednostka ma jednocześnie SoulGuard i Unkillable, SoulGuard zużywa się pierwszy — jednostka zatrzymuje się na 1 HP i Unkillable nie zostaje aktywowane. Dopiero przy kolejnym ciosie zadziałają pozostałe mechaniki.

> ### **SplashDamage (n)**

Opisane w części o fazie walki. Wartość n domyślnie wynosi 1, ale może być wyższa dla konkretnych kart. SplashDamage trafia jednostki wroga w liniach sąsiednich, nie trafia bohatera i nie jest zadawany, jeśli jednostka była Stunned i nie doszło do uderzenia.

> ### **Burning**

Burning to status zadający 1 punkt obrażeń na koniec każdej rundy. Obrażenia od Burning nie są trafieniem — nie uruchamiają wyzwalaczy z obrażeń i nie podlegają redukcji od Armored. Burning nie jest usuwany po zadziałaniu — jednostka płonie co rundę, dopóki żyje. Burning może zabić.

> ### **Marked**

Marked to status powodujący, że obrażenia otrzymywane przez jednostkę są podwojone. Podwojenie następuje po ewentualnej redukcji od Armored. Marked nie podwaja obrażeń od Burning, ponieważ Burning nie jest trafieniem. Marked nie jest usuwany po trafieniu — działa, dopóki jednostka żyje. Nałożenie Marked na jednostkę uruchamia wyzwalacze u jednostek, które reagują na nakładanie statusów.

> ### **Stunned**

Stunned to status powodujący, że jednostka pomija swoje najbliższe uderzenie. Dotyczy to zarówno uderzenia w fazie walki, jak i pojedynczego uderzenia z Bonus Attack. Po pominięciu uderzenia status Stunned jest automatycznie usuwany — jest jednorazowy. Stunned nie blokuje efektów przed walką ani wyzwalaczy z obrażeń otrzymanych od innych jednostek.

> ### **BurnSource**

BurnSource sprawia, że jednostka nakłada Burning na każdą jednostkę wroga, której zada obrażenia w bezpośrednim starciu. Działa przy uderzeniu w fazie walki, przy Bonus Attack i przy SplashDamage. Nie działa przy obrażeniach zadawanych przez efekty kart — tylko przy bezpośrednich uderzeniach.

> ### **Pozostałe terminy w opisach kart**

Sacrifice — poświęcenie własnej jednostki. Blood — zasób wykorzystywany do zagrywania kart. Bonus Attack — natychmiastowe pojedyncze uderzenie jednostki w jej linii, zgodnie z regułami Flying i Stunned; jest atakiem dodatkowym, nie zastępuje normalnego uderzenia w fazie walki. Silence — wyciszenie jednostki. Move Right — przesunięcie jednostki o jedną linię w prawo, jeśli docelowy slot jest wolny; jeśli docelowy slot nie jest wolny, efekt nie działa. Mark — nałożenie statusu Marked. Exploding Present — karta trafia do ręki przeciwnika, a nie do stosu odrzuconych właściciela; jeśli ręka przeciwnika jest pełna, trafia do stosu odrzuconych właściciela.

> ## **Sacrifice**

Sacrifice to mechanika odrębna od śmierci. Gdy jednostka jest poświęcana, najpierw uruchamiają się efekty samej poświęcanej jednostki, wyzwalane przez Sacrifice. Niektóre jednostki reagują na własne poświęcenie w specyficzny sposób — na przykład wracają do ręki zamiast ginąć. Jeśli jednostka nadal znajduje się na planszy (nie wróciła do ręki i nie zniknęła w inny sposób), zostaje zniszczona — uruchamiają się jej efekty pośmiertne, tak jak przy normalnej śmierci. Następnie uruchamiają się efekty pozostałych jednostek właściciela oraz kart w ręce właściciela, wyzwalane przez poświęcenie innej jednostki. Sacrifice liczy się jako zniszczenie dla celów wszelkich wyzwalaczy reagujących na śmierć jednostek. Jednostka, która wróciła do ręki zamiast ginąć, nie trafia do stosu odrzuconych, ale i tak uruchamia wyzwalacze poświęcenia u innych jednostek.

> ## **Silence**

Silence usuwa wszystkie słowa kluczowe — zarówno te wynikające z samej karty, jak i nadane przez efekty innych jednostek. Usuwa wszystkie tymczasowe modyfikacje statystyk — Atak i HP wracają do wartości bazowych z karty. Usuwa wszystkie statusy — w tym Marked, Burning i Stunned. Usuwa wszystkie zdolności pasywne — jednostka przestaje oddziaływać na otoczenie, na przykład obniżać koszt akcji albo podnosić koszt akcji przeciwnika. Wyciszona jednostka nie uruchamia swoich zdolności — ani tych z planszy, ani tych pośmiertnych. Oznacza to, że wyciszona jednostka, która ginie, nie uruchomi swoich efektów pośmiertnych. Silence jest więc mechaniką bardzo silną — nie tylko odbiera jednostce jej zdolności, ale też całkowicie je wyłącza. Silence nie usuwa efektów globalnych nałożonych wcześniej na gracza — jednostka zachowuje to, co zostało jej przyłożone przy wejściu na planszę. Nie usuwa także efektów działających z ręki — te działają niezależnie od tego, czy karta na planszy jest wyciszona.

> ## **Modyfikacje kosztu**

Koszt zagrania karty jest liczony w momencie jej zagrania i może się różnić od kosztu bazowego wydrukowanego na karcie. Na ostateczny koszt składają się: koszt bazowy karty, modyfikacje od jednostek na planszy oraz modyfikacje od efektów działających z ręki. Jednostki obniżające koszt własnych akcji oraz jednostki podnoszące koszt akcji przeciwnika sumują się. Koszt nie może być ujemny — minimalna wartość to 0\. Blood jest odejmowana od aktualnego stanu konta gracza. Jeśli koszt przewyższa dostępną Blood, karta jest niezagrywalna. Obniżki nagromadzone na karcie w ręce przepadają, jeśli karta wróci do ręki w wyniku efektu — wraca jako nowa karta, bez wcześniejszych modyfikacji.

> ## **Efekty działające z ręki**

Niektóre karty posiadają zdolności, które działają z ręki, a nie z planszy. Oznacza to, że karta nie musi być zagrana, aby jej efekt był aktywny. Przykładowo karta może obniżać swój koszt za każde poświęcenie innej jednostki, obniżać koszt za każdą zagraną akcję, przyzywać się na planszę w miejsce zmarłej jednostki albo gromadzić bonusowe statystyki, gdy giną jednostki określonego typu. Efekty z ręki działają tylko raz na daną sytuację i tylko dopóki karta pozostaje w ręce. Po zagraniu karty jej efekty z ręki przestają działać, a zaczynają działać efekty z planszy, jeśli takie posiada.

> ## **Warunki zwycięstwa i zakończenie gry**

Gra kończy się w momencie, gdy punkty zdrowia któregokolwiek gracza spadną do zera lub poniżej. Sprawdzenie warunku zwycięstwa następuje po każdym efekcie zadającym obrażenia bohaterowi oraz po rozstrzygnięciu śmierci jednostek. Gra nie ma limitu rund — trwa do rozstrzygnięcia. Gracz może również poddać się w dowolnym momencie, co natychmiast kończy grę jego porażką.

> ## **Przypadki szczególne**

Kolejność wyzwalaczy przy śmierci: gdy jednostka ginie, najpierw uruchamiają się jej własne efekty pośmiertne, następnie efekty innych jednostek na planszy reagujące na śmierć, a na końcu efekty kart w ręce właściciela. Przy Sacrifice kolejność jest inna: najpierw efekty samej poświęcanej jednostki, potem ewentualna śmierć i jej efekty, a na końcu efekty poświęcenia u pozostałych jednostek i kart w ręce.

Ręka pełna: jeśli efekt ma dobrać kartę, a ręka gracza jest pełna, karta trafia do stosu odrzuconych. Dotyczy to zarówno dobierania na początku rundy, jak i efektów dobierających w trakcie gry. Karta wracająca z Unkillable również trafia do stosu odrzuconych, jeśli ręka jest pełna.

Pusta talia: każda próba dobrania karty przy pustej talii powoduje obrażenia. Pierwsza taka próba zadaje 1 obrażenie, druga 2, trzecia 3 i tak dalej. Licznik rośnie niezależnie od źródła próby dobrania. Nie ma tasowania stosu odrzuconych w celu utworzenia nowej talii.

Silence a statusy: Silence usuwa wszystkie statusy, w tym Marked, Burning i Stunned. Wyciszona jednostka przestaje płonąć, przestaje być naznaczona i przestaje być ogłuszona. Silence a śmierć: wyciszona jednostka nie uruchamia swoich efektów pośmiertnych. Wyciszenie osłabia nie tylko samą jednostkę, ale też jej potencjał po śmierci. Unkillable a Silence: Silence usuwa Unkillable, więc wyciszona jednostka z Unkillable może zginąć normalnie.

SoulGuard a Sacrifice: SoulGuard nie ratuje przed Sacrifice, ponieważ Sacrifice nie jest śmiercią od obrażeń. Flying a brak jednostki w linii: jeśli w linii nie ma jednostki wroga, atakujący trafia bohatera — niezależnie od tego, czy ma Flying. Flying ma znaczenie tylko wtedy, gdy w linii stoi jednostka wroga. Stunned a Bonus Attack: Stunned pomija najbliższe uderzenie — w tym uderzenie z Bonus Attack; po pominięciu status jest usuwany.

> 