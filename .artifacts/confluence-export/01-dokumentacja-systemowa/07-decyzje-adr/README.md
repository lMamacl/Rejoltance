<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/07-decyzje-adr/README.md @ 7e9a336 (2026-11-02) -->
# 1.7 Decyzje architektoniczne (ADR)

> **Źródło prawdy:** Repozytorium (`docs/01-dokumentacja-systemowa/07-decyzje-adr/`) · **Kategoria dokumentacji:** Dokumentacja produktowa — systemowa (Decyzje architektoniczne ADR) · **Etap SDD:** Fundamenty i planowanie

Każda istotna decyzja architektoniczna, technologiczna lub procesowa, którą zespół lub prowadzący mógłby zakwestionować za miesiąc, otrzymuje osobny dokument `NNNN-tytul.md` oparty na szablonie [`0000-szablon.md`](0000-szablon.md) (wspierany przez skill [`rj-write-adr`](../../../.agents/skills/rj-write-adr/SKILL.md)).

Zatwierdzonego dokumentu ADR (`Status: accepted`) nie nadpisujemy po czasie — jeżeli zespół zmienia wcześniejszą decyzję, tworzy nowy rekord ADR i oznacza poprzedni jako `superseded by ADR-MMMM`. Zatwierdzenie nowego ADR wymaga akceptacji co najmniej 2 członków zespołu w Pull Requeście.

---

## Rejestr Decyzji Architektonicznych (ADR-0001 – ADR-0011)

| Numer ADR | Tytuł decyzji | Status | Główny obszar |
|---|---|---|---|
| [ADR-0001](0001-stos-technologiczny.md) | Stos technologiczny: .NET 10 + React/TypeScript + .NET Aspire | Zatwierdzona (`accepted`) | Technologia i uruchomienie |
| [ADR-0002](0002-github-i-mirror-bitbucket.md) | GitHub jako główne repozytorium robocze + automatyczny mirror do Bitbucket PB | Zatwierdzona (`accepted`) | Proces i repozytoria |
| [ADR-0003](0003-openspec-i-konstytucja.md) | OpenSpec 1.15 jako narzędzie Spec-Driven Development + własna konstytucja projektu | Zatwierdzona (`accepted`) | SDD i agenci AI |
| [ADR-0004](0004-kernel-od-nowa-deterministyczny.md) | Czysty, deterministyczny silnik reguł (`Rejoltance.Kernel`) pisany od nowa w C# | Zatwierdzona (`accepted`) | Architektura domeny |
| [ADR-0005](0005-kanon-regul-prototyp-js.md) | Zachowanie prototypu JS v11 jako kanon zasad gry i wyrocznia testów różnicowych | Zatwierdzona (`accepted`) | Specyfikacja reguł |
| [ADR-0006](0006-serwer-autorytatywny-fog-of-war.md) | Autorytatywny serwer z projekcją stanu per gracz (ochrona ukrytych informacji) | Zatwierdzona (`accepted`) | Bezpieczeństwo i sieć |
| [ADR-0007](0007-sqlite-potem-postgresql.md) | Baza danych: SQLite w fazie startowej (Sprinty 0–3), migracja na PostgreSQL od Sprintu 4 | Zatwierdzona (`accepted`) | Architektura danych |
| [ADR-0008](0008-spine-first-pionowe-plastry.md) | Strategia realizacji od rdzenia (*spine-first*) i pionowe plastry funkcjonalne | Proponowana (`proposed`) | Planowanie i integracja |
| [ADR-0009](0009-kanon-agentow-i-adaptery.md) | Kanon konfiguracji agentów AI w `.agents/` z adapterami dla 5 narzędzi IDE | Zatwierdzona (`accepted`) | System agentów AI |
| [ADR-0010](0010-kontrakt-csharp-ts-przez-probke.md) | Weryfikacja spójności kontraktu C# ↔ TypeScript przez kanoniczne próbki JSON | Proponowana (`proposed`) | Kontrakty i testy |
| [ADR-0011](0011-dokumentacja-hybryda-repo-confluence.md) | Architektura dokumentacji 1:1 (Taksonomia AltexSoft + cykl życia SDD + synchronizacja Confluence) | Zatwierdzona (`accepted`) | Dokumentacja i SDD |
