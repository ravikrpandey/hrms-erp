import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { SalesService } from '../../sales.service';

@Component({
  selector: 'app-lead-source-chart',
  templateUrl: './lead-source-chart.component.html',
  styleUrls: ['./lead-source-chart.component.scss']
})
export class LeadSourceChartComponent {
  chart!: Chart<'pie', number[], string>;
  entityId:any;
  leadSourceData:any;

constructor(private dashboardService : SalesService){}

  ngOnInit(): void {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.getLeadSourceAnalysis();
  }
  getLeadSourceAnalysis(): void {
    this.dashboardService.getLeadSourceAnalysis(this.entityId).subscribe((res: any) => {
      this.leadSourceData = res.data;
      const labels = this.leadSourceData.map((item: any) => item.source_name);
      const data = this.leadSourceData.map((item: any) => parseFloat(item.lead_percentage));

      this.createChart(labels, data);
    });
  }
  createChart(labels: string[], data: number[]): void {
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
            backgroundColor: [
              '#007bff', 
              '#B1EDE8',
              '#FF6978',
              '#ffa726',
              '#9c27b0',
              '#e0e0e0',
              '#795548',
              '#4caf50',
              '#ffeb3b'
            ],
            borderColor: '#ffffff',
            borderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}%`
            }
          }
        }
      }
    });
  }
}
