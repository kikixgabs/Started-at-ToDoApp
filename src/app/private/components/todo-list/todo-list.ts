import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TodoItem } from '../todo-item/todo-item';
import {
  LocalManagerService,
  FilterService,
  LanguageService,
  ToastService,
  TodoStateService,
} from '../../services';
import { Priority, TodoItemInterface } from '../../models';

interface contentForm {
  formContent: FormControl<string>;
  formSelector: FormControl<Priority | null>;
  formFilter: FormControl<Priority | 'ALL' | null>;
  formTag: FormControl<string[] | null>;
  formFilterTag: FormControl<string | null>;
  formSubtasks: FormControl<string[] | null>;
}

@Component({
  selector: 'app-todo-list',
  imports: [ReactiveFormsModule, TodoItem, CommonModule, DragDropModule],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList implements OnInit {
  localManager = inject(LocalManagerService);
  todoState = inject(TodoStateService);
  filterService = inject(FilterService);
  toastService = inject(ToastService);
  lang = inject(LanguageService);

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
    formSubtasks: new FormControl<string[]>([]),
  });

  filteredTodos = computed<TodoItemInterface[]>(() =>
    this.filterService.filteredTodos(
      this.todoState.todos(),
      this.filterTags().length ? this.filterTags() : null,
      this.filterSignal()
    )
  );

  ngOnInit(): void {
    // Cargar todos desde backend
    this.todoState.loadTodos().then(() => {
      // Inicializamos mapa de animaciones
      const map: Record<string, boolean> = {};
      this.todoState.todos().forEach((todo) => (map[todo.id] = true));
      this.appearingMap.set(map);

    });

    // Observadores de filtros
    this.todoForm.controls.formFilter.valueChanges.subscribe((value) => {
      if (value) this.filterSignal.set(value);
    });

    this.todoForm.controls.formFilterTag.valueChanges.subscribe((value) => {
      this.filterTags.set(value ? [value] : []);
    });
  }

  constructor() {
    effect(() => {
      // Detectar nuevos todos y animarlos
      const todos = this.todoState.todos();
      const appearingUpdate: Record<string, boolean> = {};
      todos.forEach((todo) => {
        if (!this.appearingMap()[todo.id]) {
          appearingUpdate[todo.id] = true;
        }
      });
      if (Object.keys(appearingUpdate).length) {
        this.appearingMap.update((map) => ({ ...map, ...appearingUpdate }));
      }
    });
  }

  // Subtasks
  addSubtaskInput() {
    const current = this.todoForm.controls.formSubtasks.value ?? [];
    if (current.length && current[current.length - 1].trim() === '') {
      this.toastService.showToast(this.lang.t('todoList.toast.emptySubtaskToast'));
      return;
    }
    this.todoForm.controls.formSubtasks.setValue([...current, '']);
  }

  removeSubtask(index: number) {
    const current = this.todoForm.controls.formSubtasks.value ?? [];
    current.splice(index, 1);
    this.todoForm.controls.formSubtasks.setValue([...current]);
  }

  updateSubtask(index: number, value: string) {
    if (value === '') return
    const current = this.todoForm.controls.formSubtasks.value ?? [];
    current[index] = value;
    this.todoForm.controls.formSubtasks.setValue([...current]);
  }

  get formSubtasksWithIndex() {
    const subtasks = this.todoForm.controls.formSubtasks.value ?? [];
    return subtasks.map((content, index) => ({ content, index }));
  }

  // Tags
  toggleFilterTag(tag: string) {
    const current = this.filterTags();
    const newTags = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    this.filterTags.set(newTags);
  }

  toggleTag(tag: string) {
    const current = this.selectedTags();
    const newTags = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    this.selectedTags.set(newTags);
    this.todoForm.controls.formTag.setValue(newTags.length ? newTags : null);
  }

  removeToast(id: number) {
    this.toastService.toasts.update((arr) =>
      arr.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    setTimeout(() => {
      this.toastService.removeToast(id);
    }, 700);
  }

  async onSubmit(): Promise<void> {
    const rawSubtasks = this.todoForm.value.formSubtasks ?? [];

    const processedSubtasks = rawSubtasks
      .filter((sub) => sub.trim() !== '')
      .map((sub) => ({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        content: sub,
        completed: false,
      }));

    await this.todoState.addTodo({
      content: this.todoForm.getRawValue().formContent!,
      priority: this.todoForm.value.formSelector!,
      tag: this.todoForm.value.formTag || null,
      subtask: processedSubtasks.length ? processedSubtasks : null,
    });

    const newTodo = this.todoState.todos().slice(-1)[0];
    this.appearingMap.update((map) => ({ ...map, [newTodo.id]: false }));
    setTimeout(() => this.appearingMap.update((map) => ({ ...map, [newTodo.id]: true })), 10);

    this.todoForm.reset({
      formContent: '',
      formSelector: null,
      formTag: null,
      formFilter: 'ALL',
      formFilterTag: null,
      formSubtasks: [],
    });
    this.selectedTags.set([]);

    this.toastService.showToast(this.lang.t('todoList.toast.newToast'));
  }

  // Eliminar
  removeTodoWithAnimation(id: string) {
    this.removingMap.update((map) => ({ ...map, [id]: true }));
    setTimeout(async () => {
      await this.todoState.deleteTodo(id);
      //this.localManager.setToDoItems(this.todoState.todos());
      this.removingMap.update((map) => {
        const copy = { ...map };
        delete copy[id];
        return copy;
      });
    }, 300);
  }

  // Drag & Drop
  async onDrop(event: CdkDragDrop<TodoItemInterface[]>) {
    const allTodos = [...this.todoState.todos()];
    const visibleTodos = this.filteredTodos();

    moveItemInArray(visibleTodos, event.previousIndex, event.currentIndex);

    const newAllTodos: TodoItemInterface[] = [];
    let visibleIndex = 0;
    allTodos.forEach((todo) => {
      if (visibleTodos.find((v) => v.id === todo.id)) {
        newAllTodos.push(visibleTodos[visibleIndex]);
        visibleIndex++;
      } else {
        newAllTodos.push(todo);
      }
    });

    await this.todoState.reorderTodos(newAllTodos);
    //this.localManager.setToDoItems(this.todoState.todos());
  }

  resetFilters() {
    this.filterSignal.set('ALL');
    this.todoForm.controls.formFilter.setValue('ALL');
    this.filterTags.set([]);
    this.todoForm.controls.formFilterTag.setValue(null);
  }
}
