#!/bin/bash

# KAAL Production Readiness Test
# Quick verification that all fixes are applied

echo "🧪 KAAL Production Readiness Test"
echo "=================================="
echo ""

ERRORS=0

# Test 1: Check _redirects file exists and is correct
echo "📝 Test 1: Checking _redirects file..."
if [ -f "public/_redirects" ]; then
    CONTENT=$(cat public/_redirects)
    if [[ "$CONTENT" == *"index.html"* ]]; then
        echo "✅ _redirects file is correct"
    else
        echo "❌ _redirects file has wrong content"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "❌ _redirects file missing"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Test 2: Check vite-env.d.ts exists
echo "📝 Test 2: Checking TypeScript definitions..."
if [ -f "vite-env.d.ts" ]; then
    echo "✅ vite-env.d.ts exists"
else
    echo "❌ vite-env.d.ts missing"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Test 3: Check supabase-client.ts has safe env access
echo "📝 Test 3: Checking Supabase client..."
if grep -q "getEnvVar" services/supabase-client.ts; then
    echo "✅ Safe environment variable access implemented"
else
    echo "❌ Safe environment variable access missing"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Test 4: Check deployment configs exist
echo "📝 Test 4: Checking deployment configs..."
if [ -f "vercel.json" ] && [ -f "netlify.toml" ]; then
    echo "✅ Deployment configs exist"
else
    echo "⚠️  Some deployment configs missing (not critical)"
fi
echo ""

# Test 5: Check .gitignore exists
echo "📝 Test 5: Checking .gitignore..."
if [ -f ".gitignore" ] && grep -q ".env" .gitignore; then
    echo "✅ .gitignore properly configured"
else
    echo "⚠️  .gitignore might not protect secrets"
fi
echo ""

# Test 6: Try to build
echo "📝 Test 6: Testing production build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build succeeds"
else
    echo "❌ Build failed (check errors above)"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Results
echo "=================================="
echo "📊 Test Results"
echo "=================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ All tests passed! Ready to deploy! 🚀"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./deploy.sh (or deploy.bat on Windows)"
    echo "2. Add environment variables in hosting dashboard"
    echo "3. Update Supabase redirect URLs"
    echo "4. Test production deployment"
    echo ""
    exit 0
else
    echo "❌ $ERRORS test(s) failed"
    echo ""
    echo "Please fix the issues above before deploying."
    echo "See /DEPLOYMENT_TROUBLESHOOTING.md for help"
    echo ""
    exit 1
fi
