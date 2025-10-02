import { Component, computed, inject, input, signal } from '@angular/core';
import { LocalManagerService, TodoStateService } from '../../services';
import { DefaultTodoItem, Priority, TodoItemInterface } from '../../models';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  imports: [FormsModule,DecimalPipe],
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
  prioritySignal = signal<Priority>(this.todo().priority)
  contentEdit = signal('');

  localManager = inject(LocalManagerService);
  todoState = inject(TodoStateService);

  startEdit(){
    this.isEditing.set(true);
    this.contentEdit.set(this.todo().content);
    this.prioritySignal.set(this.todo().priority);
  }

/*  changePriority() {
    const newPriority = this.prioritySignal();
    this.todoState.editTodoPriority(this.todo().id, newPriority);
    this.todo().priority = newPriority;
  }*/



  completeToDo(){
    this.removing.set(true);

    setTimeout(() => {
      this.todoState.toggleCompletedToDo(this.todo().id);
    }, 300);
  }

  cancelEdit(){
    this.isEditing.set(false);
    this.contentEdit.set('');
  }

  saveEdit(){
    const updateTodo: TodoItemInterface = {
      ...this.todo(),
      content: this.contentEdit(),
      priority: this.prioritySignal()
    };

    // Actualizo ambos campos en el estado global
    this.todoState.editTodo(updateTodo.id, updateTodo.content);
    this.todoState.editTodoPriority(updateTodo.id, updateTodo.priority);

    // Reflejo el cambio localmente para que la tarjeta se actualice al instante
    this.todo().content = updateTodo.content;
    this.todo().priority = updateTodo.priority;

    // Cierro edición
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