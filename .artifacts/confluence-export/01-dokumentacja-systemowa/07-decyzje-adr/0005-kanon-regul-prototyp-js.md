<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/07-decyzje-adr/0005-kanon-regul-prototyp-js.md @ 10829d3 (2026-11-02) -->
# ADR-0005: Kanonem zasad jest prototyp JS v11

- **Status:** zatwierdzona (2026-10-27)
- **Data:** 2026-10-27
- **Powiązane:** [`02-specyfikacja-regul-gry.md`](../02-specyfikacja-regul-gry.md), [`03-indeks-regul-r-nn.md`](../03-indeks-regul-r-nn.md), [`04-rozbieznosci-prototypu.md`](../04-rozbieznosci-prototypu.md), `openspec/specs/*`, `tools/content/extract_cards.py`

## Kontekst i problem

Mamy trzy źródła zasad, które się różnią: `RE_JOLTANCE.md` (spisana specyfikacja), stary C# i prototyp JS v11 (najnowszy, grywalny, z kartami 61–69). [V]
Zespół zna grę z prototypu; to on jest wdrożony i pokazywany.

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

- `cards.json` generowany z prototypu; CI wykrywa rozjazd (`extract_cards.py --check`).
- Prototyp służy jako wyrocznia do testów różnicowych (E5-S04).

### Negatywne / ryzyka

- 20 pozycji D‑nn do rozstrzygnięcia (E0-S04); do tego czasu reguły sporne mają status ❓.
