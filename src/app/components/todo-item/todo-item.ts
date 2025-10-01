import { Component, inject, input, signal } from '@angular/core';
import { LocalManagerService, TodoStateService } from '../../services';
import { DefaultTodoItem, Priority, TodoItemInterface } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-item',
  imports: [FormsModule,],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css'
})
export class TodoItem {
  
  todo = input<TodoItemInterface>(DefaultTodoItem);
  appearing = signal(false);
  removing = signal(false);
  Priority = Priority;

  ngOnInit() {
    setTimeout(() => this.appearing.set(true), 10)
  }

  isEditing = signal(false);
  contentEdit = signal('');

  localManager = inject(LocalManagerService);
  todoState = inject(TodoStateService);

  startEdit(){
    this.isEditing.set(true);
    this.contentEdit.set(this.todo().content);
  }

  completeToDo(){
    this.todoState.toggleCompletedToDo(this.todo().id);
  }

  cancelEdit(){
    this.isEditing.set(false);
    this.contentEdit.set('');
  }

  saveEdit(){
    const updateTodo = {
      ...this.todo(),
      content: this.contentEdit()
    }
    this.todoState.editTodo(updateTodo.id, updateTodo.content);
    this.isEditing.set(false);
    this.contentEdit.set('');
  }

  deleteTodoWithAnimation() {
    this.removing.set(true);

    setTimeout(() => {
      this.todoState.deleteTodo(this.todo().id);
    }, 300);
  }

}