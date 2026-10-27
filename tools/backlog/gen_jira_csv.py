"""Backlog (docs/05-backlog/backlog.toml) -> Jira Server/DC CSV import files + human-readable summary.

Usage:
    python tools/backlog/gen_jira_csv.py          # validate and write outputs
    python tools/backlog/gen_jira_csv.py --check  # validate; fail if outputs are stale (CI)

Outputs (generated, do not edit):
    docs/05-backlog/jira-01-epics.csv    import FIRST (epics; "Epic Name" is what stories link to)
    docs/05-backlog/jira-02-issues.csv   import SECOND (stories + sub-tasks; sub-tasks reference "Issue Id" of the story)
    docs/05-backlog/BACKLOG.md           summary: capacity per sprint, stories per epic

Validation: unique ids, user-story fields, GIVEN/WHEN/THEN acceptance criteria, Fibonacci story points,
tasks of at most 4 h, rule ids that exist in openspec/specs, RULES-INDEX story column consistent with the backlog,
and team capacity per sprint. Items that already have a Jira key (jira = "REJ-12") are left out of the CSV.
Standard library only (Python 3.11+, tomllib).
"""

from __future__ import annotations

import argparse
import csv
import io
import re
import sys
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BACKLOG_DIR = ROOT / "docs" / "05-backlog"
SOURCE = BACKLOG_DIR / "backlog.toml"
SPECS_DIR = ROOT / "openspec" / "specs"
RULES_INDEX = ROOT / "docs" / "02-rules" / "RULES-INDEX.md"

FIBONACCI = {1, 2, 3, 5, 8, 13}
MAX_TASK_HOURS = 4
PRIORITY = {"W0": "Highest", "W1": "High", "W2": "Medium", "W3": "Low"}
WAVE_NAME = {"W0": "fundament", "W1": "MVP (semestr 1)", "W2": "pełna gra (semestr 2)", "W3": "dodatki"}


def story_hours(story: dict) -> float:
    tasks = story.get("task", [])
    return sum(t["h"] for t in tasks) if tasks else float(story.get("estimate_h", 0))


def fmt_hours(h: float) -> str:
    return f"{h:g}"


def known_rules() -> set[str]:
    rules: set[str] = set()
    for spec in SPECS_DIR.glob("*/spec.md"):
        rules.update(re.findall(r"^### Requirement: (R-\d+)", spec.read_text(encoding="utf-8"), re.MULTILINE))
    return rules


def rules_index_links() -> list[tuple[str, str]]:
    """(rule, story) pairs from the Story column of RULES-INDEX.md."""
    pairs = []
    for line in RULES_INDEX.read_text(encoding="utf-8").splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 6 and re.fullmatch(r"R-\d+", cells[0]):
            story = cells[4]
            if re.fullmatch(r"E\d-S\d+", story):
                pairs.append((cells[0], story))
    return pairs


def validate(data: dict) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    meta = data.get("meta", {})
    sprints = {s["id"]: s for s in data.get("sprint", [])}
    rules = known_rules()
    seen: set[str] = set()
    stories_by_id: dict[str, dict] = {}

    if meta.get("estimate_format") not in {"seconds", "jira"}:
        errors.append("meta.estimate_format must be 'seconds' or 'jira'")

    for epic in data.get("epic", []):
        eid = epic.get("id", "?")
        for key in ("id", "name", "component", "description"):
            if not epic.get(key):
                errors.append(f"epic {eid}: missing '{key}'")
        if eid in seen:
            errors.append(f"duplicate id {eid}")
        seen.add(eid)
        for story in epic.get("story", []):
            sid = story.get("id", "?")
            at = f"story {sid}"
            if sid in seen:
                errors.append(f"duplicate id {sid}")
            seen.add(sid)
            stories_by_id[sid] = story
            if not sid.startswith(eid + "-S"):
                errors.append(f"{at}: id must start with '{eid}-S'")
            for key in ("title", "as_a", "i_want", "so_that"):
                if not story.get(key):
                    errors.append(f"{at}: missing '{key}'")
            acceptance = story.get("acceptance", [])
            if not acceptance:
                errors.append(f"{at}: needs at least one acceptance criterion")
            for crit in acceptance:
                if not all(word in crit for word in ("GIVEN", "WHEN", "THEN")):
                    errors.append(f"{at}: acceptance criterion must contain GIVEN, WHEN and THEN: {crit[:60]!r}")
            if story.get("sp") not in FIBONACCI:
                errors.append(f"{at}: sp must be one of {sorted(FIBONACCI)}")
            if story.get("wave") not in PRIORITY:
                errors.append(f"{at}: wave must be one of {sorted(PRIORITY)}")
            if story.get("sprint") not in sprints:
                errors.append(f"{at}: unknown sprint {story.get('sprint')!r}")
            tasks = story.get("task", [])
            if tasks and "estimate_h" in story:
                errors.append(f"{at}: use either tasks or estimate_h, not both")
            if not tasks and not story.get("estimate_h"):
                errors.append(f"{at}: needs tasks or estimate_h")
            for i, task in enumerate(tasks, 1):
                if not task.get("title"):
                    errors.append(f"{at} task {i}: missing title")
                h = task.get("h", 0)
                if not (0 < h <= MAX_TASK_HOURS):
                    errors.append(f"{at} task {i}: h must be in (0, {MAX_TASK_HOURS}] (got {h})")
            for rule in story.get("rules", []):
                if rule not in rules:
                    errors.append(f"{at}: rule {rule} not found in openspec/specs")

    for rule, sid in rules_index_links():
        story = stories_by_id.get(sid)
        if story is None:
            errors.append(f"RULES-INDEX: {rule} points to unknown story {sid}")
        elif rule not in story.get("rules", []):
            errors.append(f"RULES-INDEX: {rule} points to {sid}, but {sid} does not list {rule} in rules")

    team = meta.get("team_size", 6) * meta.get("hours_per_person_week", 5)
    for sid, sprint in sprints.items():
        if sprint.get("semester", 1) != 1:
            continue
        capacity = team * sprint.get("weeks", 2)
        planned = sum(story_hours(s) for e in data["epic"] for s in e.get("story", []) if s.get("sprint") == sid)
        limit = capacity * (1 - meta.get("buffer", 0.1))
        if planned > capacity:
            errors.append(f"sprint {sid}: planned {planned:g} h exceeds capacity {capacity:g} h")
        elif planned > limit:
            warnings.append(f"sprint {sid}: planned {planned:g} h is above the buffered limit {limit:g} h")
    return errors, warnings


def csv_text(header: list[str], rows: list[list[str]]) -> str:
    buffer = io.StringIO()
    writer = csv.writer(buffer, lineterminator="\n")
    writer.writerow(header)
    writer.writerows(rows)
    return buffer.getvalue()


def estimate(h: float, fmt: str) -> str:
    return str(int(round(h * 3600))) if fmt == "seconds" else f"{fmt_hours(h)}h"


def build_outputs(data: dict) -> dict[Path, str]:
    meta = data["meta"]
    fmt = meta["estimate_format"]
    sprint_of = {s["id"]: s for s in data["sprint"]}

    epic_rows = []
    issue_rows = []
    for epic in data["epic"]:
        if not epic.get("jira"):
            epic_rows.append([epic["id"], "Epic", f"{epic['id']} {epic['name']}", f"{epic['id']} {epic['name']}",
                              f"{epic['description']}\n\nWłaściciel: {epic.get('owner', '-')}\nŹródło: docs/05-backlog/backlog.toml",
                              "rejoltance", epic["component"]])
        epic_name = epic.get("jira") or f"{epic['id']} {epic['name']}"
        for story in epic.get("story", []):
            semester = sprint_of[story["sprint"]].get("semester", 1)
            sprint_label = f"sprint-{story['sprint'][1:]}" if semester == 1 else "semestr-2"
            labels = ["rejoltance", story["wave"].lower(), sprint_label]
            description = (
                f"Jako {story['as_a']} chcę {story['i_want']}, aby {story['so_that']}.\n\n"
                "Kryteria akceptacji:\n" + "\n".join(f"- {c}" for c in story["acceptance"]) + "\n\n"
                + (f"Reguły: {', '.join(story['rules'])} (docs/02-rules/RULES-INDEX.md)\n" if story.get("rules") else "")
                + f"Fala: {story['wave']} ({WAVE_NAME[story['wave']]}) · Źródło: backlog.toml ({story['id']})"
            )
            tasks = story.get("task", [])
            if not story.get("jira"):
                issue_rows.append([story["id"], "", "Story", f"{story['id']} {story['title']}", epic_name, description,
                                   str(story["sp"]), "" if tasks else estimate(story_hours(story), fmt),
                                   PRIORITY[story["wave"]], *labels, epic["component"]])
            for i, task in enumerate(tasks, 1):
                if task.get("jira"):
                    continue
                issue_rows.append([f"{story['id']}-T{i}", story["id"], "Sub-task", f"{story['id']}-T{i} {task['title']}", "",
                                   f"Część {story['id']} {story['title']}.", "", estimate(task["h"], fmt),
                                   PRIORITY[story["wave"]], *labels, epic["component"]])

    epics_csv = csv_text(["Issue Id", "Issue Type", "Summary", "Epic Name", "Description", "Labels", "Component/s"], epic_rows)
    issues_csv = csv_text(["Issue Id", "Parent Id", "Issue Type", "Summary", "Epic Link", "Description", "Story Points",
                           "Original Estimate", "Priority", "Labels", "Labels", "Labels", "Component/s"], issue_rows)
    return {
        BACKLOG_DIR / "jira-01-epics.csv": epics_csv,
        BACKLOG_DIR / "jira-02-issues.csv": issues_csv,
        BACKLOG_DIR / "BACKLOG.md": summary(data),
    }


def summary(data: dict) -> str:
    meta = data["meta"]
    team = meta["team_size"] * meta["hours_per_person_week"]
    lines = [
        "# Backlog — podsumowanie (generowane)",
        "",
        "<!-- GENERATED by tools/backlog/gen_jira_csv.py from docs/05-backlog/backlog.toml - edit the source, not this file. -->",
        "",
        f"Pojemność: {meta['team_size']} os. × {meta['hours_per_person_week']} h/tydz., bufor {int(meta['buffer'] * 100)}%. "
        "Godziny story = suma tasków albo `estimate_h`.",
        "",
        "## Sprinty",
        "",
        "| Sprint | Daty | Cel | Pojemność [h] | Zaplanowane [h] | SP | Wykorzystanie |",
        "|---|---|---|---|---|---|---|",
    ]
    all_stories = [(e, s) for e in data["epic"] for s in e.get("story", [])]
    for sprint in data["sprint"]:
        stories = [s for _, s in all_stories if s["sprint"] == sprint["id"]]
        hours = sum(story_hours(s) for s in stories)
        sp = sum(s["sp"] for s in stories)
        if sprint.get("semester", 1) == 1:
            capacity = team * sprint["weeks"]
            dates = f"{sprint['start']} – {sprint['end']}"
            usage = f"{hours / capacity:.0%}"
        else:
            capacity, dates, usage = "—", "semestr 2", "—"
        lines.append(f"| {sprint['id']} | {dates} | {sprint['goal']} | {capacity} | {fmt_hours(hours)} | {sp} | {usage} |")

    semester1 = [s for _, s in all_stories if data_sprint(data, s).get("semester", 1) == 1]
    later = [s for _, s in all_stories if data_sprint(data, s).get("semester", 1) != 1]
    lines += [
        "",
        f"**Semestr 1:** {len(semester1)} story, {sum(s['sp'] for s in semester1)} SP, "
        f"{fmt_hours(sum(story_hours(s) for s in semester1))} h. "
        f"**Poniżej linii cięcia (semestr 2):** {len(later)} story, {sum(s['sp'] for s in later)} SP, "
        f"{fmt_hours(sum(story_hours(s) for s in later))} h.",
        "",
    ]
    for epic in data["epic"]:
        lines += [f"## {epic['id']} {epic['name']}", "", f"{epic['description']} Właściciel: {epic.get('owner', '-')}.", "",
                  "| Story | Tytuł | Sprint | Fala | SP | h | Reguły |", "|---|---|---|---|---|---|---|"]
        for story in epic.get("story", []):
            lines.append(f"| {story['id']} | {story['title']} | {story['sprint']} | {story['wave']} | {story['sp']} | "
                         f"{fmt_hours(story_hours(story))} | {', '.join(story.get('rules', [])) or '—'} |")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def data_sprint(data: dict, story: dict) -> dict:
    return next(s for s in data["sprint"] if s["id"] == story["sprint"])


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", help="validate and fail on stale outputs; write nothing")
    args = parser.parse_args()

    data = tomllib.loads(SOURCE.read_text(encoding="utf-8"))
    errors, warnings = validate(data)
    for warning in warnings:
        print(f"warning: {warning}")
    if errors:
        print("Backlog errors:")
        print("\n".join(f"  - {e}" for e in errors))
        return 1

    outputs = build_outputs(data)
    stale = [p for p, text in outputs.items() if not p.exists() or p.read_text(encoding="utf-8") != text]
    if args.check:
        for path in stale:
            print(f"stale: {path.relative_to(ROOT).as_posix()} (run: python tools/backlog/gen_jira_csv.py)")
        if not stale:
            print("OK: backlog valid, outputs up to date")
        return 1 if stale else 0

    for path in stale:
        path.write_text(outputs[path], encoding="utf-8", newline="\n")
    rows = {p: list(csv.reader(io.StringIO(outputs[p])))[1:] for p in (BACKLOG_DIR / "jira-01-epics.csv", BACKLOG_DIR / "jira-02-issues.csv")}
    issues = rows[BACKLOG_DIR / "jira-02-issues.csv"]
    stories = sum(1 for r in issues if r[2] == "Story")
    print(f"Wrote {len(stale)} file(s): {len(rows[BACKLOG_DIR / 'jira-01-epics.csv'])} epics, "
          f"{stories} stories, {len(issues) - stories} sub-tasks")
    return 0


if __name__ == "__main__":
    sys.exit(main())
