# 🚀 Quick Deploy Reference - KAAL

## One-Page Deployment Guide

---

## ⚡ Quick Deploy Commands

### Option 1: Automated Script (Easiest)
```bash
# Linux/Mac
./deploy.sh

# Windows
deploy.bat
```

### Option 2: Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Option 3: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## 🔑 Environment Variables to Set

After deployment, add these in your hosting platform:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...your_anon_key
```

### Where to Add:
- **Vercel:** Dashboard → Project → Settings → Environment Variables
- **Netlify:** Dashboard → Site → Settings → Environment Variables

**⚠️ Important:** Redeploy after adding environment variables!

---

## 🔗 Supabase Redirect URLs to Add

Go to: **Supabase Dashboard → Authentication → URL Configuration**

Add:
```
https://your-app.vercel.app
https://your-app.vercel.app/auth-callback
```

(Replace with your actual deployment URL)

---

## ✅ Quick Test Checklist

After deploying, test these URLs:

```
✓ https://your-app.com/
✓ https://your-app.com/signin
✓ https://your-app.com/dashboard
✓ https://your-app.com/tasks
✓ https://your-app.com/analytics
```

All should load without 404!

---

## 🐛 Quick Fixes

### If you get 404 on routes:
```bash
# Verify _redirects file exists
cat public/_redirects
# Should show: /*    /index.html   200

# Redeploy if missing
```

### If Supabase connection fails:
```bash
# 1. Check environment variables are set
# 2. Redeploy after adding them
# 3. Update Supabase redirect URLs
```

### If sign-in fails:
```bash
# Add your production URL to Supabase:
# Dashboard → Authentication → URL Configuration
# Add: https://your-app.com/auth-callback
```

---

## 📞 Full Documentation

For detailed troubleshooting, see:
- `/DEPLOYMENT_TROUBLESHOOTING.md` - Complete troubleshooting guide
- `/PRE_DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
- `/DEPLOYMENT_FIXES_APPLIED.md` - All fixes explained

---

## 🎯 That's It!

Deploy → Add Env Vars → Update Supabase URLs → Test → Done! 🎉

**Good luck with your SAI University Hackathon submission!**

---

<div align="center">

**Team JAIRAM | Akulapalli Jayaram**

🚀 **Built for SAI University FOSS Club Hackathon 2026** 🚀

</div>
