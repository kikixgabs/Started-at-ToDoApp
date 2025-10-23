import { Component, inject, OnInit, signal } from '@angular/core';
import { MainLayout } from "./components/main-layout/main-layout";
import { LanguageService } from './services';

@Component({
  selector: 'app-root',
  imports: [MainLayout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('nagular-tailwind-postcss');
  lang = inject(LanguageService);

  ngOnInit(){
    this.lang.initLanguage();
  }

}
