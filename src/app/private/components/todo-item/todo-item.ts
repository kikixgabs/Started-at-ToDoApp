import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { LanguageService, TodoStateService } from '../../services';
import { TodoItemInterface, Priority, Subtask } from '../../models';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../public/auth/services';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [FormsModule, DecimalPipe, CommonModule, MatIconModule],
  templateUrl: './todo-item.html',
  styleUrls: ['./todo-item.css'],
})
export class TodoItem {
  
  todo = input<TodoItemInterface>();
  @Output() delete = new EventEmitter<string>();

  // Signals para edición
  isEditing = signal(false);
  prioritySignal = signal<Priority>(Priority.MEDIUM);
  contentEdit = signal('');
  editingSubtaskId = signal<string>('');
  subtaskEditContent = signal<string>('');

  // Servicios
  lang = inject(LanguageService);
  todoState = inject(TodoStateService);
  authService = inject(AuthService);
  Priority = Priority;

  tagColors: Record<string, string> = {
    Work: 'bg-blue-300',
    Learning: 'bg-green-300',
    Home: 'bg-amber-300',
    Finance: 'bg-purple-300',
    Health: 'bg-red-300',
    Personal: 'bg-pink-300',
  };

  ngOnInit(): void {
    const todo = this.todo();
    if (todo) {
      this.prioritySignal.set(todo.priority);
    }
  }

  // 🔹 Eliminar ToDo
  deleteTodo() {
    const todo = this.todo();
    if (!todo) return;
    this.delete.emit(todo.id);
  }

  // 🔹 Editar ToDo principal
  startEdit() {
    const todo = this.todo();
    if (!todo) return;
    this.isEditing.set(true);
    this.contentEdit.set(todo.content);
    this.prioritySignal.set(todo.priority);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.contentEdit.set('');
  }

  saveEdit() {
    const todo = this.todo();
    if (!todo) return;

    const newContent = this.contentEdit().trim();
    if (!newContent) {
      this.cancelEdit();
      return;
    }

    // Actualizamos en frontend y backend
    this.todoState.updateTodoFields(todo.id, {
      content: newContent,
      priority: this.prioritySignal(),
    });

    this.isEditing.set(false);
    this.contentEdit.set('');
  }

  // 🔹 Marcar como completado/incompleto (persistente)
  completeToDo() {
    const todo = this.todo();
    if (!todo) return;
    this.todoState.toggleCompleted(todo.id);
  }

  // 🔹 Subtasks
  toggleSubtaskCompletion(subtaskId: string) {
    const todo = this.todo();
    if (!todo) return;
    this.todoState.toggleSubtaskCompletion(todo.id, subtaskId);
  }

  startSubtaskEdit(subtask: Subtask) {
    this.editingSubtaskId.set(subtask.id);
    this.subtaskEditContent.set(subtask.content);
  }

  cancelSubtaskEdit() {
    this.editingSubtaskId.set('');
    this.subtaskEditContent.set('');
  }

  saveSubtaskEdit(subtask: Subtask) {
    const todo = this.todo();
    if (!todo) return;

    const newContent = this.subtaskEditContent().trim();
    if (!newContent) {
      this.cancelSubtaskEdit();
      return;
    }

    this.todoState.updateSubtaskContent(todo.id, subtask.id, newContent);
    this.editingSubtaskId.set('');
    this.subtaskEditContent.set('');
  }
}
