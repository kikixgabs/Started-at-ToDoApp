export interface TodoItemInterface {
    id: string;
    content: string;
    date: Date;
    completed: boolean;
}

export const DefaultTodoItem: TodoItemInterface = {
    id: Date.now().toString(),
    content: 'testestest',
    date: new Date(),
    completed: false
}