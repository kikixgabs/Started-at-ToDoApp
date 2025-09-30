import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { LocalManagerService } from '../../services/local-manager-service/local-manager-service';
import { TodoItemInterface } from '../../models';
import { TodoStateService } from '../../services';
import { TodoItem } from '../todo-item/todo-item';

interface contentForm {
  formContent: FormControl<string>
}
@Component({
  selector: 'app-todo-list',
  imports: [ReactiveFormsModule, TodoItem,],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css']
})
export class TodoList implements OnInit{

  localManager = inject(LocalManagerService);
  todoState = inject(TodoStateService)

  ngOnInit(): void {
    const savedTodos = this.localManager.getAllTodos()
    this.todoState.loadFromStorage(savedTodos)
  }

  todoForm = new FormGroup<contentForm>({
    formContent: new FormControl('', {nonNullable:true, validators:[Validators.required, Validators.minLength(1)]})
  })

  onSubmit(): void{
    const newTodo: TodoItemInterface = {
      id: Date.now().toString(),
      content: this.todoForm.getRawValue().formContent,
      date: new Date(),
      completed: false
    }
    
    this.todoState.addTodo(newTodo);
    this.localManager.setToDoItem(newTodo);
    this.todoForm.reset();
  }

} 
