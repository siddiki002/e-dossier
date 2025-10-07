import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export type chartData = {
  labels: string[],
  datasets: { label: string, data: number[], backgroundColor: string, borderColor: string }[]
};

@Component({
  selector: 'demo-bar-chart',
  imports: [CommonModule],
  templateUrl: './demo-bar-chart.html',
  styleUrl: './demo-bar-chart.css'
})
export class DemoBarChart {

  @Input() data!: chartData;
  @Input() chartId!: string;

  chart: any;

  ngAfterViewInit() {
    // Wait for the DOM to be ready
    setTimeout(() => {
      this.renderChart();
    }, 0);
  }

  private renderChart() {
    const canvas = document.getElementById(this.chartId) as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: this.data,
      options: {
        responsive: true,
        // aspectRatio: 2.5
      }
    });
  }
}
