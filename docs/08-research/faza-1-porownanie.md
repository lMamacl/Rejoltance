# Faza 1 — porównanie narzędzi i rekomendacje

**Data:** 2026-10-27 · **Autor:** agent (Claude Code) na zlecenie zespołu · **Status:** do akceptacji

Legenda: **[V]** zweryfikowane testem lub odczytem, **[Z]** założenie/wnioskowanie, **[?]** niezweryfikowane.

---

## 1. Środowisko testowe

| Element | Wersja | Jak |
|---|---|---|
| Windows 11 Pro | 10.0.26300 | [V] |
| .NET SDK | 10.0.401 | [V] był zainstalowany |
| Git | 2.56.0 | [V] doinstalowany (`winget install Git.Git`) |
| Node.js | 24.22.1 LTS (npm 11.19) | [V] doinstalowany (`winget install OpenJS.NodeJS.LTS`) |
| uv | 0.13.6 | [V] doinstalowany (`winget install astral-sh.uv`) |
| Spec Kit (`specify-cli`) | 1.2.4 | [V] `uv tool install --python 3.13 specify-cli==1.2.4` |
| OpenSpec (`@fission-ai/openspec`) | 1.15.0 | [V] `npm i -g @fission-ai/openspec` |
| Aspire templates | 13.6.4 | [V] `dotnet new install Aspire.ProjectTemplates` |

Wszystkie testy w katalogu tymczasowym, poza repozytorium.

---

## 2. Spec‑driven development: Spec Kit vs OpenSpec vs „SDD‑lite”

### 2.1 Spec Kit 1.2.4 — wyniki [V]

- `specify init --here --integration agy --script ps` → 3,4 s, skrypty PowerShell działają bez WSL.
- **Wiele narzędzi naraz:** `claude`, `codex`, `gemini` są oznaczone *multi‑install safe* i instalują się obok siebie bez problemu.
  **`agy` (Antigravity) i `copilot` nie są** — da się je dołożyć tylko z `--force`, a `specify integration status` zgłasza wtedy `ERROR unsafe-multi-install`.
  - `agy` i `codex` zapisują **te same pliki** `.agents/skills/speckit-*` (różnica: prefiks wywołania `/speckit-…` vs `$speckit-…`) → kolizja zarządzanych plików.
  - `copilot` zapisuje osobno do `.github/skills/` — faktycznie bez kolizji, mimo flagi.
- Komplet 5 integracji: **64 pliki, ~9 700 linii** (10 skilli × 4 katalogi + 24 pliki `.specify/`).
- Konstytucja: `.specify/memory/constitution.md` + szablony spec/plan/tasks/checklist (84/80/168/34 linii, po angielsku).
- **Gałęzie:** wersja 1.2.4 nie tworzy już gałęzi git sama; tworzy folder `specs/001-<nazwa>` i zapisuje wskaźnik w `.specify/feature.json` (w `.gitignore`). Przetestowane: na gałęzi `feature/REJ-12-mulligan` `setup-plan.ps1` poprawnie znajduje ficzer → **nasz schemat nazw gałęzi z kluczem Jira działa**.
- Brak walidatora artefaktów do CI (jest `integration status`, ale nie walidacja treści speców) [V przez `--help`].
- Pułapki instalacji na Windows:
  - z Pythonem 3.15 pakiet `pyyaml` nie ma gotowych wheeli i wymaga kompilatora C++ → **instalować z `--python 3.13`** [V];
  - w tym środowisku uv wymagał przeniesienia katalogów cache (błąd „przeniesienie na inny dysk”) — to prawdopodobnie efekt piaskownicy agenta, nie typowego laptopa [Z].

### 2.2 OpenSpec 1.15.0 — wyniki [V]

- `openspec init --tools claude,antigravity,codex,github-copilot,gemini --language pl` → **1,4 s, jednym poleceniem, bez konfliktów**.
- Komplet 5 narzędzi: **52 pliki, ~7 800 linii** (6 skilli + komendy/workflowy per narzędzie; Antigravity dostaje też `.agents/workflows/opsx-*.md`).
- **Język:** `--language pl` → artefakty po polsku, nagłówki strukturalne i SHALL/MUST po angielsku (zapisane w `openspec/config.yaml`).
- **„Żywe” specyfikacje:** `openspec/specs/<capability>/spec.md` (wymagania + `#### Scenario:`), zmiany jako delty w `openspec/changes/<nazwa>/`, a `archive` wciela je do specyfikacji. Pasuje do reguł gry R‑nn, które muszą być aktualne przez cały projekt.
- **Walidacja w CI:** `openspec validate --all` — przetestowane; poprawnie odrzuca zmianę bez delt i bez scenariuszy.
- Nazwa zmiany dowolna, np. `rej-12-mulligan` → śledzalność z Jirą bez obejść.
- Brak pojęcia „konstytucji” — zastępuje je `config.yaml` (`context`, `rules` per artefakt), który może wskazywać na nasz plik konstytucji.
- **Telemetria domyślnie włączona** → w `setup.ps1` / `.env.example` ustawiamy `OPENSPEC_TELEMETRY=0`.

### 2.3 „SDD‑lite” (własne szablony + skille, bez CLI) [Z]

Najmniej zależności, pełna kontrola, ale: brak walidacji, brak gotowych komend we wszystkich IDE, każdą zmianę procesu utrzymujemy sami. Sens tylko jako plan awaryjny.

### 2.4 BMAD [Z — nie testowany]

Odrzucony na etapie analizy: symuluje cały zespół (Analyst, PM, Architect…) — dla 6 prawdziwych osób z rolami Scrum to dublowanie ról i największy narzut.

### 2.5 Punktacja (skala 1–5, waga w nawiasie)

| Kryterium | Spec Kit | OpenSpec | SDD‑lite |
|---|---|---|---|
| Próg wejścia dla studentów (3) | 3 | 4 | 4 |
| Wsparcie wielu IDE/agentów (3) | 3 — `agy`/`copilot` tylko z `--force` | **5** — 5 narzędzi jednym poleceniem | 2 |
| Dopasowanie do Jiry i śledzalności (3) | 3 — `specs/001-…`, gałęzie dowolne | **4** — nazwa zmiany = klucz Jira, historia w `archive` | 3 |
| Windows / PowerShell (2) | 4 — działa, ale pułapka z Pythonem 3.15 | 5 | 5 |
| Narzut artefaktów (2) | 3 — ~9,7 tys. linii, ciężkie szablony | 4 — ~7,8 tys. linii | 5 |
| Dojrzałość / utrzymanie (2) | **5** — GitHub, aktywny | 4 | 2 |
| Koszt (1) | 5 | 5 | 5 |
| **Suma (maks. 80)** | **55** | **69** | **55** |

Dodatkowe argumenty spoza tabeli:

- **Za Spec Kit:** jawna konstytucja z bramkami (`/speckit-analyze`, `/speckit-checklist`), szablon `tasks.md` z kolejnością zadań — dobra „szkoła” dla zespołu.
- **Za OpenSpec:** walidacja w CI, żywa specyfikacja reguł, polski język artefaktów, czysta instalacja w 5 narzędziach.

### 2.6 Czego NIE sprawdziłem

Pełnego przebiegu „propose → apply → archive” (OpenSpec) ani „specify → plan → tasks → implement” (Spec Kit) z udziałem agenta na realnym ficzerze. Testy objęły instalację, strukturę plików, skrypty i CLI. Jakość generowanych speców zależy od modelu i oceni ją zespół na pierwszym ficzerze.

---

## 3. Aspire + React/TS + SQLite

| Test | Wynik |
|---|---|
| `dotnet new aspire-ts-cs-starter -f net10.0` (Aspire 13.6.4) | [V] 25 s; układ: `AppHost` + `Server` (ASP.NET Core, `/health`) + `frontend` (React 19, Vite 8, TS 5.9) przez `AddViteApp`; `PublishWithContainerFiles` wkłada build frontu do `wwwroot` serwera |
| `dotnet build` AppHost | [V] 55 s na zimno, 10 s na ciepło, 0 ostrzeżeń |
| `npm ci` + `npm run build` frontendu | [V] 8 s + 16 s |
| Sam serwer `dotnet run` → `GET /health` | [V] `Healthy` |
| `dotnet run --project AppHost` (bez Aspire CLI) | **[?] niezweryfikowane na tym komputerze** — patrz niżej |
| Czy AppHost sam robi `npm install` | [?] nie dało się sprawdzić (AppHost nie wystartował) |
| Działanie bez Dockera | [Z] tak, dopóki nie dodamy kontenerów (Postgres); SQLite to plik |

**Dlaczego AppHost nie wystartował — trzy problemy, z których tylko jeden dotyczy zespołu:**

1. **Smart App Control (Windows 11) blokuje świeżo zbudowany, niepodpisany `AppHost.dll`** (`0x800711C7`, zdarzenia Code Integrity 3033/3077). Na tym komputerze ta funkcja jest włączona (`VerifiedAndReputablePolicyState = 1`). **To dotyczy każdego w zespole, kto ma włączone Smart App Control.** Wyłączenie jest w Ustawieniach Windows (Zabezpieczenia → Kontrola aplikacji i przeglądarki), ale ponownie włączyć da się dopiero po reinstalacji systemu — decyzja należy do właściciela komputera, ja tego nie zmieniam.
2. **Limit 260 znaków ścieżki (MAX_PATH):** `dcp.exe` z pakietu NuGet nie uruchomił się z bardzo długiej ścieżki. W repo: zalecenie krótkiej ścieżki klonu (np. `C:\dev\Rejoltance`) i `git config --system core.longpaths true`.
3. **Certyfikat deweloperski HTTPS:** pierwszy start pokazuje „Ufanie certyfikatom…” i wymaga jednorazowego `dotnet dev-certs https --trust` (okno systemowe — robi to użytkownik). `setup.ps1` będzie o to pytał wprost.

**Plan weryfikacji zastępczej:** w Fazie 2 dodam test integracyjny `Aspire.Hosting.Testing`, który w GitHub Actions (Ubuntu) uruchamia cały AppHost i sprawdza `/health`. Wtedy „jedno polecenie uruchamia całość” jest dowodzone przez CI, a nie przez pojedynczy laptop.

---

## 4. Jira PB — import CSV

- [V] Jira, Bitbucket DC 8.14.4 i Confluence 8.4.5 odpowiadają z publicznego internetu (strony logowania, LDAP).
- [V] Przygotowane pliki testowe: `docs/05-backlog/test-import/` (1 epik, 1 story, 1 sub‑task) + instrukcja.
- [?] Do sprawdzenia przez Ciebie importem: Epic Link po nazwie epiku, Parent Id dla sub‑tasków, format `Original Estimate` (zakładam sekundy: 14400 = 4 h), dostępność Story Points w schemacie „Pracownia projektowa”.
- [V] Integracja agentów z Jirą/Confluence: `mcp-atlassian` obsługuje Server/DC przez Personal Access Token (Jira ≥ 8.14). Token trzyma każdy u siebie w zmiennej środowiskowej; w repo tylko szablon. Domyślnie tryb tylko do odczytu.

---

## 5. Rekomendacje

| Obszar | Rekomendacja | Uzasadnienie |
|---|---|---|
| **SDD** | **OpenSpec 1.15 (przypięta wersja) + nasza konstytucja** w `.agents/rules/00-konstytucja.md`, wskazana w `openspec/config.yaml` | najwyższa punktacja; czysta instalacja w 5 narzędziach; walidacja w CI; żywa specyfikacja reguł; polski język |
| SDD — alternatywa | Spec Kit 1.2.4 (`claude`+`codex`+`gemini` czysto, `agy`/`copilot` z `--force`) | jeśli zespół woli formalne bramki i gotową konstytucję |
| **Struktura repo** | monorepo: `docs/` (PL, strefa projektowa) ⟂ `src/`+`tests/` (EN, kod) ⟂ `openspec/` (specyfikacje) ⟂ `prototype/` (referencja JS) | jeden PR zmienia kontrakt C# i TS naraz |
| **Gałęzie** | `main` (demo po sprincie, tag `sprint-N`) ← `develop` (integracja) ← `feature/REJ-123-krotki-opis` (także `fix/`, `docs/`, `chore/`, `spike/`); commit `REJ-123: …`; PR z ≥1 recenzentem | model pi‑wo + klucz Jira (wymóg handbooka PO); bez `release/hotfix` |
| **Aspire** | szablon `aspire-ts-cs-starter` jako baza; SQLite plikowo; Postgres w kontenerze za parametrem AppHost od S4 | zweryfikowany build; zero Dockera na start |
| **Wymagania na laptopie** | .NET 10 SDK, Node 24 LTS, Git (`core.longpaths`), uv (Python 3.13 dla narzędzi), opcjonalnie Aspire CLI; Docker dopiero od S4 | wynik testów |
| **Ryzyka do komunikatu dla zespołu** | Smart App Control, długie ścieżki/OneDrive, zaufanie certyfikatu dev | wszystkie trzy wystąpiły w teście |

---

## 6. Decyzje do akceptacji (STOP Fazy 1)

1. Narzędzie SDD: **OpenSpec** (rekomendacja) czy **Spec Kit**?
2. Akceptacja schematu gałęzi i commitów jak w tabeli.
3. Czy wyłączasz Smart App Control na tym komputerze (lub weryfikujemy AppHost na innym laptopie / w CI)?
4. Wynik testowego importu CSV (tabela w `docs/05-backlog/test-import/README.md`) — może poczekać do Fazy 3.
