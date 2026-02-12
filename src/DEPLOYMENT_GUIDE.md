# KAAL Deployment Guide
**Deploy to Vercel in 5 Minutes** 🚀

---

## 🎯 Quick Deployment (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration

3. **Configure Environment Variables**
   In Vercel dashboard, add these variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_APP_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

**Live URL:** `https://your-project-name.vercel.app`

---

## 🔧 Option 2: Deploy via Vercel CLI

### Prerequisites
```bash
npm install -g vercel
```

### Deployment Steps

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy to Preview**
   ```bash
   vercel
   ```
   - Follow prompts
   - Choose project name
   - Deploy to preview environment

3. **Deploy to Production**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add VITE_APP_URL
   ```

---

## 📋 Pre-Deployment Checklist

### ✅ Code Ready
- [ ] All features implemented and tested
- [ ] No console errors in production build
- [ ] Build succeeds locally (`npm run build`)
- [ ] Preview works locally (`npm run preview`)

### ✅ Environment Variables
- [ ] Supabase URL configured
- [ ] Supabase anon key configured
- [ ] App URL set correctly
- [ ] All secrets stored securely (not in code)

### ✅ Supabase Backend
- [ ] Database tables created
- [ ] RLS policies applied
- [ ] Edge Functions deployed (if using AI)
- [ ] Storage buckets configured

### ✅ Security
- [ ] `.env` file in `.gitignore`
- [ ] No API keys in source code
- [ ] CORS configured in Supabase
- [ ] RLS policies tested

### ✅ Performance
- [ ] Images optimized
- [ ] Bundle size checked (`npm run build`)
- [ ] No unnecessary dependencies
- [ ] Code splitting implemented

---

## 🔐 Environment Variables Setup

### Required Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Application URL
VITE_APP_URL=https://your-app.vercel.app

# AI Configuration (Optional)
VITE_GEMINI_API_KEY=your_gemini_key_here
```

### Where to Add Variables

#### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** Your Supabase URL
   - **Environment:** Production, Preview, Development

#### Via Vercel CLI:
```bash
vercel env add VITE_SUPABASE_URL production
# Paste your value when prompted

vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_APP_URL production
```

---

## 🏗️ Build Configuration

### vercel.json (Optional)
Create `/vercel.json` for custom configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "VITE_APP_URL": "https://kaal.vercel.app"
  }
}
```

### Build Commands
Vercel automatically detects these from `package.json`:

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "dev": "vite",
    "preview": "vite preview"
  }
}
```

---

## 🌐 Custom Domain Setup

### 1. Add Domain in Vercel
- Go to Project Settings → Domains
- Add your custom domain (e.g., `kaal.app`)

### 2. Configure DNS
Add these records to your DNS provider:

**For apex domain (kaal.app):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Update Environment Variables
```bash
VITE_APP_URL=https://kaal.app
```

---

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Push to `develop`** → Preview deployment
- **Pull Requests** → Preview deployment with unique URL

### Deployment Hooks

Get notified on Discord/Slack:

```bash
# In Vercel project settings
Integrations → Add → Slack/Discord
```

---

## 🚀 Post-Deployment Steps

### 1. Verify Deployment
- [ ] Visit your live URL
- [ ] Test user registration
- [ ] Create a task
- [ ] Start a focus session
- [ ] Check AI features work
- [ ] Test on mobile device

### 2. Update Supabase
Configure redirect URLs in Supabase dashboard:

**Authentication → URL Configuration:**
```
Site URL: https://your-app.vercel.app
Redirect URLs:
  - https://your-app.vercel.app/auth/callback
  - http://localhost:5173/auth/callback (for dev)
```

### 3. Monitor Performance
```bash
# Check Vercel Analytics
vercel --prod
# Visit: your-app.vercel.app/_analytics
```

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `Cannot find module 'X'`
```bash
# Solution: Install missing dependency
npm install X
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push
```

**Error:** `TypeScript compilation failed`
```bash
# Solution: Fix TypeScript errors locally first
npm run build
# Fix all errors, then deploy
```

### Environment Variables Not Working

**Issue:** App can't connect to Supabase

**Solution:**
1. Verify variables in Vercel dashboard
2. Ensure they start with `VITE_`
3. Redeploy after adding variables:
   ```bash
   vercel --prod --force
   ```

### 404 on Routes

**Issue:** Direct URLs return 404

**Solution:** Add `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Slow Initial Load

**Solutions:**
1. Enable compression in Vercel (automatic)
2. Optimize images
3. Code split heavy components:
   ```typescript
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

---

## 📊 Performance Optimization

### 1. Enable Vercel Speed Insights
```bash
npm install @vercel/speed-insights
```

```typescript
// In main.tsx
import { SpeedInsights } from '@vercel/speed-insights/react';

<SpeedInsights />
```

### 2. Enable Web Analytics
```bash
npm install @vercel/analytics
```

```typescript
// In main.tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### 3. Configure Caching
```json
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🌍 Alternative Hosting Platforms

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### GitHub Pages

```bash
# Build for GitHub Pages
npm run build

# Deploy
npm install -g gh-pages
gh-pages -d dist
```

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway init
railway up
```

---

## 📈 Monitoring & Analytics

### Vercel Analytics
- Automatic Web Vitals tracking
- Real user monitoring
- Performance insights

### Supabase Metrics
- Database query performance
- API request logs
- Storage usage

### Error Tracking (Optional)
```bash
# Add Sentry
npm install @sentry/react

# Configure in main.tsx
Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE
});
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` to Git
- ✅ Use Vercel's encrypted storage
- ✅ Rotate keys regularly

### 2. HTTPS
- ✅ Vercel provides automatic HTTPS
- ✅ Enforce HTTPS redirects (automatic)

### 3. CORS
Configure in Supabase dashboard:
```
Allowed Origins:
  - https://your-app.vercel.app
  - http://localhost:5173
```

### 4. Rate Limiting
Supabase provides built-in rate limiting:
- 100 requests/minute (authenticated)
- 30 requests/minute (anonymous)

---

## 📞 Support & Resources

### Vercel Documentation
- [Deployment Guide](https://vercel.com/docs/deployments)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Custom Domains](https://vercel.com/docs/custom-domains)

### Supabase Documentation
- [Auth Configuration](https://supabase.com/docs/guides/auth)
- [CORS Setup](https://supabase.com/docs/guides/api#cors)
- [Edge Functions](https://supabase.com/docs/guides/functions)

### Community
- [Vercel Discord](https://vercel.com/discord)
- [Supabase Discord](https://discord.supabase.com)

---

## ✅ Deployment Complete!

Your KAAL application is now live and accessible worldwide! 🎉

**Next Steps:**
1. Share your live URL with team/hackathon judges
2. Monitor performance in Vercel dashboard
3. Set up custom domain (optional)
4. Enable analytics and monitoring
5. Create demo video showing live application

---

**Deployed by:** Team JAIRAM  
**Hackathon:** SAI University FOSS Club 2026  
**Live URL:** https://kaal.vercel.app  
**Last Updated:** February 12, 2026
