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

// Get all tasks – only those belonging to the user
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
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
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      res.status(404).json({ error: "Task not found or you don't have permission" });
      return;
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};




// import { Request, Response } from "express";
// import Task from "../model/Task";

// export const createTask = async ( req: Request, res: Response ): Promise<void> => {
//     try {
//         const task = new Task(req.body)
//         await task.save();
//         res.status(201).json(task);
//     } catch (error) {
//         res.status(400).json({ error: (error as Error).message });
//     }
// };


// export const getTasks = async ( req: Request, res: Response ): Promise<void> => {
//     try {
//         const tasks = await Task.find().sort({ createdAt: -1 });
//         res.json(tasks);
//     } catch (error) {
//         res.status(500).json({ error: (error as Error).message });
//     }
// };


// export const updateTasks = async ( req: Request, res: Response ): Promise<void> => {
//     try {
//         const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true,
//         });
//         if (!task) {
//             res.status(404).json({ error: 'Task does not exist' });
//             return;
//         }
//         res.json(task);
//     } catch (error) {
//         res.status(400).json({ error: (error as Error).message });
//     }
// };


// export const deleteTask = async ( req: Request, res: Response ): Promise<void> => {
//     try {
//         const task = await Task.findByIdAndDelete(req.params.id);
//         if (!task) {
//             res.status(404).json({ error: 'Task does not exist' });
//             return;
//         }
//         res.json({ message: 'Task deleted' });
//     } catch (error) {
//         res.status(400).json({ error: (error as Error).message });
//     }
// };