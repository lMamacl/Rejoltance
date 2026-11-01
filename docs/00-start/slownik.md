# Słownik pojęć

## Gra

| Pojęcie | Znaczenie |
|---|---|
| **Lane battler** | gra karciana, w której jednostki walczą w liniach naprzeciw siebie |
| **Linia (lane)** | jedna z 4 kolumn planszy (0–3); po jednym slocie na jednostkę każdego gracza |
| **Blood** | zasób do zagrywania kart; maks. = numer rundy (do 10), odnawiany co rundę |
| **Jednostka (Unit)** | karta stawiana na linii; ma atak i HP |
| **Akcja (Spell)** | karta jednorazowa z efektem |
| **Token** | karta tworzona przez efekt (id ≥ 900), nie może być w talii |
| **Mulligan** | wymiana kart z ręki startowej |
| **Gracz A / B** | rozpoczynający rundę / drugi gracz w danej rundzie |
| **Krok (step)** | etap rundy: jednostki (A), mieszany (B), akcje (A), walka |
| **Fatigue** | obrażenia za dobieranie z pustej talii (1, 2, 3…) |
| **Słowo kluczowe** | stała właściwość jednostki (Flying, Armored…) |
| **Status** | nakładany stan (Marked, Stunned, Burning) |
| **Sacrifice** | poświęcenie własnej jednostki jako koszt lub efekt |
| **Silence** | wyciszenie: jednostka traci słowa kluczowe, statusy i zdolności |

## Technika i proces

| Pojęcie | Znaczenie |
|---|---|
| **SDD (spec‑driven development)** | najpierw specyfikacja i kryteria, potem plan, zadania i kod |
| **OpenSpec** | narzędzie SDD: żywe specyfikacje (`openspec/specs`) i zmiany (`openspec/changes`) |
| **R‑nn / NFR‑nn** | numer wymagania funkcjonalnego (zasady gry) / niefunkcjonalnego |
| **Konstytucja** | zasady obowiązujące ludzi i agentów AI (`.agents/rules/00-konstytucja.md`) |
| **ADR** | zapis decyzji architektonicznej z uzasadnieniem |
| **Kernel** | moduł z regułami gry — czysty i deterministyczny |
| **Intent** | intencja gracza wysyłana do serwera (jedyne wejście do gry) |
| **MatchView** | widok meczu dla jednego gracza (ukrywa karty przeciwnika) |
| **LegalAction** | dozwolony ruch wyliczony przez Kernel |
| **PendingInteraction** | pytanie gry do gracza (mulligan, wybór celu) |
| **DomainEvent** | fakt z rozstrzygnięcia (np. dobrano kartę) — podstawa animacji |
| **Fog of war** | ukrywanie informacji: przeciwnik widzi tylko liczbę kart w ręce |
| **Seed / replay** | ziarno losowości; mecz = seed + lista intencji |
| **Projekcja** | przekształcenie pełnego stanu w widok jednego gracza |
| **AppHost** | projekt Aspire uruchamiający serwer i klienta jednym poleceniem |
| **Skill / rola agenta** | procedura / odpowiedzialność agenta AI w `.agents/` |
| **Fala W0–W3** | linia cięcia backlogu: fundament, MVP, pełna gra, dodatki |
| **PO** | Product Owner — rotacyjnie, jedna osoba na sprint |
