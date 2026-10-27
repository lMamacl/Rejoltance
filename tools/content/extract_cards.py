"""Extract card and deck data from the JS prototype into the canonical JSON content files.

Usage: python tools/content/extract_cards.py [--check]

The prototype (prototype/revibance/cards.js) is the canonical rules source (ADR-0005).
`--check` fails when the committed JSON differs from the prototype, so CI notices drift.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "prototype" / "revibance" / "cards.js"
TARGET_DIR = ROOT / "src" / "Rejoltance.Content" / "Data"


def read_array(source: str, name: str) -> list:
    match = re.search(rf"\b{name}\s*=\s*(\[)", source)
    if not match:
        raise SystemExit(f"error: '{name}=' not found in {SOURCE}")
    start = match.start(1)
    depth = 0
    in_string = False
    escaped = False
    for index in range(start, len(source)):
        char = source[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
            if depth == 0:
                return json.loads(source[start : index + 1])
    raise SystemExit(f"error: unterminated array '{name}'")


def render(data: object) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="only verify that JSON files are up to date")
    args = parser.parse_args()

    source = SOURCE.read_text(encoding="utf-8")
    cards = read_array(source, "CARDS")
    decks = [{"name": deck["n"], "cards": deck["c"]} for deck in read_array(source, "DECKS")]
    outputs = {TARGET_DIR / "cards.json": render(cards), TARGET_DIR / "decks.json": render(decks)}

    stale = [path for path, text in outputs.items() if not path.exists() or path.read_text(encoding="utf-8") != text]
    if args.check:
        for path in stale:
            print(f"stale: {path.relative_to(ROOT)} (run: python tools/content/extract_cards.py)")
        return 1 if stale else 0

    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    for path, text in outputs.items():
        path.write_text(text, encoding="utf-8", newline="\n")
    print(f"cards: {len(cards)}, decks: {len(decks)} -> {TARGET_DIR.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
