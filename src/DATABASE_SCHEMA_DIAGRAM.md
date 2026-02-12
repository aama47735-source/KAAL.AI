# KAAL Database Schema Diagram
**Database:** PostgreSQL (Supabase)  
**Total Tables:** 14  
**Schema Version:** 1.0.0

---

## 📊 Visual Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KAAL DATABASE ARCHITECTURE                           │
│                    14 Tables with Row-Level Security (RLS)                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                            AUTHENTICATION LAYER                               │
└──────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   auth.users    │ (Supabase Auth)
                              │─────────────────│
                              │ id (PK)         │
                              │ email           │
                              │ encrypted_pwd   │
                              │ created_at      │
                              └────────┬────────┘
                                       │
                                       │ (1:1)
                                       ▼
                              ┌─────────────────┐
                              │ user_profiles   │
                              │─────────────────│
                              │ user_id (PK,FK) │
                              │ email           │
                              │ full_name       │
                              │ display_name    │
                              │ bio             │
                              │ avatar_url      │
                              │ timezone        │
                              │ work_hours      │
                              │ created_at      │
                              │ updated_at      │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼

┌──────────────────────────────────────────────────────────────────────────────┐
│                          CORE PRODUCTIVITY LAYER                              │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
    │   projects   │         │    tasks     │         │  backlog     │
    │─���────────────│         │──────────────│         │──────────────│
    │ id (PK)      │────────▶│ id (PK)      │         │ id (PK)      │
    │ user_id (FK) │  (1:N)  │ user_id (FK) │         │ user_id (FK) │
    │ name         │         │ project_id   │         │ title        │
    │ color        │         │ title        │         │ description  │
    │ description  │         │ description  │         │ priority     │
    │ is_archived  │         │ status       │         │ tags         │
    │ created_at   │         │ priority     │         │ created_at   │
    │ updated_at   │         │ estimated_tm │         └──────────────┘
    └──────────────┘         │ actual_time  │
                             │ tags         │
                             │ due_date     │
                             │ completed_at │
                             │ created_at   │
                             │ updated_at   │
                             └──────┬───────┘
                                    │
                                    │ (1:N)
                                    ▼
                           ┌──────────────┐
                           │task_history  │
                           │──────────────│
                           │ id (PK)      │
                           │ task_id (FK) │
                           │ user_id (FK) │
                           │ action       │
                           │ changed_flds │
                           │ old_values   │
                           │ new_values   │
                           │ changed_at   │
                           └──────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                          FOCUS & TIME TRACKING LAYER                          │
└──────────────────────────────────────────────────────────────────────────────┘

              ┌──────────────┐         ┌──────────────┐
              │focus_sessions│         │ daily_stats  │
              │──────────────│         │──────────────│
              │ id (PK)      │         │ id (PK)      │
              │ user_id (FK) │         │ user_id (FK) │
              │ task_id (FK) │         │ date         │
              │ start_time   │         │ tasks_cmpl   │
              │ end_time     │         │ tasks_crtd   │
              │ duration_min │         │ focus_time   │
              │ session_type │         │ sessions_cmp │
              │ completed    │         │ avg_energy   │
              │ notes        │         │ created_at   │
              │ energy_bfr   │         └──────────────┘
              │ energy_aftr  │
              │ created_at   │
              └──────────────┘

              ┌──────────────┐
              │ save_states  │
              │──────────────│
              │ id (PK)      │
              │ user_id (FK) │
              │ name         │
              │ snapshot     │ (JSONB: tasks, projects, settings)
              │ created_at   │
              └──────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                          ENERGY & WELLNESS LAYER                              │
└──────────────────────────────────────────────────────────────────────────────┘

                           ┌──────────────┐
                           │ energy_logs  │
                           │──────────────│
                           │ id (PK)      │
                           │ user_id (FK) │
                           │ energy_level │ (1-10 scale)
                           │ mood         │
                           │ notes        │
                           │ logged_at    │
                           │ created_at   │
                           └──────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                       CALENDAR & SCHEDULING LAYER                             │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
    │   events     │         │  meetings    │         │  reminders   │
    │──────────────│         │──────────────│         │──────────────│
    │ id (PK)      │         │ id (PK)      │         │ id (PK)      │
    │ user_id (FK) │         │ user_id (FK) │         │ user_id (FK) │
    │ title        │         │ title        │         │ task_id (FK) │
    │ description  │         │ attendees    │         │ title        │
    │ start_time   │         │ location     │         │ message      │
    │ end_time     │         │ meeting_url  │         │ remind_at    │
    │ event_type   │         │ start_time   │         │ is_sent      │
    │ color        │         │ end_time     │         │ created_at   │
    │ all_day      │         │ notes        │         └──────────────┘
    │ created_at   │         │ created_at   │
    └──────────────┘         └──────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                       COLLABORATION & WORKSPACE LAYER                         │
└──────────────────────────────────────────────────────────────────────────────┘

                           ┌──────────────┐
                           │ workspaces   │
                           │──────────────│
                           │ id (PK)      │
                           │ owner_id(FK) │
                           │ name         │
                           │ description  │
                           │ members      │ (Array of user IDs)
                           │ settings     │ (JSONB)
                           │ created_at   │
                           │ updated_at   │
                           └──────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                          CONFIGURATION LAYER                                  │
└──────────────────────────────────────────────────────────────────────────────┘

                           ┌──────────────┐
                           │  api_keys    │
                           │──────────────│
                           │ id (PK)      │
                           │ user_id (FK) │
                           │ service_name │
                           │ api_key_enc  │ (Encrypted)
                           │ is_active    │
                           │ created_at   │
                           │ updated_at   │
                           └──────────────┘
```

---

## 🗂️ Table Details

### 1. **user_profiles**
**Purpose:** Extended user information beyond auth  
**Relationships:** 1:1 with auth.users  
**RLS:** Users can only access their own profile

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | uuid | PK, FK → auth.users(id) | User identifier |
| email | varchar | NOT NULL, UNIQUE | User email |
| full_name | varchar | | Full name |
| display_name | varchar | | Display name |
| bio | text | | User bio |
| avatar_url | text | | Profile image URL |
| timezone | varchar | DEFAULT 'UTC' | User timezone |
| work_hours_start | time | | Work start time |
| work_hours_end | time | | Work end time |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

---

### 2. **tasks**
**Purpose:** Core task management  
**Relationships:** N:1 with projects, N:1 with user_profiles  
**RLS:** Users can only access their own tasks

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | Task identifier |
| user_id | uuid | FK → auth.users(id) | Owner |
| project_id | uuid | FK → projects(id), NULL | Associated project |
| title | varchar | NOT NULL | Task title |
| description | text | | Task description |
| status | varchar | DEFAULT 'todo' | todo, in_progress, completed |
| priority | varchar | DEFAULT 'backlog' | urgent, in_focus, backlog |
| estimated_time | int | | Estimated minutes |
| actual_time | int | DEFAULT 0 | Actual minutes spent |
| tags | text[] | | Task tags |
| due_date | timestamptz | | Due date |
| completed_at | timestamptz | | Completion timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_tasks_user_id` on user_id
- `idx_tasks_status` on status
- `idx_tasks_priority` on priority
- `idx_tasks_due_date` on due_date

---

### 3. **projects**
**Purpose:** Project organization and categorization  
**Relationships:** 1:N with tasks  
**RLS:** Users can only access their own projects

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | Project identifier |
| user_id | uuid | FK → auth.users(id) | Owner |
| name | varchar | NOT NULL | Project name |
| color | varchar | DEFAULT '#4F46E5' | Project color |
| description | text | | Project description |
| is_archived | boolean | DEFAULT false | Archive status |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

---

### 4. **task_history**
**Purpose:** Audit trail for task changes  
**Relationships:** N:1 with tasks  
**RLS:** Users can only view history of their own tasks

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | History entry ID |
| task_id | uuid | FK → tasks(id) | Related task |
| user_id | uuid | FK → auth.users(id) | User who made change |
| action | varchar | NOT NULL | created, updated, deleted |
| changed_fields | text[] | | Fields that changed |
| old_values | jsonb | | Previous values |
| new_values | jsonb | | New values |
| changed_at | timestamptz | DEFAULT now() | Change timestamp |

**Trigger:** Auto-populated via `log_task_changes` trigger

---

### 5. **focus_sessions**
**Purpose:** Track deep work sessions  
**Relationships:** N:1 with tasks  
**RLS:** Users can only access their own sessions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Session identifier |
| user_id | uuid | FK → auth.users(id) | Owner |
| task_id | uuid | FK → tasks(id), NULL | Associated task |
| start_time | timestamptz | NOT NULL | Session start |
| end_time | timestamptz | | Session end |
| duration_minutes | int | | Planned duration |
| session_type | varchar | DEFAULT 'pomodoro' | Session type |
| completed | boolean | DEFAULT false | Completion status |
| notes | text | | Session notes |
| energy_before | int | | Energy level (1-10) before |
| energy_after | int | | Energy level (1-10) after |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

---

### 6. **daily_stats**
**Purpose:** Aggregated daily productivity metrics  
**Relationships:** N:1 with user_profiles  
**RLS:** Users can only access their own stats

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Stats identifier |
| user_id | uuid | FK → auth.users(id) | Owner |
| date | date | NOT NULL, UNIQUE per user | Stats date |
| tasks_completed | int | DEFAULT 0 | Tasks completed |
| tasks_created | int | DEFAULT 0 | Tasks created |
| focus_time_minutes | int | DEFAULT 0 | Total focus time |
| sessions_completed | int | DEFAULT 0 | Sessions completed |
| average_energy | decimal | | Average energy level |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

**Index:** `idx_daily_stats_date` on (user_id, date)

---

### 7. **energy_logs**
**Purpose:** Track energy levels throughout the day  
**Relationships:** N:1 with user_profiles  
**RLS:** Users can only access their own logs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Log identifier |
| user_id | uuid | FK → auth.users(id) | Owner |
| energy_level | int | CHECK (1-10) | Energy level |
| mood | varchar | | Mood descriptor |
| notes | text | | Additional notes |
| logged_at | timestamptz | NOT NULL | Log timestamp |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

---

### 8. **events**
**Purpose:** Calendar events and time blocks  
**Relationships:** N:1 with user_profiles  
**RLS:** Users can only access their own events

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Event identifier |
| user_id | uuid | FK → auth.users(id) | Owner |
| title | varchar | NOT NULL | Event title |
| description | text | | Event description |
| start_time | timestamptz | NOT NULL | Event start |
| end_time | timestamptz | NOT NULL | Event end |
| event_type | varchar | | Event category |
| color | varchar | | Event color |
| all_day | boolean | DEFAULT false | All-day event flag |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

---

### 9. **meetings**
**Purpose:** Meeting management with attendees  
**Relationships:** N:1 with user_profiles  
**RLS:** Users can only access their own meetings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Meeting identifier |
| user_id | uuid | FK → auth.users(id) | Owner |
| title | varchar | NOT NULL | Meeting title |
| attendees | text[] | | Attendee emails |
| location | varchar | | Meeting location |
| meeting_url | text | | Video call URL |
| start_time | timestamptz | NOT NULL | Meeting start |
| end_time | timestamptz | NOT NULL | Meeting end |
| notes | text | | Meeting notes |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

---

### 10. **reminders**
**Purpose:** Smart reminder system  
**Relationships:** N:1 with tasks  
**RLS:** Users can only access their own reminders

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Reminder identifier |
| user_id | uuid | FK → auth.users(id) | Owner |
| task_id | uuid | FK → tasks(id), NULL | Associated task |
| title | varchar | NOT NULL | Reminder title |
| message | text | | Reminder message |
| remind_at | timestamptz | NOT NULL | Reminder time |
| is_sent | boolean | DEFAULT false | Sent status |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

---

### 11. **save_states**
**Purpose:** Workspace snapshots for quick context switching  
**Relationships:** N:1 with user_profiles  
**RLS:** Users can only access their own save states

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Save state identifier |
| user_id | uuid | FK → auth.users(id) | Owner |
| name | varchar | NOT NULL | Save state name |
| snapshot | jsonb | NOT NULL | Complete workspace data |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

**Snapshot Structure:**
```json
{
  "tasks": [...],
  "projects": [...],
  "focusSession": {...},
  "settings": {...}
}
```

---

### 12. **backlog**
**Purpose:** Backlog item management  
**Relationships:** N:1 with user_profiles  
**RLS:** Users can only access their own backlog

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Backlog item identifier |
| user_id | uuid | FK → auth.users(id) | Owner |
| title | varchar | NOT NULL | Item title |
| description | text | | Item description |
| priority | varchar | DEFAULT 'low' | low, medium, high |
| tags | text[] | | Item tags |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |

---

### 13. **workspaces**
**Purpose:** Shared workspace management  
**Relationships:** N:1 with user_profiles (owner)  
**RLS:** Users can access workspaces they own or are members of

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Workspace identifier |
| owner_id | uuid | FK → auth.users(id) | Workspace owner |
| name | varchar | NOT NULL | Workspace name |
| description | text | | Workspace description |
| members | uuid[] | | Member user IDs |
| settings | jsonb | | Workspace settings |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

---

### 14. **api_keys**
**Purpose:** Encrypted storage for user API keys  
**Relationships:** N:1 with user_profiles  
**RLS:** Users can only access their own API keys

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | API key identifier |
| user_id | uuid | FK → auth.users(id) | Owner |
| service_name | varchar | NOT NULL | Service (e.g., "gemini") |
| api_key_encrypted | text | NOT NULL | Encrypted API key |
| is_active | boolean | DEFAULT true | Active status |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

---

## 🔐 Row-Level Security (RLS) Policies

All tables have RLS enabled with the following policies:

### Policy Pattern
```sql
-- Users can SELECT their own data
CREATE POLICY "Users can view own {table}"
  ON {table} FOR SELECT
  USING (auth.uid() = user_id);

-- Users can INSERT their own data
CREATE POLICY "Users can insert own {table}"
  ON {table} FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can UPDATE their own data
CREATE POLICY "Users can update own {table}"
  ON {table} FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can DELETE their own data
CREATE POLICY "Users can delete own {table}"
  ON {table} FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 🔄 Triggers & Functions

### 1. Auto-update Timestamps
```sql
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON {table}
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Applied to:** tasks, projects, user_profiles, workspaces

### 2. Task History Logging
```sql
CREATE TRIGGER log_task_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION log_task_changes();
```

### 3. Profile Sync from Auth
```sql
CREATE TRIGGER sync_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile_from_metadata();
```

---

## 📈 Indexes for Performance

```sql
-- Tasks
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);

-- Focus Sessions
CREATE INDEX idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX idx_focus_sessions_start_time ON focus_sessions(start_time);

-- Daily Stats
CREATE INDEX idx_daily_stats_user_date ON daily_stats(user_id, date);

-- Energy Logs
CREATE INDEX idx_energy_logs_user_id ON energy_logs(user_id);
CREATE INDEX idx_energy_logs_logged_at ON energy_logs(logged_at);

-- Events
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_start_time ON events(start_time);
```

---

## 📊 Data Flow Diagram

```
User Sign Up
     ↓
auth.users created (Supabase Auth)
     ↓
[TRIGGER] create_user_profile_from_metadata()
     ↓
user_profiles created
     ↓
User can now:
     ├─→ Create tasks → [TRIGGER] log_task_changes → task_history
     ├─→ Create projects
     ├─→ Start focus_sessions
     ├─→ Log energy_logs
     ├─→ Create events
     ├─→ Create save_states
     └─→ View analytics (daily_stats)
```

---

## 🔗 Foreign Key Relationships Summary

| Child Table | Foreign Key | Parent Table | Relationship | On Delete |
|-------------|-------------|--------------|--------------|-----------|
| user_profiles | user_id | auth.users | 1:1 | CASCADE |
| tasks | user_id | auth.users | N:1 | CASCADE |
| tasks | project_id | projects | N:1 | SET NULL |
| task_history | task_id | tasks | N:1 | CASCADE |
| task_history | user_id | auth.users | N:1 | CASCADE |
| projects | user_id | auth.users | N:1 | CASCADE |
| focus_sessions | user_id | auth.users | N:1 | CASCADE |
| focus_sessions | task_id | tasks | N:1 | SET NULL |
| daily_stats | user_id | auth.users | N:1 | CASCADE |
| energy_logs | user_id | auth.users | N:1 | CASCADE |
| events | user_id | auth.users | N:1 | CASCADE |
| meetings | user_id | auth.users | N:1 | CASCADE |
| reminders | user_id | auth.users | N:1 | CASCADE |
| reminders | task_id | tasks | N:1 | CASCADE |
| save_states | user_id | auth.users | N:1 | CASCADE |
| backlog | user_id | auth.users | N:1 | CASCADE |
| workspaces | owner_id | auth.users | N:1 | CASCADE |
| api_keys | user_id | auth.users | N:1 | CASCADE |

---

## 📁 Files

- **Schema Definition:** `/supabase-schema-final.sql`
- **Migrations:** `/supabase/migrations/*.sql`
- **Documentation:** This file

---

**Last Updated:** February 12, 2026  
**Schema Version:** 1.0.0  
**Database Type:** PostgreSQL 15+  
**Managed By:** Supabase  
**Team:** JAIRAM
