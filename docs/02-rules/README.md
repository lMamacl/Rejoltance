# 02-rules — reguły gry

| Plik | Co |
|---|---|
| [`RULES-INDEX.md`](RULES-INDEX.md) | lista reguł R‑nn → źródło w prototypie → test |
| [`ROZBIEZNOSCI.md`](ROZBIEZNOSCI.md) | błędy prototypu i różnice ze starą specyfikacją — do decyzji |
| [`SPECYFIKACJA.md`](SPECYFIKACJA.md) | zasady gry dla ludzi (od tego zacznij) |

Kanon: zachowanie `prototype/revibance/engine.js` (v11). Testowalne wymagania ze scenariuszami GIVEN/WHEN/THEN:
`openspec/specs/{match-setup, round-flow, playing-cards, combat, keywords, death-and-removal, card-effects, match-end, server-authority}/spec.md`
(`npm run spec:validate`). Zmiana reguły = zmiana OpenSpec (`/opsx:propose`) + test `Rnn_…` + wiersz w `RULES-INDEX.md`.
