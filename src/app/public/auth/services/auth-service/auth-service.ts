
// auth.service.ts (modificado)
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LocalManagerService } from '../../../../private/services';

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  theme?: string;
  language?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  http = inject(HttpClient);
  localManager = inject(LocalManagerService);

  user = signal<AuthUser | null>(null);
  isAuthenticated = signal<boolean>(false);
  isGuest = signal<boolean>(false);

  setUser(user: AuthUser | null) {
    this.user.set(user);
    this.isAuthenticated.set(!!user);
  }

  login(credentials: { email: string; password: string; rememberMe: boolean }) {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true });
  }

  // checkSession ahora devuelve el body del /auth/me (user) y no deja la suscripción abierta
  async checkSession() {
    try {
      const user = await firstValueFrom(
        this.http.get<{ status: string; user: AuthUser }>(`${this.apiUrl}/auth/me`, { withCredentials: true }).pipe(
          // timeout o catchError si querés agregar un timeout rxjs operator
        )
      );
      this.setUser(user.user);
      return user.user;
    } catch (err) {
      this.setUser(null);
      throw err;
    }
  }

  logoutLocal() {
    this.setUser(null);
    this.localManager.deleteRememberMe();
    // opcional: local logout actions
  }

  register(user: { username: string; password: string; email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  loginAsGuest() {
    this.isGuest.set(true);
    this.localManager.logAsGuest();
  }

  constructor() {
    const guest = localStorage.getItem('guest-session');
    if (guest === 'true') {
      this.isGuest.set(true);
    }
  }

  checkEmail(email: string) {
    return this.http.post<{ inUse: boolean }>(`${this.apiUrl}/check-email`, { email });
  }

}
