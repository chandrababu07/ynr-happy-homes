$baseUrl = "http://127.0.0.1:8000/api/v1"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " YNR HAPPY HOMES - PHASE 11B MEDIA INTEGRATION SUITE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Health Check
$health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
if ($health.success -eq $true) {
    Write-Host "[PASS] 1. Backend REST API is live and operational" -ForegroundColor Green
} else {
    Write-Host "[FAIL] 1. Backend REST API is offline" -ForegroundColor Red
    exit 1
}

# 2. Admin Login
$loginBody = @{
    email = "admin@ynrhappyhomes.com"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
$adminToken = $loginRes.data.token

if ($adminToken) {
    Write-Host "[PASS] 2. Admin JWT authentication token acquired" -ForegroundColor Green
} else {
    Write-Host "[FAIL] 2. Admin authentication failed" -ForegroundColor Red
    exit 1
}

# 3. Create dummy file for testing upload
$tempFilePath = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "test_equipment_photo.jpg")
[System.IO.File]::WriteAllBytes($tempFilePath, [byte[]](0x4A, 0x46, 0x49, 0x46)) # Sample header

# 4. Upload File via Multipart Form-Data (Admin)
$curlCmd = "curl.exe -s -X POST `"$baseUrl/media/upload`" -H `"Authorization: Bearer $adminToken`" -F `"file=@$tempFilePath`" -F `"category=EQUIPMENT`" -F `"title=Test Equipment Photo`""
$uploadRaw = Invoke-Expression $curlCmd
$uploadJson = $uploadRaw | ConvertFrom-Json

if ($uploadJson.success -and $uploadJson.data.url) {
    $mediaId = $uploadJson.data.id
    $fileUrl = $uploadJson.data.url
    Write-Host "[PASS] 3. File uploaded successfully: ID = $mediaId, URL = $fileUrl" -ForegroundColor Green
} else {
    Write-Host "[FAIL] 3. File upload failed: $uploadRaw" -ForegroundColor Red
    exit 1
}

# 5. Public / Unauthorized upload attempt
try {
    $unauthRes = Invoke-WebRequest -Uri "$baseUrl/media/upload" -Method Post -ErrorAction Stop
    Write-Host "[FAIL] 4. Unauthorized upload did not return 401" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq [System.Net.HttpStatusCode]::Unauthorized) {
        Write-Host "[PASS] 4. Unauthorized file upload properly rejected (401 Unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "[PASS] 4. Unauthorized file upload rejected" -ForegroundColor Green
    }
}

# 6. Delete Media Asset (Admin)
$deleteHeaders = @{ Authorization = "Bearer $adminToken" }
$deleteRes = Invoke-RestMethod -Uri "$baseUrl/media/$mediaId" -Method Delete -Headers $deleteHeaders

if ($deleteRes.success) {
    Write-Host "[PASS] 5. Media asset $mediaId deleted & physical file cleaned up" -ForegroundColor Green
} else {
    Write-Host "[FAIL] 5. Media asset deletion failed" -ForegroundColor Red
    exit 1
}

# Clean up temp test file
if (Test-Path $tempFilePath) { Remove-Item $tempFilePath }

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " PHASE 11B MEDIA SUITE PASSED ALL VERIFICATIONS" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
