import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoItemInterface } from '../../models';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoManagerService {
  private baseUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  async getAllTodos(): Promise<TodoItemInterface[]> {
    const todosFromBackend = await firstValueFrom(this.http.get<any[]>(this.baseUrl, {withCredentials: true}));
    return todosFromBackend.map(t => ({
      ...t,
      id: t._id,          // 🔹 mapeo _id → id
      date: new Date(t.date)
    }));
  }

  async createTodo(todo: Partial<TodoItemInterface>): Promise<TodoItemInterface> {
    const created = await firstValueFrom(this.http.post<any>(this.baseUrl, todo, {withCredentials: true}));
    return {
      ...created,
      id: created._id,
      date: new Date(created.date)
    };
  }

  async updateTodo(todo: TodoItemInterface): Promise<TodoItemInterface> {
    const updated = await firstValueFrom(this.http.put<any>(`${this.baseUrl}/${todo.id}`, todo, {withCredentials:true}));
    return {
      ...updated,
      id: updated._id,
      date: new Date(updated.date)
    };
  }

  async deleteTodo(id: string) {
    await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`, {withCredentials: true}));
  }

  async reorderTodos(todos: TodoItemInterface[]) {
    const body = todos.map((t, index) => ({ id: t.id, order: index }));
    await firstValueFrom(this.http.put(`${this.baseUrl}/reorder`, body, {withCredentials: true}));
  }
}
