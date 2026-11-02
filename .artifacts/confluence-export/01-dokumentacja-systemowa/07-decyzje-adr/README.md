<!-- CONFLUENCE 1:1 EXPORT | Source: docs/01-dokumentacja-systemowa/07-decyzje-adr/README.md @ a2bf2a4 (2026-11-02) -->
# 1.7 Decyzje architektoniczne (ADR)

> **Źródło prawdy:** Repozytorium (`docs/01-dokumentacja-systemowa/07-decyzje-adr/`) · **Kategoria dokumentacji:** Dokumentacja produktowa — systemowa (decyzje architektoniczne ADR) · **Etap SDD:** Fundamenty i planowanie

ADR (Architecture Decision Record) to krótki zapis jednej decyzji: kontekst, rozważane opcje, wybór i jego konsekwencje. Tworzymy go w procesie SDD (spec-driven development, czyli pracy sterowanej specyfikacją).

Osobny ADR dostaje każda ważna decyzja architektoniczna, technologiczna lub procesowa, którą zespół albo prowadzący mógłby zakwestionować za miesiąc. Plik nazywamy `NNNN-tytul.md` i zaczynamy od szablonu [`0000-szablon.md`](0000-szablon.md). Pomaga w tym skill [`rj-write-adr`](../../../.agents/skills/rj-write-adr/SKILL.md).

Zatwierdzonego ADR (`Status: accepted`) nie zmieniamy po fakcie. Jeśli zespół zmienia wcześniejszą decyzję, tworzy nowy ADR, a poprzedni oznacza jako `superseded by ADR-MMMM`. Nowy ADR wymaga akceptacji co najmniej 2 członków zespołu w pull requeście (PR).

W ADR-ach oznaczamy fakty: [V] — zweryfikowane, [Z] — założenie.

---

## Rejestr decyzji (ADR-0001 – ADR-0012)

| Numer ADR | Tytuł decyzji | Status | Główny obszar |
|---|---|---|---|
| [ADR-0001](0001-stos-technologiczny.md) | Stos technologiczny: .NET 10 + React/TypeScript + .NET Aspire | Zatwierdzona (`accepted`) | Technologia i uruchomienie |
| [ADR-0002](0002-github-i-mirror-bitbucket.md) | GitHub jako główne repozytorium robocze i automatyczny mirror do Bitbucket PB | Zatwierdzona (`accepted`) | Proces i repozytoria |
| [ADR-0003](0003-openspec-i-konstytucja.md) | OpenSpec 1.15 jako narzędzie spec-driven development i własna konstytucja projektu | Zatwierdzona (`accepted`) | SDD i agenci AI |
| [ADR-0004](0004-kernel-od-nowa-deterministyczny.md) | Czysty, deterministyczny silnik reguł (`Rejoltance.Kernel`) pisany od nowa w C# | Zatwierdzona (`accepted`) | Architektura domeny |
| [ADR-0005](0005-kanon-regul-prototyp-js.md) | Zachowanie prototypu JS v11 jako kanon zasad gry i wyrocznia testów różnicowych | Zatwierdzona (`accepted`) | Specyfikacja reguł |
| [ADR-0006](0006-serwer-autorytatywny-fog-of-war.md) | Serwer autorytatywny z projekcją stanu dla każdego gracza (ochrona ukrytych informacji) | Zatwierdzona (`accepted`) | Bezpieczeństwo i sieć |
| [ADR-0007](0007-sqlite-potem-postgresql.md) | Baza danych: SQLite na start (Sprinty 0–3), PostgreSQL od Sprintu 4 | Zatwierdzona (`accepted`) | Architektura danych |
| [ADR-0008](0008-spine-first-pionowe-plastry.md) | Najpierw rdzeń (*spine-first*), potem pionowe plastry funkcji | Proponowana (`proposed`) | Planowanie i integracja |
| [ADR-0009](0009-kanon-agentow-i-adaptery.md) | Jeden kanon konfiguracji agentów AI w `.agents/` i adaptery dla 5 narzędzi IDE | Zatwierdzona (`accepted`) | System agentów AI |
| [ADR-0010](0010-kontrakt-csharp-ts-przez-probke.md) | Spójność kontraktu C# ↔ TypeScript sprawdzana kanonicznymi próbkami JSON | Proponowana (`proposed`) | Kontrakty i testy |
| [ADR-0011](0011-dokumentacja-hybryda-repo-confluence.md) | Dokumentacja w układzie 1:1 (taksonomia AltexSoft, cykl życia SDD, synchronizacja z Confluence) | Zatwierdzona (`accepted`) | Dokumentacja i SDD |
| [ADR-0012](0012-konstytucja-v2.md) | Konstytucja v2: nowy układ artykułów, zachowane zakazy dla agentów AI i zasada języka | Proponowana (`proposed`) | Proces i agenci AI |
