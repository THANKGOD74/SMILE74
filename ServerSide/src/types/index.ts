export interface ITask {
  title: string;
  description?: string;
  dueDate?: Date;
  category: 'Work' | 'Personal' | 'Urgent' | 'Important';
  completed: boolean;
  userId: string; // or Types.ObjectId, but string works for the frontend
}



// export type TaskCategory = 'Work' | 'Personal' | 'Urgent' | 'Important';

// export interface ITask {
//     title: string;
//     description?: string;
//     dueDate?: Date;
//     category: TaskCategory;
//     completed: boolean;
// }