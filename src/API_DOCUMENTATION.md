# KAAL API Documentation
**Version:** 1.0.0  
**Base URL:** `https://your-project-id.supabase.co`  
**Authentication:** Supabase JWT (Bearer Token)

---

## 📚 Table of Contents

1. [Authentication](#authentication)
2. [Tasks API](#tasks-api)
3. [Projects API](#projects-api)
4. [Focus Sessions API](#focus-sessions-api)
5. [Energy Logs API](#energy-logs-api)
6. [AI Services API](#ai-services-api)
7. [User Profile API](#user-profile-api)
8. [Analytics API](#analytics-api)
9. [Error Codes](#error-codes)

---

## 🔐 Authentication

All API requests require authentication via Supabase JWT tokens.

### Sign Up
**Endpoint:** `POST /auth/v1/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "options": {
    "data": {
      "full_name": "John Doe",
      "display_name": "John"
    }
  }
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "created_at": "2026-02-12T10:00:00Z"
  },
  "session": {
    "access_token": "jwt-token-here",
    "refresh_token": "refresh-token-here",
    "expires_in": 3600
  }
}
```

### Sign In
**Endpoint:** `POST /auth/v1/token?grant_type=password`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "jwt-token-here",
  "refresh_token": "refresh-token-here",
  "expires_in": 3600,
  "token_type": "bearer"
}
```

### Headers for Authenticated Requests
```http
Authorization: Bearer {access_token}
apikey: {supabase_anon_key}
Content-Type: application/json
```

---

## ✅ Tasks API

### Get All Tasks
**Endpoint:** `GET /rest/v1/tasks`

**Query Parameters:**
- `select` (string): Columns to select (default: `*`)
- `order` (string): Sort order (e.g., `created_at.desc`)
- `status` (string): Filter by status (`todo`, `in_progress`, `completed`)
- `priority` (string): Filter by priority (`urgent`, `in_focus`, `backlog`)

**Example Request:**
```http
GET /rest/v1/tasks?select=*&order=created_at.desc&status=eq.todo
Authorization: Bearer {token}
apikey: {anon_key}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-1",
    "user_id": "uuid-user",
    "title": "Complete hackathon project",
    "description": "Finish KAAL application for SAI University hackathon",
    "status": "in_progress",
    "priority": "urgent",
    "estimated_time": 120,
    "actual_time": 45,
    "project_id": "uuid-project",
    "tags": ["hackathon", "priority"],
    "due_date": "2026-02-12T13:00:00Z",
    "completed_at": null,
    "created_at": "2026-02-10T09:00:00Z",
    "updated_at": "2026-02-11T14:30:00Z"
  }
]
```

### Create Task
**Endpoint:** `POST /rest/v1/tasks`

**Request Body:**
```json
{
  "title": "New task title",
  "description": "Task description",
  "status": "todo",
  "priority": "in_focus",
  "estimated_time": 60,
  "project_id": "uuid-project",
  "tags": ["work", "important"],
  "due_date": "2026-02-15T17:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-new",
  "user_id": "uuid-user",
  "title": "New task title",
  "description": "Task description",
  "status": "todo",
  "priority": "in_focus",
  "estimated_time": 60,
  "actual_time": 0,
  "project_id": "uuid-project",
  "tags": ["work", "important"],
  "due_date": "2026-02-15T17:00:00Z",
  "completed_at": null,
  "created_at": "2026-02-12T10:00:00Z",
  "updated_at": "2026-02-12T10:00:00Z"
}
```

### Update Task
**Endpoint:** `PATCH /rest/v1/tasks?id=eq.{task_id}`

**Request Body:**
```json
{
  "title": "Updated task title",
  "status": "completed",
  "actual_time": 75
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-task",
  "title": "Updated task title",
  "status": "completed",
  "actual_time": 75,
  "completed_at": "2026-02-12T11:30:00Z",
  "updated_at": "2026-02-12T11:30:00Z"
}
```

### Delete Task
**Endpoint:** `DELETE /rest/v1/tasks?id=eq.{task_id}`

**Response (204 No Content)**

---

## 📁 Projects API

### Get All Projects
**Endpoint:** `GET /rest/v1/projects`

**Response (200 OK):**
```json
[
  {
    "id": "uuid-project",
    "user_id": "uuid-user",
    "name": "Hackathon Project",
    "color": "#4F46E5",
    "description": "SAI University FOSS Club Hackathon",
    "is_archived": false,
    "created_at": "2026-02-01T00:00:00Z",
    "updated_at": "2026-02-12T10:00:00Z"
  }
]
```

### Create Project
**Endpoint:** `POST /rest/v1/projects`

**Request Body:**
```json
{
  "name": "New Project",
  "color": "#10B981",
  "description": "Project description"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-new",
  "user_id": "uuid-user",
  "name": "New Project",
  "color": "#10B981",
  "description": "Project description",
  "is_archived": false,
  "created_at": "2026-02-12T10:00:00Z",
  "updated_at": "2026-02-12T10:00:00Z"
}
```

---

## 🎯 Focus Sessions API

### Get Focus Sessions
**Endpoint:** `GET /rest/v1/focus_sessions`

**Query Parameters:**
- `select` (string): Columns to select
- `order` (string): Sort order
- `start_time` (string): Filter by date range

**Example Request:**
```http
GET /rest/v1/focus_sessions?select=*&order=start_time.desc&limit=10
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-session",
    "user_id": "uuid-user",
    "task_id": "uuid-task",
    "start_time": "2026-02-12T09:00:00Z",
    "end_time": "2026-02-12T09:25:00Z",
    "duration_minutes": 25,
    "session_type": "pomodoro",
    "completed": true,
    "notes": "Productive session, completed feature implementation",
    "energy_before": 7,
    "energy_after": 6,
    "created_at": "2026-02-12T09:00:00Z"
  }
]
```

### Create Focus Session
**Endpoint:** `POST /rest/v1/focus_sessions`

**Request Body:**
```json
{
  "task_id": "uuid-task",
  "start_time": "2026-02-12T10:00:00Z",
  "duration_minutes": 25,
  "session_type": "pomodoro",
  "energy_before": 8
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-new-session",
  "user_id": "uuid-user",
  "task_id": "uuid-task",
  "start_time": "2026-02-12T10:00:00Z",
  "end_time": null,
  "duration_minutes": 25,
  "session_type": "pomodoro",
  "completed": false,
  "energy_before": 8,
  "created_at": "2026-02-12T10:00:00Z"
}
```

### Complete Focus Session
**Endpoint:** `PATCH /rest/v1/focus_sessions?id=eq.{session_id}`

**Request Body:**
```json
{
  "end_time": "2026-02-12T10:25:00Z",
  "completed": true,
  "energy_after": 7,
  "notes": "Good focus session"
}
```

---

## ⚡ Energy Logs API

### Get Energy Logs
**Endpoint:** `GET /rest/v1/energy_logs`

**Query Parameters:**
- `date` (string): Filter by date (YYYY-MM-DD)
- `order` (string): Sort order

**Example Request:**
```http
GET /rest/v1/energy_logs?date=gte.2026-02-01&order=logged_at.desc
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-log",
    "user_id": "uuid-user",
    "energy_level": 8,
    "mood": "focused",
    "notes": "Morning coffee kicked in",
    "logged_at": "2026-02-12T09:00:00Z",
    "created_at": "2026-02-12T09:00:00Z"
  }
]
```

### Log Energy Level
**Endpoint:** `POST /rest/v1/energy_logs`

**Request Body:**
```json
{
  "energy_level": 7,
  "mood": "calm",
  "notes": "Post-lunch energy dip",
  "logged_at": "2026-02-12T13:30:00Z"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-new-log",
  "user_id": "uuid-user",
  "energy_level": 7,
  "mood": "calm",
  "notes": "Post-lunch energy dip",
  "logged_at": "2026-02-12T13:30:00Z",
  "created_at": "2026-02-12T13:30:00Z"
}
```

---

## 🤖 AI Services API

### AI Edge Function - Get AI Response
**Endpoint:** `POST /functions/v1/server`

**Request Body:**
```json
{
  "action": "generate",
  "messages": [
    {
      "role": "user",
      "content": "Suggest 3 productivity tips for deep work"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "content": "Here are 3 productivity tips for deep work:\n1. Time-block your calendar\n2. Eliminate distractions\n3. Take regular breaks",
    "model": "gemini-1.5-flash",
    "timestamp": "2026-02-12T10:00:00Z"
  }
}
```

### Get Task Suggestions
**Endpoint:** `POST /functions/v1/server`

**Request Body:**
```json
{
  "action": "suggest_tasks",
  "context": {
    "current_tasks": ["Complete hackathon", "Write documentation"],
    "energy_level": 7,
    "time_available": 120
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "title": "Review and test deployment",
        "priority": "urgent",
        "estimated_time": 30
      },
      {
        "title": "Create demo video",
        "priority": "in_focus",
        "estimated_time": 45
      }
    ]
  }
}
```

### Get Smart Nudge
**Endpoint:** `POST /functions/v1/server`

**Request Body:**
```json
{
  "action": "nudge",
  "context": {
    "session_duration": 45,
    "task_title": "Complete hackathon project",
    "energy_level": 5
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "You've been working for 45 minutes. Consider taking a 5-minute break to recharge.",
    "type": "break_suggestion",
    "urgency": "low"
  }
}
```

---

## 👤 User Profile API

### Get Current User Profile
**Endpoint:** `GET /rest/v1/user_profiles?user_id=eq.{user_id}`

**Response (200 OK):**
```json
{
  "user_id": "uuid-user",
  "email": "user@example.com",
  "full_name": "John Doe",
  "display_name": "John",
  "bio": "Productivity enthusiast and deep work practitioner",
  "avatar_url": "https://supabase.co/storage/v1/object/public/avatars/user.jpg",
  "timezone": "America/New_York",
  "work_hours_start": "09:00",
  "work_hours_end": "17:00",
  "created_at": "2026-02-01T00:00:00Z",
  "updated_at": "2026-02-12T10:00:00Z"
}
```

### Update User Profile
**Endpoint:** `PATCH /rest/v1/user_profiles?user_id=eq.{user_id}`

**Request Body:**
```json
{
  "full_name": "John Smith",
  "bio": "Updated bio text",
  "timezone": "America/Los_Angeles"
}
```

**Response (200 OK):**
```json
{
  "user_id": "uuid-user",
  "full_name": "John Smith",
  "bio": "Updated bio text",
  "timezone": "America/Los_Angeles",
  "updated_at": "2026-02-12T11:00:00Z"
}
```

### Upload Profile Avatar
**Endpoint:** `POST /storage/v1/object/profile-images/{user_id}/{filename}`

**Headers:**
```http
Authorization: Bearer {token}
Content-Type: image/jpeg
```

**Request Body:** Binary image data

**Response (200 OK):**
```json
{
  "Key": "profile-images/uuid-user/avatar.jpg",
  "Id": "uuid-storage-id"
}
```

---

## 📊 Analytics API

### Get Daily Stats
**Endpoint:** `GET /rest/v1/daily_stats`

**Query Parameters:**
- `date` (string): Filter by date range
- `order` (string): Sort order

**Example Request:**
```http
GET /rest/v1/daily_stats?date=gte.2026-02-01&order=date.desc
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-stat",
    "user_id": "uuid-user",
    "date": "2026-02-12",
    "tasks_completed": 5,
    "tasks_created": 3,
    "focus_time_minutes": 150,
    "sessions_completed": 6,
    "average_energy": 7.2,
    "created_at": "2026-02-12T23:59:59Z"
  }
]
```

### Get Productivity Summary
**Endpoint:** `GET /rest/v1/rpc/get_productivity_summary`

**Request Body:**
```json
{
  "start_date": "2026-02-01",
  "end_date": "2026-02-12"
}
```

**Response (200 OK):**
```json
{
  "total_tasks_completed": 45,
  "total_focus_time_minutes": 1250,
  "total_sessions": 50,
  "average_daily_tasks": 3.8,
  "average_energy_level": 7.1,
  "most_productive_hour": 10,
  "completion_rate": 0.82
}
```

---

## ❌ Error Codes

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Resource deleted successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The 'title' field is required",
    "details": {
      "field": "title",
      "constraint": "not_null"
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `invalid_credentials` | Email or password is incorrect |
| `invalid_token` | JWT token is expired or invalid |
| `permission_denied` | User lacks permission for this resource |
| `resource_not_found` | Requested resource doesn't exist |
| `validation_error` | Request validation failed |
| `rate_limit_exceeded` | Too many requests in time window |
| `duplicate_resource` | Resource already exists |

---

## 🔧 Rate Limits

- **Authenticated requests:** 100 requests per minute
- **AI API calls:** 20 requests per minute
- **File uploads:** 10 uploads per minute
- **Bulk operations:** 5 requests per minute

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1676203200
```

---

## 📝 Best Practices

### 1. Use Proper HTTP Methods
- `GET` - Retrieve data
- `POST` - Create new resource
- `PATCH` - Partially update resource
- `PUT` - Replace entire resource
- `DELETE` - Remove resource

### 2. Handle Errors Gracefully
```typescript
try {
  const { data, error } = await supabase
    .from('tasks')
    .select('*');
    
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Error fetching tasks:', error);
  // Handle error appropriately
}
```

### 3. Use Query Parameters for Filtering
```typescript
// Good: Use Supabase query builders
const { data } = await supabase
  .from('tasks')
  .select('*')
  .eq('status', 'todo')
  .order('created_at', { ascending: false });
```

### 4. Implement Pagination
```typescript
const { data } = await supabase
  .from('tasks')
  .select('*')
  .range(0, 9); // First 10 items
```

### 5. Use Real-time Subscriptions
```typescript
const subscription = supabase
  .channel('tasks-channel')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'tasks' },
    (payload) => {
      console.log('Task changed:', payload);
    }
  )
  .subscribe();
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Sign In
curl -X POST 'https://your-project.supabase.co/auth/v1/token?grant_type=password' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password123"}'

# Get Tasks
curl -X GET 'https://your-project.supabase.co/rest/v1/tasks' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'

# Create Task
curl -X POST 'https://your-project.supabase.co/rest/v1/tasks' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"New task","status":"todo"}'
```

### Postman Collection

Import this collection to test all endpoints:
- [Download Postman Collection](./KAAL_API_Collection.postman.json)

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgREST API Reference](https://postgrest.org/en/stable/)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

---

**Last Updated:** February 12, 2026  
**Maintained by:** Team JAIRAM  
**Contact:** team.jairam@example.com
