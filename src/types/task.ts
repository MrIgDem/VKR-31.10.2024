export type TaskStatus = 'new' | 'in_progress' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  project: string;
  projectName: string;
  deadline: string;
  createdAt: string;
  type: 'rd' | 'id' | 'other';
  attachments?: TaskAttachment[];
}