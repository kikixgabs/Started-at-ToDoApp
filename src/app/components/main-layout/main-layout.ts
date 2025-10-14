import { Component } from '@angular/core';
import { TodoList } from '../todo-list/todo-list';
import { TodoHelperComponent } from "../todo-helper-component/todo-helper-component";
import { ThemeSelector } from "../theme-selector/theme-selector/theme-selector";

@Component({
  selector: 'app-main-layout',
  imports: [TodoList, TodoHelperComponent, ThemeSelector],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
