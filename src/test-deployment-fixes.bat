@echo off
REM KAAL Production Readiness Test (Windows)
REM Quick verification that all fixes are applied

echo ==========================================
echo    KAAL Production Readiness Test
echo ==========================================
echo.

set ERRORS=0

REM Test 1: Check _redirects file exists
echo Test 1: Checking _redirects file...
if exist "public\_redirects" (
    findstr /C:"index.html" "public\_redirects" >nul
    if errorlevel 1 (
        echo [FAIL] _redirects file has wrong content
        set /a ERRORS+=1
    ) else (
        echo [PASS] _redirects file is correct
    )
) else (
    echo [FAIL] _redirects file missing
    set /a ERRORS+=1
)
echo.

REM Test 2: Check vite-env.d.ts exists
echo Test 2: Checking TypeScript definitions...
if exist "vite-env.d.ts" (
    echo [PASS] vite-env.d.ts exists
) else (
    echo [FAIL] vite-env.d.ts missing
    set /a ERRORS+=1
)
echo.

REM Test 3: Check supabase-client.ts has safe env access
echo Test 3: Checking Supabase client...
findstr /C:"getEnvVar" "services\supabase-client.ts" >nul
if errorlevel 1 (
    echo [FAIL] Safe environment variable access missing
    set /a ERRORS+=1
) else (
    echo [PASS] Safe environment variable access implemented
)
echo.

REM Test 4: Check deployment configs exist
echo Test 4: Checking deployment configs...
if exist "vercel.json" (
    if exist "netlify.toml" (
        echo [PASS] Deployment configs exist
    )
)
echo.

REM Test 5: Check .gitignore exists
echo Test 5: Checking .gitignore...
if exist ".gitignore" (
    findstr /C:".env" ".gitignore" >nul
    if errorlevel 1 (
        echo [WARN] .gitignore might not protect secrets
    ) else (
        echo [PASS] .gitignore properly configured
    )
)
echo.

REM Test 6: Try to build
echo Test 6: Testing production build...
call npm run build >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Build failed
    set /a ERRORS+=1
) else (
    echo [PASS] Build succeeds
)
echo.

REM Results
echo ==========================================
echo    Test Results
echo ==========================================
if %ERRORS%==0 (
    echo [SUCCESS] All tests passed! Ready to deploy!
    echo.
    echo Next steps:
    echo 1. Run: deploy.bat
    echo 2. Add environment variables in hosting dashboard
    echo 3. Update Supabase redirect URLs
    echo 4. Test production deployment
    echo.
) else (
    echo [FAILED] %ERRORS% test(s) failed
    echo.
    echo Please fix the issues above before deploying.
    echo See DEPLOYMENT_TROUBLESHOOTING.md for help
    echo.
)

pause
