import { inject, Injectable } from '@angular/core';
import { TodoItemInterface } from '../../models';
import { LanguageService } from '../language-service/language-service';
import { ThemeService } from '../theme-service/theme-service';

@Injectable({
  providedIn: 'root',
})
export class LocalManagerService {

  languageService = inject(LanguageService);
  themeService = inject(ThemeService);

  logAsGuest(){
    if(typeof localStorage === undefined) return

    localStorage.setItem('guest-session', 'true');
    this.languageService.setLanguage('en');
    this.themeService.setTheme('system');

  }

  getAllTodos(): TodoItemInterface[] {
    if (typeof localStorage === 'undefined') return [];

    const orderData = localStorage.getItem('todos_order');
    const order = orderData ? JSON.parse(orderData) : [];

    if (order.length > 0) {
      return order
        .map((id: string) => {
          const itemString = localStorage.getItem(id);
          if (itemString) {
            const item: TodoItemInterface = JSON.parse(itemString);
            item.date = new Date(item.date);
            return item;
          }
          return null;
        })
        .filter((item: TodoItemInterface | null): item is TodoItemInterface => item !== null);
    }

    return Object.keys(localStorage)
      .map((key) => {
        const itemString = localStorage.getItem(key);
        if (itemString) {
          const item: TodoItemInterface = JSON.parse(itemString);
          item.date = new Date(item.date);
          return item;
        }
        return null;
      })
      .filter((item): item is TodoItemInterface => item !== null);
  }

  getToDoItem(key: string): TodoItemInterface | null {
    if (typeof localStorage === 'undefined') return null;
    const toDoString = localStorage.getItem(key);
    if (!toDoString) return null;
    const toDo: TodoItemInterface = JSON.parse(toDoString);
    toDo.date = new Date(toDo.date);
    return toDo;
  }

  getAllDoneToDoItem() {
    if (typeof localStorage === 'undefined') return [];
    return Object.keys(localStorage)
      .map((key) => {
        const itemString = localStorage.getItem(key);
        if (itemString) {
          const item: TodoItemInterface = JSON.parse(itemString);
          if (item.completed === true) {
            item.date = new Date(item.date);
            return item;
          }
        }
        return null;
      })
      .filter((item): item is TodoItemInterface => item !== null);
  }

  setToDoItem(item: TodoItemInterface): void {
    if (typeof localStorage === 'undefined') return;

    localStorage.setItem(item.id, JSON.stringify(item));

    const orderData = localStorage.getItem('todos_order');
    let order: string[] = orderData ? JSON.parse(orderData) : [];

    if (!order.includes(item.id)) {
      order.push(item.id);
    }

    localStorage.setItem('todos_order', JSON.stringify(order));
  }

  setToDoItems(todos: TodoItemInterface[]) {
    todos.forEach((todo) => {
      localStorage.setItem(todo.id, JSON.stringify(todo));
    });

    const order = todos.map((todo) => todo.id);
    localStorage.setItem('todos_order', JSON.stringify(order));
  }

  eraseToDoItem(key: string): void {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  }

  updateToDoItem(key: string, updateContent: string): void {
    if (typeof localStorage === 'undefined') return;
    const todoToUpdate = this.getToDoItem(key);
    if (todoToUpdate) {
      todoToUpdate.content = updateContent;
      this.setToDoItem(todoToUpdate);
    }
  }

  saveLocalTheme(theme: 'light' | 'dark' | 'system') {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('app-theme', theme);
  }

  loadLocalTheme(): 'light' | 'dark' | 'system' | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('app-theme') as 'light' | 'dark' | 'system' | null;
  }

  saveLocalLanguage(lang: string){
    if(typeof localStorage !== 'undefined'){
      localStorage.setItem('language', lang);
    }
  }

  loadLocalLanguage(): string | null{
    if(typeof localStorage !== 'undefined'){
      return localStorage.getItem('language');
    }
    return null;
  }

  logout(): void{
    localStorage.clear()
  }

  rememberUser(): void{
    localStorage.setItem('rememberMe', 'true');
  }

  deleteRememberMe(): void{
    localStorage.removeItem('rememberMe')
  }
 
}
