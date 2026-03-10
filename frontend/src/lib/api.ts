const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Request failed');
    }

    return data;
  }

  // Auth
  async sendOtp(email: string) {
    return this.request<{ message: string; email: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOtp(email: string, otp: string) {
    return this.request<{ message: string; verified: boolean }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async resendOtp(email: string) {
    return this.request<{ message: string }>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.request<{ user: any; access_token: string; refresh_token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ user: any; access_token: string; refresh_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me');
  }

  // Organizations
  async checkOrganizationName(name: string) {
    return this.request<{ 
      available: boolean; 
      message: string; 
      suggestions: string[]; 
      reason: string 
    }>('/organizations/check-name', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async createOrganization(name: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/organizations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name }),
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
    return this.request<{ organizations: any[] }>('/organizations');
  }

  async getOrganization(orgId: string) {
    return this.request<{ organization: any }>(`/organizations/${orgId}`);
  }

  async inviteMember(orgId: string, email: string, role: string) {
    return this.request<{ membership: any }>(`/organizations/${orgId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  }

  async updateMemberRole(orgId: string, userId: string, role: string) {
    return this.request<{ membership: any }>(`/organizations/${orgId}/members/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async removeMember(orgId: string, userId: string) {
    return this.request<{ message: string }>(`/organizations/${orgId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  async deleteOrganization(orgId: string) {
    return this.request<{ message: string }>(`/organizations/${orgId}`, {
      method: 'DELETE',
    });
  }

  // Projects
  async createProject(orgId: string, name: string, description?: string) {
    return this.request<{ project: any }>(`/organizations/${orgId}/projects`, {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async getProjects(orgId: string) {
    return this.request<{ projects: any[] }>(`/organizations/${orgId}/projects`);
  }

  async getProject(projectId: string) {
    return this.request<{ project: any }>(`/projects/${projectId}`);
  }

  async updateProject(projectId: string, data: any) {
    return this.request<{ project: any }>(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async archiveProject(projectId: string) {
    return this.request<{ project: any }>(`/projects/${projectId}/archive`, {
      method: 'POST',
    });
  }

  async getProjectMembers(projectId: string) {
    const { project } = await this.request<{ project: any }>(`/projects/${projectId}`);
    return { members: project.members || [] };
  }

  async addProjectMember(projectId: string, userId: string, role: string) {
    return this.request<{ member: any }>(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, role }),
    });
  }

  // Tasks
  async createTask(projectId: string, data: any) {
    return this.request<{ task: any }>(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTasks(projectId: string, filters?: any) {
    const params = new URLSearchParams(filters || {});
    return this.request<{ tasks: any[]; tasks_by_status: any }>(`/projects/${projectId}/tasks?${params}`);
  }

  async getTask(taskId: string) {
    return this.request<{ task: any }>(`/tasks/${taskId}`);
  }

  async updateTask(taskId: string, data: any) {
    return this.request<{ task: any }>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateTaskStatus(taskId: string, status: string) {
    return this.request<{ task: any }>(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async addAssignees(taskId: string, userIds: string[]) {
    return this.request<{ task: any }>(`/tasks/${taskId}/assignees`, {
      method: 'POST',
      body: JSON.stringify({ user_ids: userIds }),
    });
  }

  async addDependency(taskId: string, dependsOn: string) {
    return this.request<{ task: any }>(`/tasks/${taskId}/dependencies`, {
      method: 'POST',
      body: JSON.stringify({ depends_on: dependsOn }),
    });
  }

  async removeDependency(taskId: string, depId: string) {
    return this.request<{ task: any }>(`/tasks/${taskId}/dependencies/${depId}`, {
      method: 'DELETE',
    });
  }

  async deleteTask(taskId: string) {
    return this.request<{ message: string }>(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async acquireLock(taskId: string, socketId: string) {
    return this.request<{ lock: any }>(`/tasks/${taskId}/lock`, {
      method: 'POST',
      body: JSON.stringify({ socket_id: socketId }),
    });
  }

  async releaseLock(taskId: string) {
    return this.request<{ message: string }>(`/tasks/${taskId}/lock`, {
      method: 'DELETE',
    });
  }

  // Comments
  async createComment(taskId: string, content: string, parentId?: string) {
    return this.request<{ comment: any }>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parent_id: parentId }),
    });
  }

  async getComments(taskId: string) {
    return this.request<{ comments: any[] }>(`/tasks/${taskId}/comments`);
  }

  async updateComment(commentId: string, content: string) {
    return this.request<{ comment: any }>(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(commentId: string) {
    return this.request<{ message: string }>(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Attachments
  async uploadAttachment(taskId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/tasks/${taskId}/attachments`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }
    return data;
  }

  async getAttachments(taskId: string) {
    return this.request<{ attachments: any[] }>(`/tasks/${taskId}/attachments`);
  }

  async deleteAttachment(attachmentId: string) {
    return this.request<{ message: string }>(`/attachments/${attachmentId}`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications(limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    return this.request<{ notifications: any[]; unread_count: number }>(`/notifications${params}`);
  }

  async markNotificationRead(notificationId: string) {
    return this.request<{ message: string }>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead() {
    return this.request<{ message: string }>('/notifications/read-all', {
      method: 'POST',
    });
  }

  // AI
  async parseNaturalLanguage(text: string, projectId?: string) {
    return this.request<{ parsed: any }>('/ai/parse-task', {
      method: 'POST',
      body: JSON.stringify({ text, project_id: projectId }),
    });
  }

  async getSuggestions(title: string, description: string, projectId?: string) {
    return this.request<{ suggestions: any }>('/ai/suggest', {
      method: 'POST',
      body: JSON.stringify({ title, description, project_id: projectId }),
    });
  }

  async getScheduleRecommendations(projectId: string) {
    return this.request<{ recommendations: any }>(`/ai/schedule/${projectId}`);
  }

  async getWorkloadAnalysis(orgId: string) {
    return this.request<{ workload: any[] }>(`/ai/workload/${orgId}`);
  }

  async breakdownTask(title: string, description: string, projectId?: string) {
    return this.request<{ breakdown: any }>('/ai/breakdown', {
      method: 'POST',
      body: JSON.stringify({ title, description, project_id: projectId }),
    });
  }

  async getProjectInsights(projectId: string) {
    return this.request<{ insights: any }>(`/ai/insights/${projectId}`);
  }
}

export const api = new ApiClient();
