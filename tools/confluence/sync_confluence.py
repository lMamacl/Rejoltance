"""Validate the 1:1 Confluence documentation tree in docs/ (AltexSoft + SDD), export Markdown/XHTML bundles,
and publish the entire page hierarchy directly to Atlassian Confluence 8.4.5 (devtools.wi.pb.edu.pl/confluence).

Usage:
    # 1. Validate structure, required core docs, and internal links (used in CI):
    python tools/confluence/sync_confluence.py --check

    # 2. Export ready-to-paste Markdown + Confluence Storage XHTML bundle + manifest.json:
    python tools/confluence/sync_confluence.py --export

    # 3. Dry-run publishing (shows exact parent -> child tree that will be created in Confluence):
    python tools/confluence/sync_confluence.py --publish --dry-run

    # 4. Publish all 67 pages automatically to WI PB Confluence 8.4.5 via REST API:
    python tools/confluence/sync_confluence.py --publish \\
        --url https://devtools.wi.pb.edu.pl/confluence \\
        --token TWOJ_PERSONAL_ACCESS_TOKEN

    # (Optional) If using login/password instead of a Personal Access Token:
    python tools/confluence/sync_confluence.py --publish \\
        --url https://devtools.wi.pb.edu.pl/confluence \\
        --user twoj_login --password twoje_haslo

    # 5. Publish selected pages (parent README pages are included automatically):
    python tools/confluence/sync_confluence.py --publish \
        --include docs/04-system-agentow-ai/03-jak-pisac-specyfikacje-openspec.md \
        --url https://devtools.wi.pb.edu.pl/confluence

Standard library only (Python 3.11+).
"""

from __future__ import annotations

import argparse
import base64
import html
import json
import os
import re
import ssl
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCS_DIR = ROOT / "docs"
EXPORT_DIR = ROOT / ".artifacts" / "confluence-export"
DEFAULT_CONFLUENCE_URL = "https://devtools.wi.pb.edu.pl/confluence"
DEFAULT_SPACE_NAME_HINT = "TU WPISAC NAZWE PROJEKTU PROJEKT!!!!"

EXPECTED_SECTIONS = {
    "00-przewodnik-i-setup": "00. Przewodnik i konfiguracja środowiska",
    "01-dokumentacja-systemowa": "01. Dokumentacja produktowa — systemowa (PRD i SAD)",
    "02-dokumentacja-uzytkownika": "02. Dokumentacja produktowa — użytkownika i wdrożenia",
    "03-dokumentacja-procesowa": "03. Dokumentacja procesowa i zarządcza",
    "04-system-agentow-ai": "04. System agentów AI i SDD",
    "05-szablony": "05. Biblioteka szablonów dokumentacji",
    "99-archiwum-zrodel": "99. Archiwum źródeł (tylko do odczytu)",
}

SUBSECTION_TITLES = {
    "01-dokumentacja-systemowa/07-decyzje-adr": "1.7 Decyzje architektoniczne (ADR)",
    "03-dokumentacja-procesowa/02-backlog": "3.2 Rejestr produktu i eksport do Jiry PB",
    "03-dokumentacja-procesowa/03-scrum-i-spotkania": "3.3 Ceremonie Scrum, raporty sprintów i spotkania zespołu",
    "03-dokumentacja-procesowa/04-badania-i-analizy": "3.4 Badania techniczne i analizy porównawcze",
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
        p
        for p in DOCS_DIR.rglob("*.md")
        if "99-archiwum-zrodel" not in p.parts and "test-import" not in p.parts
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


def select_pages(md_files: list[Path], patterns: list[str]) -> tuple[list[str], list[Path]]:
    """Select pages by repository/docs-relative paths and include their README parents."""
    pages_by_path = {path.resolve(): path for path in md_files}
    selected: set[Path] = set()
    errors: list[str] = []

    for raw_pattern in patterns:
        pattern = raw_pattern.replace("\\", "/")
        if Path(pattern).is_absolute():
            matches = [path for path in md_files if path.resolve().match(pattern)]
        else:
            matches = [
                path
                for path in md_files
                if path.relative_to(ROOT).as_posix() == pattern
                or path.relative_to(DOCS_DIR).as_posix() == pattern
                or path.match(pattern)
            ]
        if not matches:
            errors.append(f"--include pattern matched no active Markdown pages: {raw_pattern}")
        selected.update(path.resolve() for path in matches)

    for path in list(selected):
        current = path.parent
        while current == DOCS_DIR or DOCS_DIR in current.parents:
            parent_readme = current / "README.md"
            resolved_parent = parent_readme.resolve()
            if resolved_parent in pages_by_path:
                selected.add(resolved_parent)
            if current == DOCS_DIR:
                break
            current = current.parent

    return errors, sorted((pages_by_path[path] for path in selected), key=lambda path: path.as_posix())


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


def resolve_page_title_and_parent(md: Path) -> tuple[str, str | None, int]:
    """Return (confluence_page_title, parent_page_title, depth_level) for a file in docs/."""
    rel = md.relative_to(DOCS_DIR).as_posix()
    parts = md.relative_to(DOCS_DIR).parts

    if rel == "README.md":
        return ("__SPACE_HOME__", None, 0)

    top_dir = parts[0]
    section_title = EXPECTED_SECTIONS[top_dir]

    if len(parts) == 2 and parts[1] == "README.md":
        return (section_title, "__SPACE_HOME__", 1)

    if len(parts) == 3 and parts[2] == "README.md":
        sub_key = f"{parts[0]}/{parts[1]}"
        sub_title = SUBSECTION_TITLES.get(sub_key, parts[1])
        return (sub_title, section_title, 2)

    content = md.read_text(encoding="utf-8")
    title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    raw_title = title_match.group(1).strip() if title_match else md.stem
    raw_title = re.sub(r"`([^`]+)`", r"\1", raw_title)

    # Disambiguate short titles in subsections
    if rel == "03-dokumentacja-procesowa/02-backlog/BACKLOG.md":
        raw_title = "3.2.1 Zestawienie pojemności sprintów i lista zadań (BACKLOG)"
    elif rel == "03-dokumentacja-procesowa/02-backlog/instrukcja-importu-jira.md":
        raw_title = "3.2.2 Instrukcja importu plików CSV do Jiry PB"

    if len(parts) == 2:
        return (raw_title, section_title, 2)

    sub_key = f"{parts[0]}/{parts[1]}"
    parent_title = SUBSECTION_TITLES.get(sub_key, section_title)
    return (raw_title, parent_title, 3)


def format_inline_xhtml(text: str) -> str:
    """Convert inline Markdown (code spans, links, bold, italic, <br/>) to valid XHTML."""
    placeholders: list[str] = []

    def save_placeholder(fragment: str) -> str:
        idx = len(placeholders)
        placeholders.append(fragment)
        return f"@@PH_{idx}@@"

    # 0. Preserve <br> / <br/> / <br /> tags as valid XHTML <br />
    text = re.sub(r"<br\s*/?>", lambda _: save_placeholder("<br />"), text, flags=re.IGNORECASE)

    # 1. Inline code `...`
    def repl_code(m: re.Match[str]) -> str:
        return save_placeholder(f"<code>{html.escape(m.group(1))}</code>")

    text = re.sub(r"`([^`]+)`", repl_code, text)

    # 2. Links [label](url)
    def repl_link(m: re.Match[str]) -> str:
        label = html.escape(m.group(1))
        url = m.group(2).strip()
        if url.startswith(("http://", "https://", "mailto:")):
            return save_placeholder(f'<a href="{html.escape(url, quote=True)}">{label}</a>')
        return save_placeholder(f"<strong>{label}</strong> (<code>{html.escape(url)}</code>)")

    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", repl_link, text)

    # Escape remaining HTML characters
    text = html.escape(text)

    # Bold **...** and Italic *...*
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", text)

    # Expand in reverse order so nested placeholders (e.g. [`code`](link)) resolve cleanly
    for idx in range(len(placeholders) - 1, -1, -1):
        text = text.replace(f"@@PH_{idx}@@", placeholders[idx])

    return text


def markdown_to_confluence_storage(markdown_text: str, rel_repo: str, commit: str, today: str, is_index: bool = False) -> str:
    """Convert a project Markdown document into Confluence 8.4.5 Storage XHTML format."""
    lines = markdown_text.splitlines()
    out: list[str] = []

    # Top synchronization banner as Confluence Info Macro
    out.append(
        '<ac:structured-macro ac:name="info">'
        "<ac:rich-text-body>"
        f"<p><strong>Synchronizacja 1:1 z repozytorium Git:</strong> <code>{html.escape(rel_repo)}</code> "
        f"(commit <code>{html.escape(commit)}</code>, data eksportu: <code>{html.escape(today)}</code>)</p>"
        "</ac:rich-text-body>"
        "</ac:structured-macro>"
    )

    i = 0
    n = len(lines)
    skipped_h1 = False

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        # Skip leading HTML comment if present
        if stripped.startswith("<!--") and stripped.endswith("-->"):
            i += 1
            continue

        # Horizontal rule
        if re.match(r"^-{3,}$", stripped):
            out.append("<hr />")
            i += 1
            continue

        # Fenced code block
        if stripped.startswith("```"):
            lang = stripped[3:].strip() or "none"
            code_lines: list[str] = []
            i += 1
            while i < n and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1  # consume closing ```
            code_body = "\n".join(code_lines).replace("]]>", "]]]]><![CDATA[>")
            mapped_lang = "none" if lang in ("mermaid", "text", "ascii") else lang
            if lang == "mermaid":
                out.append(f"<p><em>Diagram przepływu (Mermaid):</em></p>")
            out.append(
                '<ac:structured-macro ac:name="code">'
                f'<ac:parameter ac:name="language">{html.escape(mapped_lang)}</ac:parameter>'
                f"<ac:plain-text-body><![CDATA[{code_body}]]></ac:plain-text-body>"
                "</ac:structured-macro>"
            )
            continue

        # Headings
        h_match = re.match(r"^(#{1,6})\s+(.+)$", stripped)
        if h_match:
            level = len(h_match.group(1))
            title_txt = h_match.group(2).strip()
            if level == 1 and not skipped_h1:
                skipped_h1 = True
                i += 1
                continue
            out.append(f"<h{level}>{format_inline_xhtml(title_txt)}</h{level}>")
            i += 1
            continue

        # Blockquote
        if stripped.startswith(">"):
            q_lines: list[str] = []
            while i < n and lines[i].strip().startswith(">"):
                clean_q = re.sub(r"^>\s?", "", lines[i].strip())
                if clean_q:
                    q_lines.append(format_inline_xhtml(clean_q))
                i += 1
            if q_lines:
                out.append("<blockquote><p>" + "<br />".join(q_lines) + "</p></blockquote>")
            continue

        # Markdown Table
        if "|" in stripped and i + 1 < n and re.match(r"^\|?[\s:-]+\|[\s|:-]*$", lines[i + 1].strip()):
            header_cells = [c.strip() for c in stripped.strip("|").split("|")]
            i += 2  # skip header and separator row
            body_rows: list[list[str]] = []
            while i < n and "|" in lines[i].strip() and lines[i].strip():
                row_cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                body_rows.append(row_cells)
                i += 1
            out.append("<table><thead><tr>")
            for hc in header_cells:
                out.append(f"<th><p>{format_inline_xhtml(hc)}</p></th>")
            out.append("</tr></thead><tbody>")
            for row in body_rows:
                out.append("<tr>")
                for col_idx in range(len(header_cells)):
                    val = row[col_idx] if col_idx < len(row) else ""
                    out.append(f"<td><p>{format_inline_xhtml(val)}</p></td>")
                out.append("</tr>")
            out.append("</tbody></table>")
            continue

        # Unordered or Ordered List
        ul_match = re.match(r"^[-*]\s+(.+)$", stripped)
        ol_match = re.match(r"^\d+\.\s+(.+)$", stripped)
        if ul_match or ol_match:
            tag = "ul" if ul_match else "ol"
            pattern = re.compile(r"^[-*]\s+(.+)$") if ul_match else re.compile(r"^\d+\.\s+(.+)$")
            items: list[str] = []
            while i < n:
                cur = lines[i].strip()
                m_item = pattern.match(cur)
                if m_item:
                    items.append(format_inline_xhtml(m_item.group(1)))
                    i += 1
                elif items and lines[i].startswith("  ") and cur:
                    items[-1] += " " + format_inline_xhtml(cur)
                    i += 1
                else:
                    break
            out.append(f"<{tag}>" + "".join(f"<li>{it}</li>" for it in items) + f"</{tag}>")
            continue

        # Standard paragraph
        para_lines: list[str] = []
        while i < n:
            cur = lines[i].strip()
            if (
                not cur
                or cur.startswith(("```", "#", ">", "---"))
                or re.match(r"^[-*]\s+.+$", cur)
                or re.match(r"^\d+\.\s+.+$", cur)
                or ("|" in cur and i + 1 < n and re.match(r"^\|?[\s:-]+\|[\s|:-]*$", lines[i + 1].strip()))
            ):
                break
            para_lines.append(format_inline_xhtml(cur))
            i += 1
        if para_lines:
            out.append("<p>" + " ".join(para_lines) + "</p>")

    if is_index:
        out.append(
            "<h2>Podstrony w tej sekcji (Drzewo Confluence)</h2>"
            '<ac:structured-macro ac:name="children">'
            '<ac:parameter ac:name="all">true</ac:parameter>'
            "</ac:structured-macro>"
        )

    return "\n".join(out)


def build_ordered_page_plan(md_files: list[Path]) -> list[dict[str, object]]:
    """Build a topologically sorted list of pages (parents before children)."""
    commit = git_commit_short()
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    items: list[dict[str, object]] = []

    for md in md_files:
        rel_docs = md.relative_to(DOCS_DIR).as_posix()
        rel_repo = md.relative_to(ROOT).as_posix()
        title, parent_title, depth = resolve_page_title_and_parent(md)
        content = md.read_text(encoding="utf-8")
        is_index = md.name == "README.md"
        storage_xhtml = markdown_to_confluence_storage(content, rel_repo, commit, today, is_index=is_index)

        items.append(
            {
                "title": title,
                "parent_title": parent_title,
                "depth": depth,
                "rel_docs": rel_docs,
                "rel_repo": rel_repo,
                "markdown": content,
                "storage_xhtml": storage_xhtml,
                "commit": commit,
                "exported_at": today,
            }
        )

    items.sort(key=lambda x: (int(x["depth"]), str(x["rel_docs"])))
    return items


def export_bundle(md_files: list[Path]) -> None:
    plan = build_ordered_page_plan(md_files)
    manifest: list[dict[str, object]] = []

    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    for item in plan:
        rel_docs = str(item["rel_docs"])
        rel_repo = str(item["rel_repo"])
        commit = str(item["commit"])
        today = str(item["exported_at"])
        content = str(item["markdown"])
        xhtml_body = str(item["storage_xhtml"])

        banner = f"<!-- CONFLUENCE 1:1 EXPORT | Source: {rel_repo} @ {commit} ({today}) -->\n"
        dest_md = EXPORT_DIR / rel_docs
        dest_md.parent.mkdir(parents=True, exist_ok=True)
        dest_md.write_text(banner + content, encoding="utf-8", newline="\n")

        dest_xhtml = dest_md.with_suffix(".xhtml")
        dest_xhtml.write_text(xhtml_body + "\n", encoding="utf-8", newline="\n")

        manifest.append(
            {
                "title": item["title"],
                "parent_title": item["parent_title"],
                "depth": item["depth"],
                "repo_path": rel_repo,
                "export_md_path": dest_md.relative_to(ROOT).as_posix(),
                "export_xhtml_path": dest_xhtml.relative_to(ROOT).as_posix(),
                "commit": commit,
                "exported_at": today,
            }
        )

    (EXPORT_DIR / "manifest.json").write_text(
        json.dumps(
            {
                "confluence_url": DEFAULT_CONFLUENCE_URL,
                "space_name_hint": DEFAULT_SPACE_NAME_HINT,
                "total_pages": len(manifest),
                "pages": manifest,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


class ConfluenceClient:
    """Minimal REST API client for Atlassian Confluence Server / Data Center 8.4.5."""

    def __init__(self, base_url: str, token: str | None, user: str | None, password: str | None, insecure: bool = False) -> None:
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "X-Atlassian-Token": "no-check",
        }
        if token:
            self.headers["Authorization"] = f"Bearer {token}"
        elif user and password:
            creds = base64.b64encode(f"{user}:{password}".encode("utf-8")).decode("ascii")
            self.headers["Authorization"] = f"Basic {creds}"
        else:
            raise ValueError("Provide either --token (Personal Access Token) or --user and --password.")

        self.ssl_ctx = ssl._create_unverified_context() if insecure else ssl.create_default_context()

    def request(self, method: str, path: str, params: dict[str, str] | None = None, payload: dict[str, object] | None = None) -> dict[str, object]:
        url = f"{self.base_url}{path}"
        if params:
            url += "?" + urllib.parse.urlencode(params)
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8") if payload is not None else None
        req = urllib.request.Request(url, data=data, headers=self.headers, method=method)
        try:
            with urllib.request.urlopen(req, context=self.ssl_ctx, timeout=30) as resp:
                raw = resp.read().decode("utf-8")
                return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as exc:
            err_body = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"HTTP {exc.code} on {method} {url}: {err_body[:400]}") from exc

    def resolve_space(self, space_key: str | None) -> tuple[str, str, str]:
        """Return (space_key, space_name, homepage_id)."""
        if space_key:
            data = self.request("GET", f"/rest/api/space/{urllib.parse.quote(space_key)}", {"expand": "homepage"})
            homepage = data.get("homepage") or {}
            return (str(data["key"]), str(data["name"]), str(homepage["id"]))

        # Auto-discover space matching "2026PT GCDC" or single non-personal space
        spaces_resp = self.request("GET", "/rest/api/space", {"limit": "100", "expand": "homepage"})
        results = spaces_resp.get("results") or []
        for sp in results:
            name = str(sp.get("name", ""))
            key = str(sp.get("key", ""))
            if DEFAULT_SPACE_NAME_HINT.lower() in name.lower() or "gcdc" in key.lower():
                hp = sp.get("homepage") or {}
                return (key, name, str(hp["id"]))

        available = ", ".join(f"{sp.get('key')} ({sp.get('name')})" for sp in results)
        raise RuntimeError(
            f"Could not auto-detect space matching '{DEFAULT_SPACE_NAME_HINT}'. "
            f"Available spaces: {available}. Pass --space-key <KEY> explicitly."
        )

    def find_page_by_title(self, space_key: str, title: str) -> dict[str, object] | None:
        resp = self.request(
            "GET",
            "/rest/api/content",
            {"spaceKey": space_key, "title": title, "expand": "version,ancestors"},
        )
        results = resp.get("results") or []
        return results[0] if results else None

    def get_page_by_id(self, page_id: str) -> dict[str, object]:
        return self.request("GET", f"/rest/api/content/{page_id}", {"expand": "version"})

    def create_or_update_page(self, space_key: str, title: str, storage_xhtml: str, parent_id: str) -> str:
        existing = self.find_page_by_title(space_key, title)
        if existing:
            page_id = str(existing["id"])
            cur_ver = int((existing.get("version") or {}).get("number", 1))
            payload = {
                "id": page_id,
                "type": "page",
                "title": title,
                "space": {"key": space_key},
                "ancestors": [{"id": str(parent_id)}],
                "version": {"number": cur_ver + 1, "minorEdit": True},
                "body": {"storage": {"value": storage_xhtml, "representation": "storage"}},
            }
            self.request("PUT", f"/rest/api/content/{page_id}", payload=payload)
            return page_id

        payload = {
            "type": "page",
            "title": title,
            "space": {"key": space_key},
            "ancestors": [{"id": str(parent_id)}],
            "body": {"storage": {"value": storage_xhtml, "representation": "storage"}},
        }
        created = self.request("POST", "/rest/api/content", payload=payload)
        return str(created["id"])

    def update_homepage(self, space_key: str, homepage_id: str, storage_xhtml: str) -> None:
        hp = self.get_page_by_id(homepage_id)
        hp_title = str(hp["title"])
        cur_ver = int((hp.get("version") or {}).get("number", 1))
        payload = {
            "id": homepage_id,
            "type": "page",
            "title": hp_title,
            "space": {"key": space_key},
            "version": {"number": cur_ver + 1, "minorEdit": True},
            "body": {"storage": {"value": storage_xhtml, "representation": "storage"}},
        }
        self.request("PUT", f"/rest/api/content/{homepage_id}", payload=payload)


def publish_to_confluence(md_files: list[Path], args: argparse.Namespace) -> int:
    plan = build_ordered_page_plan(md_files)
    if args.dry_run:
        print(f"DRY-RUN: {len(plan)} pages prepared for Confluence 8.4.5 ({args.url}):\n")
        for item in plan:
            indent = "  " * int(item["depth"])
            parent = item["parent_title"] or "(Root Space)"
            print(f"{indent}- [{item['depth']}] {item['title']}  <-- parent: {parent}  ({item['rel_repo']})")
        return 0

    token = args.token or os.environ.get("CONFLUENCE_PERSONAL_TOKEN")
    user = args.user or os.environ.get("CONFLUENCE_USER")
    password = args.password or os.environ.get("CONFLUENCE_PASSWORD")
    space_key_arg = args.space_key or os.environ.get("CONFLUENCE_SPACE_KEY")

    client = ConfluenceClient(args.url, token=token, user=user, password=password, insecure=args.insecure)
    space_key, space_name, homepage_id = client.resolve_space(space_key_arg)
    print(f"Connected to Confluence space: {space_key} ('{space_name}', homepage id={homepage_id})")

    title_to_id: dict[str, str] = {"__SPACE_HOME__": homepage_id}

    for idx, item in enumerate(plan, start=1):
        title = str(item["title"])
        parent_title = str(item["parent_title"]) if item["parent_title"] else None
        xhtml = str(item["storage_xhtml"])

        if title == "__SPACE_HOME__":
            client.update_homepage(space_key, homepage_id, xhtml)
            print(f"[{idx}/{len(plan)}] Updated Space Home Page (id={homepage_id})")
            continue

        parent_id = title_to_id.get(parent_title or "__SPACE_HOME__", homepage_id)
        page_id = client.create_or_update_page(space_key, title, xhtml, parent_id)
        title_to_id[title] = page_id
        print(f"[{idx}/{len(plan)}] Published: '{title}' (id={page_id}, parent_id={parent_id})")

    print(f"\nSUCCESS: All {len(plan)} pages published 1:1 to Confluence space '{space_name}' ({space_key})!")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", help="validate 1:1 Confluence structure and links")
    parser.add_argument("--export", action="store_true", help="validate and write Confluence Markdown + XHTML bundle")
    parser.add_argument("--publish", action="store_true", help="publish the entire docs/ tree to Confluence 8.4.5 via REST API")
    parser.add_argument("--dry-run", action="store_true", help="preview the page hierarchy to be published without calling the network")
    parser.add_argument(
        "--include",
        action="append",
        default=[],
        metavar="PATH_OR_GLOB",
        help="publish/export only matching docs pages; may be repeated, parent README pages are included",
    )
    parser.add_argument("--url", default=os.environ.get("CONFLUENCE_URL", DEFAULT_CONFLUENCE_URL), help="Confluence base URL")
    parser.add_argument("--space-key", default=None, help="Confluence Space Key (auto-detected if omitted)")
    parser.add_argument("--token", default=None, help="Confluence Personal Access Token (or CONFLUENCE_PERSONAL_TOKEN env var)")
    parser.add_argument("--user", default=None, help="Confluence username (if using Basic Auth)")
    parser.add_argument("--password", default=None, help="Confluence password (if using Basic Auth)")
    parser.add_argument("--insecure", action="store_true", help="skip TLS certificate verification if needed")
    args = parser.parse_args()

    errors, md_files = validate_tree()
    if errors:
        print("Confluence 1:1 validation errors:")
        for err in errors:
            print(f"  - {err}")
        return 1

    selected_md_files = md_files
    if args.include and (args.publish or args.export):
        selection_errors, selected_md_files = select_pages(md_files, args.include)
        if selection_errors:
            print("Confluence page selection errors:")
            for err in selection_errors:
                print(f"  - {err}")
            return 1
        print(f"Selected {len(selected_md_files)} pages for {'publication' if args.publish else 'export'}.")

    if args.export:
        export_bundle(selected_md_files)
        print(f"OK: validated and exported {len(selected_md_files)} Confluence pages (MD + XHTML) to {EXPORT_DIR.relative_to(ROOT).as_posix()}/")

    if args.publish:
        return publish_to_confluence(selected_md_files, args)

    if not args.export:
        print(
            f"OK: Confluence 1:1 tree valid ({len(EXPECTED_SECTIONS)} sections, "
            f"{len(REQUIRED_CORE_FILES)} core AltexSoft/SDD files, {len(md_files)} active Markdown pages, 0 broken links)"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
