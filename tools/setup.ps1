# One-time setup after `git clone`. Safe to re-run.
# Usage: powershell -ExecutionPolicy Bypass -File tools/setup.ps1 [-TrustDevCert]
# Then:  aspire run   (or: dotnet run --project src/Rejoltance.AppHost)

param(
    # Also run `dotnet dev-certs https --trust` (Windows will ask you to confirm).
    [switch]$TrustDevCert
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

Step "Checking tools"
& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'doctor.ps1')
if ($LASTEXITCODE -ne 0) { throw "Fix the [FAIL] items above, then re-run tools/setup.ps1" }

Step "git settings for this repo"
git config core.longpaths true
git config pull.ff only

Step "Restoring .NET packages"
dotnet restore Rejoltance.slnx

Step "Installing repo tooling (OpenSpec, markdownlint)"
npm ci --no-audit --no-fund

Step "Installing web client dependencies"
npm ci --prefix src/web --no-audit --no-fund

if (-not (Test-Path .env)) {
    Step "Creating .env from .env.example (git-ignored; put your own tokens there)"
    Copy-Item .env.example .env
}

if ($TrustDevCert) {
    Step "Trusting the HTTPS development certificate (confirm the Windows dialog)"
    dotnet dev-certs https --trust
}

Step "Building and running fast tests"
dotnet build Rejoltance.slnx --no-restore
dotnet test Rejoltance.slnx --no-build --filter "Category!=Integration"

Write-Host "`nDone. Start everything with:" -ForegroundColor Green
Write-Host "    aspire run" -ForegroundColor Green
Write-Host "    (or) dotnet run --project src/Rejoltance.AppHost" -ForegroundColor Green
Write-Host "The Aspire dashboard opens in the browser; the 'web' resource link is the game client."
