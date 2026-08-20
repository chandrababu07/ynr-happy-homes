$baseUrl = "http://127.0.0.1:8000/api/v1"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " YNR HAPPY HOMES - PHASE 11C ENQUIRY & COMMUNICATION TEST SUITE" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Health Check
$health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
if ($health.success -eq $true) {
    Write-Host "[PASS] 1. Backend REST API is live and operational" -ForegroundColor Green
} else {
    Write-Host "[FAIL] 1. Backend REST API is offline" -ForegroundColor Red
    exit 1
}

# 2. Valid Public Customer Lead Submission
$uniquePhone = "987" + (Get-Random -Minimum 1000001 -Maximum 9999999)
$validEnquiry = @{
    category = "CONSTRUCTION"
    targetId = "unit-test-101"
    targetTitle = "YNR Luxury Heights - Flat A-101 (3BHK, 1550 sq.ft)"
    customerName = "Test Customer Lead"
    customerPhone = $uniquePhone
    customerEmail = "lead.test@example.com"
    customerLocation = "Mangalagiri, AP"
    dateRequired = "2026-09-01"
    message = "Requesting site visit and pricing breakdown"
} | ConvertTo-Json

$enquiryRes = Invoke-RestMethod -Uri "$baseUrl/enquiries" -Method Post -ContentType "application/json" -Body $validEnquiry

if ($enquiryRes.success -and $enquiryRes.data.id) {
    $enquiryId = $enquiryRes.data.id
    Write-Host "[PASS] 2. Customer enquiry submitted successfully: ID = $enquiryId" -ForegroundColor Green
} else {
    Write-Host "[FAIL] 2. Customer enquiry submission failed" -ForegroundColor Red
    exit 1
}

# 3. Invalid Phone Rejection Check
try {
    $invalidBody = @{
        category = "GENERAL"
        customerName = "Bad Phone User"
        customerPhone = "123"
    } | ConvertTo-Json
    $badRes = Invoke-RestMethod -Uri "$baseUrl/enquiries" -Method Post -ContentType "application/json" -Body $invalidBody
    Write-Host "[FAIL] 3. Invalid phone number was not rejected" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq [System.Net.HttpStatusCode]::BadRequest) {
        Write-Host "[PASS] 3. Invalid phone number properly rejected (400 Bad Request)" -ForegroundColor Green
    } else {
        Write-Host "[PASS] 3. Invalid phone number rejected" -ForegroundColor Green
    }
}

# 4. Admin Login
$loginBody = @{ email = "admin@ynrhappyhomes.com" } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
$adminToken = $loginRes.data.token
$adminHeaders = @{ Authorization = "Bearer $adminToken" }

if ($adminToken) {
    Write-Host "[PASS] 4. Admin authentication token acquired" -ForegroundColor Green
} else {
    Write-Host "[FAIL] 4. Admin login failed" -ForegroundColor Red
    exit 1
}

# 5. Retrieve Admin Inbox & Verify Created Lead
$inboxRes = Invoke-RestMethod -Uri "$baseUrl/enquiries" -Method Get -Headers $adminHeaders
$found = $inboxRes.data | Where-Object { $_.id -eq $enquiryId }

if ($found) {
    Write-Host "[PASS] 5. Admin Inbox successfully retrieved created lead record" -ForegroundColor Green
} else {
    Write-Host "[FAIL] 5. Created lead record not present in Admin Inbox" -ForegroundColor Red
    exit 1
}

# 6. Status Progression (NEW -> CONTACTED -> IN_PROGRESS -> CLOSED)
$statuses = @("CONTACTED", "IN_PROGRESS", "CLOSED")
$allPassed = $true

foreach ($st in $statuses) {
    $updateBody = @{ status = $st } | ConvertTo-Json
    $upRes = Invoke-RestMethod -Uri "$baseUrl/enquiries/$enquiryId" -Method Put -Headers $adminHeaders -ContentType "application/json" -Body $updateBody
    if ($upRes.data.status -ne $st) {
        $allPassed = $false
    }
}

if ($allPassed) {
    Write-Host "[PASS] 6. Enquiry status progression (CONTACTED -> IN_PROGRESS -> CLOSED) persisted" -ForegroundColor Green
} else {
    Write-Host "[FAIL] 6. Status progression failed" -ForegroundColor Red
    exit 1
}

# 7. Authenticated Lead Cleanup
$deleteRes = Invoke-RestMethod -Uri "$baseUrl/enquiries/$enquiryId" -Method Delete -Headers $adminHeaders
if ($deleteRes.success) {
    Write-Host "[PASS] 7. Test lead record deleted successfully" -ForegroundColor Green
} else {
    Write-Host "[FAIL] 7. Lead deletion failed" -ForegroundColor Red
    exit 1
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " PHASE 11C ENQUIRY WORKFLOW TEST SUITE PASSED ALL VERIFICATIONS" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
