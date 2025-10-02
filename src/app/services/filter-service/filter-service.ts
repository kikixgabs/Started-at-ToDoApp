import { Injectable } from '@angular/core';
import { Priority, TodoItemInterface } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filteredTodos (todos: TodoItemInterface[], filter: Priority | 'ALL' | null) :TodoItemInterface[]{
    
    const pendingTodos = todos.filter(todo => !todo.completed)

    if (!filter || filter === 'ALL') return pendingTodos;

    return pendingTodos.filter(todo => todo.priority === filter);
  };

  filteredDoneTodos (todos: TodoItemInterface[], filter: Priority | 'ALL' | null) :TodoItemInterface[]{
    
    const pendingTodos = todos.filter(todo => todo.completed)

    if (!filter || filter === 'ALL') return pendingTodos;

    return pendingTodos.filter(todo => todo.priority === filter);
  };
  
}
