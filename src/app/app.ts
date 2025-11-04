import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService, ThemeService } from './private/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('nagular-tailwind-postcss');
  private lang = inject(LanguageService);
  private theme = inject(ThemeService);

  async ngOnInit() {
    await Promise.all([this.lang.initLanguage(), this.theme.init()]);
  }
}
