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

  async init() {
    try {
      const prefs = await this.userPreference.getPreferredTheme();
      this.appTheme.set(prefs as 'light' | 'dark' | 'system');
    } catch {
      this.appTheme.set('system');
    }
  }

  
  async setTheme(theme: 'light' | 'dark' | 'system') {
    this.appTheme.set(theme);

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
