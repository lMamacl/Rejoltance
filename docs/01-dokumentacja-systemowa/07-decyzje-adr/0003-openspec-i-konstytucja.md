# ADR-0003: OpenSpec jako narzędzie spec‑driven development + własna konstytucja

- **Status:** zatwierdzona (2026-10-27, akceptacja Fazy 1)
- **Data:** 2026-10-27
- **Powiązane:** [`03-dokumentacja-procesowa/04-badania-i-analizy/faza-1-porownanie.md`](../../03-dokumentacja-procesowa/04-badania-i-analizy/faza-1-porownanie.md), `.agents/rules/00-konstytucja.md`, `openspec/config.yaml`

## Kontekst i problem

Zespół używa naraz kilku narzędzi AI (Claude Code, Antigravity, Codex, Copilot, Gemini). Potrzebujemy jednego procesu
„specyfikacja → plan → zadania → kod”, który działa we wszystkich tych narzędziach. Potrzebujemy też trwałych zasad dla agentów.

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Spec Kit 1.2.4 | wbudowana konstytucja i bramki jakości, dojrzały | `agy` i `copilot` nie są *multi‑install safe* (tylko `--force`, status ERROR); ~9,7 tys. linii szablonów | 55/80 pkt w teście |
| **OpenSpec 1.15** | 5 narzędzi jednym poleceniem, `--language pl`, `validate` w CI (ciągłej integracji), żywe specyfikacje | brak wbudowanej konstytucji; telemetria domyślnie włączona | 69/80 pkt |
| SDD‑lite (własne) | zero zależności | brak walidacji i komend w IDE | utrzymanie własnymi siłami |

## Decyzja

W kontekście wielu narzędzi AI w jednym zespole, mierząc się z ryzykiem rozjazdu procesu, wybieramy **OpenSpec (przypięty w `package.json`)
z własną konstytucją** w `.agents/rules/00-konstytucja.md` (wskazaną w `openspec/config.yaml`) zamiast Spec Kit, aby mieć czystą instalację
we wszystkich narzędziach, walidację w CI i żywą specyfikację reguł gry, akceptując brak wbudowanych bramek (zastępują je reguły i agenci weryfikujący).

## Konsekwencje

### Pozytywne

- Reguły gry żyją w `openspec/specs/` (55 wymagań, walidowanych w CI z flagą `--strict`).
- Funkcja warta ≥ 3 SP (story points) przechodzi przez `/opsx:propose` → akceptacja → `/opsx:apply` → `/opsx:archive`.

### Negatywne / ryzyka

- Trzeba ustawiać `OPENSPEC_TELEMETRY=0`. Zmienna jest już w `.env.example`, w CI i w `.claude/settings.json`.
- Aktualizacja OpenSpec wymaga PR (pull requesta) z `openspec update` i przeglądu zmian w skillach.
