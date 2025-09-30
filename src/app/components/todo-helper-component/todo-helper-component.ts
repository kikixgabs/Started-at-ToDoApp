import { Component } from '@angular/core';
import { DoneTodoList } from "../done-todo-list/done-todo-list";

@Component({
  selector: 'app-todo-helper-component',
  imports: [DoneTodoList],
  templateUrl: './todo-helper-component.html',
  styleUrl: './todo-helper-component.css'
})
export class TodoHelperComponent {

}
