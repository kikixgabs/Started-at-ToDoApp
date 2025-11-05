import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ✅ Obtener todas las preferencias
  async getPreferences() {
    return firstValueFrom(
      this.http.get<{ preferredLanguage: string; preferredTheme: string }>(
        this.baseUrl,
        { withCredentials: true }
      )
    );
  }

  // ✅ Obtener solo el idioma
  async getPreferredLanguage() {
    const prefs = await this.getPreferences();
    return prefs.preferredLanguage || 'en';
  }

  // ✅ Obtener solo el tema
  async getPreferredTheme() {
    const prefs = await this.getPreferences();
    return prefs.preferredTheme || 'system';
  }

  // ✅ Actualizar solo el idioma
  async updatePreferredLanguage(preferredLanguage: string) {
    return firstValueFrom(
      this.http.put(
        this.baseUrl,
        { preferredLanguage },
        { withCredentials: true }
      )
    );
  }

  // ✅ Actualizar solo el tema
  async updatePreferredTheme(preferredTheme: string) {
    return firstValueFrom(
      this.http.put(
        this.baseUrl,
        { preferredTheme },
        { withCredentials: true }
      )
    );
  }

  // (opcional) Para login inicial
  getPreferencesLogin() {
    return this.http.get(`${this.baseUrl}`, { withCredentials: true });
  }
}
