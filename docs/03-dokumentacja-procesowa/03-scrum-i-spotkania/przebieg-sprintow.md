# Przebieg sprintów (wykonanie)

To, co zespół faktycznie zrobił w każdym sprincie. Pierwotny plan sprintów i historyjek jest w [`backlog.toml`](../02-backlog/backlog.toml) i zostaje bez zmian. Niezrobione historyjki przeniesiemy na kolejne sprinty razem z importem do Jiry.

---

## Sprint 0: Fundamenty projektu

**27.10.2026 – 2.11.2026**
**Cel:** zespół ma wspólne repo, zasady pracy, decyzje technologiczne i strukturę dokumentacji.
**Wynik:** osiągnięty, poza DIP i radą graczy.

**Zrobione:**

- **Analiza materiałów źródłowych:**
  - poprzedni prototyp JS (`revibance`) i wersja C#/Godot;
  - stara specyfikacja zasad, wymagania uczelni;
  - lista 20 rozbieżności reguł D-01…D-20.
- **Ustalenia technologiczne i środowiskowe (ADR-0001…0010):**
  - stos technologiczny;
  - GitHub z kopią na Bitbucket;
  - silnik pisany od nowa, deterministyczny;
  - serwer autorytatywny;
  - najpierw SQLite, potem PostgreSQL.
- **Wygląd i układ projektu:**
  - szkielet repo, CI na GitHubie, szablony PR i zgłoszeń;
  - skrypty instalacji i diagnostyki;
  - układ folderów dokumentacji.
- **Sterowanie agentami AI:**
  - `AGENTS.md`, role, reguły i skille;
  - konstytucja projektu, czyli plik z zasadami (v2 przyjęta w ADR-0012).
- **Specyfikacja gry:**
  - 55 reguł R-nn w OpenSpec;
  - backlog z 7 epikami i 56 historyjkami.
- **Zadanie 1:** struktura dokumentacji SDD i 4 strony w Confluence (ADR-0011).
- **Zamknięcie sprintu:** develop → main (PR #23).

**Niezrobione (przechodzi dalej):**

- DIP: zostaje wersja robocza v0.9, nikt nie dopisał swojego epiku, brak zatwierdzenia.
- Rada graczy testowych: nikogo nie zrekrutowaliśmy.
- Rozstrzygnięcie rozbieżności D-01…D-20: są tylko spisane.
- Jira: import backlogu i sprinty.

---

## Sprint 1: Rozbudowa prototypu gry

**3.11.2026 – 16.11.2026**
**Cel:** grywalny prototyp z pełniejszymi zasadami, który ma się stać kanonem.
**Wynik:** osiągnięty częściowo.

**Zrobione (PanCoto, repo `rejoltance-prototype`):**

- Wersje 1.0.0 (4.11) i 1.0.1 (5.11), poprawki balansu i błędów.
- Nowe UI, samouczek, ekran ładowania, zmiany balansu kart (16.11).

**Niezrobione (przechodzi dalej):**

- Zaplanowane historyjki z głównego repo: pokój PvP, plansza z ręką, rejestr akcji, CI z testem E2E.
  - Powód: prace szły w prototypie, czekaliśmy, aż zasady się ustabilizują.

---

## Sprint 2: Prototyp jako kanon i nowy stos

**17.11.2026 – 30.11.2026**
**Cel:** repo opiera się na nowym prototypie, działa na jednym języku i ma pierwszą funkcję gry.
**Wynik:** osiągnięty.

**Zrobione:**

- **Prototyp jako kanon:** wcielony do repo jako `prototype/` (PR #25), przyjęty jako źródło zasad (ADR-0013, PR #27).
- **Podbicie Aspire** z powodu luki CVE, która blokowała CI (PR #26).
- **Przeniesienie silnika i backendu** z .NET na Node.js i TypeScript (ADR-0015, PR #31).
- **Narzędzia repo** przepisane z Pythona na npm, START.md i krótkie README (PR #32).
- **Odchudzenie systemu agentów** (ADR-0014, PR #30).
- **Pierwsza funkcja gry:** E1-S01, czyli wybór kolejności, dobieranie i start rundy (PR #33). Do tego decyzje D-21 i D-22.
- **Porządki w repo:**
  - na GitHubie zostały tylko `main` i `develop`;
  - develop → main (PR #24).
- **Przeniesienie repo** do organizacji `rejoltance` (PR #29).
- **Confluence:** odświeżony eksport stron (PR #28).
- **Debugowanie Jiry:** nie da się utworzyć sprintu, problem zgłoszony prowadzącemu.
- **PanCoto w prototypie:**
  - wersja 0.0.4 z nowymi kartami;
  - replay, tryb obserwatora, grafiki kart;
  - kolejne karty i tryb RGB.

**Niezrobione (przechodzi dalej):**

- Kroki rundy i zagrywanie jednostek (E1-S02), walidacja ruchów po stronie serwera.
- Jira: dalej zablokowana.
