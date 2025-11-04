import { Routes } from '@angular/router';
import { Login } from './components/login/login/login';
import { Register } from './components/register/register/register';
import { AuthlayoutComponent } from './components/authlayout-component/authlayout/authlayout-component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: AuthlayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },
];
