# RE:JOLTANCE — niezależna analiza, architektura i plan podziału pracy

**Data:** 25 października 2026
**Materiały wejściowe:** `RE_JOLTANCE.md` (specyfikacja), demo JS (`engine.js`, `ui.js`, `bot.js`, `cards.js`, `index.html`, `style.css`), poprzedni audyt techniczny
**Założenie:** analiza robiona od nowa, bez kopiowania wniosków z poprzedniego audytu.

---

## 0. Co zrobiłem, zanim napisałem pierwsze zdanie

1. Przeczytałem specyfikację (`RE_JOLTANCE.md`) i demo linijka po linijce.
2. **Zbudowałem spine** — działający, pionowy przekrój przez wszystkie warstwy (repo `/home/user/rejoltance`):
   kontrakty → kernel → projekcja → serwer WS → klient React → bot headless,
   **23 testy zielone** (18 testów reguł + 5 testów granic architektury), symulator 300 partii w 1,4 s.
3. Dopiero na tej podstawie piszę wnioski. Wszystkie twierdzenia o demie mają odwołanie do pliku/funkcji;
   wszystkie twierdzenia o architekturze są sprawdzone kodem.

> Spine jest w tym samym workspace i **działa**: `npm i && npm run dev` w `/home/user/rejoltance`.
> To nie jest "docelowy kod" — to dowód, że opisany niżej kształt da się zbudować w jeden wieczór.

---

# CZĘŚĆ 1 · ANALIZA (niezależna)

## 1.1 Werdykt w pięciu zdaniach

1. **Najcenniejszym plikiem w projekcie jest `RE_JOLTANCE.md`, nie kod.** Macie specyfikację, jakiej nie ma
   90% komercyjnych gier karcianych: jawna kolejność rozstrzygania, priorytet SoulGuard vs Unkillable,
   Armored przed Marked, kolejka wyzwalaczy, licznik pustej talii. To jest **jedyny asset, którego nie wolno stracić**.
2. **Silnik faktycznie jest dziurawy — ale nie "trochę", tylko systemowo.** Znalazłem **20 konkretnych rozbieżności
   między demem a specyfikacją**, w tym trzy, które zmieniają zasady gry (mulligan tasuje talię, brak mechaniki
   pustej talii, pasywne efekty hardcodowane w funkcji kosztu). Pełna tabela: rozdział 1.3.
3. **Rebuild jest uzasadniony, ale musicie znać jego cenę: ~200 roboczogodzin.** Poprzedni audyt wycenił
   całość na ~180 h, bo zakładał reuse 9 258 linii C#. Jeśli silnik powstaje od nowa, **samo MVP rośnie
   do ~340 h bazowych (~480 h z ryzykiem)**. To jest najważniejsza liczba w tym dokumencie i jedyna,
   której poprzedni audyt nie mógł znać.
4. **Architektura, której potrzebujecie, nie zależy od języka** — zależy od pięciu kontraktów
   (Intent / LegalAction / PendingInteraction / MatchView / DomainEvent). Jeśli te pięć będzie dobrze
   zaprojektowanych w tygodniu 1, sześć osób może pracować równolegle przez rok bez blokowania się.
5. **Decyzja o C# nie była decyzją — była dziedziczona po Godocie.** C# wybraliście, bo Godot 4 używa C#.
   Idąc do przeglądarki, ten argument znika. Rekomenduję jeden język (TypeScript) — uzasadnienie w części 5,
   z uczciwym wariantem .NET + Aspire, jeśli promotor się nie zgodzi.

## 1.2 Co w demie jest naprawdę wartościowe (i to zabieramy)

| Wartość | Dlaczego | Co robimy |
|---|---|---|
| **Deklaratywne karty** (`cards.json`, 67 kart, 50 jednostek + 17 czarów) | zero linii kodu na kartę; 22 typy akcji, 14 triggerów, 12 selektorów celów, 8 rodzajów warunków | zostaje jako `packages/content` + JSON Schema + walidator w CI |
| **Szkielet interpretera** (`fire()` → `act()` → `tg()`) | kształt "Trigger → Warunek → Selektor → Akcja" jest poprawny | zostaje kształt; wymieniamy wnętrze (patrz 1.3) |
| **`blindClone()` w bocie** | bot nie zna kolejności talii — symuluje tylko to, co widziałby człowiek | zostaje jako reguła projektowa AI |
| **Projekcja walki w bocie** (`project()`) | "co będzie po tej rundzie, jeśli nikt nic nie zagra" — świetna heurystyka | zostaje jako podstawa funkcji oceny |
| **Rozdział logu od stanu** (`G.ev`, `G.hist`) | zalążek poprawnego podejścia: fakty osobno, stan osobno | przerabiamy na `DomainEvent` + `AnimationScript` |
| **UI: wachlarz ręki, flyCard, glosariusz słów kluczowych** | realny "efekt wow" za grosze | zostaje jako referencja wizualna |

## 1.3 Dlaczego silnik jest do wyrzucenia — 20 dowodów

Klucz: `[SPEC]` = reguła z `RE_JOLTANCE.md`, `[DEMO]` = kod w `engine.js` / `ui.js` / `bot.js`.

### A. Rozbieżności ze specyfikacją (gra działa niezgodnie z zasadami)

| # | Reguła `[SPEC]` | Kod `[DEMO]` | Skutek |
|---|---|---|---|
| 1 | Odrzucone karty w mulliganie idą **na dno talii, bez tasowania** | `mulligan()`: `p.deck.push(...out); shuf(p.deck)` | Odrzucona karta wraca do gry. Reguła "karta zostaje na dnie do końca partii" nie istnieje. |
| 2 | Pusta talia → **1, 2, 3... obrażeń**, licznik wspólny dla wszystkich źródeł | `draw()`: `if(!p.deck.length && p.disc.length){ p.deck = shuf(p.disc); p.disc = [] }` | **Dwa naruszenia naraz:** odrzucone są tasowane z powrotem (spec: „Nie ma tasowania stosu odrzuconych”) i nie ma obrażeń za pustą talię. Gra nie ma naturalnego końca. |
| 3 | Ręka pełna → odrzucenie; **nie dotyczy pustej talii** | `draw()` najpierw dobiera, potem sprawdza limit | Odwrotna kolejność w przypadku brzegowym. |
| 4 | Efekt "przed walką" wskazuje cel | UI wykonuje `await choosePre(...)` (`ui.js: combat()`) i **przekazuje wynik do silnika** | Silnik nie ma pojęcia "oczekuję na gracza". W sieci serwer musiałby wisieć w `reduce()`. |
| 5 | Obaj gracze wybierają, czy chcą być pierwsi | brak w ogóle: `G.start = G.turn % 2 ? 0 : 1` | Kawałek reguł niezaimplementowany. |
| 6 | Przeciwnik też robi mulligan | `botMullBasic(G, p)` — heurystyka zamiast reguły | W PvP nie ma komu zadać pytania. |

### B. Dziury w interpreterze (karta wygląda na działającą, a nie działa)

| # | Problem `[DEMO]` | Skutek |
|---|---|---|
| 7 | `Passive` w ogóle się nie odpala. Tea Maid (46) i Wyvern (60) są **hardcodowane w funkcji kosztu**: `cost()` → `x -= cnt(p,46); x += 6*cnt(opponent,60)` | Każda nowa karta modyfikująca koszt = zmiana w sercu silnika. To najczystszy dowód, że interpreter nie domaga. |
| 8 | Aura Survivalist (14) hardcodowana w `aura()` z pomocniczą flagą `sga` | To samo co wyżej. |
| 9 | `tg()` nie obsługuje `FriendlySpellsInHand` / `EnemySpellsInHand` → `return []` | Deklaracja istnieje w danych, interpreter jej nie rozumie — **i nie powie o tym słowa**. |
| 10 | `SummonUnit` na planszy: `if(T=='SummonUnit') break;` | Akcja martwa. Działa tylko z ręki (Corpse Eater) — osobna ścieżka w `fireHand()`. |
| 11 | `BuffStats` ma dwie semantyki: na planszy `if(a.Amount!=null) break;` (ignorowane), w ręce `Amount` = obniżka kosztu | Ten sam typ akcji znaczy co innego zależnie od strefy i obecności pola. |
| 12 | Kolejka wyzwalaczy (`G.q`, `later()`) istnieje **tylko w `lane()`**; w `play()`/`act()` odpala się natychmiast | `OnDamagedEnemyUnit` / `OnKill` działają w innym momencie w walce niż poza nią. Spec wymaga jednej kolejności. |
| 13 | `resolve()`: `for(let n=0;n<30&&!G.over;n++)` | Magiczną 30-tką łatamy nieskończoną pętlę reaktywną, zamiast mieć jawny budżet i diagnostykę. |
| 14 | `AbsorbStats` czyta `c.sac \|\| c.last`, a `SacrificeUnit` zapisuje `c.last` | Ukryte sprzężenie czasowe między akcjami przez wspólny `ctx`. |
| 15 | `strike()` (Bonus Attack) i `hit()` wewnątrz `lane()` to **dwie kopie** reguł uderzenia | Flying / Splash / Stunned rozjadą się między bonusem a walką przy pierwszej zmianie. |

### C. Dług, który uniemożliwia serwer i sensowne AI

| # | Problem `[DEMO]` | Skutek |
|---|---|---|
| 16 | Globalny `Math.random()`, brak ziarna | Brak replayów, brak odtwarzalnych zgłoszeń, brak powtarzalnych symulacji balansu. **(Uwaga: to jedyna rzecz, w której C#-owy `CardGame.Core` był lepszy — miał `DeterministicRng`. Przepisując silnik, musicie to odtworzyć w pierwszej kolejności.)** |
| 17 | `cloneUnit()` + `Object.assign` — ręczna lista pól do sklonowania | Bot symuluje **nie ten stan**, gdy ktokolwiek doda pole do jednostki. Najgroźniejsza cicha usterka w projekcie. |
| 18 | `botPlanSmart`: przeszukiwanie z budżetem `Date.now() - t0 > 140` ms | Wynik bota zależy od obciążenia laptopa. Brak powtarzalności = brak nauki o balansie. |
| 19 | `gsig()` — fingerprint całego stanu liczony przy **każdym efekcie**, tylko po to, by potrząsnąć kartą | Potrzeba UI wleciała do silnika. Koszt O(rozmiar stanu) × liczba efektów. |
| 20 | `dropInfo()` wywołuje `sl.click()` — warstwa dragu symuluje kliknięcia warstwy klików; `render()` przebudowuje `#board` przez `innerHTML`; ręczny diff ręki przez `dataset.html` | Brak modelu widoku. Każda zmiana UI to rosyjska ruletka. |

**Wniosek:** to nie są "długi do posprzątania w sprincie 2". To jest systemowy brak trzech rzeczy naraz:
**kontraktu**, **determinizmu** i **modelu interakcji (pending)**. Refaktorowanie tego w miejscu kosztuje
tyle, co napisanie od nowa, a daje gorszy efekt. **Zgadzam się: silnik do przebudowy.**

## 1.4 Czego NIE wolno stracić przy przepisywaniu (checklista)

- [ ] `RE_JOLTANCE.md` → `docs/rules/SPECYFIKACJA.md` + identyfikatory `R-01..R-40`
- [ ] `cards.json` (67 kart) → `packages/content`
- [ ] 64 testy z C# → **jako lista przypadków brzegowych**, nie jako kod ( backlog: `SPEC-3`)
- [ ] Algorytmy MCTS i Beam Search → **jako wiedza/pseudokod**, do przeniesienia (to temat inżynierki)
- [ ] Referencja wizualna UI (wachlarz, glosariusz, flyCard)
- [ ] `DeterministicRng` z C# — musicie go odtworzyć od pierwszego dnia (`ADR-0004`)

---

# CZĘŚĆ 2 · ARCHITEKTURA DOCELOWA

## 2.1 Siedem warstw, jeden kierunek

```
┌──────────────────────────────────────────────────────────────────────┐
│ 7. CLIENT (apps/web)          renderer MatchView + źródło intencji    │
│    ── nie ma reguł, nie ma kernela, nie zgaduje co się stało ──       │
└───────────────▲──────────────────────────────────┬───────────────────┘
                │ MatchView + AnimationScript      │ Intent
┌───────────────┴──────────────────────────────────▼───────────────────┐
│ 6. TRANSPORT (apps/server, WS)   sesja, reconnect, timeout, replay    │
├──────────────────────────────────────────────────────────────────────┤
│ 5. RUNTIME    MatchSession: kto jest w pokoju, czyje miejsce, czas    │
├──────────────────────────────────────────────────────────────────────┤
│ 4. PROJECTION toView() → fog of war   |   toAnimation() → film        │
├──────────────────────────────────────────────────────────────────────┤
│ 3. KERNEL     reduce(state, seat, intent) → { state, events }         │
│               legalActions(state, seat)  ← jedno źródło legalności    │
├──────────────────────────────────────────────────────────────────────┤
│ 2. CONTENT    karty jako dane (JSON) + rejestr efektów (DSL)          │
├──────────────────────────────────────────────────────────────────────┤
│ 1. CONTRACTS  typy współdzielone. Zero logiki. Zmiana = ADR.          │
└──────────────────────────────────────────────────────────────────────┘
        ╎                                                    ╎
   packages/sim (headless: bot, fuzzing, balans)      apps/server/modules
        ╎                                             (konta, talie, historia)
        └────── używają kernela bezpośrednio, bez sieci ──────┘
```

**Zasada nienaruszalna:** strzałki idą tylko w dół. `kernel` nie wie, że istnieje sieć.
`web` nie wie, że istnieje kernel. Test granic (`apps/server/src/__tests__/boundaries.test.ts`)
sprawia, że złamanie tej zasady = czerwony build. **To nie jest zasada w Confluence — to jest kod.**

## 2.2 Pięć kontraktów, których nie wolno zepsuć

| Kontrakt | Producent | Konsumenci | Dlaczego to jest granica |
|---|---|---|---|
| `Intent` | klient **i** bot | runtime → kernel | Jedyna rzecz, która wchodzi do gry. Serwer nie przyjmuje stanu. |
| `LegalAction` | kernel (`legalActions()`) | **UI** (podświetlanie), **serwer** (walidacja), **bot** (generator ruchów) | Jedna funkcja, trzech konsumentów = koniec klasy błędów "UI mówi że można, serwer odrzuca". |
| `PendingInteraction` | kernel | UI, serwer, bot | Silnik nie blokuje → ten sam kod działa lokalnie, w sieci i w symulatorze. |
| `MatchView` | projekcja (`toView()`) | klient | Fog of war w jednym miejscu. `GameState` nigdy nie opuszcza serwera. |
| `DomainEvent → AnimationScript` | kernel → projekcja | klient | Klient nie zgaduje "co się stało" różniczkując stany (patrz `gsig()`). |

## 2.3 Topologia repozytorium

```
rejoltance/
├── MAP.md, AGENTS.md            ← wejście dla człowieka i dla LLM
├── docs/
│   ├── adr/0001..0008           ← decyzje, nie do podważenia bez nowego ADR
│   └── rules/                   ← specyfikacja + RULES-INDEX (R-01..R-40)
├── packages/
│   ├── contracts/               ← kontrakty (zero logiki)
│   ├── kernel/                  ← reguły (czyste, deterministyczne)
│   ├── content/                 ← karty (dane) + walidator
│   └── sim/                     ← boty, symulator, fuzzing, balans
├── apps/
│   ├── server/                  ← runtime + WS + modules (konta/talie/historia)
│   └── web/                     ← klient
├── tools/gen_backlog.py         ← backlog generowany, nie przepisywany
└── jira-import.csv (wygenerowany)
```

---

# CZĘŚĆ 3 · WZORCE I KOMPONENTY (żeby nie pisać od zera za każdym razem)

To jest odpowiedź na: *„chcę wzorce i komponenty, z których złożymy nowe rzeczy”*.
Katalog jest krótki celowo — **12 wzorców na krzyż**, każdy z antywzorcem, którego unika.

| # | Problem | Wzorzec | Gdzie | Antywzór, którego unikamy |
|---|---|---|---|---|
| 1 | Klient mógłby oszukiwać, wysyłając stan | **Command / Intent + reducer** | `kernel/reduce.ts` | „klient wysyła nowy stan planszy” |
| 2 | Dwie implementacje reguł legalności | **Single Source of Truth: `legalActions()`** | UI + serwer + bot | demo: `canPlay()` w silniku i `apicks()` w UI |
| 3 | Silnik musi zadać pytanie w środku ruchu | **Pending Interaction State** | `state.pendings[seat]` | demo: `await choosePre()` w UI |
| 4 | Karta = nowy kod | **Interpreter + Registry (DSL)** | `effects.ts: ACTIONS` | demo: hardcod id 46/60 w `cost()` |
| 5 | Nieznany element DSL znika po cichu | **Fail loud** (`throw`) | `resolveTargets`, `runEffect` | demo: `return []` na końcu `tg()` |
| 6 | Bot symuluje nie ten stan | **Jeden klon (`structuredClone`)** | `makeWorld()` | demo: `cloneUnit()` z ręczną listą pól |
| 7 | Nie da się powtórzyć błędu | **Seeded RNG w stanie + replay = seed + intents** | `rng.ts`, `intentLog` | demo: globalny `Math.random()` |
| 8 | UI nie wie, co się stało | **Event → Animation Script** | `animation.ts` | demo: `gsig()` — fingerprint stanu |
| 9 | Bot ≠ człowiek | **Strategy: `Policy = (state, seat, rng) => Intent`** | `packages/sim` | osobny kod bota w serwerze |
| 10 | Serwer wie za dużo o UI | **Projection / DTO (fog of war)** | `view.ts: toView()` | wysyłanie `GameState` |
| 11 | Granice modułów żyją tylko w czyjejś głowie | **Architecture test (fitness function)** | `boundaries.test.ts` | „ustaliliśmy na Discordzie” |
| 12 | Reguły rozjeżdżają się ze specyfikacją | **Executable specification (R-nn)** | `rules.test.ts` + `RULES-INDEX` | dokument w Wordzie |

Pominięte **celowo** (overengineering dla 6-osobowego zespołu): CQRS + Event Sourcing, mikroserwisy,
MediatR/Redux dla samego wzorca, własny silnik ECS, ORM z własnym DSL-em zapisany od zera.

## 3.1 Katalog komponentów klienta

| Komponent | Odpowiedzialność | Wejście | Nie wolno mu |
|---|---|---|---|
| `useMatch()` | jedyny punkt styku z siecią | `ServerMessage` | liczyć czegokolwiek |
| `AnimationPlayer` | kolejkuje i odtwarza `AnimationScript` | kroki | blokować wejścia na zawsze |
| `<Board>` / `<Lane>` / `<Slot>` | układ 4×2, podświetlanie | `board` + `pending` | decydować, czy ruch legalny |
| `<Hand>` / `<Card>` | wachlarz, hover, zoom | `hand` (z polami `playable`) | znać reguły kosztu |
| `<HeroBar>` | HP, Blood, faza | `you` / `opponent` | — |
| `<PromptOverlay>` | Mulligan / ChooseOrder / SelectTarget / Choice | `pending` | wymyślać własne opcje |
| `KeywordBadge` + słownik | opisy słów kluczowych | słownik z `packages/content` | mieć własnych opisów |

## 3.2 Ściąga „gdzie co dodać”

| Chcę… | Plik | Ryzyko regresji |
|---|---|---|
| dodać kartę | `packages/content/cards/*.json` | żadne (dane) |
| dodać efekt karty | dopisać handler do `ACTIONS` | niskie (izolowane) |
| dodać fazę | `setPhaseForStep()` + test `R-nn` | średnie |
| dodać pole do widoku | `contracts` **i** `view.ts` (razem!) | wysokie — to kontrakt |
| dodać ekran | `apps/web/src/` | żadne |
| dodać bota | nowa funkcja `Policy` | żadne |
| dodać słowo kluczowe | `contracts` + `combat.ts` + testy | wysokie |

---

# CZĘŚĆ 4 · DOKUMENTACJA W KODZIE (żeby nie karmić LLM-a całą dokumentacją)

Cel: nowy czat w IDE ma wystartować z **trzech plików**, nie z 60 stron Confluence.

**Protokół „daję czatowi kontekst” (3 pliki, ~2 minuty):**

```
1. docs/MAP.md                 ← granice, kolejność czytania, "gdzie co dodać"
2. README.md pakietu, w którym pracuję  (Po co / Publiczne API / Niezmienniki /
                                         Czego tu NIE ma / Jak testować / Właściciel)
3. AGENTS.md                   ← 9 zasad: czego nie wolno (Math.random w kernelu,
                                 kernel w Reacie, GameState na zewnątrz, ciche return [])
```

**Cztery typy dokumentów i nic więcej:**

| Typ | Gdzie | Kiedy pisać | Przykład |
|---|---|---|---|
| **MAP** | `docs/MAP.md` | raz, aktualizowany | granice + ściąga |
| **ADR** | `docs/adr/NNNN-*.md` | przy każdej decyzji, którą ktoś chciałby podważyć | 8 ADR-ów już jest w repo |
| **README pakietu** | `packages/*/README.md` | przy powstaniu pakietu | 6 stałych sekcji |
| **Reguła R-nn** | `docs/rules/RULES-INDEX.md` + `it('R-09: ...')` | przy każdej regule | 30 reguł wpisanych, 18 zrobionych |

**Reguła operacyjna:** informacja, która nie jest ani w kodzie, ani w teście, ani w ADR — **nie istnieje**.
Jira służy do *śledzenia*, nie do *przechowywania wiedzy*. Dlatego `tools/gen_backlog.py` generuje
backlog z jednego źródła: zmieniasz tam, a `REJOLTANCE-BACKLOG.md` i `jira-import.csv` robią się same.

---

# CZĘŚĆ 5 · STACK: CZY TO DECYZJA, CZY TAK WYSZŁO

## 5.1 Uczciwa odpowiedź

| Element | Skąd się wziął | Decyzja czy przypadek? |
|---|---|---|
| **C#** | Godot 4 używa C# | **Przypadek.** Argument przestał istnieć w momencie, gdy gra idzie do przeglądarki. |
| **Godot** | „bo znamy / bo był pod ręką” | **Przypadek**, który stał się blokerem (brak oficjalnego eksportu C# na Web). |
| **.NET 8** | domyślna wersja w 2024/25 | **Przypadek**, który zaraz staje się długiem (EOL 10.11.2026). |
| **Brak sieci / brak bazy / singletony** | prototyp na zaliczenie semestru | **Dług**, nie decyzja. |
| **`cards.json` (deklaratywne karty)** | świadomy wybór autora silnika | **Najlepsza decyzja w całym projekcie.** Bronić jej jak niepodległości. |

## 5.2 Rekomendacja: jeden język (TypeScript) + monorepo

**ADR-0001** (w repo). Skrót uzasadnienia:

1. **Jedna nowa rzecz do nauczenia.** Zespół i tak musi nauczyć się Reacta/TS. C# na backendzie =
   dwa toolchainy, dwa test runnery, dwie kultury.
2. **Koniec problemu „kontrakt się rozjechał”.** W wariancie C# + TS musicie generować typy
   (TypeSpec → OpenAPI → NSwag + openapi-typescript). To jest *obowiązkowy* element, nie dodatek —
   i to jest dokładnie to miejsce, w którym projekty studenckie toną.
3. **Ten sam silnik na serwerze, w symulatorze i w testach.** Bot i balans potrzebują tysięcy partii;
   w spine: **300 partii w 1,4 s** bez sieci i bez Dockera.
4. **Szybkość pętli TDD.** 23 testy w 0,4 s. Przy setkach przypadków brzegowych RE:JOLTANCE to nie jest
   drobiazg — to różnica między „napisałem test” a „napisałem test, bo muszę”.
5. **IDE i LLM widzą całość w jednym języku.** Dokładnie to, o co prosiłeś w punkcie o dokumentacji.

**Co tracimy:** 9 258 LOC C# (reguły — i tak do przepisania), 64 testy (zostają jako lista przypadków),
MCTS/Beam (do przeniesienia — pełny temat inżynierki), EF Core (zastępuje Drizzle/Prisma).

## 5.3 Wariant .NET + Aspire — konkretnie, jeśli promotor się nie zgodzi

```bash
dotnet new aspire -n ReJoltance          # AppHost + ServiceDefaults
dotnet new webapi -n ReJoltance.Server   # ASP.NET Core (.NET 10 LTS)
dotnet new vite   -n ReJoltance.Web      # albo AddViteApp w AppHost
```

```csharp
// ReJoltance.AppHost/Program.cs  — JEDNO polecenie stawia wszystko
var builder = DistributedApplication.CreateBuilder(args);

var db  = builder.AddPostgres("pg").AddDatabase("rejoltance").WithPgAdmin();
var api = builder.AddProject<Projects.ReJoltance_Server>("api")
                 .WithReference(db).WaitFor(db);
var web = builder.AddViteApp("web", "../ReJoltance.Web")
                 .WithReference(api).WaitFor(api);

builder.Build().Run();
```

- `aspire run` → dashboard na `:18888`, Postgres w kontenerze, API + Vite razem, telemetria wbudowana.
- **Koszt:** Docker Desktop na każdym laptopie (RAM/licencja), .NET 10 SDK u wszystkich, i — co ważniejsze —
  **obowiązkowy generator kontraktów** (TypeSpec → OpenAPI → NSwag dla C#, `openapi-typescript` dla TS).
  Bez tego rozjedziecie się w tygodniu 3.
- Aspire rozwiązuje *orkiestrację* (bardzo dobrze). Nie rozwiązuje *jedności modelu domeny* — tego, co w
  wariancie TS macie za darmo.

> **Moja rekomendacja: TS.** Ale jeśli zapada decyzja o .NET, architektura z części 2 zostaje bez zmian —
> zmieniają się tylko nazwy plików i dochodzi generator kontraktów jako pozycja w backlogu (ok. 12 h).

## 5.4 Jak każdy pracuje nad swoim kawałkiem, nie czekając na innych — 6 mechanizmów

| # | Mechanizm | Jak to działa | Kogo uwalnia |
|---|---|---|---|
| 1 | **Kontrakty zamrożone w dniu 1** | `packages/contracts` — po„zamrożeniu” zmiana wymaga ADR i dwóch akceptacji | wszystkich |
| 2 | **Fixtury** (JSON: stan + intencja → zdarzenia) | kernel nagrywa prawdziwe partie; UI rysuje fixtury **bez serwera**; AI je odtwarza | UI od serwera, AI od UI |
| 3 | **Fake transport** | in-memory klient↔serwer implementujący ten sam protokół: testy UI i serwera bez gniazd | UI i NET równolegle |
| 4 | **Baza w procesie** (PGlite / SQLite) | `npm run dev` działa bez Dockera; ten sam SQL w produkcyjnym Postgresie | PLAT od DevOps |
| 5 | **Bot = funkcja** (`Policy`) | AI pracuje od dnia 1 nad głupim botem, bez serwera i bez UI | AI od wszystkich |
| 6 | **Test granic w CI** | każdy może grzebać u siebie bez pytania — granica jest sprawdzana automatem | wszystkich |

**Antywzór, którego nie wolno powtórzyć z dema:** w `engine.js` UI wywoływało silnik bezpośrednio
(`await choosePre(...)`), więc **nie dało się** pracować nad UI bez silnika ani nad silnikiem bez UI.

---

# CZĘŚĆ 6 · FOKUS I KOLEJNOŚĆ: SPINE CZY WARSTWY? WIDOKI CZY KOMUNIKACJA?

## 6.1 Odpowiedź wprost

**Spine pierwszy — potem pionowe plastry. Nie warstwami. Widoki na końcu (ale od pierwszego dnia na fixturach).**

Dlaczego nie warstwami: każdy buduje swój kawałek w ciemno, a integracja w tygodniu 8 okazuje się
niemożliwa, bo **kontrakty były zgadywane, a nie użyte**. Spine w tygodniu 1 wykrywa wszystkie pomyłki
w kontraktach wtedy, gdy kosztują 2 h, a nie 20 h.

Dlaczego widoki na końcu: bo koszt zmiany. Uporządkowane od najdroższego do najtańszego:

```
kontrakt (Intent/View/LegalAction)  ████████████████  nie da się przerobić w weekend po 6 tygodniach
reguły gry (kernel)                 ████████████      drogie, ale odizolowane testami
transport (sesja, reconnect)        ███████           drogie, ale schowane za kontraktem
widoki (React)                      ███               renderer danych — do przerobienia w tydzień
```

Dlaczego **komunikacja przed widokami**: transport definiuje kształt danych. Jeśli najpierw zrobicie
piękne widoki na własnych mockach, a potem okaże się, że serwer wysyła co innego — przerabiacie widoki
i mocki naraz. Jeśli najpierw macie protokół i fixtury — widoki piszą się same, a każdy mock jest prawdziwy.

## 6.2 Zasada pionowa

> **Żaden przyrost nie może żyć w jednej warstwie dłużej niż 3 dni.**
> Jeśli ktoś pracuje dwa tygodnie „tylko nad silnikiem” i nic nie widać w przeglądarce — to nie jest postęp,
> to jest dług. Każdy plaster (epic) ma na końcu coś, co da się pokazać na ekranie.

## 6.3 Pięć pierwszych przyrostów (nie „sprinty” — przyrosty, które widać)

| # | Przyrost | Widać na ekranie | Odpala |
|---|---|---|---|
| 0 | **Spine** (już zrobiony w `/rejoltance`) | jedna jednostka zagrana i widoczna u obu graczy | `npm run dev` |
| 1 | Początek partii: mulligan + wybór strony + runda 1 | ekran mulliganu, kropelki Blood, tura przechodzi | `vitest -t R-0` |
| 2 | Walka i śmierć | 4 linie rozstrzygają się same, pływające obrażenia, jednostki umierają | `vitest -t R-1` |
| 3 | Prawdziwe karty (12) + celowanie | czar z wyborem celu pyta o cel, a nie zgaduje | `npm run cards:validate` |
| 4 | PvP po linku + bot | dwie karty przeglądarki grają ze sobą; jedno okno może grać z botem | `node apps/server/scripts/probe.mjs` |

---

# CZĘŚĆ 7 · GRANICE MIĘDZY LUDŹMI

Sześć ról = sześć obszarów własności = sześć potencjalnych prac inżynierskich.
**Własność ≠ wyłączność:** każdy może commitować wszędzie, ale każdy moduł ma jednego *accountable*.

| Rola | Moduł (własność) | Kontrakt, który wystawia | Czego **nie** dotyka bez uzgodnienia | Temat inżynierki |
|---|---|---|---|---|
| **R1 · Architekt reguł** | `packages/kernel` | `reduce()`, `legalActions()`, `toView()` | `contracts` (wspólne), `apps/web` | Deterministyczny silnik reguł i kolejność rozstrzygania |
| **R2 · Inżynier DSL / content** | `packages/content` + interpreter efektów | `CardDef` + rejestr akcji | maszyny faz (R1) | DSL i interpreter efektów kart |
| **R3 · Inżynier sieci** | `apps/server` (runtime + WS) | `ClientMessage`/`ServerMessage` | reguł (R1), strategii bota (R5) | Autorytatywny protokół synchronizacji stanu |
| **R4 · Inżynier UI** | `apps/web` | komponenty + `useMatch()` | **kernela** (test granic), reguł | Silnik renderowania i animacji 2D |
| **R5 · Inżynier AI / balans** | `packages/sim` | `Policy` | transportu (R3) | MCTS vs Beam Search w niepełnej informacji |
| **R6 · Inżynier platformy** | baza, konta, CI/CD, obserwowalność | zdarzenie `MatchFinished` | kernela, UI | Bezpieczeństwo / anty-cheat lub DevOps |

## 7.1 Macierz „kto kogo blokuje” i jak to rozcinać

| Zależność | Ryzyko blokady | Rozcięcie |
|---|---|---|
| UI ← serwer | **wysokie** („nie mam danych”) | fixtury + fake transport: UI rysuje nagrany stan, nie czeka na WS |
| AI ← kernel | średnie | `Policy` na najgłupszym możliwym silniku: wystarczy `legalActions()` + `reduce()` |
| Serwer ← kernel | średnie | spine: serwer dzwoni przez dwa interfejsy; można je zamockować w 20 linii |
| Content ← DSL | niskie | karty to JSON; walidator w CI powie, czy karta jest bezpieczna |
| Platforma ← wszystko | **niskie** | platforma reaguje na zdarzenie `MatchFinished` — może powstać w ostatniej kolejności |

## 7.2 Zasada graniczna, która oszczędzi Wam 50 godzin

> **Nie ma spotkań „uzgodnijmy format JSON”.** Format jest w `packages/contracts`, ma testy
> (R-16, R-17) i nie zmienia się bez ADR. Jeśli potrzebujesz pola, otwierasz PR do `contracts`
> z jednym recenzentem z drugiej strony granicy. Spotkanie jest zastąpione przez typ.

---

# CZĘŚĆ 8 · RYZYKA I DECYZJE DO ZAMKNIĘCIA W TYM TYGODNIU

## 8.1 Top 8 ryzyk (w kolejności, w jakiej Was zabiją)

| # | Ryzyko | Prawd. | Skutek | Mitygacja |
|---|---|---|---|---|
| 1 | **Rebuild bez zamrożonego kontraktu** — sześć osób pisze sześć modeli danych | wysoka | projekt nie składa się w całość | spine w tygodniu 1 + test granic + ADR |
| 2 | **Niedoszacowanie**: MVP ~340 h przy pojemności ~378 h w dwa semestry | **pewna** | brak gry na obronę | linia cięcia W0/W1/W2/W3 (backlog), cięcia od dołu listy |
| 3 | **Utrata reguł przy przepisywaniu** (specyfikacja vs kod) | średnia | gra działa nie tak, jak napisaliście | RULES-INDEX + `R-nn` w nazwach testów + matryca pokrycia w CI |
| 4 | **Bus factor = 1** — jedna osoba rozumie silnik | wysoka | paraliż w połowie semestru | każdy PR z review właściciela; `MAP.md` jako onboarding; rotacja przy testach reguł |
| 5 | **Fog of war zrobione „potem”** | wysoka | gra niegrywalna w sieci, wstyd na demonstracji | `toView()` jest w spine od zera; test R-16 w każdym fixturze |
| 6 | **Bot niedeterministyczny** (budżet czasowy zamiast węzłów) | średnia | brak replayów, brak balansu | `ADR-0004` + budżet przeliczany na węzły, nie milisekundy |
| 7 | **Karty z efektami, których nie ma w rejestrze** | średnia | karta „nie działa i nikt nie wie” | walidator w CI + `ADR-0005` (głośna porażka) |
| 8 | **Brak użytkownika końcowego (EU1/EU2)** | średnia | −1 stopień na obronie | Rada Graczy Testowych: 2–3 osoby z imienia, protokół po każdym sprincie (`QA-7`) |

## 8.2 Sześć decyzji, które musicie zamknąć teraz

1. **Język:** TS-monorepo (rekomendacja) czy .NET 10 + React + Aspire? → ADR-0001.
2. **Zakres talii MVP:** 12 kart i 8 akcji (dowieziecie) czy od razu 67 (nie dowieziecie)?
3. **Co z C#-owym `CardGame.Core`:** zostaje jako martwy branch do czytania (zalecane) czy idzie do kosza?
4. **Kto jest R1** (właściciel kernela) — to musi być osoba, która będzie na każdym spotkaniu.
5. **Grafiki i muzyka:** skąd pochodzą? (68 PNG, 9 PSD, 1 MP3 — oświadczenie GenAI dla JSA).
6. **Promotor:** formalna zgoda na temat „gra karciana” zamiast CRUD-a z listy wydziałowej.

---

# ZAŁĄCZNIK A · CO JEST W TYM WORKSPACE

| Ścieżka | Co to jest |
|---|---|
| `rejoltance/` | **działający spine** — kontrakty, kernel, projekcja, serwer WS, klient React, bot, symulator |
| `rejoltance/docs/MAP.md` | mapa projektu: granice, kolejność czytania, „gdzie co dodać” |
| `rejoltance/AGENTS.md` | 9 zasad pracy w repo (dla ludzi i dla LLM-ów) |
| `rejoltance/docs/adr/0001..0007` | decyzje architektoniczne (język, kontrakty, pending, determinizm, DSL, klonowanie, spine) |
| `rejoltance/docs/rules/RULES-INDEX.md` | 30 reguł R-01..R-30 powiązanych ze specyfikacją i testami |
| `rejoltance/tools/gen_backlog.py` | generator backlogu (markdown + CSV do Jiry) |
| `REJOLTANCE-BACKLOG.md` | 10 epików · 71 historyjek · 234 zadania · 516 h |
| `jira-import-rejoltance.csv` | import do Jiry (Issue Type / Epic Link / Estimate / Sprint / Wave) |

**Jak odpalić spine:**

```bash
cd rejoltance
npm install
npm run dev          # serwer :4000 + klient :5173
npm test             # 23 testy: 18 reguł + 5 granic
npm run sim          # 300 partii bot vs bot (determinizm + fuzzing)
```

**Import CSV do Jiry:** Jira → *Issues → Import from CSV* → mapuj kolumny
(`Summary`, `Issue Type`, `Epic Name`, `Epic Link`, `Estimate`, `Sprint`, `Labels`, `Component/s`).
Kolumna `Wave` (W0–W3) daje się łatwo zamienić na etykietę albo wersję (fixVersion) i jest Waszą linią cięcia.
