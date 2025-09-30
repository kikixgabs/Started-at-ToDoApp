import { Component, inject, signal } from '@angular/core';
import { TodoStateService } from '../../services';

@Component({
  selector: 'app-done-todo-list',
  imports: [],
  templateUrl: './done-todo-list.html',
  styleUrl: './done-todo-list.css'
})
export class DoneTodoList {
  
  todoState = inject(TodoStateService);

  get doneTodos() {
    return this.todoState.completedTodos();
  }

  
}
