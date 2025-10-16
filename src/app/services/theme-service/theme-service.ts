import { Injectable, inject, effect, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LocalManagerService } from '../local-manager-service/local-manager-service';
import { ThemeModel } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformID = inject(PLATFORM_ID);
  private localManager = inject(LocalManagerService);

  // Signal para el tema actual
  appTheme = signal<'light' | 'dark' | 'system'>(this.localManager.loadLocalTheme() || 'system');

  themes: ThemeModel[] = [
    { name: 'light', icon: 'light_mode' },
    { name: 'dark', icon: 'dark_mode' },
    { name: 'system', icon: 'desktop_windows' },
  ];

  constructor() {
    // Inicializar con el tema guardado
    const savedTheme = this.localManager.loadLocalTheme();
    if (savedTheme) this.appTheme.set(savedTheme);

    // Efecto reactivo para actualizar la clase 'dark' en html
    effect(() => {
      if (!isPlatformBrowser(this.platformID)) return;

      const html = document.documentElement;
      html.classList.remove('dark'); // Limpiamos siempre

      const theme = this.appTheme();

      if (theme === 'dark') {
        html.classList.add('dark');
      } else if (theme === 'system') {
        // Detecta el sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) html.classList.add('dark');
      }

      // Opcional: ajustar color-scheme para navegadores
      const colorScheme = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark'
        : 'light';
      html.style.setProperty('color-scheme', colorScheme);
    });
  }

  // Guardar tema y persistir
  setTheme(theme: 'light' | 'dark' | 'system') {
    this.appTheme.set(theme);
    this.localManager.saveLocalTheme(theme);
  }

  getThemes() {
    return this.themes;
  }
}
