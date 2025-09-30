import { Component } from '@angular/core';
import { TodoList } from '../todo-list/todo-list';
import { TodoHelperComponent } from "../todo-helper-component/todo-helper-component";

@Component({
  selector: 'app-main-layout',
  imports: [TodoList, TodoHelperComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
