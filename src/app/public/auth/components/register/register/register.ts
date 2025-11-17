import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services';
import { debounceTime, firstValueFrom } from 'rxjs';
import { CustomInput } from '../../custom-input/custom-input/custom-input';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../../../../private/services';
import {
  strongPasswordValidator,
  matchPasswords,
} from '../../../../../shared/validators/custom-validators';
import { LoadingService } from '../../../../../global/services/Loading-Service/loading-service';

interface RegisterForm {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CustomInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  lang = inject(LanguageService);
  loadingService = inject(LoadingService)

  constructor() {
    this.registerForm
      .get('email')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.checkEmail());
  }

  ngOnInit() {
    this.registerForm
      .get('email')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(() => this.checkEmail());
  }

  registerForm = new FormGroup<RegisterForm>(
    {
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, strongPasswordValidator()],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: matchPasswords('password', 'confirmPassword') } // 🔥 validación a nivel formulario
  );

  async onSubmit() {
    if (this.registerForm.valid) {

      this.loadingService.show();
      try {
        const result = await firstValueFrom(
          this.authService.register(this.registerForm.getRawValue())
        );
        // Después de registrarse, redirigimos al login
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('❌ Error en el registro:', error);
      }
      finally{
        this.loadingService.hide();
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  emailInUse = false;
  checkingEmail = false;

  onEmailBlur() {
    this.checkEmail(true);
  }

  async checkEmail(fromBlur = false) {
    const control = this.registerForm.get('email');
    const email = control?.value;

    // Si el campo está vacío, inválido, o el usuario ni lo tocó → NO mostrar nada
    if (!email || control?.invalid) {
      this.emailInUse = false;
      return;
    }

    // Si el usuario está escribiendo, esperamos debounce.
    // Si vino de blur, chequeamos igual aunque no cambie el valor.
    if (!fromBlur && !control?.dirty) {
      return;
    }

    this.checkingEmail = true;
    this.emailInUse = false;

    try {
      const exists = await firstValueFrom(this.authService.checkEmail(email));
      this.emailInUse = exists.inUse;
    } catch (_) {}

    this.checkingEmail = false;
  }
}
