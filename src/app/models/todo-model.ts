import { Subtask } from "./subtask";

export enum Priority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

export interface TodoItemInterface {
    id: string;
    content: string;
    priority: Priority;
    tag: string[] | null;
    date: Date;
    completed: boolean;
    subtask?: Subtask[];
}

export const DefaultTodoItem: TodoItemInterface = {
    id: Date.now().toString(),
    content: 'testestest',
    priority: Priority.MEDIUM,
    tag: [],
    date: new Date(),
    completed: false,
    subtask: [],
}

export const tagsList = [
    'Work', 
    'Learning', 
    'Home', 
    'Finance', 
    'Health', 
    'Personal'
]