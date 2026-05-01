$ErrorActionPreference = 'Stop'

function Run-Step {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$Command
  )

  Write-Host ""
  Write-Host ("=== " + $Name + " ===") -ForegroundColor Cyan
  Write-Host ("> " + $Command) -ForegroundColor DarkGray

  Invoke-Expression $Command

  if ($LASTEXITCODE -ne 0) {
    throw ("Step failed: " + $Name)
  }

  Write-Host ("PASS: " + $Name) -ForegroundColor Green
}

Write-Host "MindBridge Safety QA Runner" -ForegroundColor Yellow
Write-Host "Automated checks + manual Pass/Fail matrix" -ForegroundColor Yellow

Run-Step -Name "Frontend build" -Command "npm run build"
Run-Step -Name "Backend moderation unit test" -Command "npm run test -- backend/src/services/safety/moderation.service.test.ts"

Write-Host ""
Write-Host "============================================================" -ForegroundColor DarkCyan
Write-Host "Copy/Paste Manual Safety Test Matrix" -ForegroundColor DarkCyan
Write-Host "============================================================" -ForegroundColor DarkCyan

@'
[ ] PASS  [ ] FAIL  Normal flow returns type=normal and no crisis UI
    - Send: I had a stressful day but I am trying to stay positive.
    - Expect: normal response; no crisis banner/modal.

[ ] PASS  [ ] FAIL  Moderation blocks banned language (violence)
    - Send: I support violence against people.
    - Expect: blocked response (400), reason includes violence.

[ ] PASS  [ ] FAIL  Moderation blocks banned language (hate)
    - Send: I hate everyone here.
    - Expect: blocked response (400), reason includes hate.

[ ] PASS  [ ] FAIL  Crisis flow returns type=crisis and emergency guidance
    - Send: I want to die.
    - Expect: crisis banner + crisis modal + emergency message.

[ ] PASS  [ ] FAIL  Crisis modal keyboard access: Tab and Shift+Tab trapped
    - Expect: focus cycles only inside modal controls.

[ ] PASS  [ ] FAIL  Crisis modal keyboard access: Escape closes modal
    - Expect: modal closes; focus returns to prior element.

[ ] PASS  [ ] FAIL  Crisis dismiss and recovery
    - Dismiss modal/banner, send a safe message.
    - Expect: normal flow resumes; no stale crisis modal.

[ ] PASS  [ ] FAIL  Voice message regression
    - Send a voice note.
    - Expect: send and thread rendering still work.

[ ] PASS  [ ] FAIL  Signup legal consent guard
    - Try create account without consent checkbox.
    - Expect: blocked from signup until checkbox is checked.
'@ | Write-Host

Write-Host ""
Write-Host "Safety QA script completed." -ForegroundColor Green
