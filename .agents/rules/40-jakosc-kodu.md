---
trigger: model_decision
description: "Standard jakości kodu i Definition of Done dla zmian w C# i TypeScript."
---

# Jakość kodu i Definition of Done

## Pisząc kod

- Najmniejsza spójna zmiana, czytelna dla studenta 2. roku. Nazwy opisowe, bez skrótów z prototypu (`G`, `p`, `tg`).
- Sprawdź: puste wejście, null, granice (0, 8 kart, 10 Blood), pełna ręka, pusta talia, równoczesna śmierć.
- Testy opisują zachowanie, nie implementację. Jeden test = jedna reguła/scenariusz.
- Kolejność weryfikacji: `git diff` → build → testy modułu → `dotnet test` całości → `npm test`/`lint`/`typecheck` gdy dotknięto `src/web`.

## Definition of Done (PR)

- [ ] gałąź i tytuł z kluczem Jira, opis wg szablonu PR;
- [ ] testy dodane/zmienione, CI zielone (bez wyłączania testów);
- [ ] reguły R‑nn i `RULES-INDEX.md` zaktualizowane, jeśli zmieniła się gra;
- [ ] dokumentacja modułu (`README.md` w folderze) aktualna;
- [ ] ≥ 1 recenzja człowieka; agent nie zatwierdza własnego kodu.
