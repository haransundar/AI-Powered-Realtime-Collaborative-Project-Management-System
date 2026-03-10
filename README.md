# AI-Powered Realtime Collaborative Project Management System

A full-stack project management application with real-time collaboration, multi-tenant architecture, and AI-powered features.

## Features

### 1. Multi-Tenant Architecture
- Multiple organizations with isolated data
- Row-level security ensuring data isolation
- Organization-level settings and configurations

### 2. Comprehensive Project & Task Management
- Multiple projects per organization
- Task status workflow: Backlog → To Do → In Progress → Review → Done
- Priority levels: Low, Medium, High, Critical
- Multiple assignees per task
- Due dates and time estimates
- Task dependencies with circular dependency detection
- Comments with threading
- File attachments

### 3. Real-Time Collaboration
- WebSocket-powered live updates
- Real-time notifications
- Drag-and-drop with broadcast to all users
- Task locking during edits
- Optimistic UI updates
- Conflict resolution with version tracking

### 4. Complex Permission System
- Organization roles: Owner, Admin, Member, Guest
- Project roles: Project Manager, Contributor, Viewer
- Task-level permissions: Creator, Assignee
- Permission inheritance from organization → project → task

### 5. AI-Powered Features
- Natural language task creation
- Intelligent task suggestions
- Smart scheduling recommendations
- Workload analysis

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Zustand, Socket.IO Client, @dnd-kit
- **Backend**: Flask, Flask-SocketIO, PyMongo, PyJWT
- **Database**: MongoDB
- **AI**: Google Gemini API

## Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB running locally or connection string

### Backend Setup

```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env file and add your GEMINI_API_KEY

# Run the server
python run.py
```

The backend will start at http://localhost:5000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start at http://localhost:3000

## Environment Variables

### Backend (.env)
```
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret
MONGO_URI=mongodb://localhost:27017
MONGO_DB=project_management
GEMINI_API_KEY=your-gemini-api-key
UPLOAD_FOLDER=uploads
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login
- POST /api/auth/refresh - Refresh token
- GET /api/auth/me - Get current user

### Organizations
- POST /api/organizations - Create organization
- GET /api/organizations - List user's organizations
- GET /api/organizations/:id - Get organization details
- POST /api/organizations/:id/invite - Invite member
- PUT /api/organizations/:id/members/:userId - Update member role
- DELETE /api/organizations/:id/members/:userId - Remove member

### Projects
- POST /api/organizations/:orgId/projects - Create project
- GET /api/organizations/:orgId/projects - List projects
- GET /api/projects/:id - Get project details
- PUT /api/projects/:id - Update project
- POST /api/projects/:id/archive - Archive project

### Tasks
- POST /api/projects/:projectId/tasks - Create task
- GET /api/projects/:projectId/tasks - List tasks
- GET /api/tasks/:id - Get task details
- PUT /api/tasks/:id - Update task
- PATCH /api/tasks/:id/status - Update status
- POST /api/tasks/:id/assignees - Add assignees
- POST /api/tasks/:id/dependencies - Add dependency
- DELETE /api/tasks/:id - Delete task

### Comments
- POST /api/tasks/:taskId/comments - Add comment
- GET /api/tasks/:taskId/comments - List comments
- PUT /api/comments/:id - Edit comment
- DELETE /api/comments/:id - Delete comment

### AI
- POST /api/ai/parse-task - Parse natural language
- POST /api/ai/suggest - Get task suggestions
- GET /api/ai/schedule/:projectId - Get scheduling recommendations
- GET /api/ai/workload/:orgId - Get workload analysis

## WebSocket Events

### Client → Server
- authenticate - Authenticate socket connection
- join_project - Join project room
- leave_project - Leave project room
- start_drag - Start dragging task
- end_drag - End dragging task

### Server → Client
- task_created - New task created
- task_updated - Task updated
- task_deleted - Task deleted
- task_locked - Task locked by user
- task_unlocked - Task unlocked
- comment_created - New comment
- user_joined - User joined project
- user_left - User left project

## License

MIT
