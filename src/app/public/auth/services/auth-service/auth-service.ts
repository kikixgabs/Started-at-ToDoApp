import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LocalManagerService } from '../../../../private/services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  http = inject(HttpClient);
  localManager = inject(LocalManagerService);

  isGuest = signal<boolean>(false);

  register(user: { username: string; password: string; email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true });
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
