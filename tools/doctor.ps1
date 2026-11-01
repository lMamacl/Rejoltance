# Checks that this machine can build and run Rejoltance. Read-only: changes nothing.
# Usage: powershell -ExecutionPolicy Bypass -File tools/doctor.ps1
# Works in Windows PowerShell 5.1 and PowerShell 7+.

$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $PSScriptRoot
$script:failed = 0
$script:warned = 0

function Ok($msg) { Write-Host "  [OK]   $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "  [WARN] $msg" -ForegroundColor Yellow; $script:warned++ }
function Fail($msg) { Write-Host "  [FAIL] $msg" -ForegroundColor Red; $script:failed++ }

function Get-ToolVersion($name, $versionArgs) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if (-not $cmd) { return $null }
    try { return (& $cmd.Source @versionArgs 2>$null | Select-Object -First 1) } catch { return $null }
}

Write-Host "Rejoltance doctor - $root" -ForegroundColor Cyan

Write-Host "`nRequired tools"
$allSdks = if (Get-Command dotnet -ErrorAction SilentlyContinue) { & dotnet --list-sdks } else { @() }
if ($allSdks | Where-Object { $_ -match '^10\.' }) { Ok ".NET SDK 10 ($(($allSdks | Where-Object { $_ -match '^10\.' } | Select-Object -Last 1).Split(' ')[0]))" }
else { Fail ".NET SDK 10 not found -> winget install Microsoft.DotNet.SDK.10" }

$node = Get-ToolVersion 'node' @('--version')
if ($node -and ([version]($node.TrimStart('v')) -ge [version]'22.13.0')) { Ok "Node.js $node" }
elseif ($node) { Fail "Node.js $node is too old (need >= 22.13) -> winget install OpenJS.NodeJS.LTS" }
else { Fail "Node.js not found -> winget install OpenJS.NodeJS.LTS" }

$git = Get-ToolVersion 'git' @('--version')
if ($git) { Ok $git } else { Fail "git not found -> winget install Git.Git" }

$py = Get-ToolVersion 'python' @('--version')
if ($py) { Ok "$py (repo tools: tools/*.py)" } else { Fail "Python 3.11+ not found -> winget install Python.Python.3.13" }

Write-Host "`nOptional tools"
$uv = Get-ToolVersion 'uv' @('--version')
if ($uv) { Ok "$uv (Jira/Confluence MCP server via uvx)" } else { Warn "uv not found (only needed for the Jira MCP integration) -> winget install astral-sh.uv" }
$aspire = Get-ToolVersion 'aspire' @('--version')
if ($aspire) { Ok "Aspire CLI $aspire" } else { Warn "Aspire CLI not installed - fine, use: dotnet run --project src/Rejoltance.AppHost (or install: https://aspire.dev/get-started/install-cli/)" }
$docker = Get-ToolVersion 'docker' @('--version')
if ($docker) { Ok $docker } else { Warn "Docker/Podman not found - not needed until PostgreSQL (Sprint 4)" }

Write-Host "`nWindows pitfalls"
if ($root.Length -gt 60) { Warn "Repo path is long ($($root.Length) chars). Aspire tools can hit the 260-char limit. Prefer e.g. C:\dev\Rejoltance" } else { Ok "Repo path length $($root.Length)" }
if ($root -match 'OneDrive') { Warn "Repo is inside OneDrive - file locks on bin/obj/node_modules are likely. Clone outside OneDrive." } else { Ok "Repo is not inside OneDrive" }

if ($git) {
    $longPaths = (& git -C $root config --get core.longpaths) 2>$null
    if ($longPaths -eq 'true') { Ok "git core.longpaths=true" } else { Warn "git core.longpaths is not set (tools/setup.ps1 sets it for this repo)" }
}

try {
    $sac = (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\CI\Policy' -ErrorAction Stop).VerifiedAndReputablePolicyState
    if ($sac -eq 1) { Warn "Smart App Control is ON. It can block freshly built .NET DLLs (error 0x800711C7). See docs/00-start/jak-zaczac.md#problemy" }
    elseif ($null -ne $sac) { Ok "Smart App Control is not enforcing" }
} catch { }

if (Get-Command dotnet -ErrorAction SilentlyContinue) {
    & dotnet dev-certs https --check --trust *> $null
    if ($LASTEXITCODE -eq 0) { Ok "HTTPS dev certificate trusted" } else { Warn "HTTPS dev certificate not trusted -> dotnet dev-certs https --trust (one-time, you confirm a Windows dialog)" }
}

Write-Host "`nRepo state"
if (Test-Path (Join-Path $root 'src/web/node_modules')) { Ok "src/web dependencies installed" } else { Warn "src/web/node_modules missing -> run tools/setup.ps1" }
if (Test-Path (Join-Path $root 'node_modules')) { Ok "repo tooling installed (OpenSpec, markdownlint)" } else { Warn "node_modules missing -> run tools/setup.ps1" }

Write-Host ""
if ($script:failed -gt 0) { Write-Host "$($script:failed) problem(s) to fix, $($script:warned) warning(s)." -ForegroundColor Red; exit 1 }
Write-Host "Ready. $($script:warned) warning(s)." -ForegroundColor Green
exit 0
