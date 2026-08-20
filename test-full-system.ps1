$baseUrl = "http://127.0.0.1:8000/api/v1"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " YNR HAPPY HOMES - PHASE 11D MASTER PRODUCTION RELEASE TEST SUITE" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# 1. Live Health & Database Ping
Write-Host "`n--- 1. HEALTH & DATABASE PING CHECK ---" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    if ($health.success -and ($health.data.database.status -eq "CONNECTED" -or $health.data.database.status -eq "OFFLINE_FALLBACK")) {
        Write-Host "[PASS] Health Endpoint Live | Status: $($health.data.status) | DB Mode: $($health.data.database.status) | Uptime: $($health.data.uptimeSeconds)s" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Database status is invalid" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[FAIL] API Health Endpoint is unreachable" -ForegroundColor Red
    exit 1
}

# 2. Security & RBAC Suite
Write-Host "`n--- 2. SECURITY & RBAC AUDIT SUITE ---" -ForegroundColor Yellow
& powershell -ExecutionPolicy Bypass -File .\test-security-suite.ps1
if ($LASTEXITCODE -ne 0) { Write-Host "[FAIL] Security Suite failed" -ForegroundColor Red; exit 1 }

# 3. Media & Document Suite
Write-Host "`n--- 3. MEDIA & DOCUMENT MANAGEMENT SUITE ---" -ForegroundColor Yellow
& powershell -ExecutionPolicy Bypass -File .\test-media-upload.ps1
if ($LASTEXITCODE -ne 0) { Write-Host "[FAIL] Media Upload Suite failed" -ForegroundColor Red; exit 1 }

# 4. Customer Enquiry Workflow Suite
Write-Host "`n--- 4. CUSTOMER ENQUIRY WORKFLOW SUITE ---" -ForegroundColor Yellow
& powershell -ExecutionPolicy Bypass -File .\test-enquiry-workflow.ps1
if ($LASTEXITCODE -ne 0) { Write-Host "[FAIL] Enquiry Workflow Suite failed" -ForegroundColor Red; exit 1 }

# 5. Full End-to-End Integration Suite
Write-Host "`n--- 5. END-TO-END INTEGRATION AUDIT SUITE ---" -ForegroundColor Yellow
& powershell -ExecutionPolicy Bypass -File .\test-e2e-integration.ps1
if ($LASTEXITCODE -ne 0) { Write-Host "[FAIL] E2E Integration Suite failed" -ForegroundColor Red; exit 1 }

Write-Host "`n======================================================================" -ForegroundColor Cyan
Write-Host " ALL RELEASE VERIFICATION SUITES PASSED WITH 100% SUCCESS STATUS" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
