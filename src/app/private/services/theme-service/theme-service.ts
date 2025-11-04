import { Injectable, inject, effect, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeModel } from '../../models';
import { UserPreferencesService } from '../user-preferences-service/user-preferences-service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformID = inject(PLATFORM_ID);
  private userPreference = inject(UserPreferencesService);

  appTheme = signal<'light' | 'dark' | 'system'>('system');

  themes: ThemeModel[] = [
    { name: 'light', icon: 'light_mode' },
    { name: 'dark', icon: 'dark_mode' },
    { name: 'system', icon: 'desktop_windows' },
  ];

  constructor() {
    // ✅ Efecto permanente para aplicar el tema cada vez que cambia
    effect(() => {
      if (!isPlatformBrowser(this.platformID)) return;

      const html = document.documentElement;
      html.classList.remove('dark');

      const theme = this.appTheme();
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (theme === 'dark' || (theme === 'system' && prefersDark)) {
        html.classList.add('dark');
      }

      const colorScheme =
        theme === 'dark' ||
        (theme === 'system' && prefersDark)
          ? 'dark'
          : 'light';

      html.style.setProperty('color-scheme', colorScheme);
    });
  }

  /**
   * 🔹 Inicializa el tema al cargar la app (desde localStorage o backend)
   */
  async init() {
    try {
      // Primero tratamos de cargar desde localStorage (más rápido)
      const localTheme = localStorage.getItem('preferredTheme');
      if (localTheme) {
        this.appTheme.set(localTheme as 'light' | 'dark' | 'system');
        return;
      }

      // Si no hay nada guardado, lo pedimos al backend
      const prefs = await this.userPreference.getPreferredTheme();
      this.appTheme.set(prefs as 'light' | 'dark' | 'system');
      localStorage.setItem('preferredTheme', prefs);
    } catch {
      this.appTheme.set('system');
    }
  }

  /**
   * 🔹 Cambia el tema dinámicamente y guarda la preferencia
   */
  async setTheme(theme: 'light' | 'dark' | 'system') {
    this.appTheme.set(theme);
    localStorage.setItem('preferredTheme', theme);

    try {
      await this.userPreference.updatePreferredTheme(theme);
    } catch (e) {
      console.warn('No se pudo actualizar la preferencia del tema en el backend', e);
    }
  }

  getThemes() {
    return this.themes;
  }
}
