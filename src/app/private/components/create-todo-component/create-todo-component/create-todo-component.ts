import { Component, ElementRef, Inject, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Priority } from '../../../models';
import { LanguageService, ToastService, TodoStateService } from '../../../services';
import { AnimateEnterDirective } from 'ngx-gsap'
import { gsap } from 'gsap';
import { ModalService } from '../../../../global/services/Modal-service/modal-service';

interface contentForm {
  formContent: FormControl<string>;
  formSelector: FormControl<Priority | null>;
  formFilter: FormControl<Priority | 'ALL' | null>;
  formTag: FormControl<string[] | null>;
  formFilterTag: FormControl<string | null>;
  formSubtasks: FormControl<string[] | null>;
}

@Component({
  selector: 'app-create-todo-component',
  imports: [ReactiveFormsModule, CommonModule,],
  templateUrl: './create-todo-component.html',
  styleUrl: './create-todo-component.css',
})
export class CreateTodoComponent {

  @ViewChild('modalContainer') modalContainer!: ElementRef;

  constructor(@Inject('MODAL_DATA') public data: any) { }

  ngAfterViewInit() {
    gsap.from(this.modalContainer.nativeElement, {
      duration: 0.5,
      opacity: 0,
      y: 80,
      scale: 0.95,
      ease: 'power3.out'
    });
  }

  tagColors: Record<string, string> = {
    Work: 'bg-blue-300',
    Learning: 'bg-green-300',
    Home: 'bg-amber-300',
    Finance: 'bg-purple-300',
    Health: 'bg-red-300',
    Personal: 'bg-pink-300',
  };

  toastService = inject(ToastService);
  lang = inject(LanguageService);
  todoState = inject(TodoStateService);
  modalService = inject(ModalService);

  selectedTags = signal<string[]>([]);
  Priority = Priority;
  tagList: string[] = Object.keys(this.tagColors);

  toggleTag(tag: string) {
    const current = this.selectedTags();
    const newTags = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    this.selectedTags.set(newTags);
    this.todoForm.controls.formTag.setValue(newTags.length ? newTags : null);
  }

  get formSubtasksWithIndex() {
    const subtasks = this.todoForm.controls.formSubtasks.value ?? [];
    return subtasks.map((content, index) => ({ content, index }));
  }

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
    if (value === '') return;
    const current = this.todoForm.controls.formSubtasks.value ?? [];
    current[index] = value;
    this.todoForm.controls.formSubtasks.setValue([...current]);
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

    this.todoForm.reset({
      formContent: '',
      formSelector: null,
      formTag: null,
      formFilter: 'ALL',
      formFilterTag: null,
      formSubtasks: [],
    });
    this.selectedTags.set([]);
    this.modalService.close();
    this.toastService.showToast(this.lang.t('todoList.toast.newToast'));
  }
}
