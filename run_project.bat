@echo off
title Basic Authentication Simulation Launcher
echo ========================================================
echo  Starting Basic Authentication Simulation Servers
echo ========================================================
echo.
echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "FastAPI Backend & UI (Port 8000)" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 2 /nobreak >nul

echo [2/2] Launching Frontend Server on http://localhost:3000 ...
start "Frontend Web Server (Port 3000)" cmd /k "cd /d %~dp0frontend && python -m http.server 3000"

timeout /t 2 /nobreak >nul

echo.
echo Opening Dashboard in your default browser...
start http://localhost:8000

echo.
echo ========================================================
echo  All systems running! Keep the opened terminal windows active.
echo  - Unified App URL:  http://localhost:8000
echo  - Standalone Web:   http://localhost:3000
echo  - Swagger Docs:     http://localhost:8000/docs
echo  - For Public URL:   run 'start_public_url.bat'
echo ========================================================
pause
