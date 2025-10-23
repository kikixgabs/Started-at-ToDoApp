import { inject, Injectable, signal } from '@angular/core';
import { LocalManagerService } from '../local-manager-service/local-manager-service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  localManager = inject(LocalManagerService);

  private language = signal<'es' | 'en'>(
    (this.localManager.loadLocalLanguage() as 'es' | 'en') || 'en'
  );

  
  private translations = {
    en: {
      sidebar: {
        subtitle: 'Productivity made simple',
      },
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
        reset: 'Reset filter',
        empty: `There ain't ToDo's for this filter`,
        filterBy: 'Filter by: ',
      },
      tags: {
        addTags: 'Add tags:',
        tagsAll: 'Todas',
      },
      placeholder: {
        subtask: 'Subtask',
        newTodo: 'New ToDo...',
      },
      todoList: {
        buttons: {
          addSubtask: 'Add subtask',
          addTodo: 'Add ToDo',
        },
        validator: 'Content & priority required.',
        toast: {
          newToast: 'Created new ToDo',
          emptySubtaskToast: 'Fill subtask before adding other.',
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
        priority: 'Priority: '
      },
      helper: {
        doneList: '✅ Done List',
        dashboard: '📊 Dashboard',
      },
      doneList: {
        completedTask: 'Completed Tasks',
        titleUndone: 'Mark as undone',
        titleDelete: 'Delete this ToDo',
      },
      dashboard: {
        dashboard: 'Dashboard',
        total: 'Total',
        complete: 'Complete',
        pending: 'Pending',
      },
    },
    es: {
      sidebar: {
        subtitle: 'Haciendo productividad simple',
      },
      priority: {
        priority: 'Prioridad',
        priorityAll: 'Todas',
        priorityLow: 'Baja',
        priorityMedium: 'Media',
        priorityHigh: 'Alta',
        changePriority: 'Cambiar Priodidad',
      },
      filters: {
        filterPriority: 'Filtrar prioridad',
        filterTag: 'Filtrar etiqueta',
        reset: 'Reiniciar filtros',
        empty: 'No se encuentran tareas para estos filtros.',
        filterBy: 'Filtrar por: ',
      },
      tags: {
        addTags: 'Añadir tarjetas:',
        tagsAll: 'Todas',
      },
      placeholder: {
        subtask: 'Subtarea',
        newTodo: 'Nueva Tarea...',
      },
      todoList: {
        buttons: {
          addSubtask: 'Añadir subtarea',
          addTodo: 'Añadir tarea',
        },
        validator: 'Contenido y prioridad requeridos.',
        toast: {
          newToast: 'Tarea creada',
          emptySubtaskToast: 'Rellene la subtarea vacía antes de crear otra',
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
        priority: 'Prioridad: '
      },
      helper: {
        doneList: '✅ Lista de completados',
        dashboard: '📊 Panel total',
      },
      doneList: {
        completedTask: 'Tareas completadas',
        titleUndone: 'Marcar incompleto',
        titleDelete: 'Eliminar tarea completada',
      },
      dashboard: {
        dashboard: 'Panel de tareas',
        total: 'Total',
        complete: 'Completadas',
        pending: 'Pendientes',
      },
    },
  };
  
  initLanguage() {
    const savedLang = this.localManager.loadLocalLanguage() as 'es' | 'en' | null;
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      this.language.set(savedLang)
    }
  }
  
  setLanguage(lang: 'es' | 'en') {
    this.language.set(lang);
    this.localManager.saveLocalLanguage(lang);
  }
  
  t(path: string): string {
    const keys = path.split('.');
    let value: any = this.translations[this.language()];
    for (const key of keys) {
      value = value?.[key];
      if (!value) break;
    }
    return value ?? path;
  }

  currentLang() {
    return this.language();
  }
}
