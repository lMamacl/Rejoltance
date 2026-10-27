# Faza 0 — analiza materiałów źródłowych

**Data:** 2026-10-27 · **Status:** zaakceptowana (decyzje poniżej) · Legenda: **[V]** zweryfikowane, **[Z]** założenie, **[?]** nieznane.

## Streszczenie źródeł

| Źródło | Najważniejsze ustalenia |
|---|---|
| `REJOLTANCE-ANALIZA.md` (główne) [V] | 20 rozbieżności dema ze specyfikacją; architektura 7 warstw i 5 kontraktów; 12 wzorców (reducer, jedno źródło legalności, pending, DSL + rejestr, fail loud, seeded RNG, projekcja fog of war, test granic, R‑nn); 6 ról; ryzyka; MVP ≈ 340 h (480 h z ryzykiem) |
| `RE_JOLTANCE.md` [V] | stara specyfikacja zasad (fazy, walka, słowa kluczowe, Sacrifice, Silence, koszty) |
| prototyp JS `revibance` [V] | 69 kart + 9 tokenów, 25 akcji, 15 triggerów; P2P PeerJS (host = autorytet); bot beam search; **brak testów**; reguły v11 różnią się od specyfikacji; błędy: remis → wygrywa gracz 1, brak walidacji celów, wyciek ręki przez `uid`, XSS przez `innerHTML`, karty 46/60/14 zakodowane na sztywno, brak seeda |
| `AUDYT_TECHNICZNY_REJOLTANCE.md` [V] | audytuje **inny kod** (C#/Godot `Bluzacy2/CardGame`, nieobecny lokalnie); estymaty nierealne (~124 h całość); pomija prototyp JS → tylko kontekst |
| `brainstorm-…-rework.md` [V] | wymagania: SignalR, fog of war, deckbuilder 30/3, bot, konta, panel admina, replay; 6 epików |
| `wymagania uczelniane.md`, `instrukcje.md` [V] | EU1–EU7; DIP + każdy student pisze własny epik; PO w 1 sprincie; Burndown (godziny i zadania); Log Work; Confluence; code review w Bitbucket; workflow Jira `Open → In Progress → Resolved → Closed` |
| Vaultie (`.agents`, `.agent`, kickoff‑kit) [V] | format agentów/reguł/skilli Antigravity, etykiety prawdy, ADR ze zdaniem Y, DIP, handbook PO (`feature/KEY-NN-opis`, commit `KEY-NN: …`, zadania ≤ 4 h) |
| szablon pi‑wo [V] | gałęzie `main`, `develop`, `feature/<obszar>`; brak CI i szablonów |

## Środowisko i integracje [V]

- Atlassian PB dostępny z internetu: Jira (LDAP), Bitbucket DC 8.14.4, Confluence 8.4.5 (`devtools.wi.pb.edu.pl`).
- `mcp-atlassian` obsługuje Jira DC ≥ 8.14 i Confluence DC przez Personal Access Token.
- Antigravity czyta `AGENTS.md` i `.agents/{rules,workflows,skills}`; Aspire 13.6 ma `AddViteApp`.

## Decyzje podjęte

1. GitHub główny + mirror do Bitbucket PB.
2. Frontend: React + TypeScript + Vite.
3. Narzędzia AI zespołu: Claude Code, Antigravity, Copilot, Gemini, Codex, DeepSeek → wspólny `AGENTS.md` + `.agents/`.
4. SQLite na start, PostgreSQL później (Aspire bez Dockera).
5. **Kernel pisany od nowa** (stare C# tylko jako lista przypadków brzegowych + wzór `DeterministicRng`).
6. **Kanon reguł = prototyp JS v11**; ewidentne błędy → `docs/02-rules/ROZBIEZNOSCI.md` do decyzji zespołu.
7. Materiały (kod, assety prototypu) można commitować — autorem jest zespół.
8. Sprinty: S0 27.10–2.11 · S1 3–16.11 · S2 17–30.11 · S3 1–14.12 · S4 15.12–11.01 · S5 12–25.01.
9. (Faza 1) Narzędzie SDD: **OpenSpec** + własna konstytucja; gałęzie `typ/REJ-123-opis`.

## Pytania otwarte do zespołu

**Proces / uczelnia**

1. Klucz projektu Jira i kto go zakłada (w repo placeholder `REJ`).
2. Przydział PO do sprintów (6 osób, 5 sprintów — czy S0 się liczy?).
3. Mapowanie workflow `Open/In Progress/Resolved/Closed` na tablicę.
4. Czy prowadzący zakłada repo w Bitbucket (cel mirrora) i czy wystarczy review na GitHubie z linkiem w Jirze.

**Produkt**

1. Zakres MVP talii (12 kart vs 69).
2. Które zachowania JS to błędy (remis, mulligan z tasowaniem, Breakthrough = pełne obrażenia, powrót do pełnej ręki usuwa kartę).
3. Użytkownik końcowy / rada graczy testowych (EU1/EU2).

**Techniczne**

1. Hosting demo (Azure for Students / Railway / serwer uczelni).
2. Kto jest właścicielem którego epiku (E1–E6).
3. Czy wszyscy mogą zainstalować Docker/Podman przed S3 (PostgreSQL).
