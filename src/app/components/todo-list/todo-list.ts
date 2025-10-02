import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { LocalManagerService } from '../../services/local-manager-service/local-manager-service';
import { Priority, TodoItemInterface } from '../../models';
import { FilterService, TodoStateService } from '../../services';
import { TodoItem } from '../todo-item/todo-item';

interface contentForm {
  formContent: FormControl<string>,
  formSelector: FormControl<Priority | null>,
  formFilter: FormControl<Priority | 'ALL' | null>
}
@Component({
  selector: 'app-todo-list',
  imports: [ReactiveFormsModule, TodoItem,],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css']
})
export class TodoList implements OnInit{

  localManager = inject(LocalManagerService);
  todoState = inject(TodoStateService);
  filterService = inject(FilterService);
  Priority = Priority;

  filterSignal = signal<Priority | 'ALL' | null>(null)

  ngOnInit(): void {
    const savedTodos = this.localManager.getAllTodos()
    this.todoState.loadFromStorage(savedTodos)

    this.todoForm.controls.formFilter.valueChanges.subscribe(value => {
      if (value) this.filterSignal.set(value);
    })
  }

  todoForm = new FormGroup<contentForm>({
    formContent: new FormControl('', {nonNullable:true, validators:[Validators.required, Validators.minLength(1)]}),
    formSelector: new FormControl<Priority | null>(null, {nonNullable: false, validators:[Validators.required]}),
    formFilter: new FormControl<Priority | 'ALL' | null>(null)
  })

  filteredTodos = computed<TodoItemInterface[]>(() =>
  this.filterService.filteredTodos(this.todoState.todos(), this.filterSignal())
);



  onSubmit(): void{
    const newTodo: TodoItemInterface = {
      id: Date.now().toString(),
      content: this.todoForm.getRawValue().formContent!,
      priority: this.todoForm.value.formSelector!,
      date: new Date(),
      completed: false
    }
    
    this.todoState.addTodo(newTodo);
    this.localManager.setToDoItem(newTodo);
    this.todoForm.controls.formContent.reset();
    this.todoForm.controls.formSelector.reset();
  }

} 
