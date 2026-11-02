# 04. Inżynieria agentowa i automatyzacja Spec-Driven Development (SDD)

Ta sekcja opisuje, jak w projekcie **RE:JOLTANCE** pracujemy z agentami AI. Rozwijamy projekt w podejściu **Spec-Driven Development (SDD)**, czyli najpierw piszemy specyfikację, a dopiero potem kod. Pomagają nam w tym wyspecjalizowani agenci AI. Chcemy, żeby każda osoba w zespole rozumiała, jak ten mechanizm działa, i umiała go rozbudować.

Nie traktujemy AI jak „czarnej skrzynki”. W repozytorium każdy agent ma opisaną rolę, jawnie przypisane umiejętności (skille), ograniczone narzędzia i obowiązek przestrzegania konstytucji projektu (`.agents/rules/00-konstytucja.md`).

---

## Przewodniki w tej sekcji (układ 1:1 z Confluence)

| Nr | Dokument | Czego się dowiesz? |
|---|---|---|
| **4.1** | [`01-architektura-i-konfiguracja-agentow.md`](01-architektura-i-konfiguracja-agentow.md) | Jak zbudowany jest katalog `.agents/`, jak skrypt synchronizuje go do 5 środowisk (Claude Code, Antigravity, GitHub Copilot, Gemini, Codex) i jak połączyć agentów z uczelnianą Jirą i Confluence PB przez MCP (Model Context Protocol). |
| **4.2** | [`02-katalog-rol-i-wbudowanych-skilli.md`](02-katalog-rol-i-wbudowanych-skilli.md) | Podział 10 agentów na 4 grupy, opis każdej roli, macierz skilli przypisanych do agentów i katalog wszystkich 19 skilli w projekcie (13 zespołowych `rj-*` i 6 systemowych `openspec-*`). |
| **4.3** | [`03-jak-pisac-specyfikacje-openspec.md`](03-jak-pisac-specyfikacje-openspec.md) | Jak pracujemy w SDD z narzędziem **OpenSpec**: od propozycji zmiany (`/opsx:propose`) przez akceptację i implementację (`/opsx:apply`) po archiwizację (`/opsx:archive`). |
| **4.4** | [`04-warsztat-tworzenie-agentow-skilli-i-kart.md`](04-warsztat-tworzenie-agentow-skilli-i-kart.md) | Warsztat krok po kroku: jak zbudować nowego agenta, jak stworzyć nowy skill, jak pisać dokumentację i przenosić ją do Confluence, jak dodać decyzję ADR (Architecture Decision Record) i jak dodać nową kartę do gry. |
