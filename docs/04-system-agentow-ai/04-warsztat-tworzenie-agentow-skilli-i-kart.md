# 4.4 Warsztat inżynierski: Jak samodzielnie budować agentów, umiejętności, dokumentację, ADR i karty

> **Źródło prawdy:** repozytorium (`docs/04-system-agentow-ai/04-warsztat-tworzenie-agentow-skilli-i-kart.md`) · **Kategoria dokumentacji:** Dokumentacja procesowa — podręcznik warsztatowy zespołu i AI · **Etap SDD:** cały cykl SDD

To praktyczny warsztat dla każdej osoby w zespole. Pokazuje krok po kroku, jak samodzielnie rozbudować system agentowy (`.agents/`), jak pisać dokumentację i przenosić ją do Confluence, jak zapisać decyzję architektoniczną (ADR, Architecture Decision Record) i jak dodać nową kartę do gry.

---

## Warsztat 1: Jak samodzielnie zbudować nową rolę agenta AI?

Nową rolę agenta (`.agents/agents/rj-<rola>.md`) tworzymy wtedy, gdy pojawia się **nowy obszar odpowiedzialności, który wymaga innego zestawu narzędzi** (np. osobny tester wydajności albo projektant balansu talii). Jeśli potrzebujesz tylko nowej procedury krok po kroku dla istniejących agentów, przejdź do **Warsztatu 2 (tworzenie skilla)**.

### Krok 1: Utwórz plik definicji roli w `.agents/agents/rj-<nazwa>.md`

Plik zaczyna się od nagłówka YAML (*frontmatter*). Jego schemat sprawdza skrypt `tools/agents/sync_agents.py`:

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

> Przykład używa starszych identyfikatorów narzędzi Antigravity (`view_file`, `run_command` itd.) i kategorii `verification`. Skrypt nadal je akceptuje. Obecne role w `.agents/agents/` używają jednak identyfikatorów logicznych (`read`, `edit`, `search`, `execute`, `todo`, `agent`) i kategorii `A-Orkiestracja-i-SDD`, `B-Inzynieria-Domeny`, `C-Inzynieria-Aplikacji` albo `D-Jakosc-i-Dokumentacja`. W nowej roli stosuj ten sam zapis co w istniejących plikach.

### Krok 2: Dobierz minimalny zestaw narzędzi (`tools`) i wbudowane skille (`skills`)

Skrypt `sync_agents.py` sam tłumaczy identyfikatory narzędzi na format każdego IDE:

| Identyfikator w `.agents/agents/` | Odpowiednik w Claude Code | Kiedy dać to narzędzie agentowi? |
|---|---|---|
| `read`, `search` (starsze: `view_file`, `list_dir`, `find_by_name`, `grep_search`) | `Read`, `Glob`, `Grep` | Zawsze. Agent może wtedy czytać kod i dokumentację projektu. |
| `execute` (starsze: `run_command`) | `Bash` | Gdy agent musi uruchamiać budowanie, testy albo skrypty z `tools/`. |
| `edit` (starsze: `write_to_file`, `replace_file_content`, `multi_replace_file_content`) | `Write`, `Edit` | **Tylko dla ról, które tworzą kod, specyfikacje albo dokumentację.** Rola weryfikująca `rj-qa-verifier` nie może mieć narzędzi zapisu, żeby jej audyt był niezależny. |
| `search_web`, `read_url_content` | `WebSearch`, `WebFetch` | Gdy agent musi sprawdzać zewnętrzną dokumentację bibliotek. Obecnie żadna z dziesięciu ról nie ma tych narzędzi. |
| `agent` (starsze: `invoke_subagent`) | `Task` | Tylko dla głównego koordynatora (`rj-orchestrator`). |
| `todo` | — | Lista zadań agenta. Mają ją wszystkie obecne role. |

### Krok 3: Wygeneruj adaptery IDE i zwaliduj konfigurację

```bash
python tools/agents/sync_agents.py
python tools/agents/sync_agents.py --check
```

Skrypt utworzy pliki w `.claude/agents/` i `.github/agents/` i sprawdzi wszystkie powiązania. Na koniec dopisz nowego agenta do tabeli w `AGENTS.md` i w `02-katalog-rol-i-wbudowanych-skilli.md`.

---

## Warsztat 2: Jak samodzielnie zbudować nowy skill dla agentów i ludzi?

**Skill** to powtarzalna procedura zapisana w pliku `.agents/skills/rj-<czasownik>-<obiekt>/SKILL.md`. Dobry skill jest napisany tak jasno, że wykona go i agent AI, i nowa osoba w zespole.

### Krok 1: Utwórz katalog i plik `SKILL.md`

Nazwa katalogu zaczyna się od prefiksu `rj-` i jest taka sama jak pole `name` w nagłówku pliku:

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

> **Wskazówka:** pole `description` w nagłówku YAML piszemy po angielsku (maks. 1024 znaki). Napisz w nim jasno, **co** robi skill i **kiedy** go użyć. Na tej podstawie narzędzia AI same dobierają skill do zadania. Treść instrukcji piszemy po polsku.

### Krok 2: Przypisz skill do odpowiednich agentów i uruchom synchronizację

1. Dopisz nazwę skilla do listy `skills:` w wybranych plikach `.agents/agents/rj-*.md`.
2. Uruchom synchronizację:

   ```bash
   python tools/agents/sync_agents.py
   python tools/agents/sync_agents.py --check
   ```

   Skrypt skopiuje skill do `.claude/skills/`, `.github/skills/` i `.gemini/skills/` oraz wygeneruje komendę ukośnikową `/rj-review-ui` w `.agents/workflows/`.

---

## Warsztat 3: Jak tworzyć dokumentację i przenosić ją do Confluence PB?

1. **Wybierz sekcję w `docs/`** zgodnie z układem 1:1 z Confluence (`00-przewodnik-i-setup`, `01-dokumentacja-systemowa`, `02-dokumentacja-uzytkownika`, `03-dokumentacja-procesowa`, `04-system-agentow-ai`, `05-szablony`).
2. **Użyj szablonu** z katalogu [`docs/05-szablony/`](../05-szablony/README.md), np. `szablon-karta-modulu.md`, gdy opisujesz swój moduł na zaliczenie efektu **EU5**, albo `szablon-qa-raport-i-checklista.md` na zaliczenie **EU6**.
3. **Dodaj blok metadanych** pod tytułem dokumentu:

   ```markdown
   > **Źródło prawdy:** repozytorium (`docs/...`) · **Kategoria AltexSoft:** ... · **Etap SDD:** ...
   ```

4. **Sprawdź formatowanie i strukturę dokumentacji:**

   ```bash
   npm run check
   python tools/confluence/sync_confluence.py
   ```

   Bez flag skrypt tylko sprawdza drzewo `docs/` i linki (tak samo jak `--check`). Paczkę stron gotowych do wklejenia wygenerujesz flagą `--export`. Znajdziesz ją w katalogu `.artifacts/confluence-export/`.

5. **Opublikuj strony przez REST API (opcjonalnie).** Token PAT (Personal Access Token) z Confluence PB ustaw w zmiennej środowiskowej `CONFLUENCE_PERSONAL_TOKEN` albo w lokalnym pliku `.env` (git go ignoruje). Skrypt sam odczyta zmienną:

   ```bash
   python tools/confluence/sync_confluence.py --publish --dry-run
   python tools/confluence/sync_confluence.py --publish --url https://devtools.wi.pb.edu.pl/confluence
   ```

   Nie podawaj tokenu ani hasła w parametrach `--token` czy `--password`. Komenda z tokenem trafia do historii terminala i logów, a stamtąd łatwo do innych osób.

---

## Warsztat 4: Jak napisać i zatwierdzić decyzję architektoniczną (ADR)?

Decyzję ADR piszemy zawsze, gdy wybieramy technologię, zmieniamy jeden z 5 zamrożonych kontraktów albo ustalamy regułę procesu, o którą ktoś może zapytać za miesiąc. Możesz użyć skilla `/rj-write-adr`.

1. Sprawdź najwyższy numer w `docs/01-dokumentacja-systemowa/07-decyzje-adr/` i utwórz nowy plik `NNNN-krotki-tytul.md` na bazie wzorca [`0000-szablon.md`](../01-dokumentacja-systemowa/07-decyzje-adr/0000-szablon.md).
2. Ustaw początkowy status na `proposed`.
3. Opisz **kontekst i problem**, porównaj w tabeli co najmniej **2–3 opcje** (zalety, wady, koszt/ryzyko) i zapisz decyzję jako zdanie **Y-statement**:
   > *„W kontekście **X**, mierząc się z **Y**, wybieramy **Z** zamiast **A**, aby osiągnąć **B**, akceptując **C**.”*
4. Dopisz nowy dokument do tabeli w `07-decyzje-adr/README.md` i otwórz pull request. Gdy 2 osoby z zespołu zaakceptują decyzję, zmień status na `accepted`.

---

## Warsztat 5: Jak dodać lub zmodyfikować kartę w grze?

Karty w **RE:JOLTANCE** to same dane. Generujemy je z kanonicznego prototypu JS (`prototype/revibance/cards.js`) do pliku `src/Rejoltance.Content/Data/cards.json`. Możesz użyć skilla `/rj-add-card`.

### Wariant A: karta używa istniejących słów kluczowych, wyzwalaczy i akcji DSL

DSL to nasz język opisu efektów kart.

1. Otwórz plik `prototype/revibance/cards.js` i dodaj albo zmień wpis w tablicy `CARDS`:

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

3. Uruchom testy walidatora katalogu kart. Na razie są w `Rejoltance.Kernel.Tests`, bo projekt `Rejoltance.Cards.Tests` jest dopiero planowany:

   ```bash
   dotnet test tests/Rejoltance.Kernel.Tests --filter ContentTests
   ```

   Jeśli dodajesz kartę ponad obecne 69 kart kolekcjonerskich i 9 tokenów, zmień oczekiwaną liczbę kart w teście `Catalog_contains_all_prototype_cards`.

### Wariant B: karta wymaga nowego słowa kluczowego, wyzwalacza albo akcji w DSL

Gdy karta wprowadza mechanikę, której nie ma w klasie `src/Rejoltance.Content/Vocabulary.cs`:

1. Najpierw napisz specyfikację reguły `R-nn` w `openspec/specs/` ([przewodnik OpenSpec](03-jak-pisac-specyfikacje-openspec.md)).
2. Dodaj nowe słowo do `Vocabulary.cs`, zaimplementuj jego obsługę w `Rejoltance.Kernel` i napisz test jednostkowy `Rnn_...`.
3. Dopiero na końcu dodaj kartę i wygeneruj `cards.json`.
