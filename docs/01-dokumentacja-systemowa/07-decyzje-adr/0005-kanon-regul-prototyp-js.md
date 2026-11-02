# ADR-0005: Kanonem zasad jest prototyp JS v11

- **Status:** zatwierdzona (2026-10-27)
- **Data:** 2026-10-27
- **Powiązane:** [`02-specyfikacja-regul-gry.md`](../02-specyfikacja-regul-gry.md), [`03-indeks-regul-r-nn.md`](../03-indeks-regul-r-nn.md), [`04-rozbieznosci-prototypu.md`](../04-rozbieznosci-prototypu.md), `openspec/specs/*`, `tools/content/extract_cards.py`

## Kontekst i problem

Mamy trzy źródła zasad i każde mówi coś innego: `RE_JOLTANCE.md` (spisana specyfikacja), stary kod C# i prototyp JS (JavaScript) v11.
Prototyp jest najnowszy, grywalny i ma karty 61–69. [V]
Zespół zna grę z prototypu. To prototyp jest wdrożony i to jego pokazujemy.

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| `RE_JOLTANCE.md` | spójny tekst | starszy niż prototyp; brakuje nowych mechanik | rozjazd z tym, w co gra zespół |
| **Prototyp JS v11** | najnowszy, grywalny, ma wszystkie karty | zawiera błędy | błędy trzeba jawnie oddzielić |

## Decyzja

W kontekście trzech niespójnych źródeł, wybieramy **zachowanie `prototype/revibance/engine.js` (v11) oraz dane `cards.js` jako kanon**
zamiast starej specyfikacji, aby gra była tą, którą zespół zna i testuje, akceptując, że każdy błąd prototypu musi być jawnie opisany
w [`04-rozbieznosci-prototypu.md`](../04-rozbieznosci-prototypu.md) i rozstrzygnięty przez zespół, zanim trafi do reguły R‑nn.

## Konsekwencje

### Pozytywne

- `cards.json` generujemy z prototypu. CI (ciągła integracja) wykrywa rozjazd (`extract_cards.py --check`).
- Prototyp służy jako wyrocznia w testach różnicowych (E5-S04).

### Negatywne / ryzyka

- Mamy 20 pozycji D‑nn (rozbieżności prototypu) do rozstrzygnięcia (E0-S04). Do tego czasu sporne reguły mają status ❓.
