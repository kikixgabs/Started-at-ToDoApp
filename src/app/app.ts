import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LanguageService, ThemeService } from './private/services';
import { LoadingSpinnerComponent } from "./global/components/loading-spinner-componente/loading-spinner-component/loading-spinner-component";
import { AuthService } from './public/auth/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('nagular-tailwind-postcss');
  private lang = inject(LanguageService);
  private theme = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(true); // controla el "flicker"

  async ngOnInit() {
    try {
      await Promise.all([this.lang.initLanguage(), this.theme.init()]);
      const remember = localStorage.getItem("rememberMe");

      if (remember === "true") {
        // mostramos spinner hasta que se resuelva
        try {
          await this.authService.checkSession(); // espera y setea user si OK
          this.router.navigate(['/app']); // ya autenticado
          return;
        } catch (err) {
          // no hay sesión válida: seguimos al flow normal (login)
          this.authService.logoutLocal();
        }
      }
    } finally {
      this.loading.set(false); // ocultar spinner / permitir render del login
    }
  }
}
