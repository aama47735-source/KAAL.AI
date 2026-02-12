# 🚨 Deployment Troubleshooting Guide - KAAL

## Common Issues: Preview Works ✅ but Production Fails ❌

This guide fixes the most common deployment issues where everything works locally but breaks in production.

---

## 🔥 Critical Fixes Applied

### ✅ 1. Fixed React Router 404s
**Problem:** Routes like `/dashboard`, `/tasks` return 404 on refresh or direct access.

**Root Cause:** Static hosting platforms don't know about React Router's client-side routes.

**Solution Applied:**
- ✅ Created `/public/_redirects` (plain text file, not directory!)
- ✅ Updated `/vercel.json` with proper rewrites
- ✅ Updated `/netlify.toml` with redirects
- ✅ All routes now redirect to `index.html` with 200 status

**Verify:**
```bash
# Check _redirects is a file, not directory
file public/_redirects
# Should output: "public/_redirects: ASCII text"
```

---

### ✅ 2. Fixed Vite Build Configuration
**Problem:** Large bundle sizes, slow loading, missing optimizations.

**Solution Applied:**
- ✅ Added manual chunk splitting (react, ui, supabase, charts)
- ✅ Disabled sourcemaps for production
- ✅ Configured proper server/preview settings
- ✅ Added chunk size limits

**Build Output Should Show:**
```
dist/assets/react-vendor-[hash].js
dist/assets/ui-vendor-[hash].js
dist/assets/supabase-vendor-[hash].js
dist/assets/chart-vendor-[hash].js
```

---

### ✅ 3. Fixed Supabase Client
**Problem:** Environment variables not loaded, hardcoded credentials fail.

**Solution Applied:**
- ✅ Added `import.meta.env.VITE_*` support
- ✅ Fallback to imported credentials if env vars missing
- ✅ Added validation logging
- ✅ Improved auth configuration with localStorage check

---

### ✅ 4. Fixed Catch-All Route
**Problem:** `Navigate to="/dashboard"` causes redirect loops for non-auth users.

**Solution Applied:**
- ✅ Changed wildcard route to show `<LandingPage />` instead
- ✅ Let `ProtectedRoute` handle auth redirects
- ✅ Prevents redirect loops

---

## 🧪 Testing Checklist

Before deploying, run these tests:

### 1. **Local Production Build Test**
```bash
# Build the app
npm run build

# Preview production build
npm run preview

# Open http://localhost:4173
```

**Test These:**
- [ ] Navigate to `/dashboard` directly
- [ ] Refresh page on `/tasks`
- [ ] Sign out and try accessing `/analytics` (should redirect to login)
- [ ] Sign in and verify redirect to dashboard
- [ ] Check browser console for errors
- [ ] Verify all images load
- [ ] Test task CRUD operations
- [ ] Check network tab for API calls

---

### 2. **Environment Variables Check**

**For Vercel:**
```bash
# In Vercel Dashboard:
# Settings → Environment Variables → Add New

VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...your_key_here
```

**For Netlify:**
```bash
# In Netlify Dashboard:
# Site Settings → Environment Variables → Add a variable

VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...your_key_here
```

**Important:** After adding environment variables, you MUST redeploy!

---

### 3. **Supabase Redirect URLs**

Go to: **Supabase Dashboard → Authentication → URL Configuration**

Add these redirect URLs:

**Production URLs:**
```
https://your-app.vercel.app
https://your-app.vercel.app/auth-callback
https://your-app.netlify.app
https://your-app.netlify.app/auth-callback
https://yourdomain.com
https://yourdomain.com/auth-callback
```

**Development URLs:**
```
http://localhost:5173
http://localhost:5173/auth-callback
http://localhost:4173
http://localhost:4173/auth-callback
```

---

## 🐛 Common Error Messages & Fixes

### Error: "Failed to fetch" or "Network Error"

**Possible Causes:**
1. Environment variables not set
2. CORS issue with Supabase
3. Wrong Supabase URL

**Fix:**
```bash
# 1. Check browser console for exact error
# 2. Verify environment variables in hosting dashboard
# 3. Check Supabase dashboard for API errors
# 4. Verify Supabase URL format: https://projectid.supabase.co (no trailing slash)
```

---

### Error: "Invalid API key" or "JWT expired"

**Possible Causes:**
1. Wrong anon key
2. Expired JWT token
3. RLS policies blocking access

**Fix:**
```bash
# 1. Get fresh anon key from Supabase Dashboard → Settings → API
# 2. Clear browser localStorage:
localStorage.clear();

# 3. Check RLS policies in Supabase dashboard
# 4. Ensure policies allow authenticated users
```

---

### Error: "404 Not Found" on routes

**Possible Causes:**
1. `_redirects` file not deployed
2. Hosting platform config missing
3. Base URL not configured

**Fix:**
```bash
# Verify _redirects exists and is deployed:
curl https://your-app.com/_redirects
# Should return: /*    /index.html   200

# If missing, ensure it's in /public/_redirects (NOT a directory)
# Redeploy after fixing
```

---

### Error: Blank white screen in production

**Possible Causes:**
1. JavaScript error blocking render
2. Missing dependencies
3. Build optimization issue

**Fix:**
```bash
# 1. Open browser DevTools → Console
# 2. Look for errors (often React or import errors)
# 3. Check if dependencies are in "dependencies" (not "devDependencies")
# 4. Try disabling build optimizations temporarily:

# In vite.config.ts, temporarily set:
build: {
  minify: false,
  sourcemap: true,
}

# Rebuild and check console for actual error
```

---

### Error: Images not loading (404)

**Possible Causes:**
1. `figma:asset` imports failing
2. Wrong image paths
3. Missing files in build

**Fix:**
```bash
# Check dist/assets folder after build
npm run build
ls -la dist/assets/

# Verify images are included
# Check browser Network tab for 404s
# Ensure images are properly imported in components
```

---

## 🚀 Deployment Commands

### **Vercel (Recommended)**
```bash
# Install CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs [deployment-url]
```

### **Netlify**
```bash
# Install CLI
npm install -g netlify-cli

# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod

# Check deployment logs
netlify logs
```

### **Manual Deployment**
```bash
# Build locally
npm run build

# The dist/ folder is ready to deploy
# Upload to any static host (Firebase, Cloudflare Pages, GitHub Pages, etc.)
```

---

## 📊 Performance Checklist

After deploying, verify performance:

- [ ] **Lighthouse Score**: Run audit in Chrome DevTools (target: 90+)
- [ ] **Bundle Size**: Check dist/ folder size (target: <1MB)
- [ ] **Load Time**: First contentful paint <1.5s
- [ ] **API Response**: Supabase queries <500ms
- [ ] **Images**: All images load and are optimized
- [ ] **Fonts**: Custom fonts load without flash

---

## 🔍 Debug Commands

```bash
# Check if build succeeds
npm run build

# Check bundle size
npm run build && du -sh dist/

# List all build files
npm run build && find dist/ -type f

# Test production build locally
npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Check for unused dependencies
npx depcheck

# Analyze bundle
npm run build -- --mode analyze
```

---

## 📞 Still Having Issues?

### Step-by-Step Debug Process:

1. **Clear Everything:**
```bash
rm -rf node_modules dist .vite
npm install
npm run build
npm run preview
```

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for red errors
   - Copy exact error message

3. **Check Network Tab:**
   - Open DevTools → Network
   - Reload page
   - Look for failed requests (red)
   - Check if Supabase calls are working

4. **Check Supabase Dashboard:**
   - Go to Supabase project
   - Check Logs section
   - Look for errors or failed requests
   - Verify RLS policies are correct

5. **Check Hosting Platform Logs:**
   - Vercel: Dashboard → Deployment → Logs
   - Netlify: Dashboard → Deploys → [specific deploy] → Deploy log

6. **Verify Files Are Deployed:**
```bash
# Check if files exist on production
curl https://your-app.com/assets/index-[hash].js
curl https://your-app.com/_redirects
curl https://your-app.com/index.html
```

---

## ✅ Final Pre-Submission Checklist

Before submitting to hackathon:

- [ ] ✅ Build succeeds locally (`npm run build`)
- [ ] ✅ Preview works locally (`npm run preview`)
- [ ] ✅ All routes work (test /dashboard, /tasks, etc.)
- [ ] ✅ Authentication works (sign up, sign in, sign out)
- [ ] ✅ Database operations work (create/edit/delete tasks)
- [ ] ✅ Environment variables set in hosting platform
- [ ] ✅ Supabase redirect URLs updated
- [ ] ✅ No console errors in production
- [ ] ✅ Images load correctly
- [ ] ✅ Mobile responsive works
- [ ] ✅ Lighthouse score >85
- [ ] ✅ README.md updated with live link
- [ ] ✅ Demo video recorded (optional but recommended)

---

## 📁 Files That Must Be Deployed

Ensure these files are in your repo and deployed:

```
✅ /public/_redirects (file, not directory!)
✅ /vercel.json
✅ /netlify.toml
✅ /vite.config.ts (with build optimization)
✅ /package.json (all deps in dependencies)
✅ /index.html
✅ /routes.ts (with correct 404 handling)
✅ /services/supabase-client.ts (with env var support)
```

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ You can access any route directly (e.g., `https://your-app.com/analytics`)
2. ✅ Refreshing any page doesn't cause 404
3. ✅ Authentication flow works end-to-end
4. ✅ Database operations (create, read, update, delete) work
5. ✅ No console errors
6. ✅ All images and assets load
7. ✅ App works on mobile devices
8. ✅ Performance is acceptable (<3s load time)

---

## 🌟 Pro Tips

1. **Test on Multiple Devices:**
   - Desktop Chrome
   - Desktop Firefox
   - Mobile Safari (iOS)
   - Mobile Chrome (Android)

2. **Use Preview Deployments:**
   - Test on Vercel/Netlify preview URLs before going to production
   - Share preview URL with team for testing

3. **Monitor After Launch:**
   - Check Supabase dashboard for API usage
   - Monitor hosting platform analytics
   - Watch for error spikes

4. **Have Rollback Plan:**
   - Keep previous working deployment URL
   - Can quickly revert if issues arise

---

<div align="center">

## 🚀 Your KAAL app is production-ready!

### Deploy with confidence! 💪

**Good luck with your SAI University Hackathon submission! 🎉**

</div>
