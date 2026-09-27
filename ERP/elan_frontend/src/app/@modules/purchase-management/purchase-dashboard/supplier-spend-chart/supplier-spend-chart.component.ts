import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PurchaseDashboardService } from '../../services/purchase-dashboard.service';

@Component({
  selector: 'app-supplier-spend-chart',
  templateUrl: './supplier-spend-chart.component.html',
  styleUrls: ['./supplier-spend-chart.component.scss']
})
export class SupplierSpendChartComponent {
  @Input() fromMonth!: number;
  @Input() toMonth!: number;

  supplierChart!: Chart;
  mainEmpId: any;
  entityId: any;

  constructor(
    private _dashboardService: PurchaseDashboardService
  ) { }

  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    Chart.register(...registerables);
    this.getTotalSpendByVendors()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fromMonth'] || changes['toMonth']) {
      this.getTotalSpendByVendors();
    }
  }

  getTotalSpendByVendors(): void {
    const requestData = {
      fromMonth: this.fromMonth,
      toMonth: this.toMonth
    };

    this._dashboardService.getTotalSpendByVendors(this.entityId, requestData).subscribe((res: any) => {
      if (res.data && res.data.length > 0) {
        const labels = res.data.map((item: any) => item.vendor_name);
        const dataValues = res.data.map((item: any) => parseFloat(item.total_amount_paid));

        this.createSupplierChart(labels, dataValues);
      } else {

        this.createSupplierChart([], []);
      }
    });
  }

  createSupplierChart(labels: string[], dataValues: number[]): void {
    if (this.supplierChart) {
      this.supplierChart.destroy();
    }

    this.supplierChart = new Chart('supplierChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Spend by Supplier',
          data: dataValues,
          backgroundColor: '#1abc9c',
          borderColor: '#16a085',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
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
              text: 'Amount (in ₹)',
            }
          },
          x: {
            title: {
              display: true,
              text: 'Suppliers',
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


