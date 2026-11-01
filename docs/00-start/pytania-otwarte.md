# Pytania otwarte do zespołu

Numery #1–#10 są przywoływane w innych dokumentach. Odpowiedź wpisz w kolumnę „Decyzja” i zaktualizuj wskazane pliki.

| # | Obszar | Pytanie | Kto decyduje | Co zmienić po decyzji | Decyzja |
|---|---|---|---|---|---|
| 1 | Proces | Jaki jest klucz projektu w Jirze i kto go zakłada? | prowadzący | `backlog.toml` (`project_key`), regexy gałęzi w CI i regułach, `DIP.md` | |
| 2 | Proces | Kto jest PO w którym sprincie? Czy S0 się liczy? | zespół + prowadzący | `DIP.md` §6.1 | |
| 3 | Proces | Jak mapujemy workflow `Open / In Progress / Resolved / Closed` na tablicę? | PO S1 | DoD w `DIP.md`, `jak-pracujemy.md` | |
| 4 | Proces | Czy prowadzący zakłada repo w Bitbucket i czy review na GitHubie jest OK? | prowadzący | ADR-0002, sekrety mirrora | |
| 5 | Produkt | Talia MVP: które 12 kart? | zespół + rada graczy | story E2-S05 | |
| 6 | Produkt | Rozbieżności D-01…D-20 (np. Flying vs naziemni, Breakthrough, remis) | zespół | `ROZBIEZNOSCI.md`, `openspec/specs`, testy | |
| 7 | Produkt | Kto jest w radzie graczy testowych (3 osoby)? | PO S0 | `DIP.md` §2.1, story E0-S03 | |
| 8 | Techniczne | Gdzie hostujemy demo? | właściciel E6 | story E6-S05 | |
| 9 | Techniczne | Kto jest właścicielem którego epiku (E1–E6)? | zespół | `DIP.md`, `backlog.toml` (`owner`), `.github/CODEOWNERS` | |
| 10 | Techniczne | Czy każdy może zainstalować Docker/Podman przed S4 (PostgreSQL)? | zespół | ADR-0007, story E6-S03 | |
