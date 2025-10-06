import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { LocalManagerService } from '../../services/local-manager-service/local-manager-service';
import { Priority, tagsList, TodoItemInterface } from '../../models';
import { FilterService, ToastService, TodoStateService } from '../../services';
import { TodoItem } from '../todo-item/todo-item';
import { TAG_COLORS } from '../../constants';
import { CommonModule } from '@angular/common';

interface contentForm {
  formContent: FormControl<string>;
  formSelector: FormControl<Priority | null>;
  formFilter: FormControl<Priority | 'ALL' | null>;
  formTag: FormControl<string[] | null>;
  formFilterTag: FormControl<string | null>
}
@Component({
  selector: 'app-todo-list',
  imports: [ReactiveFormsModule, TodoItem, CommonModule],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css']
})
export class TodoList implements OnInit{

  localManager = inject(LocalManagerService);
  todoState = inject(TodoStateService);
  filterService = inject(FilterService);
  toastService = inject(ToastService);
  Priority = Priority;

  filterSignal = signal<Priority | 'ALL' | null>('ALL');
  selectedTags = signal<string[]>([]);
  filterTags = signal<string[]>([]);

  tagColors: Record<string, string> = {
  Work: 'bg-blue-300',
  Learning: 'bg-green-300',
  Home: 'bg-amber-300',
  Finance: 'bg-purple-300',
  Health: 'bg-red-300',
  Personal: 'bg-pink-300',
};


  tagList: string[] = Object.keys(this.tagColors);

  ngOnInit(): void {
    const savedTodos = this.localManager.getAllTodos()
    this.todoState.loadFromStorage(savedTodos)

    this.todoForm.controls.formFilter.valueChanges.subscribe(value => {
      if (value) this.filterSignal.set(value);
    })

    this.todoForm.controls.formFilterTag.valueChanges.subscribe(value => {
      this.filterTags.set(value ? [value] : []);
    });


  }

  todoForm = new FormGroup<contentForm>({
    formContent: new FormControl('', {nonNullable:true, validators:[Validators.required, Validators.minLength(1)]}),
    formSelector: new FormControl<Priority | null>(null, {nonNullable: false, validators:[Validators.required]}),
    formFilter: new FormControl<Priority | 'ALL' | null>('ALL'),
    formTag: new FormControl<string[] | null>(null),
    formFilterTag: new FormControl<string | null>(null)
  })

  filteredTodos = computed<TodoItemInterface[]>(() =>
    this.filterService.filteredTodos(
      this.todoState.todos(),
      this.filterTags().length > 0 ? this.filterTags() : null,
      this.filterSignal(),
    )
  );


  toggleFilterTag(tag: string) {
    const current = this.filterTags();
    let newTags: string[];

    if (current.includes(tag)) {
      newTags = current.filter(t => t !== tag);
    } else {
      newTags = [...current, tag];
    }

    this.filterTags.set(newTags);
  }

  toggleTag(tag: string) {
    const current = this.selectedTags();
    let newTags: string[];

    if (current.includes(tag)) {
      newTags = current.filter(t => t !== tag);
    } else {
      newTags = [...current, tag];
    }

    this.selectedTags.set(newTags);

    this.todoForm.controls.formTag.setValue(newTags.length ? newTags : null);
  }


  onSubmit(): void{
    const newTodo: TodoItemInterface = {
      id: Date.now().toString(),
      content: this.todoForm.getRawValue().formContent!,
      priority: this.todoForm.value.formSelector!,
      date: new Date(),
      completed: false,
      tag: this.todoForm.value.formTag || null,
    }

    this.toastService.showToast('Created new todo');
    
    this.todoState.addTodo(newTodo);
    this.localManager.setToDoItem(newTodo);
    this.todoForm.reset();
    this.selectedTags.set([]);
  }

  removeToast(id: number){
    this.toastService.toasts.update(arr =>
      arr.map(t => t.id === id ? { ...t, visible: false } : t)
    );

    setTimeout(() => {
      this.toastService.removeToast(id);
    }, 700);
  }

} 
