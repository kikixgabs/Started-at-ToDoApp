import { Routes } from '@angular/router';
import { TodoHelperComponent } from './components/todo-helper-component/todo-helper-component';
import { DoneTodoList } from './components/done-todo-list/done-todo-list';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';
import { MainLayout } from './components/main-layout/main-layout';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'helper',
        component: TodoHelperComponent,
        children: [
          { path: 'done', component: DoneTodoList },
          { path: 'dashboard', component: DashboardComponent },
          { path: '', redirectTo: 'done', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: 'helper', pathMatch: 'full' },
    ],
  },
];
