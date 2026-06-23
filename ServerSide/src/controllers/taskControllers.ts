import { Request, Response } from "express";
import Task from "../model/Task";
import { AuthRequest } from "../middleWare/auth";

// Create a task – attach userId from the authenticated user
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate, category, completed } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      category,
      completed,
      userId: req.user._id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Get all tasks – only those belonging to the user and exclude soft-deleted tasks
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ userId: req.user._id, deletedAt: null }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update a task – verify ownership first
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      res.status(404).json({ error: "Task not found or you don't have permission" });
      return;
    }
    const { title, description, dueDate, category, completed } = req.body;
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.dueDate = dueDate ?? task.dueDate;
    task.category = category ?? task.category;
    task.completed = completed ?? task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Soft delete a task – verify ownership and set deletedAt
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log(' Soft delete request for task ID:', req.params.id);

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      console.log(' Task not found for user:', req.user._id);
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    console.log(' Task found, soft deleting:', task.title);
    task.deletedAt = new Date();
    await task.save();
    console.log(' Task soft-deleted at:', task.deletedAt);

    res.json({ message: 'Task moved to trash' });
  } catch (error) {
    console.error('Soft delete error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get all trashed tasks (soft-deleted)
export const getTrashedTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log(' Fetching trashed tasks for user:', req.user._id);

    // More robust query – check both $ne and $exists
    const tasks = await Task.find({
      userId: req.user._id,
      deletedAt: { $exists: true, $ne: null }
    });

    console.log(`📦 Found ${tasks.length} trashed tasks`);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching trashed tasks:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// Restore a task from trash
export const restoreTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    task.deletedAt = null;
    await task.save();
    console.log('Task restored:', task.title);
    res.json({ message: 'Task restored' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Permanently delete a task (hard delete)
export const permanentDeleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    console.log('🗑️ Permanently deleted task:', task.title);
    res.json({ message: 'Task permanently deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};





// import { Request, Response } from "express";
// import Task from "../model/Task";
// import { AuthRequest } from "../middleWare/auth"; // we'll create this

// // Create a task – attach userId from the authenticated user
// export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const { title, description, dueDate, category, completed } = req.body;
//     const task = new Task({
//       title,
//       description,
//       dueDate,
//       category,
//       completed,
//       userId: req.user._id, // associate with logged-in user
//     });
//     await task.save();
//     res.status(201).json(task);
//   } catch (error) {
//     res.status(400).json({ error: (error as Error).message });
//   }
// };

// // Get all tasks – only those belonging to the user and exclude sort-deleted task
// export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const tasks = await Task.find({ userId: req.user._id, deletedAt: null }).sort({ createdAt: -1 });
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// // Get all tasks – only those belonging to the user
// // export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
// //   try {
// //     const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
// //     res.json(tasks);
// //   } catch (error) {
// //     res.status(500).json({ error: (error as Error).message });
// //   }
// // };

// // Update a task – verify ownership first
// export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
//     if (!task) {
//       res.status(404).json({ error: "Task not found or you don't have permission" });
//       return;
//     }
//     // Update fields (spread req.body but ensure userId is not overwritten)
//     const { title, description, dueDate, category, completed } = req.body;
//     task.title = title ?? task.title;
//     task.description = description ?? task.description;
//     task.dueDate = dueDate ?? task.dueDate;
//     task.category = category ?? task.category;
//     task.completed = completed ?? task.completed;
//     await task.save();
//     res.json(task);
//   } catch (error) {
//     res.status(400).json({ error: (error as Error).message });
//   }
// };

// // Delete a task – verify ownership
// export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
//     if (!task) {
//       res.status(404).json({ error: 'Task not found' });
//       return;
//     }

//     // Soft delete: set deletedAt to current date
//     task.deletedAt = new Date();
//     await task.save();

//     res.json({ message: 'Task moved to trash' });
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };



// // Get all trashed tasks (soft-deleted)
// export const getTrashedTasks = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const tasks = await Task.find({ userId: req.user._id, deletedAt: { $ne: null } });
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// // Restore a task from trash
// export const restoreTask = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
//     if (!task) {
//       res.status(404).json({ error: 'Task not found' });
//       return;
//     }
//     task.deletedAt = null;
//     await task.save();
//     res.json({ message: 'Task restored' });
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// // Permanently delete a task (hard delete)
// export const permanentDeleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
//     if (!task) {
//       res.status(404).json({ error: 'Task not found' });
//       return;
//     }
//     res.json({ message: 'Task permanently deleted' });
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };