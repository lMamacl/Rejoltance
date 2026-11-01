# Jak dodać decyzję (ADR)

**Kiedy:** decyzja jest trudna do odwrócenia albo ktoś za miesiąc zapyta „dlaczego tak?”: zmiana stosu, kontraktu, granicy modułu,
zasady procesu, duża zależność. Agent zrobi szkic skillem `rj-write-adr`.

## Kroki

1. Numer: najwyższy w `docs/04-adr/` + 1 → plik `0011-krotki-tytul.md`.
2. Skopiuj [`0000-szablon.md`](../04-adr/0000-szablon.md), status `proposed`.
3. Wypełnij:
   - **Kontekst** — problem i ograniczenia, z faktami (oznacz [V] sprawdzone / [Z] założenia);
   - **Opcje** — tabela min. 2 opcji: zalety, wady, koszt;
   - **Decyzja** — jedno zdanie Y: *„W kontekście X, mierząc się z Y, wybieramy Z zamiast A, aby B, akceptując C.”*;
   - **Konsekwencje** — dobre, złe, zadania do Jiry.
4. Dopisz wiersz w [`docs/04-adr/README.md`](../04-adr/README.md).
5. PR `docs/REJ-…-adr-…`; dyskusja w PR albo na spotkaniu.
6. **Akceptacja 2 osób** → status `accepted` (zmienia człowiek, nie agent).

## Przykład zdania decyzji

> W kontekście kontraktu przesyłanego przez SignalR, mierząc się z rozjazdem C#↔TS, wybieramy próbkę JSON sprawdzaną w obu językach
> zamiast generatora OpenAPI, aby rozjazd psuł build, akceptując ręczne utrzymanie typów TS. *(ADR-0010)*

## Zasady

- ADR `accepted` się **nie edytuje** — nowy ADR z polem „zastępuje ADR-00NN”, a stary dostaje status `superseded`.
- Zmiana konstytucji (`.agents/rules/00-konstytucja.md`) wymaga ADR.
- Jeden ADR = jedna decyzja.
