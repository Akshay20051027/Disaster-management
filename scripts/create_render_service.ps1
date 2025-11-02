<#
Create a Render Web Service for this repo using the Render API.
Run this script LOCALLY (do not paste your Render API key into chat).

What it does:
 - Prompts for your Render API key (secure input)
 - Reads repo info and creates a Web Service connected to GitHub
 - Sets environment variables provided interactively (MONGODB_URI, JWT_SECRET)
 - Triggers an initial deploy

Notes:
 - You must have already pushed the repo to GitHub and connected your GitHub account to Render.
 - This script uses the Render REST API. For details see https://render.com/docs/api
 - Run it locally in PowerShell. It will not send secrets to anyone but Render.
#>

param(
    [string]$RepoFullName = "Akshay20051027/Disaster-management",
    [string]$Branch = "main"
)

function Read-Secure($prompt) {
    $s = Read-Host -AsSecureString $prompt
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
    $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    return $plain
}

Write-Host "=== Create Render service (local) ==="

$renderKey = Read-Secure "Enter your Render API Key"
if (-not $renderKey) { Write-Error "Render API Key is required."; exit 1 }

$serviceName = Read-Host "Service name (e.g. dis-backend)"
if (-not $serviceName) { $serviceName = "dis-backend" }

$mongo = Read-Host "MONGODB_URI (paste your Atlas connection string)"
if (-not $mongo) { Write-Error "MONGODB_URI is required."; exit 1 }

$jwt = Read-Host "JWT_SECRET (or press Enter to read .jwt_secret.txt)"
if (-not $jwt) {
    $jwtFile = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Definition) '..' '.jwt_secret.txt'
    if (Test-Path $jwtFile) { $jwt = Get-Content $jwtFile -Raw } else { Write-Error "No JWT secret provided and .jwt_secret.txt not found."; exit 1 }
}

# Build request body for Render service
$body = @{
    service = @{
        name = $serviceName
        repo = "https://github.com/$RepoFullName"
        branch = $Branch
        env = "node"
        plan = "free"
        buildCommand = "npm install && npm --prefix backend install && npm run build"
        startCommand = "npm --prefix backend start"
        autoDeploy = $true
        healthCheckPath = "/"
    }
}

$json = $body | ConvertTo-Json -Depth 10

Write-Host "Creating Render service (this may take a moment)..."

try {
    $headers = @{ Authorization = "Bearer $renderKey"; Accept = 'application/json' }
    $resp = Invoke-RestMethod -Method Post -Uri 'https://api.render.com/v1/services' -Headers $headers -Body $json -ContentType 'application/json'
} catch {
    Write-Error "Render service creation failed: $_"
    exit 1
}

if ($resp.id) {
    Write-Host "Render service created: id=$($resp.id) name=$($resp.service?.name) url=$($resp.service?.serviceDetails?.url)"
    $serviceId = $resp.id
} else {
    Write-Error "Unexpected response from Render: $($resp | ConvertTo-Json -Depth 5)"
    exit 1
}

# Set environment variables for the service
Write-Host "Setting environment variables (MONGODB_URI, JWT_SECRET, NODE_ENV)"

$envVars = @(
    @{ key = 'MONGODB_URI'; value = $mongo; scope = 'env' },
    @{ key = 'JWT_SECRET'; value = $jwt; scope = 'env' },
    @{ key = 'NODE_ENV'; value = 'production'; scope = 'env' }
)

foreach ($ev in $envVars) {
    $payload = @{ key = $ev.key; value = $ev.value; scope = $ev.scope } | ConvertTo-Json
    try {
        $setResp = Invoke-RestMethod -Method Post -Uri "https://api.render.com/v1/services/$serviceId/env-vars" -Headers $headers -Body $payload -ContentType 'application/json'
        Write-Host "Set $($ev.key)"
    } catch {
        Write-Warning "Failed to set $($ev.key): $_"
    }
}

Write-Host "Triggering a deploy..."
try {
    $deployResp = Invoke-RestMethod -Method Post -Uri "https://api.render.com/v1/services/$serviceId/deploys" -Headers $headers -Body '{"clearCache": true}' -ContentType 'application/json'
    Write-Host "Deploy triggered. Deploy id: $($deployResp.id)"
} catch {
    Write-Warning "Failed to trigger deploy: $_"
}

Write-Host "All done. Visit your Render dashboard to watch build logs and get the service URL."
