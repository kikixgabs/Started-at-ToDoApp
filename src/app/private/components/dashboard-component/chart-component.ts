import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="max-w-xs mx-auto mt-4 h-64">
      <canvas baseChart
        [data]="data"
        [type]="'doughnut'"
        [options]="options">
      </canvas>
    </div>
  `
})
export class ChartComponent implements OnChanges {
  @Input() data!: ChartData<'doughnut'>;
  @Input() options!: ChartOptions;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      this.chart.update();
    }
  }
}
