# update-branch-status.ps1
# Patches the "Current branch status" section of CLAUDE.md with live git info.
# Runs automatically as a Stop hook after each Claude Code session.

$claudeMdPath = Join-Path $PSScriptRoot "..\..\CLAUDE.md"

if (-not (Test-Path $claudeMdPath)) { exit 0 }

$branch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
if (-not $branch) { exit 0 }

$statusLines = git status --short 2>$null
$statusText  = if ($statusLines) { $statusLines -join "`n" } else { "Clean — no uncommitted changes" }
$logText     = (git log --oneline -5 2>$null) -join "`n"
$date        = Get-Date -Format "yyyy-MM-dd"

$newSection = @"
## Current branch status ($date)

**Branch:** ``$branch``

**Modified files:**
``````
$statusText
``````

**Recent commits:**
``````
$logText
``````
"@

$content = Get-Content $claudeMdPath -Raw -Encoding UTF8

# Replace existing section, or append it if missing
if ($content -match "(?s)## Current branch status") {
    # Find the line index of the section header and replace to end-of-file
    $lines    = $content -split "`n"
    $startIdx = ($lines | Select-String "^## Current branch status" | Select-Object -First 1).LineNumber - 1
    $before   = ($lines[0..($startIdx - 1)] -join "`n").TrimEnd()
    $content  = $before + "`n`n" + $newSection.TrimEnd()
} else {
    $content = $content.TrimEnd() + "`n`n" + $newSection.TrimEnd()
}

Set-Content $claudeMdPath -Value $content -Encoding UTF8 -NoNewline
