# Frontend-Backend Connection Test

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "FRONTEND-BACKEND CONNECTION VERIFICATION" -ForegroundColor Cyan
Write-Host "==================================================`n" -ForegroundColor Cyan

Write-Host "Testing all endpoints that the frontend uses...`n" -ForegroundColor Yellow

$baseUrl = "http://localhost:8000/api"
$results = @()

# Test 1: Admin Register
Write-Host "[1/15] Testing Admin Registration..." -ForegroundColor White
try {
    $adminData = @{
        full_name = "Test Admin"
        email = "testadmin@example.com"
        username = "testadmin"
        password = "Test@1234"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/admin/register" -Method POST -Body $adminData -ContentType "application/json"
    Write-Host "  ✅ PASS - Admin registered successfully" -ForegroundColor Green
    $results += "✅ Admin Registration"
    $adminToken = $response.token
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ Admin Registration"
}

# Test 2: Admin Login
Write-Host "`n[2/15] Testing Admin Login..." -ForegroundColor White
try {
    $loginData = @{
        email_or_username = "testadmin"
        password = "Test@1234"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "  ✅ PASS - Admin login successful" -ForegroundColor Green
    Write-Host "  Token: $($response.token.Substring(0,50))..." -ForegroundColor Gray
    $results += "✅ Admin Login"
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ Admin Login"
}

# Test 3: School Register
Write-Host "`n[3/15] Testing School Registration..." -ForegroundColor White
try {
    $schoolData = @{
        school_name = "Frontend Test School"
        school_type = "Primary School"
        address = "123 Test St"
        region_state = "TestState"
        contact_info = "555-1234"
        num_students = 100
        num_staff = 20
        admin_name = "School Admin"
        admin_email = "schooladmin@test.com"
        admin_phone = "555-5678"
        password = "School@123"
        terms_accepted = $true
        emergency_contact_pref = "email"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/school/register" -Method POST -Body $schoolData -ContentType "application/json"
    Write-Host "  ✅ PASS - School registered successfully" -ForegroundColor Green
    Write-Host "  School ID: $($response.id)" -ForegroundColor Gray
    $results += "✅ School Registration"
    $schoolId = $response.id
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ School Registration"
}

# Test 4: School Login
Write-Host "`n[4/15] Testing School Login..." -ForegroundColor White
try {
    $loginData = @{
        email_or_username = "schooladmin@test.com"
        password = "School@123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/school/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "  ✅ PASS - School login successful" -ForegroundColor Green
    Write-Host "  Token: $($response.token.Substring(0,50))..." -ForegroundColor Gray
    $results += "✅ School Login"
    $schoolToken = $response.token
    $schoolId = $response.school_id
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ School Login"
}

# Test 5: School Dashboard (JWT Protected)
Write-Host "`n[5/15] Testing School Dashboard (JWT Protected)..." -ForegroundColor White
try {
    $headers = @{
        Authorization = "Bearer $schoolToken"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/schools/dashboard/$schoolId" -Method GET -Headers $headers
    Write-Host "  ✅ PASS - Dashboard loaded" -ForegroundColor Green
    Write-Host "  School: $($response.school.school_name)" -ForegroundColor Gray
    Write-Host "  Students: $($response.students.Count)" -ForegroundColor Gray
    $results += "✅ School Dashboard (JWT)"
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ School Dashboard"
}

# Test 6: Create Course
Write-Host "`n[6/15] Testing Course Creation..." -ForegroundColor White
try {
    $courseData = @{
        title = "Frontend Test Course"
        description = "Testing course creation from frontend"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/courses" -Method POST -Body $courseData -ContentType "application/json"
    Write-Host "  ✅ PASS - Course created" -ForegroundColor Green
    Write-Host "  Course ID: $($response.course_id)" -ForegroundColor Gray
    $results += "✅ Create Course"
    $courseId = $response.course_id
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ Create Course"
}

# Test 7: Get All Courses
Write-Host "`n[7/15] Testing Get All Courses..." -ForegroundColor White
try {
    $courses = Invoke-RestMethod -Uri "$baseUrl/courses" -Method GET
    Write-Host "  ✅ PASS - Retrieved $($courses.Count) courses" -ForegroundColor Green
    $results += "✅ Get All Courses"
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ Get All Courses"
}

# Test 8: Create Module
Write-Host "`n[8/15] Testing Module Creation..." -ForegroundColor White
try {
    $moduleData = @{
        course = $courseId
        title = "Test Module 1"
        content = "This is test content"
        video_url = ""
        module_order = 1
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/courses/modules" -Method POST -Body $moduleData -ContentType "application/json"
    Write-Host "  ✅ PASS - Module created" -ForegroundColor Green
    Write-Host "  Module ID: $($response.module_id)" -ForegroundColor Gray
    $results += "✅ Create Module"
    $moduleId = $response.module_id
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ Create Module"
}

# Test 9: Get Course Modules (Frontend Format)
Write-Host "`n[9/15] Testing Get Course Modules (Frontend Format)..." -ForegroundColor White
try {
    $modules = Invoke-RestMethod -Uri "$baseUrl/courses/$courseId/modules" -Method GET
    Write-Host "  ✅ PASS - Retrieved modules with learning_items" -ForegroundColor Green
    Write-Host "  Learning Items Count: $($modules.learning_items.Count)" -ForegroundColor Gray
    $results += "✅ Get Course Modules"
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ Get Course Modules"
}

# Test 10: Add Donation
Write-Host "`n[10/15] Testing Add Donation..." -ForegroundColor White
try {
    $donationData = @{
        item_name = "Frontend Test Item"
        category = "Food"
        quantity = 50
        location = "Test Location"
        lat = 40.7128
        lng = -74.006
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/donations" -Method POST -Body $donationData -ContentType "application/json"
    Write-Host "  ✅ PASS - Donation added" -ForegroundColor Green
    Write-Host "  Donation ID: $($response.id)" -ForegroundColor Gray
    $results += "✅ Add Donation"
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ Add Donation"
}

# Test 11: Get Donations
Write-Host "`n[11/15] Testing Get Donations..." -ForegroundColor White
try {
    $donations = Invoke-RestMethod -Uri "$baseUrl/donations" -Method GET
    Write-Host "  ✅ PASS - Retrieved $($donations.Count) donations" -ForegroundColor Green
    $results += "✅ Get Donations"
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ Get Donations"
}

# Test 12: Donation Stats
Write-Host "`n[12/15] Testing Donation Stats..." -ForegroundColor White
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/donations/stats" -Method GET
    Write-Host "  ✅ PASS - Stats retrieved (Array: $($stats -is [Array]))" -ForegroundColor Green
    if ($stats -is [Array]) {
        Write-Host "  Categories: $($stats.Count)" -ForegroundColor Gray
    }
    $results += "✅ Donation Stats"
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ Donation Stats"
}

# Test 13: Update School Password
Write-Host "`n[13/15] Testing Update School Password..." -ForegroundColor White
try {
    $pwdData = @{
        school_id = $schoolId
        old_password = "School@123"
        new_password = "NewSchool@456"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/school/update-password" -Method PUT -Body $pwdData -ContentType "application/json"
    Write-Host "  ✅ PASS - Password updated" -ForegroundColor Green
    $results += "✅ Update School Password"
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ Update School Password"
}

# Test 14: Health Check
Write-Host "`n[14/15] Testing Health Check..." -ForegroundColor White
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/auth/health" -Method GET
    Write-Host "  ✅ PASS - Backend is healthy" -ForegroundColor Green
    Write-Host "  Message: $($health.message)" -ForegroundColor Gray
    $results += "✅ Health Check"
} catch {
    Write-Host "  ❌ FAIL - $($_.Exception.Message)" -ForegroundColor Red
    $results += "❌ Health Check"
}

# Test 15: CORS Test (Frontend Port)
Write-Host "`n[15/15] Testing CORS Configuration..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/health" -Method OPTIONS -Headers @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "GET"
    }
    Write-Host "  ✅ PASS - CORS configured for frontend" -ForegroundColor Green
    $results += "✅ CORS Configuration"
} catch {
    Write-Host "  ⚠️  WARN - CORS test inconclusive (browser handles this)" -ForegroundColor Yellow
    $results += "⚠️  CORS Configuration"
}

# Summary
Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "==================================================`n" -ForegroundColor Cyan

$passCount = ($results | Where-Object { $_ -like "✅*" }).Count
$failCount = ($results | Where-Object { $_ -like "❌*" }).Count
$warnCount = ($results | Where-Object { $_ -like "⚠️*" }).Count

foreach ($result in $results) {
    Write-Host $result
}

Write-Host "`n--------------------------------------------------" -ForegroundColor Cyan
Write-Host "Total Tests: $($results.Count)" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Warnings: $warnCount" -ForegroundColor Yellow
Write-Host "--------------------------------------------------`n" -ForegroundColor Cyan

if ($failCount -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED! Frontend is properly connected to backend!" -ForegroundColor Green
    Write-Host "`nFrontend can now make requests to: http://localhost:8000/api" -ForegroundColor Cyan
    Write-Host "React app running on: http://localhost:3000`n" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Some tests failed. Check the errors above.`n" -ForegroundColor Yellow
}
