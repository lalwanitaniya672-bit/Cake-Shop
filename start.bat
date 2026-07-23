@echo off
title The Velvet Crumb - Dev Server
echo.
echo ========================================
echo    The Velvet Crumb - Development
echo ========================================
echo.

set PORT=5173

echo [1/3] Starting Vite dev server...
start "Vite" cmd /c "cd /d "%~dp0" && npx vite --host --port %PORT%"
timeout /t 4 /nobreak >nul

echo [2/3] Vite started. Launching Cloudflare Tunnel...
echo.

if exist "%~dp0cloudflared.exe" (
    echo [3/3] Starting tunnel...
    "%~dp0cloudflared.exe" tunnel --url http://localhost:%PORT%
) else (
    echo cloudflared.exe not found. Install from:
    echo https://github.com/cloudflare/cloudflared/releases
    echo.
    echo Your local URL: http://localhost:%PORT%
    echo Press any key to exit...
    pause >nul
)
