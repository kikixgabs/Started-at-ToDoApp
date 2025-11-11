import { Injectable, signal, computed, inject } from '@angular/core';
import { TodoItemInterface, Priority, Subtask } from '../../models';
import { TodoManagerService } from '../todo-manager-service/todo-manager-service';
import { AuthService } from '../../../public/auth/services';
import { LocalManagerService } from '../local-manager-service/local-manager-service';
import { todo } from 'node:test';

@Injectable({
  providedIn: 'root',
})
export class TodoStateService {
  todos = signal<TodoItemInterface[]>([]);
  private todoManager = inject(TodoManagerService);
  private authService = inject(AuthService);
  private localManager = inject(LocalManagerService);

  completedTodos = computed(() => this.todos().filter((todo) => todo.completed));

  async clearState(): Promise<void>{
    this.todos.set([])
  }

  // 🔹 Cargar todos desde backend
  async loadTodos() {
    if (this.authService.isGuest()) {
      const loadedTodos = this.localManager.getAllTodos();
      this.todos.set(loadedTodos);
      return;
    }
    const items = await this.todoManager.getAllTodos();
    this.todos.set(items);
  }

  // 🔹 Crear un todo
  async addTodo(todo: Partial<TodoItemInterface>) {
    const created = await this.todoManager.createTodo(todo);
    this.todos.update((t) => [...t, created]);
  }

  // 🔹 Actualiza campos de un todo (contenido y/o prioridad)
  async updateTodoFields(
    id: string,
    fields: Partial<Pick<TodoItemInterface, 'content' | 'priority'>>
  ) {
    const todo = this.todos().find((t) => t.id === id);
    if (!todo) return;

    const updated: TodoItemInterface = { ...todo, ...fields };
    if (this.authService.isGuest()) {
      this.localManager.setToDoItem(updated);
      this.todos.update((t) => t.map((x) => (x.id === id ? updated : x)));
      return;
    }
    await this.todoManager.updateTodo(updated);
    this.todos.update((t) => t.map((x) => (x.id === id ? updated : x)));
  }

  // 🔹 Marcar completado/incompleto
  async toggleCompleted(id: string) {
    const todo = this.todos().find((t) => t.id === id);
    if (!todo) return;

    const updated: TodoItemInterface = { ...todo, completed: !todo.completed };
    if (this.authService.isGuest()) {
      this.localManager.setToDoItem(updated);
      this.todos.update((t) => t.map((x) => (x.id === id ? updated : x)));
      return;
    }
    await this.todoManager.updateTodo(updated);
    this.todos.update((t) => t.map((x) => (x.id === id ? updated : x)));
  }

  // 🔹 Eliminar todo
  async deleteTodo(id: string) {
    if (this.authService.isGuest()) {
      this.localManager.eraseToDoItem(id);
      this.todos.update((t) => t.filter((x) => x.id !== id));
      return;
    }
    await this.todoManager.deleteTodo(id);
    this.todos.update((t) => t.filter((x) => x.id !== id));
  }

  // 🔹 Reordenar todos
  async reorderTodos(newOrder: TodoItemInterface[]): Promise<void> {
    this.todos.set(newOrder);
    await this.todoManager.reorderTodos(newOrder);
  }

  // 🔹 Subtasks
  async toggleSubtaskCompletion(todoId: string, subtaskId: string) {
    const todo = this.todos().find((t) => t.id === todoId);
    if (!todo || !todo.subtask) return;

    const updatedSubtasks = todo.subtask.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );

    const updated: TodoItemInterface = { ...todo, subtask: updatedSubtasks };
    await this.todoManager.updateTodo(updated);
    if (this.authService.isGuest()) {
      this.localManager.setToDoItem(updated);
      this.todos.update((t) => t.map((x) => (x.id === todoId ? updated : x)));
      return;
    }
    this.todos.update((t) => t.map((x) => (x.id === todoId ? updated : x)));
  }

  async updateSubtaskContent(todoId: string, subtaskId: string, content: string) {
    const todo = this.todos().find((t) => t.id === todoId);
    if (!todo || !todo.subtask) return;

    const updatedSubtasks = todo.subtask.map((s) => (s.id === subtaskId ? { ...s, content } : s));

    const updated: TodoItemInterface = { ...todo, subtask: updatedSubtasks };

    if (this.authService.isGuest()) {
      this.localManager.setToDoItem(updated);
      this.todos.update((t) => t.map((x) => (x.id === todoId ? updated : x)));
      return;
    }

    await this.todoManager.updateTodo(updated);
    this.todos.update((t) => t.map((x) => (x.id === todoId ? updated : x)));
  }
}
