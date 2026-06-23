import { Request, Response } from "express";
import Task from "../model/Task";
import { AuthRequest } from "../middleWare/auth"; // we'll create this

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
      userId: req.user._id, // associate with logged-in user
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Get all tasks – only those belonging to the user and exclude sort-deleted task
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ userId: req.user._id, deletedAt: null }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get all tasks – only those belonging to the user
// export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// Update a task – verify ownership first
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      res.status(404).json({ error: "Task not found or you don't have permission" });
      return;
    }
    // Update fields (spread req.body but ensure userId is not overwritten)
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

// Delete a task – verify ownership
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Soft delete: set deletedAt to current date
    task.deletedAt = new Date();
    await task.save();

    res.json({ message: 'Task moved to trash' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};



// Get all trashed tasks (soft-deleted)
export const getTrashedTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ userId: req.user._id, deletedAt: { $ne: null } });
    res.json(tasks);
  } catch (error) {
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
    res.json({ message: 'Task permanently deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};