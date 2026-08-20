Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " YNR HAPPY HOMES - PHASE 8C 25-POINT SECURITY & RBAC TEST SUITE" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8000/api/v1"
$passedCount = 0
$totalCount = 25

function Report-Result($caseNum, $description, $passed, $details) {
    if ($passed) {
        $global:passedCount++
        Write-Host "[PASS] Case $caseNum : $description" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Case $caseNum : $description - Details: $details" -ForegroundColor Red
    }
}

# --- GENERATE CUSTOMER TOKEN ---
$custToken = node -e "import('./backend/node_modules/jsonwebtoken/index.js').then(jwt => console.log(jwt.default.sign({userId:'usr-customer-001',email:'customer@example.com',role:'CUSTOMER'},'ynr-happy-homes-jwt-secret-key-2025-secure',{expiresIn:'24h'})))"
$custToken = $custToken.Trim()

# --- 1. AUTHENTICATION TESTS (Cases 1-8) ---

# Case 1: Valid Admin Login
try {
    $body = @{ email = "admin@ynrhappyhomes.com" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body
    $adminToken = $res.data.token
    $adminHeader = @{ Authorization = "Bearer $adminToken" }
    Report-Result 1 "Valid Admin Login & JWT Issuance" ($res.success -eq $true -and $adminToken.Length -gt 20) ""
} catch {
    Report-Result 1 "Valid Admin Login & JWT Issuance" $false $_.Exception.Message
}

# Case 2: Invalid Password
try {
    $body = @{ email = "admin@ynrhappyhomes.com"; password = "wrongpassword" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body
    Report-Result 2 "Invalid Password Rejection (401)" $false "Expected 401 but request succeeded"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 2 "Invalid Password Rejection (401)" ($code -eq 401) "Status: $code"
}

# Case 3: Unknown Email
try {
    $body = @{ email = "nonexistent@example.com" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body
    Report-Result 3 "Unknown Email Rejection (401)" $false "Expected 401 but request succeeded"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 3 "Unknown Email Rejection (401)" ($code -eq 401) "Status: $code"
}

# Case 4: Missing Email Payload
try {
    $body = @{} | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body
    Report-Result 4 "Missing Email Payload Rejection (400)" $false "Expected 400 but request succeeded"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 4 "Missing Email Payload Rejection (400)" ($code -eq 400) "Status: $code"
}

# Case 5: Get Auth Profile with Valid Token
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers $adminHeader
    Report-Result 5 "GET /auth/me Profile Verification with Valid JWT" ($res.success -eq $true -and $res.data.role -eq "ADMIN") ""
} catch {
    Report-Result 5 "GET /auth/me Profile Verification with Valid JWT" $false $_.Exception.Message
}

# Case 6: Get Auth Profile with Expired Token
try {
    $expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3ItMSIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTUwMDAwMDAwMCwiZXhwIjoxNTAwMDAwMDAwfQ.signature"
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers @{ Authorization = "Bearer $expiredToken" }
    Report-Result 6 "Expired Token Rejection (401)" $false "Expected 401"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 6 "Expired Token Rejection (401)" ($code -eq 401) "Status: $code"
}

# Case 7: Get Auth Profile with Malformed Token
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers @{ Authorization = "Bearer malformed.token.here" }
    Report-Result 7 "Malformed Token Rejection (401)" $false "Expected 401"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 7 "Malformed Token Rejection (401)" ($code -eq 401) "Status: $code"
}

# Case 8: Get Auth Profile with Missing Token
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET
    Report-Result 8 "Missing Token Rejection on /auth/me (401)" $false "Expected 401"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 8 "Missing Token Rejection on /auth/me (401)" ($code -eq 401) "Status: $code"
}


# --- 2. AUTHORIZATION & UNAUTHENTICATED REJECTION TESTS (Cases 9-12) ---

$equipPayload = @{
    id = "sec-test-eq-001"
    name = "Security Test Excavator"
    category = "Excavator"
    brand = "Hyundai"
    model = "R210"
    description = "Test excavator"
    operatorIncluded = $true
    rentalBasis = "Hourly"
    availabilityStatus = "AVAILABLE"
    serviceArea = "Mangalagiri"
    specifications = @{}
} | ConvertTo-Json

# Case 9: Unauthenticated Equipment POST
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/equipment" -Method POST -ContentType "application/json" -Body $equipPayload
    Report-Result 9 "Unauthenticated POST /equipment Rejection (401)" $false "Expected 401"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 9 "Unauthenticated POST /equipment Rejection (401)" ($code -eq 401) "Status: $code"
}

# Case 10: Unauthenticated Property POST
try {
    $propPayload = @{
        id = "sec-test-prop-001"
        title = "Security Test Plot"
        category = "SITES_PLOTS"
        type = "Plot"
        price = "₹25,00,000"
        address = "Nambur"
        area = "200 Sq.Yds"
        city = "Mangalagiri"
        state = "Andhra Pradesh"
        description = "Test plot"
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/properties" -Method POST -ContentType "application/json" -Body $propPayload
    Report-Result 10 "Unauthenticated POST /properties Rejection (401)" $false "Expected 401"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 10 "Unauthenticated POST /properties Rejection (401)" ($code -eq 401) "Status: $code"
}

# Case 11: Unauthenticated Project POST
try {
    $projPayload = @{
        id = "sec-test-proj-001"
        name = "Security Test Villa Project"
        code = "SECVILLA"
        type = "Gated Community"
        location = "Mangalagiri"
        description = "Test project"
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/projects" -Method POST -ContentType "application/json" -Body $projPayload
    Report-Result 11 "Unauthenticated POST /projects Rejection (401)" $false "Expected 401"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 11 "Unauthenticated POST /projects Rejection (401)" ($code -eq 401) "Status: $code"
}

# Case 12: Unauthenticated Enquiry Listing GET
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/enquiries" -Method GET
    Report-Result 12 "Unauthenticated GET /enquiries Admin Inbox Rejection (401)" $false "Expected 401"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 12 "Unauthenticated GET /enquiries Admin Inbox Rejection (401)" ($code -eq 401) "Status: $code"
}


# --- 3. RBAC NON-ADMIN ROLE RESTRICTION TESTS (Cases 13-16) ---

$custHeader = @{ Authorization = "Bearer $custToken" }

# Case 13: Customer Token on Equipment POST
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/equipment" -Method POST -Headers $custHeader -ContentType "application/json" -Body $equipPayload
    Report-Result 13 "Non-Admin CUSTOMER Role Rejection on POST /equipment (403 Forbidden)" $false "Expected 403"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 13 "Non-Admin CUSTOMER Role Rejection on POST /equipment (403 Forbidden)" ($code -eq 403) "Status: $code"
}

# Case 14: Customer Token on Property POST
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/properties" -Method POST -Headers $custHeader -ContentType "application/json" -Body $propPayload
    Report-Result 14 "Non-Admin CUSTOMER Role Rejection on POST /properties (403 Forbidden)" $false "Expected 403"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 14 "Non-Admin CUSTOMER Role Rejection on POST /properties (403 Forbidden)" ($code -eq 403) "Status: $code"
}

# Case 15: Customer Token on Project POST
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/projects" -Method POST -Headers $custHeader -ContentType "application/json" -Body $projPayload
    Report-Result 15 "Non-Admin CUSTOMER Role Rejection on POST /projects (403 Forbidden)" $false "Expected 403"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 15 "Non-Admin CUSTOMER Role Rejection on POST /projects (403 Forbidden)" ($code -eq 403) "Status: $code"
}

# Case 16: Customer Token on Enquiry Listing GET
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/enquiries" -Method GET -Headers $custHeader
    Report-Result 16 "Non-Admin CUSTOMER Role Rejection on GET /enquiries (403 Forbidden)" $false "Expected 403"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 16 "Non-Admin CUSTOMER Role Rejection on GET /enquiries (403 Forbidden)" ($code -eq 403) "Status: $code"
}


# --- 4. AUTHORIZED ADMIN OPERATIONAL TESTS (Cases 17-18) ---

# Case 17: Admin Token on Equipment POST
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/equipment" -Method POST -Headers $adminHeader -ContentType "application/json" -Body $equipPayload
    Report-Result 17 "Authorized ADMIN Role Operation on POST /equipment (201 Created)" ($res.success -eq $true -and $res.data.id -eq "sec-test-eq-001") ""
} catch {
    Report-Result 17 "Authorized ADMIN Role Operation on POST /equipment (201 Created)" $false $_.Exception.Message
}

# Case 18: Admin Token on Equipment DELETE
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/equipment/sec-test-eq-001" -Method DELETE -Headers $adminHeader
    Report-Result 18 "Authorized ADMIN Role Operation on DELETE /equipment (200 OK)" ($res.success -eq $true) ""
} catch {
    Report-Result 18 "Authorized ADMIN Role Operation on DELETE /equipment (200 OK)" $false $_.Exception.Message
}


# --- 5. PARAMETER TAMPERING RESILIENCE TESTS (Cases 19-20) ---

# Case 19: Unauthenticated Parameter Tampering on Property DELETE
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/properties/prop-fake-tamper-999" -Method DELETE
    Report-Result 19 "Parameter Tampering Resilience on DELETE /properties/:id (401)" $false "Expected 401"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 19 "Parameter Tampering Resilience on DELETE /properties/:id (401)" ($code -eq 401) "Status: $code"
}

# Case 20: Unauthenticated Payload Body Tampering on Enquiry PUT
try {
    $body = @{ status = "CLOSED" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/enquiries/enq-fake-tamper-999" -Method PUT -ContentType "application/json" -Body $body
    Report-Result 20 "Payload Tampering Resilience on PUT /enquiries/:id (401)" $false "Expected 401"
} catch {
    $code = $_.Exception.Response.StatusCode.Value__
    Report-Result 20 "Payload Tampering Resilience on PUT /enquiries/:id (401)" ($code -eq 401) "Status: $code"
}


# --- 6. PUBLIC ROUTE PRESERVATION TESTS (Cases 21-25) ---

# Case 21: Public GET /health
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Report-Result 21 "Public GET /health Preservation (200 OK)" ($res.success -eq $true) ""
} catch {
    Report-Result 21 "Public GET /health Preservation (200 OK)" $false $_.Exception.Message
}

# Case 22: Public GET /equipment
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/equipment" -Method GET
    Report-Result 22 "Public GET /equipment Inventory Preservation (200 OK)" ($res.success -eq $true) ""
} catch {
    Report-Result 22 "Public GET /equipment Inventory Preservation (200 OK)" $false $_.Exception.Message
}

# Case 23: Public GET /properties
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/properties" -Method GET
    Report-Result 23 "Public GET /properties Real Estate Preservation (200 OK)" ($res.success -eq $true) ""
} catch {
    Report-Result 23 "Public GET /properties Real Estate Preservation (200 OK)" $false $_.Exception.Message
}

# Case 24: Public GET /projects
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/projects" -Method GET
    Report-Result 24 "Public GET /projects Construction Portfolio Preservation (200 OK)" ($res.success -eq $true) ""
} catch {
    Report-Result 24 "Public GET /projects Construction Portfolio Preservation (200 OK)" $false $_.Exception.Message
}

# Case 25: Public Customer Lead POST /enquiries & Clean Admin Delete
try {
    $enqPayload = @{
        id = "sec-test-enq-001"
        category = "REAL_ESTATE"
        targetTitle = "Public Test Plot"
        customerName = "Security Tester"
        customerPhone = "9998887770"
        message = "Public test enquiry"
    } | ConvertTo-Json
    $createRes = Invoke-RestMethod -Uri "$baseUrl/enquiries" -Method POST -ContentType "application/json" -Body $enqPayload
    $createdOk = ($createRes.success -eq $true)
    
    # Clean up created lead via authenticated Admin DELETE
    $deleteRes = Invoke-RestMethod -Uri "$baseUrl/enquiries/sec-test-enq-001" -Method DELETE -Headers $adminHeader
    $cleanedOk = ($deleteRes.success -eq $true)

    Report-Result 25 "Public Customer Lead POST /enquiries & Authenticated Cleanup (201/200)" ($createdOk -and $cleanedOk) ""
} catch {
    Report-Result 25 "Public Customer Lead POST /enquiries & Authenticated Cleanup (201/200)" $false $_.Exception.Message
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " SECURITY TEST RESULTS: $passedCount / $totalCount CASES PASSED" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
