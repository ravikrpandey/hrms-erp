import { Component, Input, SimpleChanges } from '@angular/core';
import { PurchaseDashboardService } from '../../services/purchase-dashboard.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-category-spend-chart',
  templateUrl: './category-spend-chart.component.html',
  styleUrls: ['./category-spend-chart.component.scss']
})
export class CategorySpendChartComponent {

  @Input() fromMonth!: number;
  @Input() toMonth!: number;

  mainEmpId: any;
  entityId: any;
  public chart!: any;

  constructor(
    private _dashboardService: PurchaseDashboardService
  ) { }

  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    Chart.register(...registerables);
    this.getTotalSpendByCategory();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fromMonth'] || changes['toMonth']) {
      this.getTotalSpendByCategory();
    }
  }

  getTotalSpendByCategory(): void {
    const requestData = {
      fromMonth: this.fromMonth,
      toMonth: this.toMonth
    };

    this._dashboardService.getTotalSpendOnCategory(this.entityId, requestData).subscribe((res: any) => {
      if (res.data && res.data.length > 0) {
        const labels = res.data.map((item: any) => item.asset_category_name);
        const dataValues = res.data.map((item: any) => parseFloat(item.percentage));
        const backgroundColors = ['#AB4967', '#FE5F55', '#C6ECAE', '#EAB464', '#7DAA92', '#007bff'];

        this.updateChart(labels, dataValues, backgroundColors);
      } else {
        this.updateChart([], [], []);
      }
    });
  }

  createChart(): void {
    this.chart = new Chart<'pie', number[], string>('pieChart', {
      type: 'pie',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}%`,
            },
          },
        },
      },
    });
  }

  updateChart(labels: string[], data: number[], backgroundColors: string[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart<'pie', number[], string>('pieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}%`,
            },
          },
        },
      },
    });
  }
}