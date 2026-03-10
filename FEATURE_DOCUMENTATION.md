# AI Project Management System - Complete Feature Documentation

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Backend Features](#backend-features)
5. [Frontend Features](#frontend-features)
6. [API Endpoints](#api-endpoints)
7. [Data Models](#data-models)
8. [Real-time Features](#real-time-features)
9. [AI Features](#ai-features)
10. [File Structure](#file-structure)

---

## Overview

A full-stack AI-powered project management system with real-time collaboration, task management, and intelligent features powered by Google Gemini AI.

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.x | Core language |
| Flask | >=3.0.0 | Web framework |
| Flask-SocketIO | >=5.3.0 | Real-time WebSocket support |
| Flask-CORS | >=4.0.0 | Cross-origin resource sharing |
| PyMongo | >=4.0.0 | MongoDB driver |
| PyJWT | >=2.8.0 | JWT authentication |
| bcrypt | >=4.1.0 | Password hashing |
| google-generativeai | >=0.8.0 | Gemini AI integration |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Styling |
| Zustand | ^5.0.9 | State management |
| Socket.io-client | ^4.8.2 | Real-time communication |
| @dnd-kit | ^6.3.1 | Drag and drop |
| date-fns | ^4.1.0 | Date formatting |
| lucide-react | ^0.562.0 | Icons |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB | Primary database |

### AI
| Technology | Purpose |
|------------|---------|
| Google Gemini 2.0 Flash | AI-powered features |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Pages     │  │ Components  │  │    State (Zustand)      │  │
│  │  - Auth     │  │  - Task     │  │  - User/Auth            │  │
│  │  - Dashboard│  │  - AI       │  │  - Organizations        │  │
│  │  - Projects │  │  - UI       │  │  - Projects/Tasks       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTP REST + WebSocket
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Flask)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Routes    │  │  Services   │  │       Models            │  │
│  │  - Auth     │  │  - Auth     │  │  - User                 │  │
│  │  - Tasks    │  │  - AI       │  │  - Organization         │  │
│  │  - Projects │  │  - Email    │  │  - Project              │  │
│  │  - AI       │  │  - Permission│ │  - Task                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                           MongoDB
```

---

## Backend Features

### 1. Authentication System
**File:** `backend/app/routes/auth.py`, `backend/app/services/auth.py`

| Feature | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| Send OTP | `/api/auth/send-otp` | POST | Send email verification OTP |
| Verify OTP | `/api/auth/verify-otp` | POST | Verify OTP code |
| Register | `/api/auth/register` | POST | Create new user account |
| Login | `/api/auth/login` | POST | Authenticate user |
| Refresh Token | `/api/auth/refresh` | POST | Refresh access token |
| Get Current User | `/api/auth/me` | GET | Get authenticated user info |
| Logout | `/api/auth/logout` | POST | End user session |

**Logic:**
- JWT-based authentication with access (1 hour) and refresh (7 days) tokens
- Email verification via OTP before registration
- Password hashing using bcrypt
- Token generation and validation via PyJWT

### 2. Organization Management
**File:** `backend/app/routes/organizations.py`, `backend/app/models/organization.py`

| Feature | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| Create Org | `/api/organizations` | POST | Create new organization |
| List Orgs | `/api/organizations` | GET | List user's organizations |
| Get Org | `/api/organizations/{id}` | GET | Get organization details |
| Update Org | `/api/organizations/{id}` | PUT | Update organization |
| Delete Org | `/api/organizations/{id}` | DELETE | Delete organization |
| Invite Member | `/api/organizations/{id}/invite` | POST | Invite user to org |
| Update Role | `/api/organizations/{id}/members/{userId}` | PUT | Update member role |
| Remove Member | `/api/organizations/{id}/members/{userId}` | DELETE | Remove member |
| List Members | `/api/organizations/{id}/members` | GET | List org members |

**Roles:** `owner`, `admin`, `member`, `guest`

### 3. Project Management
**File:** `backend/app/routes/projects.py`, `backend/app/models/project.py`

| Feature | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| Create Project | `/api/organizations/{orgId}/projects` | POST | Create new project |
| List Projects | `/api/organizations/{orgId}/projects` | GET | List org projects |
| Get Project | `/api/projects/{id}` | GET | Get project details |
| Update Project | `/api/projects/{id}` | PUT | Update project |
| Archive Project | `/api/projects/{id}/archive` | POST | Archive project |
| Add Member | `/api/projects/{id}/members` | POST | Add project member |
| Update Member Role | `/api/projects/{id}/members/{userId}` | PUT | Update member role |
| Remove Member | `/api/projects/{id}/members/{userId}` | DELETE | Remove member |

**Roles:** `project_manager`, `contributor`, `viewer`

### 4. Task Management
**File:** `backend/app/routes/tasks.py`, `backend/app/models/task.py`

| Feature | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| Create Task | `/api/projects/{projectId}/tasks` | POST | Create new task |
| List Tasks | `/api/projects/{projectId}/tasks` | GET | List project tasks |
| Get Task | `/api/tasks/{id}` | GET | Get task details |
| Update Task | `/api/tasks/{id}` | PUT | Update task |
| Update Status | `/api/tasks/{id}/status` | PATCH | Update task status |
| Add Assignees | `/api/tasks/{id}/assignees` | POST | Add task assignees |
| Add Dependency | `/api/tasks/{id}/dependencies` | POST | Add task dependency |
| Remove Dependency | `/api/tasks/{id}/dependencies/{depId}` | DELETE | Remove dependency |
| Delete Task | `/api/tasks/{id}` | DELETE | Delete task |
| Acquire Lock | `/api/tasks/{id}/lock` | POST | Lock task for editing |
| Release Lock | `/api/tasks/{id}/lock` | DELETE | Release task lock |

**Task Statuses:** `backlog`, `todo`, `in_progress`, `review`, `done`
**Task Priorities:** `low`, `medium`, `high`, `critical`

**Logic:**
- Optimistic locking with version control for conflict detection
- Task locking mechanism (30 seconds) for real-time collaboration
- Circular dependency detection using DFS algorithm
- Automatic blocked status updates when dependencies change
- Status history tracking for audit trail

### 5. Comments System
**File:** `backend/app/routes/comments.py`, `backend/app/models/comment.py`

| Feature | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| Create Comment | `/api/tasks/{taskId}/comments` | POST | Add comment to task |
| List Comments | `/api/tasks/{taskId}/comments` | GET | Get task comments |
| Update Comment | `/api/comments/{id}` | PUT | Edit comment |
| Delete Comment | `/api/comments/{id}` | DELETE | Soft delete comment |

**Logic:**
- Threaded comments with parent-child relationships
- Soft delete to preserve thread structure
- Automatic notification to task assignees and creator

### 6. File Attachments
**File:** `backend/app/routes/attachments.py`, `backend/app/models/attachment.py`

| Feature | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| Upload | `/api/tasks/{taskId}/attachments` | POST | Upload file |
| List | `/api/tasks/{taskId}/attachments` | GET | List attachments |
| Download | `/api/attachments/{id}/download` | GET | Download file |
| Delete | `/api/attachments/{id}` | DELETE | Delete attachment |

**Logic:**
- Max file size: 16MB
- UUID-based filename storage for security
- Automatic cleanup on deletion

### 7. Notifications
**File:** `backend/app/routes/notifications.py`, `backend/app/models/notification.py`

| Feature | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| List | `/api/notifications` | GET | Get user notifications |
| Mark Read | `/api/notifications/{id}/read` | PATCH | Mark as read |
| Mark All Read | `/api/notifications/read-all` | POST | Mark all as read |

**Notification Types:** `task_assigned`, `task_updated`, `comment_added`, `due_date_reminder`, `mention`

### 8. Permission System
**File:** `backend/app/services/permission.py`

**Organization Permissions:**
| Role | Permissions |
|------|-------------|
| owner | manage_org, manage_members, create_project, view_all, delete_org |
| admin | manage_members, create_project, view_all |
| member | view_assigned, create_task |
| guest | view_shared |

**Project Permissions:**
| Role | Permissions |
|------|-------------|
| project_manager | manage_project, manage_members, create_task, edit_task, delete_task, view_all |
| contributor | create_task, edit_task, comment, view_all |
| viewer | view_all, comment |

---

## AI Features

**File:** `backend/app/routes/ai.py`, `backend/app/services/ai.py`

### 1. Natural Language Task Parsing
**Endpoint:** `POST /api/ai/parse-task`

Parses natural language input into structured task data.

**Input:** `"Create login page for @john by next Friday, high priority"`

**Output:**
```json
{
  "title": "Create login page",
  "description": "",
  "assignees": ["john"],
  "due_date": "2024-12-27T00:00:00",
  "priority": "high"
}
```

**Logic:**
- Uses Gemini AI to extract task metadata
- Fallback parsing for keywords (urgent, tomorrow, @mentions)
- Team member name matching from project context

### 2. Task Suggestions
**Endpoint:** `POST /api/ai/suggest`

Provides AI-powered suggestions for task metadata.

**Output:**
```json
{
  "suggested_priority": "high",
  "suggested_assignees": ["John Doe"],
  "related_tasks": ["Setup authentication"],
  "next_steps": ["Review requirements", "Break down into subtasks"],
  "tags": ["frontend", "auth"]
}
```

### 3. Schedule Recommendations
**Endpoint:** `GET /api/ai/schedule/{projectId}`

Analyzes project tasks and suggests optimal scheduling.

**Output:**
```json
{
  "overloaded_members": ["John Doe"],
  "suggested_redistributions": [
    {"task_title": "Task A", "from_member": "John", "to_member": "Jane"}
  ],
  "suggested_due_dates": [
    {"task_title": "Task B", "suggested_date": "2024-12-30"}
  ],
  "priority_adjustments": [
    {"task_title": "Task C", "current_priority": "low", "suggested_priority": "high", "reason": "Blocking other tasks"}
  ]
}
```

### 4. Workload Analysis
**Endpoint:** `GET /api/ai/workload/{orgId}`

Analyzes team workload distribution.

**Output:**
```json
{
  "workload": [
    {
      "user": {"_id": "...", "name": "John Doe"},
      "task_count": 8,
      "estimated_hours": 32,
      "high_priority_count": 3,
      "in_progress_count": 2,
      "overdue_count": 1,
      "status": "balanced"
    }
  ]
}
```

**Status Levels:** `available` (<20h), `balanced` (20-40h), `overloaded` (>40h)

### 5. AI Task Breakdown
**Endpoint:** `POST /api/ai/breakdown`

Breaks down high-level tasks into actionable subtasks.

**Input:**
```json
{
  "title": "Implement user authentication system",
  "description": "Full auth with login, register, password reset",
  "project_id": "..."
}
```

**Output:**
```json
{
  "subtasks": [
    {
      "title": "Research and plan: authentication",
      "description": "Gather requirements and create implementation plan",
      "estimated_hours": 2,
      "priority": "high",
      "suggested_assignee": "John Doe",
      "order": 1
    },
    {
      "title": "Implement login endpoint",
      "description": "Create POST /auth/login with JWT",
      "estimated_hours": 4,
      "priority": "high",
      "suggested_assignee": null,
      "order": 2
    }
  ],
  "total_estimated_hours": 8,
  "dependencies_note": "Tasks should be completed in order"
}
```

### 6. Project Insights
**Endpoint:** `GET /api/ai/insights/{projectId}`

Provides AI-powered project health analysis.

**Output:**
```json
{
  "stats": {
    "total_tasks": 25,
    "completed": 10,
    "in_progress": 5,
    "blocked": 2,
    "overdue": 3,
    "high_priority_pending": 4,
    "completion_rate": 40.0
  },
  "health_score": 65,
  "health_status": "at_risk",
  "insights": [
    "10 of 25 tasks completed (40%)",
    "3 overdue tasks need attention",
    "2 tasks are blocked by dependencies"
  ],
  "recommendations": [
    "Focus on completing in-progress tasks",
    "Address overdue tasks immediately",
    "Review blocked task dependencies"
  ],
  "bottlenecks": ["Authentication module blocking 3 tasks"]
}
```

**Health Status Levels:** `excellent`, `good`, `at_risk`, `critical`

---

## Real-time Features

**File:** `backend/app/sockets/__init__.py`

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connect` | Client→Server | Initial connection |
| `authenticate` | Client→Server | Authenticate with JWT |
| `authenticated` | Server→Client | Authentication success |
| `join_project` | Client→Server | Join project room |
| `leave_project` | Client→Server | Leave project room |
| `task_created` | Server→Client | New task created |
| `task_updated` | Server→Client | Task modified |
| `task_deleted` | Server→Client | Task removed |
| `task_locked` | Server→Client | Task being edited |
| `task_unlocked` | Server→Client | Task edit finished |
| `user_joined` | Server→Client | User joined project |
| `user_left` | Server→Client | User left project |
| `start_drag` | Client→Server | Started dragging task |
| `end_drag` | Client→Server | Finished dragging |
| `typing_comment` | Client→Server | User typing comment |
| `user_typing` | Server→Client | Broadcast typing indicator |

**Logic:**
- Room-based broadcasting per project
- Task locking during drag operations
- Automatic lock release on disconnect

---

## Frontend Features

### 1. State Management (Zustand)
**File:** `frontend/src/store/index.ts`

**State Structure:**
```typescript
interface AppState {
  // Auth
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Data
  organizations: Organization[]
  currentOrg: Organization | null
  projects: Project[]
  currentProject: Project | null
  tasks: Task[]
  tasksByStatus: Record<TaskStatus, Task[]>
  notifications: Notification[]
  
  // Real-time
  socket: Socket | null
  connectedUsers: User[]
  lockedTasks: Record<string, User>
  
  // Optimistic Updates
  pendingUpdates: Map<string, PendingUpdate>
}
```

**Features:**
- Persistent storage for auth tokens
- Optimistic updates with rollback
- Real-time sync via WebSocket
- Automatic reconnection

### 2. Kanban Board
**Files:** 
- `frontend/src/components/task/KanbanBoard.tsx`
- `frontend/src/components/task/KanbanColumn.tsx`
- `frontend/src/components/task/TaskCard.tsx`

**Features:**
- Drag and drop using @dnd-kit
- Visual feedback during drag (color changes, scaling)
- Task locking indicators
- Priority badges with color coding
- Blocked task indicators
- Assignee avatars
- Due date and time estimate display
- Recently moved task animation

**Drag & Drop Logic:**
- Custom collision detection prioritizing columns
- Optimistic status updates
- Real-time lock acquisition during drag
- Automatic lock release on drop/cancel

### 3. Task Creation Modal
**File:** `frontend/src/components/task/CreateTaskModal.tsx`

**Features:**
- Manual entry mode with form fields
- Natural language mode with AI parsing
- Multi-select assignee dropdown
- Priority selection
- Due date picker
- Time estimate input
- AI-powered field population from natural text

### 4. Task Detail Modal
**File:** `frontend/src/components/task/TaskModal.tsx`

**Features:**
- Edit all task fields
- Multi-select assignee management
- AI suggestions button
- Comment thread with replies
- File attachment upload/download
- Task deletion with confirmation
- Version conflict detection

### 5. AI Insights Panel
**File:** `frontend/src/components/ai/AIInsightsPanel.tsx`

**Features:**
- Project health score display (0-100)
- Task statistics grid (completed, in progress, overdue)
- Key insights list
- Recommendations list
- Team workload tab with status indicators
- Auto-refresh capability

### 6. Task Breakdown Modal
**File:** `frontend/src/components/ai/TaskBreakdownModal.tsx`

**Features:**
- High-level task input
- AI-generated subtask list
- Selectable subtasks with checkboxes
- Priority and time estimate per subtask
- Suggested assignee display
- Batch task creation
- Dependencies note display

---

## Data Models

### User
```javascript
{
  _id: ObjectId,
  email: String (lowercase, unique),
  password_hash: Binary,
  name: String,
  avatar_url: String (optional),
  created_at: DateTime,
  updated_at: DateTime
}
```

### Organization
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String (auto-generated),
  owner_id: ObjectId,
  settings: Object,
  created_at: DateTime,
  updated_at: DateTime
}
```

### OrgMembership
```javascript
{
  _id: ObjectId,
  org_id: ObjectId,
  user_id: ObjectId,
  role: String (owner|admin|member|guest),
  joined_at: DateTime,
  invited_by: ObjectId,
  status: String (active)
}
```

### Project
```javascript
{
  _id: ObjectId,
  org_id: ObjectId,
  name: String,
  description: String,
  status: String (active|archived),
  settings: {
    default_assignee: ObjectId,
    enable_time_tracking: Boolean
  },
  created_by: ObjectId,
  created_at: DateTime,
  updated_at: DateTime
}
```

### ProjectMember
```javascript
{
  _id: ObjectId,
  project_id: ObjectId,
  user_id: ObjectId,
  role: String (project_manager|contributor|viewer),
  added_at: DateTime,
  added_by: ObjectId
}
```

### Task
```javascript
{
  _id: ObjectId,
  project_id: ObjectId,
  org_id: ObjectId,
  title: String,
  description: String,
  status: String (backlog|todo|in_progress|review|done),
  priority: String (low|medium|high|critical),
  assignees: [ObjectId],
  creator_id: ObjectId,
  due_date: DateTime,
  time_estimate_hours: Number,
  dependencies: [ObjectId],
  blocked_by: [ObjectId],
  version: Number,
  completed_at: DateTime,
  created_at: DateTime,
  updated_at: DateTime
}
```

### TaskStatusHistory
```javascript
{
  _id: ObjectId,
  task_id: ObjectId,
  from_status: String,
  to_status: String,
  changed_by: ObjectId,
  changed_at: DateTime
}
```

### TaskLock
```javascript
{
  _id: ObjectId,
  task_id: ObjectId,
  user_id: ObjectId,
  socket_id: String,
  acquired_at: DateTime,
  expires_at: DateTime (30 seconds from acquired)
}
```

### Comment
```javascript
{
  _id: ObjectId,
  task_id: ObjectId,
  org_id: ObjectId,
  author_id: ObjectId,
  content: String,
  parent_id: ObjectId (optional),
  is_deleted: Boolean,
  edited_at: DateTime,
  created_at: DateTime
}
```

### FileAttachment
```javascript
{
  _id: ObjectId,
  task_id: ObjectId,
  org_id: ObjectId,
  filename: String (UUID-based),
  original_name: String,
  mime_type: String,
  size_bytes: Number,
  uploaded_by: ObjectId,
  storage_path: String,
  created_at: DateTime
}
```

### Notification
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  org_id: ObjectId,
  type: String (task_assigned|task_updated|comment_added|due_date_reminder|mention),
  title: String,
  message: String,
  resource_type: String,
  resource_id: ObjectId,
  is_read: Boolean,
  created_at: DateTime
}
```

### OTP
```javascript
{
  _id: ObjectId,
  email: String,
  code: String (6 digits),
  created_at: DateTime,
  expires_at: DateTime (10 minutes),
  verified: Boolean
}
```

---

## File Structure

```
project-root/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── __init__.py          # Model exports
│   │   │   ├── user.py              # User model
│   │   │   ├── organization.py      # Org & membership models
│   │   │   ├── project.py           # Project & member models
│   │   │   ├── task.py              # Task, history, lock models
│   │   │   ├── comment.py           # Comment model
│   │   │   ├── attachment.py        # File attachment model
│   │   │   └── notification.py      # Notification model
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # Authentication endpoints
│   │   │   ├── organizations.py     # Organization endpoints
│   │   │   ├── projects.py          # Project endpoints
│   │   │   ├── tasks.py             # Task endpoints
│   │   │   ├── comments.py          # Comment endpoints
│   │   │   ├── attachments.py       # File endpoints
│   │   │   ├── notifications.py     # Notification endpoints
│   │   │   └── ai.py                # AI feature endpoints
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # JWT & auth logic
│   │   │   ├── ai.py                # Gemini AI integration
│   │   │   ├── email.py             # OTP & email service
│   │   │   └── permission.py        # RBAC permission logic
│   │   ├── sockets/
│   │   │   └── __init__.py          # WebSocket handlers
│   │   ├── utils/
│   │   │   └── decorators.py        # Auth decorators
│   │   ├── __init__.py              # Flask app factory
│   │   └── database.py              # MongoDB connection
│   ├── uploads/                      # File storage
│   ├── config.py                     # Configuration
│   ├── run.py                        # Entry point
│   ├── requirements.txt              # Python dependencies
│   └── .env                          # Environment variables
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/               # Auth pages
    │   │   ├── (dashboard)/          # Dashboard pages
    │   │   ├── layout.tsx            # Root layout
    │   │   ├── page.tsx              # Home page
    │   │   └── globals.css           # Global styles
    │   ├── components/
    │   │   ├── ai/
    │   │   │   ├── AIInsightsPanel.tsx    # Project insights
    │   │   │   └── TaskBreakdownModal.tsx # Task breakdown
    │   │   ├── task/
    │   │   │   ├── CreateTaskModal.tsx    # Task creation
    │   │   │   ├── TaskModal.tsx          # Task details
    │   │   │   ├── KanbanBoard.tsx        # Board container
    │   │   │   ├── KanbanColumn.tsx       # Status column
    │   │   │   └── TaskCard.tsx           # Task card
    │   │   └── ui/
    │   │       ├── badge.tsx
    │   │       ├── button.tsx
    │   │       ├── card.tsx
    │   │       └── input.tsx
    │   ├── lib/
    │   │   ├── api.ts                # API client
    │   │   └── utils.ts              # Utility functions
    │   ├── store/
    │   │   └── index.ts              # Zustand store
    │   └── types/
    │       └── index.ts              # TypeScript types
    ├── package.json
    └── tsconfig.json
```

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Organizations
- `POST /api/organizations` - Create organization
- `GET /api/organizations` - List organizations
- `GET /api/organizations/{id}` - Get organization
- `PUT /api/organizations/{id}` - Update organization
- `DELETE /api/organizations/{id}` - Delete organization
- `POST /api/organizations/{id}/invite` - Invite member
- `PUT /api/organizations/{id}/members/{userId}` - Update member role
- `DELETE /api/organizations/{id}/members/{userId}` - Remove member
- `GET /api/organizations/{id}/members` - List members

### Projects
- `POST /api/organizations/{orgId}/projects` - Create project
- `GET /api/organizations/{orgId}/projects` - List projects
- `GET /api/projects/{id}` - Get project
- `PUT /api/projects/{id}` - Update project
- `POST /api/projects/{id}/archive` - Archive project
- `POST /api/projects/{id}/members` - Add member
- `PUT /api/projects/{id}/members/{userId}` - Update member role
- `DELETE /api/projects/{id}/members/{userId}` - Remove member

### Tasks
- `POST /api/projects/{projectId}/tasks` - Create task
- `GET /api/projects/{projectId}/tasks` - List tasks
- `GET /api/tasks/{id}` - Get task
- `PUT /api/tasks/{id}` - Update task
- `PATCH /api/tasks/{id}/status` - Update status
- `POST /api/tasks/{id}/assignees` - Add assignees
- `POST /api/tasks/{id}/dependencies` - Add dependency
- `DELETE /api/tasks/{id}/dependencies/{depId}` - Remove dependency
- `DELETE /api/tasks/{id}` - Delete task
- `POST /api/tasks/{id}/lock` - Acquire lock
- `DELETE /api/tasks/{id}/lock` - Release lock

### Comments
- `POST /api/tasks/{taskId}/comments` - Create comment
- `GET /api/tasks/{taskId}/comments` - List comments
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

### Attachments
- `POST /api/tasks/{taskId}/attachments` - Upload file
- `GET /api/tasks/{taskId}/attachments` - List attachments
- `GET /api/attachments/{id}/download` - Download file
- `DELETE /api/attachments/{id}` - Delete attachment

### Notifications
- `GET /api/notifications` - List notifications
- `PATCH /api/notifications/{id}/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read

### AI Features
- `POST /api/ai/parse-task` - Parse natural language
- `POST /api/ai/suggest` - Get task suggestions
- `GET /api/ai/schedule/{projectId}` - Get schedule recommendations
- `GET /api/ai/workload/{orgId}` - Analyze workload
- `POST /api/ai/breakdown` - Break down task
- `GET /api/ai/insights/{projectId}` - Get project insights

---

## Key Implementation Details

### 1. Authentication Flow
```
1. User enters email → Send OTP
2. User enters OTP → Verify OTP
3. User completes registration → Create account
4. System generates JWT tokens (access + refresh)
5. Frontend stores tokens in Zustand (persisted)
6. All API requests include Bearer token
7. Token expires → Use refresh token
```

### 2. Task Drag & Drop Flow
```
1. User starts dragging task
2. Frontend emits 'start_drag' via WebSocket
3. Backend acquires 30-second lock
4. Other users see lock indicator
5. User drops task in new column
6. Frontend optimistically updates UI
7. Frontend calls API to update status
8. Backend updates database
9. Backend broadcasts 'task_updated' to all users
10. Frontend emits 'end_drag'
11. Backend releases lock
```

### 3. Optimistic Updates
```
1. User performs action (e.g., move task)
2. Store saves original state
3. UI updates immediately (optimistic)
4. API call made in background
5. On success: Confirm update, discard original
6. On failure: Revert to original state
```

### 4. AI Integration Flow
```
1. User inputs natural language or requests AI feature
2. Frontend calls AI endpoint
3. Backend checks if Gemini API key exists
4. If available: Call Gemini with structured prompt
5. If unavailable: Use fallback logic
6. Parse AI response (JSON)
7. Return structured data to frontend
8. Frontend populates UI with AI suggestions
```

### 5. Permission Checking
```
1. User attempts action
2. Backend extracts JWT from Authorization header
3. Verify token and get user_id
4. Check organization membership and role
5. Check project membership and role
6. Check task-specific permissions (creator/assignee)
7. Combine permissions from all levels
8. Allow or deny action
```

### 6. Real-time Collaboration
```
1. User authenticates via WebSocket
2. User joins project room
3. Backend tracks connected users per project
4. Any task change broadcasts to room
5. All connected users receive update
6. Frontend updates UI in real-time
7. Task locks prevent concurrent edits
```

---

## Environment Variables

### Backend (.env)
```bash
# Flask
FLASK_ENV=development
SECRET_KEY=your-secret-key
PORT=5000

# JWT
JWT_SECRET=your-jwt-secret

# MongoDB
MONGO_URI=mongodb://localhost:27017
MONGO_DB=project_management

# AI
GEMINI_API_KEY=your-gemini-api-key

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com

# File Upload
UPLOAD_FOLDER=uploads
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## Setup Instructions

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (if not running)
mongod

# Run server
python run.py
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- WebSocket: ws://localhost:5000

---

## Testing

### Manual Testing Checklist

**Authentication:**
- ✓ Send OTP to email
- ✓ Verify OTP code
- ✓ Register new user
- ✓ Login with credentials
- ✓ Token refresh
- ✓ Protected route access

**Organizations:**
- ✓ Create organization
- ✓ Invite members
- ✓ Update member roles
- ✓ Remove members
- ✓ Delete organization

**Projects:**
- ✓ Create project
- ✓ Add project members
- ✓ Update project details
- ✓ Archive project

**Tasks:**
- ✓ Create task manually
- ✓ Create task with natural language
- ✓ Drag and drop task
- ✓ Edit task details
- ✓ Add assignees
- ✓ Add dependencies
- ✓ Delete task
- ✓ Task locking during edit

**AI Features:**
- ✓ Parse natural language
- ✓ Get AI suggestions
- ✓ Break down task
- ✓ View project insights
- ✓ Analyze workload

**Real-time:**
- ✓ Multiple users see updates
- ✓ Task lock indicators
- ✓ Live task movements
- ✓ User presence indicators

---

## Known Limitations

1. **File Upload:** Max 16MB per file
2. **Task Lock:** 30-second timeout
3. **AI Features:** Requires Gemini API key (fallback available)
4. **Email:** OTP printed to console if SMTP not configured
5. **Notifications:** In-app only (no email/push notifications)
6. **Search:** No full-text search implemented
7. **Filters:** Basic filtering only (status, priority, assignee)
8. **Mobile:** Desktop-optimized UI

---

## Future Enhancements

1. **Search & Filters:**
   - Full-text search across tasks
   - Advanced filtering options
   - Saved filter presets

2. **Analytics:**
   - Burndown charts
   - Velocity tracking
   - Time tracking integration

3. **Integrations:**
   - GitHub integration
   - Slack notifications
   - Calendar sync

4. **Mobile:**
   - Responsive design improvements
   - Native mobile apps

5. **AI Enhancements:**
   - Task priority prediction
   - Deadline suggestions
   - Risk detection

6. **Collaboration:**
   - Video calls
   - Screen sharing
   - Whiteboard

---

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
mongod --version
# Start MongoDB
mongod
```

**Import Errors:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Port Already in Use:**
```bash
# Change PORT in .env
PORT=5001
```

### Frontend Issues

**API Connection Error:**
```bash
# Check NEXT_PUBLIC_API_URL in .env.local
# Ensure backend is running
```

**WebSocket Connection Failed:**
```bash
# Check NEXT_PUBLIC_SOCKET_URL in .env.local
# Verify CORS settings in backend
```

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

---

## Performance Considerations

1. **Database Indexing:**
   - Index on `user.email`
   - Index on `task.project_id`
   - Index on `task.status`
   - Compound index on `org_membership(org_id, user_id)`

2. **Caching:**
   - Consider Redis for session storage
   - Cache frequently accessed data

3. **Pagination:**
   - Implement pagination for large task lists
   - Limit notification queries

4. **WebSocket:**
   - Room-based broadcasting reduces overhead
   - Automatic cleanup on disconnect

---

## Security Features

1. **Authentication:**
   - JWT with expiration
   - Refresh token rotation
   - Password hashing with bcrypt

2. **Authorization:**
   - Role-based access control (RBAC)
   - Resource-level permissions
   - Task-level ownership checks

3. **Data Protection:**
   - Password hash never exposed in API
   - File uploads validated
   - SQL injection prevention (MongoDB)

4. **API Security:**
   - CORS configuration
   - Rate limiting (recommended)
   - Input validation

---

## Documentation Complete ✓

This documentation covers:
- ✅ Complete tech stack
- ✅ All backend features and endpoints
- ✅ All frontend components
- ✅ Data models and relationships
- ✅ Real-time features
- ✅ AI integration details
- ✅ File structure
- ✅ Setup instructions
- ✅ Implementation details
- ✅ Testing guidelines
- ✅ Troubleshooting guide

**Last Updated:** December 23, 2024
**Version:** 1.0.0
