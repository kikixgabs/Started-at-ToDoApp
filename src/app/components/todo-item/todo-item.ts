import { Component, computed, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { LocalManagerService, TodoStateService } from '../../services';
import { DefaultTodoItem, Priority, TodoItemInterface } from '../../models';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  imports: [FormsModule, DecimalPipe, CommonModule],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItem {
  todo = input<TodoItemInterface>(DefaultTodoItem);
  Priority = Priority;

  @Output() delete = new EventEmitter<string>();

  deleteTodo() {
    this.delete.emit(this.todo().id);
  }

  isEditing = signal(false);
  prioritySignal = signal<Priority>(this.todo().priority);
  contentEdit = signal('');

  localManager = inject(LocalManagerService);
  todoState = inject(TodoStateService);

  tagColors: Record<string, string> = {
    Work: 'bg-blue-300',
    Learning: 'bg-green-300',
    Home: 'bg-amber-300',
    Finance: 'bg-purple-300',
    Health: 'bg-red-300',
    Personal: 'bg-pink-300',
  };

  startEdit() {
    this.isEditing.set(true);
    this.contentEdit.set(this.todo().content);
    this.prioritySignal.set(this.todo().priority);
  }

  completeToDo() {
    setTimeout(() => {
      this.todoState.toggleCompletedToDo(this.todo().id);
    }, 300);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.contentEdit.set('');
  }

  saveEdit() {
    const updateTodo: TodoItemInterface = {
      ...this.todo(),
      content: this.contentEdit(),
      priority: this.prioritySignal(),
    };

    this.todoState.editTodo(updateTodo.id, updateTodo.content);
    this.todoState.editTodoPriority(updateTodo.id, updateTodo.priority);

    this.todo().content = updateTodo.content;
    this.todo().priority = updateTodo.priority;

    this.isEditing.set(false);
    this.contentEdit.set('');
  }
}
