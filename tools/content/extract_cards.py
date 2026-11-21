"""Extract card and deck data from the JS prototype into the canonical JSON content files.

Usage: python tools/content/extract_cards.py [--check]

The prototype (prototype/game/cards.js + decks.js, PanCoto/rejoltance-prototype) is the canonical
rules source (ADR-0005, ADR-0013). Both files are plain JS object literals (comments, unquoted keys,
trailing commas), so Node evaluates them in an empty sandbox and prints JSON. Requires Node.js 22+.
`--check` fails when the committed JSON differs from the prototype, so CI notices drift.
Legacy cards (cards-legacy.js, decks-legacy.js) are not part of the canon and are not extracted.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GAME = ROOT / "prototype" / "game"
SOURCES = [GAME / "cards.js", GAME / "decks.js"]
TARGET_DIR = ROOT / "src" / "Rejoltance.Content" / "Data"

# Runs the two data files in one script context (top-level `const` stays visible) and prints JSON.
NODE_SCRIPT = r"""
const fs = require("fs"), vm = require("vm");
const code = process.argv.slice(1).map(f => fs.readFileSync(f, "utf8")).join("\n;\n");
const data = vm.runInNewContext(code + "\n;({ CARDS, DECKS })", Object.create(null), { timeout: 5000 });
process.stdout.write(JSON.stringify(data));
"""


def load_prototype() -> tuple[list, list]:
    node = shutil.which("node")
    if node is None:
        raise SystemExit("error: Node.js is required to read prototype/game/*.js (install Node 22+)")
    for source in SOURCES:
        if not source.exists():
            raise SystemExit(f"error: {source.relative_to(ROOT)} not found")
    result = subprocess.run(
        [node, "-e", NODE_SCRIPT, *map(str, SOURCES)], capture_output=True, text=True, encoding="utf-8", check=False
    )
    if result.returncode != 0:
        raise SystemExit(f"error: node could not evaluate the prototype data:\n{result.stderr}")
    data = json.loads(result.stdout)
    return data["CARDS"], data["DECKS"]


def render(data: object) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="only verify that JSON files are up to date")
    args = parser.parse_args()

    cards, raw_decks = load_prototype()
    decks = [{"name": deck["n"], "cards": deck["c"]} for deck in raw_decks]
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
