import { computed, inject, Injectable, signal } from '@angular/core';
import { Priority, TodoItemInterface } from '../../models';
import { LocalManagerService } from '../local-manager-service/local-manager-service';

@Injectable({
  providedIn: 'root',
})
export class TodoStateService {
  todos = signal<TodoItemInterface[]>([]);
  localManager = inject(LocalManagerService);

  addTodo(todo: TodoItemInterface) {
    this.todos.update((t) => [...t, todo]);
  }

  completedTodos = computed(() => this.todos().filter((todo) => todo.completed));

  remove(id: string) {
    this.todos.update((t) => t.filter((todo) => todo.id !== id));
  }

  loadFromStorage(items: TodoItemInterface[]) {
    this.todos.set(items);
  }

  setTodos(todos: TodoItemInterface[]) {
    this.todos.set(todos);
  }

  editTodo(id: string, updateContent: string) {
    this.todos.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, content: updateContent } : todo))
    );
    this.localManager.updateToDoItem(id, updateContent);
  }

  editTodoPriority(id: string, priority: Priority) {
    this.todos.update((todos) => todos.map((t) => (t.id === id ? { ...t, priority } : t)));
  }

  toggleCompletedToDo(id: string) {
    this.todos.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );

    const updatedTodos = this.todos();
    this.localManager.setToDoItems(updatedTodos);
  }

  deleteTodo(id: string) {
    this.localManager.eraseToDoItem(id);
    this.remove(id);
  }
}
