import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../public/auth/services';
import { LocalManagerService } from '../local-manager-service/local-manager-service';
import { TodoStateService } from '../TodoState-service/todo-state-service';

@Injectable({
  providedIn: 'root'
})
export class PrivateAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = environment.apiUrl;
  private authService = inject(AuthService);
  private localManager = inject(LocalManagerService);
  private todoService = inject(TodoStateService);

  logout() {
    this.authService.isGuest.set(false);
    this.localManager.logout();
    this.todoService.clearState();
    
    this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        console.log('Sesión cerrada');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        this.router.navigate(['/login']);
      }
    });
  }
}
