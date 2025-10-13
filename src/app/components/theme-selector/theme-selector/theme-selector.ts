import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services';

@Component({
  selector: 'app-theme-selector',
  imports: [],
  templateUrl: './theme-selector.html',
  styleUrl: './theme-selector.css',
})
export class ThemeSelector {
  themeService = inject(ThemeService);

  get themes() {
    return this.themeService.getThemes();
  }

  setTheme(theme: 'light' | 'dark' | 'system') {
    this.themeService.setTheme(theme);
  }
}
