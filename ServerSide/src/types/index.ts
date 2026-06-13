export type TaskCategory = 'Work' | 'Personal' | 'Urgent' | 'Important';

export interface ITask {
    title: string;
    description?: string;
    dueDate?: Date;
    category: TaskCategory;
    completed: boolean;
}