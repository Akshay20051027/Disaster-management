<#
Local deployment helper script for this project.
Run this on your machine (not in the chat environment). It will:
 - check git & node
 - commit and push the repo to GitHub (you can provide a PAT locally if needed)
 - generate a strong JWT_SECRET and save it to a file (.jwt_secret.txt) in the repo (you can copy it to Render)
 - print the exact Render build/start commands and environment variables you must set

IMPORTANT: Do NOT paste secrets into chat. This script runs locally and keeps secrets on your machine.
#>

param(
    [string]$GitRemoteUrl = "https://github.com/Akshay20051027/Disaster-management.git",
    [switch]$UsePATForPush
)

function Check-Command($cmd) {
    $null = Get-Command $cmd -ErrorAction SilentlyContinue
    return $? 
}

Write-Host "== Local deploy helper =="

if (-not (Check-Command git)) {
    Write-Warning "Git is not installed or not in PATH. Install Git (https://git-scm.com/download/win) and re-run this script."
    exit 1
}

if (-not (Check-Command node)) {
    Write-Warning "Node.js is not installed or not in PATH. Install Node.js (https://nodejs.org/) and re-run this script."
    exit 1
}

# Confirm revocation of exposed tokens
$confirmed = Read-Host "Have you revoked any tokens you pasted in chat and generated new ones? (yes/no)"
if ($confirmed -ne 'yes') {
    Write-Warning "Please revoke exposed tokens (GitHub PAT, Render API key) before continuing. Visit GitHub and Render dashboards to revoke."
    exit 1
}

# Commit changes
Write-Host "Preparing git commit..."
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)
Set-Location -Path '..' | Out-Null
$repoRoot = Get-Location
Write-Host "Repo root: $repoRoot"

git init 2>$null | Out-Null
git add .
if (-not (git diff --cached --quiet)) {
    git commit -m "chore: add docker, CI, render manifest, and deploy workflows"
    Write-Host "Committed changes."
} else {
    Write-Host "No staged changes to commit."
}

# Push to GitHub
if ($UsePATForPush) {
    Write-Host "You chose to use a PAT for push. Enter it when prompted (it will not be stored by this script)."
    $pat = Read-Host -AsSecureString "Enter GitHub PAT (it will be used only for this push)"
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pat)
    $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    $remoteWithToken = $GitRemoteUrl -replace 'https://', "https://$plain@"
    try {
        git remote remove origin 2>$null | Out-Null
    } catch {}
    git remote add origin $remoteWithToken
    git branch -M main
    Write-Host "Pushing to GitHub (using PAT)..."
    git push -u origin main
    # remove remote with token and re-add without token
    git remote remove origin
    git remote add origin $GitRemoteUrl
} else {
    try {
        git remote remove origin 2>$null | Out-Null
    } catch {}
    git remote add origin $GitRemoteUrl 2>$null
    git branch -M main
    Write-Host "Pushing to GitHub (using your local git credentials)..."
    git push -u origin main
}

# Generate JWT secret locally and save to file
Write-Host "Generating a strong JWT_SECRET and saving to .jwt_secret.txt (in repo root)."
$bytes = New-Object byte[] 48
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$jwtSecret = ([System.BitConverter]::ToString($bytes)).Replace('-', '').ToLower()
$secretFile = Join-Path $repoRoot '.jwt_secret.txt'
$jwtSecret | Out-File -FilePath $secretFile -Encoding utf8
Write-Host "JWT secret generated and saved to $secretFile"

# Print Render instructions
Write-Host "`n=== Render manual setup instructions ===`n"
Write-Host "1) In Render dashboard create a new Web Service and connect your GitHub repo 'Disaster-management'."
Write-Host "2) Use these commands in Render:"
Write-Host "   Build command: npm install && npm --prefix backend install && npm run build"
Write-Host "   Start command: npm --prefix backend start"
Write-Host "3) Set the following environment variables in the Render service (Environment tab):"
Write-Host "   NODE_ENV = production"
Write-Host "   MONGODB_URI = <your MongoDB Atlas URI>"
Write-Host "   JWT_SECRET = (the secret saved in .jwt_secret.txt)"
Write-Host "   FRONTEND_URL = https://<your-render-url>    (optional, for CORS)
"

Write-Host "After creating the service, click Deploy. Watch the logs for frontend build and backend startup. If you enabled automatic deploy, pushes to main will trigger deploys."

Write-Host "If you want me to trigger the deploy via Render API, you can run the following cURL command locally (replace RENDER_API_KEY and RENDER_SERVICE_ID):"
Write-Host "curl -X POST \"https://api.render.com/v1/services/<RENDER_SERVICE_ID>/deploys\" -H \"Accept: application/json\" -H \"Authorization: Bearer <RENDER_API_KEY>\" -H \"Content-Type: application/json\" -d '{\"clearCache\": true}'"

Write-Host "
Done. If you run this script and then tell me the Render service URL, I will verify the deployment and help fix any issues."