import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ThemeModal } from '../../theme-modal/theme-modal/theme-modal';
import { ThemeService } from '../../../services';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconButton, MatIconModule],
  templateUrl: './theme-selector.html',
  styleUrl: './theme-selector.css',
})
export class ThemeSelector {
  private dialog = inject(MatDialog);
  private themeService = inject(ThemeService);

  openThemeModal(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    const dialogRef = this.dialog.open(ThemeModal, {
      position: {
        left: `${rect.left + window.scrollX}px`,
        top: `${rect.bottom + window.scrollY + 6}px`,
      },
      panelClass: 'theme-modal-panel',
      backdropClass: 'transparent-backdrop',
      autoFocus: false,
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((theme) => {
      if (theme) this.themeService.setTheme(theme);
    });
  }
}
