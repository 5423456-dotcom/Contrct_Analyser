@echo off
title ContractAI Public URL Launcher
echo ========================================================
echo  ContractAI Full-Stack - Public URL Launcher
echo ========================================================
echo.
echo [1/2] Starting Unified Server on http://127.0.0.1:8000 ...
start "ContractAI Backend & UI (Port 8000)" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo.
echo [2/2] Launching Cloudflare Tunnel for Free Public HTTPS Access...
echo Cloudflare Tunnel will assign you a live *.trycloudflare.com URL below:
echo ========================================================
echo.
cloudflared tunnel --url http://127.0.0.1:8000

pause
