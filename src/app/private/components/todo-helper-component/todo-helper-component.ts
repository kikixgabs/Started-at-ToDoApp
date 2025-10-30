import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LanguageService } from '../../services';

@Component({
  selector: 'app-todo-helper-component',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './todo-helper-component.html',
  styleUrls: ['./todo-helper-component.css']
})
export class TodoHelperComponent {

  lang = inject(LanguageService)

}
