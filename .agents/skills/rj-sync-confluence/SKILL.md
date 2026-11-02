---
name: rj-sync-confluence
description: "Waliduje drzewo dokumentacji 1:1 z Confluence w katalogu docs/ (nagłówki metadanych SDD i linki wewnętrzne) oraz generuje gotową paczkę eksportową do Confluence przy użyciu tools/confluence/sync_confluence.py."
---

# Umiejętność: Walidacja i synchronizacja dokumentacji 1:1 z Confluence (`rj-sync-confluence`)

## Kiedy używać tej procedury?

Uruchamiaj po każdej edycji dokumentacji w `docs/` oraz na koniec każdego sprintu przed publikacją zaktualizowanych stron w przestrzeni **Confluence PB**.

---

## Kroki wykonawcze (Krok po kroku)

1. **Sprawdź zgodność z architekturą dokumentacji 1:1 (AltexSoft + SDD):**
   - Upewnij się, że nowy lub zmieniony plik znajduje się we właściwej z 6 sekcji (`00-przewodnik-i-setup` .. `05-szablony`) zgodnie z mapą w `docs/00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md`.
   - Sprawdź, czy dokument posiada na górze blok metadanych (*Źródło prawdy*, *Kategoria AltexSoft*, *Etap SDD*) zgodny z `docs/05-szablony/naglowek-strony-confluence.md`.

2. **Uruchom linter Markdown oraz walidator drzewa Confluence:**

   ```bash
   npm run lint:md
   python tools/confluence/sync_confluence.py --check
   ```

3. **Wygeneruj paczkę eksportową 1:1 do Confluence PB (opcjonalnie przed publikacją):**

   ```bash
   python tools/confluence/sync_confluence.py --export
   ```

   Skrypt tworzy w katalogu `artifacts/confluence-export/` gotowe strony z nagłówkami metadanych Confluence (hash commita, data, ścieżka w repozytorium) oraz manifest hierarchii stron `manifest.json`.
