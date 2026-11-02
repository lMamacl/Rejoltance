---
trigger: model_decision
description: "Jak układamy dokumentację: typy dokumentów wg AltexSoft, etapy SDD i układ 1:1 z przestrzenią Confluence PB (sekcje 00..05)."
---

# 70. Architektura dokumentacji technicznej (AltexSoft + SDD 1:1 z Confluence)

> Pełna specyfikacja architektury dokumentacji: [`docs/00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md`](../../docs/00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md) oraz [`ADR-0011`](../../docs/01-dokumentacja-systemowa/07-decyzje-adr/0011-dokumentacja-hybryda-repo-confluence.md).

## 1. Układ katalogu `docs/` (mapowanie 1:1 na drzewo stron Confluence PB)

Katalog `docs/` jest podzielony na 6 sekcji głównych odwzorowujących taksonomię **AltexSoft** (*Technical Documentation in Software Development*) oraz cykl życia **SDD**:

| Katalog w `docs/` | Odpowiednik w Confluence PB | Kategoria wg AltexSoft |
|---|---|---|
| `00-przewodnik-i-setup/` | `00. Przewodnik i Setup Środowiska` | *Process: Standards & Onboarding* |
| `01-dokumentacja-systemowa/` | `01. Dokumentacja Systemowa (PRD i SAD)` | *Product: System Documentation* (PRD, Reguły, SAD, Stos, ADR, Mapa, API, UX, QA) |
| `02-dokumentacja-uzytkownika/` | `02. Dokumentacja Użytkownika i Wdrożenia` | *Product: User Documentation* (Podręcznik Gracza, Instrukcja Wdrożenia SysAdmin) |
| `03-dokumentacja-procesowa/` | `03. Dokumentacja Procesowa i Zarządcza` | *Process Documentation* (DIP, Backlog, Scrum i Spotkania, Badania) |
| `04-system-agentow-ai/` | `04. System Agentów AI i SDD` | *SDD & AI Engineering Handbook* (Architektura, Role i Skille, OpenSpec, Warsztat) |
| `05-szablony/` | `05. Biblioteka Szablonów Dokumentacji` | *AltexSoft & SDD Templates* (Szablony PRD, SAD, TDD, UX, Modułu, QA, Release) |

Katalog `99-archiwum-zrodel/` zawiera historyczne materiały dydaktyczne (tylko do odczytu).

## 2. Standardy redakcyjne i metadane strony Confluence

1. **Nagłówek metadanych:** każdy główny dokument w `docs/00..05` zaczyna się od bloku cytatu określającego: *Źródło prawdy*, *Kategorię AltexSoft* oraz *Etap SDD* (wzór: [`docs/05-szablony/naglowek-strony-confluence.md`](../../docs/05-szablony/naglowek-strony-confluence.md)).
2. **Język i styl:** pisz w naturalnym, profesjonalnym języku polskim. Unikaj telegraficznych równoważników zdań i sztucznych znaczników.
3. **Diagramy i tabele:** diagramy architektury i przepływów twórz w formacie `mermaid` (renderowanym natywnie w GitHubie i Confluence).
4. **Spójność linków i formatowania:** po każdej edycji dokumentacji uruchom:
   - `npm run lint:md` (`markdownlint-cli2`),
   - `python tools/confluence/sync_confluence.py --check` (weryfikacja drzewa i linków pod kątem Confluence).
