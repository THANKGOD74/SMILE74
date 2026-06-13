export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  category: 'Work' | 'Personal' | 'Urgent' | 'Important';
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// For creating/updating (no _id, dates)
export interface TaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  category: 'Work' | 'Personal' | 'Urgent' | 'Important';
  completed: boolean;
}