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
import { LoadingService } from '../../../../../global/services/Loading-Service/loading-service';
import { LocalManagerService } from '../../../../../private/services';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
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
  languageService = inject(LanguageService);
  themeService = inject(ThemeService);
  loadingService = inject(LoadingService);
  localManager = inject(LocalManagerService);

  ngOnInit() {
    this.loginForm.patchValue({
      rememberMe: localStorage.getItem('rememberMe') === 'true',
    });
  }

  loginForm = new FormGroup<LoginForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rememberMe: new FormControl(false, { nonNullable: true }),
  });

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.loadingService.show();

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

      if (this.loginForm.value.rememberMe) {
        this.localManager.rememberUser();
      } else {
        this.localManager.deleteRememberMe();
      }

      this.router.navigate(['/app']);
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      this.loginForm.patchValue({
        email: '',
        password: '',
      });
      this.loadingService.hide();
    }
  }

  guestLogin() {
    this.authService.loginAsGuest();
    this.router.navigate(['/app']);
  }
}
