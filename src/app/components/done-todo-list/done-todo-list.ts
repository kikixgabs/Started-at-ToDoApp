import { Component, computed, inject, signal } from '@angular/core';
import { FilterService, TodoStateService } from '../../services';
import { Priority, TodoItemInterface } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-done-todo-list',
  imports: [FormsModule],
  templateUrl: './done-todo-list.html',
  styleUrl: './done-todo-list.css'
})
export class DoneTodoList {
  

  todoState = inject(TodoStateService);
  filterService = inject(FilterService);
  Priority = Priority;

  filterSignal = signal<Priority | 'ALL' | null>(null)

  filteredDoneTodos = computed<TodoItemInterface[]>(() =>
    this.filterService.filteredDoneTodos(
      this.todoState.completedTodos(),
      this.filterSignal(),
    )
  )

  get doneTodos() {
    return this.todoState.completedTodos();
  }
  
}
