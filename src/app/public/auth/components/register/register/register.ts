import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services';
import { firstValueFrom } from 'rxjs';
import { CustomInput } from '../../custom-input/custom-input/custom-input';
import { Router, RouterLink } from '@angular/router';

interface RegisterForm {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule,RouterLink, CustomInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = new FormGroup<RegisterForm>({
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
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        const result = await firstValueFrom(
          this.authService.register(this.registerForm.getRawValue())
        );
        console.log('✅ Usuario registrado:', result);
        // Después de registrarse, redirigimos al login
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('❌ Error en el registro:', error);
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
