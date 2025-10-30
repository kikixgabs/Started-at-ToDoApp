import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Auth, AuthData, loginResponse } from '../../models/auth-model';
import { AuthAdapter } from './adapters';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:4000/auth';
  http = inject(HttpClient);

  login(user: AuthData): Observable<Auth> {
    return this.http.post<loginResponse>(`${this.baseUrl}/login`, user).pipe(
      map(AuthAdapter)
    );
  }

}
