import mongoose, { Schema, Types } from "mongoose";
import{ ITask } from "../types";

export interface ITaskDocument extends ITask {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date
    },
    category: {
        type: String,
        enum: ['Work', 'Personal', 'Urgent', 'Important'],
        required: true
    },
    completed: {
        type: Boolean,
        default: false  
    },
    deletedAt: {
        type: Date,
        default: null,
     },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema as any);

export default Task;