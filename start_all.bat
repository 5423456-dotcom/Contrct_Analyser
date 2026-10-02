@echo off
echo ===================================================
echo Starting ContractAI - Full Stack Application
echo ===================================================
echo 1. Launching Backend on http://localhost:8000 ...
start "ContractAI Backend" cmd /c "run_backend.bat"
timeout /t 3 /nobreak >nul
echo 2. Launching Frontend on http://localhost:5173 ...
start "ContractAI Frontend" cmd /c "run_frontend.bat"
echo ===================================================
echo ContractAI is starting up!
echo Frontend will be accessible at: http://localhost:5173
echo Backend API Docs will be at:    http://localhost:8000/docs
echo ===================================================
