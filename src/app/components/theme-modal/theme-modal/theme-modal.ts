import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { ThemeService } from '../../../services';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-theme-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatIconButton, NgClass],
  templateUrl: './theme-modal.html',
  styleUrl: './theme-modal.css',
})
export class ThemeModal {
  themeService = inject(ThemeService);

  constructor(private dialogRef: MatDialogRef<ThemeModal>) {}

  get selectedTheme(): 'light' | 'dark' | 'system' {
    return this.themeService.appTheme();
  }

  select(theme: 'light' | 'dark' | 'system') {
    this.themeService.setTheme(theme);
  }
}
