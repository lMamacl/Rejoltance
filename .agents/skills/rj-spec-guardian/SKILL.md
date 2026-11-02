---
name: rj-spec-guardian
description: "Audytuje dwukierunkową spójność pomiędzy specyfikacjami OpenSpec (openspec/specs/), indeksem reguł (03-indeks-regul-r-nn.md), rozbieżnościami prototypu (04-rozbieznosci-prototypu.md) a wymaganiami PRD i SAD."
---

# Umiejętność: Audyt spójności specyfikacji SDD (`rj-spec-guardian`)

## Kiedy używać tej procedury?

Uruchamiaj po każdej edycji plików w `openspec/specs/`, `openspec/changes/`, `docs/01-dokumentacja-systemowa/01-prd-wymagania-produktu.md`, `02-specyfikacja-regul-gry.md`, `03-indeks-regul-r-nn.md` lub `04-rozbieznosci-prototypu.md`.

---

## Kroki wykonawcze (Krok po kroku)

1. **Walidacja składni i struktury OpenSpec:**

   ```bash
   npx openspec validate --all --strict
   ```

   Każde wymaganie (`### Requirement:`) musi zawierać co najmniej jeden scenariusz (`#### Scenario:`) ze słowami kluczowymi **GIVEN**, **WHEN**, **THEN**.

2. **Kontrola pokrycia w indeksie reguł (`03-indeks-regul-r-nn.md`):**
   - Upewnij się, że każda reguła `R-nn` opisana w `openspec/specs/*/spec.md` posiada swój wiersz w `docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md`.
   - Sprawdź, czy kolumna *OpenSpec* wskazuje istniejący katalog domeny w `openspec/specs/`.

3. **Kontrola spójności z Product Backlogiem (`backlog.toml`):**

   ```bash
   python tools/backlog/gen_jira_csv.py --check
   ```

   Każde powiązanie reguły `R-nn` z historyjką `Ex-Syy` musi być identyczne w obu plikach.

4. **Kontrola rozbieżności z prototypem (`04-rozbieznosci-prototypu.md`):**
   - Jeśli w `04-rozbieznosci-prototypu.md` dana pozycja `D-nn` jest oznaczona jako nierozstrzygnięta, odpowiadająca jej reguła w `03-indeks-regul-r-nn.md` musi mieć status `❓`.

5. **Walidacja formatowania Markdown:**

   ```bash
   npm run lint:md
   ```
