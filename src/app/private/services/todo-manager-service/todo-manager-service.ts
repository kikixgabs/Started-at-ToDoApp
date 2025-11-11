import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoItemInterface } from '../../models';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LocalManagerService } from '../local-manager-service/local-manager-service';
import { AuthService } from '../../../public/auth/services';

@Injectable({
  providedIn: 'root',
})
export class TodoManagerService {
  private baseUrl = `${environment.apiUrl}/todos`;

  private http = inject(HttpClient);
  private localManager = inject(LocalManagerService);
  authService = inject(AuthService);

  async getAllTodos(): Promise<TodoItemInterface[]> {
    if (this.authService.isGuest()) {
      return this.localManager.getAllTodos();
    }

    const todosFromBackend = await firstValueFrom(
      this.http.get<any[]>(this.baseUrl, { withCredentials: true })
    );
    return todosFromBackend.map((t) => ({
      ...t,
      id: t._id,
      date: new Date(t.date),
    }));
  }

  async createTodo(todo: Partial<TodoItemInterface>): Promise<TodoItemInterface> {
    if (this.authService.isGuest()) {
      const localTodo: TodoItemInterface = {
        id: Date.now().toString(),
        ...todo,
        date: new Date(),
        completed: false,
        tag: todo.tag || null,
        subtask: todo.subtask || null,
      } as TodoItemInterface;

      this.localManager.setToDoItem(localTodo);
      return localTodo;
    }

    const created = await firstValueFrom(
      this.http.post<any>(this.baseUrl, todo, { withCredentials: true })
    );
    return {
      ...created,
      id: created._id,
      date: new Date(created.date),
    };
  }

  async updateTodo(todo: TodoItemInterface): Promise<TodoItemInterface> {
    if (this.authService.isGuest()) {
      this.localManager.setToDoItem(todo);
      return todo;
    }

    const updated = await firstValueFrom(
      this.http.put<any>(`${this.baseUrl}/${todo.id}`, todo, { withCredentials: true })
    );
    return {
      ...updated,
      id: updated._id,
      date: new Date(updated.date),
    };
  }

  async deleteTodo(id: string): Promise<void> {
    if (this.authService.isGuest()) {
      this.localManager.eraseToDoItem(id);
      return;
    }

    await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true }));
    return;
  }

  async reorderTodos(todos: TodoItemInterface[]): Promise<void> {
    if (this.authService.isGuest()) {
      this.localManager.setToDoItems(todos);
      return;
    }

    const body = todos.map((t, index) => ({ id: t.id, order: index }));
    await firstValueFrom(this.http.put(`${this.baseUrl}/reorder`, body, { withCredentials: true }));
  }
}
