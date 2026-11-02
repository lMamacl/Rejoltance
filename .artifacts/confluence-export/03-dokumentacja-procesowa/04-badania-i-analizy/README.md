<!-- CONFLUENCE 1:1 EXPORT | Source: docs/03-dokumentacja-procesowa/04-badania-i-analizy/README.md @ 7e9a336 (2026-11-02) -->
# 3.4 Badania techniczne i analizy porównawcze

> **Źródło prawdy:** repozytorium (`docs/03-dokumentacja-procesowa/04-badania-i-analizy/`) · **Kategoria dokumentacji:** Dokumentacja procesowa — Notatki robocze i badania techniczne · **Etap SDD:** Planowanie

Katalog gromadzi notatki z badań technicznych oraz analizy porównawcze przeprowadzone przed podjęciem kluczowych decyzji architektonicznych (ADR). Nowe analizy tworzy agent `rj-architect` (lub członek zespołu realizujący zadanie badawcze typu `spike/REJ-123-...`) według nazewnictwa `RRRR-MM-DD-temat.md`.

## Opracowane analizy

| Plik | Zakres analizy | Powiązane decyzje ADR |
|---|---|---|
| [`faza-0-analiza.md`](faza-0-analiza.md) | Kompleksowa analiza źródeł projektowych, audyt bezpieczeństwa i architektury prototypu JS (`prototype/revibance`) oraz identyfikacja 20 rozbieżności reguł. | [ADR-0004](../../01-dokumentacja-systemowa/07-decyzje-adr/0004-kernel-od-nowa-deterministyczny.md), [ADR-0005](../../01-dokumentacja-systemowa/07-decyzje-adr/0005-kanon-regul-prototyp-js.md), [ADR-0006](../../01-dokumentacja-systemowa/07-decyzje-adr/0006-serwer-autorytatywny-fog-of-war.md) |
| [`faza-1-porownanie.md`](faza-1-porownanie.md) | Eksperymentalne porównanie narzędzi Spec-Driven Development (*OpenSpec* vs *GitHub Spec Kit* vs *SDD-lite*), orkiestracji *.NET Aspire* bez Dockera oraz formatu importu CSV do Jiry PB. | [ADR-0001](../../01-dokumentacja-systemowa/07-decyzje-adr/0001-stos-technologiczny.md), [ADR-0003](../../01-dokumentacja-systemowa/07-decyzje-adr/0003-openspec-i-konstytucja.md), [ADR-0007](../../01-dokumentacja-systemowa/07-decyzje-adr/0007-sqlite-potem-postgresql.md) |
