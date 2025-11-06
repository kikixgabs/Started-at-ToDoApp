import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  private baseUrl = environment.apiUrl;
  http = inject(HttpClient)

  // ✅ Obtener todas las preferencias
  async getPreferences() {
    return firstValueFrom(
      this.http.get<{ preferredLanguage: string; preferredTheme: string }>(
        `${this.baseUrl}/preferences`,
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
        `${this.baseUrl}/preferences`,
        { preferredLanguage },
        { withCredentials: true }
      )
    );
  }

  // ✅ Actualizar solo el tema
  async updatePreferredTheme(preferredTheme: string) {
    return firstValueFrom(
      this.http.put(
        `${this.baseUrl}/preferences`,
        { preferredTheme },
        { withCredentials: true }
      )
    );
  }

  // (opcional) Para login inicial
  getPreferencesLogin() {
    return this.http.get(`${this.baseUrl}/preferences`, { withCredentials: true });
  }
}
