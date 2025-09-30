import { computed, inject, Injectable, signal } from '@angular/core';
import { TodoItemInterface } from '../../models';
import { LocalManagerService } from '../local-manager-service/local-manager-service';

@Injectable({
  providedIn: 'root'
})
export class TodoStateService {
  
  todos = signal<TodoItemInterface[]>([]);
  localManager = inject(LocalManagerService);

  addTodo(todo: TodoItemInterface){
    this.todos.update(t => [...t, todo]);
  }

  completedTodos = computed(() => 
    this.todos().filter(todo => todo.completed)
  )

  remove(id: string) {
    this.todos.update(t => t.filter(todo => todo.id !== id));
  }

  loadFromStorage(items: TodoItemInterface[]) {
    this.todos.set(items)
  }

  editTodo(id: string, updateContent: string){
    this.todos.update(todos => 
      todos.map(todo => 
        todo.id === id ? {...todo, content: updateContent} : todo
      )
    )
    this.localManager.updateToDoItem(id, updateContent);
  }

  toggleCompletedToDo (id: string) {
    this.todos.update(todos => 
      todos.map(todo =>
        todo.id === id ? {...todo, completed: !todo.completed} : todo
      )
    );

    const todo = this.localManager.getToDoItem(id);
    if(todo) {
      todo.completed = !todo.completed;
      this.localManager.setToDoItem(todo);
    }

  }

  deleteTodo(id: string){
    this.localManager.eraseToDoItem(id)
    this.remove(id)
  }

}
