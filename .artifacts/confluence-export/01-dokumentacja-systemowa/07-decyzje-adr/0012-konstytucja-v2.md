<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/07-decyzje-adr/0012-konstytucja-v2.md @ ff9d179 (2026-11-02) -->
# ADR-0012: Konstytucja v2 — nowy układ artykułów

> **Źródło prawdy:** repozytorium (`docs/01-dokumentacja-systemowa/07-decyzje-adr/0012-konstytucja-v2.md`) · **Kategoria dokumentacji:** Decyzja architektoniczna (ADR) · **Etap SDD:** Fundamenty

- **Status:** zaakceptowana
- **Data:** 2026-11-02
- **Autorzy:** Maciej Cyuńczyk (nowa wersja), Gabriel Ostaszewski (poprawki)
- **Akceptacja:** cały zespół (6 osób), rozmowa głosowa 2026-11-02; zgłosił Gabriel Ostaszewski
- **Powiązane:** ADR-0003, `.agents/rules/00-konstytucja.md`

## Kontekst i problem

Konstytucja v1 (2026-10-27) miała 11 artykułów spisanych w pośpiechu przy starcie repozytorium. W reworku dokumentacji (gałąź `develop-rework`) Maciej ułożył ją od nowa. Nowa wersja lepiej pasuje do cyklu SDD: osobne artykuły dla specyfikacji, kart jako danych i granic modułów w CI.

W nowej wersji zabrakło jednak trzech rzeczy z v1:

- zakazów dla agentów AI (merge, push do `main`/`develop`, sekrety, zmiana konstytucji bez zgody);
- zasady języka (dokumentacja po polsku, kod i commity po angielsku);
- zakazu osłabiania testów.

Były też dwa błędne odwołania: fog of war opisano jako R-66 (to reguła warunków efektów kart; poprawnie R-80…R-82) oraz wskazano nieistniejący projekt `tests/Rejoltance.Cards.Tests`.

Konstytucja v1 wymaga, żeby każdą zmianę zatwierdzić przez ADR i 2 osoby. Ten dokument jest tym ADR-em.

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| A. Zostawić v1, nową wersję odłożyć | brak ryzyka | tracimy lepszy układ | niski |
| B. Przyjąć wersję z reworku bez zmian | prosto | agenci tracą zakazy, błędne numery reguł | wysokie (bezpieczeństwo, sekrety) |
| C. Przyjąć nowy układ i przywrócić brakujące zasady | lepszy układ, zachowane zabezpieczenia | trzeba zatwierdzić | niski |

## Decyzja

W kontekście **reworku dokumentacji pod SDD**, mierząc się z **lepszym układem nowej konstytucji, z której wypadły zakazy dla agentów**, wybieramy **opcję C** zamiast przyjęcia wersji bez zmian, aby **zachować nowy układ i nie osłabić zabezpieczeń**, akceptując **11 artykułów zamiast 10**.

Zmiany względem wersji z reworku:

- art. X rozszerzony o 5 zakazów i obowiązków agenta AI z v1;
- nowy art. XI „Język”;
- art. VI: zakaz osłabiania testów, `Rejoltance.Cards.Tests` oznaczony jako planowany;
- art. V: R-80…R-82 zamiast R-66; art. II: odwołanie do R-83;
- art. III: walidację kart robi `ContentValidator` (w repo nie ma schematu JSON);
- art. I: kanon zasad = prototyp JS v11 (ADR-0005).

## Konsekwencje

### Pozytywne

- Nowy układ artykułów odpowiada krokom SDD.
- Agenci mają te same twarde granice co w v1.

### Negatywne / ryzyka

- Kolejna zmiana konstytucji znów wymaga ADR i akceptacji 2 osób.

### Do zrobienia

- [x] Akceptacja zespołu (2026-11-02), zmiana statusu na „zaakceptowana”.
