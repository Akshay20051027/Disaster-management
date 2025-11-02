$ErrorActionPreference = 'Stop'
$base = 'http://localhost:8000'
$loginBody = @{ email_or_username = 'rahul_s'; password = 'student123' } | ConvertTo-Json
$res = Invoke-RestMethod -Uri "$base/api/auth/student/login" -Method POST -ContentType 'application/json' -Body $loginBody
Write-Host ("StudentId: {0}" -f $res.student_id)
$headers = @{ Authorization = "Bearer $($res.token)" }
$dash = Invoke-RestMethod -Uri "$base/api/students/dashboard/$($res.student_id)" -Method GET -Headers $headers
$dash | ConvertTo-Json -Depth 6
