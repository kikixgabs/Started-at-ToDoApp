import { Component, computed, inject, signal } from '@angular/core';
import { FilterService, LanguageService, TodoStateService } from '../../services';
import { Priority, TodoItemInterface } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-done-todo-list',
  imports: [FormsModule],
  templateUrl: './done-todo-list.html',
  styleUrls: ['./done-todo-list.css']
})
export class DoneTodoList {

  todoState = inject(TodoStateService);
  filterService = inject(FilterService);
  lang = inject(LanguageService);
  Priority = Priority;

  filterSignal = signal<Priority | 'ALL'>('ALL');

  filteredDoneTodos = computed<TodoItemInterface[]>(() =>
    this.filterService.filteredDoneTodos(
      this.todoState.completedTodos(),
      this.filterSignal(),
    )
  );

}
