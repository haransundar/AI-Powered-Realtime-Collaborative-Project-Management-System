import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { io, Socket } from 'socket.io-client';
import { api } from '@/lib/api';
import type { User, Organization, Project, Task, TaskStatus, Notification } from '@/types';

interface PendingUpdate {
  id: string;
  originalData: any;
  optimisticData: any;
  timestamp: number;
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  // Organizations
  organizations: Organization[];
  currentOrg: Organization | null;
  
  // Projects
  projects: Project[];
  currentProject: Project | null;
  
  // Tasks
  tasks: Task[];
  tasksByStatus: Record<TaskStatus, Task[]>;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Real-time
  socket: Socket | null;
  connectedUsers: User[];
  lockedTasks: Record<string, User>;
  
  // Optimistic updates
  pendingUpdates: Map<string, PendingUpdate>;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  
  setCurrentOrg: (org: Organization | null) => void;
  loadOrganizations: () => Promise<void>;
  createOrganization: (name: string) => Promise<Organization>;
  removeOrganization: (orgId: string) => void;
  
  setCurrentProject: (project: Project | null) => void;
  loadProjects: (orgId: string) => Promise<void>;
  createProject: (orgId: string, name: string, description?: string) => Promise<Project>;
  
  loadTasks: (projectId: string) => Promise<void>;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  
  loadNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => void;
  
  connectSocket: () => void;
  disconnectSocket: () => void;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
  
  applyOptimisticUpdate: (id: string, original: any, optimistic: any) => void;
  confirmUpdate: (id: string) => void;
  revertUpdate: (id: string) => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
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
      tasksByStatus: { backlog: [], todo: [], in_progress: [], review: [], done: [] },
      notifications: [],
      unreadCount: 0,
      socket: null,
      connectedUsers: [],
      lockedTasks: {},
      pendingUpdates: new Map(),

      // Auth actions
      login: async (email, password) => {
        const { user, access_token, refresh_token } = await api.login(email, password);
        api.setToken(access_token);
        set({ user, token: access_token, refreshToken: refresh_token, isAuthenticated: true });
        get().connectSocket();
      },

      register: async (email, password, name) => {
        const { user, access_token, refresh_token } = await api.register(email, password, name);
        api.setToken(access_token);
        set({ user, token: access_token, refreshToken: refresh_token, isAuthenticated: true });
        get().connectSocket();
      },

      logout: () => {
        api.setToken(null);
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
          tasksByStatus: { backlog: [], todo: [], in_progress: [], review: [], done: [] },
        });
      },

      loadUser: async () => {
        const { token } = get();
        if (!token) return;
        api.setToken(token);
        try {
          const { user } = await api.getMe();
          set({ user, isAuthenticated: true });
          get().connectSocket();
        } catch {
          get().logout();
        }
      },

      // Organization actions
      setCurrentOrg: (org) => set({ currentOrg: org, projects: [], currentProject: null }),

      loadOrganizations: async () => {
        try {
          const result = await api.getOrganizations();
          set({ organizations: result?.organizations || [] });
        } catch (error) {
          console.error('Failed to load organizations:', error);
          set({ organizations: [] });
        }
      },

      createOrganization: async (name) => {
        const result = await api.createOrganization(name);
        
        // Check if it's an error response (duplicate name)
        if (result.error) {
          const error = new Error(result.error.message || 'Failed to create organization') as any;
          error.code = result.error.code;
          error.suggestions = result.suggestions || [];
          error.reason = result.reason || '';
          throw error;
        }
        
        const organization = result.organization;
        if (organization) {
          set((state) => ({ organizations: [...state.organizations, organization] }));
        }
        return organization;
      },

      removeOrganization: (orgId) => {
        set((state) => {
          const newOrgs = state.organizations.filter((o) => o._id !== orgId);
          const newCurrentOrg = state.currentOrg?._id === orgId 
            ? (newOrgs.length > 0 ? newOrgs[0] : null)
            : state.currentOrg;
          return { 
            organizations: newOrgs, 
            currentOrg: newCurrentOrg,
            projects: newCurrentOrg?._id === state.currentOrg?._id ? state.projects : [],
            currentProject: newCurrentOrg?._id === state.currentOrg?._id ? state.currentProject : null
          };
        });
      },

      // Project actions
      setCurrentProject: (project) => set({ currentProject: project, tasks: [] }),

      loadProjects: async (orgId) => {
        const { projects } = await api.getProjects(orgId);
        set({ projects });
      },

      createProject: async (orgId, name, description) => {
        const { project } = await api.createProject(orgId, name, description);
        set((state) => ({ projects: [...state.projects, project] }));
        return project;
      },

      // Task actions
      loadTasks: async (projectId) => {
        const { tasks, tasks_by_status } = await api.getTasks(projectId);
        set({ tasks, tasksByStatus: tasks_by_status });
      },

      addTask: (task) => {
        set((state) => {
          // Check if task already exists to prevent duplicates
          if (state.tasks.some((t) => t._id === task._id)) {
            return state;
          }
          
          const newTasks = [...state.tasks, task];
          const newByStatus = { ...state.tasksByStatus };
          
          // Ensure we're adding to the correct status column
          Object.keys(newByStatus).forEach((status) => {
            newByStatus[status as TaskStatus] = newByStatus[status as TaskStatus].filter(
              (t) => t._id !== task._id
            );
          });
          
          newByStatus[task.status] = [...(newByStatus[task.status] || []), task];
          return { tasks: newTasks, tasksByStatus: newByStatus };
        });
      },

      updateTask: (taskId, updates) => {
        set((state) => {
          // Find the original task
          const originalTask = state.tasks.find((t) => t._id === taskId);
          if (!originalTask) return state;

          // Create updated task
          const updatedTask = { ...originalTask, ...updates };
          
          // Update tasks array
          const newTasks = state.tasks.map((t) =>
            t._id === taskId ? updatedTask : t
          );

          // Create new tasksByStatus - remove from ALL columns first to prevent duplicates
          const newByStatus: Record<TaskStatus, Task[]> = {
            backlog: [],
            todo: [],
            in_progress: [],
            review: [],
            done: [],
          };
          
          // Rebuild tasksByStatus from newTasks to ensure no duplicates
          newTasks.forEach((task) => {
            newByStatus[task.status].push(task);
          });

          return { tasks: newTasks, tasksByStatus: newByStatus };
        });
      },

      removeTask: (taskId) => {
        set((state) => {
          const newTasks = state.tasks.filter((t) => t._id !== taskId);
          const newByStatus = { ...state.tasksByStatus };
          Object.keys(newByStatus).forEach((status) => {
            newByStatus[status as TaskStatus] = newByStatus[status as TaskStatus].filter(
              (t) => t._id !== taskId
            );
          });
          return { tasks: newTasks, tasksByStatus: newByStatus };
        });
      },

      moveTask: async (taskId, newStatus) => {
        const task = get().tasks.find((t) => t._id === taskId);
        if (!task) return;

        // Optimistic update
        get().applyOptimisticUpdate(taskId, task, { ...task, status: newStatus });
        get().updateTask(taskId, { status: newStatus });

        try {
          await api.updateTaskStatus(taskId, newStatus);
          get().confirmUpdate(taskId);
        } catch (error) {
          get().revertUpdate(taskId);
          throw error;
        }
      },

      // Notification actions
      loadNotifications: async () => {
        const { notifications, unread_count } = await api.getNotifications();
        set({ notifications, unreadCount: unread_count });
      },

      markNotificationRead: (id) => {
        api.markNotificationRead(id);
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n._id === id ? { ...n, is_read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      // Socket actions
      connectSocket: () => {
        const { token, socket: existingSocket } = get();
        if (!token || existingSocket?.connected) return;

        const socket = io(SOCKET_URL, { transports: ['websocket'] });

        socket.on('connect', () => {
          socket.emit('authenticate', { token });
        });

        socket.on('authenticated', () => {
          console.log('Socket authenticated');
        });

        socket.on('task_created', ({ task }) => {
          get().addTask(task);
        });

        socket.on('task_updated', ({ task }) => {
          get().updateTask(task._id, task);
        });

        socket.on('task_deleted', ({ task_id }) => {
          get().removeTask(task_id);
        });

        socket.on('task_locked', ({ task_id, user }) => {
          set((state) => ({
            lockedTasks: { ...state.lockedTasks, [task_id]: user },
          }));
        });

        socket.on('task_unlocked', ({ task_id }) => {
          set((state) => {
            const newLocked = { ...state.lockedTasks };
            delete newLocked[task_id];
            return { lockedTasks: newLocked };
          });
        });

        socket.on('user_joined', ({ user }) => {
          set((state) => ({
            connectedUsers: [...state.connectedUsers.filter((u) => u._id !== user._id), user],
          }));
        });

        socket.on('user_left', ({ user }) => {
          set((state) => ({
            connectedUsers: state.connectedUsers.filter((u) => u._id !== user._id),
          }));
        });

        set({ socket });
      },

      disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
          socket.disconnect();
          set({ socket: null, connectedUsers: [], lockedTasks: {} });
        }
      },

      joinProject: (projectId) => {
        const { socket } = get();
        if (socket?.connected) {
          socket.emit('join_project', { project_id: projectId });
        }
      },

      leaveProject: (projectId) => {
        const { socket } = get();
        if (socket?.connected) {
          socket.emit('leave_project', { project_id: projectId });
        }
      },

      // Optimistic update actions
      applyOptimisticUpdate: (id, original, optimistic) => {
        set((state) => {
          const newPending = new Map(state.pendingUpdates);
          newPending.set(id, {
            id,
            originalData: original,
            optimisticData: optimistic,
            timestamp: Date.now(),
          });
          return { pendingUpdates: newPending };
        });
      },

      confirmUpdate: (id) => {
        set((state) => {
          const newPending = new Map(state.pendingUpdates);
          newPending.delete(id);
          return { pendingUpdates: newPending };
        });
      },

      revertUpdate: (id) => {
        const pending = get().pendingUpdates.get(id);
        if (pending) {
          get().updateTask(id, pending.originalData);
        }
        get().confirmUpdate(id);
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        currentOrg: state.currentOrg,
      }),
    }
  )
);
