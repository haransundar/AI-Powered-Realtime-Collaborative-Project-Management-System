(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = ("TURBOPACK compile-time value", "http://localhost:5000/api") || 'http://localhost:5000/api';
class ApiClient {
    token = null;
    setToken(token) {
        this.token = token;
    }
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers || {}
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'Request failed');
        }
        return data;
    }
    // Auth
    async sendOtp(email) {
        return this.request('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({
                email
            })
        });
    }
    async verifyOtp(email, otp) {
        return this.request('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({
                email,
                otp
            })
        });
    }
    async resendOtp(email) {
        return this.request('/auth/resend-otp', {
            method: 'POST',
            body: JSON.stringify({
                email
            })
        });
    }
    async register(email, password, name) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                name
            })
        });
    }
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        });
    }
    async getMe() {
        return this.request('/auth/me');
    }
    // Organizations
    async checkOrganizationName(name) {
        return this.request('/organizations/check-name', {
            method: 'POST',
            body: JSON.stringify({
                name
            })
        });
    }
    async createOrganization(name) {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        const response = await fetch(`${API_URL}/organizations`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name
            })
        });
        const data = await response.json();
        if (!response.ok) {
            // Return the full response including suggestions for duplicate names
            if (response.status === 409) {
                return {
                    error: data.error,
                    suggestions: data.suggestions || [],
                    reason: data.reason || ''
                };
            }
            throw new Error(data.error?.message || 'Request failed');
        }
        return data;
    }
    async getOrganizations() {
        return this.request('/organizations');
    }
    async getOrganization(orgId) {
        return this.request(`/organizations/${orgId}`);
    }
    async inviteMember(orgId, email, role) {
        return this.request(`/organizations/${orgId}/invite`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                role
            })
        });
    }
    async updateMemberRole(orgId, userId, role) {
        return this.request(`/organizations/${orgId}/members/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({
                role
            })
        });
    }
    async removeMember(orgId, userId) {
        return this.request(`/organizations/${orgId}/members/${userId}`, {
            method: 'DELETE'
        });
    }
    async deleteOrganization(orgId) {
        return this.request(`/organizations/${orgId}`, {
            method: 'DELETE'
        });
    }
    // Projects
    async createProject(orgId, name, description) {
        return this.request(`/organizations/${orgId}/projects`, {
            method: 'POST',
            body: JSON.stringify({
                name,
                description
            })
        });
    }
    async getProjects(orgId) {
        return this.request(`/organizations/${orgId}/projects`);
    }
    async getProject(projectId) {
        return this.request(`/projects/${projectId}`);
    }
    async updateProject(projectId, data) {
        return this.request(`/projects/${projectId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    async archiveProject(projectId) {
        return this.request(`/projects/${projectId}/archive`, {
            method: 'POST'
        });
    }
    async getProjectMembers(projectId) {
        const { project } = await this.request(`/projects/${projectId}`);
        return {
            members: project.members || []
        };
    }
    async addProjectMember(projectId, userId, role) {
        return this.request(`/projects/${projectId}/members`, {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                role
            })
        });
    }
    // Tasks
    async createTask(projectId, data) {
        return this.request(`/projects/${projectId}/tasks`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async getTasks(projectId, filters) {
        const params = new URLSearchParams(filters || {});
        return this.request(`/projects/${projectId}/tasks?${params}`);
    }
    async getTask(taskId) {
        return this.request(`/tasks/${taskId}`);
    }
    async updateTask(taskId, data) {
        return this.request(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    async updateTaskStatus(taskId, status) {
        return this.request(`/tasks/${taskId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({
                status
            })
        });
    }
    async addAssignees(taskId, userIds) {
        return this.request(`/tasks/${taskId}/assignees`, {
            method: 'POST',
            body: JSON.stringify({
                user_ids: userIds
            })
        });
    }
    async addDependency(taskId, dependsOn) {
        return this.request(`/tasks/${taskId}/dependencies`, {
            method: 'POST',
            body: JSON.stringify({
                depends_on: dependsOn
            })
        });
    }
    async removeDependency(taskId, depId) {
        return this.request(`/tasks/${taskId}/dependencies/${depId}`, {
            method: 'DELETE'
        });
    }
    async deleteTask(taskId) {
        return this.request(`/tasks/${taskId}`, {
            method: 'DELETE'
        });
    }
    async acquireLock(taskId, socketId) {
        return this.request(`/tasks/${taskId}/lock`, {
            method: 'POST',
            body: JSON.stringify({
                socket_id: socketId
            })
        });
    }
    async releaseLock(taskId) {
        return this.request(`/tasks/${taskId}/lock`, {
            method: 'DELETE'
        });
    }
    // Comments
    async createComment(taskId, content, parentId) {
        return this.request(`/tasks/${taskId}/comments`, {
            method: 'POST',
            body: JSON.stringify({
                content,
                parent_id: parentId
            })
        });
    }
    async getComments(taskId) {
        return this.request(`/tasks/${taskId}/comments`);
    }
    async updateComment(commentId, content) {
        return this.request(`/comments/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify({
                content
            })
        });
    }
    async deleteComment(commentId) {
        return this.request(`/comments/${commentId}`, {
            method: 'DELETE'
        });
    }
    // Attachments
    async uploadAttachment(taskId, file) {
        const formData = new FormData();
        formData.append('file', file);
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        const response = await fetch(`${API_URL}/tasks/${taskId}/attachments`, {
            method: 'POST',
            headers,
            body: formData
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'Upload failed');
        }
        return data;
    }
    async getAttachments(taskId) {
        return this.request(`/tasks/${taskId}/attachments`);
    }
    async deleteAttachment(attachmentId) {
        return this.request(`/attachments/${attachmentId}`, {
            method: 'DELETE'
        });
    }
    // Notifications
    async getNotifications(limit) {
        const params = limit ? `?limit=${limit}` : '';
        return this.request(`/notifications${params}`);
    }
    async markNotificationRead(notificationId) {
        return this.request(`/notifications/${notificationId}/read`, {
            method: 'PATCH'
        });
    }
    async markAllNotificationsRead() {
        return this.request('/notifications/read-all', {
            method: 'POST'
        });
    }
    // AI
    async parseNaturalLanguage(text, projectId) {
        return this.request('/ai/parse-task', {
            method: 'POST',
            body: JSON.stringify({
                text,
                project_id: projectId
            })
        });
    }
    async getSuggestions(title, description, projectId) {
        return this.request('/ai/suggest', {
            method: 'POST',
            body: JSON.stringify({
                title,
                description,
                project_id: projectId
            })
        });
    }
    async getScheduleRecommendations(projectId) {
        return this.request(`/ai/schedule/${projectId}`);
    }
    async getWorkloadAnalysis(orgId) {
        return this.request(`/ai/workload/${orgId}`);
    }
    async breakdownTask(title, description, projectId) {
        return this.request('/ai/breakdown', {
            method: 'POST',
            body: JSON.stringify({
                title,
                description,
                project_id: projectId
            })
        });
    }
    async getProjectInsights(projectId) {
        return this.request(`/ai/insights/${projectId}`);
    }
}
const api = new ApiClient();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
;
;
;
;
const SOCKET_URL = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:5000';
const useStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        // Initial state
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        organizations: [],
        currentOrg: null,
        projects: [],
        currentProject: null,
        tasks: [],
        tasksByStatus: {
            backlog: [],
            todo: [],
            in_progress: [],
            review: [],
            done: []
        },
        notifications: [],
        unreadCount: 0,
        socket: null,
        connectedUsers: [],
        lockedTasks: {},
        pendingUpdates: new Map(),
        // Auth actions
        login: async (email, password)=>{
            const { user, access_token, refresh_token } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].login(email, password);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].setToken(access_token);
            set({
                user,
                token: access_token,
                refreshToken: refresh_token,
                isAuthenticated: true
            });
            get().connectSocket();
        },
        register: async (email, password, name)=>{
            const { user, access_token, refresh_token } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].register(email, password, name);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].setToken(access_token);
            set({
                user,
                token: access_token,
                refreshToken: refresh_token,
                isAuthenticated: true
            });
            get().connectSocket();
        },
        logout: ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].setToken(null);
            get().disconnectSocket();
            set({
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                organizations: [],
                currentOrg: null,
                projects: [],
                currentProject: null,
                tasks: [],
                tasksByStatus: {
                    backlog: [],
                    todo: [],
                    in_progress: [],
                    review: [],
                    done: []
                }
            });
        },
        loadUser: async ()=>{
            const { token } = get();
            if (!token) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].setToken(token);
            try {
                const { user } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].getMe();
                set({
                    user,
                    isAuthenticated: true
                });
                get().connectSocket();
            } catch  {
                get().logout();
            }
        },
        // Organization actions
        setCurrentOrg: (org)=>set({
                currentOrg: org,
                projects: [],
                currentProject: null
            }),
        loadOrganizations: async ()=>{
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].getOrganizations();
                set({
                    organizations: result?.organizations || []
                });
            } catch (error) {
                console.error('Failed to load organizations:', error);
                set({
                    organizations: []
                });
            }
        },
        createOrganization: async (name)=>{
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].createOrganization(name);
            // Check if it's an error response (duplicate name)
            if (result.error) {
                const error = new Error(result.error.message || 'Failed to create organization');
                error.code = result.error.code;
                error.suggestions = result.suggestions || [];
                error.reason = result.reason || '';
                throw error;
            }
            const organization = result.organization;
            if (organization) {
                set((state)=>({
                        organizations: [
                            ...state.organizations,
                            organization
                        ]
                    }));
            }
            return organization;
        },
        removeOrganization: (orgId)=>{
            set((state)=>{
                const newOrgs = state.organizations.filter((o)=>o._id !== orgId);
                const newCurrentOrg = state.currentOrg?._id === orgId ? newOrgs.length > 0 ? newOrgs[0] : null : state.currentOrg;
                return {
                    organizations: newOrgs,
                    currentOrg: newCurrentOrg,
                    projects: newCurrentOrg?._id === state.currentOrg?._id ? state.projects : [],
                    currentProject: newCurrentOrg?._id === state.currentOrg?._id ? state.currentProject : null
                };
            });
        },
        // Project actions
        setCurrentProject: (project)=>set({
                currentProject: project,
                tasks: []
            }),
        loadProjects: async (orgId)=>{
            const { projects } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].getProjects(orgId);
            set({
                projects
            });
        },
        createProject: async (orgId, name, description)=>{
            const { project } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].createProject(orgId, name, description);
            set((state)=>({
                    projects: [
                        ...state.projects,
                        project
                    ]
                }));
            return project;
        },
        // Task actions
        loadTasks: async (projectId)=>{
            const { tasks, tasks_by_status } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].getTasks(projectId);
            set({
                tasks,
                tasksByStatus: tasks_by_status
            });
        },
        addTask: (task)=>{
            set((state)=>{
                // Check if task already exists to prevent duplicates
                if (state.tasks.some((t)=>t._id === task._id)) {
                    return state;
                }
                const newTasks = [
                    ...state.tasks,
                    task
                ];
                const newByStatus = {
                    ...state.tasksByStatus
                };
                // Ensure we're adding to the correct status column
                Object.keys(newByStatus).forEach((status)=>{
                    newByStatus[status] = newByStatus[status].filter((t)=>t._id !== task._id);
                });
                newByStatus[task.status] = [
                    ...newByStatus[task.status] || [],
                    task
                ];
                return {
                    tasks: newTasks,
                    tasksByStatus: newByStatus
                };
            });
        },
        updateTask: (taskId, updates)=>{
            set((state)=>{
                // Find the original task
                const originalTask = state.tasks.find((t)=>t._id === taskId);
                if (!originalTask) return state;
                // Create updated task
                const updatedTask = {
                    ...originalTask,
                    ...updates
                };
                // Update tasks array
                const newTasks = state.tasks.map((t)=>t._id === taskId ? updatedTask : t);
                // Create new tasksByStatus - remove from ALL columns first to prevent duplicates
                const newByStatus = {
                    backlog: [],
                    todo: [],
                    in_progress: [],
                    review: [],
                    done: []
                };
                // Rebuild tasksByStatus from newTasks to ensure no duplicates
                newTasks.forEach((task)=>{
                    newByStatus[task.status].push(task);
                });
                return {
                    tasks: newTasks,
                    tasksByStatus: newByStatus
                };
            });
        },
        removeTask: (taskId)=>{
            set((state)=>{
                const newTasks = state.tasks.filter((t)=>t._id !== taskId);
                const newByStatus = {
                    ...state.tasksByStatus
                };
                Object.keys(newByStatus).forEach((status)=>{
                    newByStatus[status] = newByStatus[status].filter((t)=>t._id !== taskId);
                });
                return {
                    tasks: newTasks,
                    tasksByStatus: newByStatus
                };
            });
        },
        moveTask: async (taskId, newStatus)=>{
            const task = get().tasks.find((t)=>t._id === taskId);
            if (!task) return;
            // Optimistic update
            get().applyOptimisticUpdate(taskId, task, {
                ...task,
                status: newStatus
            });
            get().updateTask(taskId, {
                status: newStatus
            });
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].updateTaskStatus(taskId, newStatus);
                get().confirmUpdate(taskId);
            } catch (error) {
                get().revertUpdate(taskId);
                throw error;
            }
        },
        // Notification actions
        loadNotifications: async ()=>{
            const { notifications, unread_count } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].getNotifications();
            set({
                notifications,
                unreadCount: unread_count
            });
        },
        markNotificationRead: (id)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].markNotificationRead(id);
            set((state)=>({
                    notifications: state.notifications.map((n)=>n._id === id ? {
                            ...n,
                            is_read: true
                        } : n),
                    unreadCount: Math.max(0, state.unreadCount - 1)
                }));
        },
        // Socket actions
        connectSocket: ()=>{
            const { token, socket: existingSocket } = get();
            if (!token || existingSocket?.connected) return;
            const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(SOCKET_URL, {
                transports: [
                    'websocket'
                ]
            });
            socket.on('connect', ()=>{
                socket.emit('authenticate', {
                    token
                });
            });
            socket.on('authenticated', ()=>{
                console.log('Socket authenticated');
            });
            socket.on('task_created', ({ task })=>{
                get().addTask(task);
            });
            socket.on('task_updated', ({ task })=>{
                get().updateTask(task._id, task);
            });
            socket.on('task_deleted', ({ task_id })=>{
                get().removeTask(task_id);
            });
            socket.on('task_locked', ({ task_id, user })=>{
                set((state)=>({
                        lockedTasks: {
                            ...state.lockedTasks,
                            [task_id]: user
                        }
                    }));
            });
            socket.on('task_unlocked', ({ task_id })=>{
                set((state)=>{
                    const newLocked = {
                        ...state.lockedTasks
                    };
                    delete newLocked[task_id];
                    return {
                        lockedTasks: newLocked
                    };
                });
            });
            socket.on('user_joined', ({ user })=>{
                set((state)=>({
                        connectedUsers: [
                            ...state.connectedUsers.filter((u)=>u._id !== user._id),
                            user
                        ]
                    }));
            });
            socket.on('user_left', ({ user })=>{
                set((state)=>({
                        connectedUsers: state.connectedUsers.filter((u)=>u._id !== user._id)
                    }));
            });
            set({
                socket
            });
        },
        disconnectSocket: ()=>{
            const { socket } = get();
            if (socket) {
                socket.disconnect();
                set({
                    socket: null,
                    connectedUsers: [],
                    lockedTasks: {}
                });
            }
        },
        joinProject: (projectId)=>{
            const { socket } = get();
            if (socket?.connected) {
                socket.emit('join_project', {
                    project_id: projectId
                });
            }
        },
        leaveProject: (projectId)=>{
            const { socket } = get();
            if (socket?.connected) {
                socket.emit('leave_project', {
                    project_id: projectId
                });
            }
        },
        // Optimistic update actions
        applyOptimisticUpdate: (id, original, optimistic)=>{
            set((state)=>{
                const newPending = new Map(state.pendingUpdates);
                newPending.set(id, {
                    id,
                    originalData: original,
                    optimisticData: optimistic,
                    timestamp: Date.now()
                });
                return {
                    pendingUpdates: newPending
                };
            });
        },
        confirmUpdate: (id)=>{
            set((state)=>{
                const newPending = new Map(state.pendingUpdates);
                newPending.delete(id);
                return {
                    pendingUpdates: newPending
                };
            });
        },
        revertUpdate: (id)=>{
            const pending = get().pendingUpdates.get(id);
            if (pending) {
                get().updateTask(id, pending.originalData);
            }
            get().confirmUpdate(id);
        }
    }), {
    name: 'app-storage',
    partialize: (state)=>({
            token: state.token,
            refreshToken: state.refreshToken,
            user: state.user,
            currentOrg: state.currentOrg
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-indigo-600 text-white shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
            destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
            outline: "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100",
            secondary: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700",
            ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
            link: "text-indigo-600 dark:text-indigo-400 underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 40,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/theme-toggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeDropdown",
    ()=>ThemeDropdown,
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/monitor.js [app-client] (ecmascript) <export default as Monitor>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function ThemeToggle() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(15);
    if ($[0] !== "037b1c66dcb417427ebf606ec9a6d9f20153c890f5e98f7cbeb3d0bd62967aaf") {
        for(let $i = 0; $i < 15; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "037b1c66dcb417427ebf606ec9a6d9f20153c890f5e98f7cbeb3d0bd62967aaf";
    }
    const { theme, setTheme, resolvedTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const [mounted, setMounted] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    let t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = ({
            "ThemeToggle[useEffect()]": ()=>{
                setMounted(true);
            }
        })["ThemeToggle[useEffect()]"];
        t1 = [];
        $[1] = t0;
        $[2] = t1;
    } else {
        t0 = $[1];
        t1 = $[2];
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"](t0, t1);
    if (!mounted) {
        let t2;
        if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
            t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "ghost",
                size: "icon",
                className: "h-9 w-9 rounded-xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/theme-toggle.tsx",
                    lineNumber: 42,
                    columnNumber: 79
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/theme-toggle.tsx",
                lineNumber: 42,
                columnNumber: 12
            }, this);
            $[3] = t2;
        } else {
            t2 = $[3];
        }
        return t2;
    }
    let t2;
    if ($[4] !== setTheme || $[5] !== theme) {
        t2 = ({
            "ThemeToggle[toggleTheme]": ()=>{
                const newTheme = theme === "dark" ? "light" : "dark";
                setTheme(newTheme);
            }
        })["ThemeToggle[toggleTheme]"];
        $[4] = setTheme;
        $[5] = theme;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    const toggleTheme = t2;
    const isDark = theme === "dark" || theme === "system" && resolvedTheme === "dark";
    let t3;
    let t4;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = {
            scale: 1.05
        };
        t4 = {
            scale: 0.95
        };
        $[7] = t3;
        $[8] = t4;
    } else {
        t3 = $[7];
        t4 = $[8];
    }
    let t5;
    if ($[9] !== isDark) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            mode: "wait",
            initial: false,
            children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    y: -20,
                    opacity: 0,
                    rotate: -90
                },
                animate: {
                    y: 0,
                    opacity: 1,
                    rotate: 0
                },
                exit: {
                    y: 20,
                    opacity: 0,
                    rotate: 90
                },
                transition: {
                    duration: 0.2
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                    className: "h-4 w-4 text-indigo-400"
                }, void 0, false, {
                    fileName: "[project]/src/components/theme-toggle.tsx",
                    lineNumber: 96,
                    columnNumber: 10
                }, this)
            }, "moon", false, {
                fileName: "[project]/src/components/theme-toggle.tsx",
                lineNumber: 82,
                columnNumber: 65
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    y: -20,
                    opacity: 0,
                    rotate: 90
                },
                animate: {
                    y: 0,
                    opacity: 1,
                    rotate: 0
                },
                exit: {
                    y: 20,
                    opacity: 0,
                    rotate: -90
                },
                transition: {
                    duration: 0.2
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                    className: "h-4 w-4 text-amber-500"
                }, void 0, false, {
                    fileName: "[project]/src/components/theme-toggle.tsx",
                    lineNumber: 110,
                    columnNumber: 10
                }, this)
            }, "sun", false, {
                fileName: "[project]/src/components/theme-toggle.tsx",
                lineNumber: 96,
                columnNumber: 70
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/theme-toggle.tsx",
            lineNumber: 82,
            columnNumber: 10
        }, this);
        $[9] = isDark;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    let t6;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "sr-only",
            children: "Toggle theme"
        }, void 0, false, {
            fileName: "[project]/src/components/theme-toggle.tsx",
            lineNumber: 118,
            columnNumber: 10
        }, this);
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] !== t5 || $[13] !== toggleTheme) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            whileHover: t3,
            whileTap: t4,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "ghost",
                size: "icon",
                onClick: toggleTheme,
                className: "h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700",
                children: [
                    t5,
                    t6
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/theme-toggle.tsx",
                lineNumber: 125,
                columnNumber: 52
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/theme-toggle.tsx",
            lineNumber: 125,
            columnNumber: 10
        }, this);
        $[12] = t5;
        $[13] = toggleTheme;
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    return t7;
}
_s(ThemeToggle, "qj4yeJLweL5h7YX0rtr+sX2buWk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeToggle;
function ThemeDropdown() {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(27);
    if ($[0] !== "037b1c66dcb417427ebf606ec9a6d9f20153c890f5e98f7cbeb3d0bd62967aaf") {
        for(let $i = 0; $i < 27; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "037b1c66dcb417427ebf606ec9a6d9f20153c890f5e98f7cbeb3d0bd62967aaf";
    }
    const { theme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const [mounted, setMounted] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [open, setOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    let t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = ({
            "ThemeDropdown[useEffect()]": ()=>{
                setMounted(true);
            }
        })["ThemeDropdown[useEffect()]"];
        t1 = [];
        $[1] = t0;
        $[2] = t1;
    } else {
        t0 = $[1];
        t1 = $[2];
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"](t0, t1);
    if (!mounted) {
        let t2;
        if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
            t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "ghost",
                size: "icon",
                className: "h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/theme-toggle.tsx",
                    lineNumber: 167,
                    columnNumber: 111
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/theme-toggle.tsx",
                lineNumber: 167,
                columnNumber: 12
            }, this);
            $[3] = t2;
        } else {
            t2 = $[3];
        }
        return t2;
    }
    let t2;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = [
            {
                value: "light",
                label: "Light",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"],
                color: "text-amber-500"
            },
            {
                value: "dark",
                label: "Dark",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"],
                color: "text-indigo-400"
            },
            {
                value: "system",
                label: "System",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__["Monitor"],
                color: "text-slate-500 dark:text-slate-400"
            }
        ];
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const themes = t2;
    let t3;
    if ($[5] !== theme) {
        t3 = ({
            "ThemeDropdown[getCurrentIcon]": ()=>{
                if (theme === "system") {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__["Monitor"], {
                        className: "h-4 w-4 text-slate-500 dark:text-slate-400"
                    }, void 0, false, {
                        fileName: "[project]/src/components/theme-toggle.tsx",
                        lineNumber: 202,
                        columnNumber: 18
                    }, this);
                }
                if (theme === "dark") {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                        className: "h-4 w-4 text-indigo-400"
                    }, void 0, false, {
                        fileName: "[project]/src/components/theme-toggle.tsx",
                        lineNumber: 205,
                        columnNumber: 18
                    }, this);
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                    className: "h-4 w-4 text-amber-500"
                }, void 0, false, {
                    fileName: "[project]/src/components/theme-toggle.tsx",
                    lineNumber: 207,
                    columnNumber: 16
                }, this);
            }
        })["ThemeDropdown[getCurrentIcon]"];
        $[5] = theme;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    const getCurrentIcon = t3;
    let t4;
    if ($[7] !== setTheme) {
        t4 = ({
            "ThemeDropdown[handleThemeChange]": (newTheme)=>{
                setTheme(newTheme);
                setOpen(false);
            }
        })["ThemeDropdown[handleThemeChange]"];
        $[7] = setTheme;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    const handleThemeChange = t4;
    let t5;
    let t6;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = {
            scale: 1.05
        };
        t6 = {
            scale: 0.95
        };
        $[9] = t5;
        $[10] = t6;
    } else {
        t5 = $[9];
        t6 = $[10];
    }
    let t7;
    if ($[11] !== open) {
        t7 = ({
            "ThemeDropdown[<Button>.onClick]": ()=>setOpen(!open)
        })["ThemeDropdown[<Button>.onClick]"];
        $[11] = open;
        $[12] = t7;
    } else {
        t7 = $[12];
    }
    let t8;
    if ($[13] !== getCurrentIcon) {
        t8 = getCurrentIcon();
        $[13] = getCurrentIcon;
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    let t9;
    if ($[15] !== t7 || $[16] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            whileHover: t5,
            whileTap: t6,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "ghost",
                size: "icon",
                onClick: t7,
                className: "h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700",
                children: t8
            }, void 0, false, {
                fileName: "[project]/src/components/theme-toggle.tsx",
                lineNumber: 265,
                columnNumber: 52
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/theme-toggle.tsx",
            lineNumber: 265,
            columnNumber: 10
        }, this);
        $[15] = t7;
        $[16] = t8;
        $[17] = t9;
    } else {
        t9 = $[17];
    }
    let t10;
    if ($[18] !== handleThemeChange || $[19] !== open || $[20] !== theme) {
        t10 = open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    className: "fixed inset-0 z-40",
                    onClick: {
                        "ThemeDropdown[<motion.div>.onClick]": ()=>setOpen(false)
                    }["ThemeDropdown[<motion.div>.onClick]"]
                }, void 0, false, {
                    fileName: "[project]/src/components/theme-toggle.tsx",
                    lineNumber: 274,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 10,
                        scale: 0.95
                    },
                    animate: {
                        opacity: 1,
                        y: 0,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        y: 10,
                        scale: 0.95
                    },
                    transition: {
                        duration: 0.15
                    },
                    className: "absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden",
                    children: themes.map({
                        "ThemeDropdown[themes.map()]": (t)=>{
                            const Icon = t.icon;
                            const isSelected = theme === t.value;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "ThemeDropdown[themes.map() > <button>.onClick]": ()=>handleThemeChange(t.value)
                                }["ThemeDropdown[themes.map() > <button>.onClick]"],
                                className: `w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isSelected ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: `h-4 w-4 ${t.color}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/theme-toggle.tsx",
                                        lineNumber: 302,
                                        columnNumber: 323
                                    }, this),
                                    t.label,
                                    isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/theme-toggle.tsx",
                                        lineNumber: 302,
                                        columnNumber: 388
                                    }, this)
                                ]
                            }, t.value, true, {
                                fileName: "[project]/src/components/theme-toggle.tsx",
                                lineNumber: 300,
                                columnNumber: 20
                            }, this);
                        }
                    }["ThemeDropdown[themes.map()]"])
                }, void 0, false, {
                    fileName: "[project]/src/components/theme-toggle.tsx",
                    lineNumber: 282,
                    columnNumber: 51
                }, this)
            ]
        }, void 0, true);
        $[18] = handleThemeChange;
        $[19] = open;
        $[20] = theme;
        $[21] = t10;
    } else {
        t10 = $[21];
    }
    let t11;
    if ($[22] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: t10
        }, void 0, false, {
            fileName: "[project]/src/components/theme-toggle.tsx",
            lineNumber: 314,
            columnNumber: 11
        }, this);
        $[22] = t10;
        $[23] = t11;
    } else {
        t11 = $[23];
    }
    let t12;
    if ($[24] !== t11 || $[25] !== t9) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                t9,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/theme-toggle.tsx",
            lineNumber: 322,
            columnNumber: 11
        }, this);
        $[24] = t11;
        $[25] = t9;
        $[26] = t12;
    } else {
        t12 = $[26];
    }
    return t12;
}
_s1(ThemeDropdown, "0/IQ83f4pWBTDmLIOs4iQN422HM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c1 = ThemeDropdown;
var _c, _c1;
__turbopack_context__.k.register(_c, "ThemeToggle");
__turbopack_context__.k.register(_c1, "ThemeDropdown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(dashboard)/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-kanban.js [app-client] (ecmascript) <export default as FolderKanban>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/theme-toggle.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function DashboardLayout(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(127);
    if ($[0] !== "b085312beab1a5cfd07438e9c018106dbde7dd56c72c55f89dca46f044c9c968") {
        for(let $i = 0; $i < 127; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b085312beab1a5cfd07438e9c018106dbde7dd56c72c55f89dca46f044c9c968";
    }
    const { children } = t0;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, isAuthenticated, loadUser, logout, organizations, currentOrg, loadOrganizations, setCurrentOrg, projects, loadProjects, notifications, unreadCount, loadNotifications } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])();
    const [showOrgDropdown, setShowOrgDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showNotifications, setShowNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    let t2;
    if ($[1] !== loadUser) {
        t1 = ({
            "DashboardLayout[useEffect()]": ()=>{
                loadUser();
            }
        })["DashboardLayout[useEffect()]"];
        t2 = [
            loadUser
        ];
        $[1] = loadUser;
        $[2] = t1;
        $[3] = t2;
    } else {
        t1 = $[2];
        t2 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    let t3;
    let t4;
    if ($[4] !== isAuthenticated || $[5] !== loadNotifications || $[6] !== loadOrganizations || $[7] !== router) {
        t3 = ({
            "DashboardLayout[useEffect()]": ()=>{
                if (!isAuthenticated) {
                    router.push("/login");
                } else {
                    loadOrganizations();
                    loadNotifications();
                }
            }
        })["DashboardLayout[useEffect()]"];
        t4 = [
            isAuthenticated,
            router,
            loadOrganizations,
            loadNotifications
        ];
        $[4] = isAuthenticated;
        $[5] = loadNotifications;
        $[6] = loadOrganizations;
        $[7] = router;
        $[8] = t3;
        $[9] = t4;
    } else {
        t3 = $[8];
        t4 = $[9];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t3, t4);
    let t5;
    let t6;
    if ($[10] !== currentOrg || $[11] !== loadProjects) {
        t5 = ({
            "DashboardLayout[useEffect()]": ()=>{
                if (currentOrg) {
                    loadProjects(currentOrg._id);
                }
            }
        })["DashboardLayout[useEffect()]"];
        t6 = [
            currentOrg,
            loadProjects
        ];
        $[10] = currentOrg;
        $[11] = loadProjects;
        $[12] = t5;
        $[13] = t6;
    } else {
        t5 = $[12];
        t6 = $[13];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t5, t6);
    let t7;
    let t8;
    if ($[14] !== currentOrg || $[15] !== organizations || $[16] !== setCurrentOrg) {
        t7 = ({
            "DashboardLayout[useEffect()]": ()=>{
                if (organizations && organizations.length > 0 && !currentOrg) {
                    setCurrentOrg(organizations[0]);
                }
            }
        })["DashboardLayout[useEffect()]"];
        t8 = [
            organizations,
            currentOrg,
            setCurrentOrg
        ];
        $[14] = currentOrg;
        $[15] = organizations;
        $[16] = setCurrentOrg;
        $[17] = t7;
        $[18] = t8;
    } else {
        t7 = $[17];
        t8 = $[18];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t7, t8);
    let t9;
    if ($[19] !== logout || $[20] !== router) {
        t9 = ({
            "DashboardLayout[handleLogout]": ()=>{
                logout();
                router.push("/");
            }
        })["DashboardLayout[handleLogout]"];
        $[19] = logout;
        $[20] = router;
        $[21] = t9;
    } else {
        t9 = $[21];
    }
    const handleLogout = t9;
    if (!isAuthenticated) {
        return null;
    }
    let t10;
    let t11;
    let t12;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = {
            x: -20,
            opacity: 0
        };
        t11 = {
            x: 0,
            opacity: 1
        };
        t12 = {
            duration: 0.3
        };
        $[22] = t10;
        $[23] = t11;
        $[24] = t12;
    } else {
        t10 = $[22];
        t11 = $[23];
        t12 = $[24];
    }
    let t13;
    if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 border-b border-slate-200 dark:border-slate-800",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/dashboard",
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                            className: "h-4 w-4 text-white"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/layout.tsx",
                            lineNumber: 167,
                            columnNumber: 257
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/layout.tsx",
                        lineNumber: 167,
                        columnNumber: 140
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent",
                        children: "AI PM"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/layout.tsx",
                        lineNumber: 167,
                        columnNumber: 306
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 167,
                columnNumber: 80
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 167,
            columnNumber: 11
        }, this);
        $[25] = t13;
    } else {
        t13 = $[25];
    }
    let t14;
    if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = {
            scale: 1.01
        };
        $[26] = t14;
    } else {
        t14 = $[26];
    }
    let t15;
    if ($[27] !== showOrgDropdown) {
        t15 = ({
            "DashboardLayout[<motion.button>.onClick]": ()=>setShowOrgDropdown(!showOrgDropdown)
        })["DashboardLayout[<motion.button>.onClick]"];
        $[27] = showOrgDropdown;
        $[28] = t15;
    } else {
        t15 = $[28];
    }
    let t16;
    if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                className: "h-4 w-4 text-white"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 193,
                columnNumber: 128
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 193,
            columnNumber: 11
        }, this);
        $[29] = t16;
    } else {
        t16 = $[29];
    }
    const t17 = currentOrg?.name || "Select Organization";
    let t18;
    if ($[30] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: [
                t16,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm font-medium text-slate-900 dark:text-slate-100 truncate",
                    children: t17
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 201,
                    columnNumber: 57
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 201,
            columnNumber: 11
        }, this);
        $[30] = t17;
        $[31] = t18;
    } else {
        t18 = $[31];
    }
    const t19 = showOrgDropdown ? 180 : 0;
    let t20;
    if ($[32] !== t19) {
        t20 = {
            rotate: t19
        };
        $[32] = t19;
        $[33] = t20;
    } else {
        t20 = $[33];
    }
    let t21;
    let t22;
    if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = {
            duration: 0.2
        };
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "h-4 w-4 text-slate-500 dark:text-slate-400"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 224,
            columnNumber: 11
        }, this);
        $[34] = t21;
        $[35] = t22;
    } else {
        t21 = $[34];
        t22 = $[35];
    }
    let t23;
    if ($[36] !== t20) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            animate: t20,
            transition: t21,
            children: t22
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 233,
            columnNumber: 11
        }, this);
        $[36] = t20;
        $[37] = t23;
    } else {
        t23 = $[37];
    }
    let t24;
    if ($[38] !== t15 || $[39] !== t18 || $[40] !== t23) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
            whileHover: t14,
            onClick: t15,
            className: "w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700",
            children: [
                t18,
                t23
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 241,
            columnNumber: 11
        }, this);
        $[38] = t15;
        $[39] = t18;
        $[40] = t23;
        $[41] = t24;
    } else {
        t24 = $[41];
    }
    let t25;
    if ($[42] !== currentOrg?._id || $[43] !== organizations || $[44] !== setCurrentOrg || $[45] !== showOrgDropdown) {
        t25 = showOrgDropdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: -10
            },
            animate: {
                opacity: 1,
                y: 0
            },
            exit: {
                opacity: 0,
                y: -10
            },
            transition: {
                duration: 0.2
            },
            className: "absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden",
            children: [
                organizations && organizations.map({
                    "DashboardLayout[organizations.map()]": (org, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                            initial: {
                                opacity: 0,
                                x: -10
                            },
                            animate: {
                                opacity: 1,
                                x: 0
                            },
                            transition: {
                                delay: index * 0.05
                            },
                            onClick: {
                                "DashboardLayout[organizations.map() > <motion.button>.onClick]": ()=>{
                                    setCurrentOrg(org);
                                    setShowOrgDropdown(false);
                                }
                            }["DashboardLayout[organizations.map() > <motion.button>.onClick]"],
                            className: `w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 ${currentOrg?._id === org._id ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-2 h-2 rounded-full ${currentOrg?._id === org._id ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                                    lineNumber: 276,
                                    columnNumber: 357
                                }, this),
                                org.name
                            ]
                        }, org._id, true, {
                            fileName: "[project]/src/app/(dashboard)/layout.tsx",
                            lineNumber: 263,
                            columnNumber: 65
                        }, this)
                }["DashboardLayout[organizations.map()]"]),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/dashboard/organizations/new",
                    className: "flex items-center gap-2 px-4 py-3 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-t border-slate-200 dark:border-slate-700 font-medium",
                    onClick: {
                        "DashboardLayout[<Link>.onClick]": ()=>setShowOrgDropdown(false)
                    }["DashboardLayout[<Link>.onClick]"],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/layout.tsx",
                            lineNumber: 279,
                            columnNumber: 45
                        }, this),
                        " New Organization"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 277,
                    columnNumber: 50
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 251,
            columnNumber: 30
        }, this);
        $[42] = currentOrg?._id;
        $[43] = organizations;
        $[44] = setCurrentOrg;
        $[45] = showOrgDropdown;
        $[46] = t25;
    } else {
        t25 = $[46];
    }
    let t26;
    if ($[47] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: t25
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 290,
            columnNumber: 11
        }, this);
        $[47] = t25;
        $[48] = t26;
    } else {
        t26 = $[48];
    }
    let t27;
    if ($[49] !== t24 || $[50] !== t26) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 border-b border-slate-200 dark:border-slate-800",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    t24,
                    t26
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 298,
                columnNumber: 80
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 298,
            columnNumber: 11
        }, this);
        $[49] = t24;
        $[50] = t26;
        $[51] = t27;
    } else {
        t27 = $[51];
    }
    let t28;
    if ($[52] === Symbol.for("react.memo_cache_sentinel")) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavLink, {
            href: "/dashboard",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
            label: "Dashboard"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 307,
            columnNumber: 11
        }, this);
        $[52] = t28;
    } else {
        t28 = $[52];
    }
    let t29;
    if ($[53] !== currentOrg) {
        t29 = currentOrg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavLink, {
                    href: `/dashboard/organizations/${currentOrg._id}/members`,
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
                    label: "Members"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 314,
                    columnNumber: 27
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavLink, {
                    href: `/dashboard/organizations/${currentOrg._id}/settings`,
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
                    label: "Settings"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 314,
                    columnNumber: 127
                }, this)
            ]
        }, void 0, true);
        $[53] = currentOrg;
        $[54] = t29;
    } else {
        t29 = $[54];
    }
    let t30;
    if ($[55] === Symbol.for("react.memo_cache_sentinel")) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider",
            children: "Projects"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 322,
            columnNumber: 11
        }, this);
        $[55] = t30;
    } else {
        t30 = $[55];
    }
    let t31;
    if ($[56] === Symbol.for("react.memo_cache_sentinel")) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between px-3 py-2",
            children: [
                t30,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/dashboard/projects/new",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        whileHover: {
                            scale: 1.1
                        },
                        whileTap: {
                            scale: 0.9
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "h-4 w-4 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/layout.tsx",
                            lineNumber: 333,
                            columnNumber: 12
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/layout.tsx",
                        lineNumber: 329,
                        columnNumber: 114
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 329,
                    columnNumber: 77
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 329,
            columnNumber: 11
        }, this);
        $[56] = t31;
    } else {
        t31 = $[56];
    }
    let t32;
    if ($[57] !== projects) {
        t32 = projects.map(_DashboardLayoutProjectsMap);
        $[57] = projects;
        $[58] = t32;
    } else {
        t32 = $[58];
    }
    let t33;
    if ($[59] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: t32
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 348,
            columnNumber: 11
        }, this);
        $[59] = t32;
        $[60] = t33;
    } else {
        t33 = $[60];
    }
    let t34;
    if ($[61] !== projects.length) {
        t34 = projects.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "px-3 py-2 text-xs text-slate-400 dark:text-slate-500",
            children: "No projects yet"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 356,
            columnNumber: 36
        }, this);
        $[61] = projects.length;
        $[62] = t34;
    } else {
        t34 = $[62];
    }
    let t35;
    if ($[63] !== t33 || $[64] !== t34) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "pt-6",
            children: [
                t31,
                t33,
                t34
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 364,
            columnNumber: 11
        }, this);
        $[63] = t33;
        $[64] = t34;
        $[65] = t35;
    } else {
        t35 = $[65];
    }
    let t36;
    if ($[66] !== t29 || $[67] !== t35) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "flex-1 p-4 space-y-1",
            children: [
                t28,
                t29,
                t35
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 373,
            columnNumber: 11
        }, this);
        $[66] = t29;
        $[67] = t35;
        $[68] = t36;
    } else {
        t36 = $[68];
    }
    let t37;
    if ($[69] !== user?.name) {
        t37 = user?.name?.charAt(0).toUpperCase();
        $[69] = user?.name;
        $[70] = t37;
    } else {
        t37 = $[70];
    }
    let t38;
    if ($[71] !== t37) {
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-sm font-semibold shadow-lg shadow-indigo-500/20",
            children: t37
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 390,
            columnNumber: 11
        }, this);
        $[71] = t37;
        $[72] = t38;
    } else {
        t38 = $[72];
    }
    const t39 = user?.name;
    let t40;
    if ($[73] !== t39) {
        t40 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm font-medium text-slate-900 dark:text-slate-100 truncate",
            children: t39
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 399,
            columnNumber: 11
        }, this);
        $[73] = t39;
        $[74] = t40;
    } else {
        t40 = $[74];
    }
    const t41 = user?.email;
    let t42;
    if ($[75] !== t41) {
        t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-xs text-slate-500 dark:text-slate-400 truncate",
            children: t41
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 408,
            columnNumber: 11
        }, this);
        $[75] = t41;
        $[76] = t42;
    } else {
        t42 = $[76];
    }
    let t43;
    if ($[77] !== t40 || $[78] !== t42) {
        t43 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 min-w-0",
            children: [
                t40,
                t42
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 416,
            columnNumber: 11
        }, this);
        $[77] = t40;
        $[78] = t42;
        $[79] = t43;
    } else {
        t43 = $[79];
    }
    let t44;
    let t45;
    if ($[80] === Symbol.for("react.memo_cache_sentinel")) {
        t44 = {
            scale: 1.05
        };
        t45 = {
            scale: 0.95
        };
        $[80] = t44;
        $[81] = t45;
    } else {
        t44 = $[80];
        t45 = $[81];
    }
    let t46;
    if ($[82] === Symbol.for("react.memo_cache_sentinel")) {
        t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 440,
            columnNumber: 11
        }, this);
        $[82] = t46;
    } else {
        t46 = $[82];
    }
    let t47;
    if ($[83] !== handleLogout) {
        t47 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            whileHover: t44,
            whileTap: t45,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "ghost",
                size: "icon",
                onClick: handleLogout,
                className: "text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
                children: t46
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 447,
                columnNumber: 55
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 447,
            columnNumber: 11
        }, this);
        $[83] = handleLogout;
        $[84] = t47;
    } else {
        t47 = $[84];
    }
    let t48;
    if ($[85] !== t38 || $[86] !== t43 || $[87] !== t47) {
        t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 border-t border-slate-200 dark:border-slate-800",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    t38,
                    t43,
                    t47
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 455,
                columnNumber: 80
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 455,
            columnNumber: 11
        }, this);
        $[85] = t38;
        $[86] = t43;
        $[87] = t47;
        $[88] = t48;
    } else {
        t48 = $[88];
    }
    let t49;
    if ($[89] !== t27 || $[90] !== t36 || $[91] !== t48) {
        t49 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].aside, {
            initial: t10,
            animate: t11,
            transition: t12,
            className: "w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm",
            children: [
                t13,
                t27,
                t36,
                t48
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 465,
            columnNumber: 11
        }, this);
        $[89] = t27;
        $[90] = t36;
        $[91] = t48;
        $[92] = t49;
    } else {
        t49 = $[92];
    }
    let t50;
    let t51;
    let t52;
    if ($[93] === Symbol.for("react.memo_cache_sentinel")) {
        t50 = {
            y: -10,
            opacity: 0
        };
        t51 = {
            y: 0,
            opacity: 1
        };
        t52 = {
            duration: 0.3,
            delay: 0.1
        };
        $[93] = t50;
        $[94] = t51;
        $[95] = t52;
    } else {
        t50 = $[93];
        t51 = $[94];
        t52 = $[95];
    }
    let t53;
    if ($[96] === Symbol.for("react.memo_cache_sentinel")) {
        t53 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeDropdown"], {}, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 499,
            columnNumber: 11
        }, this);
        $[96] = t53;
    } else {
        t53 = $[96];
    }
    let t54;
    let t55;
    if ($[97] === Symbol.for("react.memo_cache_sentinel")) {
        t54 = {
            scale: 1.05
        };
        t55 = {
            scale: 0.95
        };
        $[97] = t54;
        $[98] = t55;
    } else {
        t54 = $[97];
        t55 = $[98];
    }
    let t56;
    if ($[99] !== showNotifications) {
        t56 = ({
            "DashboardLayout[<Button>.onClick]": ()=>setShowNotifications(!showNotifications)
        })["DashboardLayout[<Button>.onClick]"];
        $[99] = showNotifications;
        $[100] = t56;
    } else {
        t56 = $[100];
    }
    let t57;
    if ($[101] === Symbol.for("react.memo_cache_sentinel")) {
        t57 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
            className: "h-5 w-5"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 531,
            columnNumber: 11
        }, this);
        $[101] = t57;
    } else {
        t57 = $[101];
    }
    let t58;
    if ($[102] !== unreadCount) {
        t58 = unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
            initial: {
                scale: 0
            },
            animate: {
                scale: 1
            },
            className: "absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg",
            children: unreadCount
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 538,
            columnNumber: 30
        }, this);
        $[102] = unreadCount;
        $[103] = t58;
    } else {
        t58 = $[103];
    }
    let t59;
    if ($[104] !== t56 || $[105] !== t58) {
        t59 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            whileHover: t54,
            whileTap: t55,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "ghost",
                size: "icon",
                onClick: t56,
                className: "relative",
                children: [
                    t57,
                    t58
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 550,
                columnNumber: 55
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 550,
            columnNumber: 11
        }, this);
        $[104] = t56;
        $[105] = t58;
        $[106] = t59;
    } else {
        t59 = $[106];
    }
    let t60;
    if ($[107] !== notifications || $[108] !== showNotifications || $[109] !== unreadCount) {
        t60 = showNotifications && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 10,
                scale: 0.95
            },
            animate: {
                opacity: 1,
                y: 0,
                scale: 1
            },
            exit: {
                opacity: 0,
                y: 10,
                scale: 0.95
            },
            transition: {
                duration: 0.2
            },
            className: "absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Notifications"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/layout.tsx",
                            lineNumber: 573,
                            columnNumber: 324
                        }, this),
                        unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full",
                            children: [
                                unreadCount,
                                " new"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(dashboard)/layout.tsx",
                            lineNumber: 573,
                            columnNumber: 370
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 573,
                    columnNumber: 172
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-h-96 overflow-y-auto",
                    children: notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "p-6 text-sm text-slate-400 dark:text-slate-500 text-center",
                        children: "No notifications yet"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/layout.tsx",
                        lineNumber: 573,
                        columnNumber: 595
                    }, this) : notifications.slice(0, 10).map(_DashboardLayoutAnonymous)
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 573,
                    columnNumber: 523
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 559,
            columnNumber: 32
        }, this);
        $[107] = notifications;
        $[108] = showNotifications;
        $[109] = unreadCount;
        $[110] = t60;
    } else {
        t60 = $[110];
    }
    let t61;
    if ($[111] !== t60) {
        t61 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: t60
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 583,
            columnNumber: 11
        }, this);
        $[111] = t60;
        $[112] = t61;
    } else {
        t61 = $[112];
    }
    let t62;
    if ($[113] !== t59 || $[114] !== t61) {
        t62 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].header, {
            initial: t50,
            animate: t51,
            transition: t52,
            className: "h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-end px-6 gap-4 sticky top-0 z-40",
            children: [
                t53,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        t59,
                        t61
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 591,
                    columnNumber: 250
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 591,
            columnNumber: 11
        }, this);
        $[113] = t59;
        $[114] = t61;
        $[115] = t62;
    } else {
        t62 = $[115];
    }
    let t63;
    let t64;
    let t65;
    if ($[116] === Symbol.for("react.memo_cache_sentinel")) {
        t63 = {
            opacity: 0,
            y: 10
        };
        t64 = {
            opacity: 1,
            y: 0
        };
        t65 = {
            duration: 0.3,
            delay: 0.2
        };
        $[116] = t63;
        $[117] = t64;
        $[118] = t65;
    } else {
        t63 = $[116];
        t64 = $[117];
        t65 = $[118];
    }
    let t66;
    if ($[119] !== children) {
        t66 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-950",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: t63,
                animate: t64,
                transition: t65,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 624,
                columnNumber: 84
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 624,
            columnNumber: 11
        }, this);
        $[119] = children;
        $[120] = t66;
    } else {
        t66 = $[120];
    }
    let t67;
    if ($[121] !== t62 || $[122] !== t66) {
        t67 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 flex flex-col",
            children: [
                t62,
                t66
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 632,
            columnNumber: 11
        }, this);
        $[121] = t62;
        $[122] = t66;
        $[123] = t67;
    } else {
        t67 = $[123];
    }
    let t68;
    if ($[124] !== t49 || $[125] !== t67) {
        t68 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex bg-slate-50 dark:bg-slate-950",
            children: [
                t49,
                t67
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 641,
            columnNumber: 11
        }, this);
        $[124] = t49;
        $[125] = t67;
        $[126] = t68;
    } else {
        t68 = $[126];
    }
    return t68;
}
_s(DashboardLayout, "a/EriqQx10D0P2p+TWO1orxlMlY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"]
    ];
});
_c = DashboardLayout;
function _DashboardLayoutAnonymous(n, index_1) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            x: -10
        },
        animate: {
            opacity: 1,
            x: 0
        },
        transition: {
            delay: index_1 * 0.05
        },
        className: `p-4 border-b border-slate-100 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${!n.is_read ? "bg-indigo-50/50 dark:bg-indigo-900/20" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-medium text-slate-900 dark:text-slate-100",
                children: n.title
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 659,
                columnNumber: 219
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-slate-500 dark:text-slate-400 mt-1",
                children: n.message
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 659,
                columnNumber: 294
            }, this)
        ]
    }, n._id, true, {
        fileName: "[project]/src/app/(dashboard)/layout.tsx",
        lineNumber: 651,
        columnNumber: 10
    }, this);
}
function _DashboardLayoutProjectsMap(project, index_0) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            x: -10
        },
        animate: {
            opacity: 1,
            x: 0
        },
        transition: {
            delay: index_0 * 0.05
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: `/dashboard/projects/${project._id}`,
            className: "flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__["FolderKanban"], {
                        className: "h-3.5 w-3.5 text-white"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/layout.tsx",
                        lineNumber: 670,
                        columnNumber: 306
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 670,
                    columnNumber: 190
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "truncate text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100",
                    children: project.name
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 670,
                    columnNumber: 363
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 670,
            columnNumber: 6
        }, this)
    }, project._id, false, {
        fileName: "[project]/src/app/(dashboard)/layout.tsx",
        lineNumber: 662,
        columnNumber: 10
    }, this);
}
function NavLink(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "b085312beab1a5cfd07438e9c018106dbde7dd56c72c55f89dca46f044c9c968") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b085312beab1a5cfd07438e9c018106dbde7dd56c72c55f89dca46f044c9c968";
    }
    const { href, icon: Icon, label } = t0;
    let t1;
    if ($[1] !== Icon) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
            className: "h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 687,
            columnNumber: 10
        }, this);
        $[1] = Icon;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== label) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: label
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 695,
            columnNumber: 10
        }, this);
        $[3] = label;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== href || $[6] !== t1 || $[7] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            className: "flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group",
            children: [
                t1,
                t2
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 703,
            columnNumber: 10
        }, this);
        $[5] = href;
        $[6] = t1;
        $[7] = t2;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    return t3;
}
_c1 = NavLink;
var _c, _c1;
__turbopack_context__.k.register(_c, "DashboardLayout");
__turbopack_context__.k.register(_c1, "NavLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_6e8e29aa._.js.map