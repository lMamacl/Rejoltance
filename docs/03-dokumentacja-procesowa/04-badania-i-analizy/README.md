# 3.4 Badania techniczne i analizy porównawcze

> **Źródło prawdy:** repozytorium (`docs/03-dokumentacja-procesowa/04-badania-i-analizy/`) · **Kategoria dokumentacji:** Dokumentacja procesowa — notatki robocze i badania techniczne · **Etap SDD:** planowanie

W tym katalogu zbieramy notatki z badań technicznych i analizy porównawcze. Robimy je przed ważnymi decyzjami architektonicznymi, które potem zapisujemy jako ADR (Architecture Decision Record). Nową analizę tworzy agent `rj-architect` albo osoba z zespołu, która realizuje zadanie badawcze typu `spike/REJ-123-...`. Plik nazywamy według wzoru `RRRR-MM-DD-temat.md`.

## Gotowe analizy

| Plik | Zakres analizy | Powiązane decyzje ADR |
|---|---|---|
| [`faza-0-analiza.md`](faza-0-analiza.md) | Analiza materiałów źródłowych projektu, audyt bezpieczeństwa i architektury prototypu JS (`prototype/revibance`) oraz lista 20 rozbieżności reguł. | [ADR-0004](../../01-dokumentacja-systemowa/07-decyzje-adr/0004-kernel-od-nowa-deterministyczny.md), [ADR-0005](../../01-dokumentacja-systemowa/07-decyzje-adr/0005-kanon-regul-prototyp-js.md), [ADR-0006](../../01-dokumentacja-systemowa/07-decyzje-adr/0006-serwer-autorytatywny-fog-of-war.md) |
| [`faza-1-porownanie.md`](faza-1-porownanie.md) | Porównanie w praktyce narzędzi Spec-Driven Development (*OpenSpec*, *GitHub Spec Kit* i *SDD-lite*), test orkiestracji *.NET Aspire* bez Dockera oraz formatu importu CSV do Jiry PB. | [ADR-0001](../../01-dokumentacja-systemowa/07-decyzje-adr/0001-stos-technologiczny.md), [ADR-0003](../../01-dokumentacja-systemowa/07-decyzje-adr/0003-openspec-i-konstytucja.md), [ADR-0007](../../01-dokumentacja-systemowa/07-decyzje-adr/0007-sqlite-potem-postgresql.md) |
