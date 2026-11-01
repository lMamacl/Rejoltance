# Rejoltance.Content — karty jako dane

**Po co:** katalog kart i talii startowych (78 kart: 69 kolekcjonerskich + 9 tokenów, 5 talii) z walidacją DSL.

**Publiczne API:** `ICardCatalog` / `CardCatalog.LoadEmbedded()`, `CardDefinition`, `ContentValidator`, `Vocabulary`, `CardRules`.

**Niezmienniki:**

- `Data/cards.json` i `decks.json` są **generowane** z `prototype/revibance/cards.js` (`python tools/content/extract_cards.py`);
- każde słowo DSL musi być w `Vocabulary` — inaczej `ContentValidationException` przy starcie (fail loud);
- talia: 30 kart, ≤ 3 kopie, bez tokenów (id ≥ 900).

**Czego tu NIE ma:** wykonywania efektów (to Kernel), bazy danych.

**Jak testować:** `dotnet test tests/Rejoltance.Kernel.Tests --filter ContentTests`.

**Właściciel:** epik E2 (do przydzielenia).
