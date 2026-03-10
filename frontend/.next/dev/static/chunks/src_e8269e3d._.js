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
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-blue-600 text-white shadow hover:bg-blue-700",
            destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
            outline: "border border-gray-300 bg-white shadow-sm hover:bg-gray-50",
            secondary: "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200",
            ghost: "hover:bg-gray-100",
            link: "text-blue-600 underline-offset-4 hover:underline"
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
function DashboardLayout(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(98);
    if ($[0] !== "1380c5dddfb87bca02dc3896101846dc52f4aa74dd037ac147cf88fee5c4c3a2") {
        for(let $i = 0; $i < 98; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1380c5dddfb87bca02dc3896101846dc52f4aa74dd037ac147cf88fee5c4c3a2";
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
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 border-b border-gray-200",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/dashboard",
                className: "text-xl font-bold text-blue-600",
                children: "AI PM"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 142,
                columnNumber: 57
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 142,
            columnNumber: 11
        }, this);
        $[22] = t10;
    } else {
        t10 = $[22];
    }
    let t11;
    if ($[23] !== showOrgDropdown) {
        t11 = ({
            "DashboardLayout[<button>.onClick]": ()=>setShowOrgDropdown(!showOrgDropdown)
        })["DashboardLayout[<button>.onClick]"];
        $[23] = showOrgDropdown;
        $[24] = t11;
    } else {
        t11 = $[24];
    }
    let t12;
    if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
            className: "h-4 w-4 text-gray-600"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 159,
            columnNumber: 11
        }, this);
        $[25] = t12;
    } else {
        t12 = $[25];
    }
    const t13 = currentOrg?.name || "Select Organization";
    let t14;
    if ($[26] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: [
                t12,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm font-medium text-gray-900 truncate",
                    children: t13
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 167,
                    columnNumber: 57
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 167,
            columnNumber: 11
        }, this);
        $[26] = t13;
        $[27] = t14;
    } else {
        t14 = $[27];
    }
    let t15;
    if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "h-4 w-4 text-gray-500"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 175,
            columnNumber: 11
        }, this);
        $[28] = t15;
    } else {
        t15 = $[28];
    }
    let t16;
    if ($[29] !== t11 || $[30] !== t14) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t11,
            className: "w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors",
            children: [
                t14,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 182,
            columnNumber: 11
        }, this);
        $[29] = t11;
        $[30] = t14;
        $[31] = t16;
    } else {
        t16 = $[31];
    }
    let t17;
    if ($[32] !== organizations || $[33] !== setCurrentOrg || $[34] !== showOrgDropdown) {
        t17 = showOrgDropdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10",
            children: [
                organizations && organizations.map({
                    "DashboardLayout[organizations.map()]": (org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "DashboardLayout[organizations.map() > <button>.onClick]": ()=>{
                                    setCurrentOrg(org);
                                    setShowOrgDropdown(false);
                                }
                            }["DashboardLayout[organizations.map() > <button>.onClick]"],
                            className: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg",
                            children: org.name
                        }, org._id, false, {
                            fileName: "[project]/src/app/(dashboard)/layout.tsx",
                            lineNumber: 192,
                            columnNumber: 56
                        }, this)
                }["DashboardLayout[organizations.map()]"]),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/dashboard/organizations/new",
                    className: "flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-200 last:rounded-b-lg",
                    onClick: {
                        "DashboardLayout[<Link>.onClick]": ()=>setShowOrgDropdown(false)
                    }["DashboardLayout[<Link>.onClick]"],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/layout.tsx",
                            lineNumber: 200,
                            columnNumber: 45
                        }, this),
                        " New Organization"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 198,
                    columnNumber: 50
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 191,
            columnNumber: 30
        }, this);
        $[32] = organizations;
        $[33] = setCurrentOrg;
        $[34] = showOrgDropdown;
        $[35] = t17;
    } else {
        t17 = $[35];
    }
    let t18;
    if ($[36] !== t16 || $[37] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 border-b border-gray-200",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    t16,
                    t17
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 210,
                columnNumber: 57
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 210,
            columnNumber: 11
        }, this);
        $[36] = t16;
        $[37] = t17;
        $[38] = t18;
    } else {
        t18 = $[38];
    }
    let t19;
    if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/dashboard",
            className: "flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                    className: "h-4 w-4 text-gray-500"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 219,
                    columnNumber: 150
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-gray-900",
                    children: "Dashboard"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 219,
                    columnNumber: 197
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 219,
            columnNumber: 11
        }, this);
        $[39] = t19;
    } else {
        t19 = $[39];
    }
    let t20;
    if ($[40] !== currentOrg) {
        t20 = currentOrg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/dashboard/organizations/${currentOrg._id}/members`,
                    className: "flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                            className: "h-4 w-4 text-gray-500"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/layout.tsx",
                            lineNumber: 226,
                            columnNumber: 208
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-900",
                            children: "Members"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/layout.tsx",
                            lineNumber: 226,
                            columnNumber: 251
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 226,
                    columnNumber: 27
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/dashboard/organizations/${currentOrg._id}/settings`,
                    className: "flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                            className: "h-4 w-4 text-gray-500"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/layout.tsx",
                            lineNumber: 226,
                            columnNumber: 486
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-900",
                            children: "Settings"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(dashboard)/layout.tsx",
                            lineNumber: 226,
                            columnNumber: 532
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 226,
                    columnNumber: 304
                }, this)
            ]
        }, void 0, true);
        $[40] = currentOrg;
        $[41] = t20;
    } else {
        t20 = $[41];
    }
    let t21;
    if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-xs font-semibold text-gray-500 uppercase tracking-wider",
            children: "Projects"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 234,
            columnNumber: 11
        }, this);
        $[42] = t21;
    } else {
        t21 = $[42];
    }
    let t22;
    if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between px-3 py-2",
            children: [
                t21,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/dashboard/projects/new",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                        className: "h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/layout.tsx",
                        lineNumber: 241,
                        columnNumber: 114
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 241,
                    columnNumber: 77
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 241,
            columnNumber: 11
        }, this);
        $[43] = t22;
    } else {
        t22 = $[43];
    }
    let t23;
    if ($[44] !== projects) {
        t23 = projects.map(_DashboardLayoutProjectsMap);
        $[44] = projects;
        $[45] = t23;
    } else {
        t23 = $[45];
    }
    let t24;
    if ($[46] !== projects.length) {
        t24 = projects.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "px-3 py-2 text-xs text-gray-400",
            children: "No projects yet"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 256,
            columnNumber: 36
        }, this);
        $[46] = projects.length;
        $[47] = t24;
    } else {
        t24 = $[47];
    }
    let t25;
    if ($[48] !== t23 || $[49] !== t24) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "pt-4",
            children: [
                t22,
                t23,
                t24
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 264,
            columnNumber: 11
        }, this);
        $[48] = t23;
        $[49] = t24;
        $[50] = t25;
    } else {
        t25 = $[50];
    }
    let t26;
    if ($[51] !== t20 || $[52] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "flex-1 p-4 space-y-1",
            children: [
                t19,
                t20,
                t25
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 273,
            columnNumber: 11
        }, this);
        $[51] = t20;
        $[52] = t25;
        $[53] = t26;
    } else {
        t26 = $[53];
    }
    let t27;
    if ($[54] !== user?.name) {
        t27 = user?.name?.charAt(0).toUpperCase();
        $[54] = user?.name;
        $[55] = t27;
    } else {
        t27 = $[55];
    }
    let t28;
    if ($[56] !== t27) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium",
            children: t27
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 290,
            columnNumber: 11
        }, this);
        $[56] = t27;
        $[57] = t28;
    } else {
        t28 = $[57];
    }
    const t29 = user?.name;
    let t30;
    if ($[58] !== t29) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm font-medium text-gray-900 truncate",
            children: t29
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 299,
            columnNumber: 11
        }, this);
        $[58] = t29;
        $[59] = t30;
    } else {
        t30 = $[59];
    }
    const t31 = user?.email;
    let t32;
    if ($[60] !== t31) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-xs text-gray-500 truncate",
            children: t31
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 308,
            columnNumber: 11
        }, this);
        $[60] = t31;
        $[61] = t32;
    } else {
        t32 = $[61];
    }
    let t33;
    if ($[62] !== t30 || $[63] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 min-w-0",
            children: [
                t30,
                t32
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 316,
            columnNumber: 11
        }, this);
        $[62] = t30;
        $[63] = t32;
        $[64] = t33;
    } else {
        t33 = $[64];
    }
    let t34;
    if ($[65] === Symbol.for("react.memo_cache_sentinel")) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 325,
            columnNumber: 11
        }, this);
        $[65] = t34;
    } else {
        t34 = $[65];
    }
    let t35;
    if ($[66] !== handleLogout) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "ghost",
            size: "icon",
            onClick: handleLogout,
            className: "text-gray-500 hover:text-gray-700",
            children: t34
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 332,
            columnNumber: 11
        }, this);
        $[66] = handleLogout;
        $[67] = t35;
    } else {
        t35 = $[67];
    }
    let t36;
    if ($[68] !== t28 || $[69] !== t33 || $[70] !== t35) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 border-t border-gray-200",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    t28,
                    t33,
                    t35
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 340,
                columnNumber: 57
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 340,
            columnNumber: 11
        }, this);
        $[68] = t28;
        $[69] = t33;
        $[70] = t35;
        $[71] = t36;
    } else {
        t36 = $[71];
    }
    let t37;
    if ($[72] !== t18 || $[73] !== t26 || $[74] !== t36) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: "w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm",
            children: [
                t10,
                t18,
                t26,
                t36
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 350,
            columnNumber: 11
        }, this);
        $[72] = t18;
        $[73] = t26;
        $[74] = t36;
        $[75] = t37;
    } else {
        t37 = $[75];
    }
    let t38;
    if ($[76] !== showNotifications) {
        t38 = ({
            "DashboardLayout[<Button>.onClick]": ()=>setShowNotifications(!showNotifications)
        })["DashboardLayout[<Button>.onClick]"];
        $[76] = showNotifications;
        $[77] = t38;
    } else {
        t38 = $[77];
    }
    let t39;
    if ($[78] === Symbol.for("react.memo_cache_sentinel")) {
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
            className: "h-5 w-5"
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 370,
            columnNumber: 11
        }, this);
        $[78] = t39;
    } else {
        t39 = $[78];
    }
    let t40;
    if ($[79] !== unreadCount) {
        t40 = unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium",
            children: unreadCount
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 377,
            columnNumber: 30
        }, this);
        $[79] = unreadCount;
        $[80] = t40;
    } else {
        t40 = $[80];
    }
    let t41;
    if ($[81] !== t38 || $[82] !== t40) {
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "ghost",
            size: "icon",
            onClick: t38,
            className: "text-gray-600 hover:text-gray-900",
            children: [
                t39,
                t40
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 385,
            columnNumber: 11
        }, this);
        $[81] = t38;
        $[82] = t40;
        $[83] = t41;
    } else {
        t41 = $[83];
    }
    let t42;
    if ($[84] !== notifications || $[85] !== showNotifications) {
        t42 = showNotifications && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 border-b border-gray-200 font-medium text-gray-900",
                    children: "Notifications"
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 394,
                    columnNumber: 143
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-h-96 overflow-y-auto",
                    children: notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "p-4 text-sm text-gray-500 text-center",
                        children: "No notifications"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(dashboard)/layout.tsx",
                        lineNumber: 394,
                        columnNumber: 306
                    }, this) : notifications.slice(0, 10).map(_DashboardLayoutAnonymous)
                }, void 0, false, {
                    fileName: "[project]/src/app/(dashboard)/layout.tsx",
                    lineNumber: 394,
                    columnNumber: 234
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 394,
            columnNumber: 32
        }, this);
        $[84] = notifications;
        $[85] = showNotifications;
        $[86] = t42;
    } else {
        t42 = $[86];
    }
    let t43;
    if ($[87] !== t41 || $[88] !== t42) {
        t43 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
            className: "h-14 border-b border-gray-200 bg-white flex items-center justify-end px-4 gap-2 shadow-sm",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    t41,
                    t42
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 403,
                columnNumber: 121
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 403,
            columnNumber: 11
        }, this);
        $[87] = t41;
        $[88] = t42;
        $[89] = t43;
    } else {
        t43 = $[89];
    }
    let t44;
    if ($[90] !== children) {
        t44 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "flex-1 overflow-auto p-6 bg-gray-50",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 412,
            columnNumber: 11
        }, this);
        $[90] = children;
        $[91] = t44;
    } else {
        t44 = $[91];
    }
    let t45;
    if ($[92] !== t43 || $[93] !== t44) {
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 flex flex-col",
            children: [
                t43,
                t44
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 420,
            columnNumber: 11
        }, this);
        $[92] = t43;
        $[93] = t44;
        $[94] = t45;
    } else {
        t45 = $[94];
    }
    let t46;
    if ($[95] !== t37 || $[96] !== t45) {
        t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex bg-gray-50",
            children: [
                t37,
                t45
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(dashboard)/layout.tsx",
            lineNumber: 429,
            columnNumber: 11
        }, this);
        $[95] = t37;
        $[96] = t45;
        $[97] = t46;
    } else {
        t46 = $[97];
    }
    return t46;
}
_s(DashboardLayout, "a/EriqQx10D0P2p+TWO1orxlMlY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"]
    ];
});
_c = DashboardLayout;
function _DashboardLayoutAnonymous(n) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `p-3 border-b border-gray-100 text-sm ${!n.is_read ? "bg-blue-50" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-medium text-gray-900",
                children: n.title
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 439,
                columnNumber: 112
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-600",
                children: n.message
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 439,
                columnNumber: 166
            }, this)
        ]
    }, n._id, true, {
        fileName: "[project]/src/app/(dashboard)/layout.tsx",
        lineNumber: 439,
        columnNumber: 10
    }, this);
}
function _DashboardLayoutProjectsMap(project) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: `/dashboard/projects/${project._id}`,
        className: "flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__["FolderKanban"], {
                className: "h-4 w-4 text-gray-500"
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 442,
                columnNumber: 179
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "truncate text-gray-900",
                children: project.name
            }, void 0, false, {
                fileName: "[project]/src/app/(dashboard)/layout.tsx",
                lineNumber: 442,
                columnNumber: 229
            }, this)
        ]
    }, project._id, true, {
        fileName: "[project]/src/app/(dashboard)/layout.tsx",
        lineNumber: 442,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "DashboardLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_e8269e3d._.js.map