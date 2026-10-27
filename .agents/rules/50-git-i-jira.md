---
trigger: model_decision
description: "Nazewnictwo gałęzi, commitów i PR oraz powiązanie z Jirą. Stosuj przy każdej operacji git."
---

# Git i Jira

## Gałęzie

| Gałąź | Rola | Kto pisze |
|---|---|---|
| `main` | stan po zakończonym sprincie (demo), tag `sprint-N` | tylko merge z `develop` przez PR na koniec sprintu |
| `develop` | integracja bieżącego sprintu | tylko merge PR |
| `feature/REJ-123-krotki-opis` | nowa funkcja | autor zadania |
| `fix/REJ-123-…` · `docs/REJ-123-…` · `chore/REJ-123-…` · `spike/REJ-123-…` | poprawka · dokumentacja · narzędzia · prototyp badawczy | autor zadania |

Regex sprawdzany w CI: `^(feature|fix|docs|chore|spike)/REJ-[0-9]+-[a-z0-9-]+$`

## Commity

`REJ-123: <czasownik w trybie rozkazującym, po angielsku>` — np. `REJ-123: add fatigue damage on empty deck`.
Opcjonalnie prefiks Conventional Commits w treści PR, nie w commicie.

## Pull Request

- cel: `develop` (wyjątek: PR zamykający sprint `develop → main`);
- ≥ 1 recenzent (dla kontraktów: recenzent z drugiej strony granicy);
- tytuł `REJ-123: …`, opis z szablonu `.github/PULL_REQUEST_TEMPLATE.md`;
- squash merge; gałąź usuwana po merge.

## Agent

- tworzy gałąź i commity lokalnie wg tych zasad;
- `git push` tylko własnej gałęzi roboczej i tylko po zgodzie człowieka; nigdy `--force` na wspólne gałęzie;
- nie merguje, nie zamyka zgłoszeń w Jirze, nie loguje czasu za człowieka.
