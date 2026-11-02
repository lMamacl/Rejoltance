"""Validate the 1:1 Confluence documentation tree in docs/ (AltexSoft + SDD) and optionally export a Confluence bundle.

Usage:
    python tools/confluence/sync_confluence.py --check   # validate structure, required AltexSoft docs, and internal links
    python tools/confluence/sync_confluence.py --export  # validate and export 1:1 Confluence bundle to .artifacts/confluence-export/

Standard library only (Python 3.11+).
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCS_DIR = ROOT / "docs"
EXPORT_DIR = ROOT / ".artifacts" / "confluence-export"

EXPECTED_SECTIONS = {
    "00-przewodnik-i-setup": "00. Przewodnik i konfiguracja środowiska",
    "01-dokumentacja-systemowa": "01. Dokumentacja produktowa — systemowa (PRD i SAD)",
    "02-dokumentacja-uzytkownika": "02. Dokumentacja produktowa — użytkownika i wdrożenia",
    "03-dokumentacja-procesowa": "03. Dokumentacja procesowa i zarządcza",
    "04-system-agentow-ai": "04. System agentów AI i SDD",
    "05-szablony": "05. Biblioteka szablonów dokumentacji",
    "99-archiwum-zrodel": "99. Archiwum źródeł (tylko do odczytu)",
}

REQUIRED_CORE_FILES = [
    "README.md",
    "00-przewodnik-i-setup/README.md",
    "00-przewodnik-i-setup/01-szybki-start-i-instalacja.md",
    "00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md",
    "00-przewodnik-i-setup/03-proces-pracy-i-git-scrum.md",
    "00-przewodnik-i-setup/04-sciaga-komend.md",
    "00-przewodnik-i-setup/05-slownik-pojec.md",
    "00-przewodnik-i-setup/06-decyzje-otwarte-i-zalozenia.md",
    "00-przewodnik-i-setup/07-plan-wdrozenia-i-migracji.md",
    "01-dokumentacja-systemowa/README.md",
    "01-dokumentacja-systemowa/01-prd-wymagania-produktu.md",
    "01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md",
    "01-dokumentacja-systemowa/03-indeks-regul-r-nn.md",
    "01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md",
    "01-dokumentacja-systemowa/05-sad-architektura-systemu.md",
    "01-dokumentacja-systemowa/06-stos-technologiczny.md",
    "01-dokumentacja-systemowa/07-decyzje-adr/README.md",
    "01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md",
    "01-dokumentacja-systemowa/09-kontrakty-i-api.md",
    "01-dokumentacja-systemowa/10-ux-design-i-przeplywy.md",
    "01-dokumentacja-systemowa/11-strategia-testow-qa.md",
    "02-dokumentacja-uzytkownika/README.md",
    "02-dokumentacja-uzytkownika/01-podrecznik-gracza.md",
    "02-dokumentacja-uzytkownika/02-instrukcja-wdrozenia-i-utrzymania.md",
    "03-dokumentacja-procesowa/README.md",
    "03-dokumentacja-procesowa/01-dip-dokument-inicjujacy.md",
    "03-dokumentacja-procesowa/02-backlog/README.md",
    "03-dokumentacja-procesowa/02-backlog/BACKLOG.md",
    "04-system-agentow-ai/README.md",
    "04-system-agentow-ai/01-architektura-i-konfiguracja-agentow.md",
    "04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md",
    "04-system-agentow-ai/03-jak-pisac-specyfikacje-openspec.md",
    "04-system-agentow-ai/04-warsztat-tworzenie-agentow-skilli-i-kart.md",
    "05-szablony/README.md",
    "05-szablony/naglowek-strony-confluence.md",
    "05-szablony/szablon-prd.md",
    "05-szablony/szablon-sad.md",
    "05-szablony/szablon-tdd.md",
]

LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
FENCE_RE = re.compile(r"^```")


def strip_code_fences(markdown: str) -> str:
    lines: list[str] = []
    in_fence = False
    for line in markdown.splitlines():
        if FENCE_RE.match(line.strip()):
            in_fence = not in_fence
            continue
        if not in_fence:
            lines.append(line)
    return "\n".join(lines)


def validate_tree() -> tuple[list[str], list[Path]]:
    errors: list[str] = []

    actual_dirs = {d.name for d in DOCS_DIR.iterdir() if d.is_dir()}
    unexpected = sorted(actual_dirs - set(EXPECTED_SECTIONS))
    missing_dirs = sorted(set(EXPECTED_SECTIONS) - actual_dirs)
    for d in unexpected:
        errors.append(f"docs/{d}: unexpected top-level directory (breaks 1:1 Confluence mapping)")
    for d in missing_dirs:
        errors.append(f"docs/{d}: missing expected 1:1 Confluence section directory")

    for req in REQUIRED_CORE_FILES:
        target = DOCS_DIR / req
        if not target.exists():
            errors.append(f"docs/{req}: missing required core AltexSoft/SDD document")

    md_files = sorted(
        p for p in DOCS_DIR.rglob("*.md")
        if "99-archiwum-zrodel" not in p.parts
    )

    for md in md_files:
        text = strip_code_fences(md.read_text(encoding="utf-8"))
        for match in LINK_RE.finditer(text):
            raw_target = match.group(1).strip()
            if (
                not raw_target
                or raw_target.startswith(("http://", "https://", "mailto:", "#"))
                or "<" in raw_target
                or "⟩" in raw_target
            ):
                continue
            path_part = raw_target.split("#", 1)[0].strip()
            if not path_part:
                continue
            resolved = (md.parent / path_part).resolve()
            if not resolved.exists():
                rel_src = md.relative_to(ROOT).as_posix()
                errors.append(f"{rel_src}: broken relative link -> {raw_target!r}")

    return errors, md_files


def git_commit_short() -> str:
    try:
        res = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        return res.stdout.strip()
    except Exception:
        return "local"


def export_bundle(md_files: list[Path]) -> None:
    commit = git_commit_short()
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    manifest: list[dict[str, str]] = []

    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    for md in md_files:
        rel_docs = md.relative_to(DOCS_DIR).as_posix()
        rel_repo = md.relative_to(ROOT).as_posix()
        content = md.read_text(encoding="utf-8")
        title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else md.stem

        banner = (
            f"<!-- CONFLUENCE 1:1 EXPORT | Source: {rel_repo} @ {commit} ({today}) -->\n"
        )
        dest = EXPORT_DIR / rel_docs
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(banner + content, encoding="utf-8", newline="\n")

        section_key = md.relative_to(DOCS_DIR).parts[0] if len(md.relative_to(DOCS_DIR).parts) > 1 else "ROOT"
        manifest.append(
            {
                "title": title,
                "section": EXPECTED_SECTIONS.get(section_key, "RE:JOLTANCE — Strona Główna"),
                "repo_path": rel_repo,
                "export_path": dest.relative_to(ROOT).as_posix(),
                "commit": commit,
                "exported_at": today,
            }
        )

    (EXPORT_DIR / "manifest.json").write_text(
        json.dumps({"space": "REJOLTANCE", "pages": manifest}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", help="validate 1:1 Confluence structure and links")
    parser.add_argument("--export", action="store_true", help="validate and write Confluence export bundle")
    args = parser.parse_args()

    errors, md_files = validate_tree()
    if errors:
        print("Confluence 1:1 validation errors:")
        for err in errors:
            print(f"  - {err}")
        return 1

    if args.export:
        export_bundle(md_files)
        print(f"OK: validated and exported {len(md_files)} Confluence pages to {EXPORT_DIR.relative_to(ROOT).as_posix()}/")
        return 0

    print(
        f"OK: Confluence 1:1 tree valid ({len(EXPECTED_SECTIONS)} sections, "
        f"{len(REQUIRED_CORE_FILES)} core AltexSoft/SDD files, {len(md_files)} active Markdown pages, 0 broken links)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
