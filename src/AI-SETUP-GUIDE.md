# 🤖 KAAL AI Integration - Secure Setup Guide

## ✨ What You Get
- **100% Secure**: API keys never exposed to frontend
- **Supabase Edge Functions**: Backend proxy for all AI calls
- **Encrypted Storage**: API keys encrypted in Supabase database
- **Zero Trust**: Frontend only calls authenticated backend endpoints

---

## 🚀 Quick Setup (3 Steps)

### **Step 1: Create API Keys Table**
Run this SQL in Supabase SQL Editor:
```sql
-- Copy and run: /supabase-api-keys-table.sql
```
This creates the `user_api_keys` table with encryption and RLS.

---

### **Step 2: Deploy Edge Function**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Create edge function
supabase functions new gemini-proxy

# Copy the code from /supabase-edge-function.ts
# to: supabase/functions/gemini-proxy/index.ts

# Deploy
supabase functions deploy gemini-proxy
```

---

### **Step 3: Configure Your API Key** 
When you want to add AI:
1. Open KAAL Settings → AI Configuration
2. Enter your Gemini API key
3. Click "Save Securely"

**Your key is now:**
- ✅ Encrypted in Supabase
- ✅ Never stored in localStorage
- ✅ Never visible in frontend code
- ✅ Only accessible via authenticated Edge Function

---

## 📋 How It Works

### Traditional (Insecure) ❌
```
Frontend → API Key in localStorage → Direct API call
          ⚠️ Key exposed in browser!
```

### KAAL (Secure) ✅
```
Frontend → Authenticated request → Edge Function → Gemini API
                                  ↓
                            Encrypted key in DB
          🔒 Key never touches frontend!
```

---

## 🔐 Security Features

### 1. **Zero Frontend Exposure**
- API key stored in Supabase, not localStorage
- Frontend only knows "AI is enabled/disabled"
- No key ever sent to client

### 2. **Row-Level Security**
- Each user can only access their own API keys
- Supabase RLS policies enforce isolation
- Encrypted at rest in database

### 3. **Authenticated Backend**
- All AI calls require valid Supabase auth token
- Edge function verifies user before processing
- Rate limiting built-in (15 min minimum interval)

### 4. **Audit Trail**
- All AI calls logged in Supabase
- Track usage per user
- Monitor API consumption

---

## 🎯 Usage in Your App

### **Setup API Key**
```typescript
import { useAIContext } from './context/AIContext';

function SettingsScreen() {
  const { setGeminiAPIKey, geminiEnabled } = useAIContext();

  const handleSave = async (apiKey: string) => {
    await setGeminiAPIKey(apiKey);
    // Key is now securely stored!
  };

  return (
    <div>
      <input 
        type="password" 
        placeholder="Gemini API Key"
        onChange={(e) => handleSave(e.target.value)} 
      />
      <p>{geminiEnabled ? '✅ AI Enabled' : '⏸️ AI Disabled'}</p>
    </div>
  );
}
```

### **Get AI Insights**
```typescript
const { requestDeepInsights, activeInsights } = useAIContext();

// Trigger AI analysis
await requestDeepInsights();

// Display insights
activeInsights.map(insight => (
  <div key={insight.id}>
    <h4>{insight.title}</h4>
    <p>{insight.message}</p>
  </div>
));
```

---

## 🧪 Testing

### **Test Edge Function**
```bash
# Test locally
supabase functions serve gemini-proxy

# Test deployment
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/gemini-proxy \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "generate", "prompt": "Hello, KAAL!"}'
```

### **Test in App**
1. Sign in to KAAL
2. Go to Settings → AI
3. Enter test API key
4. Go to Focus Session
5. Check for AI insights in panel

---

## 📊 What AI Does

### **Smart Nudges** (No API calls)
- Energy dip detection
- Focus drift alerts  
- Flow state celebrations
- Break reminders

### **Deep Insights** (API calls, 15min intervals)
- Pattern analysis across sessions
- Personalized productivity recommendations
- Energy forecasting
- Optimal work schedule suggestions

### **Work Patterns** (On-demand)
- Peak productivity hours
- Optimal session length
- Break pattern recommendations
- Long-term trend analysis

---

## 💰 Cost Management

### **Built-in Rate Limiting**
- Minimum 15 minutes between API calls
- Quick nudges use heuristics (free)
- Deep insights only at strategic moments
- Typical usage: 4-6 API calls per day

### **Gemini Free Tier**
- 60 requests per minute
- 1500 requests per day
- KAAL uses ~0.3% of daily limit

---

## 🔧 Troubleshooting

### **"API key not configured"**
→ Go to Settings and enter your Gemini API key

### **"Edge function error"**
→ Check Edge Function is deployed: `supabase functions list`

### **"Not authenticated"**
→ Sign in again, session may have expired

### **AI not working**
1. Check Edge Function deployed
2. Verify API key in Supabase `user_api_keys` table
3. Check browser console for errors
4. Test Edge Function directly

---

## 🎓 Advanced: Custom Edge Functions

Want to add other AI providers? Copy the pattern:

```typescript
// supabase/functions/openai-proxy/index.ts
serve(async (req) => {
  const { user } = await supabase.auth.getUser();
  const { apiKey } = await getEncryptedKey(user.id, 'openai');
  
  // Call OpenAI with encrypted key
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  
  return new Response(JSON.stringify(response));
});
```

---

## 📚 Files Reference

- `/supabase-api-keys-table.sql` - Database schema
- `/supabase-edge-function.ts` - Edge Function code
- `/services/gemini-service-secure.ts` - Frontend service
- `/context/AIContext.tsx` - React context with AI logic

---

## ✅ Security Checklist

- [x] API keys stored in Supabase (encrypted)
- [x] No keys in localStorage
- [x] No keys in frontend code
- [x] All AI calls authenticated
- [x] Row-Level Security enabled
- [x] Rate limiting implemented
- [x] CORS configured properly
- [x] Edge Function deployed

---

## 🎉 Ready to Go!

Your AI is now secure, scalable, and production-ready!

**Next: Get your Gemini API key**
→ https://aistudio.google.com/app/apikey

**Then: Add it in KAAL Settings → AI Configuration**

**Questions?** Check the console logs or Supabase logs for debugging.
