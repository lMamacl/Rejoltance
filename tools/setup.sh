#!/usr/bin/env bash
# One-time setup after `git clone` (macOS / Linux / WSL). Safe to re-run.
# Then: aspire run   (or: dotnet run --project src/Rejoltance.AppHost)
set -euo pipefail
cd "$(dirname "$0")/.."

need() { command -v "$1" >/dev/null 2>&1 || { echo "[FAIL] $1 not found: $2"; exit 1; }; }
need dotnet "install .NET SDK 10 (https://dot.net)"
need node "install Node.js 24 LTS (https://nodejs.org)"
need git "install git"
need python3 "install Python 3.11+"

dotnet --list-sdks | grep -q '^10\.' || { echo "[FAIL] .NET SDK 10 required"; exit 1; }

git config core.longpaths true
git config pull.ff only

dotnet restore Rejoltance.slnx
npm ci --no-audit --no-fund
npm ci --prefix src/web --no-audit --no-fund
[ -f .env ] || cp .env.example .env

dotnet build Rejoltance.slnx --no-restore
dotnet test Rejoltance.slnx --no-build --filter "Category!=Integration"

echo
echo "Done. Start everything with: aspire run   (or: dotnet run --project src/Rejoltance.AppHost)"
