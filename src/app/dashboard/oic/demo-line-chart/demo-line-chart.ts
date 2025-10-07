import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'demo-line-chart',
  imports: [CommonModule],
  templateUrl: './demo-line-chart.html',
  styleUrl: './demo-line-chart.css'
})
export class DemoLineChart {

  chart: any;

  ngAfterViewInit() {
    // Wait for the DOM to be ready
    setTimeout(() => {
      this.renderChart();
    }, 0);
  }

  private renderChart() {
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
                 '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17'], 
        datasets: [
          {
            label: "Sales",
            data: [467, 576, 572, 79, 92, 574, 573, 576],
            backgroundColor: 'blue',
            borderColor: 'blue',
            // fill: false
          },
          {
            label: "Profit",
            data: [542, 542, 536, 327, 17, 0, 538, 541],
            backgroundColor: 'limegreen',
            borderColor: 'limegreen',
            // fill: false
          }  
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 2.5
      }
    });
  }
}
