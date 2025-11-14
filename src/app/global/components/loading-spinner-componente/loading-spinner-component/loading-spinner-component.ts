import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../services/Loading-Service/loading-service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  template: `
  @if(loadingService.loading()){
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"> 
      <div class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  }
  `
})
export class LoadingSpinnerComponent {
  loadingService = inject(LoadingService);
}
