export interface ITask {
  title: string;
  description?: string;
  dueDate?: Date;
  category: 'Work' | 'Personal' | 'Urgent' | 'Important';
  completed: boolean;
  userId: string;
  deletedAt?: Date;
}


// export interface TaskInput {
//   title: string;
//   description?: string;
//   dueDate?: Date;
//   category: 'Work' | 'Personal' | 'Urgent' | 'Important';
//   completed: boolean;
// }