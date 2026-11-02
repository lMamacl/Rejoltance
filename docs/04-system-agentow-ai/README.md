# 04. Inżynieria agentowa i automatyzacja Spec-Driven Development (SDD)

Witaj w przewodniku po systemie **inżynierii agentowej** projektu **RE:JOLTANCE**. Ponieważ nasz projekt jest rozwijany w podejściu **Spec-Driven Development (SDD)** ze wsparciem wyspecjalizowanych agentów AI, cały ten mechanizm został zaprojektowany tak, aby był **w pełni przejrzysty, zrozumiały i łatwy w rozbudowie dla każdego członka zespołu**.

Nie traktujemy sztucznej inteligencji jako „czarnej skrzynki” — w naszym repozytorium każdy agent posiada ściśle zdefiniowaną rolę, jawnie przypisane umiejętności, ograniczone uprawnienia narzędziowe oraz obowiązek przestrzegania Konstytucji Projektu.

---

## Spis przewodników w tej sekcji (Układ 1:1 z Confluence)

| Nr | Dokument | Czego dowiesz się z tego dokumentu? |
|---|---|---|
| **4.1** | [`01-architektura-i-konfiguracja-agentow.md`](01-architektura-i-konfiguracja-agentow.md) | Jak zbudowany jest katalog `.agents/`, jak działa automatyczna synchronizacja do 5 środowisk IDE (Claude Code, Antigravity, GitHub Copilot, Gemini, Codex) oraz jak skonfigurować połączenie MCP z uczelnianą Jirą i Confluence PB. |
| **4.2** | [`02-katalog-rol-i-wbudowanych-skilli.md`](02-katalog-rol-i-wbudowanych-skilli.md) | Podział 10 agentów na 4 grupy funkcjonalne, szczegółowy opis każdej roli, **macierz wbudowanych umiejętności każdego agenta** oraz katalog wszystkich 19 umiejętności dostępnych w projekcie (13 zespołowych `rj-*` oraz 6 systemowych `openspec-*`). |
| **4.3** | [`03-jak-pisac-specyfikacje-openspec.md`](03-jak-pisac-specyfikacje-openspec.md) | Praktyczny podręcznik pracy w metodyce Spec-Driven Development przy użyciu narzędzia **OpenSpec**: od propozycji zmiany (`/opsx:propose`) przez akceptację i implementację (`/opsx:apply`) po archiwizację (`/opsx:archive`). |
| **4.4** | [`04-warsztat-tworzenie-agentow-skilli-i-kart.md`](04-warsztat-tworzenie-agentow-skilli-i-kart.md) | Praktyczny warsztat krok po kroku: **jak samodzielnie zbudować nowego agenta**, **jak stworzyć nową umiejętność**, **jak pisać i synchronizować dokumentację z Confluence**, **jak dodać decyzję ADR** oraz **jak dodać nową kartę do gry**. |
