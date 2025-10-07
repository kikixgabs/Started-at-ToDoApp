import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalManagerService } from '../../services/local-manager-service/local-manager-service';
import { Priority, TodoItemInterface } from '../../models';
import { FilterService, ToastService, TodoStateService } from '../../services';
import { TodoItem } from '../todo-item/todo-item';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

interface contentForm {
  formContent: FormControl<string>;
  formSelector: FormControl<Priority | null>;
  formFilter: FormControl<Priority | 'ALL' | null>;
  formTag: FormControl<string[] | null>;
  formFilterTag: FormControl<string | null>;
}

@Component({
  selector: 'app-todo-list',
  imports: [ReactiveFormsModule, TodoItem, CommonModule, DragDropModule],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css'],
})
export class TodoList implements OnInit {
  localManager = inject(LocalManagerService);
  todoState = inject(TodoStateService);
  filterService = inject(FilterService);
  toastService = inject(ToastService);

  Priority = Priority;
  filterSignal = signal<Priority | 'ALL' | null>('ALL');
  selectedTags = signal<string[]>([]);
  filterTags = signal<string[]>([]);
  appearingMap = signal<Record<string, boolean>>({});
  removingMap = signal<Record<string, boolean>>({});

  tagColors: Record<string, string> = {
    Work: 'bg-blue-300',
    Learning: 'bg-green-300',
    Home: 'bg-amber-300',
    Finance: 'bg-purple-300',
    Health: 'bg-red-300',
    Personal: 'bg-pink-300',
  };

  tagList: string[] = Object.keys(this.tagColors);

  todoForm = new FormGroup<contentForm>({
    formContent: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    formSelector: new FormControl<Priority | null>(null, {
      nonNullable: false,
      validators: [Validators.required],
    }),
    formFilter: new FormControl<Priority | 'ALL' | null>('ALL'),
    formTag: new FormControl<string[] | null>(null),
    formFilterTag: new FormControl<string | null>(null),
  });

  filteredTodos = computed<TodoItemInterface[]>(() =>
    this.filterService.filteredTodos(
      this.todoState.todos(),
      this.filterTags().length > 0 ? this.filterTags() : null,
      this.filterSignal()
    )
  );

  ngOnInit(): void {
    const savedTodos = this.localManager.getAllTodos();
    this.todoState.loadFromStorage(savedTodos);

    this.todoForm.controls.formFilter.valueChanges.subscribe((value) => {
      if (value) this.filterSignal.set(value);
    });

    this.todoForm.controls.formFilterTag.valueChanges.subscribe((value) => {
      this.filterTags.set(value ? [value] : []);
    });

    this.filteredTodos().forEach((todo) => {
      this.appearingMap.update((map) => ({ ...map, [todo.id]: false }));
      setTimeout(() => {
        this.appearingMap.update((map) => ({ ...map, [todo.id]: true }));
      }, 10);
    });
  }

  toggleFilterTag(tag: string) {
    const current = this.filterTags();
    const newTags = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    this.filterTags.set(newTags);
  }

  toggleTag(tag: string) {
    const current = this.selectedTags();
    const newTags = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];

    this.selectedTags.set(newTags);
    this.todoForm.controls.formTag.setValue(newTags.length ? newTags : null);
  }

  removeTodoWithAnimation(id: string) {
    this.removingMap.update((map) => ({ ...map, [id]: true }));
    setTimeout(() => {
      this.todoState.deleteTodo(id);
      this.localManager.eraseToDoItem(id);
      this.removingMap.update((map) => {
        const copy = { ...map };
        delete copy[id];
        return copy;
      });
    }, 300);
  }

  onSubmit(): void {
    const newTodo: TodoItemInterface = {
      id: Date.now().toString(),
      content: this.todoForm.getRawValue().formContent!,
      priority: this.todoForm.value.formSelector!,
      date: new Date(),
      completed: false,
      tag: this.todoForm.value.formTag || null,
    };

    this.todoState.addTodo(newTodo);
    this.localManager.setToDoItem(newTodo);

    this.appearingMap.update((map) => ({ ...map, [newTodo.id]: false }));
    this.appearingMap.update(map => ({ ...map, [newTodo.id]: false }));
    setTimeout(() => {
      this.appearingMap.update(map => ({ ...map, [newTodo.id]: true }));
    }, 15);


    this.toastService.showToast('Created new todo');
    this.todoForm.controls.formContent.reset('');
    this.todoForm.controls.formSelector.reset(null);
    this.todoForm.controls.formTag.reset(null);
    this.selectedTags.set([]);
  }

  removeToast(id: number) {
    this.toastService.toasts.update((arr) =>
      arr.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    setTimeout(() => {
      this.toastService.removeToast(id);
    }, 700);
  }

  resetFilters() {
    this.filterSignal.set('ALL');
    this.todoForm.controls.formFilter.setValue('ALL');
    this.filterTags.set([]);
    this.todoForm.controls.formFilterTag.setValue(null);
  }

  onDrop(event: CdkDragDrop<TodoItemInterface[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.todoState.setTodos(event.container.data);
    this.localManager.setToDoItems(event.container.data);
  }
}
