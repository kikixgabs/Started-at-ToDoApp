import { Routes } from '@angular/router';
import { TodoHelperComponent } from './components/todo-helper-component/todo-helper-component';
import { DoneTodoList } from './components/done-todo-list/done-todo-list';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';

export const routes: Routes = [
  { path: '', redirectTo: '/helper', pathMatch: 'full' },
  {
    path: 'helper',
    component: TodoHelperComponent,
    children: [
      { path: 'done', component: DoneTodoList },
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'done', pathMatch: 'full' }
    ]
  }
];
