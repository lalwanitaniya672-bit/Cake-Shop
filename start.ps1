$host.UI.RawUI.WindowTitle = "Velvet Crumb - Dev Server"
Write-Host ""
Write-Host "========================================" -ForegroundColor DarkYellow
Write-Host "   The Velvet Crumb - Development" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor DarkYellow
Write-Host ""

$port = 5173
$projectDir = $PSScriptRoot

Write-Host "[1/3] Starting Vite dev server on port $port..." -ForegroundColor Cyan
$env:VITE_PORT = $port

$viteJob = Start-Job -ScriptBlock {
    param($dir, $port)
    Set-Location $dir
    npx vite --host --port $port 2>&1
} -ArgumentList $projectDir, $port

Start-Sleep -Seconds 3

Write-Host "[2/3] Vite server started. Checking connection..." -ForegroundColor Cyan
$reachable = $false
for ($i = 1; $i -le 5; $i++) {
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:$port" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        $reachable = $true
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}

if ($reachable) {
    Write-Host "  Vite is running at http://localhost:$port" -ForegroundColor Green
} else {
    Write-Host "  Vite may still be starting. Continuing anyway..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[3/3] Starting Cloudflare Tunnel..." -ForegroundColor Cyan
Write-Host ""

$tunnelExe = Join-Path $projectDir "cloudflared.exe"
if (-not (Test-Path $tunnelExe)) {
    Write-Host "  cloudflared.exe not found. Downloading..." -ForegroundColor Yellow
    $url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
    Invoke-WebRequest -Uri $url -OutFile $tunnelExe -UseBasicParsing
    Write-Host "  Downloaded successfully." -ForegroundColor Green
}

$tunnelOutput = ""
$publicUrl = ""

$tunnelJob = Start-Job -ScriptBlock {
    param($exe, $port)
    & $exe tunnel --url http://localhost:$port 2>&1
} -ArgumentList $tunnelExe, $port

Write-Host "  Waiting for tunnel to establish..." -ForegroundColor Gray
for ($i = 1; $i -le 20; $i++) {
    Start-Sleep -Seconds 1
    $output = Receive-Job -Job $tunnelJob -ErrorAction SilentlyContinue
    if ($output) {
        foreach ($line in $output) {
            if ($line -match "https://[a-z0-9\-]+\.trycloudflare\.com") {
                $publicUrl = $Matches[0]
                break
            }
        }
    }
    if ($publicUrl) { break }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SERVER IS RUNNING" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  LOCAL (Laptop):" -ForegroundColor White
Write-Host "  http://localhost:$port" -ForegroundColor Yellow
Write-Host ""
Write-Host "  REMOTE (Phone/Any Network):" -ForegroundColor White
if ($publicUrl) {
    Write-Host "  $publicUrl" -ForegroundColor Yellow
} else {
    Write-Host "  (tunnel may take a few more seconds...)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "  Open either URL in your browser." -ForegroundColor Gray
Write-Host "  Press Ctrl+C to stop all servers." -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

try {
    while ($true) {
        Start-Sleep -Seconds 2
        $viteState = Get-Job -Job $viteJob -ErrorAction SilentlyContinue
        if ($viteState.State -ne "Running") {
            Write-Host "Vite server stopped. Shutting down..." -ForegroundColor Red
            break
        }

        if (-not $publicUrl) {
            $output = Receive-Job -Job $tunnelJob -ErrorAction SilentlyContinue
            if ($output) {
                foreach ($line in $output) {
                    if ($line -match "https://[a-z0-9\-]+\.trycloudflare\.com") {
                        $publicUrl = $Matches[0]
                        Write-Host ""
                        Write-Host "  Tunnel URL: $publicUrl" -ForegroundColor Yellow
                        Write-Host ""
                        break
                    }
                }
            }
        }
    }
} finally {
    Write-Host ""
    Write-Host "Shutting down servers..." -ForegroundColor Yellow
    Stop-Job -Job $viteJob -ErrorAction SilentlyContinue
    Stop-Job -Job $tunnelJob -ErrorAction SilentlyContinue
    Remove-Job -Job $viteJob -Force -ErrorAction SilentlyContinue
    Remove-Job -Job $tunnelJob -Force -ErrorAction SilentlyContinue
    Write-Host "Done." -ForegroundColor Green
}
