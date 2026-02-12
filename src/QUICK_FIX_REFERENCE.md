# ⚡ Quick Fix Reference - KAAL Production Issues

> **Use this when features work in preview but not when opened through the deployed link.**

---

## 🔥 Most Common Issues & Instant Fixes

### 1️⃣ Routes Return 404 (Most Common!)
**Symptoms:** 
- Landing page works
- But `/dashboard`, `/tasks` show 404
- Refresh on any route breaks the app

**Fix:**
```bash
# Ensure these files exist:
ls vercel.json        # For Vercel
ls netlify.toml       # For Netlify
ls public/_redirects  # Fallback

# If missing, files are already created!
# Just commit and redeploy:
git add .
git commit -m "Add routing config"
git push
vercel --prod  # or netlify deploy --prod
```

---

### 2️⃣ Blank White Screen
**Symptoms:**
- Page loads but shows nothing
- Console shows errors

**Fix:**
```bash
# 1. Check environment variables
# Vercel: Project Settings → Environment Variables
# Netlify: Site Settings → Environment Variables

# Add these:
VITE_SUPABASE_URL = https://grxcanjeqpejwxdxdfen.supabase.co
VITE_SUPABASE_ANON_KEY = [your-key-from-dashboard]

# 2. Redeploy
vercel --prod
```

---

### 3️⃣ Authentication Not Working
**Symptoms:**
- Can't sign up/sign in
- "Invalid login credentials" error
- OAuth not redirecting

**Fix:**
```bash
# 1. Update Supabase redirect URLs
# Go to: Supabase → Authentication → URL Configuration

# Add your production URLs:
https://your-app.vercel.app
https://your-app.vercel.app/auth-callback

# 2. Check environment variables are set
# 3. Clear browser cache and cookies
# 4. Try again
```

---

### 4️⃣ Database Operations Failing
**Symptoms:**
- Can't create tasks
- Data not loading
- "Failed to fetch" errors

**Fix:**
```bash
# 1. Check Supabase logs
# Supabase Dashboard → Logs → API Logs

# 2. Verify RLS policies enabled
# Supabase → Database → Policies

# 3. Test query in SQL Editor:
SELECT * FROM tasks WHERE user_id = auth.uid();

# 4. Check environment variables match
```

---

### 5️⃣ Build Fails
**Symptoms:**
- Deployment fails
- Build errors in logs

**Fix:**
```bash
# 1. Test build locally first
npm run build

# 2. Check for TypeScript errors
npm run lint

# 3. Common fixes:
# - Move all imports to 'dependencies' (not devDependencies)
# - Remove unused imports
# - Fix any TypeScript errors

# 4. Try again
vercel --prod
```

---

## 🎯 Emergency Deployment Procedure

If everything is broken and hackathon deadline is near:

```bash
# 1. STOP. Take a breath. 🧘

# 2. Test locally
npm run build
npm run preview
# Open http://localhost:4173
# Does it work? If yes, it's a deployment config issue.

# 3. Quick redeploy
git add .
git commit -m "Fix deployment issues"
git push

# 4. Deploy fresh
vercel --prod --force

# 5. Add environment variables AGAIN
# Sometimes they get cleared!

# 6. Update Supabase URLs AGAIN
# Add production domain to redirect URLs

# 7. Test immediately
# Open live site in incognito mode
```

---

## 🔍 Debugging Checklist

Run through this in order:

1. [ ] Files exist: `vercel.json`, `netlify.toml`, `public/_redirects`
2. [ ] Environment variables set in hosting platform
3. [ ] Supabase redirect URLs include production domain
4. [ ] Local build works (`npm run build && npm run preview`)
5. [ ] No console errors in browser DevTools
6. [ ] Network tab shows 200 responses (not 404)
7. [ ] Supabase connection test passes
8. [ ] Can authenticate with test account
9. [ ] Can perform database operations

---

## 💡 Quick Commands

```bash
# Test locally
npm run build && npm run preview

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod

# Check environment variables
vercel env ls              # Vercel
netlify env:list           # Netlify

# View logs
vercel logs                # Vercel
netlify logs               # Netlify

# Force fresh deploy
vercel --prod --force
netlify deploy --prod --force
```

---

## 🆘 Last Resort

If nothing works and deadline is in 1 hour:

1. **Export current working local version**
```bash
npm run build
zip -r kaal-backup.zip dist/
```

2. **Deploy to Vercel from dashboard:**
   - Go to vercel.com → Add New Project
   - Import your GitHub repo
   - Add environment variables in UI
   - Deploy

3. **Or use Netlify drop:**
   - Go to app.netlify.com/drop
   - Drag and drop your `dist/` folder
   - Instant deployment!

4. **Manual static host:**
   - Upload `dist/` to any static hosting
   - Configure server to redirect all routes to `index.html`

---

## 📞 Get Help Fast

### Vercel Support
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Twitter: @vercel

### Netlify Support  
- Docs: https://docs.netlify.com
- Support: https://www.netlify.com/support/
- Community: https://answers.netlify.com

### Supabase Support
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase/discussions

---

## ✅ Verification Script

Run this to check everything:

```bash
echo "🔍 KAAL Deployment Check"
echo "========================"
echo ""

echo "✓ Checking routing config..."
[ -f vercel.json ] && echo "  ✅ vercel.json exists" || echo "  ❌ vercel.json missing"
[ -f netlify.toml ] && echo "  ✅ netlify.toml exists" || echo "  ❌ netlify.toml missing"
[ -f public/_redirects ] && echo "  ✅ _redirects exists" || echo "  ❌ _redirects missing"

echo ""
echo "✓ Checking environment..."
[ -f .env ] && echo "  ✅ .env exists" || echo "  ❌ .env missing (create from .env.example)"

echo ""
echo "✓ Checking build..."
npm run build > /dev/null 2>&1 && echo "  ✅ Build successful" || echo "  ❌ Build failed"

echo ""
echo "✓ Ready to deploy!"
```

---

<div align="center">

**💪 You've got the tools. Now ship it! 🚀**

</div>
