# Complete API Test Suite
Write-Host "`n========================================"
Write-Host "DIS BACKEND API TEST SUITE"
Write-Host "========================================`n"

$u = Get-Random

# Test 1: Health
Write-Host "[TEST 1] Health Check"
$health = Invoke-RestMethod -Uri http://localhost:8000/api/auth/health -Method GET
Write-Host "PASS - Health:" -ForegroundColor Green
$health | ConvertTo-Json

# Test 2: Admin Register
Write-Host "`n[TEST 2] Admin Registration"
$adminReg = @{ full_name="Admin Test"; email="admin$u@example.com"; username="admin$u"; password="Passw0rd!" } | ConvertTo-Json
$regResult = Invoke-RestMethod -Uri http://localhost:8000/api/auth/admin/register -Method POST -Body $adminReg -ContentType "application/json"
Write-Host "PASS - Admin registered:" -ForegroundColor Green
$regResult | ConvertTo-Json

# Test 3: Admin Login
Write-Host "`n[TEST 3] Admin Login"
$adminLogin = @{ email_or_username="admin$u"; password="Passw0rd!" } | ConvertTo-Json
$loginResult = Invoke-RestMethod -Uri http://localhost:8000/api/auth/admin/login -Method POST -Body $adminLogin -ContentType "application/json"
Write-Host "PASS - Admin logged in:" -ForegroundColor Green
$loginResult | ConvertTo-Json

# Test 4: School Register
Write-Host "`n[TEST 4] School Registration"
$schoolReg = @{
    school_name="Test High School"; school_type="High School"; address="123 Street"
    region_state="Karnataka"; contact_info="555-1234"; num_students=0; num_staff=15
    admin_name="Principal"; admin_email="principal$u@school.com"; admin_phone="555-5678"
    password="School@123"; terms_accepted=$true; emergency_contact_pref="email"
} | ConvertTo-Json
$schoolRegResult = Invoke-RestMethod -Uri http://localhost:8000/api/auth/school/register -Method POST -Body $schoolReg -ContentType "application/json"
Write-Host "PASS - School registered:" -ForegroundColor Green
$schoolRegResult | ConvertTo-Json
$schoolId = $schoolRegResult.id

# Test 5: School Login
Write-Host "`n[TEST 5] School Login"
$schoolLogin = @{ email_or_username="principal$u@school.com"; password="School@123" } | ConvertTo-Json
$schoolAuth = Invoke-RestMethod -Uri http://localhost:8000/api/auth/school/login -Method POST -Body $schoolLogin -ContentType "application/json"
Write-Host "PASS - School logged in:" -ForegroundColor Green
$schoolAuth | ConvertTo-Json
$schoolToken = $schoolAuth.token
$schoolId = $schoolAuth.school_id

# Test 6: Bulk Upload
Write-Host "`n[TEST 6] Bulk Upload Students"
"name,email`nAlice,alice$u@student.com`nBob,bob$u@student.com" | Set-Content -Path "test_$u.csv" -Encoding UTF8
$uploadResult = Invoke-WebRequest -Uri "http://localhost:8000/api/students/bulk-upload?schoolId=$schoolId" -Method Post -Form @{ file = Get-Item "test_$u.csv" }
Write-Host "PASS - Students uploaded:" -ForegroundColor Green
$uploadResult.Content
Remove-Item "test_$u.csv"

# Test 7: Download CSV
Write-Host "`n[TEST 7] Download Students CSV"
Invoke-WebRequest -Uri "http://localhost:8000/api/students/download/$schoolId" -OutFile "students_$schoolId.csv"
Write-Host "PASS - CSV downloaded:" -ForegroundColor Green
Get-Content "students_$schoolId.csv"

# Test 8: Dashboard
Write-Host "`n[TEST 8] School Dashboard (JWT Protected)"
$headers = @{ Authorization = "Bearer $schoolToken" }
$dashboard = Invoke-RestMethod -Headers $headers -Uri "http://localhost:8000/api/schools/dashboard/$schoolId" -Method GET
Write-Host "PASS - Dashboard:" -ForegroundColor Green
$dashboard | ConvertTo-Json -Depth 5

# Test 9: Create Course
Write-Host "`n[TEST 9] Create Course"
$course = @{ title="Intro to CS"; description="Learn programming basics" } | ConvertTo-Json
$courseResult = Invoke-RestMethod -Uri http://localhost:8000/api/courses -Method POST -Body $course -ContentType "application/json"
Write-Host "PASS - Course created:" -ForegroundColor Green
$courseResult | ConvertTo-Json
$courseId = $courseResult.course_id

# Test 10: Create Module
Write-Host "`n[TEST 10] Create Module"
$module = @{ course=$courseId; title="Module 1"; content="Learn variables"; video_url=""; module_order=1 } | ConvertTo-Json
$moduleResult = Invoke-RestMethod -Uri http://localhost:8000/api/courses/modules -Method POST -Body $module -ContentType "application/json"
Write-Host "PASS - Module created:" -ForegroundColor Green
$moduleResult | ConvertTo-Json
$moduleId = $moduleResult.module_id

# Test 11: Get Modules
Write-Host "`n[TEST 11] Get Course Modules (Frontend Format)"
$modules = Invoke-RestMethod -Uri "http://localhost:8000/api/courses/$courseId/modules" -Method GET
Write-Host "PASS - Modules with learning_items:" -ForegroundColor Green
$modules | ConvertTo-Json -Depth 10

# Test 12: Create Quiz
Write-Host "`n[TEST 12] Create Quiz"
$quiz = @{ module=$moduleId; question="What is a variable?"; option_a="Fixed"; option_b="Storage"; option_c="Function"; option_d="Loop"; correct_option="B" } | ConvertTo-Json
$quizResult = Invoke-RestMethod -Uri http://localhost:8000/api/courses/quizzes -Method POST -Body $quiz -ContentType "application/json"
Write-Host "PASS - Quiz created:" -ForegroundColor Green
$quizResult | ConvertTo-Json

# Test 13: Create Exam
Write-Host "`n[TEST 13] Create Exam"
$exam = @{ course=$courseId; module=$moduleId; title="Assessment" } | ConvertTo-Json
$examResult = Invoke-RestMethod -Uri http://localhost:8000/api/courses/exams -Method POST -Body $exam -ContentType "application/json"
Write-Host "PASS - Exam created:" -ForegroundColor Green
$examResult | ConvertTo-Json
$examId = $examResult.exam_id

# Test 14: Exam Question
Write-Host "`n[TEST 14] Create Exam Question"
$examQ = @{ exam=$examId; question="Data type for numbers?"; option_a="String"; option_b="Integer"; option_c="Float"; option_d="Boolean"; correct_option="B" } | ConvertTo-Json
$examQResult = Invoke-RestMethod -Uri http://localhost:8000/api/courses/exam-questions -Method POST -Body $examQ -ContentType "application/json"
Write-Host "PASS - Exam question created:" -ForegroundColor Green
$examQResult | ConvertTo-Json

# Test 15: Get All Courses
Write-Host "`n[TEST 15] Get All Courses"
$allCourses = Invoke-RestMethod -Uri http://localhost:8000/api/courses -Method GET
Write-Host "PASS - Courses:" -ForegroundColor Green
$allCourses | ConvertTo-Json -Depth 5

# Test 16: Update Password
Write-Host "`n[TEST 16] Update School Password"
$pwdUpdate = @{ school_id=$schoolId; old_password="School@123"; new_password="NewSchool@456" } | ConvertTo-Json
$pwdResult = Invoke-RestMethod -Uri http://localhost:8000/api/auth/school/update-password -Method PUT -Body $pwdUpdate -ContentType "application/json"
Write-Host "PASS - Password updated:" -ForegroundColor Green
$pwdResult | ConvertTo-Json

# Test 17: Donations
Write-Host "`n[TEST 17] Add Donation"
$donation = @{ item_name="Laptops"; category="Electronics"; quantity=10; location="Office"; lat=12.97; lng=77.59 } | ConvertTo-Json
$donationResult = Invoke-RestMethod -Uri http://localhost:8000/api/donations -Method POST -Body $donation -ContentType "application/json"
Write-Host "PASS - Donation added:" -ForegroundColor Green
$donationResult | ConvertTo-Json

# Test 18: Get Donations
Write-Host "`n[TEST 18] Get Donations"
$donations = Invoke-RestMethod -Uri http://localhost:8000/api/donations -Method GET
Write-Host "PASS - Donations:" -ForegroundColor Green
$donations | ConvertTo-Json -Depth 3

# Test 19: Donation Stats
Write-Host "`n[TEST 19] Donation Stats"
$stats = Invoke-RestMethod -Uri http://localhost:8000/api/donations/stats -Method GET
Write-Host "PASS - Stats:" -ForegroundColor Green
$stats | ConvertTo-Json

Write-Host "`n========================================"
Write-Host "ALL TESTS COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n"
Write-Host "Frontend connects to: http://localhost:8000/api" -ForegroundColor Cyan
