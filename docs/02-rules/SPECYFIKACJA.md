# RE:JOLTANCE — specyfikacja zasad (v2)

**Wersja:** 2.0 · 2026-10-27 · **Kanon:** zachowanie prototypu `prototype/revibance` v11 (ADR-0005).
Ten dokument tłumaczy grę ludziom. Testowalne wymagania ze scenariuszami są w `openspec/specs/*/spec.md`, a numery R‑nn i statusy — w [`RULES-INDEX.md`](RULES-INDEX.md).
Miejsca sporne oznaczono **[D‑nn]** — patrz [`ROZBIEZNOSCI.md`](ROZBIEZNOSCI.md).

Najlepiej czytać z otwartym prototypem: `npx serve prototype/revibance` → zagraj z botem.

## 1. O co chodzi

Dwóch graczy, każdy z talią 30 kart i bohaterem z **20 HP**. Plansza ma **4 linie** (0–3), w każdej jest jeden slot na jednostkę po każdej stronie.
Wygrywa ten, kto pierwszy sprowadzi HP wrogiego bohatera do 0 (R-70). Gra nie ma limitu rund — kończy się najpóźniej przez obrażenia z pustej talii (R-14).

**Karty:** 69 kolekcjonerskich (jednostki i akcje) + 9 tokenów tworzonych przez efekty. Jednostka ma koszt, atak i HP; akcja (czar) ma koszt i efekt.
**Podtypy** (Animal, Demon, Funko Pop, Human, Machine, Mercenary, Monster, Mystical, Token) działają jak plemiona dla warunków efektów.

**Talia** (R-01): dokładnie 30 kart, maks. 3 kopie, bez tokenów. W grze jest 5 talii startowych.

## 2. Zasób: Blood

W rundzie *n* każdy gracz ma **min(n, 10)** Blood, odnawiane na początku rundy — niewydane przepada (R-10).
Koszt zagrania (R-23) = koszt z karty − obniżki (efekty z ręki, Tea Maid dla akcji) + podwyżki (Wyvern przeciwnika: +6 do akcji), nigdy poniżej 0.
Efekt `AddResource` może dodać Blood do maks. 10 (R-65).

## 3. Początek meczu

1. Każdy dobiera **4 karty** z przetasowanej talii (R-02).
2. **Mulligan** (R-03): wskazujesz dowolną liczbę kart do wymiany — dobierasz tyle samo z góry talii, potem odrzucone wracają do talii i talia jest tasowana **[D-02]**.
3. **Kolejność** (R-04): każdy deklaruje „pierwszy/drugi”. Różne wybory są honorowane, takie same — losowanie.

## 4. Runda

Na początku rundy: numer +1, Blood odnowione, od rundy 2 każdy **dobiera 1 kartę** (R-10). Rozpoczynający zmienia się co rundę (R-11).

Gracz rozpoczynający rundę to **A**, drugi to **B** (R-12):

| Krok | Aktywny | Może zagrać |
|---|---|---|
| 1. Jednostki | A | tylko jednostki |
| 2. Mieszany | B | jednostki i akcje |
| 3. Akcje | A | tylko akcje |
| 4. Walka | — | automatyczna |

Aktywny gracz kończy krok, kiedy chce. **Ręka** mieści 8 kart — nadmiar trafia na stos odrzuconych (R-13).
**Pusta talia**: zamiast dobrania obrażenia 1, potem 2, 3… — stos odrzuconych **nie** jest tasowany do talii (R-14).

**Koniec rundy** (R-15): każda jednostka z Burning traci 1 HP (pancerz redukuje — **[D-08]**), potem śmierć i sprawdzenie zwycięstwa.

## 5. Zagrywanie kart

- Jednostkę stawiasz na **wolny slot własnej linii** (R-21). Dostaje stały bonus gracza (ModifyGlobalBuff). Najpierw działa jej „Po zagraniu”, potem reakcje sojuszników.
- Akcję możesz zagrać tylko, jeśli istnieją wszystkie wymagane cele (R-22). Po rozstrzygnięciu trafia na stos odrzuconych — albo do ręki przeciwnika (`GiveToOpponent`, „prezent”).
- **Cele** (R-25): wroga jednostka · przyjazna jednostka · dowolna jednostka · wroga jednostka lub bohater · jednostka do poświęcenia · kilka jednostek do poświęcenia · karta z talii · opcja (A/B). Serwer zawsze sprawdza, czy cel jest legalny **[D-05]**.
- **Efekty z ręki** (R-24) działają tylko, póki karta jest w ręce: tanieje (np. za każde poświęcenie), zbiera bonus ataku albo sama wskakuje na planszę w miejsce zmarłej jednostki.

## 6. Walka

Linie rozstrzygają się po kolei **0 → 1 → 2 → 3** (R-30). W każdej linii:

1. **Przed walką** — efekty „przed walką” (np. nałóż Marked, podpal, 5 obrażeń bohaterowi); cel wybiera właściciel. Kolejność: gracz 0, potem 1 **[D-10]** (R-31).
2. **Uderzenia** — obie jednostki uderzają **jednocześnie** atakiem sprzed jakichkolwiek obrażeń; obie mogą zginąć (R-32).
   - Ten sam status **Flying** po obu stronach (obie latają lub obie nie) → uderzenie trafia jednostkę naprzeciw.
   - Inaczej, albo gdy naprzeciw nikogo nie ma → uderzenie trafia **bohatera** (R-33) **[D-07]**.
3. **Kolejka wyzwalaczy z obrażeń** — „gdy zada obrażenia jednostce/bohaterowi”, „gdy zabije” — wykonują się po obu uderzeniach, nawet jeśli jednostka ginie (R-34).
4. **Śmierć** (R-50).
5. **Po walce** — efekty „po walce” ocalałych (np. Bonus Attack), potem znów śmierć.

**Bonus Attack** (R-35) to natychmiastowe, jednostronne uderzenie poza walką, według tych samych reguł.

## 7. Słowa kluczowe i statusy

| Słowo | Działanie | Reguła |
|---|---|---|
| **Flying** | atakuje bohatera, jeśli obrońca nie lata; zwykła jednostka też omija latającą **[D-07]** | R-33 |
| **Armored (n)** | −n do każdego trafienia (min 0), przed Marked; Armor2 = 2 | R-40 |
| **Marked** | otrzymywane obrażenia ×2 (po pancerzu); nie dotyczy Burning; trwały | R-41 |
| **Stunned** | pomija najbliższe uderzenie (też Bonus Attack), potem znika | R-42 |
| **Burning** | −1 HP na koniec rundy, trwały do śmierci lub Silence | R-15, R-43 |
| **BurnSource** | podpala jednostki, którym zada obrażenia **[D-09]** | R-43 |
| **SplashDamage (n)** | po uderzeniu n obrażeń wrogim jednostkom w sąsiednich liniach (nie bohaterowi, nie gdy Stunned) | R-44 |
| **Breakthrough** | po trafieniu jednostki — dodatkowo pełny atak w bohatera **[D-03]** | R-45 |
| **SoulGuard** | raz ratuje przed śmiercią (zostaje 1 HP); nie chroni przed Sacrifice; aura Survivalist daje go sojusznikom | R-46 |
| **Unkillable** | po śmierci (i efektach pośmiertnych) wraca do ręki; pełna ręka → odrzucone; token znika | R-47 |

Nałożenie statusu wywołuje reakcje kart typu „gdy wróg zostanie naznaczony” (R-48).

## 8. Śmierć, poświęcenie, wyciszenie

- **Śmierć** (R-50): HP ≤ 0. Kolejność: efekty pośmiertne jednostki → reakcje sojuszników → efekty kart w ręce. Karta idzie na stos odrzuconych.
- **Sacrifice** (R-51): najpierw efekty „gdy poświęcona” samej jednostki, potem zniszczenie (SoulGuard nie pomaga), potem reakcje „gdy inna jednostka zostanie poświęcona”.
- **Silence** (R-52): kasuje słowa kluczowe, statusy i bonusy (atak/HP do wartości z karty) i trwale wyłącza wszystkie zdolności — także pośmiertne i pasywne.
- **Powrót do ręki** (R-53): karta wraca jako nowa, bez bonusów **[D-04]**.

## 9. Efekty kart (DSL)

Karta to dane: `Effects[] = { Trigger, Zone?, Condition?, Targeting?, Actions[] }` (R-60). Nieznane słowo w danych = błąd przy starcie serwera (R-68).

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
**Pasywne** (Tea Maid, Wyvern, Survivalist) w prototypie są zakodowane po numerach kart — u nas mają wynikać z danych (R-67, **[D-11]**).

## 10. Koniec meczu

- HP bohatera ≤ 0 → przegrana, natychmiast — także w środku walki (R-70).
- Obaj bohaterowie ≤ 0 w tym samym momencie → **remis** (R-71, **[D-01]**).
- Poddanie się — w każdej chwili (R-72). Rozłączenie — 60 s na powrót, potem walkower (R-73).

## 11. Gra online — zasady uczciwości

Serwer jest jedynym sędzią (R-80…R-84): klient wysyła tylko intencje, dostaje tylko swój widok (ręka przeciwnika = liczba),
każdy ruch jest sprawdzany, a mecz da się odtworzyć z seeda i listy intencji. Szczegóły: `openspec/specs/server-authority`.
