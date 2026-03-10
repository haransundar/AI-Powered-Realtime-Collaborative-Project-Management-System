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
"[project]/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, type, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 11,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = "Input";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-100", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-slate-600 dark:text-slate-400", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = "CardContent";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(auth)/register/page.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/src/app/(auth)/register/page.tsx'\n\nExpected '</', got 'className'");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
]);

//# sourceMappingURL=src_f2f8ca6d._.js.map