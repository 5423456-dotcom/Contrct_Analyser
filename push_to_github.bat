@echo off
title Push ContractAI Code to GitHub
color 0A
echo ====================================================================
echo   Pushing ContractAI Full-Stack Codebase to GitHub...
echo   Repository: https://github.com/5423456-dotcom/Contrct_Analyser.git
echo ====================================================================
echo.
cd /d "d:\final_project_demo\Contrct_Analyser"
echo Checking repository status...
git status
echo.
echo Pushing commit to GitHub (main branch)...
git push origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ====================================================================
    echo   SUCCESS! Everything has been pushed to GitHub!
    echo.
    echo   Refresh your GitHub page:
    echo   https://github.com/5423456-dotcom/Contrct_Analyser
    echo.
    echo   Your language graph will now display:
    echo     - JavaScript (React 19, JSX, React Router)
    echo     - Python (FastAPI backend, NLP heuristic engine)
    echo     - CSS (Tailwind CSS styling)
    echo     - HTML
    echo ====================================================================
) else (
    echo.
    echo [Notice] If prompted, please complete the GitHub sign-in prompt.
)
echo.
pause
