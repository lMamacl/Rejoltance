# Jak pisać specyfikację (OpenSpec)

**Kiedy:** story ≥ 3 SP, każda zmiana reguły gry, każda zmiana kontraktu. Drobne zadania — plan w opisie PR wystarczy.
**Po co:** najpierw uzgadniamy *co* i *jak sprawdzimy*, dopiero potem piszemy kod. Agent AI pracuje według zaakceptowanego planu, a nie domysłów.

## Jak to działa

```text
openspec/
├─ specs/<obszar>/spec.md          żywa specyfikacja (stan obecny, reguły R-nn) — 9 obszarów
└─ changes/<zmiana>/               propozycja zmiany (w trakcie pracy)
   ├─ proposal.md                  po co, zakres, poza zakresem, klucz Jira
   ├─ specs/<obszar>/spec.md       DELTA: ADDED / MODIFIED / REMOVED Requirements
   ├─ design.md                    jak (moduły, kontrakty, ryzyka) — opcjonalnie
   └─ tasks.md                     lista zadań ≤ 4 h, każde z testem
```

Po zakończeniu `archive` wkleja deltę do `openspec/specs` i przenosi zmianę do `changes/archive/`.

## Krok po kroku (przykład: REJ-45, wybór kolejności)

1. Gałąź: `feature/REJ-45-choose-order`.
2. Propozycja — w swoim narzędziu AI:
   `/opsx:propose REJ-45 wybór kolejności po mulliganie i start rundy (R-04, R-10, R-11)`
   (Antigravity/Copilot: `/opsx-propose`, Codex: `$openspec-propose`). Nazwa zmiany: `rej-45-choose-order`.
3. **Przeczytaj i popraw** wygenerowane pliki. Sprawdź szczególnie:
   - czy każde wymaganie ma `#### Scenario:` z GIVEN / WHEN / THEN i liczbami z prototypu;
   - czy numer reguły zgadza się z `docs/02-rules/RULES-INDEX.md`;
   - czy `tasks.md` ma zadania ≤ 4 h z nazwami testów (`R04_…`).
4. `npx openspec validate rej-45-choose-order --strict` — musi przejść.
5. **Akceptacja:** commit propozycji, krótki PR albo pokazanie na daily — ktoś z zespołu (PO lub właściciel obszaru) mówi „OK”.
6. Implementacja: `/opsx:apply` (agent odhacza zadania) albo ręcznie według `tasks.md`.
7. Po merge do `develop`: `/opsx:archive` → delta trafia do `openspec/specs`; zaktualizuj status w `RULES-INDEX.md`.

## Jak wygląda delta

```markdown
## MODIFIED Requirements

### Requirement: R-04 Wybór kolejności

Po mulliganie każdy gracz SHALL zadeklarować, czy chce zaczynać. ...

#### Scenario: Te same wybory

- **GIVEN** obaj chcą być pierwsi
- **WHEN** obie odpowiedzi dotrą
- **THEN** rozpoczynający jest wybrany z seeda meczu
```

Zasady formatu (pilnuje `openspec validate --strict`, uruchamiane w CI):

- nagłówki `### Requirement:` i `#### Scenario:` oraz słowa **SHALL / MUST** — po angielsku, reszta po polsku;
- treść wymagania ≤ 500 znaków — przykłady przenieś do scenariuszy;
- co najmniej jeden scenariusz na wymaganie.

## Częste błędy

| Błąd | Poprawka |
|---|---|
| „Gra powinna działać szybko” | mierzalnie: „odpowiedź huba < 200 ms dla 2 graczy” albo poza zakresem |
| scenariusz bez liczb | weź liczby z prototypu (`engine.js`) |
| jedna zmiana na pół sprintu | podziel na 2–3 zmiany po jednym plastrze (konstytucja art. VII) |
| kod przed akceptacją | najpierw akceptacja — inaczej przeróbki |
