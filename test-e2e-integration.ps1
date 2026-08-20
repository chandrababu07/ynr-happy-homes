Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " YNR HAPPY HOMES - PHASE 11A END-TO-END INTEGRATION AUDIT SUITE" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8000/api/v1"
$passedCount = 0
$totalCount = 0

function Test-Step($description, $scriptBlock) {
    $global:totalCount++
    try {
        $result = & $scriptBlock
        if ($result -eq $true) {
            $global:passedCount++
            Write-Host "[PASS] Step $global:totalCount : $description" -ForegroundColor Green
        } else {
            Write-Host "[FAIL] Step $global:totalCount : $description" -ForegroundColor Red
        }
    } catch {
        Write-Host "[FAIL] Step $global:totalCount : $description - Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# --- 1. AUTHENTICATION WORKFLOW AUDIT ---
Write-Host "`n--- 1. AUTHENTICATION WORKFLOW AUDIT ---" -ForegroundColor Yellow

$adminLoginRes = $null
Test-Step "Admin Registration/Login & JWT Issuance" {
    $body = @{ email = "admin@ynrhappyhomes.com" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body
    $global:adminLoginRes = $res
    return ($res.success -eq $true -and $res.data.token.Length -gt 20 -and $res.data.user.role -eq "ADMIN")
}

$adminHeader = @{ Authorization = "Bearer $($adminLoginRes.data.token)" }

Test-Step "Session Profile Verification (GET /auth/me)" {
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers $adminHeader
    return ($res.success -eq $true -and $res.data.email -eq "admin@ynrhappyhomes.com")
}

$testCustEmail = "audit-customer-$(Get-Random)@example.com"
$testCustId = $null
Test-Step "Customer Registration/Creation & Login Workflow" {
    $userBody = @{
        name = "Audit Customer User"
        email = $testCustEmail
        phone = "9876543210"
        password = "CustomerPassword123!"
        role = "CUSTOMER"
        isActive = $true
    } | ConvertTo-Json
    
    $createRes = Invoke-RestMethod -Uri "$baseUrl/users" -Method POST -Headers $adminHeader -ContentType "application/json" -Body $userBody
    $global:testCustId = $createRes.data.id
    
    $loginBody = @{ email = $testCustEmail; password = "CustomerPassword123!" } | ConvertTo-Json
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    
    return ($createRes.success -eq $true -and $loginRes.success -eq $true -and $loginRes.data.user.role -eq "CUSTOMER")
}

Test-Step "401 Unauthorized Rejection on Protected Route" {
    try {
        $res = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET
        return $false
    } catch {
        return ($_.Exception.Response.StatusCode.Value__ -eq 401)
    }
}

# --- 2. EQUIPMENT WORKFLOW AUDIT ---
Write-Host "`n--- 2. EQUIPMENT WORKFLOW AUDIT ---" -ForegroundColor Yellow

$testEqId = "audit-eq-$(Get-Random)"
Test-Step "Admin Equipment Creation (POST /equipment)" {
    $eqBody = @{
        id = $testEqId
        name = "Audit Excavator 3000"
        category = "Excavator"
        brand = "Hyundai"
        model = "R300"
        description = "Full integration test excavator"
        operatorIncluded = $true
        rentalBasis = "Hourly"
        availabilityStatus = "AVAILABLE"
        serviceArea = "Mangalagiri, AP"
        specifications = @{ "Weight" = "30 Tons" }
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/equipment" -Method POST -Headers $adminHeader -ContentType "application/json" -Body $eqBody
    return ($res.success -eq $true -and $res.data.id -eq $testEqId)
}

Test-Step "Public Equipment Catalog & Details Listing" {
    $res = Invoke-RestMethod -Uri "$baseUrl/equipment" -Method GET
    $found = $res.data | Where-Object { $_.id -eq $testEqId }
    return ($res.success -eq $true -and $found -ne $null)
}

Test-Step "Admin Equipment Status Update (AVAILABLE -> ON_RENT -> AVAILABLE)" {
    $updateBody = @{ availabilityStatus = "ON_RENT" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/equipment/$testEqId" -Method PUT -Headers $adminHeader -ContentType "application/json" -Body $updateBody
    
    $updateBackBody = @{ availabilityStatus = "AVAILABLE" } | ConvertTo-Json
    $resBack = Invoke-RestMethod -Uri "$baseUrl/equipment/$testEqId" -Method PUT -Headers $adminHeader -ContentType "application/json" -Body $updateBackBody
    
    return ($res.data.availabilityStatus -eq "ON_RENT" -and $resBack.data.availabilityStatus -eq "AVAILABLE")
}

# --- 3. REAL ESTATE WORKFLOW AUDIT ---
Write-Host "`n--- 3. REAL ESTATE WORKFLOW AUDIT ---" -ForegroundColor Yellow

$testPropId = "audit-prop-$(Get-Random)"
Test-Step "Admin Property Creation & Publication" {
    $propBody = @{
        id = $testPropId
        title = "Mangalagiri Premium Commercial Site"
        category = "COMMERCIAL_LAND"
        type = "Commercial Plot"
        price = "₹1,50,00,000"
        address = "Highway Junction, Mangalagiri"
        area = "500 Sq.Yds"
        city = "Mangalagiri"
        state = "Andhra Pradesh"
        description = "Prime commercial location near IJM Rain Tree Park"
        amenities = @("Highway Facing", "Water Connection", "Clear Title")
        status = "AVAILABLE"
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/properties" -Method POST -Headers $adminHeader -ContentType "application/json" -Body $propBody
    return ($res.success -eq $true -and $res.data.id -eq $testPropId)
}

Test-Step "Public Property Search, Category & Filter API" {
    $res = Invoke-RestMethod -Uri "$baseUrl/properties?category=COMMERCIAL_LAND" -Method GET
    $found = $res.data | Where-Object { $_.id -eq $testPropId }
    return ($res.success -eq $true -and $found -ne $null)
}

# --- 4. CONSTRUCTION WORKFLOW AUDIT ---
Write-Host "`n--- 4. CONSTRUCTION WORKFLOW AUDIT ---" -ForegroundColor Yellow

$testProjId = "audit-proj-$(Get-Random)"
Test-Step "Admin Project Creation & Progress Management" {
    $projBody = @{
        id = $testProjId
        name = "YNR Luxury Heights"
        projectType = "Residential Apartments"
        status = "UNDER_CONSTRUCTION"
        location = "Nambur, Mangalagiri"
        description = "Premium 3BHK luxury apartments"
        progressPercentage = 45
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/projects" -Method POST -Headers $adminHeader -ContentType "application/json" -Body $projBody
    return ($res.success -eq $true -and $res.data.id -eq $testProjId -and $res.data.progressPercentage -eq 45)
}

$testBlockId = $null
Test-Step "Admin Block Creation for Project" {
    $blockBody = @{ name = "Tower A" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/projects/$testProjId/blocks" -Method POST -Headers $adminHeader -ContentType "application/json" -Body $blockBody
    $global:testBlockId = $res.data.id
    return ($res.success -eq $true -and $res.data.name -eq "Tower A")
}

$testUnitId = "audit-unit-$(Get-Random)"
Test-Step "Admin Unit Creation & Automatic Counter Sync" {
    $unitBody = @{
        id = $testUnitId
        blockId = $global:testBlockId
        unitNumber = "A-101"
        unitType = "3BHK"
        floor = 1
        area = 1850
        price = "₹75,00,000"
        status = "AVAILABLE"
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/projects/$testProjId/units" -Method POST -Headers $adminHeader -ContentType "application/json" -Body $unitBody
    
    # Fetch project details to verify counters
    $projRes = Invoke-RestMethod -Uri "$baseUrl/projects/$testProjId" -Method GET
    return ($res.success -eq $true -and $projRes.data.totalUnits -ge 1 -and $projRes.data.availableUnits -ge 1)
}

Test-Step "Unit Status Progression (AVAILABLE -> BOOKED -> SOLD & Counter Sync)" {
    $bookBody = @{ status = "BOOKED" } | ConvertTo-Json
    $resBook = Invoke-RestMethod -Uri "$baseUrl/projects/$testProjId/units/$testUnitId" -Method PUT -Headers $adminHeader -ContentType "application/json" -Body $bookBody
    
    $soldBody = @{ status = "SOLD" } | ConvertTo-Json
    $resSold = Invoke-RestMethod -Uri "$baseUrl/projects/$testProjId/units/$testUnitId" -Method PUT -Headers $adminHeader -ContentType "application/json" -Body $soldBody
    
    $projRes = Invoke-RestMethod -Uri "$baseUrl/projects/$testProjId" -Method GET
    return ($resSold.data.status -eq "SOLD" -and $projRes.data.soldUnits -ge 1 -and $projRes.data.availableUnits -eq 0)
}

# --- 5. ENQUIRY WORKFLOW AUDIT ---
Write-Host "`n--- 5. ENQUIRY WORKFLOW AUDIT ---" -ForegroundColor Yellow

$testEnqId = "audit-enq-$(Get-Random)"
Test-Step "Customer Construction Unit Enquiry Submission (targetId & targetTitle verification)" {
    $enqBody = @{
        id = $testEnqId
        category = "CONSTRUCTION"
        targetId = $testUnitId
        targetTitle = "YNR Luxury Heights - Flat A-101"
        customerName = "Audit Tester"
        customerPhone = "7385293949"
        customerEmail = "tester@ynrhappyhomes.com"
        message = "Interested in Flat A-101 booking details"
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/enquiries" -Method POST -ContentType "application/json" -Body $enqBody
    return ($res.success -eq $true -and $res.data.targetId -eq $testUnitId -and $res.data.targetTitle -eq "YNR Luxury Heights - Flat A-101")
}

Test-Step "Admin Inbox Retrieval & Enquiry Status Progression (NEW -> CONTACTED -> IN_PROGRESS -> CLOSED)" {
    $inbox = Invoke-RestMethod -Uri "$baseUrl/enquiries" -Method GET -Headers $adminHeader
    $found = $inbox.data | Where-Object { $_.id -eq $testEnqId }
    
    $updateBody = @{ status = "CONTACTED" } | ConvertTo-Json
    $resUpdate = Invoke-RestMethod -Uri "$baseUrl/enquiries/$testEnqId" -Method PUT -Headers $adminHeader -ContentType "application/json" -Body $updateBody
    
    return ($found -ne $null -and $resUpdate.data.status -eq "CONTACTED")
}

# --- 6. ADMIN DASHBOARD WORKFLOW AUDIT ---
Write-Host "`n--- 6. ADMIN DASHBOARD WORKFLOW AUDIT ---" -ForegroundColor Yellow

Test-Step "Admin Dashboard Analytics & Real-Time Aggregation (GET /dashboard/summary)" {
    $stats = Invoke-RestMethod -Uri "$baseUrl/dashboard/summary" -Method GET -Headers $adminHeader
    return ($stats.success -eq $true -and $stats.data.properties -ne $null -and $stats.data.equipment -ne $null -and $stats.data.projects -ne $null)
}

# --- CLEANUP AUDIT CREATED TEST DATA ---
Write-Host "`n--- CLEANUP AUDIT TEST DATA ---" -ForegroundColor Yellow

Test-Step "Authenticated Cleanup of Audit Test Resources" {
    $delEnq = Invoke-RestMethod -Uri "$baseUrl/enquiries/$testEnqId" -Method DELETE -Headers $adminHeader
    $delUnit = Invoke-RestMethod -Uri "$baseUrl/projects/$testProjId/units/$testUnitId" -Method DELETE -Headers $adminHeader
    $delBlock = Invoke-RestMethod -Uri "$baseUrl/projects/$testProjId/blocks/$testBlockId" -Method DELETE -Headers $adminHeader
    $delProj = Invoke-RestMethod -Uri "$baseUrl/projects/$testProjId" -Method DELETE -Headers $adminHeader
    $delProp = Invoke-RestMethod -Uri "$baseUrl/properties/$testPropId" -Method DELETE -Headers $adminHeader
    $delEq = Invoke-RestMethod -Uri "$baseUrl/equipment/$testEqId" -Method DELETE -Headers $adminHeader
    if ($global:testCustId) {
        $delUser = Invoke-RestMethod -Uri "$baseUrl/users/$($global:testCustId)" -Method DELETE -Headers $adminHeader
    }
    
    return ($delEnq.success -and $delProj.success -and $delProp.success -and $delEq.success)
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " END-TO-END INTEGRATION AUDIT RESULTS: $passedCount / $totalCount STEPS PASSED" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
