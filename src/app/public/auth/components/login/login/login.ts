import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../services';
import { CustomInput } from '../../custom-input/custom-input/custom-input';
import { UserPreferencesService } from '../../../../../private/services/user-preferences-service/user-preferences-service';
import { LanguageService } from '../../../../../private/services/language-service/language-service';
import { ThemeService } from '../../../../../private/services/theme-service/theme-service';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CustomInput],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private userPreference = inject(UserPreferencesService);
  private languageService = inject(LanguageService);
  private themeService = inject(ThemeService);

  loginForm = new FormGroup<LoginForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async onSubmit() {
    if (this.loginForm.invalid) return;

    try {
      await firstValueFrom(this.authService.login(this.loginForm.getRawValue()));

      const prefs = await this.userPreference.getPreferences();

      if (prefs.preferredLanguage) {
        await this.languageService.setLanguage(prefs.preferredLanguage as 'es' | 'en');
      } else {
        await this.languageService.setLanguage('en');
      }

      if (prefs.preferredTheme) {
        await this.themeService.setTheme(prefs.preferredTheme as 'light' | 'dark' | 'system');
      } else {
        await this.themeService.setTheme('system');
      }
      this.router.navigate(['/app']);
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      this.loginForm.reset();
    }
  }

  guestLogin() {

    this.authService.loginAsGuest();
    this.router.navigate(['/app']);
  }
}
