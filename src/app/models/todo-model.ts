export enum Priority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

export interface TodoItemInterface {
    id: string;
    content: string;
    priority: Priority;
    date: Date;
    completed: boolean;
}

export const DefaultTodoItem: TodoItemInterface = {
    id: Date.now().toString(),
    content: 'testestest',
    priority: Priority.MEDIUM,
    date: new Date(),
    completed: false
}