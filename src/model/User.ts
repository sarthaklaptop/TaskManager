import mongoose, { Schema, Document, Types } from 'mongoose';

export enum TaskStatus {
    ToDo = "ToDo",
    InProgress = "InProgress",
    Completed = "Completed",
}  

export enum PriorityStatus {
    Low = "Low",
    Medium = "Medium",
    High = "High"
}

export interface Task extends Document {
  title: string;
  description: string;
  status: {
    type: String,
    enum: ['Todo', 'InProgress', 'Completed'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  DueDate: Date,
  createdAt: Date,
  lastUpdated: Date
}

const TaskSchema: Schema<Task> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.ToDo,
    required: true,
  },
  priority: {
    type: String,
    enum: Object.values(PriorityStatus),
    default: PriorityStatus.Medium,
    required: true,
  },
  DueDate: {
    type: Date,
    required: false,
  }
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'lastUpdated' }});

export interface User extends Document {
    email: string;
    password: string;
    tasks: Types.ObjectId[];
}

// Updated User schema
const UserSchema: Schema<User> = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
});

const UserModel = mongoose.models.User  || mongoose.model<User>('User', UserSchema);

const TaskModel = mongoose.models.Task  || mongoose.model<Task>('Task', TaskSchema);

export {UserModel, TaskModel};