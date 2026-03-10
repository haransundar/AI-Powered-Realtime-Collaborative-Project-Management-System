export interface User {
  _id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  owner_id: string;
  settings: Record<string, unknown>;
  created_at: string;
  members?: OrgMembership[];
}

export interface OrgMembership {
  _id: string;
  org_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joined_at: string;
  status: string;
  user?: User;
}

export interface Project {
  _id: string;
  org_id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived';
  settings: Record<string, unknown>;
  created_by: string;
  created_at: string;
  member_count?: number;
  members?: ProjectMember[];
}

export interface ProjectMember {
  _id: string;
  project_id: string;
  user_id: string;
  role: 'project_manager' | 'contributor' | 'viewer';
  added_at: string;
  user?: User;
}

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  _id: string;
  project_id: string;
  org_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: string[];
  assignee_details?: User[];
  creator_id: string;
  creator?: User;
  due_date?: string;
  time_estimate_hours?: number;
  dependencies: string[];
  blocked_by: string[];
  version: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  _id: string;
  task_id: string;
  author_id: string;
  author?: User;
  content: string;
  parent_id?: string;
  is_deleted: boolean;
  edited_at?: string;
  created_at: string;
  replies?: Comment[];
}

export interface Notification {
  _id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  resource_type: string;
  resource_id: string;
  is_read: boolean;
  created_at: string;
}

export interface FileAttachment {
  _id: string;
  task_id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string;
  download_url?: string;
  created_at: string;
}

export interface ParsedTask {
  title: string;
  description: string;
  assignees: string[];
  due_date?: string;
  priority: TaskPriority;
}

export interface TaskSuggestions {
  suggested_priority: TaskPriority;
  suggested_assignees: string[];
  related_tasks: string[];
  next_steps: string[];
  tags: string[];
}
