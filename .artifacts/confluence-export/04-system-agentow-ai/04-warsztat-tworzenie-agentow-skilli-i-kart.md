<!-- CONFLUENCE 1:1 EXPORT | Source: docs/04-system-agentow-ai/04-warsztat-tworzenie-agentow-skilli-i-kart.md @ 10829d3 (2026-11-02) -->
# 4.4 Warsztat inżynierski: Jak samodzielnie budować agentów, umiejętności, dokumentację, ADR i karty

> **Źródło prawdy:** repozytorium (`docs/04-system-agentow-ai/04-warsztat-tworzenie-agentow-skilli-i-kart.md`) · **Kategoria dokumentacji:** Dokumentacja procesowa — Podręcznik warsztatowy zespołu i AI · **Etap SDD:** Cały cykl SDD

Ten dokument to praktyczny podręcznik („warsztat”) dla każdego członka zespołu. Wyjaśnia krok po kroku, **jak samodzielnie rozbudowywać system agentowy (`.agents/`)**, **jak tworzyć i synchronizować dokumentację z Confluence**, **jak rejestrować decyzje architektoniczne (ADR)** oraz **jak dodawać nowe karty do gry**.

---

## Warsztat 1: Jak samodzielnie zbudować nową rolę agenta AI?

Nową rolę agenta (`.agents/agents/rj-<rola>.md`) tworzymy wtedy, gdy pojawia się **nowy obszar odpowiedzialności wymagający odrębnego zestawu uprawnień narzędziowych** (np. dedykowany tester wydajności lub projektant balansu talii). Jeśli potrzebujesz jedynie nowej procedury krok po kroku dla istniejących agentów — przejdź do **Warsztatu 2 (Tworzenie skilla)**.

### Krok 1: Utwórz plik definicji roli w `.agents/agents/rj-<nazwa>.md`

Plik musi zaczynać się od nagłówka YAML (*frontmatter*) zgodnego ze schematem walidowanym przez `tools/agents/sync_agents.py`:

```markdown
---
name: rj-ui-tester
category: verification
description: "Weryfikacja (QA/UX): uruchamia testy komponentowe oraz przeglądarkowe E2E Playwright dla klienta webowego i weryfikuje zgodność z wymaganiami dostępności NFR-20..NFR-22. Rola wyłącznie do odczytu."
tools:
  - view_file
  - list_dir
  - find_by_name
  - grep_search
  - run_command
skills:
  - rj-pr-ready
mainAgent: false
subagent: true
model: inherit
commandExecutionPolicy: sandbox
---

# Rola: Inżynier Testów Interfejsu Użytkownika (`rj-ui-tester`)

## 1. Misja i odpowiedzialność w procesie SDD
...
## 2. Wbudowane umiejętności (Skille)
...
## 3. Kontekst wejściowy (Co należy przeczytać na starcie)
...
## 4. Standardowa procedura działania (Krok po kroku)
...
## 5. Ograniczenia i zakazy (Czego nie wolno robić)
...
## 6. Format raportu wyjściowego
```

### Krok 2: Dobierz minimalny zestaw narzędzi (`tools`) oraz wbudowane skille (`skills`)

Skrypt `sync_agents.py` automatycznie tłumaczy identyfikatory narzędzi na format wymagany przez poszczególne środowiska IDE:

| Identyfikator w `.agents/agents/` | Odpowiednik w Claude Code | Kiedy przyznać to narzędzie agentowi? |
|---|---|---|
| `view_file`, `list_dir`, `find_by_name`, `grep_search` | `Read`, `Glob`, `Grep` | Zawsze — pozwala agentowi czytać kod i dokumentację projektu. |
| `run_command` | `Bash` | Gdy agent musi uruchamiać komendy budowania, testy lub skrypty w `tools/`. |
| `write_to_file`, `replace_file_content`, `multi_replace_file_content` | `Write`, `Edit` | **Wyłącznie dla ról implementacyjnych i analitycznych.** Role z grupy `verification` (`rj-reviewer`, `rj-security-reviewer`, `rj-test-verifier`) nie mogą posiadać narzędzi zapisu! |
| `search_web`, `read_url_content` | `WebSearch`, `WebFetch` | Gdy agent potrzebuje sprawdzać zewnętrzną dokumentację bibliotek (`rj-researcher`, `rj-architect`). |
| `invoke_subagent` | `Task` | Wyłącznie dla głównego koordynatora (`rj-orchestrator`). |

### Krok 3: Wygeneruj adaptery IDE i zwaliduj konfigurację

```bash
python tools/agents/sync_agents.py
python tools/agents/sync_agents.py --check
```

Skrypt utworzy odpowiednie pliki w `.claude/agents/` oraz `.github/agents/` i sprawdzi poprawność wszystkich powiązań. Na koniec dopisz nowego agenta do tabeli w `AGENTS.md` oraz `02-katalog-rol-i-wbudowanych-skilli.md`.

---

## Warsztat 2: Jak samodzielnie zbudować nowy skill dla agentów i ludzi?

**Skill** to powtarzalna procedura inżynierska zapisana w pliku `.agents/skills/rj-<czasownik>-<obiekt>/SKILL.md`. Dobry skill jest napisany tak jasno, że może go wykonać zarówno agent AI, jak i nowy student w zespole.

### Krok 1: Utwórz katalog i plik `SKILL.md`

Nazwa katalogu musi zaczynać się od prefiksu `rj-` i być identyczna z polem `name` w nagłówku pliku:

```markdown
---
name: rj-review-ui
description: "Reviews React components in src/web against UI architecture rules (renders MatchView only, highlights moves from legalActions, meets WCAG 2.1 AA contrast and keyboard navigation). Use before opening a PR that modifies src/web."
---

# Skill: Przegląd jakości i dostępności komponentów UI (`rj-review-ui`)

## 1. Cel i zastosowanie
...
## 2. Powiązani agenci i etap SDD
...
## 3. Wymagane dane wejściowe
...
## 4. Procedura wykonania (Krok po kroku)
1. ...
2. ...
## 5. Weryfikacja i kryteria poprawności
...
## 6. Ograniczenia bezpieczeństwa (Czego nie wolno)
```

> **Wskazówka techniczna:** Pole `description` w nagłówku YAML piszemy po angielsku (maks. 1024 znaki), jasno określając **CO** robi skill i **KIEDY** należy go użyć — to na podstawie tego pola silniki AI automatycznie dobierają skill do zadania. Samą treść instrukcji piszemy po polsku.

### Krok 2: Przypisz skill do odpowiednich agentów i uruchom synchronizację

1. Dopisz nazwę skilla do listy `skills:` w wybranych plikach `.agents/agents/rj-*.md`.
2. Uruchom synchronizację:

   ```bash
   python tools/agents/sync_agents.py
   python tools/agents/sync_agents.py --check
   ```

   Skrypt automatycznie skopiuje skill do `.claude/skills/`, `.github/skills/`, `.gemini/skills/` oraz wygeneruje komendę ukośnikową `/rj-review-ui` w `.agents/workflows/`.

---

## Warsztat 3: Jak tworzyć dokumentację i przenosić ją do Confluence PB?

1. **Wybierz właściwą sekcję w `docs/`** zgodnie z architekturą 1:1 (`00-przewodnik-i-setup`, `01-dokumentacja-systemowa`, `02-dokumentacja-uzytkownika`, `03-dokumentacja-procesowa`, `04-system-agentow-ai`, `05-szablony`).
2. **Skorzystaj z odpowiedniego szablonu** z katalogu [`docs/05-szablony/`](../05-szablony/README.md) (np. `szablon-karta-modulu.md` przy dokumentowaniu swojego modułu na zaliczenie efektu **EU5** lub `szablon-qa-raport-i-checklista.md` na zaliczenie **EU6**).
3. **Dodaj ustandaryzowany blok metadanych** pod tytułem dokumentu:

   ```markdown
   > **Źródło prawdy:** repozytorium (`docs/...`) · **Kategoria AltexSoft:** ... · **Etap SDD:** ...
   ```

4. **Zwaliduj formatowanie i wygeneruj paczkę do Confluence:**

   ```bash
   npm run check
   python tools/confluence/sync_confluence.py
   ```

   Gotowe do wklejenia (lub automatycznej publikacji przez REST API) strony znajdziesz w katalogu `.artifacts/confluence-export/`.

---

## Warsztat 4: Jak napisać i zatwierdzić decyzję architektoniczną (ADR)?

Decyzję ADR tworzymy zawsze, gdy wybieramy technologię, zmieniamy jeden z 5 zamrożonych kontraktów lub ustalamy regułę procesową, o którą ktoś może zapytać za miesiąc (możesz użyć skilla `/rj-write-adr`).

1. Sprawdź najwyższy numer w `docs/01-dokumentacja-systemowa/07-decyzje-adr/` i utwórz nowy plik `NNNN-krotki-tytul.md` na bazie wzorca [`0000-szablon.md`](../01-dokumentacja-systemowa/07-decyzje-adr/0000-szablon.md).
2. Ustaw początkowy status na `proposed`.
3. Opisz **Kontekst i problem**, porównaj minimum **2–3 opcje w tabeli** (Zalety, Wady, Koszt/Ryzyko) i sformułuj decyzję w postaci zdania **Y-statement**:
   > *„W kontekście **X**, mierząc się z **Y**, wybieramy **Z** zamiast **A**, aby osiągnąć **B**, akceptując **C**.”*
4. Dopisz nowy dokument do tabeli w `07-decyzje-adr/README.md` i otwórz Pull Request. Po uzyskaniu akceptacji od 2 członków zespołu zmień status na `accepted`.

---

## Warsztat 5: Jak dodać lub zmodyfikować kartę w grze?

Karty w **RE:JOLTANCE** są czystymi danymi generowanymi z kanonicznego prototypu JS (`prototype/revibance/cards.js`) do pliku `src/Rejoltance.Content/Data/cards.json` (możesz użyć skilla `/rj-add-card`).

### Wariant A: Karta wykorzystuje istniejące słowa kluczowe, wyzwalacze i akcje DSL

1. Otwórz plik `prototype/revibance/cards.js` i dodaj lub edytuj wpis w tablicy `CARDS`:

   ```javascript
   {
     "Id": 70,
     "Name": "Ember Hound",
     "Type": "Unit",
     "Subtypes": ["Animal"],
     "Cost": 2,
     "Attack": 2,
     "Health": 2,
     "Keywords": ["BurnSource"],
     "Description": "Applies Burning to units it damages.",
     "Effects": []
   }
   ```

2. Uruchom skrypt ekstrakcji danych:

   ```bash
   python tools/content/extract_cards.py
   ```

3. Uruchom testy walidatora katalogu kart:

   ```bash
   dotnet test tests/Rejoltance.Kernel.Tests --filter ContentTests
   ```

   *(Jeśli dodałeś nową kartę ponad obecne 69 kart kolekcjonerskich + 9 tokenów, zaktualizuj oczekiwaną liczbę kart w teście `Catalog_contains_all_prototype_cards`).*

### Wariant B: Karta wymaga nowego słowa kluczowego, wyzwalacza lub akcji w DSL

Jeśli karta wprowadza mechanikę nieobecną w klasie `src/Rejoltance.Content/Vocabulary.cs`:

1. Najpierw utwórz specyfikację reguły `R-nn` w `openspec/specs/` ([Przewodnik OpenSpec](03-jak-pisac-specyfikacje-openspec.md)).
2. Dodaj nowe słowo do `Vocabulary.cs`, zaimplementuj jego obsługę w `Rejoltance.Kernel` i napisz test jednostkowy `Rnn_...`.
3. Dopiero w ostatnim kroku dodaj kartę i wygeneruj `cards.json`.
