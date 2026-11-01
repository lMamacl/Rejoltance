# Jak pracujemy — od zadania w Jirze do merge

Jedna strona, którą każdy przechodzi przy każdym zadaniu. Zasady w skrócie: klucz Jira wszędzie, test przed kodem, PR do `develop`, człowiek decyduje.

## 1. Cykl życia zadania

```text
Jira: To Do ──► In Progress ──────────────────────────────► Resolved ──► Closed
         │            │                                         ▲
         │   gałąź feature/REJ-123-opis                        │ merge PR + Log Work
         │            │                                         │
         │   (≥3 SP) /opsx:propose → akceptacja → /opsx:apply  │
         │            │                                         │
         │   test Rnn_… → kod → rj-pr-ready → PR do develop ──►┘ review + zielone CI
```

| Krok | Co robisz | Narzędzie |
|---|---|---|
| 1 | Bierzesz zadanie na planningu, potwierdzasz szacunek (≤ 4 h na task) | Jira |
| 2 | Status *In Progress*, zaczynasz logować czas (*Log Work*) | Jira |
| 3 | Tworzysz gałąź z `develop` | `git switch develop && git pull && git switch -c feature/REJ-123-opis` albo skill `rj-start-feature` |
| 4 | Story ≥ 3 SP, reguła gry lub kontrakt → zmiana OpenSpec i **akceptacja** przed kodem | [`jak-pisac-spec.md`](jak-pisac-spec.md) |
| 5 | Test, który opisuje zachowanie (reguła gry → `Rnn_…`), potem kod | `dotnet test`, `npm test` |
| 6 | Commity `REJ-123: add …` (po angielsku, tryb rozkazujący) | git |
| 7 | Kontrola przed PR | skill `rj-pr-ready` albo komendy z [`sciaga.md`](sciaga.md) |
| 8 | `git push -u origin feature/REJ-123-opis`, PR do `develop` z szablonu | GitHub |
| 9 | Recenzja ≥ 1 osoby, zielone CI, squash merge, usunięcie gałęzi | GitHub |
| 10 | *Resolved* w Jirze, czas zalogowany, strona modułu w Confluence zaktualizowana | Jira, Confluence |

## 2. Gałęzie

| Gałąź | Do czego | Zasady |
|---|---|---|
| `main` | stan po sprincie (demo, wdrożenie) | tylko PR `develop → main` na koniec sprintu + tag `sprint-N` |
| `develop` | integracja sprintu | tylko przez PR; chroniona |
| `feature/REJ-123-opis` | nowa funkcja | od `develop`, krótko żyjąca (≤ 3 dni bez integracji — konstytucja art. VII) |
| `fix/…`, `docs/…`, `chore/…`, `spike/…` | poprawka, dokumentacja, narzędzia, badanie ≤ 2 h | jak wyżej |

Nazwa musi pasować do `^(feature|fix|docs|chore|spike)/REJ-[0-9]+-[a-z0-9-]+$` — CI odrzuci inną.

## 3. Pull Request i review

- Tytuł `REJ-123: …`, opis z szablonu (Jira, reguły R‑nn, jak przetestowano, zrzut ekranu dla UI).
- Recenzent sprawdza: kryteria akceptacji, testy, granice modułów (`.agents/rules/30-granice-architektury.md`), czytelność.
- **Kontrakt** (`src/Rejoltance.Contracts` lub `src/web/src/contracts`) → recenzent z drugiej strony (backend ↔ frontend) i ADR.
- Recenzja to rozmowa, nie egzamin: komentarz = pytanie albo konkretna propozycja. Autor odpowiada na każdy komentarz.
- Merge robi autor po akceptacji i zielonym CI (*Squash and merge*).

## 4. Koniec sprintu

1. PO otwiera PR `develop → main`, zespół robi szybki przegląd.
2. Po merge: tag `git tag sprint-1 && git push origin sprint-1` — mirror wysyła go do Bitbucket PB.
3. Review z graczami testowymi, retro, Burndown — skill `rj-sprint-report`, szablon `docs/06-scrum/szablon-review-retro.md`.

## 5. Praca z agentem AI

Agent (Claude Code, Antigravity, Codex, Copilot, Gemini) to pomocnik, a **odpowiedzialność za kod jest Twoja** — na review i na ocenie.

| Dobrze | Źle |
|---|---|
| „Zrób REJ-45 według `openspec/changes/rej-45-…/tasks.md`, zacznij od testu R-33” | „Zrób walkę” |
| Każesz agentowi uruchomić testy i pokazać wynik | Wierzysz w „powinno działać” |
| Czytasz diff przed commitem | Commitujesz wszystko, co wygenerował |
| Używasz ról: `rj-reviewer` przed PR, `rj-test-verifier` przy regułach | Prosisz agenta, żeby zrecenzował sam siebie i zatwierdził |
| Oznaczasz w PR, że pracował agent | Ukrywasz to |

Agent ma zakaz (konstytucja, art. X): merge, push do `main`/`develop`, czytanie `.env`, zmiana konstytucji/ADR/kontraktów bez Twojej zgody.
Narzędzia czytają te same zasady: `AGENTS.md` + `.agents/` — szczegóły w [`jak-dodac-skill.md`](jak-dodac-skill.md) i [`jak-dodac-agenta.md`](jak-dodac-agenta.md).

Czat bez dostępu do repo (np. DeepSeek, ChatGPT w przeglądarce)? Wklej 3 pliki: `docs/03-architecture/MAP.md`, README modułu, `AGENTS.md`.

## 6. Mirror Bitbucket

Kod żyje na GitHubie, a kopia `main`, `develop` i tagów `sprint-*` trafia automatycznie do Bitbucket PB (ADR-0002).
Konfiguracja (raz, admin repo GitHub):

1. Prowadzący zakłada repo w Bitbucket PB i daje zespołowi uprawnienia.
2. W Bitbucket: *Profil → Manage account → HTTP access tokens* → token z uprawnieniem *Repository write*.
3. GitHub → *Settings → Secrets and variables → Actions*:
   - sekret `BITBUCKET_TOKEN` = token;
   - zmienna `BITBUCKET_REPO_URL` = `https://devtools.wi.pb.edu.pl/bitbucket/scm/<PROJEKT>/<repo>.git`;
   - zmienna `BITBUCKET_USER` = właściciel tokenu (np. `wi00000`).
4. *Actions → Mirror to Bitbucket PB → Run workflow* — sprawdź, że gałęzie pojawiły się w Bitbucket.

Bez tych ustawień workflow jest pomijany i nie psuje CI.

## 7. Definition of Done (skrót)

Gałąź i commity z kluczem · CI zielone · testy (reguły: `Rnn_…`) · PR zaakceptowany przez ≥ 1 osobę · README modułu i Confluence aktualne ·
czas zalogowany · pokazane na dev i zgodne z kryteriami akceptacji. Pełna wersja: `docs/01-dip/DIP.md` §8.
