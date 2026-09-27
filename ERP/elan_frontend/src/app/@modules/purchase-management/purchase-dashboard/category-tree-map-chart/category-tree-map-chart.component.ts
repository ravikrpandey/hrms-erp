import { Component, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PurchaseDashboardService } from '../../services/purchase-dashboard.service';

@Component({
  selector: 'app-category-tree-map-chart',
  templateUrl: './category-tree-map-chart.component.html',
  styleUrls: ['./category-tree-map-chart.component.scss']
})
export class CategoryTreeMapChartComponent {

  @Input() fromMonth!: number;
  @Input() toMonth!: number;

  mainEmpId: any;
  entityId: any;
  chart!: Chart;

  constructor(private _dashboardService: PurchaseDashboardService) { }

  ngOnInit(): void {
    Chart.register(...registerables);
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.getTotalSpendByCategory();
  }

  getTotalSpendByCategory(): void {
    this._dashboardService.getSpendForecastTrends(this.entityId).subscribe((res: any) => {
      const spendData = res.data.spendData;
      const currentYear = res.data.currentYear;
      const previousYear = res.data.previousYear;
      const forecastedNextYear = res.data.forecastedNextYear;

      const labels = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const currentYearData = spendData.map((item: any) => item.currentYearSpend);
      const previousYearData = spendData.map((item: any) => item.previousYearSpend);
      const forecastedNextYearData = spendData.map((item: any) => item.forecastedNextYearSpend);

      this.createChart(labels, currentYear, previousYear, forecastedNextYear, currentYearData, previousYearData, forecastedNextYearData);
    });
  }

  createChart(labels: string[], currentYear: number, previousYear: number, forecastedNextYear: number, currentYearData: number[], previousYearData: number[], forecastedNextYearData: number[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('lineChar', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: `${currentYear}`,
            data: currentYearData,
            borderColor: 'rgb(25, 192, 192)',
            backgroundColor: 'rgba(214, 27, 27, 0)',
            tension: 0.1,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
          },
          {
            label: `${previousYear}`,
            data: previousYearData,
            borderColor: 'rgba(255, 165, 0, 1)',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            tension: 0.1,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(255, 165, 0, 1)',
            pointBorderColor: '#fff',
          },
          {
            label: `${forecastedNextYear}`,
            data: forecastedNextYearData,
            borderColor: 'rgba(0, 0, 0, 1)',
            borderDash: [5, 5], // Dashed line for 2025
            backgroundColor: 'rgba(0, 0, 0, 0)',
            tension: 0.1,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(0, 0, 0, 1)',
            pointBorderColor: '#fff',
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => `${context.dataset.label}: ₹${context.raw}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false,
              drawTicks: false
            },
            title: {
              display: true,
              text: 'Amount (in ₹)',
              font: {
                size: 12
              }
            },
            ticks: {
              stepSize: 100,
              callback: function (value) {
                return `₹${value}`;
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Months',
              font: {
                size: 13
              }
            },
            grid: {
              display: false,
              drawTicks: false
            },
          }
        }
      }
    });
  }
}
