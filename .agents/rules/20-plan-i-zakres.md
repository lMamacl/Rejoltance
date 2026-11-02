---
trigger: model_decision
description: "Kiedy przed kodem potrzebna jest zmiana OpenSpec, jak trzymać się zakresu zadania z Jiry i które operacje wymagają zgody człowieka."
---

# 20. Planowanie, zakres zmian i bramki Spec-Driven Development

## 1. Kiedy wymagana jest propozycja zmiany OpenSpec przed kodem?

Propozycja zmiany w katalogu `openspec/changes/<id-zmiany>/` (`proposal.md`, `specs/`, `design.md`, `tasks.md`) oraz jej akceptacja przez człowieka są **obowiązkowe**, gdy zachodzi co najmniej jeden z warunków:

- zadanie ma szacunek **≥ 3 Story Points** (lub obejmuje więcej niż jeden moduł architektoniczny);
- zmiana dodaje nową regułę domenową `R-nn`, nowe słowo kluczowe lub zmienia istniejące zachowanie w `openspec/specs/`;
- zmiana dotyka któregokolwiek z 5 zamrożonych kontraktów w `Rejoltance.Contracts` (wymagany także nowy **ADR**).

Dla małych zadań (**< 3 SP**), poprawek błędów i podzadań technicznych, których zachowanie jest już jednoznacznie opisane w `openspec/specs/`, wystarczy krótki plan wykonawczy (lista modyfikowanych plików i testów) przedstawiony przed edycją kodu.

## 2. Dyscyplina zakresu

- Realizuj wyłącznie zakres określony w bieżącym zadaniu Jira (`REJ-123`) i zaakceptowanym planie.
- Nie wykonuj przy okazji niepowiązanych refaktoryzacji, zmian formatowania w niedotkniętych plikach ani rozbudowy architektury „na zapas” (np. z Fali W2/W3 podczas pracy nad Falą W1).
- Jeśli w trakcie pracy wykryjesz osobny błąd lub potrzebę usprawnienia poza zakresem zadania, zgłoś ją człowiekowi jako kandydat na osobne zadanie w Jirze.

## 3. Działania wymagające jawnej zgody człowieka

Zawsze zapytaj użytkownika o zgodę przed wykonaniem którejkolwiek z poniższych operacji:

1. Zmiana publicznego kontraktu w `src/Rejoltance.Contracts` lub `src/web/src/contracts`.
2. Dodanie nowej zewnętrznej paczki NuGet lub npm.
3. Zmiana konfiguracji potoków CI/CD w `.github/workflows/` lub plików bazowych solucji (`Directory.Build.props`).
4. Usunięcie lub osłabienie istniejącego testu automatycznego.
5. Wykonanie operacji `git push`, `git reset`, `git rebase` lub usunięcie plików poza zakresem zadania.
