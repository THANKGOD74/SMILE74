import mongoose, { Schema, Types } from "mongoose";
import { ITask } from "../types";

export interface ITaskDocument extends ITask {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
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
        enum: [ 'Work', 'Personal', 'Urgent', 'Important' ],
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});


// Mongoose 9 + TS 6 over-instantiate the schema's inferred type (TS2589).
// Casting the schema argument breaks that type-level recursion; the result is
// re-asserted to the proper document model so callers keep full typing.
const Task = mongoose.model('Task', TaskSchema as any);

export default Task;