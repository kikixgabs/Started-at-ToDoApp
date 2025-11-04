import { Routes } from '@angular/router';
import { PUBLIC_ROUTES } from './public/auth/public.routes';

export const routes: Routes = [
  {
    path: '',
    children: PUBLIC_ROUTES,
  },
  {
    path: 'app',
    loadChildren: () => import('./private/private.routes').then(m => m.PRIVATE_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
