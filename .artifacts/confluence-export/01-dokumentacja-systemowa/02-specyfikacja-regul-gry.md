<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md @ a2bf2a4 (2026-11-02) -->
# 1.2 Specyfikacja funkcjonalna zasad gry — RE:JOLTANCE (v2)

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md`) · **Kategoria dokumentacji:** Dokumentacja produktowa — systemowa (wymagania funkcjonalne i reguły domenowe) · **Etap SDD:** Specyfikacja · **Kanon:** zachowanie prototypu `prototype/revibance` v11 ([ADR-0005](07-decyzje-adr/0005-kanon-regul-prototyp-js.md)).

Ten dokument wyjaśnia zwykłym językiem zasady gry RE:JOLTANCE. SDD (Spec-Driven Development) oznacza, że najpierw spisujemy zasady, a dopiero potem je programujemy. Formalne wymagania ze scenariuszami `GIVEN / WHEN / THEN` są w plikach `openspec/specs/*/spec.md`. Numery reguł `R‑nn` i powiązane testy zebraliśmy w dokumencie [1.3 Indeks reguł R‑nn](03-indeks-regul-r-nn.md).

Miejsca sporne mają znacznik `[D‑nn]`. Szczegóły każdego z nich opisuje dokument [1.4 Analiza rozbieżności prototypu](04-rozbieznosci-prototypu.md).

Najlepiej czytaj z otwartym prototypem: uruchom `npx serve prototype/revibance` i zagraj z botem.

## 1. O co chodzi

Grają dwie osoby. Każda ma talię 30 kart i bohatera z **20 HP** (punktów zdrowia). Plansza ma **4 linie** (0–3). W każdej linii jest jeden slot na jednostkę po każdej stronie.
Wygrywa ten, kto pierwszy zbije HP wrogiego bohatera do 0 (R-70). Gra nie ma limitu rund. Najpóźniej kończą ją obrażenia z pustej talii (R-14).

**Karty:** 69 kolekcjonerskich (jednostki i akcje) oraz 9 tokenów, które tworzą efekty. Jednostka ma koszt, atak i HP. Akcja (czar) ma koszt i efekt.
**Podtypy** (Animal, Demon, Funko Pop, Human, Machine, Mercenary, Monster, Mystical, Token) działają jak plemiona w warunkach efektów.

**Talia** (R-01): dokładnie 30 kart, maks. 3 kopie jednej karty, bez tokenów. Gra ma 5 talii startowych.

## 2. Zasób: Blood

W rundzie *n* każdy gracz ma **min(n, 10)** Blood. Blood odnawia się na początku rundy, a niewydane przepada (R-10).
Koszt zagrania (R-23) liczymy tak: koszt z karty − obniżki (efekty z ręki, Tea Maid dla akcji) + podwyżki (Wyvern przeciwnika: +6 do akcji). Koszt nigdy nie spada poniżej 0.
Efekt `AddResource` może dodać Blood, maksymalnie do 10 (R-65).

## 3. Początek meczu

1. Każdy dobiera **4 karty** z przetasowanej talii (R-02).
2. **Mulligan** (R-03): wskazujesz dowolną liczbę kart do wymiany. Dobierasz tyle samo z góry talii. Potem odrzucone karty wracają do talii, a talia jest tasowana **[D-02]**.
3. **Kolejność** (R-04): każdy deklaruje „pierwszy” albo „drugi”. Jeśli wybory się różnią, gra je respektuje. Jeśli są takie same, decyduje losowanie.

## 4. Runda

Na początku rundy numer rundy rośnie o 1, a Blood się odnawia. Od rundy 2 każdy **dobiera 1 kartę** (R-10). Gracz rozpoczynający zmienia się co rundę (R-11).

Gracza, który zaczyna rundę, nazywamy **A**, a drugiego **B** (R-12):

| Krok | Aktywny | Może zagrać |
|---|---|---|
| 1. Jednostki | A | tylko jednostki |
| 2. Mieszany | B | jednostki i akcje |
| 3. Akcje | A | tylko akcje |
| 4. Walka | — | automatyczna |

Aktywny gracz kończy krok, kiedy chce. **Ręka** mieści 8 kart. Nadmiar trafia na stos odrzuconych (R-13).
**Pusta talia**: zamiast dobrania dostajesz obrażenia 1, potem 2, 3 i tak dalej. Stos odrzuconych **nie** wraca do talii (R-14).

**Koniec rundy** (R-15): każda jednostka z Burning traci 1 HP (pancerz to redukuje — **[D-08]**). Potem gra sprawdza śmierć jednostek i zwycięstwo.

## 5. Zagrywanie kart

- Jednostkę stawiasz na **wolny slot we własnej linii** (R-21). Dostaje stały bonus gracza (ModifyGlobalBuff). Najpierw działa jej efekt „po zagraniu”, potem reakcje sojuszników.
- Akcję zagrasz tylko wtedy, gdy istnieją wszystkie wymagane cele (R-22). Po rozstrzygnięciu akcja trafia na stos odrzuconych albo do ręki przeciwnika (`GiveToOpponent`, „prezent”).
- **Cele** (R-25): wroga jednostka · przyjazna jednostka · dowolna jednostka · wroga jednostka lub bohater · jednostka do poświęcenia · kilka jednostek do poświęcenia · karta z talii · opcja (A/B). Serwer zawsze sprawdza, czy cel jest legalny **[D-05]**.
- **Efekty z ręki** (R-24) działają tylko wtedy, gdy karta jest w ręce. Karta może tanieć (np. za każde poświęcenie), zbierać bonus ataku albo sama wskoczyć na planszę w miejsce zmarłej jednostki.

## 6. Walka

Linie rozstrzygają się po kolei: **0 → 1 → 2 → 3** (R-30). W każdej linii:

1. **Przed walką.** Działają efekty „przed walką” (np. nałóż Marked, podpal, zadaj 5 obrażeń bohaterowi). Cel wybiera właściciel karty. Najpierw działa gracz 0, potem gracz 1 **[D-10]** (R-31).
2. **Uderzenia.** Obie jednostki uderzają **jednocześnie**, atakiem sprzed jakichkolwiek obrażeń. Obie mogą zginąć (R-32).
   - Obie jednostki mają ten sam status **Flying** (obie latają albo obie nie latają) → uderzenie trafia jednostkę naprzeciw.
   - W przeciwnym razie albo gdy naprzeciw nikogo nie ma → uderzenie trafia **bohatera** (R-33) **[D-07]**.
3. **Kolejka wyzwalaczy z obrażeń.** Efekty typu „gdy zada obrażenia jednostce/bohaterowi” i „gdy zabije” działają po obu uderzeniach. Działają nawet wtedy, gdy jednostka ginie (R-34).
4. **Śmierć** (R-50).
5. **Po walce.** Działają efekty „po walce” jednostek, które przeżyły (np. Bonus Attack). Potem gra znów sprawdza śmierć.

**Bonus Attack** (R-35) to natychmiastowe, jednostronne uderzenie poza walką. Działa według tych samych reguł.

## 7. Słowa kluczowe i statusy

| Słowo | Działanie | Reguła |
|---|---|---|
| **Flying** | atakuje bohatera, jeśli obrońca nie lata; zwykła jednostka też omija latającą **[D-07]** | R-33 |
| **Armored (n)** | −n do każdego trafienia (min 0), liczone przed Marked; Armor2 = 2 | R-40 |
| **Marked** | otrzymywane obrażenia ×2 (po pancerzu); nie dotyczy Burning; trwały | R-41 |
| **Stunned** | pomija najbliższe uderzenie (także Bonus Attack), potem znika | R-42 |
| **Burning** | −1 HP na koniec rundy; trwa do śmierci albo Silence | R-15, R-43 |
| **BurnSource** | podpala jednostki, którym zada obrażenia **[D-09]** | R-43 |
| **SplashDamage (n)** | po uderzeniu zadaje n obrażeń wrogim jednostkom w sąsiednich liniach (nie bohaterowi, nie gdy Stunned) | R-44 |
| **Breakthrough** | po trafieniu jednostki zadaje dodatkowo pełny atak bohaterowi **[D-03]** | R-45 |
| **SoulGuard** | raz ratuje przed śmiercią (zostaje 1 HP); nie chroni przed Sacrifice; aura Survivalist daje go sojusznikom | R-46 |
| **Unkillable** | po śmierci (i efektach pośmiertnych) wraca do ręki; przy pełnej ręce idzie na stos odrzuconych; token znika | R-47 |

Nałożenie statusu wywołuje reakcje kart typu „gdy wróg zostanie naznaczony” (R-48).

## 8. Śmierć, poświęcenie, wyciszenie

- **Śmierć** (R-50): jednostka ginie przy HP ≤ 0. Kolejność: efekty pośmiertne jednostki → reakcje sojuszników → efekty kart w ręce. Karta trafia na stos odrzuconych.
- **Sacrifice** (R-51): najpierw działają efekty „gdy poświęcona” samej jednostki. Potem jednostka jest niszczona (SoulGuard nie pomaga). Na końcu działają reakcje „gdy inna jednostka zostanie poświęcona”.
- **Silence** (R-52): kasuje słowa kluczowe, statusy i bonusy (atak i HP wracają do wartości z karty). Trwale wyłącza wszystkie zdolności, także pośmiertne i pasywne.
- **Powrót do ręki** (R-53): karta wraca jako nowa, bez bonusów **[D-04]**.

## 9. Efekty kart (DSL)

Efekty kart zapisujemy w DSL (Domain-Specific Language), czyli w małym języku opisu efektów. Karta to dane: `Effects[] = { Trigger, Zone?, Condition?, Targeting?, Actions[] }` (R-60). Nieznane słowo w danych zatrzymuje start serwera błędem (R-68).

**Wyzwalacze (15):** OnPlayed, OnDeath, OnKill, OnSacrificed, OnOtherUnitSacrificed, OnFriendlyUnitDied, OnFriendlyCardDrawn, OnOpponentCardDrawn,
OnStatusApplied, OnPreCombatLine, OnPostCombatLine, OnDamagedEnemyUnit, OnDamagedEnemyHero, OnFriendlyActionPlayed, Passive.

**Akcje (25):**

| Grupa | Akcje | Reguła |
|---|---|---|
| obrażenia i leczenie | DealDamage, LoseHealth, Heal, HealToFull | R-61 |
| statystyki | BuffStats, ModifyGlobalBuff, AbsorbStats | R-62 |
| karty i strefy | DrawCard, DrawFromDiscard, TutorCard, AddCardToHand, ShuffleDeck, GiveToOpponent | R-63, R-22 |
| plansza | MakeAUnit, SummonUnit, MoveRight, DestroyUnit, ReturnToHand, Transform | R-64, R-69, R-24 |
| statusy | ApplyStatus, Silence | R-48, R-52 |
| poświęcenie i ataki | SacrificeUnit, SacrificeUnits, BonusAttack | R-51, R-35 |
| zasób | AddResource | R-65 |

**Warunki:** And, Or, Not, IsSelf, IsSubtype, IsStatus, IsEnemy, IsFriendly, HasSubtypeOnBoard (R-66).
**Efekty pasywne** (Tea Maid, Wyvern, Survivalist) prototyp ma zakodowane na sztywno po numerach kart. U nas mają wynikać z danych (R-67, **[D-11]**).

## 10. Koniec meczu

- HP bohatera ≤ 0 oznacza natychmiastową przegraną, także w środku walki (R-70).
- Obaj bohaterowie spadają do ≤ 0 w tym samym momencie → **remis** (R-71, **[D-01]**).
- Poddać się możesz w każdej chwili (R-72). Po rozłączeniu masz 60 s na powrót, potem przegrywasz walkowerem (R-73).

## 11. Gra online — zasady uczciwości

Serwer jest jedynym sędzią (R-80…R-84). Klient wysyła tylko intencje, czyli informację, jaki ruch gracz chce wykonać. Klient dostaje tylko swój widok: z ręki przeciwnika widzi wyłącznie liczbę kart (fog of war, R-80…R-82).
Serwer sprawdza każdy ruch. Mecz da się odtworzyć z seeda i listy intencji (R-83). Szczegóły: `openspec/specs/server-authority`.
