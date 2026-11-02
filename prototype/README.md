# prototype — prototyp JS (kanon zasad gry)

`revibance/` to grywalny prototyp (czysty JS, bez builda) — kopia repo `PanCoto/revibance`. Służy do:

1. **poznania zasad** — zagraj z botem: otwórz `revibance/index.html` przez dowolny serwer statyczny
   (`npx serve prototype/revibance`) albo wersję na GitHub Pages (workflow `prototype-pages.yml`);
2. **kanonu reguł** (ADR-0005) — zachowanie `engine.js` spisujemy jako reguły R‑nn;
3. **danych kart** — `cards.js` → `tools/content/extract_cards.py` → `cards.json`;
4. **referencji wizualnej** dla klienta React.

Nie rozwijamy tu nowego kodu. Zmiana danych kart: skill `rj-add-card`. Znane błędy: `docs/02-rules/ROZBIEZNOSCI.md`.
