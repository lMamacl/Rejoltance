# 4.2 Katalog ról agentów i macierz wbudowanych umiejętności

> **Źródło prawdy:** repozytorium (`docs/04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md`) · **Kategoria dokumentacji:** Dokumentacja procesowa — katalog ról i umiejętności AI · **Etap SDD:** cały cykl SDD

Mamy **jedną rolę agenta** i **15 skilli**: 9 zespołowych `rj-*` i 6 skilli OpenSpec. Skill to zapisana procedura krok po kroku, którą wykonuje agent albo człowiek. Wcześniej było 10 ról i 13 skilli zespołu. Ograniczyliśmy je w [ADR-0014](../01-dokumentacja-systemowa/07-decyzje-adr/0014-odchudzenie-systemu-agentow.md), bo role nie dodawały nowych możliwości, a utrzymanie ich kopii dla kilku narzędzi kosztowało więcej, niż dawało.

---

## 1. Rola `rj-qa-verifier`

Niezależny recenzent: ma dostęp tylko do odczytu i może uruchamiać testy. Sprawdza testy reguł `R-nn`, zgodność z prototypem JS, wymagania niefunkcjonalne i bezpieczeństwo. Niczego nie poprawia, tylko zwraca listę niezgodności. Korzysta ze skilli `rj-pr-ready`, `rj-oracle-diff`, `rj-add-rule-test` i `rj-spec-guardian`.

Każdy inny rodzaj pracy (specyfikacja, silnik, karty, serwer, klient, dokumentacja) wykonuje główny agent w Twoim narzędziu, prowadzony konstytucją, regułami i skillami.

---

## 2. Skille zespołu (`rj-*`)

| Nazwa skilla | Etap SDD | Do czego służy |
|---|---|---|
| **`rj-start-feature`** | `Specify` / `Plan` | Sprawdza zadanie, powiązane reguły `R-nn` i rozbieżności `D-nn`, tworzy gałąź `typ/REJ-123-opis` od `develop`; dla zadań ≥ 3 SP otwiera zmianę OpenSpec. |
| **`rj-spec-guardian`** | `Specify` / `Verify` | Sprawdza spójność `openspec/specs/`, `03-indeks-regul-r-nn.md`, `04-rozbieznosci-prototypu.md` i `backlog.toml`. |
| **`rj-write-adr`** | `Plan` | Tworzy rekord decyzji `ADR-NNNN` według szablonu i aktualizuje rejestr. |
| **`rj-add-rule-test`** | `Implement` | Zamienia regułę `R-nn` w deterministyczny test `Rnn_<zachowanie>`. |
| **`rj-add-card`** | `Implement` | Zmiana kart: dociągnięcie prototypu, regeneracja katalogu, sprawdzenie słownika DSL. |
| **`rj-oracle-diff`** | `Implement` / `Verify` | Porównuje rozstrzygnięcie reguły w silniku z prototypem `prototype/game/engine.js` (ADR-0013). |
| **`rj-pr-ready`** | `Verify` | Lista kontrolna przed otwarciem PR: build, testy, specyfikacje, walidatory, szkic opisu. |
| **`rj-backlog-to-jira`** | `Tasks` | Zmiany w `backlog.toml`, limit podzadań `≤ 4 h` (EU4), generowanie `BACKLOG.md` i plików CSV do Jiry. |
| **`rj-sync-confluence`** | `Release` | Walidacja drzewa `docs/` i eksport stron do Confluence PB. |

Raporty z Daily Scrum i Sprint Review piszemy według szablonów w [`03-scrum-i-spotkania`](../03-dokumentacja-procesowa/03-scrum-i-spotkania/README.md). Osobne skille do nich wrócą, gdy będzie działać Jira.

---

## 3. Skille OpenSpec (`openspec-*`)

| Nazwa skilla | Komenda (Claude Code) | Do czego służy |
|---|---|---|
| `openspec-explore` | `/opsx:explore` | Badasz problem i warianty rozwiązania przed formalną propozycją. |
| `openspec-propose` | `/opsx:propose` | Tworzysz propozycję zmiany w `openspec/changes/<id>/`. |
| `openspec-update-change` | `/opsx:update` | Aktualizujesz propozycję po recenzji. |
| `openspec-apply-change` | `/opsx:apply` | Realizujesz zadania z zaakceptowanego `tasks.md`. |
| `openspec-sync-specs` | `/opsx:sync` | Przenosisz delty wymagań do `openspec/specs/`. |
| `openspec-archive-change` | `/opsx:archive` | Archiwizujesz wdrożoną zmianę po merge'u. |
