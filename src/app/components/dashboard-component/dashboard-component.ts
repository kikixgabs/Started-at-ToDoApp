import { Component, inject, PLATFORM_ID, computed, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, ChartData, ChartOptions, ArcElement, DoughnutController, Legend, Tooltip } from 'chart.js';
import { ChartComponent } from './chart-component';
import { LanguageService, TodoStateService } from '../../services';

// ✅ Registrar elementos para doughnut
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.css']
})
export class DashboardComponent {
  private todoState = inject(TodoStateService);
  private platformID = inject(PLATFORM_ID);
  lang = inject(LanguageService);

  isBrowser = isPlatformBrowser(this.platformID);

  // ✅ Señal que observa los todos desde TodoStateService
  todos = computed(() => this.todoState.todos());

  // ✅ Contadores derivados
  totalTodos = computed(() => this.todos().length);
  completedTodos = computed(() => this.todos().filter(t => t.completed).length);
  pendingTodos = computed(() => this.todos().filter(t => !t.completed).length);

  // ✅ Signal para chartData
  chartData = computed<ChartData<'doughnut'>>(() => ({
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [this.completedTodos(), this.pendingTodos()],
        backgroundColor: ['#22c55e', '#ef4444']
      }
    ]
  }));

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    maintainAspectRatio: false
  };
}
