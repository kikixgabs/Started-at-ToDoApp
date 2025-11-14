import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

// ✅ Validador de contraseña fuerte
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value ?? '';

    if (!value) return { required: true };

    const hasMinLength = value.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasMinLength && hasLetter && hasNumber && hasSymbol;

    return valid
      ? null
      : {
          weakPassword: {
            hasMinLength,
            hasLetter,
            hasNumber,
            hasSymbol,
          },
        };
  };
}

// ✅ Validador para comparar contraseñas (password vs confirmPassword)
export function matchPasswords(passwordField: string, confirmField: string): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const group = form as FormGroup;
    const password = group.get(passwordField)?.value;
    const confirm = group.get(confirmField)?.value;

    return password === confirm ? null : { passwordsMismatch: true };
  };
}
