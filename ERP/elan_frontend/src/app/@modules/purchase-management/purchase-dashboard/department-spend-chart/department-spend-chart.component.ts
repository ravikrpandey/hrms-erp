import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PurchaseDashboardService } from '../../services/purchase-dashboard.service';

@Component({
  selector: 'app-department-spend-chart',
  templateUrl: './department-spend-chart.component.html',
  styleUrls: ['./department-spend-chart.component.scss']
})
export class DepartmentSpendChartComponent {
  @Input() fromMonth!: number;
  @Input() toMonth!: number;

  mainEmpId: any;
  entityId: any;
  departmentChart!: Chart;

  constructor(
    private _dashboardService: PurchaseDashboardService
  ) { }

  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    Chart.register(...registerables);
    this.getTotalSpendByDepartment();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fromMonth'] || changes['toMonth']) {
      this.getTotalSpendByDepartment();
    }
  }

  getTotalSpendByDepartment(): void {
    const requestData = {
      fromMonth: this.fromMonth,
      toMonth: this.toMonth
    };

    this._dashboardService.getTotalSpendByDepartment(this.entityId, requestData).subscribe((res: any) => {
      if (res.data && res.data.length > 0) {
        const labels = res.data.map((item: any) => item.department_name);
        const spendValues = res.data.map((item: any) => parseFloat(item.total_amount_paid));
        const savingsValues = new Array(spendValues.length).fill(0);

        this.createChart(labels, spendValues);
      } else {

        this.createChart([], []);
      }
    });
  }

  createChart(labels: string[], spendValues: number[]): void {
    if (this.departmentChart) {
      this.departmentChart.destroy();
    }

    this.departmentChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Dept Spend',
            data: spendValues,
            backgroundColor: '#007bff'
          },
        ]
      },
      options: {
        indexAxis: 'y', // Horizontal bar chart
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount (₹)',
              font: {
                size: 12
              }
            },
            grid: {
              display: false,
              drawTicks: false
            }
          },
          y: {
            title: {
              display: true,
              text: 'Departments',
              font: {
                size: 13
              }
            },
            grid: {
              display: false,
              drawTicks: false
            }
          }
        },
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ₹${context.raw}`
            }
          }
        }
      }
    });
  }
}

