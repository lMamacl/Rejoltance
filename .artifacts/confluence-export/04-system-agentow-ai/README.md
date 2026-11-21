<!-- CONFLUENCE 1:1 EXPORT | Source: docs/04-system-agentow-ai/README.md -->
# 04. Inżynieria agentowa i automatyzacja Spec-Driven Development (SDD)

Ta sekcja opisuje, jak w projekcie **RE:JOLTANCE** pracujemy z agentami AI. Rozwijamy projekt w podejściu **Spec-Driven Development (SDD)**, czyli najpierw piszemy specyfikację, a dopiero potem kod. Pomagają nam w tym agenci AI. Chcemy, żeby każda osoba w zespole rozumiała, jak ten mechanizm działa, i umiała go rozbudować.

Nie traktujemy AI jak „czarnej skrzynki”. W repozytorium agenci mają spisane zasady, procedury krok po kroku (skille) i obowiązek przestrzegania konstytucji projektu (`.agents/rules/00-konstytucja.md`).

---

## Przewodniki w tej sekcji (układ 1:1 z Confluence)

| Nr | Dokument | Czego się dowiesz? |
|---|---|---|
| **4.1** || Jak zbudowany jest katalog `.agents/`, z których narzędzi korzystamy (Claude Code, Codex, Cursor, Antigravity) i jak połączyć agentów z Jirą i Confluence PB przez MCP (Model Context Protocol). |
| **4.2** || Rola recenzenta `rj-qa-verifier` i katalog 15 skilli (9 zespołowych `rj-*` i 6 OpenSpec). |
| **4.3** | [`03-jak-pisac-specyfikacje-openspec.md`](03-jak-pisac-specyfikacje-openspec.md) | Jak pracujemy w SDD z narzędziem **OpenSpec**: od propozycji zmiany (`/opsx:propose`) przez akceptację i implementację (`/opsx:apply`) po archiwizację (`/opsx:archive`). |
| **4.4** | [`04-warsztat-tworzenie-agentow-skilli-i-kart.md`](04-warsztat-tworzenie-agentow-skilli-i-kart.md) | Warsztat krok po kroku: jak dodać skill, jak pisać dokumentację i przenosić ją do Confluence, jak dodać decyzję ADR (Architecture Decision Record) i jak dodać nową kartę do gry. |
