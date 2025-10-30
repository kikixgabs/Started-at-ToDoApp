import { Component, computed, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { LanguageService, LocalManagerService, TodoStateService } from '../../services';
import { DefaultTodoItem, Priority, TodoItemInterface, Subtask } from '../../models';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-todo-item',
  imports: [FormsModule, DecimalPipe, CommonModule, MatIconModule],
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
  
  // Señales para manejo de edición
  isEditing = signal(false);
  prioritySignal = signal<Priority>(this.todo().priority);
  contentEdit = signal('');
  
  editingSubtaskId = signal<string>('');
  subtaskEditContent = signal<string>('');
  
  lang = inject(LanguageService);
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

  // Inicia edición del todo principal
  startEdit() {
    this.isEditing.set(true);
    this.contentEdit.set(this.todo().content);
    this.prioritySignal.set(this.todo().priority);
  }

  // Marca/desmarca el todo como completado
  completeToDo() {
    this.todoState.toggleCompletedToDo(this.todo().id);
  }

  // Cancela edición del todo principal
  cancelEdit() {
    this.isEditing.set(false);
    this.contentEdit.set('');
  }

  // Guarda edición del todo principal, ignorando contenido vacío
  saveEdit() {
    const newContent = this.contentEdit().trim();
    if (!newContent) {
      this.cancelEdit();
      return;
    }

    const updateTodo: TodoItemInterface = {
      ...this.todo(),
      content: newContent,
      priority: this.prioritySignal(),
    };

    this.todoState.editTodo(updateTodo.id, updateTodo.content);
    this.todoState.editTodoPriority(updateTodo.id, updateTodo.priority);

    this.todo().content = updateTodo.content;
    this.todo().priority = updateTodo.priority;

    this.isEditing.set(false);
    this.contentEdit.set('');
  }

  // Toggle completion de subtasks
  toggleSubtaskCompletion(subtaskId: string) {
    const subtask = this.todo().subtask?.find((s) => s.id === subtaskId);
    if (subtask) {
      subtask.completed = !subtask.completed;
      this.localManager.setToDoItem(this.todo());
    }
  }

  // Inicia edición de subtask
  startSubtaskEdit(subtask: Subtask) {
    this.editingSubtaskId.set(subtask.id);
    this.subtaskEditContent.set(subtask.content);
  }

  // Cancela edición de subtask
  cancelSubtaskEdit() {
    this.editingSubtaskId.set('');
    this.subtaskEditContent.set('');
  }

  // Guarda edición de subtask, ignorando contenido vacío
  saveSubtaskEdit(subtask: Subtask) {
    const newContent = this.subtaskEditContent().trim();
    if (!newContent) {
      this.cancelSubtaskEdit();
      return;
    }

    subtask.content = newContent;
    this.localManager.setToDoItem(this.todo());

    this.editingSubtaskId.set('');
    this.subtaskEditContent.set('');
  }
}
