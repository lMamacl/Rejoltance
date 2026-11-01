---
name: rj-sprint-report
description: Prepares Sprint Review and Retrospective material - sprint goal status, demo script, estimate vs actual table from a Jira export, burndown notes and improvement actions. Use at the end of a sprint.
---

# Raport sprintu (Review + Retro)

## Wejście

Eksport CSV z Jiry dla sprintu (klucz, podsumowanie, przypisany, status, Original Estimate, Time Spent, SP), cel sprintu, notatki z daily.

## Kroki

1. Skopiuj `docs/06-scrum/szablon-review-retro.md` do `docs/06-scrum/sprinty/sprint-N/review-retro.md`.
2. **Review:** cel sprintu (osiągnięty / częściowo / nie), lista ukończonych story z demo (kto pokazuje, kroki), feedback użytkowników.
3. **Estymata vs rzeczywistość:** tabela klucz · zadanie · właściciel · estymata h · rzeczywiste h · Δ · przyczyna. Liczby tylko z eksportu.
4. Metryki: velocity (SP ukończone), % godzin vs plan, zadania przeniesione do backlogu.
5. **Retro:** co działało · co nie · max 3 akcje z właścicielem.
6. Przypomnij PO: zrzut ekranu Burndown (godziny i zadania) z Jiry do Confluence.

## Nie wolno

Oceniać osób; zmyślać przyczyn odchyleń — pytaj właściciela zadania.
