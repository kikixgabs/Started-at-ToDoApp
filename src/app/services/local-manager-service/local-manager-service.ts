import { Injectable } from '@angular/core';
import { TodoItemInterface } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class LocalManagerService {

  getAllTodos(): TodoItemInterface[] {
    if(typeof localStorage !== 'undefined'){
      return Object.keys(localStorage)
      .map(key => {
        const itemString = localStorage.getItem(key)
        if(itemString) {
          const item: TodoItemInterface = JSON.parse(itemString);
          item.date = new Date(item.date);
          return item;
        }
        return null;
      })
      .filter((item): item is TodoItemInterface => item !== null);
    }else{
      return []
    }
    }

  getToDoItem(key: string): TodoItemInterface | null {
    if(typeof localStorage === 'undefined') return null
    const toDoString = localStorage.getItem(key);
    if(!toDoString) return null
    const toDo: TodoItemInterface = JSON.parse(toDoString);
    toDo.date = new Date(toDo.date);
    return toDo;
  }

  getAllDoneToDoItem(){
    if(typeof localStorage === 'undefined') return [];
    return Object.keys(localStorage)
    .map(key => {
      const itemString = localStorage.getItem(key)
      if(itemString) {
        const item: TodoItemInterface = JSON.parse(itemString);
        if(item.completed === true) {
          item.date = new Date(item.date);
          return item;
        }
      }
      return null;
    })
    .filter((item): item is TodoItemInterface => item !== null);
  }

  setToDoItem(item: TodoItemInterface): void {
    if(typeof localStorage !== 'undefined') localStorage.setItem(item.id, JSON.stringify(item))
  }

  setToDoItems(todos: TodoItemInterface[]){
    todos.forEach(todo => {
      localStorage.setItem(todo.id, JSON.stringify(todo))
    })
  }

  eraseToDoItem(key: string): void {
    if(typeof localStorage !== 'undefined') localStorage.removeItem(key);
  }

  updateToDoItem(key: string, updateContent: string): void{
    if(typeof localStorage === 'undefined') return 
    const todoToUpdate = this.getToDoItem(key)
    if(todoToUpdate){
      todoToUpdate.content = updateContent
      this.setToDoItem(todoToUpdate);
    }
    
  }

}
