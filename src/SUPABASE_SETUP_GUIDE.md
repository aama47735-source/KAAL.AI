# KAAL Supabase Backend Setup Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)

### Step 2: Run Database Migration
1. Open `/supabase-schema.sql` file in this project
2. Copy ALL the SQL code
3. Paste into Supabase SQL Editor
4. Click **RUN** button
5. Wait for "Success" message

### Step 3: Verify Tables Created
1. Go to **Table Editor** (left sidebar)
2. You should see these new tables:
   - ✅ energy_logs
   - ✅ focus_sessions
   - ✅ save_states
   - ✅ state_usage_logs
   - ✅ reminders
   - ✅ backlog_items
   - ✅ calendar_events
   - ✅ meetings
   - ✅ workspaces
   - ✅ projects
   - ✅ share_links
   - ✅ share_link_access_logs
   - ✅ streak_data

### Step 4: Test the Application
1. Sign in to KAAL
2. Test these features (they all use Supabase now):
   - ✅ Create a task → Check `tasks` table
   - ✅ Log energy level → Check `energy_logs` table
   - ✅ Create backlog item → Check `backlog_items` table
   - ✅ Add reminder → Check `reminders` table
   - ✅ Activate save state → Check `save_states` table
   - ✅ Edit profile → Check `profiles` table

---

## 🔍 Troubleshooting

### Error: "relation already exists"
**Solution**: Some tables already exist. That's OK! The schema uses `CREATE TABLE IF NOT EXISTS` so it won't break existing tables.

### Error: "permission denied"
**Solution**: Make sure you're running the SQL as the project owner/admin in Supabase dashboard.

### Error: "function uuid_generate_v4 does not exist"
**Solution**: The schema includes `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` at the top. Make sure this line runs first.

### Data not showing up in tables
**Solution**: 
1. Check browser console for errors
2. Verify RLS policies are enabled (they should auto-enable)
3. Make sure you're logged in with the same user

---

## 🧪 Testing Each Feature

### Test Energy Logs
```typescript
// Go to Energy Hub screen
// Click "Log Energy" button
// Select level 4
// Add note "Testing Supabase"
// Check energy_logs table in Supabase
```

### Test Save States
```typescript
// Go to Save States screen
// Click any preset card to activate
// Check save_states table for the preset
// Check state_usage_logs table for activation log
```

### Test Reminders
```typescript
// Go to Reminders screen
// Click "+ New Reminder"
// Fill in details and save
// Check reminders table in Supabase
```

### Test Backlog
```typescript
// Go to Backlog screen
// Click "+ Add Item"
// Fill in details and save
// Check backlog_items table in Supabase
```

### Test Focus Sessions
```typescript
// Go to Dashboard
// Click "New Focus Session"
// Start a session
// Check focus_sessions table
// End session
// Check that actualDuration is updated
```

---

## 📊 Monitoring & Analytics

### Check Database Size
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Count Records Per Table
```sql
SELECT 
  'energy_logs' as table_name, COUNT(*) as count FROM energy_logs
UNION ALL
SELECT 'focus_sessions', COUNT(*) FROM focus_sessions
UNION ALL
SELECT 'save_states', COUNT(*) FROM save_states
UNION ALL
SELECT 'reminders', COUNT(*) FROM reminders
UNION ALL
SELECT 'backlog_items', COUNT(*) FROM backlog_items
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks;
```

### View Recent Activity
```sql
-- Recent energy logs
SELECT * FROM energy_logs ORDER BY timestamp DESC LIMIT 10;

-- Active focus sessions
SELECT * FROM focus_sessions WHERE status = 'active';

-- Today's reminders
SELECT * FROM reminders 
WHERE due_date >= EXTRACT(EPOCH FROM CURRENT_DATE) * 1000 
ORDER BY due_date;
```

---

## 🔐 Security Features

### Row Level Security (RLS)
- ✅ **Enabled** on ALL tables
- ✅ Users can only see their own data
- ✅ No cross-user data leakage

### Policies Applied
```sql
-- Example: energy_logs policies
✅ Users can view own energy logs
✅ Users can insert own energy logs
✅ Users can update own energy logs
✅ Users can delete own energy logs
```

### Test Security
1. Create data as User A
2. Log out
3. Sign in as User B
4. Verify you can't see User A's data

---

## 🎯 Performance Optimizations

### Indexes Created
- ✅ `user_id` on all tables (for fast user queries)
- ✅ `timestamp`/`date` fields (for time-based queries)
- ✅ `status` fields (for filtering active items)
- ✅ Composite indexes on `(user_id, timestamp)` pairs

### Query Performance
- Most queries should return in < 100ms
- Indexed queries can handle 10,000+ records efficiently
- Foreign key constraints ensure data integrity

---

## 💾 Backup & Recovery

### Auto Backups
Supabase automatically backs up your database. To restore:
1. Go to **Database** → **Backups** in Supabase dashboard
2. Select backup point
3. Click **Restore**

### Manual Export
```sql
-- Export all KAAL data as JSON
SELECT json_build_object(
  'energy_logs', (SELECT json_agg(energy_logs) FROM energy_logs),
  'focus_sessions', (SELECT json_agg(focus_sessions) FROM focus_sessions),
  'save_states', (SELECT json_agg(save_states) FROM save_states),
  'reminders', (SELECT json_agg(reminders) FROM reminders),
  'backlog_items', (SELECT json_agg(backlog_items) FROM backlog_items),
  'tasks', (SELECT json_agg(tasks) FROM tasks)
) as kaal_backup;
```

---

## 🚨 Common Issues & Fixes

### Issue: "No data loading"
**Fix**: 
```typescript
// Check browser console
// Look for auth errors
// Verify user is authenticated
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);
```

### Issue: "Slow queries"
**Fix**:
```sql
-- Check for missing indexes
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### Issue: "Permission errors"
**Fix**:
```sql
-- Verify RLS policies exist
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## ✅ Deployment Checklist

Before pushing to production:

- [ ] Run `/supabase-schema.sql` in production Supabase
- [ ] Verify all tables created successfully
- [ ] Test each feature with real user account
- [ ] Check RLS policies are enabled
- [ ] Verify indexes are created
- [ ] Test with multiple users
- [ ] Monitor query performance
- [ ] Set up database backups
- [ ] Document API endpoints used
- [ ] Test error handling

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Supabase project is active
3. Check `/BACKEND_MIGRATION_STATUS.md` for service status
4. Review `/services/supabase-service.ts` for API methods

**Everything is ready! Just run the SQL migration and you're good to go! 🚀**
