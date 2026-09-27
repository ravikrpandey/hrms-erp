import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PurchaseDashboardService } from '../../services/purchase-dashboard.service';

@Component({
  selector: 'app-region-spend-chart',
  templateUrl: './region-spend-chart.component.html',
  styleUrls: ['./region-spend-chart.component.scss']
})
export class RegionSpendChartComponent {

  regionChart!: Chart;
  mainEmpId: any;
  @Input() fromMonth!: number;
  @Input() toMonth!: number;
  labels: any;
  dataValues: any;
  entityId: any;

  constructor(
    private _dashboardService: PurchaseDashboardService
  ) { }
  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    Chart.register(...registerables);
    this.createRegionChart();
    this.getSpendByPRcategory()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fromMonth'] || changes['toMonth']) {
      this.createRegionChart();
      this.getSpendByPRcategory()
    }
  }
  getSpendByPRcategory(): void {
    const requestData = {
      fromMonth: this.fromMonth,
      toMonth: this.toMonth
    };

    this._dashboardService.getSpendByPRcategory(this.entityId, requestData).subscribe((res: any) => {
      const labels = res.data.map((item: any) => item.po_type);
      const dataValues = res.data.map((item: any) => item.total_amount_paid)

      this.regionChart.data.labels = labels;
      this.labels = labels
      this.regionChart.data.datasets[0].data = dataValues;
      this.dataValues = dataValues;
      this.regionChart.update();
    });
  }
  createRegionChart(): void {
    const labels = this.labels;
    const dataValues = this.dataValues;
    if (this.regionChart) {
      this.regionChart.destroy();
    }

    this.regionChart = new Chart('regionChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Spend by Category',
          data: dataValues,
          backgroundColor: '#3498db',
          borderColor: '#2980b9',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // Horizontal Bar
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.raw}`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              display: false,
              drawTicks: false
            },
            title: {
              display: true,
              text: 'Amount',
            }
          },
          y: {
            title: {
              display: true,
              text: 'Type'
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
