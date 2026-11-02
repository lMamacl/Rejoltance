---
name: rj-write-adr
description: "Tworzy zapis decyzji architektonicznej (ADR-NNNN) w docs/01-dokumentacja-systemowa/07-decyzje-adr/ według szablonu projektu (kontekst, tabela opcji, zdanie decyzyjne, konsekwencje) i aktualizuje indeks ADR."
---

# Umiejętność: Tworzenie decyzji architektonicznej ADR (`rj-write-adr`)

## Kiedy używać tej procedury?

Uruchamiaj, gdy zespół podejmuje istotną decyzję architektoniczną, technologiczną lub procesową — w szczególności przy każdej zmianie 5 zamrożonych kontraktów (`Rejoltance.Contracts`), dodaniu nowej zależności zewnętrznej lub zmianie granic modułów.

---

## Kroki wykonawcze (Krok po kroku)

1. **Ustal kolejny wolny numer `NNNN`:**
   - Sprawdź istniejące pliki w `docs/01-dokumentacja-systemowa/07-decyzje-adr/`.
   - Odczytaj wzorzec z `docs/01-dokumentacja-systemowa/07-decyzje-adr/0000-szablon.md`.

2. **Utwórz plik `docs/01-dokumentacja-systemowa/07-decyzje-adr/NNNN-krotki-tytul.md`:**
   - Ustaw początkowy status na `proposed` (zmiana na `accepted` następuje po akceptacji PR przez co najmniej 2 członków zespołu).
   - Opisz **Kontekst i problem** bez przesądzania rozwiązania.
   - Zestaw w tabeli co najmniej **2–3 rozważane opcje** (wraz z ich zaletami, wadami i ryzykiem).
   - Sformułuj **Decyzję** w postaci zdania *Y-statement*:
     *„W kontekście ⟨...⟩, mierząc się z ⟨...⟩, wybieramy ⟨opcja⟩ zamiast ⟨alternatywy⟩, aby osiągnąć ⟨korzyść⟩, akceptując ⟨kompromis⟩.”*
   - Wypisz pozytywne i negatywne konsekwencje oraz konkretne zadania do wykonania.

3. **Zaktualizuj rejestr ADR i powiązane dokumenty:**
   - Dopisz nowy wiersz do tabeli w `docs/01-dokumentacja-systemowa/07-decyzje-adr/README.md`.
   - Jeśli nowy ADR zastępuje wcześniejszą decyzję, w starym pliku ADR zmień jedynie linię statusu na `superseded by ADR-NNNN`.

4. **Zweryfikuj formatowanie i linki:**

   ```bash
   npm run lint:md
   python tools/confluence/sync_confluence.py --check
   ```
