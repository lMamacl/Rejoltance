# ADR-0003: OpenSpec jako narzędzie spec‑driven development + własna konstytucja

- **Status:** accepted (2026-10-27, akceptacja Fazy 1)
- **Data:** 2026-10-27
- **Powiązane:** `docs/08-research/faza-1-porownanie.md`, `.agents/rules/00-konstytucja.md`, `openspec/config.yaml`

## Kontekst i problem

Zespół pracuje z kilkoma narzędziami AI naraz (Claude Code, Antigravity, Codex, Copilot, Gemini). Potrzebny jest jeden proces
„specyfikacja → plan → zadania → kod”, który działa we wszystkich narzędziach, oraz trwałe zasady dla agentów.

## Rozważane opcje

| Opcja | Zalety | Wady | Koszt / ryzyko |
|---|---|---|---|
| Spec Kit 1.2.4 | konstytucja i bramki jakości wbudowane, dojrzały | `agy` i `copilot` nie są *multi‑install safe* (tylko `--force`, status ERROR); ~9,7 tys. linii szablonów | 55/80 pkt w teście |
| **OpenSpec 1.15** | 5 narzędzi jednym poleceniem, `--language pl`, `validate` w CI, żywe specyfikacje | brak wbudowanej konstytucji; telemetria domyślnie włączona | 69/80 pkt |
| SDD‑lite (własne) | zero zależności | brak walidacji i komend w IDE | utrzymanie własnymi siłami |

## Decyzja

W kontekście wielu narzędzi AI w jednym zespole, mierząc się z ryzykiem rozjazdu procesu, wybieramy **OpenSpec (przypięty w `package.json`)
z własną konstytucją** w `.agents/rules/00-konstytucja.md` (wskazaną w `openspec/config.yaml`) zamiast Spec Kit, aby mieć czystą instalację
we wszystkich narzędziach, walidację w CI i żywą specyfikację reguł gry, akceptując brak wbudowanych bramek (zastępują je reguły i agenci weryfikujący).

## Konsekwencje

### Pozytywne

- Reguły gry żyją w `openspec/specs/` (55 wymagań, walidowane `--strict` w CI).
- Ficzer ≥ 3 SP przechodzi przez `/opsx:propose` → akceptacja → `/opsx:apply` → `/opsx:archive`.

### Negatywne / ryzyka

- `OPENSPEC_TELEMETRY=0` trzeba ustawiać (jest w `.env.example`, CI, `.claude/settings.json`).
- Aktualizacja OpenSpec = PR z `openspec update` i przeglądem zmian w skillach.
