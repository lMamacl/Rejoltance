# Instrukcje dla GitHub Copilot

Zasady projektu: `AGENTS.md` (czytaj zawsze) oraz konstytucja `.agents/rules/00-konstytucja.md`.
Reguły szczegółowe są w `.github/instructions/*.instructions.md` (generowane z `.agents/rules/`).
Custom agents: `.github/agents/rj-*.agent.md`; skille: `.github/skills/`; komendy OpenSpec: `/opsx-propose`, `/opsx-apply`, `/opsx-archive`.

Najkrócej: klucz Jira w gałęzi i commicie, Kernel bez `System.Random`/zegara/IO, klient wysyła tylko `Intent`,
kontrakt C# i TS zmieniasz w jednym PR, nie edytujesz plików generowanych, nie pushujesz do `main`/`develop`.
