@echo off
REM KAAL Deployment Script for Windows
REM Quick deployment to Vercel or Netlify

echo ========================================
echo    KAAL Deployment Script (Windows)
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

REM Run build
echo Building production bundle...
call npm run build

if errorlevel 1 (
    echo Build failed! Check errors above.
    pause
    exit /b 1
)

echo Build successful!
echo.

REM Ask for deployment platform
echo Choose deployment platform:
echo 1) Vercel (Recommended)
echo 2) Netlify
echo 3) Preview build locally
echo 4) Cancel
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    echo Deploying to Vercel...
    where vercel >nul 2>nul
    if errorlevel 1 (
        echo Installing Vercel CLI...
        call npm install -g vercel
    )
    call vercel --prod
    goto done
)

if "%choice%"=="2" (
    echo Deploying to Netlify...
    where netlify >nul 2>nul
    if errorlevel 1 (
        echo Installing Netlify CLI...
        call npm install -g netlify-cli
    )
    call netlify deploy --prod
    goto done
)

if "%choice%"=="3" (
    echo Starting preview server...
    echo Open http://localhost:4173 in your browser
    call npm run preview
    goto done
)

if "%choice%"=="4" (
    echo Deployment cancelled
    goto end
)

echo Invalid choice
goto end

:done
echo.
echo Done!
echo.
echo IMPORTANT: Don't forget to:
echo    1. Set environment variables in hosting dashboard
echo    2. Update Supabase redirect URLs
echo    3. Test the deployed app thoroughly
echo.

:end
pause