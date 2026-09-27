import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PurchaseDashboardService } from '../../services/purchase-dashboard.service';

@Component({
  selector: 'app-spend-trend-chart',
  templateUrl: './spend-trend-chart.component.html',
  styleUrls: ['./spend-trend-chart.component.scss']
})
export class SpendTrendChartComponent {
  @Input() fromMonth!: number;
  @Input() toMonth!: number;
  chart!: Chart;
  mainEmpId: any;
  entityId: any;
  chartData: { labels: string[], data: number[] } = { labels: [], data: [] };

  constructor(private _dashboardService: PurchaseDashboardService) { }

  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    Chart.register(...registerables);

    this.getSpendTrends()
  }
  getSpendTrends(): void {
    this._dashboardService.getSpendTrends(this.entityId).subscribe((res: any) => {
      if (res.code === 200 && res.data) {
        const monthsMap = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const labels = monthsMap;
        const data = Array(12).fill(0);

        res.data.forEach((item: any) => {
          const monthIndex = item.month - 1;
          data[monthIndex] = parseFloat(item.total_amount_paid);
        });

        this.createChart(labels, data);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fromMonth'] || changes['toMonth']) {
      this.getSpendTrends();
    }
  }
  createChart(labels: string[], data: number[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const maxValue = Math.max(...data);
    const stepSize = Math.ceil(maxValue / 10);

    this.chart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Amount Spent(in ₹)',
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            tension: 0.1,
            fill: true,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
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
              label: (context) => `₹${context.raw}`
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
              text: 'Amount Spent (in ₹)',
              font: {
                size: 12
              }
            },
            ticks: {
              stepSize: stepSize,
              callback: function (value) {
                return `${value}`;
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
