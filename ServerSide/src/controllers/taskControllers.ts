import { Request, Response } from "express";
import Task from "../model/Task";

export const createTask = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const task = new Task(req.body)
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};


export const getTasks = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};


export const updateTasks = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!task) {
            res.status(404).json({ error: 'Task does not exist' });
            return;
        }
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};


export const deleteTask = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).json({ error: 'Task does not exist' });
            return;
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};