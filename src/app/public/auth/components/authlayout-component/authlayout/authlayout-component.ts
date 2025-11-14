import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from '../../../../../private/services';

@Component({
  selector: 'app-authlayout-component',
  imports: [RouterOutlet, ],
  templateUrl: './authlayout-component.html',
  styleUrl: './authlayout-component.css'
})
export class AuthlayoutComponent {
  lang = inject(LanguageService)
  
}
