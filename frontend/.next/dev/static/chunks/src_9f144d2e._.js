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
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
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
const fadeInUp = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0
    },
    transition: {
        duration: 0.5
    }
};
const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};
const featureCardVariants = {
    initial: {
        opacity: 0,
        y: 30
    },
    animate: {
        opacity: 1,
        y: 0
    },
    hover: {
        y: -8,
        transition: {
            duration: 0.3
        }
    }
};
function Home() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(81);
    if ($[0] !== "01ce86c04904660186e97a47053c9ac75446fd3be208fd1fce6af430b140c4de") {
        for(let $i = 0; $i < 81; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "01ce86c04904660186e97a47053c9ac75446fd3be208fd1fce6af430b140c4de";
    }
    const { isAuthenticated, loadUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    let t0;
    let t1;
    if ($[1] !== loadUser) {
        t0 = ({
            "Home[useEffect()]": ()=>{
                loadUser();
            }
        })["Home[useEffect()]"];
        t1 = [
            loadUser
        ];
        $[1] = loadUser;
        $[2] = t0;
        $[3] = t1;
    } else {
        t0 = $[2];
        t1 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    let t2;
    let t3;
    if ($[4] !== isAuthenticated || $[5] !== router) {
        t2 = ({
            "Home[useEffect()]": ()=>{
                if (isAuthenticated) {
                    router.push("/dashboard");
                }
            }
        })["Home[useEffect()]"];
        t3 = [
            isAuthenticated,
            router
        ];
        $[4] = isAuthenticated;
        $[5] = router;
        $[6] = t2;
        $[7] = t3;
    } else {
        t2 = $[6];
        t3 = $[7];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t2, t3);
    let t4;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = [
            {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"],
                title: "Multi-Tenant Architecture",
                description: "Isolated workspaces for each organization with enterprise-grade row-level security",
                gradient: "from-slate-500 to-slate-700",
                bgGradient: "from-slate-50 to-slate-100"
            },
            {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
                title: "Real-Time Collaboration",
                description: "See changes instantly with WebSocket-powered live updates and presence indicators",
                gradient: "from-emerald-500 to-teal-600",
                bgGradient: "from-emerald-50 to-teal-50"
            },
            {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
                title: "AI-Powered Intelligence",
                description: "Natural language task creation and smart scheduling powered by advanced AI",
                gradient: "from-violet-500 to-purple-600",
                bgGradient: "from-violet-50 to-purple-50"
            },
            {
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
                title: "Fine-Grained Permissions",
                description: "Organization, project, and task-level access control for complete security",
                gradient: "from-amber-500 to-orange-600",
                bgGradient: "from-amber-50 to-orange-50"
            }
        ];
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    const features = t4;
    let t5;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = [
            "Unlimited projects and tasks",
            "Real-time collaboration",
            "AI-powered suggestions",
            "Advanced analytics",
            "Priority support",
            "Custom integrations"
        ];
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    const benefits = t5;
    let t6;
    let t7;
    let t8;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = {
            opacity: 0,
            y: -20
        };
        t7 = {
            opacity: 1,
            y: 0
        };
        t8 = {
            duration: 0.5
        };
        $[10] = t6;
        $[11] = t7;
        $[12] = t8;
    } else {
        t6 = $[10];
        t7 = $[11];
        t8 = $[12];
    }
    let t9;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = {
            scale: 1.02
        };
        $[13] = t9;
    } else {
        t9 = $[13];
    }
    let t10;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            className: "flex items-center gap-2",
            whileHover: t9,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                        className: "h-5 w-5 text-white"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 170,
                        columnNumber: 192
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 170,
                    columnNumber: 75
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent",
                    children: "AI Project Manager"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 170,
                    columnNumber: 241
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 170,
            columnNumber: 11
        }, this);
        $[14] = t10;
    } else {
        t10 = $[14];
    }
    let t11;
    if ($[15] !== router) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "ghost",
            onClick: {
                "Home[<Button>.onClick]": ()=>router.push("/login")
            }["Home[<Button>.onClick]"],
            className: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
            children: "Sign In"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 177,
            columnNumber: 11
        }, this);
        $[15] = router;
        $[16] = t11;
    } else {
        t11 = $[16];
    }
    let t12;
    let t13;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = {
            scale: 1.02
        };
        t13 = {
            scale: 0.98
        };
        $[17] = t12;
        $[18] = t13;
    } else {
        t12 = $[17];
        t13 = $[18];
    }
    let t14;
    if ($[19] !== router) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            whileHover: t12,
            whileTap: t13,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                onClick: {
                    "Home[<Button>.onClick]": ()=>router.push("/register")
                }["Home[<Button>.onClick]"],
                className: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25",
                children: "Get Started Free"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 202,
                columnNumber: 55
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 202,
            columnNumber: 11
        }, this);
        $[19] = router;
        $[20] = t14;
    } else {
        t14 = $[20];
    }
    let t15;
    if ($[21] !== t11 || $[22] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].header, {
            initial: t6,
            animate: t7,
            transition: t8,
            className: "border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4 py-4 flex items-center justify-between",
                children: [
                    t10,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3",
                        children: [
                            t11,
                            t14
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 212,
                        columnNumber: 240
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 212,
                columnNumber: 156
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 212,
            columnNumber: 11
        }, this);
        $[21] = t11;
        $[22] = t14;
        $[23] = t15;
    } else {
        t15 = $[23];
    }
    let t16;
    if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 221,
            columnNumber: 11
        }, this);
        $[24] = t16;
    } else {
        t16 = $[24];
    }
    let t17;
    if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 -z-10",
            children: [
                t16,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bottom-0 right-1/4 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse",
                    style: {
                        animationDelay: "1s"
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 228,
                    columnNumber: 56
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 228,
            columnNumber: 11
        }, this);
        $[25] = t17;
    } else {
        t17 = $[25];
    }
    let t18;
    let t19;
    let t20;
    if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = {
            opacity: 0,
            y: 30
        };
        t19 = {
            opacity: 1,
            y: 0
        };
        t20 = {
            duration: 0.6
        };
        $[26] = t18;
        $[27] = t19;
        $[28] = t20;
    } else {
        t18 = $[26];
        t19 = $[27];
        t20 = $[28];
    }
    let t21;
    if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: t18,
            animate: t19,
            transition: t20,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 260,
                        columnNumber: 194
                    }, this),
                    "Powered by Advanced AI"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 260,
                columnNumber: 68
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 260,
            columnNumber: 11
        }, this);
        $[29] = t21;
    } else {
        t21 = $[29];
    }
    let t22;
    let t23;
    let t24;
    if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
        t22 = {
            opacity: 0,
            y: 30
        };
        t23 = {
            opacity: 1,
            y: 0
        };
        t24 = {
            duration: 0.6,
            delay: 0.1
        };
        $[30] = t22;
        $[31] = t23;
        $[32] = t24;
    } else {
        t22 = $[30];
        t23 = $[31];
        t24 = $[32];
    }
    let t25;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h2, {
            initial: t22,
            animate: t23,
            transition: t24,
            className: "text-4xl md:text-6xl font-bold mb-6 text-slate-900 leading-tight",
            children: [
                "Project Management",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 291,
                    columnNumber: 162
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent",
                    children: "Reimagined with AI"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 291,
                    columnNumber: 168
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 291,
            columnNumber: 11
        }, this);
        $[33] = t25;
    } else {
        t25 = $[33];
    }
    let t26;
    if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
            initial: {
                opacity: 0,
                y: 30
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                duration: 0.6,
                delay: 0.2
            },
            className: "text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed",
            children: "Collaborate in real-time with your team. Create tasks using natural language. Get AI-powered suggestions for scheduling and prioritization."
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 298,
            columnNumber: 11
        }, this);
        $[34] = t26;
    } else {
        t26 = $[34];
    }
    let t27;
    let t28;
    let t29;
    if ($[35] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = {
            opacity: 0,
            y: 30
        };
        t28 = {
            opacity: 1,
            y: 0
        };
        t29 = {
            duration: 0.6,
            delay: 0.3
        };
        $[35] = t27;
        $[36] = t28;
        $[37] = t29;
    } else {
        t27 = $[35];
        t28 = $[36];
        t29 = $[37];
    }
    let t30;
    let t31;
    if ($[38] === Symbol.for("react.memo_cache_sentinel")) {
        t30 = {
            scale: 1.02
        };
        t31 = {
            scale: 0.98
        };
        $[38] = t30;
        $[39] = t31;
    } else {
        t30 = $[38];
        t31 = $[39];
    }
    let t32;
    if ($[40] !== router) {
        t32 = ({
            "Home[<Button>.onClick]": ()=>router.push("/register")
        })["Home[<Button>.onClick]"];
        $[40] = router;
        $[41] = t32;
    } else {
        t32 = $[41];
    }
    let t33;
    if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
            className: "ml-2 h-5 w-5"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 363,
            columnNumber: 11
        }, this);
        $[42] = t33;
    } else {
        t33 = $[42];
    }
    let t34;
    if ($[43] !== t32) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            whileHover: t30,
            whileTap: t31,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                size: "lg",
                onClick: t32,
                className: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/30 px-8 h-12 text-base",
                children: [
                    "Start Free Trial",
                    t33
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 370,
                columnNumber: 55
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 370,
            columnNumber: 11
        }, this);
        $[43] = t32;
        $[44] = t34;
    } else {
        t34 = $[44];
    }
    let t35;
    let t36;
    if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
        t35 = {
            scale: 1.02
        };
        t36 = {
            scale: 0.98
        };
        $[45] = t35;
        $[46] = t36;
    } else {
        t35 = $[45];
        t36 = $[46];
    }
    let t37;
    if ($[47] !== router) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            whileHover: t35,
            whileTap: t36,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                size: "lg",
                variant: "outline",
                onClick: {
                    "Home[<Button>.onClick]": ()=>router.push("/login")
                }["Home[<Button>.onClick]"],
                className: "border-slate-300 text-slate-700 hover:bg-slate-50 px-8 h-12 text-base",
                children: "Watch Demo"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 393,
                columnNumber: 55
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 393,
            columnNumber: 11
        }, this);
        $[47] = router;
        $[48] = t37;
    } else {
        t37 = $[48];
    }
    let t38;
    if ($[49] !== t34 || $[50] !== t37) {
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-20 md:py-32 relative overflow-hidden",
            children: [
                t17,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 text-center",
                    children: [
                        t21,
                        t25,
                        t26,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: t27,
                            animate: t28,
                            transition: t29,
                            className: "flex flex-col sm:flex-row gap-4 justify-center",
                            children: [
                                t34,
                                t37
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 403,
                            columnNumber: 144
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 403,
                    columnNumber: 77
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 403,
            columnNumber: 11
        }, this);
        $[49] = t34;
        $[50] = t37;
        $[51] = t38;
    } else {
        t38 = $[51];
    }
    let t39;
    let t40;
    let t41;
    let t42;
    if ($[52] === Symbol.for("react.memo_cache_sentinel")) {
        t39 = {
            opacity: 0,
            y: 20
        };
        t40 = {
            opacity: 1,
            y: 0
        };
        t41 = {
            once: true
        };
        t42 = {
            duration: 0.5
        };
        $[52] = t39;
        $[53] = t40;
        $[54] = t41;
        $[55] = t42;
    } else {
        t39 = $[52];
        t40 = $[53];
        t41 = $[54];
        t42 = $[55];
    }
    let t43;
    if ($[56] === Symbol.for("react.memo_cache_sentinel")) {
        t43 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: t39,
            whileInView: t40,
            viewport: t41,
            transition: t42,
            className: "text-center mb-16",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-3xl md:text-4xl font-bold text-slate-900 mb-4",
                    children: "Everything you need to succeed"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 441,
                    columnNumber: 117
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-lg text-slate-600 max-w-2xl mx-auto",
                    children: "Powerful features designed to help your team collaborate effectively and deliver projects on time."
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 441,
                    columnNumber: 219
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 441,
            columnNumber: 11
        }, this);
        $[56] = t43;
    } else {
        t43 = $[56];
    }
    let t44;
    if ($[57] === Symbol.for("react.memo_cache_sentinel")) {
        t44 = {
            once: true
        };
        $[57] = t44;
    } else {
        t44 = $[57];
    }
    let t45;
    if ($[58] === Symbol.for("react.memo_cache_sentinel")) {
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-20 bg-white",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4",
                children: [
                    t43,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        variants: staggerContainer,
                        initial: "initial",
                        whileInView: "animate",
                        viewport: t44,
                        className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6",
                        children: features.map(_HomeFeaturesMap)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 457,
                        columnNumber: 92
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 457,
                columnNumber: 47
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 457,
            columnNumber: 11
        }, this);
        $[58] = t45;
    } else {
        t45 = $[58];
    }
    let t46;
    if ($[59] === Symbol.for("react.memo_cache_sentinel")) {
        t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 opacity-10",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0",
                style: {
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
                }
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 464,
                columnNumber: 56
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 464,
            columnNumber: 11
        }, this);
        $[59] = t46;
    } else {
        t46 = $[59];
    }
    let t47;
    let t48;
    let t49;
    let t50;
    let t51;
    let t52;
    if ($[60] === Symbol.for("react.memo_cache_sentinel")) {
        t47 = {
            opacity: 0,
            y: 20
        };
        t48 = {
            opacity: 1,
            y: 0
        };
        t49 = {
            once: true
        };
        t50 = {
            duration: 0.5
        };
        t51 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-3xl md:text-4xl font-bold mb-4 text-white",
            children: "Ready to transform your workflow?"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 492,
            columnNumber: 11
        }, this);
        t52 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-indigo-100 mb-8 text-lg max-w-xl mx-auto",
            children: "Join thousands of teams already using AI Project Manager to deliver better results."
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 493,
            columnNumber: 11
        }, this);
        $[60] = t47;
        $[61] = t48;
        $[62] = t49;
        $[63] = t50;
        $[64] = t51;
        $[65] = t52;
    } else {
        t47 = $[60];
        t48 = $[61];
        t49 = $[62];
        t50 = $[63];
        t51 = $[64];
        t52 = $[65];
    }
    let t53;
    if ($[66] === Symbol.for("react.memo_cache_sentinel")) {
        t53 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap justify-center gap-4 mb-10",
            children: benefits.map(_HomeBenefitsMap)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 510,
            columnNumber: 11
        }, this);
        $[66] = t53;
    } else {
        t53 = $[66];
    }
    let t54;
    let t55;
    if ($[67] === Symbol.for("react.memo_cache_sentinel")) {
        t54 = {
            scale: 1.02
        };
        t55 = {
            scale: 0.98
        };
        $[67] = t54;
        $[68] = t55;
    } else {
        t54 = $[67];
        t55 = $[68];
    }
    let t56;
    if ($[69] !== router) {
        t56 = ({
            "Home[<Button>.onClick]": ()=>router.push("/register")
        })["Home[<Button>.onClick]"];
        $[69] = router;
        $[70] = t56;
    } else {
        t56 = $[70];
    }
    let t57;
    if ($[71] === Symbol.for("react.memo_cache_sentinel")) {
        t57 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
            className: "ml-2 h-5 w-5"
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 542,
            columnNumber: 11
        }, this);
        $[71] = t57;
    } else {
        t57 = $[71];
    }
    let t58;
    if ($[72] !== t56) {
        t58 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "py-20 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden",
            children: [
                t46,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 text-center relative",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: t47,
                        whileInView: t48,
                        viewport: t49,
                        transition: t50,
                        children: [
                            t51,
                            t52,
                            t53,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                whileHover: t54,
                                whileTap: t55,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    size: "lg",
                                    onClick: t56,
                                    className: "bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl px-8 h-12 text-base font-semibold",
                                    children: [
                                        "Create Free Account",
                                        t57
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 549,
                                    columnNumber: 327
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 549,
                                columnNumber: 283
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 549,
                        columnNumber: 192
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 549,
                    columnNumber: 131
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 549,
            columnNumber: 11
        }, this);
        $[72] = t56;
        $[73] = t58;
    } else {
        t58 = $[73];
    }
    let t59;
    if ($[74] !== t38 || $[75] !== t58) {
        t59 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "flex-1",
            children: [
                t38,
                t45,
                t58
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 557,
            columnNumber: 11
        }, this);
        $[74] = t38;
        $[75] = t58;
        $[76] = t59;
    } else {
        t59 = $[76];
    }
    let t60;
    if ($[77] === Symbol.for("react.memo_cache_sentinel")) {
        t60 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
            className: "border-t border-slate-200 py-8 bg-white",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center gap-2 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "h-4 w-4 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 566,
                                    columnNumber: 301
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 566,
                                columnNumber: 184
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold text-slate-900",
                                children: "AI Project Manager"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 566,
                                columnNumber: 350
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 566,
                        columnNumber: 123
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-500",
                        children: "© 2024 AI Project Management System. All rights reserved."
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 566,
                        columnNumber: 428
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 566,
                columnNumber: 71
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 566,
            columnNumber: 11
        }, this);
        $[77] = t60;
    } else {
        t60 = $[77];
    }
    let t61;
    if ($[78] !== t15 || $[79] !== t59) {
        t61 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white",
            children: [
                t15,
                t59,
                t60
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 573,
            columnNumber: 11
        }, this);
        $[78] = t15;
        $[79] = t59;
        $[80] = t61;
    } else {
        t61 = $[80];
    }
    return t61;
}
_s(Home, "4haFbKFgO7uOtucNYqeGh7o/vv0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Home;
function _HomeBenefitsMap(benefit, index_0) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            scale: 0.8
        },
        whileInView: {
            opacity: 1,
            scale: 1
        },
        viewport: {
            once: true
        },
        transition: {
            duration: 0.3,
            delay: index_0 * 0.05
        },
        className: "flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                className: "h-4 w-4 text-emerald-300"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 594,
                columnNumber: 113
            }, this),
            benefit
        ]
    }, benefit, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 583,
        columnNumber: 10
    }, this);
}
function _HomeFeaturesMap(feature, index) {
    const Icon = feature.icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        variants: featureCardVariants,
        whileHover: "hover",
        transition: {
            duration: 0.4,
            delay: index * 0.1
        },
        className: `p-6 rounded-2xl bg-gradient-to-br ${feature.bgGradient} border border-slate-200/50 cursor-pointer group`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: "h-7 w-7 text-white"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 601,
                    columnNumber: 306
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 601,
                columnNumber: 124
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "font-semibold text-lg mb-2 text-slate-900",
                children: feature.title
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 601,
                columnNumber: 351
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-slate-600 leading-relaxed",
                children: feature.description
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 601,
                columnNumber: 429
            }, this)
        ]
    }, feature.title, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 598,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_9f144d2e._.js.map