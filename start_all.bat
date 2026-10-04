@echo off
title ContractAI - Full Stack Launcher
color 0A

echo.
echo ====================================================================
echo   ContractAI - Student Intelligence Platform
echo   Full-Stack Launcher (Host: 0.0.0.0 - External and Local Access)
echo ====================================================================
echo.

echo [1/3] Starting Backend (FastAPI on http://0.0.0.0:8000)...
start "ContractAI Backend" cmd /k "cd /d %~dp0backend && ..\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Waiting for backend to initialize (4 seconds)...
timeout /t 4 /nobreak >nul

echo [3/3] Starting Frontend (Vite Dev on http://0.0.0.0:5173)...
start "ContractAI Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo Opening browser...
start http://localhost:5173

echo.
echo ====================================================================
echo   ContractAI is now running!
echo   
echo   Frontend:  http://localhost:5173 (or http://127.0.0.1:5173)
echo   Backend:   http://localhost:8000 (or http://127.0.0.1:8000)
echo   API Docs:  http://localhost:8000/docs
echo   
echo   Demo Login Credentials:
echo     Email:    student@university.edu  
echo     Password: student123
echo   
echo   Host Bound: 0.0.0.0 (Accessible across local & external network)
echo   Keep both terminal windows open.
echo ====================================================================
echo.
pause
