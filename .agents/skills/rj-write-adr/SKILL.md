---
name: rj-write-adr
description: Drafts an Architecture Decision Record in docs/04-adr using the team template (context, options table, Y-statement decision, consequences). Use when a choice is hard to reverse or someone may later question it.
---

# Nowy ADR

## Kiedy

Zmiana stosu, kontraktu, granicy modułu, reguły procesu, zależności o dużym wpływie; „dlaczego tak?” padnie za miesiąc.

## Kroki

1. Kolejny numer: najwyższy `docs/04-adr/NNNN-*.md` + 1. Plik `NNNN-krotki-tytul.md`.
2. Skopiuj `docs/04-adr/0000-szablon.md`. Status: `proposed`.
3. Wypełnij:
   - **Kontekst** — problem i ograniczenia (fakty z repo z etykietami [V]/[Z]);
   - **Opcje** — tabela min. 2 opcji: zalety, wady, koszt/ryzyko;
   - **Decyzja** — zdanie Y: „W kontekście X, mierząc się z Y, wybieramy Z zamiast A, aby B, akceptując C.”;
   - **Konsekwencje** — pozytywne, negatywne, co trzeba zrobić (zadania Jira);
   - **Powiązania** — ADR‑y, zgłoszenia, zmiany OpenSpec.
4. Dopisz wiersz w `docs/04-adr/README.md`.
5. Status `accepted` ustawia człowiek po akceptacji 2 osób (konstytucja, art. X).

## Nie wolno

Zmieniać treści ADR `accepted` — tworzy się nowy, który go zastępuje (`supersedes`).
