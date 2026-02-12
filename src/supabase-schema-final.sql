-- =====================================================
-- KAAL COMPLETE DATABASE SCHEMA (SAFE FOR RE-RUNS)
-- Full Supabase backend for all features
-- This version can be safely run multiple times
-- Tables ordered to handle dependencies correctly
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE (must be first - referenced by auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  professional_title TEXT,
  bio TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  website TEXT,
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  ai_settings JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
  
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
  
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
  
  DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
  CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = id);
END $$;

-- =====================================================
-- 2. WORKSPACES (must come before projects)
-- =====================================================
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  settings JSONB DEFAULT '{}',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_workspace_id ON workspaces(workspace_id);
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own workspaces" ON workspaces;
  CREATE POLICY "Users can view own workspaces" ON workspaces FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can insert own workspaces" ON workspaces;
  CREATE POLICY "Users can insert own workspaces" ON workspaces FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own workspaces" ON workspaces;
  CREATE POLICY "Users can update own workspaces" ON workspaces FOR UPDATE USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can delete own workspaces" ON workspaces;
  CREATE POLICY "Users can delete own workspaces" ON workspaces FOR DELETE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- 3. PROJECTS (depends on workspaces)
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'completed', 'archived')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date BIGINT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to existing projects table
DO $$ 
BEGIN
  -- Add workspace_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE projects ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
  END IF;

  -- Add project_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE projects ADD COLUMN project_id TEXT;
    -- Generate project_id for existing rows
    UPDATE projects SET project_id = 'project-' || id::text WHERE project_id IS NULL;
    -- Add unique constraint after populating
    CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_project_id_unique ON projects(project_id);
  END IF;

  -- Add other potentially missing columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'completion_percentage') THEN
    ALTER TABLE projects ADD COLUMN completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'color') THEN
    ALTER TABLE projects ADD COLUMN color TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'icon') THEN
    ALTER TABLE projects ADD COLUMN icon TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'members') THEN
    ALTER TABLE projects ADD COLUMN members TEXT[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'metadata') THEN
    ALTER TABLE projects ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'start_date') THEN
    ALTER TABLE projects ADD COLUMN start_date BIGINT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_project_id ON projects(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own projects" ON projects;
  CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
  CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own projects" ON projects;
  CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
  CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- 4. ENERGY LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS energy_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp BIGINT NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
  notes TEXT,
  mood TEXT,
  activity TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_energy_logs_user_id ON energy_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_logs_timestamp ON energy_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_energy_logs_user_timestamp ON energy_logs(user_id, timestamp DESC);
ALTER TABLE energy_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own energy logs" ON energy_logs;
  CREATE POLICY "Users can view own energy logs" ON energy_logs FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can insert own energy logs" ON energy_logs;
  CREATE POLICY "Users can insert own energy logs" ON energy_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own energy logs" ON energy_logs;
  CREATE POLICY "Users can update own energy logs" ON energy_logs FOR UPDATE USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can delete own energy logs" ON energy_logs;
  CREATE POLICY "Users can delete own energy logs" ON energy_logs FOR DELETE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- 5. FOCUS SESSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  planned_duration INTEGER NOT NULL,
  actual_duration INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'paused')),
  focus_score INTEGER CHECK (focus_score >= 0 AND focus_score <= 100),
  interruptions INTEGER DEFAULT 0,
  context_switches INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_session_id ON focus_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_start ON focus_sessions(user_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_status ON focus_sessions(status);
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own focus sessions" ON focus_sessions;
  CREATE POLICY "Users can view own focus sessions" ON focus_sessions FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can insert own focus sessions" ON focus_sessions;
  CREATE POLICY "Users can insert own focus sessions" ON focus_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own focus sessions" ON focus_sessions;
  CREATE POLICY "Users can update own focus sessions" ON focus_sessions FOR UPDATE USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can delete own focus sessions" ON focus_sessions;
  CREATE POLICY "Users can delete own focus sessions" ON focus_sessions FOR DELETE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- 6. SAVE STATES
-- =====================================================
CREATE TABLE IF NOT EXISTS save_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  state_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at_ts BIGINT NOT NULL,
  last_used_at BIGINT,
  usage_count INTEGER DEFAULT 0,
  settings JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_save_states_user_id ON save_states(user_id);
CREATE INDEX IF NOT EXISTS idx_save_states_state_id ON save_states(state_id);
CREATE INDEX IF NOT EXISTS idx_save_states_user_created ON save_states(user_id, created_at_ts DESC);
ALTER TABLE save_states ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own save states" ON save_states;
  CREATE POLICY "Users can view own save states" ON save_states FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can insert own save states" ON save_states;
  CREATE POLICY "Users can insert own save states" ON save_states FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own save states" ON save_states;
  CREATE POLICY "Users can update own save states" ON save_states FOR UPDATE USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can delete own save states" ON save_states;
  CREATE POLICY "Users can delete own save states" ON save_states FOR DELETE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- 7. STATE USAGE LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS state_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_id TEXT UNIQUE NOT NULL,
  state_id TEXT NOT NULL,
  state_name TEXT NOT NULL,
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  duration INTEGER DEFAULT 0,
  focus_score INTEGER CHECK (focus_score >= 0 AND focus_score <= 100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_state_usage_logs_user_id ON state_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_state_usage_logs_state_id ON state_usage_logs(state_id);
CREATE INDEX IF NOT EXISTS idx_state_usage_logs_user_start ON state_usage_logs(user_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_state_usage_logs_active ON state_usage_logs(is_active);
ALTER TABLE state_usage_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own state usage logs" ON state_usage_logs;
  CREATE POLICY "Users can view own state usage logs" ON state_usage_logs FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can insert own state usage logs" ON state_usage_logs;
  CREATE POLICY "Users can insert own state usage logs" ON state_usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own state usage logs" ON state_usage_logs;
  CREATE POLICY "Users can update own state usage logs" ON state_usage_logs FOR UPDATE USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can delete own state usage logs" ON state_usage_logs;
  CREATE POLICY "Users can delete own state usage logs" ON state_usage_logs FOR DELETE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- 8. REMINDERS
-- =====================================================
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date BIGINT NOT NULL,
  completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  tags TEXT[] DEFAULT '{}',
  recurring TEXT,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_reminder_id ON reminders(reminder_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_reminders_completed ON reminders(completed);
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own reminders" ON reminders;
  CREATE POLICY "Users can view own reminders" ON reminders FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can insert own reminders" ON reminders;
  CREATE POLICY "Users can insert own reminders" ON reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own reminders" ON reminders;
  CREATE POLICY "Users can update own reminders" ON reminders FOR UPDATE USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can delete own reminders" ON reminders;
  CREATE POLICY "Users can delete own reminders" ON reminders FOR DELETE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- 9. BACKLOG ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS backlog_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  tags TEXT[] DEFAULT '{}',
  created_at_ts BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_backlog_items_user_id ON backlog_items(user_id);
CREATE INDEX IF NOT EXISTS idx_backlog_items_item_id ON backlog_items(item_id);
CREATE INDEX IF NOT EXISTS idx_backlog_items_priority ON backlog_items(priority);
ALTER TABLE backlog_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own backlog items" ON backlog_items;
  CREATE POLICY "Users can view own backlog items" ON backlog_items FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can insert own backlog items" ON backlog_items;
  CREATE POLICY "Users can insert own backlog items" ON backlog_items FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own backlog items" ON backlog_items;
  CREATE POLICY "Users can update own backlog items" ON backlog_items FOR UPDATE USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can delete own backlog items" ON backlog_items;
  CREATE POLICY "Users can delete own backlog items" ON backlog_items FOR DELETE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- 10. CALENDAR EVENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time BIGINT NOT NULL,
  end_time BIGINT NOT NULL,
  all_day BOOLEAN DEFAULT false,
  location TEXT,
  attendees TEXT[] DEFAULT '{}',
  color TEXT,
  category TEXT,
  reminder_minutes INTEGER,
  recurrence_rule TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'tentative', 'cancelled')),
  external_id TEXT,
  external_provider TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_id ON calendar_events(event_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_start ON calendar_events(user_id, start_time);
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own calendar events" ON calendar_events;
  CREATE POLICY "Users can view own calendar events" ON calendar_events FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can insert own calendar events" ON calendar_events;
  CREATE POLICY "Users can insert own calendar events" ON calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own calendar events" ON calendar_events;
  CREATE POLICY "Users can update own calendar events" ON calendar_events FOR UPDATE USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can delete own calendar events" ON calendar_events;
  CREATE POLICY "Users can delete own calendar events" ON calendar_events FOR DELETE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- 11. MEETINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meeting_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  duration INTEGER,
  participants TEXT[] DEFAULT '{}',
  meeting_link TEXT,
  notes TEXT,
  action_items JSONB DEFAULT '[]',
  recording_url TEXT,
  transcript TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_meeting_id ON meetings(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON meetings(start_time);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own meetings" ON meetings;
  CREATE POLICY "Users can view own meetings" ON meetings FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can insert own meetings" ON meetings;
  CREATE POLICY "Users can insert own meetings" ON meetings FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own meetings" ON meetings;
  CREATE POLICY "Users can update own meetings" ON meetings FOR UPDATE USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can delete own meetings" ON meetings;
  CREATE POLICY "Users can delete own meetings" ON meetings FOR DELETE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- 12. SHARE LINKS
-- =====================================================
CREATE TABLE IF NOT EXISTS share_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  link_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  short_code TEXT UNIQUE NOT NULL,
  access_level TEXT DEFAULT 'view' CHECK (access_level IN ('view', 'comment', 'edit')),
  password_hash TEXT,
  expires_at BIGINT,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_share_links_user_id ON share_links(user_id);
CREATE INDEX IF NOT EXISTS idx_share_links_link_id ON share_links(link_id);
CREATE INDEX IF NOT EXISTS idx_share_links_short_code ON share_links(short_code);
CREATE INDEX IF NOT EXISTS idx_share_links_resource ON share_links(resource_type, resource_id);
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own share links" ON share_links;
  CREATE POLICY "Users can view own share links" ON share_links FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can insert own share links" ON share_links;
  CREATE POLICY "Users can insert own share links" ON share_links FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own share links" ON share_links;
  CREATE POLICY "Users can update own share links" ON share_links FOR UPDATE USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can delete own share links" ON share_links;
  CREATE POLICY "Users can delete own share links" ON share_links FOR DELETE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- 13. SHARE LINK ACCESS LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS share_link_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_link_id UUID NOT NULL REFERENCES share_links(id) ON DELETE CASCADE,
  accessed_at BIGINT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_share_link_access_logs_share_link_id ON share_link_access_logs(share_link_id);
CREATE INDEX IF NOT EXISTS idx_share_link_access_logs_accessed_at ON share_link_access_logs(accessed_at);
ALTER TABLE share_link_access_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view access logs for own links" ON share_link_access_logs;
  CREATE POLICY "Users can view access logs for own links" ON share_link_access_logs FOR SELECT
    USING (EXISTS (SELECT 1 FROM share_links WHERE share_links.id = share_link_access_logs.share_link_id AND share_links.user_id = auth.uid()));
END $$;

-- =====================================================
-- 14. STREAK DATA
-- =====================================================
CREATE TABLE IF NOT EXISTS streak_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  focus_minutes INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  energy_logs_count INTEGER DEFAULT 0,
  is_active_day BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_streak_data_user_id ON streak_data(user_id);
CREATE INDEX IF NOT EXISTS idx_streak_data_date ON streak_data(date DESC);
CREATE INDEX IF NOT EXISTS idx_streak_data_user_date ON streak_data(user_id, date DESC);
ALTER TABLE streak_data ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own streak data" ON streak_data;
  CREATE POLICY "Users can view own streak data" ON streak_data FOR SELECT USING (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can insert own streak data" ON streak_data;
  CREATE POLICY "Users can insert own streak data" ON streak_data FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  DROP POLICY IF EXISTS "Users can update own streak data" ON streak_data;
  CREATE POLICY "Users can update own streak data" ON streak_data FOR UPDATE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
  CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  DROP TRIGGER IF EXISTS update_energy_logs_updated_at ON energy_logs;
  CREATE TRIGGER update_energy_logs_updated_at BEFORE UPDATE ON energy_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_focus_sessions_updated_at ON focus_sessions;
  CREATE TRIGGER update_focus_sessions_updated_at BEFORE UPDATE ON focus_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_save_states_updated_at ON save_states;
  CREATE TRIGGER update_save_states_updated_at BEFORE UPDATE ON save_states
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_state_usage_logs_updated_at ON state_usage_logs;
  CREATE TRIGGER update_state_usage_logs_updated_at BEFORE UPDATE ON state_usage_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_reminders_updated_at ON reminders;
  CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_backlog_items_updated_at ON backlog_items;
  CREATE TRIGGER update_backlog_items_updated_at BEFORE UPDATE ON backlog_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_calendar_events_updated_at ON calendar_events;
  CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
  CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_workspaces_updated_at ON workspaces;
  CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
  CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_share_links_updated_at ON share_links;
  CREATE TRIGGER update_share_links_updated_at BEFORE UPDATE ON share_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_streak_data_updated_at ON streak_data;
  CREATE TRIGGER update_streak_data_updated_at BEFORE UPDATE ON streak_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
-- All 14 tables created with proper dependencies
-- All RLS policies enabled
-- All indexes created
-- All triggers configured
-- Ready for production use!
-- =====================================================
