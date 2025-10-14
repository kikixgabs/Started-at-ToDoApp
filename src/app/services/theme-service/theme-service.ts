import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ThemeModel } from '../../models';
import { isPlatformBrowser } from '@angular/common';
import { LocalManagerService } from '../local-manager-service/local-manager-service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  platformID = inject(PLATFORM_ID);
  localManager = inject(LocalManagerService);
  appTheme = signal<'light' | 'dark' | 'system'>(this.localManager.loadLocalTheme() || 'system');
  themes: ThemeModel[] = [
    { name: 'light', icon: 'light_mode' },
    { name: 'dark', icon: 'dark_mode' },
    { name: 'system', icon: 'desktop_windows' },
  ];

  selectedTheme = computed(() => {
    this.themes.find((t) => t.name === this.appTheme());
  });

  getThemes() {
    return this.themes;
  }

  setTheme(theme: 'light' | 'dark' | 'system') {
    this.appTheme.set(theme);
    this.localManager.saveLocalTheme(theme);
  }

  constructor() {
    const savedTheme = this.localManager.loadLocalTheme();
    if (savedTheme) {
      this.appTheme.set(savedTheme);
    }

    effect(() => {
      if (!isPlatformBrowser(this.platformID)) return;

      const appTheme = this.appTheme();
      document.body.classList.remove('light', 'dark');
      switch (appTheme) {
        case 'dark': {
          document.body.classList.add('dark');
          break;
        }
        case 'light': {
          document.body.classList.add('light');
          break;
        }
      }

      const colorScheme = appTheme === 'system' ? 'light dark' : appTheme;
      document.body.style.setProperty('color-scheme', colorScheme);
    });
  }
}
