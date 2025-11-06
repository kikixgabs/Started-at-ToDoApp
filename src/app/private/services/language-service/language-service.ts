import { inject, Injectable, signal } from '@angular/core';
import { UserPreferencesService } from '../user-preferences-service/user-preferences-service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private userPreference = inject(UserPreferencesService);
  private language = signal<'es' | 'en'>('en');

  private translations = {
    en: {
      sidebar: { subtitle: 'Productivity made simple' },
      priority: {
        priority: 'Priority',
        priorityAll: 'All',
        priorityLow: 'Low',
        priorityMedium: 'Medium',
        priorityHigh: 'High',
        changePriority: 'Change Priority',
      },
      filters: {
        filterPriority: 'Filter priority',
        filterTag: 'Filter tag',
        reset: 'Reset filters',
        empty: 'No ToDos found for this filter.',
        filterBy: 'Filter by: ',
      },
      tags: {
        addTags: 'Add tags:',
        tagsAll: 'All',
        work: 'Work',
        learning: 'Learning',
        home: 'Home',
        finance: 'Finance',
        health: 'Health',
        personal: 'Personal',
      },
      placeholder: { subtask: 'Subtask', newTodo: 'New ToDo...' },
      todoList: {
        buttons: { addSubtask: 'Add subtask', addTodo: 'Add ToDo' },
        validator: 'Content & priority required.',
        toast: {
          newToast: 'Created new ToDo',
          emptySubtaskToast: 'Fill subtask before adding another.',
        },
      },
      todoItem: {
        buttons: {
          edit: 'Edit',
          done: 'Done',
          delete: 'Delete',
          save: 'Save',
          goBack: 'Go Back',
        },
        priority: 'Priority: ',
      },
      helper: { doneList: '✅ Done List', dashboard: '📊 Dashboard' },
      doneList: {
        completedTask: 'Completed Tasks',
        titleUndone: 'Mark as undone',
        titleDelete: 'Delete this ToDo',
        emptyDoneTask: 'No completed tasks yet.',
        emptyFilter: 'No completed tasks for this filter yet.',
      },
      dashboard: {
        dashboard: 'Dashboard',
        total: 'Total',
        complete: 'Complete',
        pending: 'Pending',
      },
    },
    es: {
      sidebar: { subtitle: 'Haciendo productividad simple' },
      priority: {
        priority: 'Prioridad',
        priorityAll: 'Todas',
        priorityLow: 'Baja',
        priorityMedium: 'Media',
        priorityHigh: 'Alta',
        changePriority: 'Cambiar Prioridad',
      },
      filters: {
        filterPriority: 'Filtrar prioridad',
        filterTag: 'Filtrar etiqueta',
        reset: 'Reiniciar filtros',
        empty: 'No se encuentran tareas para este filtro.',
        filterBy: 'Filtrar por: ',
      },
      tags: {
        addTags: 'Añadir etiquetas:',
        tagsAll: 'Todas',
        work: 'Trabajo',
        learning: 'Aprendizaje',
        home: 'Hogar',
        finance: 'Finanzas',
        health: 'Salud',
        personal: 'Personales',
      },
      placeholder: { subtask: 'Subtarea', newTodo: 'Nueva tarea...' },
      todoList: {
        buttons: { addSubtask: 'Añadir subtarea', addTodo: 'Añadir tarea' },
        validator: 'Contenido y prioridad requeridos.',
        toast: {
          newToast: 'Tarea creada',
          emptySubtaskToast: 'Complete la subtarea vacía antes de crear otra.',
        },
      },
      todoItem: {
        buttons: {
          edit: 'Editar',
          done: 'Terminar',
          delete: 'Borrar',
          save: 'Guardar',
          goBack: 'Revertir cambios',
        },
        priority: 'Prioridad: ',
      },
      helper: { doneList: '✅ Lista de completados', dashboard: '📊 Panel total' },
      doneList: {
        completedTask: 'Tareas completadas',
        titleUndone: 'Marcar como incompleta',
        titleDelete: 'Eliminar tarea completada',
        emptyDoneTask: 'Sin tareas completas.',
        emptyFilter: 'No se encuentran tareas completadas para este filtro.',
      },
      dashboard: {
        dashboard: 'Panel de tareas',
        total: 'Total',
        complete: 'Completadas',
        pending: 'Pendientes',
      },
    },
  };

  async initLanguage() {
    try {
      const prefs = await this.userPreference.getPreferredLanguage();
      if (prefs) {
        this.language.set(prefs as 'es' | 'en');
        //localStorage.setItem('preferredLang', prefs);
      }
    } catch {
      this.language.set('en');
    }
  }

  async setLanguage(lang: 'es' | 'en') {
    this.language.set(lang);
    //localStorage.setItem('preferredLang', lang);
    await this.userPreference.updatePreferredLanguage(lang);
  }

  t(path: string): string {
    const keys = path.split('.');
    let value: any = this.translations[this.language()];
    for (const key of keys) value = value?.[key];
    return value ?? path;
  }

  currentLang() {
    return this.language();
  }
}
