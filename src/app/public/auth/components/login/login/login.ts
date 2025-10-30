import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services';
import { firstValueFrom } from 'rxjs';
import { CustomInput } from '../../custom-input/custom-input/custom-input';

interface loginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CustomInput],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  authService = inject(AuthService);
  
  loginForm = new FormGroup<loginForm>({
    email: new FormControl('', {nonNullable: true, validators: [Validators.email, Validators.required]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
  });

  async onSubmit(){
    if(this.loginForm.valid){
      try{
        await firstValueFrom(this.authService.login(this.loginForm.getRawValue()));
      }catch(error){

      }
    }

    this.loginForm.reset();

  }

}
