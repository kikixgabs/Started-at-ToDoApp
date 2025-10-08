import { Injectable } from '@angular/core';
import { Priority, TodoItemInterface } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filteredTodos(todos: TodoItemInterface[], tags: string[] | null, filter: Priority | 'ALL' | null): TodoItemInterface[] {
    let result = todos.filter(todo => !todo.completed);

    if (filter && filter !== 'ALL') {
      result = result.filter(todo => todo.priority === filter);
    }

    if (tags && tags.length > 0) {
      result = result.filter(todo => todo.tag?.some(tag => tags.includes(tag)));
    }

    return result;
  }

  filteredDoneTodos(todos: TodoItemInterface[], filter: Priority | 'ALL' | null): TodoItemInterface[] {
    let result = todos.filter(todo => todo.completed);

    if (filter && filter !== 'ALL') {
      result = result.filter(todo => todo.priority === filter);
    }

    return result;
  }
  
}
