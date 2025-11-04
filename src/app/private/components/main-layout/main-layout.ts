import { Component, inject, signal } from '@angular/core';
import { TodoList } from '../todo-list/todo-list';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeSelector } from '../theme-selector/theme-selector/theme-selector';
import { LanguageService } from '../../services';
import { PrivateAuthService } from '../../services/private-auth-service/private-auth-service';

@Component({
  selector: 'app-main-layout',
  imports: [TodoList, ThemeSelector, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],
})
export class MainLayout {

  lang = inject(LanguageService);
  privateAuthService = inject(PrivateAuthService);

  sidebarOpen = signal(false);
  isMobile = signal(false);

  constructor() {
    this.checkScreen();

    // Detecta cambios de tamaño de ventana
    window.addEventListener('resize', () => {
      this.checkScreen();
    });
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  private checkScreen() {
    this.isMobile.set(window.innerWidth < 640);
  }
}
